-- ============================================================
-- AI 知识库初始化：3 张表 + 4 大主题 + 10 个专栏 + 30 篇占位文章
-- 幂等：先 DROP（演示/可重建）；生产环境请去掉 DROP 改用 CREATE IF NOT EXISTS
-- ============================================================

DROP TABLE IF EXISTS ai_article;
DROP TABLE IF EXISTS ai_column;
DROP TABLE IF EXISTS ai_column_category;

CREATE TABLE ai_column_category (
  id          BIGINT       NOT NULL AUTO_INCREMENT,
  name        VARCHAR(64)  NOT NULL,
  sort        INT          DEFAULT 0,
  description VARCHAR(255) DEFAULT '',
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE ai_column (
  id           BIGINT       NOT NULL AUTO_INCREMENT,
  title        VARCHAR(256) NOT NULL,
  description  VARCHAR(512) DEFAULT '',
  cover_color  VARCHAR(32)  DEFAULT '#3874F7',
  category_id  BIGINT       DEFAULT NULL,
  category_name VARCHAR(64) DEFAULT '',
  tags         VARCHAR(255) DEFAULT '',
  need_vip     INT          DEFAULT 0,
  article_count INT         DEFAULT 0,
  view_num     BIGINT       DEFAULT 0,
  like_num     BIGINT       DEFAULT 0,
  collect_num  BIGINT       DEFAULT 0,
  sort         INT          DEFAULT 0,
  status       INT          DEFAULT 1,
  create_time  DATETIME     DEFAULT CURRENT_TIMESTAMP,
  update_time  DATETIME     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_category (category_id),
  KEY idx_sort (sort)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE ai_article (
  id          BIGINT       NOT NULL AUTO_INCREMENT,
  column_id   BIGINT       DEFAULT NULL,
  title       VARCHAR(256) NOT NULL,
  summary     VARCHAR(512) DEFAULT '',
  content     MEDIUMTEXT,
  cover_url   VARCHAR(512) DEFAULT '',
  view_num    BIGINT       DEFAULT 0,
  like_num    BIGINT       DEFAULT 0,
  collect_num BIGINT       DEFAULT 0,
  sort        INT          DEFAULT 0,
  status      INT          DEFAULT 1,
  create_time DATETIME     DEFAULT CURRENT_TIMESTAMP,
  update_time DATETIME     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_column (column_id),
  KEY idx_sort (sort)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ===================== 分类（4 大主题） =====================
INSERT INTO ai_column_category (id, name, sort, description) VALUES
(1, '新手入门',   10, '零基础也能看懂的 AI 通识与概念科普'),
(2, 'DeepSeek',  20, '当下最火的国产大模型，从入门到精通'),
(3, 'AI 编程',   30, '用 AI 写代码、做项目、搞开发的全套实战'),
(4, 'AI 工具测评', 40, '热门大模型与 AI 编程工具一手实测');

-- ===================== 专栏（10 个） =====================
-- need_vip: 0 免费 / 1 会员
INSERT INTO ai_column (id, title, description, cover_color, category_id, category_name, tags, need_vip, article_count, view_num, like_num, collect_num, sort) VALUES
(11, 'AI 基础概念通识',   '一张图讲清大模型、Token、算力、微调到底是什么，零基础友好。', '#3874F7', 1, '新手入门', '大模型,概念,科普', 0, 3, 1820, 96, 210, 10),
(12, '从零玩转 DeepSeek', '全面了解 DeepSeek：是什么、怎么用、怎么本地部署与调用 API。', '#7C3AED', 2, 'DeepSeek', 'DeepSeek,入门,API', 0, 3, 9650, 412, 680, 20),
(13, 'DeepSeek 实战应用', '把 DeepSeek 用在写作、办公、编程、理财等真实场景。',       '#0EA5E9', 2, 'DeepSeek', '场景,应用,效率', 0, 3, 5210, 233, 410, 21),
(14, 'Cursor 从入门到精通','一文秒懂 Cursor 正确姿势，10 个实用技巧 + 极限省钱大法。',  '#10B981', 3, 'AI 编程', 'Cursor,IDE,技巧', 0, 3, 7430, 305, 520, 30),
(15, 'AI 零代码做项目',   '不会写代码也能做网站：用 AI 给对象做网站、做亲戚计算器。',   '#F59E0B', 3, 'AI 编程', '零代码,项目,实战', 0, 3, 4380, 188, 360, 31),
(16, 'AI 智能体与 MCP',   'AI 智能体项目实战 + MCP 服务开发，进阶开发者必看。',         '#EF4444', 3, 'AI 编程', 'Agent,MCP,进阶', 0, 3, 3120, 150, 290, 32),
(17, '大模型应用开发路线', '从 Spring AI 到 Claude Code，梳理大模型应用开发学习路线。', '#8B5CF6', 3, 'AI 编程', 'SpringAI,Claude,路线', 1, 3, 2680, 120, 240, 33),
(18, 'GPT-5 深度测评',     'GPT-5 到底强在哪？一篇讲透能力边界与适用场景。',           '#06B6D4', 4, 'AI 工具测评', 'GPT-5,测评', 0, 3, 6890, 280, 470, 40),
(19, 'Claude 4 实测',     '凭什么敢称“宇宙最强编程 AI”？Claude 4 实测全记录。',       '#EC4899', 4, 'AI 工具测评', 'Claude,编程,测评', 0, 3, 5540, 240, 390, 41),
(20, 'Gemini 3.0 上手',   'Google 最新多模态大模型 Gemini 3.0 前端能力实测。',         '#22C55E', 4, 'AI 工具测评', 'Gemini,多模态,测评', 1, 3, 3990, 170, 300, 42);

-- ===================== 文章（30 篇，每专栏 3 篇） =====================
-- 正文为 markdown 占位骨架（基于真实鱼皮教程目录）
INSERT INTO ai_article (column_id, title, summary, content, view_num, like_num, collect_num, sort) VALUES
-- 11 新手入门 / AI 基础概念
(11, '2 分钟看懂：大模型到底是什么', '用最通俗的比喻讲清大语言模型的本质，零基础也能秒懂。',
 '# 2 分钟看懂：大模型到底是什么\n\n> 大模型不是魔法，而是一个“超级文本续写器”。\n\n## 一、它怎么工作\n\n- 输入一段文字，预测“下一个最可能出现的词”\n- 把预测结果拼回去，再预测下一个，循环往复\n\n## 二、关键概念\n\n| 概念 | 一句话解释 |\n| --- | --- |\n| Token | 模型处理文本的最小单位 |\n| 参数 | 模型学到的“知识权重” |\n| 微调 | 在通用能力上做专项训练 |\n\n## 三、小结\n\n大模型本质是**概率生成器**，理解这点就不会被各种营销话术带偏。', 610, 32, 70, 1),
(11, 'Token、算力、上下文窗口一次说清', '搞懂三个高频词，才算真正入门 AI。',
 '# Token、算力、上下文窗口一次说清\n\n## Token\n\n中文里 1 个 Token ≈ 1~2 个汉字。\n\n## 算力\n\n训练/推理都要 GPU，算力越大跑得越快。\n\n## 上下文窗口\n\n模型一次能“记住”的最大文本长度，超出会遗忘前面内容。', 540, 28, 65, 2),
(11, '为什么 AI 会“一本正经地胡说”', '幻觉（Hallucination）的成因与应对方法。',
 '# 为什么 AI 会“一本正经地胡说”\n\n## 什么是幻觉\n\n模型生成了看似合理但错误的答案。\n\n## 怎么减少\n\n1. 给明确指令\n2. 要求引用来源\n3. 关键事实人工核对', 670, 36, 75, 3),

-- 12 DeepSeek / 从零玩转
(12, 'DeepSeek 到底是什么？核心能力盘点', '一文搞懂 DeepSeek 的来龙去脉与核心优势。',
 '# DeepSeek 到底是什么？\n\n## 起源\n\n国产开源大模型，2025 年横空出世。\n\n## 核心能力\n\n- 推理能力强\n- 成本低\n- 开源可私有部署', 3200, 140, 220, 1),
(12, 'DeepSeek 本地部署保姆级教程', '从环境准备到跑通第一条对话，手把手教你本地部署。',
 '# DeepSeek 本地部署保姆级教程\n\n## 环境\n\n- 一台有显卡的机器（或 CPU 也能跑量化版）\n- Ollama 一键安装\n\n## 步骤\n\n```bash\nollama run deepseek-r1:7b\n```\n\n打开浏览器即可对话。', 3450, 160, 250, 2),
(12, 'DeepSeek API 调用指南（比官方更好用）', '2 分钟接入 API，把 DeepSeek 塞进你的应用。',
 '# DeepSeek API 调用指南\n\n## 拿到 Key\n\n注册后控制台创建 API Key。\n\n## 调用\n\n```python\nimport openai\nclient = openai.OpenAI(base_url="https://api.deepseek.com", api_key="YOUR_KEY")\nprint(client.chat.completions.create(model="deepseek-chat", messages=[{"role":"user","content":"你好"}]))\n```', 3000, 112, 210, 3),

-- 13 DeepSeek / 实战应用
(13, '用 DeepSeek 写爆款文案的 5 个套路', '自媒体运营、短视频脚本一键生成。',
 '# 用 DeepSeek 写爆款文案\n\n1. 角色设定法\n2. 痛点开场法\n3. 清单体\n4. 对比体\n5. 故事体', 1800, 80, 160, 1),
(13, 'DeepSeek 帮你 10 倍提升办公效率', '写邮件、做表格、整理会议纪要的实战提示词。',
 '# DeepSeek 帮你提升办公效率\n\n- 邮件：给要点生成正式邮件\n- 表格：自然语言转公式\n- 会议：录音转结构化纪要', 1710, 75, 150, 2),
(13, 'DeepSeek + 编程：让 AI 帮你写代码', '从需求到上线，AI 辅助开发的完整闭环。',
 '# DeepSeek + 编程\n\n## 流程\n\n1. 自然语言描述需求\n2. AI 生成代码\n3. 本地运行调试\n4. 让 AI 修 Bug', 1700, 78, 155, 3),

-- 14 AI 编程 / Cursor
(14, '一文秒懂 Cursor 的正确姿势', '新手最容易踩的坑，以及正确打开方式。',
 '# 一文秒懂 Cursor\n\n## 核心心法\n\n- 小步快跑：一次只让它改一个文件\n- 给上下文：把相关文件都打开\n- 看 diff：每次改动都要 review', 2500, 110, 200, 1),
(14, 'Cursor 10 个实用技巧', '老手私藏的效率技巧合集。',
 '# Cursor 10 个实用技巧\n\n1. @Codebase 全局检索\n2. @Docs 引入文档\n3. 多光标编辑\n4. 终端内联 AI\n...', 2480, 108, 195, 2),
(14, 'Cursor 极限省钱大法', '不花冤枉钱用满额度的姿势。',
 '# Cursor 极限省钱大法\n\n- 用免费模型做简单任务\n- 善用本地模型兜底\n- 合理切账号', 2450, 87, 180, 3),

-- 15 AI 编程 / 零代码
(15, '用 DeepSeek 给对象做个网站', '零基础也能 30 分钟做出一个浪漫网站。',
 '# 给对象做个网站\n\n## 步骤\n\n1. 告诉 AI 主题与风格\n2. 让它生成 HTML\n3. 部署到免费托管\n4. 发链接给对方', 1600, 70, 150, 1),
(15, '零代码做一个亲戚关系计算器', '逢年过节再也不怕叫错人。',
 '# 亲戚关系计算器\n\n纯前端小工具，AI 生成逻辑 + 界面。', 1580, 66, 140, 2),
(15, '不会写代码，也能做小程序', '把想法变成可用的产品原型。',
 '# 不会写代码也能做小程序\n\n用 AI 生成原型页面 + 逻辑，快速验证点子。', 1200, 54, 120, 3),

-- 16 AI 编程 / 智能体与 MCP
(16, 'AI 智能体到底是什么', '从“聊天”到“帮你干活”的跨越。',
 '# AI 智能体\n\n智能体 = 大模型 + 记忆 + 工具调用 + 规划。\n\n它能自己拆解任务、调用工具、循环执行。', 1100, 50, 110, 1),
(16, '手搓一个 MCP 服务', '从 0 到 1 开发你的第一个 MCP Server。',
 '# 手搓 MCP 服务\n\n```python\nfrom mcp.server import Server\n# 注册工具...\n```', 1020, 48, 100, 2),
(16, '智能体实战：自动写周报', '把重复劳动交给 Agent。',
 '# 智能体实战：自动写周报\n\n定时拉取 git 提交 → 总结 → 生成周报 → 发邮件。', 1000, 52, 105, 3),

-- 17 AI 编程 / 大模型开发路线
(17, 'Spring AI 1.0 快速体验', 'Java 开发者接入大模型的最短路径。',
 '# Spring AI 1.0\n\n```java\nChatClient client = ...;\nString r = client.prompt("你好").call().content();\n```', 980, 44, 90, 1),
(17, 'Spring AI Alibaba 速览', '国产适配版的能力与差异。',
 '# Spring AI Alibaba\n\n在 Spring AI 基础上做了国内模型适配。', 900, 40, 85, 2),
(17, 'Claude Code 神级技巧', '把 Claude Code 当结对编程搭子。',
 '# Claude Code 神级技巧\n\n- /init 初始化项目上下文\n- 子 agent 并行任务\n- 权限精细化', 800, 36, 80, 3),

-- 18 AI 工具测评 / GPT-5
(18, 'GPT-5 能力边界实测', '哪些是真强，哪些是营销。',
 '# GPT-5 能力边界实测\n\n## 强项\n\n- 复杂推理\n- 代码生成\n\n## 短板\n\n- 实时信息\n- 长文档精确抽取', 2300, 95, 170, 1),
(18, 'GPT-5 vs Claude 4：编程谁更强', '同任务横向对比。',
 '# GPT-5 vs Claude 4\n\n| 维度 | GPT-5 | Claude 4 |\n| --- | --- | --- |\n| 推理 | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |\n| 代码 | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |', 2200, 90, 165, 2),
(18, 'GPT-5 接入成本测算', '到底贵不贵？',
 '# GPT-5 接入成本\n\n按 token 计费，批量调用有折扣。', 2100, 85, 160, 3),

-- 19 AI 工具测评 / Claude 4
(19, 'Claude 4 凭什么称最强编程 AI', '实测证据说话。',
 '# Claude 4 凭什么称最强编程 AI\n\n长上下文 + 强代码 + 稳定遵循指令。', 1850, 80, 150, 1),
(19, 'Claude 4 实战：重构老项目', '把一个遗留项目改得焕然一新。',
 '# Claude 4 实战：重构\n\n让它先读懂架构，再小步重构。', 1800, 78, 145, 2),
(19, 'Claude 4 极限省钱用法', '把额度用在刀刃上。',
 '# Claude 4 省钱用法\n\n- 简单任务用便宜模型\n- 长文件分块喂', 1750, 74, 140, 3),

-- 20 AI 工具测评 / Gemini 3.0
(20, 'Gemini 3.0 多模态能力实测', '图文音视频一把抓。',
 '# Gemini 3.0 多模态\n\n上传图片/音频直接对话，理解力强。', 1300, 60, 120, 1),
(20, 'Gemini 3.0 前端生成实测', '“前端又无了？”真实表现。',
 '# Gemini 3.0 前端\n\n一句话生成完整页面，质量可观。', 1250, 58, 115, 2),
(20, 'Gemini 3.0 适合什么场景', '选型建议。',
 '# Gemini 3.0 选型\n\n多模态理解、长文档、跨语言首选。', 1200, 55, 110, 3);
