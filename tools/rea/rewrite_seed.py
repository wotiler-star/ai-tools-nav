#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
统一种子 ai_tool 描述到目标站 /tool 长描述风格，并修正 category_id 到 14 大类表。

做法：
1. 解析 schema.sql 的 seed 区（ai_prompt 之前）所有 ai_tool 行。
2. 描述：
   - 与目标站重叠的 37 个 name → 直接复用目标站真实 desc（tmap）。
   - 其余 123 个种子独有 → 使用下方 SEEDONLY_DESC 手工撰写的 /tool 风格描述
     （厂商 + 能力 + 关键特性，常逗号连接，18~30 字，对齐目标站真实分布）。
3. category_id：按所在「分类 N 名称」区块映射到 14 大类表正确 id
   （对话→7 写作→1 视频→3 音频→8 编程→5 办公→4 设计→9 搜索→12 开发平台→5；
    绘画→2 与 学习→11 原值已正确；示例区块无表头，保留原值）。
4. 写回 schema.sql（仅替换 seed 区 ai_tool 行，其余原样）。
5. 额外生成 migration_seed_unify.sql：仅对 123 个种子独有 name 做
   UPDATE description/category_id，避免与待执行的 410 入库（只动 37 重叠）冲突，顺序无关。
"""
import os, re, json

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.dirname(os.path.dirname(HERE))
TARGET = os.path.join(HERE, "target_tools.json")
SCHEMA = os.path.join(REPO, "backend", "sql", "schema.sql")
MIG = os.path.join(REPO, "backend", "sql", "migration_seed_unify.sql")

tlist = json.load(open(TARGET, encoding="utf-8"))
tmap = {t["name"]: t["desc"] for t in tlist}

# 手工撰写的 /tool 风格描述（种子独有 123 个）
SEEDONLY_DESC = {
 # 对话（→7）
 "Cursor": "AI 原生的对话式代码编辑器，支持自然语言生成与重构代码",
 "Runway": "Runway 出品的文生视频工具，支持文本生成与视频剪辑",
 "Coze": "字节推出的 AI Bot 搭建与分发平台，低代码可视化编排",
 "Kimi": "月之暗面出品的长上下文对话助手，支持超长文档解析",
 "豆包": "字节跳动推出的免费 AI 助手，深度接入抖音与头条生态",
 "元宝": "腾讯混元大模型推出的 AI 助手，深度整合微信生态",
 "百川智能": "百川智能开源的中文行业大模型，擅长医疗与金融问答",
 # 绘画（→2）
 "DALL·E 3": "OpenAI 文生图模型，提示词理解强且支持中文指令",
 "文心一格": "百度推出的 AI 艺术绘画工具，覆盖多种风格与国风",
 "Leonardo.AI": "面向游戏概念美术的 AI 绘画，支持素材与贴图生成",
 "Adobe Firefly": "Adobe 创意套件中的商用生成式 AI，可安全用于商业",
 "Ideogram": "擅长图文排版与英文海报的 AI 绘画，文字渲染清晰",
 "NightCafe": "在线 AI 艺术平台，提供多风格生成与社区赛事",
 "6pen": "支持中文提示词的国产免费 AI 绘画，风格丰富",
 "SeaArt": "二次元风格 AI 绘画平台，内置模型社区与 LoRA",
 "NovelAI": "二次元动漫角色绘制工具，兼具剧情与对话辅助",
 "Recraft": "矢量图标与品牌素材 AI 生成，支持风格一致性",
 "Fooocus": "本地部署开箱即用的极简绘画，基于 SDXL 一键出图",
 # 写作（→1）
 "Notion AI": "笔记文档中的智能写作与总结，深度集成 Notion 工作区",
 "Jasper": "面向团队的营销文案批量生成，内置品牌语气库",
 "Copy.ai": "社交与广告文案快速生成，覆盖多场景营销模板",
 "Grammarly": "英文语法校对润色与语气调整，实时写作助手",
 "QuillBot": "改写摘要与多语种翻译工具，支持多种 paraphrase 模式",
 "Writesonic": "长文与 SEO 内容批量生成，适合博客与落地页",
 "秘塔写作猫": "中文纠错润色与改写，提供语法与风格建议",
 "火山写作": "字节智能写作助手，支持提纲生成与长文扩写",
 "Sudowrite": "小说创作辅助，打磨角色塑造与情节推进",
 "Rytr": "低成本多语言营销写作，覆盖数十种用例模板",
 "通义听悟": "会议录音转写总结与待办提取，支持多语言字幕",
 "彩云小梦": "中文小说 AI 续写与剧情生成，辅助网文创作",
 "笔灵 AI": "公文简历与学术写作辅助，提供结构化模板",
 # 视频（→3）
 "Pika": "文本生成趣味短视频与动态特效，操作简单出片快",
 "HeyGen": "数字人视频与多语种口播生成，企业营销利器",
 "Synthesia": "企业级 AI 数字人，多语言 avatar 批量生成培训视频",
 "可灵": "快手 AI 视频，运镜自由且人物一致性突出",
 "Luma AI": "梦幻视频与 3D 场景生成，支持运动与光影控制",
 "Sora": "OpenAI 长时长高一致性文生视频，理解复杂指令",
 "D-ID": "让照片开口说话的数字人视频，生成逼真口播",
 "剪映": "字节全能视频剪辑，内置 AI 成片与智能字幕",
 "智影": "腾讯智能视频创作，从脚本到成片一站式生成",
 "Kaiber": "音乐可视化与风格化视频生成，适配短视频创作",
 "Pictory": "文章自动转短视频剪辑，提取重点生成解说",
 "一帧秒创": "图文转视频的 AIGC 创作，一键生成口播视频",
 "Vidnoz": "免费数字人视频与口播模板，无需拍摄即可出片",
 "度加": "百度 AI 视频智能剪辑，自动粗剪与字幕识别",
 # 音频（→8）
 "Udio": "高质量 AI 音乐生成，人声与编曲接近真人水平",
 "Murf": "配音与有声内容批量生成，提供多语言拟真音色",
 "Boomy": "一键生成可发布的背景音乐，适合短视频配乐",
 "Stable Audio": "Stability AI 音乐与音效生成，支持时长与风格控制",
 "TTSMaker": "免费文字转语音，提供多语种与多种音色下载",
 "标贝": "中文语音合成与声音定制方案，覆盖多场景 TTS",
 "Voicemaker": "多语种语音生成与下载，支持情绪与语速调节",
 "Resemble": "克隆声音与实时语音合成，支持情感化 TTS",
 # 编程（→5）
 "Codeium": "免费 AI 代码补全与聊天，支持主流 IDE 与语言",
 "Tabnine": "隐私优先的代码补全助手，支持本地与云端模型",
 "Claude Code": "Anthropic 终端自主改代码 Agent，理解整个代码库",
 "v0": "Vercel 推出的 AI 前端界面与 React 组件生成",
 "Replit": "云端 AI 编程环境与 Agent，浏览器内编写运行代码",
 "bolt.new": "浏览器内全栈 AI 应用开发，一句话生成可部署项目",
 "Cody": "Sourcegraph 代码问答与检索，基于全仓库语义理解",
 "文心快码": "百度 Comate 上下文感知编码，补全与注释一体化",
 "Devin": "首个能自主完成任务的 AI 软件工程师，端到端写代码",
 "豆包 MarsCode": "字节 AI IDE，云端本地协同编程与智能补全",
 "Augment": "面向大型代码库的编程助手，深度理解企业项目",
 # 办公（→4）
 "钉钉 AI": "阿里智能办公助手，会议纪要自动化与待办整理",
 "飞书": "字节一站式办公套件，内置 AI 助理与多维表格",
 "腾讯文档": "在线协作文档，AI 写作总结与智能表格处理",
 "WPS AI": "金山办公助手，公文写作与表格公式智能生成",
 "Microsoft 365 Copilot": "微软全家桶 AI，跨 Word Excel PPT 智能协作",
 "Google Workspace": "谷歌办公套件内置 Gemini，辅助邮件与文档",
 "Tome": "叙事型 AI 演示文稿与故事板，一键生成视觉化 PPT",
 "Slack AI": "团队沟通智能总结与问答，自动梳理频道要点",
 "百度文库": "AI 文档搜索总结与生成，海量资料一键提炼",
 "印象笔记 AI": "智能笔记整理与信息提炼，自动生成摘要回顾",
 "万兴脑图": "AI 思维导图与结构化梳理，一键展开层级关系",
 "ProcessOn": "在线流程图与协作白板，AI 辅助生成图表",
 # 设计（→9）
 "Canva": "在线设计海报 Logo 与社媒素材，海量模板拖拽即用",
 "Figma": "协作式 UI 设计与原型工具，支持实时多人编辑",
 "稿定设计": "电商新媒体一键制图，覆盖营销全场景模板",
 "创客贴": "极简平面设计，模板丰富适合零基础快速出图",
 "即时设计": "国产协作设计，可导入 Figma 文件无缝迁移",
 "MasterGo": "团队设计协作与组件库平台，规范统一管理",
 "美图秀秀 AI": "人像美容与 AI 修图，一键焕肤与智能美颜",
 "墨刀": "产品原型设计与交付，支持交互与团队协作",
 "Remove.bg": "一键智能抠图与背景替换，自动识别主体边缘",
 "iconfont": "阿里矢量图标库与资源管理，海量免费图标下载",
 "Pixso": "国产 Figma 替代，设计协作与交付一体化",
 "笔魂": "AI 商用素材与设计生成，覆盖电商与海报场景",
 # 搜索（→12）
 "秘塔搜索": "无广告 AI 搜索，结构化回答并附引用来源",
 "360 AI 搜索": "360 大模型驱动答案引擎，整合多源信源",
 "百度 AI 搜索": "百度对话式搜索与总结，理解复杂提问",
 "天工 AI": "昆仑万维 AI 助手与搜索，支持多模态问答",
 "Brave Search": "隐私优先的独立搜索引擎，无追踪保护数据",
 "You.com": "多引擎 AI 聚合搜索助手，可定制结果来源",
 "Phind": "开发者专用 AI 搜索，精准解答代码与技术问题",
 "Genspark": "智能体式搜索与自动摘要，生成结构化报告",
 "Andi": "对话式 AI 搜索，提供简洁直接的答案与解释",
 # 开发平台（→5）
 "OpenAI Platform": "OpenAI 官方 API 平台，提供 GPT 系列模型接入",
 "Anthropic API": "Claude 模型 API 接入与微调，支持长上下文",
 "Google AI Studio": "Gemini 模型调试与 Prompt 实验，免费快速原型",
 "阿里云百炼": "阿里大模型一站式平台，微调部署与 Agent 编排",
 "百度千帆": "百度企业大模型平台，提供训练推理与 Agent",
 "智谱 BigModel": "智谱 GLM 开放平台与 API，支持多模态调用",
 "腾讯云 TI": "腾讯大模型训练推理平台，一站式 MLOps",
 "Hugging Face": "开源模型社区与推理托管，海量预训练模型",
 "Replicate": "云端运行开源模型 API 平台，一行代码调用",
 "硅基流动": "国内大模型推理与微调平台，低价高速部署",
 "月之暗面平台": "Kimi 开放 API，长上下文接入与智能体开发",
 "讯飞开放平台": "讯飞语音认知能力开放，提供听写与合成 API",
 "NVIDIA NGC": "GPU 与模型仓库，加速深度学习训练推理",
 "Modal": "云端弹性算力，按需运行代码与模型推理",
 # 学习（→11）
 "多邻国": "游戏化外语学习，打卡口语与听说读写训练",
 "网易有道翻译": "AI 翻译词典与文档互译，支持多语种识别",
 "Khan Academy": "免费全科学习平台，含 AI 辅导与练习讲解",
 "夸克学习": "阿里智能学习助手，作业答疑与考点梳理",
 "学而思九章": "数学 AI 解题辅导，分步讲题与思路引导",
 "Quizlet": "记忆卡片与自适应测验，高效背诵与复习",
 "作业帮": "中小学拍照搜题讲解，覆盖全科作业辅导",
 "小猿搜题": "猿辅导搜题与错题本，智能诊断薄弱点",
 "松鼠 AI": "自适应智适应学习系统，个性化定制学习路径",
 "Socratic": "谷歌 AI 作业辅导，拍照解题与知识点讲解",
 "智学网": "学情分析与智能测评，精准定位学习情况",
 "流利说": "AI 英语口语训练与评测，情景对话练发音",
}

# 区块表头「分类 N 名称」→ 14 大类正确 id
HEADER_RE = re.compile(r'分类 \d+ ([^\s=]+) =+')
NAME2ID = {
    "对话": 7, "绘画": 2, "写作": 1, "视频": 3, "音频": 8,
    "编程": 5, "办公": 4, "设计": 9, "搜索": 12, "开发平台": 5, "学习": 11,
}

QS = re.compile(r"'([^']*)'")

def parse_line(line):
    raw = line.strip()
    if not raw.startswith("("):
        return None
    if "MD5" in line or "管理员" in line:
        return None
    strs = QS.findall(line)
    if len(strs) < 4:
        return None
    name = strs[0]
    if name == "admin":
        return None
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
        return None
    catid = ints[0]
    heat = ints[1] if len(ints) > 1 else "0"
    rec = ints[2] if len(ints) > 2 else "0"
    hot = ints[3] if len(ints) > 3 else "0"
    # 顺序判定：url 在第二个字符串 → 顺序 B（无 logo）
    order = "B" if url and strs[1] == url else "A"
    logo = strs[1] if order == "A" else ""
    return dict(name=name, desc=desc, url=url, tags=tags, catid=catid,
                logo=logo, heat=heat, rec=rec, hot=hot, order=order, raw=raw)

def main():
    txt = open(SCHEMA, encoding="utf-8").read()
    cut = txt.find("-- ============ 社区提示词 ai_prompt")
    assert cut > 0, "未找到 ai_prompt 分割点"
    head = txt[:cut]
    tail = txt[cut:]

    block = None          # 当前区块正确 category_id；None 表示示例区块（保留原值）
    out_lines = []
    rewritten = []        # 收集改写行，用于生成迁移脚本
    missing = []

    for line in head.splitlines():
        hm = HEADER_RE.search(line)
        if hm and "============" in line:
            nm = hm.group(1)
            block = NAME2ID.get(nm)   # 找不到则保持 None
            out_lines.append(line)
            continue
        r = parse_line(line)
        if not r:
            out_lines.append(line)
            continue
        name = r["name"]
        # 描述
        if name in tmap:
            new_desc = tmap[name]
            is_overlap = True
        elif name in SEEDONLY_DESC:
            new_desc = SEEDONLY_DESC[name]
            is_overlap = False
        else:
            missing.append(name)
            new_desc = r["desc"]
            is_overlap = False
        # category_id
        new_cat = block if block is not None else r["catid"]
        # 元组本身已带字面量 ")"，终止符只用 "," 或 ";"，避免产生 "));"
        term = ";" if r["raw"].rstrip().endswith(";") else ","
        if r["order"] == "A":
            newline = "('{name}', '{logo}', '{desc}', '{url}', {cat}, '{tags}', {heat}, {rec}, {hot}){term}".format(
                name=name, logo=r["logo"], desc=new_desc.replace("'", "''"),
                url=r["url"], cat=new_cat, tags=r["tags"], heat=r["heat"],
                rec=r["rec"], hot=r["hot"], term=term)
        else:
            newline = "('{name}', '{url}', '{desc}', '{tags}', {cat}, {heat}, {rec}, {hot}){term}".format(
                name=name, url=r["url"], desc=new_desc.replace("'", "''"),
                tags=r["tags"], cat=new_cat, heat=r["heat"],
                rec=r["rec"], hot=r["hot"], term=term)
        out_lines.append(newline)
        rewritten.append(dict(name=name, desc=new_desc, cat=new_cat, overlap=is_overlap))

    if missing:
        raise SystemExit(f"[ERROR] 以下种子独有 name 缺少 SEEDONLY_DESC: {missing}")

    new_head = "\n".join(out_lines) + ("\n" if not head.endswith("\n") else "")
    open(SCHEMA, "w", encoding="utf-8").write(new_head + tail)

    # 校验：覆盖数 / 种子独有数
    n_overlap = sum(1 for x in rewritten if x["overlap"])
    n_only = len(rewritten) - n_overlap
    print(f"[OK] schema.sql 已改写 ai_tool 行: {len(rewritten)} (重叠复用={n_overlap}, 种子独有={n_only})")

    # 生成迁移脚本（仅种子独有 123 个，避免与 410 入库冲突）
    only = [x for x in rewritten if not x["overlap"]]
    mig = ["SET NAMES utf8mb4;",
           "-- 统一种子描述到 /tool 长描述风格 + 修正 category_id 到 14 大类表",
           "-- 仅更新种子独有工具（与待执行的 410 入库按 name 互不重叠，顺序无关，可重复执行）"]
    for x in only:
        d = x["desc"].replace("'", "''")
        nm = x["name"].replace("'", "''")
        mig.append(f"UPDATE ai_tool SET description = '{d}', category_id = {x['cat']} WHERE name = '{nm}';")
    open(MIG, "w", encoding="utf-8").write("\n".join(mig) + "\n")
    print(f"[OK] 迁移脚本已生成: {MIG} (UPDATE 行数={len(only)})")

if __name__ == "__main__":
    main()
