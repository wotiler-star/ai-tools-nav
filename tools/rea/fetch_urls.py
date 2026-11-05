#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
并发抓取目标站每个工具的「访问官网」外链，补齐 ai_tool.url 字段。

- 数据来源：target_tools.json 里的 id（详情页路由所用，非 sourceId）
- 详情页：https://ai.codefather.cn/tool/{id}
- 外链：页面内 <a ... href="https://...">访问官网</a>
- 结果写 target_urls.json：{ 工具名: 外链 }
- 已抓取过的会跳过（支持断点续跑）；失败的重试；限流时退避。
"""
import os, re, json, time, urllib.request, urllib.error
from concurrent.futures import ThreadPoolExecutor, as_completed

HERE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(HERE, "target_tools.json")
OUT = os.path.join(HERE, "target_urls.json")
BASE = "https://ai.codefather.cn/tool/"

RE_OFFICIAL = re.compile(r'href="([^"]+)"[^>]*>访问官网</a>')
HEADERS = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"}


def load_existing():
    if os.path.exists(OUT):
        try:
            return json.load(open(OUT, encoding="utf-8"))
        except Exception:
            return {}
    return {}


def fetch_one(item):
    name, sid = item
    if not sid:
        return name, ""
    url = BASE + sid
    for attempt in range(3):
        try:
            req = urllib.request.Request(url, headers=HEADERS)
            with urllib.request.urlopen(req, timeout=20) as r:
                html = r.read().decode("utf-8", "ignore")
            m = RE_OFFICIAL.search(html)
            if m:
                return name, m.group(1)
            return name, ""  # 页面正常但无外链
        except Exception as e:
            if attempt < 2:
                time.sleep(1.5 * (attempt + 1))
                continue
            return name, ""
    return name, ""


def main():
    tools = json.load(open(SRC, encoding="utf-8"))
    existing = load_existing()
    todo = [(t["name"], t["id"]) for t in tools if t["name"] not in existing]
    print("总数:", len(tools), "已抓:", len(existing), "待抓:", len(todo), flush=True)

    results = dict(existing)
    done = 0
    with ThreadPoolExecutor(max_workers=8) as ex:
        futs = [ex.submit(fetch_one, it) for it in todo]
        for f in as_completed(futs):
            name, url = f.result()
            results[name] = url
            done += 1
            if done % 50 == 0:
                json.dump(results, open(OUT, "w", encoding="utf-8"), ensure_ascii=False, indent=2)
                print(f"  进度 {done}/{len(todo)}", flush=True)

    json.dump(results, open(OUT, "w", encoding="utf-8"), ensure_ascii=False, indent=2)
    withurl = sum(1 for v in results.values() if v)
    print(f"完成：共 {len(results)} 条，其中含外链 {withurl} 条，无外链 {len(results)-withurl} 条")
    print("写出:", OUT)


if __name__ == "__main__":
    main()
