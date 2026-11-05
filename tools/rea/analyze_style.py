#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
分析目标站 /tool 长描述风格，并对比仓库种子描述：
1. 抽取目标站 12 条样例 desc（看风格/长度）
2. 找出种子与目标站重叠的 name（精确匹配），输出目标站真实长描述
3. 列出种子独有工具（name + 当前短描述），供改写成 /tool 长描述风格
"""
import re
import os
import json

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.dirname(os.path.dirname(HERE))
TARGET = os.path.join(HERE, "target_tools.json")
SCHEMA = os.path.join(REPO, "backend", "sql", "schema.sql")

# 解析 schema.sql 中的 ai_tool 行（排除 ai_prompt / ai_post）
def parse_seed_tools(path):
    txt = open(path, encoding="utf-8").read()
    # 切到 ai_prompt 之前的部分（ai_post / ai_prompt 在 seed 之后）
    cut = txt.find("-- ============ 社区提示词 ai_prompt")
    body = txt[:cut] if cut > 0 else txt
    # 匹配 ('name', ... 'desc', ...) 形式的行；允许 name 出现在第 1 或第 2 个位置
    rows = []
    # 用宽松正则抓每行第一个字符串字面量作为 name，第四个作为 desc（按列顺序对齐）
    # 列顺序有两套：
    #   A) (name, logo, description, url, category_id, tags, heat, is_recommended, is_hot)
    #   B) (name, url, description, tags, category_id, heat, is_recommended, is_hot)
    pat = re.compile(r"^\(\s*'([^']*)'")
    for line in body.splitlines():
        line = line.strip()
        if not line.startswith("("):
            continue
        m = pat.match(line)
        if not m:
            continue
        # 提取所有单引号字符串
        strs = re.findall(r"'([^']*)'", line)
        if len(strs) < 2:
            continue
        rows.append((strs[0], line))
    return rows

def main():
    tlist = json.load(open(TARGET, encoding="utf-8"))
    tmap = {t["name"]: t for t in tlist}
    tdescs = [t["desc"] for t in tlist if t.get("desc")]

    # 风格统计
    import statistics
    lens = [len(d) for d in tdescs]
    print("=== 目标站 /tool 描述风格 ===")
    print(f"有描述工具数: {len(tdescs)}")
    print(f"字符长度 min/mean/median/max: {min(lens)}/{statistics.mean(lens):.1f}/{statistics.median(lens)}/{max(lens)}")
    # 含逗号比例（中文逗号）
    comma = sum(1 for d in tdescs if "，" in d)
    print(f"含中文逗号比例: {comma/len(tdescs)*100:.0f}%")
    # 长度分桶直方图
    buckets = [(0,14),(15,24),(25,34),(35,44),(45,59),(60,79),(80,999)]
    print("长度分桶: " + " | ".join(f"{lo}-{hi}:{sum(1 for x in lens if lo<=x<=hi)}" for lo,hi in buckets))
    print("\n--- 12 条随机样例 ---")
    import random
    random.seed(7)
    for d in random.sample(tdescs, 12):
        print(f"  [{len(d)}] {d}")

    seed = parse_seed_tools(SCHEMA)
    print(f"\n=== 仓库种子 ai_tool 行数: {len(seed)} ===")
    # 重叠
    overlaps = [(n, tmap[n]["desc"]) for n, _ in seed if n in tmap]
    print(f"与目标站精确重叠 name 数: {len(overlaps)}")
    print("\n--- 重叠工具：目标站真实长描述（直接复用）---")
    for n, d in overlaps:
        print(f"  {n} | [{len(d)}] {d}")

    # 种子独有
    only = [(n, ln) for n, ln in seed if n not in tmap]
    print(f"\n=== 种子独有（需改写描述）: {len(only)} ===")
    for n, ln in only:
        # 当前短描述是第几个字符串？取包含中文且非 url 的那个
        strs = re.findall(r"'([^']*)'", ln)
        print(f"  {n} || {ln}")

if __name__ == "__main__":
    main()
