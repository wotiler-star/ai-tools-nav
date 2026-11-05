#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Dump seed ai_tool rows (exclude ai_prompt/ai_post) → tools/rea/seed_rows.txt
Robust parse: category_id is an UNQUOTED int in SQL. After removing quoted
strings, the remaining ints are [catid, heat, rec, hot]; desc is the 3rd quoted
string; url is the quoted string containing '://'; tags is the other quoted one.
"""
import os, re, json

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.dirname(os.path.dirname(HERE))
TARGET = os.path.join(HERE, "target_tools.json")
SCHEMA = os.path.join(REPO, "backend", "sql", "schema.sql")
OUT = os.path.join(HERE, "seed_rows.txt")

tlist = json.load(open(TARGET, encoding="utf-8"))
tmap = {t["name"]: t for t in tlist}

txt = open(SCHEMA, encoding="utf-8").read()
cut = txt.find("-- ============ 社区提示词 ai_prompt")
body = txt[:cut] if cut > 0 else txt

QS = re.compile(r"'([^']*)'")

def parse_line(line):
    line = line.strip()
    if not line.startswith("("):
        return None
    if "MD5" in line or "管理员" in line:
        return None
    strs = QS.findall(line)
    if len(strs) < 4:
        return None
    name = strs[0]
    if name == "admin":
        return None
    # url = quoted string containing ://
    url = next((s for s in strs if "://" in s), "")
    desc = strs[2]
    # tags = quoted string that is not name/desc/url and non-empty
    tags = ""
    for s in strs:
        if s and s != name and s != desc and s != url:
            tags = s
            break
    # catid = first unquoted int
    rest = QS.sub("", line)
    ints = re.findall(r"\d+", rest)
    catid = ints[0] if ints else ""
    return dict(name=name, desc=desc, url=url, tags=tags, catid=catid)

rows = []
for line in body.splitlines():
    r = parse_line(line)
    if r:
        rows.append(r)

out = []
for r in rows:
    ov = r["name"] in tmap
    flag = "OVERLAP" if ov else "SEEDONLY"
    out.append(f"{flag}\t{r['name']}\tcat={r['catid']}\t| {r['desc']}\t| url={r['url']}\t| tags={r['tags']}")

with open(OUT, "w", encoding="utf-8") as f:
    f.write(f"TOTAL ai_tool rows: {len(rows)}\n")
    f.write("\n".join(out) + "\n")

n_overlap = sum(1 for r in rows if r["name"] in tmap)
print(f"TOTAL={len(rows)}  OVERLAP={n_overlap}  SEEDONLY={len(rows)-n_overlap}")
print("written:", OUT)
print("\n--- SEEDONLY names (need authored /tool-style desc) ---")
print(", ".join(r["name"] for r in rows if r["name"] not in tmap))
