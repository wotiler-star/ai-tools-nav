#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
采集目标站 ai.codefather.cn（鱼皮AI导航）「工具板块」全部工具，输出为可入库 JSON。

- 数据来源：/tool 页面 RSC 内嵌 JSON（已 curl 存为 F:/workbuddyxingqiuge/target_tool.html）
- 做法：按 RSC 转义锚点 \"id\":\" 切分（id 是详情页路由所用，非 sourceId）；对每个窗口先反转义成普通
  引号，再用普通正则抽字段
- 每条工具字段：id(详情路由) / name / desc / tags / cover(图片) / sourceId / heat(viewNum)
- 输出：tools/rea/target_tools.json（按 name 去重）
"""
import re
import os
import json
from collections import Counter

HERE = os.path.dirname(os.path.abspath(__file__))
HTML = os.path.join(os.path.dirname(HERE), "target_tool.html")
if not os.path.exists(HTML):
    HTML = os.path.join("F:/workbuddyxingqiuge", "target_tool.html")
OUT = os.path.join(HERE, "target_tools.json")

# 切分锚点用 RSC 转义形式（id 在对象最前，且是详情页路由 id）
SPLIT = re.compile(r'\\"id\\":\\"')
# 以下均在「已反转义窗口」上用普通引号匹配
RE_TITLE = re.compile(r'"title":"((?:[^"\\]|\\.)*)"')
RE_DESC = re.compile(r'"description":"((?:[^"\\]|\\.)*)"')
RE_CAT = re.compile(r'"category":"([^"]*)"')
RE_TAGS = re.compile(r'"tags":\[(.*?)\]')
RE_COVER = re.compile(r'"cover":"([^"]*)"')
RE_SOURCE = re.compile(r'"sourceId":"([0-9]+)"')
RE_VIEW = re.compile(r'"viewNum":([0-9]+)')


def unesc(s: str) -> str:
    return s.replace('\\\\', '\\').replace('\\"', '"').replace("\\'", "'").replace('\\/', '/')


def main():
    html = open(HTML, encoding="utf-8", errors="ignore").read()
    print("[1] html len =", len(html), flush=True)

    parts = SPLIT.split(html)
    print("[2] split parts =", len(parts), flush=True)

    tools = []
    for seg in parts[1:]:
        # seg 以 id 值开头，首个 \" 结束 id
        end = seg.find('\\"')
        if end < 0:
            continue
        tid = unesc(seg[:end])
        window = unesc(seg[:1800])  # 反转义后普通引号窗口
        m_title = RE_TITLE.search(window)
        if not m_title:
            continue
        name = m_title.group(1)
        m_cat = RE_CAT.search(window)
        if not m_cat or m_cat.group(1) != "tool":
            continue
        m_desc = RE_DESC.search(window)
        m_tags = RE_TAGS.search(window)
        m_cover = RE_COVER.search(window)
        m_src = RE_SOURCE.search(window)
        m_view = RE_VIEW.search(window)
        tags_raw = m_tags.group(1) if m_tags else ""
        tags = [t.strip().strip('"').strip("'") for t in tags_raw.split(",") if t.strip()]
        tools.append({
            "id": tid,
            "name": name,
            "desc": m_desc.group(1) if m_desc else "",
            "tags": tags,
            "category": tags[0] if tags else "",
            "cover": m_cover.group(1) if m_cover else "",
            "sourceId": m_src.group(1) if m_src else "",
            "heat": int(m_view.group(1)) if m_view else 0,
        })

    seen = set()
    uniq = []
    for t in tools:
        if t["name"] and t["name"] not in seen:
            seen.add(t["name"])
            uniq.append(t)

    print("[3] raw =", len(tools), " 去重 =", len(uniq), flush=True)
    print("有 cover:", sum(1 for t in uniq if t["cover"]),
          " 有 desc:", sum(1 for t in uniq if t["desc"]),
          " 有 id:", sum(1 for t in uniq if t["id"]), flush=True)

    print("\n样例(前 12):", flush=True)
    for t in uniq[:12]:
        print(f"  {t['name']} | id={t['id']} | {t['desc'][:16]} | tags={t['tags']} | {'img' if t['cover'] else '-'}", flush=True)

    json.dump(uniq, open(OUT, "w", encoding="utf-8"), ensure_ascii=False, indent=2)
    print("\n已写出:", OUT, "共", len(uniq), "条", flush=True)


if __name__ == "__main__":
    main()
