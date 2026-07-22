import json, re

RAW = "scrape/tools_raw.json"
OUT = "src/lib/yupi-data.ts"

CATS = [
    ("ai-writing", "AI写作", "✍️", "写作、润色、论文、小说"),
    ("ai-image", "AI图像", "🎨", "文生图、设计、头像"),
    ("ai-video", "AI视频创作", "🎬", "生成、剪辑、配音"),
    ("ai-office", "AI办公", "📄", "文档、PPT、表格"),
    ("ai-dev", "AI开发平台", "💻", "编程、Copilot、低代码"),
    ("ai-agent", "AI智能体", "🤖", "Agent、自动化、工作流"),
    ("ai-chat", "AI聊天对话", "💬", "对话、助手、角色"),
    ("ai-audio", "AI音频音乐", "🎵", "音乐、TTS、配音"),
    ("ai-design", "AI商业设计", "🏷️", "海报、logo、电商"),
    ("ai-model", "AI大模型", "🧠", "大模型、API、推理"),
    ("ai-learn", "AI学习平台", "📚", "课程、教程、知识"),
    ("ai-search", "AI搜索引擎", "🔍", "搜索、聚合、研究"),
    ("ai-detect", "AI内容检测", "🔎", "检测、鉴伪、审核"),
    ("ai-app", "AI应用", "🧩", "综合应用、效率"),
]

def js(s):
    if s is None:
        return ""
    s = str(s)
    s = s.replace("\\", "\\\\").replace('"', '\\"').replace("\n", " ").replace("\r", " ")
    return s

tools = json.load(open(RAW, encoding="utf-8"))

lines = []
lines.append("// @ts-nocheck")
lines.append("// 自动生成的大型数据集，跳过 tsc 类型检查以加速构建；运行时由 SWC 正常编译。")
lines.append('import type { Category, Tool } from "./types";')
lines.append("")
lines.append("// 自动采集自「鱼皮 AI 导航」(https://ai.codefather.cn)，生成于 2026-07-22")
lines.append("// 分类（含二级导航）：14 个一级分类")
lines.append("export const yupiCategories: Category[] = [")
for slug, name, icon, desc in CATS:
    lines.append(f'  {{ slug: "{slug}", name: "{name}", icon: "{icon}", desc: "{desc}" }},')
lines.append("];")
lines.append("")
lines.append(f"// 工具：共 {len(tools)} 个，外链暂指向鱼皮详情页（可后续补真实官网地址）")
lines.append("export const yupiTools: Tool[] = [")
for t in tools:
    tid = t["id"]
    name = js(t["name"])
    summary = js(t["summary"])
    logo = js(t["logo"])
    cat = js(t["category"])
    url = f"https://ai.codefather.cn/tool/{tid}"
    lines.append("  {")
    lines.append(f'    id: "{tid}",')
    lines.append(f'    name: "{name}",')
    lines.append(f'    slug: "{tid}",')
    lines.append(f'    summary: "{summary}",')
    lines.append(f'    url: "{url}",')
    lines.append(f'    logo: "{logo}",')
    lines.append(f'    category: "{cat}",')
    lines.append("    tags: [],")
    lines.append("    featured: false,")
    lines.append("    clicks: 0,")
    lines.append("    favorites: 0,")
    lines.append("    rating: 0,")
    lines.append('    createdAt: "2026-07-22",')
    lines.append("  },")
lines.append("];")
lines.append("")

open(OUT, "w", encoding="utf-8").write("\n".join(lines))
print("wrote", OUT, "with", len(tools), "tools and", len(CATS), "categories")
