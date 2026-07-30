# -*- coding: utf-8 -*-
"""从前端 mockData.ts 提取 CATEGORIES/AI_TOOLS，生成 H2 兼容的 schema-h2.sql。"""
import re

SRC = r"F:\workbuddy\前后端分离开发鱼皮导航网站\frontend\src\lib\mockData.ts"
OUT = r"F:\workbuddy\前后端分离开发鱼皮导航网站\backend\ai-nav-web\src\main\resources\schema-h2.sql"

src = open(SRC, encoding="utf-8").read()

# ---- CATEGORIES ----
cat_block = re.search(r"CATEGORIES: Category\[\] = \[(.*?)\];", src, re.S).group(1)
cats = re.findall(
    r"\{\s*id:\s*(\d+),\s*name:\s*\"([^\"]+)\",\s*icon:\s*\"([^\"]*)\",\s*sort:\s*(\d+)\s*\}",
    cat_block,
)

# ---- AI_TOOLS ----
tools_block = re.search(r"AI_TOOLS: AiTool\[\] = \[(.*?)\n\];", src, re.S).group(1)
tool_pat = re.compile(
    r't\(\s*(\d+),\s*"([^"]*)",\s*"([^"]*)",\s*"([^"]*)",\s*(\d+),\s*\[([^\]]*)\],\s*(\d+)'
    r'(?:,\s*(true|false))?(?:,\s*(true|false))?\s*\)'
)
tools = tool_pat.findall(tools_block)

def esc(s):
    return s.replace("'", "''")

def b(v):
    return "1" if v == "true" else "0"

DDL = """-- ===== AI 导航站 H2 初始化脚本（由 gen_h2_schema.py 生成，勿手改） =====
-- H2 MySQL 兼容模式；数据与前端 mockData.ts 保持一致

DROP TABLE IF EXISTS category;
CREATE TABLE category (
    id    BIGINT PRIMARY KEY AUTO_INCREMENT,
    name  VARCHAR(64)  NOT NULL,
    icon  VARCHAR(32)  DEFAULT '',
    sort  INT          DEFAULT 0
);

DROP TABLE IF EXISTS ai_tool;
CREATE TABLE ai_tool (
    id             BIGINT PRIMARY KEY AUTO_INCREMENT,
    name           VARCHAR(128) NOT NULL,
    logo           VARCHAR(512) DEFAULT '',
    description    VARCHAR(512) DEFAULT '',
    url            VARCHAR(512) DEFAULT '',
    category_id    BIGINT,
    tags           VARCHAR(256) DEFAULT '',
    heat           INT DEFAULT 0,
    is_recommended TINYINT DEFAULT 0,
    is_hot         TINYINT DEFAULT 0,
    create_time    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_time    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

DROP TABLE IF EXISTS ai_post;
CREATE TABLE ai_post (
    id            BIGINT PRIMARY KEY AUTO_INCREMENT,
    title         VARCHAR(256) NOT NULL,
    content       TEXT,
    author_name   VARCHAR(64)  DEFAULT '',
    author_avatar VARCHAR(512) DEFAULT '',
    thumb_url     VARCHAR(512) DEFAULT '',
    create_time   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    view_num      BIGINT DEFAULT 0,
    like_num      BIGINT DEFAULT 0,
    comment_num   BIGINT DEFAULT 0
);

DROP TABLE IF EXISTS ai_prompt;
CREATE TABLE ai_prompt (
    id            BIGINT PRIMARY KEY AUTO_INCREMENT,
    title         VARCHAR(256) NOT NULL,
    content       TEXT,
    category_name VARCHAR(64) DEFAULT '',
    use_count     BIGINT DEFAULT 0
);

DROP TABLE IF EXISTS "user";
CREATE TABLE "user" (
    id            BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_account  VARCHAR(64)  NOT NULL DEFAULT '',
    user_password VARCHAR(128) NOT NULL DEFAULT '',
    user_name     VARCHAR(64)  DEFAULT '',
    user_avatar   VARCHAR(512) DEFAULT '',
    user_profile  VARCHAR(512) DEFAULT '',
    phone         VARCHAR(32)  DEFAULT '',
    email         VARCHAR(128) DEFAULT '',
    role          VARCHAR(32)  DEFAULT 'user',
    create_time   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_time   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uk_user_account UNIQUE (user_account)
);
"""

