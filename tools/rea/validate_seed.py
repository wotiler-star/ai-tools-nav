#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Validate rewritten schema.sql vs backup:
- 每个 ai_tool 行的 url/tags/heat/rec/hot/logo 必须与备份完全一致（仅 desc/catid 变）
- 每个 category_id ∈ 1..14
- 描述长度分布
"""
import os, re

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.dirname(os.path.dirname(HERE))
SCHEMA = os.path.join(REPO, "backend", "sql", "schema.sql")
BAK = os.path.join(REPO, "backend", "sql", "schema.sql.bak")

QS = re.compile(r"'([^']*)'")

def parse(path):
    txt = open(path, encoding="utf-8").read()
    cut = txt.find("-- ============ 社区提示词 ai_prompt")
    body = txt[:cut] if cut > 0 else txt
    rows = {}
    for line in body.splitlines():
        line = line.strip()
        if not line.startswith("(") or "MD5" in line or "管理员" in line:
            continue
        strs = QS.findall(line)
        if len(strs) < 4:
            continue
        name = strs[0]
        if name == "admin":
            continue
        url = next((s for s in strs if "://" in s), "")
        desc = strs[2]
        tags = ""
        for s in strs:
            if s and s != name and s != desc and s != url:
                tags = s
                break
        rest = QS.sub("", line)
        ints = re.findall(r"\d+", rest)
        if not ints:
            continue
        cat = int(ints[0]); heat = ints[1]; rec = ints[2]; hot = ints[3]
        logo = strs[1] if (url and strs[1] != url) else ""
        rows[name] = dict(url=url, desc=desc, tags=tags, cat=cat,
                          heat=heat, rec=rec, hot=hot, logo=logo)
    return rows

new = parse(SCHEMA)
bak = parse(BAK)

print(f"新文件 ai_tool 行数: {len(new)}   备份: {len(bak)}")
assert len(new) == len(bak), "行数不一致！"
assert set(new) == set(bak), f"name 集合不一致: {set(new)^set(bak)}"

problems = []
lens = []
for name in new:
    a, b = new[name], bak[name]
    for f in ("url", "tags", "heat", "rec", "hot", "logo"):
        if a[f] != b[f]:
            problems.append(f"{name}: 字段 {f} 变化 {b[f]!r} -> {a[f]!r}")
    if not (1 <= a["cat"] <= 14):
        problems.append(f"{name}: category_id 越界 {a['cat']}")
    lens.append(len(a["desc"]))

print(f"字段保全问题: {len(problems)}")
for p in problems[:50]:
    print("  !", p)

# 分类分布
from collections import Counter
dist = Counter(new[n]["cat"] for n in new)
print("\ncategory_id 分布 (1-14):")
for cid in range(1, 15):
    print(f"  {cid}: {dist.get(cid,0)}", end="")
print()

lens_sorted = sorted(lens)
print(f"\n描述长度: min={min(lens)} mean={sum(lens)/len(lens):.1f} median={lens_sorted[len(lens)//2]} max={max(lens)}")
print(f"描述<15字: {sum(1 for x in lens if x<15)}   >=15字: {sum(1 for x in lens if x>=15)}   >=25字: {sum(1 for x in lens if x>=25)}")

# 描述变短的检测（相对备份）
shorter = [(n, len(bak[n]['desc']), len(new[n]['desc'])) for n in new if len(new[n]['desc']) < len(bak[n]['desc'])]
print(f"\n相对备份描述变短的: {len(shorter)}")
for n, o, nw in shorter:
    print(f"  {n}: {o} -> {nw}  ({new[n]['desc']})")

print("\n=== 校验结论 ===")
print("PASS" if not problems and all(1<=new[n]['cat']<=14 for n in new) else "FAIL")
