#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Generate SQL to align tool tags with category sub-tags + populate empty categories.
Reads staging/tools_dump.tsv (id, category_id, name, description, tags) and emits
staging/enrich_tags.sql: UPDATEs for existing tools in sub-tagged cats + INSERTs for new tools.
"""
import csv, re, sys

TSV = "staging/tools_dump.tsv"
OUT = "staging/enrich_tags.sql"

# curated sub-tags per category (from schema.sql / target_nav_spec)
SUBTAGS = {
    1: ["AI写作工具","AI小红书文案","AI小说","AI论文写作","AI总结摘要","AI提示词","AIGC检测","AI公文","AI标书写作","AI论文查重","AI阅读","降AIGC率"],
    2: ["常用AI图像工具","AI图片优化修复","AI图片背景移除","AI图片无损放大","AI 3D模型生成","AI商品图生成","AI图片插画生成","AI图片物体抹除"],
    4: ["AI PPT","AI文档工具","AI思维导图","AI表格数据处理","AI语言翻译","AI会议工具","AI招聘求职","AI效率提升","AI法律助手"],
    5: ["AI编程工具","AI开源项目","AI开发框架","AI开放平台","AI训练模型","AI-SQL数据库","AI低(无)代码编程","AI国际导航","AI开发课堂"],
    10:["AI大语言模型","AI视觉大模型","AI视频大模型","AI语音大模型","AI多模态大模型","AI大模型评测","AI海外大模型","AI行业大模型"],
}
# keyword -> subtag for matching (Chinese exact / ascii case-insensitive)
KEYWORDS = {
    1: [("AI小红书文案",["小红书"]),("AI小说",["小说"]),("AI论文写作",["论文"]),("AI总结摘要",["总结","摘要"]),("AI提示词",["提示词"]),
        ("AIGC检测",["AIGC检测","检测"]),("AI公文",["公文"]),("AI标书写作",["标书"]),("AI论文查重",["查重"]),("AI阅读",["阅读"]),("降AIGC率",["降AIGC","AIGC率"])],
    2: [("AI图片优化修复",["修复","画质","优化"]),("AI图片背景移除",["背景","抠图","去背"]),("AI图片无损放大",["放大","超分","高清","无损"]),
        ("AI 3D模型生成",["3D"]),("AI商品图生成",["商品"]),("AI图片插画生成",["插画"]),("AI图片物体抹除",["抹除","消除","擦除"])],
    4: [("AI PPT",["ppt","演示"]),("AI文档工具",["文档"]),("AI思维导图",["思维导图","脑图"]),("AI表格数据处理",["表格","excel","数据"]),
        ("AI语言翻译",["翻译"]),("AI会议工具",["会议"]),("AI招聘求职",["招聘","求职","简历"]),("AI法律助手",["法律"])],
    5: [("AI编程工具",["编程","代码","code","ide","补全","编辑器","agent","工程师","问答"]),("AI开源项目",["开源"]),("AI开发框架",["框架"]),
        ("AI开放平台",["平台","bot","前端","ui","云端","环境","全栈","浏览器"]),("AI训练模型",["训练","模型"]),("AI-SQL数据库",["sql","数据库"]),
        ("AI低(无)代码编程",["低代码","无代码"]),("AI国际导航",["导航"]),("AI开发课堂",["课程","教程","课堂"])],
    10:[("AI大语言模型",["语言模型","llm","大模型"]),("AI视觉大模型",["视觉"]),("AI视频大模型",["视频"]),("AI语音大模型",["语音"]),
        ("AI多模态大模型",["多模态"]),("AI大模型评测",["评测"]),("AI海外大模型",["海外","gpt","claude","openai","google","meta","anthropic","gemini","llama"]),("AI行业大模型",["行业"])],
}
GENERIC = {1:"AI写作工具",2:"常用AI图像工具",4:"AI效率提升",5:"AI编程工具",10:"AI大语言模型"}

# new curated tools: (name, description, url, provided_tags) -> tags enriched via KEYWORDS if cat has subtags
NEW_TOOLS = {
    6: [ # AI智能体 (no subtags)
        ("Coze","字节跳动 AI Bot 开发与智能体搭建平台","https://www.coze.cn","Bot,智能体,工作流"),
        ("Dify","开源 LLM 应用开发平台，可视化编排 Agent","https://dify.ai","开源,Agent,LLM"),
        ("AutoGPT","最早出圈的自主 AI Agent 框架","https://github.com/Significant-Gravitas/AutoGPT","开源,自动,Agent"),
        ("MetaGPT","多智能体软件公司模拟框架","https://github.com/geekan/MetaGPT","开源,多智能体,Meta"),
        ("Flowise","拖拽式 LLM 工作流与 Agent 搭建","https://flowiseai.com","拖拽,工作流,低代码"),
        ("n8n","开源工作流自动化，可接 LLM","https://n8n.io","开源,自动化,工作流"),
        ("百度文心智能体","百度灵境智能体平台","https://agents.baidu.com","百度,智能体"),
        ("阿里云百炼","阿里大模型应用与 Agent 搭建平台","https://bailian.aliyun.com","阿里,平台,Agent"),
        ("腾讯元器","腾讯智能体开放平台","https://yuanqi.tencent.com","腾讯,智能体,平台"),
        ("智谱 GLM-Agent","智谱 AI 智能体开发","https://open.bigmodel.cn","智谱,Agent"),
    ],
    10: [ # AI大模型 (has subtags)
        ("GPT-4o","OpenAI 多模态大语言模型","https://openai.com","多模态,海外,OpenAI"),
        ("Claude 3.5","Anthropic 强推理大语言模型","https://claude.ai","海外,Anthropic,推理"),
        ("Gemini 1.5","Google 超长上下文多模态模型","https://gemini.google.com","海外,Google,多模态"),
        ("Llama 3","Meta 开源大语言模型","https://ai.meta.com","开源,海外,Meta"),
        ("通义千问","阿里通义系列大语言模型","https://tongyi.aliyun.com","阿里,语言模型"),
        ("文心 ERNIE","百度文心大语言模型","https://yiyan.baidu.com","百度,语言模型"),
        ("智谱 GLM","智谱 AI 开源大语言模型","https://open.bigmodel.cn","智谱,开源,语言模型"),
        ("百川智能","百川开源大语言模型","https://www.baichuan-ai.com","百川,语言模型"),
        ("讯飞星火","科大讯飞认知大模型","https://xinghuo.xfyun.cn","讯飞,语言模型"),
        ("DeepSeek","深度求索开源大模型","https://www.deepseek.com","开源,语言模型"),
        ("MiniMax","Minimax 开源大模型与 API","https://www.minimax.chat","语言模型,API"),
        ("Kimi","月之暗面长文本大模型","https://kimi.moonshot.cn","长文本,语言模型"),
    ],
    13: [ # AI内容检测 (no subtags)
        ("GPTZero","主流 AI 写作检测工具","https://gptzero.me","AI检测,写作检测"),
        ("ZeroGPT","免费 AI 文本检测器","https://zerogpt.com","AI检测,免费"),
        ("朱雀 AI 检测","腾讯朱雀 AI 内容鉴别","https://zhuque.baidu.com","AI检测,腾讯"),
        ("Originality.ai","英文 AI 内容原创度检测","https://originality.ai","AI检测,原创度"),
        ("Writer AI Detection","Writer 内置 AI 检测","https://writer.com/ai-content-detector","AI检测,英文"),
        ("Turnitin AI","学术查重 AI 检测","https://www.turnitin.com","AI检测,学术"),
        ("知网 AI 检测","知网 AI 生成内容检测","https://cx.cnki.net","AI检测,学术,知网"),
    ],
    14: [ # AI应用 (no subtags)
        ("剪映","字节 AI 视频剪辑与成片","https://lv.ulikecam.com","视频,剪辑,字节"),
        ("美图秀秀","AI 人像美容与图片处理","https://xiuxiu.meitu.com","图片,人像,美颜"),
        ("腾讯智影","腾讯 AI 智能视频创作","https://zenvideo.qq.com","视频,腾讯,创作"),
        ("度加创作","百度 AI 视频一键成片","https://aigc.baidu.com","视频,百度,创作"),
        ("万兴喵影","万兴 AI 视频剪辑","https://miaowara.com","视频,剪辑"),
        ("讯飞听见","讯飞 AI 语音转写与字幕","https://www.iflyrec.com","语音,转写,讯飞"),
        ("通义听悟","阿里 AI 会议转写总结","https://tingwu.aliyun.com","会议,转写,阿里"),
        ("天工 AI","昆仑万维 AI 助手应用","https://tiangong.kunlun.com","助手,搜索"),
        ("360 智脑","360 大模型 AI 助手","https://ai.360.com","助手,360"),
    ],
    2: [ # image-editing additions to populate cat2 specific chips
        ("remove.bg","一键 AI 抠图去背景","https://www.remove.bg","背景,抠图,去背"),
        ("佐糖 AI","AI 图片一键消除与修复","https://picwish.cn","抹除,修复,消除"),
        ("稿定设计","AI 商品图与模板设计","https://www.gaoding.com","商品,模板,设计"),
        ("奈斯 AI","AI 图片无损放大与高清","https://nails.kuaishou.com","放大,高清,无损"),
        ("水印云","AI 图片水印添加与去除","https://www.shuiyinyun.com","水印,抹除"),
    ],
}

def match_subtags(cat, text):
    text = text.lower()
    matched = []
    for subtag, kws in KEYWORDS.get(cat, []):
        if any(kw.lower() in text for kw in kws):
            matched.append(subtag)
    if not matched and cat in GENERIC:
        matched = [GENERIC[cat]]
    return matched

def uniq(seq):
    seen, out = set(), []
    for x in seq:
        if x and x not in seen:
            seen.add(x); out.append(x)
    return out

def esc(s):
    return s.replace("'", "''")

sql = ["USE ai_nav;", "SET NAMES utf8mb4;", ""]
updates = 0

# 1) enrich existing tools in sub-tagged cats
with open(TSV, encoding="utf-8") as f:
    rows = list(csv.reader(f, delimiter="\t"))
header = rows[0]
data = rows[1:]
for r in data:
    if len(r) < 5:
        continue
    tid, cat, name, desc, tags = r[0], int(r[1]), r[2], r[3], r[4]
    if cat not in KEYWORDS:
        continue
    existing = [t for t in tags.split(",") if t] if tags else []
    new = uniq(existing + match_subtags(cat, name + " " + desc + " " + tags))
    if new != existing:
        sql.append(f"UPDATE ai_tool SET tags='{esc(','.join(new))}' WHERE id={tid};")
        updates += 1

# 2) insert new tools
for cat, tools in NEW_TOOLS.items():
    for (name, desc, url, ptags) in tools:
        existing = [t for t in ptags.split(",") if t]
        if cat in KEYWORDS:
            new = uniq(existing + match_subtags(cat, name + " " + desc + " " + ptags))
        else:
            new = uniq(existing)
        tagstr = esc(",".join(new))
        sql.append(
            f"INSERT INTO ai_tool (name, logo, description, url, category_id, tags, heat, is_recommended, is_hot) "
            f"VALUES ('{esc(name)}','', '{esc(desc)}', '{esc(url)}', {cat}, '{tagstr}', 7000, 1, 0);"
        )

sql.append("")
sql.append("-- verify")
sql.append("SELECT c.id, c.name, (SELECT COUNT(*) FROM ai_tool t WHERE t.category_id=c.id) AS tools FROM category c ORDER BY c.id;")

with open(OUT, "w", encoding="utf-8") as f:
    f.write("\n".join(sql) + "\n")

print(f"UPDATEs generated: {updates}")
print(f"INSERTs generated: {sum(len(v) for v in NEW_TOOLS.values())}")
print(f"SQL written to {OUT}")