parts = [DDL]

# category inserts
cat_vals = ",\n".join(
    f"({cid}, '{esc(name)}', '{esc(icon)}', {sort})" for cid, name, icon, sort in cats
)
parts.append(
    "INSERT INTO category (id, name, icon, sort) VALUES\n" + cat_vals + ";\n"
)

# tool inserts
tvals = []
for (tid, name, desc, url, catid, tags, heat, rec, hot) in tools:
    taglist = re.findall(r'"([^"]*)"', tags)
    tagstr = ",".join(taglist)
    tvals.append(
        f"({tid}, '{esc(name)}', '', '{esc(desc)}', '{esc(url)}', {catid}, "
        f"'{esc(tagstr)}', {heat}, {b(rec)}, {b(hot)})"
    )
parts.append(
    "INSERT INTO ai_tool (id, name, logo, description, url, category_id, tags, heat, is_recommended, is_hot) VALUES\n"
    + ",\n".join(tvals) + ";\n"
)

# admin user（密码 = md5('ai_nav'+'12345678')）
parts.append(
    "INSERT INTO \"user\" (id, user_account, user_password, user_name, role) VALUES\n"
    "(1, 'admin', '0b9835153a177bb9be34675b9b929bb4', '管理员', 'admin');\n"
)

# 社区帖子示例
parts.append(
    "INSERT INTO ai_post (title, content, author_name, view_num, like_num, comment_num) VALUES\n"
    "('用 Cursor 一周撸完一个全栈项目的心得', '分享我用 AI 编辑器提效的完整工作流……', '鱼皮', 1280, 96, 32),\n"
    "('DeepSeek 本地部署踩坑记录', '从显存到量化，把大模型跑在自己机器上的全过程。', '摸鱼学姐', 860, 61, 18),\n"
    "('提示词工程实战：让 AI 写出可用的营销文案', '结构化提示词模板与案例拆解。', 'AI 产品菌', 640, 44, 12),\n"
    "('2026 年最值得关注的 10 个 AI 智能体平台', '从 Coze 到 Dify 的横向评测。', '极客老王', 970, 73, 25);\n"
)

# 提示词示例
parts.append(
    "INSERT INTO ai_prompt (title, content, category_name, use_count) VALUES\n"
    "('通用写作助手', '你是一位资深中文编辑，请帮我润色以下文字，使其更流畅专业：', '写作', 5200),\n"
    "('代码解释器', '请逐行解释下面这段代码的作用，并指出潜在问题：', '编程', 4800),\n"
    "('小红书文案生成', '请以小红书爆款风格，为以下产品写 3 条种草文案：', '营销', 6100),\n"
    "('英文邮件助手', '请把下面的中文改写成礼貌专业的商务英文邮件：', '办公', 3900);\n"
)

# 重置自增序列，避免与显式 id 冲突
parts.append(
    "ALTER TABLE category ALTER COLUMN id RESTART WITH 100;\n"
    "ALTER TABLE ai_tool ALTER COLUMN id RESTART WITH 200;\n"
    "ALTER TABLE ai_post ALTER COLUMN id RESTART WITH 100;\n"
    "ALTER TABLE ai_prompt ALTER COLUMN id RESTART WITH 100;\n"
    "ALTER TABLE \"user\" ALTER COLUMN id RESTART WITH 100;\n"
)

with open(OUT, "w", encoding="utf-8") as f:
    f.write("\n".join(parts))

print(f"categories: {len(cats)}, tools: {len(tools)}")
print(f"written: {OUT}")
