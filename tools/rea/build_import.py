#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
把 collect_target_tools.py 产出的 target_tools.json（410 条，来自目标站工具板块）
转换为对齐 toolly ai_tool 表结构的入库 SQL。

映射要点：
- category_id：用 toolly 的 14 大类（名称 + 二级子标签）做反向索引；
  每条工具的所有 tags 依次匹配：① 精确命中分类名 → 该 id；② 命中某分类子标签 → 该 id；
  ③ 同义词表兜底；④ 仍无命中 → 默认 14（AI应用）。
- logo = 目标站 cover 图；url = 目标站官网（由 fetch_urls.py 补，缺省空串）；
  tags = 原 tags 逗号拼接；heat = viewNum；is_recommended/is_hot 默认 0。
- 输出 backend/sql/migration_import_target_tools.sql（按 name 去重删除后插入，幂等）。

生成前先 dry-run 打印分类命中分布，便于发现未覆盖项。
"""
import os, json, sys

HERE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(HERE, "target_tools.json")
URLS = os.path.join(HERE, "target_urls.json")
OUT = os.path.join(HERE, "..", "..", "backend", "sql", "migration_import_target_tools.sql")

# ---- toolly 14 大类（与 schema.sql category 表一致）----
CAT_NAME = {
    1: "AI写作", 2: "AI图像", 3: "AI视频创作", 4: "AI办公", 5: "AI开发平台",
    6: "AI智能体", 7: "AI聊天对话", 8: "AI音频音乐", 9: "AI商业设计", 10: "AI大模型",
    11: "AI学习平台", 12: "AI搜索引擎", 13: "AI内容检测", 14: "AI应用",
}
# 二级子标签 → 分类 id
SUB_TAG = {
    "AI写作工具": 1, "AI小红书文案": 1, "AI小说": 1, "AI论文写作": 1, "AI总结摘要": 1,
    "AI提示词": 1, "AIGC检测": 1, "AI公文": 1, "AI标书写作": 1, "AI论文查重": 1,
    "AI阅读": 1, "降AIGC率": 1, "降AI/AIGC率": 1,
    "常用AI图像工具": 2, "AI图片优化修复": 2, "AI图片背景移除": 2, "AI图片无损放大": 2,
    "AI 3D模型生成": 2, "AI商品图生成": 2, "AI图片插画生成": 2, "AI图片物体抹除": 2,
    "AI PPT": 4, "AI文档工具": 4, "AI思维导图": 4, "AI表格数据处理": 4, "AI语言翻译": 4,
    "AI会议工具": 4, "AI招聘求职": 4, "AI效率提升": 4, "AI法律助手": 4,
    "AI编程工具": 5, "AI开源项目": 5, "AI开发框架": 5, "AI开放平台": 5, "AI训练模型": 5,
    "AI-SQL数据库": 5, "AI低(无)代码编程": 5, "AI国际导航": 5, "AI开发课堂": 5,
    "AI大语言模型": 10, "AI视觉大模型": 10, "AI视频大模型": 10, "AI语音大模型": 10,
    "AI多模态大模型": 10, "AI大模型评测": 10, "AI海外大模型": 10, "AI行业大模型": 10,
}
# 同义词兜底（仅用于「非分类名」的别名；分类名本身由 CAT_NAME 精确匹配，不要放这里，
# 否则会抢先于其他更具体的标签命中，例如 'AI应用' 排在 'AI智能体' 前面导致错分到 14）
SYN = {
    "AI聊天机器人": 7, "聊天机器人": 7, "AI对话": 7, "对话": 7,
    "内容检测": 13, "AI检测": 13,
}


def resolve_cat(tags):
    # 优先级：① 二级子标签（最具体）② 同义词 ③ 具体分类名（排除 AI应用 兜底）④ AI应用 ⑤ 默认 14
    for tg in tags:
        if tg in SUB_TAG:
            return SUB_TAG[tg]
    for tg in tags:
        if tg in SYN:
            return SYN[tg]
    for tg in tags:
        if tg in CAT_NAME.values() and tg != CAT_NAME[14]:
            return list(CAT_NAME.keys())[list(CAT_NAME.values()).index(tg)]
    for tg in tags:
        if tg == CAT_NAME[14]:
            return 14
    return 14  # 默认 AI应用


def sql_escape(s):
    return s.replace("\\", "\\\\").replace("'", "\\'")


def main():
    tools = json.load(open(SRC, encoding="utf-8"))
    urls = {}
    if os.path.exists(URLS):
        urls = json.load(open(URLS, encoding="utf-8"))

    # dry-run 分类分布
    from collections import Counter
    dist = Counter()
    fallback = []
    rows = []
    for t in tools:
        cid = resolve_cat(t["tags"])
        dist[cid] += 1
        if cid == 14 and t["tags"]:
            fallback.append((t["name"], t["tags"]))
        url = urls.get(t["name"], "")
        rows.append({
            "name": t["name"],
            "logo": t["cover"],
            "desc": t["desc"],
            "url": url,
            "cid": cid,
            "tags": ",".join(t["tags"]),
            "heat": t["heat"],
        })

    print("=== 分类命中分布（category_id: 数量）===")
    for cid in sorted(dist):
        print(f"  {cid} {CAT_NAME[cid]}: {dist[cid]}")
    print("总计:", sum(dist.values()))
    print("\n落入默认(14)且有标签的工具:", len(fallback))
    for n, tg in fallback[:40]:
        print(f"   {n} | {tg}")

    if "--write" not in sys.argv:
        print("\n[dry-run] 加 --write 生成 SQL")
        return

    lines = []
    lines.append("-- 采集自目标站 ai.codefather.cn 工具板块（%d 条），对齐 toolly ai_tool 表" % len(rows))
    lines.append("-- 幂等：先按 name 删除重复项（采集覆盖种子），再插入")
    lines.append("DELETE FROM ai_tool WHERE name IN (")
    names = ", ".join("'%s'" % sql_escape(r["name"]) for r in rows)
    lines.append(names + ");")
    lines.append("")
    lines.append("INSERT INTO ai_tool (name, logo, description, url, category_id, tags, heat, is_recommended, is_hot) VALUES")
    val_lines = []
    for r in rows:
        val = "('%s', '%s', '%s', '%s', %d, '%s', %d, 0, 0)" % (
            sql_escape(r["name"]), sql_escape(r["logo"]), sql_escape(r["desc"]),
            sql_escape(r["url"]), r["cid"], sql_escape(r["tags"]), r["heat"])
        val_lines.append(val)
    lines.append(",\n".join(val_lines) + ";")
    open(OUT, "w", encoding="utf-8").write("\n".join(lines))
    print("\n已写出:", os.path.normpath(OUT), "共", len(rows), "条")


if __name__ == "__main__":
    main()
