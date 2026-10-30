#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
P2 内容改写：把 ai_tool 描述改为「厂商/能力 + 具体产品事实」的目标站风格。

- 入参：backend/sql/schema.sql（ai_tool 种子）
- 产出：
  1. 就地改写 schema.sql 里每个工具的描述（按 name 精确定位，兼容两种 INSERT 列序）
  2. 生成 backend/sql/migration_fix_tool_descriptions.sql
     （UPDATE ai_tool SET description='...' WHERE name='...'; 供线上 MySQL 执行）

颗粒度对齐目标站 ai.codefather.cn（鱼皮AI导航）首页工具卡描述：
  - 样本 12 条，字数 min13 / mean17.2 / median15
  - 全角逗号占比 ~8%（几乎不用逗号），多为单句
  - 主导结构：「厂商 推出的/出品的 [具体定位]」，少量「基于X的/驱动/赋能」
  → 本映射据此收紧：单句、无逗号、点名出品方 + 这东西「是什么」，12–21 字

描述均不含英文单引号，SQL 侧再做 '' 转义以防万一。
"""
import re
import os

REPO = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
SCHEMA = os.path.join(REPO, "backend", "sql", "schema.sql")
MIGRATION = os.path.join(REPO, "backend", "sql", "migration_fix_tool_descriptions.sql")

# name -> 目标站粒度（单句 / 无逗号 / 厂商+推出的+定位）的新描述
TOOLS = {
    # ===== 示例工具 =====
    "ChatGPT": "OpenAI 出品的通用对话模型",
    "Claude": "Anthropic 出品的长文本推理模型",
    "Midjourney": "Midjourney 出品的高质感 AI 绘画",
    "Stable Diffusion": "Stability AI 开源可本地部署的扩散模型",
    "GitHub Copilot": "GitHub 与 OpenAI 联合推出的代码补全",
    "Cursor": "AI 原生的对话式代码编辑器",
    "Perplexity": "回答带引用的 AI 搜索引擎",
    "Suno": "Suno 出品的文生歌曲与人声工具",
    "Runway": "Runway 出品的文生视频工具",
    "Coze": "字节推出的 AI Bot 搭建分发平台",
    # ===== 分类1 对话 =====
    "Kimi": "月之暗面出品的长上下文对话助手",
    "文心一言": "百度文心大模型中文多模态生成",
    "通义千问": "阿里通义大模型支持工具调用",
    "豆包": "字节跳动免费 AI 助手接入抖音",
    "智谱清言": "清华智谱 GLM 支持 Agent 与代码",
    "讯飞星火": "科大讯飞认知大模型强于语音",
    "元宝": "腾讯混元大模型深度整合微信",
    "Gemini": "Google 多模态模型原生接入搜索",
    "Copilot": "微软 Windows 内置跨应用 AI 助手",
    "DeepSeek": "深度求索开源推理与代码大模型",
    "百川智能": "百川开源主打中文的行业大模型",
    "Poe": "Quora 推出的多模型聚合对话平台",
    "Character.AI": "可创建专属角色的角色扮演聊天",
    "Grok": "xAI 推出的实时联网对话对接 X",
    # ===== 分类2 绘画 =====
    "DALL·E 3": "OpenAI 文生图模型提示词理解强",
    "通义万相": "阿里通义文生图国风审美突出",
    "文心一格": "百度 AI 艺术绘画风格多样",
    "Leonardo.AI": "面向游戏概念美术的 AI 绘画",
    "Adobe Firefly": "Adobe 创意套件中的商用生成式 AI",
    "即梦": "字节剪映旗下 AI 绘画与视频生成",
    "Civitai": "开源绘画模型 LoRA 与 Checkpoint 社区",
    "Ideogram": "擅长图文排版与英文海报的绘画",
    "NightCafe": "在线 AI 艺术多风格与赛事",
    "6pen": "支持中文提示词的国产免费绘画",
    "SeaArt": "二次元风格 AI 绘画含模型社区",
    "NovelAI": "二次元动漫角色绘制与剧情辅助",
    "Recraft": "矢量图标与品牌素材 AI 生成",
    "Fooocus": "本地部署开箱即用的极简绘画",
    # ===== 分类3 写作 =====
    "Notion AI": "笔记文档中的智能写作与总结",
    "Jasper": "面向团队的营销文案批量生成",
    "Copy.ai": "社交与广告文案快速生成",
    "Grammarly": "英文语法校对润色与语气调整",
    "QuillBot": "改写摘要与多语种翻译工具",
    "Writesonic": "长文与 SEO 内容批量生成",
    "秘塔写作猫": "中文纠错润色与改写",
    "火山写作": "字节智能写作助手提纲与扩写",
    "Sudowrite": "小说创作辅助角色与情节打磨",
    "Rytr": "低成本多语言营销写作",
    "通义听悟": "会议录音转写总结与待办提取",
    "彩云小梦": "中文小说 AI 续写与剧情生成",
    "笔灵 AI": "公文简历与学术写作辅助",
    # ===== 分类4 视频 =====
    "Pika": "文本生成趣味短视频与动态特效",
    "HeyGen": "数字人视频与多语种口播生成",
    "Synthesia": "企业级 AI 数字人多语言 avatar",
    "可灵": "快手 AI 视频运镜与一致性突出",
    "Luma AI": "梦幻视频与 3D 场景生成",
    "Sora": "OpenAI 长时长高一致性文生视频",
    "D-ID": "让照片开口说话的数字人视频",
    "剪映": "字节全能视频剪辑含 AI 成片",
    "智影": "腾讯智能视频创作脚本到成片",
    "Kaiber": "音乐可视化与风格化视频生成",
    "Pictory": "文章自动转短视频剪辑",
    "一帧秒创": "图文转视频的 AIGC 创作",
    "Vidnoz": "免费数字人视频与口播模板",
    "度加": "百度 AI 视频智能剪辑",
    # ===== 分类5 音频 =====
    "Udio": "高质量 AI 音乐接近人声演唱",
    "ElevenLabs": "顶级 AI 语音合成与声音克隆",
    "讯飞听见": "会议录音转写与字幕生成",
    "Murf": "配音与有声内容批量生成",
    "魔音工坊": "中文 AI 配音与音频剪辑平台",
    "Boomy": "一键生成可发布背景音乐",
    "Stable Audio": "Stability AI 音乐与音效生成",
    "TTSMaker": "免费文字转语音多语种音色",
    "标贝": "中文语音合成与声音定制方案",
    "Voicemaker": "多语种语音生成与下载",
    "讯飞智作": "讯飞 AI 音频创作与配音",
    "Resemble": "克隆声音与实时语音合成",
    # ===== 分类6 编程 =====
    "Codeium": "免费 AI 代码补全与聊天",
    "Tabnine": "隐私优先的代码补全助手",
    "通义灵码": "阿里 IDE 智能编码与单测",
    "Claude Code": "Anthropic 终端自主改代码 Agent",
    "v0": "Vercel AI 前端界面与组件生成",
    "Replit": "云端 AI 编程环境与 Agent",
    "bolt.new": "浏览器内全栈 AI 应用开发",
    "Cody": "Sourcegraph 代码问答与检索",
    "文心快码": "百度 Comate 上下文感知编码",
    "CodeGeeX": "智谱开源多语言代码补全",
    "Devin": "首个能自主完成任务的 AI 工程师",
    "豆包 MarsCode": "字节 AI IDE 云端本地协同",
    "CodeWhisperer": "AWS 代码补全与安全检查",
    "Augment": "面向大型代码库的编程助手",
    # ===== 分类7 办公 =====
    "钉钉 AI": "阿里智能办公会议纪要自动化",
    "飞书": "字节一站式办公套件含 AI 助理",
    "腾讯文档": "在线协作文档 AI 写作与总结",
    "WPS AI": "金山办公助手公文与表格",
    "Microsoft 365 Copilot": "微软全家桶跨 Word Excel PPT",
    "Google Workspace": "谷歌办公套件内置 Gemini",
    "Gamma": "AI 一键生成 PPT 与网页演示",
    "Tome": "叙事型 AI 演示文稿与故事板",
    "讯飞智文": "讯飞 AI 生成 PPT 与大纲",
    "Slack AI": "团队沟通智能总结与问答",
    "百度文库": "AI 文档搜索总结与生成",
    "印象笔记 AI": "智能笔记整理与信息提炼",
    "万兴脑图": "AI 思维导图与结构化梳理",
    "ProcessOn": "在线流程图与协作白板",
    # ===== 分类8 设计 =====
    "Canva": "在线设计海报 Logo 与社媒素材",
    "Figma": "协作式 UI 设计与原型工具",
    "稿定设计": "电商新媒体一键制图",
    "创客贴": "极简平面设计模板丰富",
    "即时设计": "国产协作设计可导入 Figma",
    "MasterGo": "团队设计协作与组件库平台",
    "美图秀秀 AI": "人像美容与 AI 修图",
    "墨刀": "产品原型设计与交付",
    "Remove.bg": "一键智能抠图背景替换",
    "爱设计": "企业营销设计与素材中台",
    "鹿班": "阿里智能电商设计批量出图",
    "iconfont": "阿里矢量图标库与资源管理",
    "Pixso": "国产 Figma 替代设计协作",
    "笔魂": "AI 商用素材与设计生成",
    # ===== 分类9 搜索 =====
    "秘塔搜索": "无广告 AI 搜索结构化回答",
    "360 AI 搜索": "360 大模型驱动答案引擎",
    "百度 AI 搜索": "百度对话式搜索与总结",
    "天工 AI": "昆仑万维 AI 助手与搜索",
    "Brave Search": "隐私优先的独立搜索引擎",
    "You.com": "多引擎 AI 聚合搜索助手",
    "Phind": "开发者专用 AI 搜索代码解答",
    "Devv": "面向程序员 AI 搜索引擎",
    "知乎直答": "知乎 AI 问答引用社区内容",
    "纳米搜索": "360 纳米多模态 AI 搜索",
    "Genspark": "智能体式搜索与自动摘要",
    "Andi": "对话式 AI 搜索简洁答案",
    "Felo": "多语种 AI 搜索资料整理",
    # ===== 分类10 开发平台 =====
    "OpenAI Platform": "OpenAI 官方 API 平台 GPT 系列",
    "Anthropic API": "Claude 模型 API 接入与微调",
    "Google AI Studio": "Gemini 模型调试与 Prompt 实验",
    "阿里云百炼": "阿里大模型一站式微调部署",
    "百度千帆": "百度企业大模型平台与 Agent",
    "火山方舟": "字节大模型服务平台推理精调",
    "智谱 BigModel": "智谱 GLM 开放平台与 API",
    "腾讯云 TI": "腾讯大模型训练推理平台",
    "Hugging Face": "开源模型社区与推理托管",
    "Replicate": "云端运行开源模型 API 平台",
    "硅基流动": "国内大模型推理与微调平台",
    "月之暗面平台": "Kimi 开放 API 长上下文接入",
    "讯飞开放平台": "讯飞语音认知能力开放",
    "NVIDIA NGC": "GPU 与模型仓库加速深度学习",
    "Modal": "云端弹性算力按需运行代码",
    # ===== 分类11 学习 =====
    "多邻国": "游戏化外语学习打卡口语",
    "网易有道翻译": "AI 翻译词典与文档互译",
    "Khan Academy": "免费全科学习含 AI 辅导",
    "夸克学习": "阿里智能学习作业与考点",
    "学而思九章": "数学 AI 解题辅导讲题",
    "Quizlet": "记忆卡片与自适应测验",
    "作业帮": "中小学拍照搜题讲解",
    "小猿搜题": "猿辅导搜题与错题本",
    "松鼠 AI": "自适应智适应学习系统",
    "Coursera": "名校在线课程与认证",
    "Socratic": "谷歌 AI 作业辅导拍照解题",
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
        "-- P2 内容改写 v2：对齐目标站 ai.codefather.cn（鱼皮AI导航）描述颗粒度",
        "--   单句 / 无逗号 / 厂商+推出的+定位，12-21 字",
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
    print("已改写 schema.sql 并生成 migration_fix_tool_descriptions.sql (v2 颗粒度对齐)")


if __name__ == "__main__":
    main()
