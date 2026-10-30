#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
P2 内容改写：把 ai_tool 描述改为「厂商/能力 + 具体产品事实」的目标站风格。

- 入参：backend/sql/schema.sql（ai_tool 种子）
- 产出：
  1. 就地改写 schema.sql 里每个工具的描述（按 name 精确定位，兼容两种 INSERT 列序）
  2. 生成 backend/sql/migration_fix_tool_descriptions.sql
     （UPDATE ai_tool SET description='...' WHERE name='...'; 供线上 MySQL 执行）

描述均不含英文单引号，SQL 侧再做 '' 转义以防万一。
"""
import re
import os

REPO = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
SCHEMA = os.path.join(REPO, "backend", "sql", "schema.sql")
MIGRATION = os.path.join(REPO, "backend", "sql", "migration_fix_tool_descriptions.sql")

# name -> 目标站风格的新描述（厂商/能力 + 具体产品事实，简洁、无同分类模板后缀）
TOOLS = {
    # ===== 示例工具 =====
    "ChatGPT": "OpenAI 出品的通用对话 AI，全球用户量最大的聊天模型",
    "Claude": "Anthropic 出品，以长文本理解与严谨推理见长的对话模型",
    "Midjourney": "Midjourney 出品，主打高质感 AI 绘画与艺术创作",
    "Stable Diffusion": "Stability AI 开源扩散模型，可本地部署与微调",
    "GitHub Copilot": "GitHub 与 OpenAI 联合推出的 IDE 代码补全",
    "Cursor": "AI 原生代码编辑器，支持对话式重构与多文件编辑",
    "Perplexity": "AI 搜索问答引擎，回答附带来源引用",
    "Suno": "Suno 出品，输入想法即可生成完整歌曲与人声",
    "Runway": "Runway 出品，文生视频与视频后期 AI 工具",
    "Coze": "字节推出的 AI Bot 可视化搭建与分发平台",
    # ===== 分类1 对话 =====
    "Kimi": "月之暗面出品，支持超长上下文的对话助手",
    "文心一言": "百度文心大模型，中文理解与多模态生成",
    "通义千问": "阿里通义大模型，具备多模态与工具调用能力",
    "豆包": "字节跳动 AI 助手，免费且接入抖音生态",
    "智谱清言": "清华智谱 GLM 大模型，支持 Agent 与代码",
    "讯飞星火": "科大讯飞认知大模型，强于语音与行业应用",
    "元宝": "腾讯混元大模型 AI 助手，深度整合微信生态",
    "Gemini": "Google 多模态对话模型，原生接入搜索",
    "Copilot": "微软 Windows 内置 AI 助手，跨应用协作",
    "DeepSeek": "深度求索开源大模型，推理与代码能力突出",
    "百川智能": "百川开源大模型，主打中文与行业方案",
    "Poe": "Quora 推出的多模型聚合对话平台",
    "Character.AI": "角色扮演 AI 聊天，可创建专属虚拟角色",
    "Grok": "xAI 推出的实时联网对话，对接 X 平台",
    # ===== 分类2 绘画 =====
    "DALL·E 3": "OpenAI 文生图模型，提示词理解力强",
    "通义万相": "阿里通义文生图，国风与中式审美突出",
    "文心一格": "百度 AI 艺术绘画平台，风格多样",
    "Leonardo.AI": "面向游戏与概念美术的 AI 绘画工具",
    "Adobe Firefly": "Adobe 创意套件中的生成式 AI，商用安全",
    "即梦": "字节剪映旗下 AI 绘画与视频生成",
    "Civitai": "开源绘画模型（LoRA/Checkpoint）分享社区",
    "Ideogram": "擅长图文排版与英文海报的 AI 绘画",
    "NightCafe": "在线 AI 艺术生成，多种风格与赛事",
    "6pen": "国产免费 AI 绘画，支持中文提示词",
    "SeaArt": "二次元风格 AI 绘画，含模型社区",
    "NovelAI": "二次元动漫角色绘制与剧情辅助",
    "Recraft": "矢量图标与品牌素材的 AI 生成",
    "Fooocus": "本地部署的极简绘画工具，开箱即用",
    # ===== 分类3 写作 =====
    "Notion AI": "笔记与文档中的智能写作与总结",
    "Jasper": "面向团队的营销文案批量生成",
    "Copy.ai": "社交媒体与广告文案快速生成",
    "Grammarly": "英文语法校对、润色与语气调整",
    "QuillBot": "改写、摘要与多语种翻译工具",
    "Writesonic": "长文与 SEO 内容批量生成",
    "秘塔写作猫": "中文纠错、润色与改写",
    "火山写作": "字节智能写作助手，提纲与扩写",
    "Sudowrite": "小说创作辅助，角色与情节打磨",
    "Rytr": "低成本多语言营销写作",
    "通义听悟": "会议录音转写、总结与待办提取",
    "彩云小梦": "中文小说 AI 续写与剧情生成",
    "笔灵 AI": "公文、简历与学术写作辅助",
    # ===== 分类4 视频 =====
    "Pika": "文本生成趣味短视频与动态特效",
    "HeyGen": "数字人视频与多语种口播生成",
    "Synthesia": "企业级 AI 数字人视频，多语言 avatar",
    "可灵": "快手 AI 视频生成，运镜与一致性突出",
    "Luma AI": "梦幻视频与 3D 场景生成",
    "Sora": "OpenAI 长时长、高一致性的文生视频",
    "D-ID": "让照片开口说话的数字人视频",
    "剪映": "字节全能视频剪辑，含 AI 成片",
    "智影": "腾讯智能视频创作，脚本到成片",
    "Kaiber": "音乐可视化与风格化视频生成",
    "Pictory": "文章转短视频的自动剪辑",
    "一帧秒创": "图文转视频的 AIGC 创作",
    "Vidnoz": "免费数字人视频与口播模板",
    "度加": "百度 AI 视频创作，智能剪辑",
    # ===== 分类5 音频 =====
    "Udio": "高质量 AI 音乐生成，接近人声演唱",
    "ElevenLabs": "顶级 AI 语音合成与声音克隆",
    "讯飞听见": "会议录音转写与字幕生成",
    "Murf": "配音与有声内容批量生成",
    "魔音工坊": "中文 AI 配音与音频剪辑平台",
    "Boomy": "一键生成可发布的背景音乐",
    "Stable Audio": "Stability AI 音乐与音效生成",
    "TTSMaker": "免费文字转语音，多语种音色",
    "标贝": "中文语音合成与声音定制方案",
    "Voicemaker": "多语种语音生成与下载",
    "讯飞智作": "讯飞 AI 音频创作与配音",
    "Resemble": "克隆声音与实时语音合成",
    # ===== 分类6 编程 =====
    "Codeium": "免费 AI 代码补全与聊天",
    "Tabnine": "隐私优先的代码补全助手",
    "通义灵码": "阿里 IDE 智能编码与单元测试",
    "Claude Code": "Anthropic 终端编程 Agent，自主改代码",
    "v0": "Vercel AI 前端界面与组件生成",
    "Replit": "云端 AI 编程环境与 Agent",
    "bolt.new": "浏览器内全栈 AI 应用开发",
    "Cody": "Sourcegraph 代码问答与检索",
    "文心快码": "百度 Comate 编码助手，上下文感知",
    "CodeGeeX": "智谱开源代码模型，多语言补全",
    "Devin": "首个能自主完成任务的 AI 软件工程师",
    "豆包 MarsCode": "字节 AI IDE，云端与本地协同",
    "CodeWhisperer": "AWS 代码补全与安全检查",
    "Augment": "面向大型代码库的 AI 编程助手",
    # ===== 分类7 办公 =====
    "钉钉 AI": "阿里智能办公协同，会议纪要自动化",
    "飞书": "字节一站式办公套件，含 AI 助理",
    "腾讯文档": "在线协作文档中的 AI 写作与总结",
    "WPS AI": "金山办公智能助手，公文与表格",
    "Microsoft 365 Copilot": "微软全家桶 AI，跨 Word/Excel/PPT",
    "Google Workspace": "谷歌办公套件内置 Gemini",
    "Gamma": "AI 一键生成 PPT 与网页演示",
    "Tome": "叙事型 AI 演示文稿与故事板",
    "讯飞智文": "讯飞 AI 生成 PPT 与大纲",
    "Slack AI": "团队沟通中的智能总结与问答",
    "百度文库": "AI 文档搜索、总结与生成",
    "印象笔记 AI": "智能笔记整理与信息提炼",
    "万兴脑图": "AI 思维导图与结构化梳理",
    "ProcessOn": "在线流程图与协作白板",
    # ===== 分类8 设计 =====
    "Canva": "在线设计海报、Logo 与社媒素材",
    "Figma": "协作式 UI 设计与原型工具",
    "稿定设计": "电商与新媒体一键制图",
    "创客贴": "极简平面设计，模板丰富",
    "即时设计": "国产协作设计软件，可导入 Figma",
    "MasterGo": "团队设计协作与组件库平台",
    "美图秀秀 AI": "人像美容与 AI 修图",
    "墨刀": "产品原型设计与交付",
    "Remove.bg": "一键智能抠图与背景替换",
    "爱设计": "企业营销设计与素材中台",
    "鹿班": "阿里智能电商设计，批量出图",
    "iconfont": "阿里矢量图标库与资源管理",
    "Pixso": "国产 Figma 替代品，设计协作",
    "笔魂": "AI 商用素材与设计生成",
    # ===== 分类9 搜索 =====
    "秘塔搜索": "无广告 AI 搜索引擎，结构化回答",
    "360 AI 搜索": "360 大模型驱动的答案引擎",
    "百度 AI 搜索": "百度对话式搜索与总结",
    "天工 AI": "昆仑万维 AI 助手与搜索",
    "Brave Search": "隐私优先的独立搜索引擎",
    "You.com": "多引擎 AI 聚合搜索与助手",
    "Phind": "开发者专用 AI 搜索与代码解答",
    "Devv": "面向程序员 AI 搜索引擎",
    "知乎直答": "知乎 AI 问答搜索，引用社区内容",
    "纳米搜索": "360 纳米 AI 搜索，多模态答案",
    "Genspark": "智能体式搜索与自动摘要",
    "Andi": "对话式 AI 搜索，简洁答案",
    "Felo": "多语种 AI 搜索与资料整理",
    # ===== 分类10 开发平台 =====
    "OpenAI Platform": "OpenAI 官方 API 平台，GPT 系列模型",
    "Anthropic API": "Claude 模型 API 接入与微调",
    "Google AI Studio": "Gemini 模型调试与 Prompt 实验",
    "阿里云百炼": "阿里大模型一站式微调与部署",
    "百度千帆": "百度企业大模型平台与 Agent",
    "火山方舟": "字节大模型服务平台，推理与精调",
    "智谱 BigModel": "智谱 GLM 开放平台与 API",
    "腾讯云 TI": "腾讯大模型训练与推理平台",
    "Hugging Face": "开源模型社区与推理托管",
    "Replicate": "云端运行开源模型的 API 平台",
    "硅基流动": "国内大模型推理与微调平台",
    "月之暗面平台": "Kimi 开放 API 接入与长上下文",
    "讯飞开放平台": "讯飞语音与认知能力开放",
    "NVIDIA NGC": "GPU 与模型仓库，加速深度学习",
    "Modal": "云端弹性算力平台，按需运行代码",
    # ===== 分类11 学习 =====
    "多邻国": "游戏化外语学习，打卡与口语练习",
    "网易有道翻译": "AI 翻译、词典与文档互译",
    "Khan Academy": "免费全科学习平台，含 AI 辅导",
    "夸克学习": "阿里智能学习助手，作业与考点",
    "学而思九章": "数学 AI 解题辅导与讲题",
    "Quizlet": "记忆卡片与自适应测验",
    "作业帮": "中小学拍照搜题与讲解",
    "小猿搜题": "猿辅导旗下搜题与错题本",
    "松鼠 AI": "自适应智适应学习系统",
    "Coursera": "名校在线课程与认证",
    "Socratic": "谷歌 AI 作业辅导，拍照解题",
    "智学网": "学情分析与智能测评",
    "流利说": "AI 英语口语训练与评测",
}


def esc_sql(s: str) -> str:
    return s.replace("'", "''")


def main():
    with open(SCHEMA, "r", encoding="utf-8") as f:
        content = f.read()

    not_found = []
    for name, new_desc in TOOLS.items():
        # 兼容两种 INSERT 列序：(name, logo, description, ...) 与 (name, url, description, ...)
        # 两种都是「name 后跟一个引号字段，再跟 description」
        pat = re.compile(
            r"(\('" + re.escape(name) + r"',\s*'[^']*',\s*')" + r"([^']*)" + r"(')"
        )
        m = pat.search(content)
        if not m:
            not_found.append(name)
            continue
        old = m.group(2)
        if old == new_desc:
            continue
        content = pat.sub(lambda mm: mm.group(1) + new_desc + mm.group(3), content, count=1)

    with open(SCHEMA, "w", encoding="utf-8") as f:
        f.write(content)

    # 生成线上 UPDATE 迁移脚本
    lines = [
        "-- P2 内容改写：修复 ai_tool 模板化/泛化描述（目标站风格：厂商/能力 + 具体产品事实）",
        "-- 用法：在服务器 MySQL 执行  mysql -u<user> -p<pass> <db> < migration_fix_tool_descriptions.sql",
        "-- 说明：按 name 精确定位；若线上库有本脚本未覆盖的采集工具，请把它们的 name+当前描述发我扩充。",
        "SET NAMES utf8mb4;",
        "",
    ]
    for name, new_desc in TOOLS.items():
        lines.append(
            "UPDATE ai_tool SET description = '%s' WHERE name = '%s';"
            % (esc_sql(new_desc), esc_sql(name))
        )
    lines.append("")
    with open(MIGRATION, "w", encoding="utf-8") as f:
        f.write("\n".join(lines))

    print("总工具数: %d" % len(TOOLS))
    print("未匹配(可能线上才有/名称不符): %d" % len(not_found))
    if not_found:
        print("  -> " + ", ".join(not_found))
    print("已改写 schema.sql 并生成 migration_fix_tool_descriptions.sql")


if __name__ == "__main__":
    main()
