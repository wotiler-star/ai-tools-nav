-- ===== AI 导航站 H2 初始化脚本（由 gen_h2_schema.py 生成，勿手改） =====
-- H2 MySQL 兼容模式；数据与前端 mockData.ts 保持一致
-- 注意：DDL 必须与 com.ainav.model.entity 下的实体字段保持同步，
--       否则本地(local) profile 启动后对应接口会报 Column/Table not found。

DROP TABLE IF EXISTS category;
CREATE TABLE category (
    id          BIGINT PRIMARY KEY AUTO_INCREMENT,
    name        VARCHAR(64)  NOT NULL,
    icon        VARCHAR(32)  DEFAULT '',
    sort        INT          DEFAULT 0,
    tags        VARCHAR(512) DEFAULT '',
    cloud_count INT          DEFAULT 0
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
    is_recommended BOOLEAN DEFAULT FALSE,
    is_hot         BOOLEAN DEFAULT FALSE,
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
    comment_num   BIGINT DEFAULT 0,
    user_id       BIGINT DEFAULT 0
);

DROP TABLE IF EXISTS ai_prompt;
CREATE TABLE ai_prompt (
    id            BIGINT PRIMARY KEY AUTO_INCREMENT,
    title         VARCHAR(256) NOT NULL,
    content       TEXT,
    category_name VARCHAR(64) DEFAULT '',
    use_count     BIGINT DEFAULT 0,
    user_id       BIGINT DEFAULT 0
);

DROP TABLE IF EXISTS "user";
CREATE TABLE "user" (
    id              BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_account    VARCHAR(64)  NOT NULL DEFAULT '',
    user_password   VARCHAR(128) NOT NULL DEFAULT '',
    user_name       VARCHAR(64)  DEFAULT '',
    user_avatar     VARCHAR(512) DEFAULT '',
    user_profile    VARCHAR(512) DEFAULT '',
    phone           VARCHAR(32)  DEFAULT '',
    email           VARCHAR(128) DEFAULT '',
    role            VARCHAR(32)  DEFAULT 'user',
    points          BIGINT       DEFAULT 0,
    level           INT          DEFAULT 1,
    vip_type        INT          DEFAULT 0,
    vip_expire_time TIMESTAMP,
    create_time     TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
    update_time     TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uk_user_account UNIQUE (user_account)
);

-- ===== AI 知识库：分类 =====
DROP TABLE IF EXISTS ai_column_category;
CREATE TABLE ai_column_category (
    id          BIGINT PRIMARY KEY AUTO_INCREMENT,
    name        VARCHAR(64) DEFAULT '',
    sort        INT         DEFAULT 0,
    description VARCHAR(512) DEFAULT ''
);

-- ===== AI 知识库：专栏 =====
DROP TABLE IF EXISTS ai_column;
CREATE TABLE ai_column (
    id            BIGINT PRIMARY KEY AUTO_INCREMENT,
    title         VARCHAR(256) DEFAULT '',
    description   VARCHAR(512) DEFAULT '',
    cover_color   VARCHAR(32)  DEFAULT '',
    category_id   BIGINT,
    category_name VARCHAR(64)  DEFAULT '',
    tags          VARCHAR(256) DEFAULT '',
    need_vip      INT          DEFAULT 0,
    article_count INT          DEFAULT 0,
    view_num      BIGINT       DEFAULT 0,
    like_num      BIGINT       DEFAULT 0,
    collect_num   BIGINT       DEFAULT 0,
    sort          INT          DEFAULT 0,
    status        INT          DEFAULT 1,
    create_time   TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
    update_time   TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
);

-- ===== AI 知识库：文章 =====
DROP TABLE IF EXISTS ai_article;
CREATE TABLE ai_article (
    id          BIGINT PRIMARY KEY AUTO_INCREMENT,
    column_id   BIGINT,
    title       VARCHAR(256) DEFAULT '',
    summary     VARCHAR(512) DEFAULT '',
    content     TEXT,
    cover_url   VARCHAR(512) DEFAULT '',
    view_num    BIGINT       DEFAULT 0,
    like_num    BIGINT       DEFAULT 0,
    collect_num BIGINT       DEFAULT 0,
    sort        INT          DEFAULT 0,
    status      INT          DEFAULT 1,
    create_time TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
    update_time TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
);

-- ===== 通用评论 =====
DROP TABLE IF EXISTS ai_comment;
CREATE TABLE ai_comment (
    id          BIGINT PRIMARY KEY AUTO_INCREMENT,
    target_type VARCHAR(32) DEFAULT '',
    target_id   BIGINT,
    user_id     BIGINT,
    user_name   VARCHAR(64)  DEFAULT '',
    user_avatar VARCHAR(512) DEFAULT '',
    content     TEXT,
    parent_id   BIGINT       DEFAULT 0,
    like_num    BIGINT       DEFAULT 0,
    status      INT          DEFAULT 1,
    create_time TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO category (id, name, icon, sort, tags) VALUES
(1, 'AI写作', '✍️', 1, 'AI写作工具,AI小红书文案,AI小说,AI论文写作,AI总结摘要,AI提示词,AIGC检测,AI公文,AI标书写作,AI论文查重,AI阅读,降AIGC率'),
(2, 'AI图像', '🎨', 2, '常用AI图像工具,AI图片优化修复,AI图片背景移除,AI图片无损放大,AI 3D模型生成,AI商品图生成,AI图片插画生成,AI图片物体抹除'),
(3, 'AI视频创作', '🎬', 3, ''),
(4, 'AI办公', '📊', 4, 'AI PPT,AI文档工具,AI思维导图,AI表格数据处理,AI语言翻译,AI会议工具,AI招聘求职,AI效率提升,AI法律助手'),
(5, 'AI开发平台', '💻', 5, 'AI编程工具,AI开源项目,AI开发框架,AI开放平台,AI训练模型,AI-SQL数据库,AI低(无)代码编程,AI国际导航,AI开发课堂'),
(6, 'AI智能体', '🤖', 6, ''),
(7, 'AI聊天对话', '💬', 7, ''),
(8, 'AI音频音乐', '🔊', 8, ''),
(9, 'AI商业设计', '🖌️', 9, ''),
(10, 'AI大模型', '🧠', 10, 'AI大语言模型,AI视觉大模型,AI视频大模型,AI语音大模型,AI多模态大模型,AI大模型评测,AI海外大模型,AI行业大模型'),
(11, 'AI学习平台', '📚', 11, ''),
(12, 'AI搜索引擎', '🔍', 12, ''),
(13, 'AI内容检测', '🛡️', 13, ''),
(14, 'AI应用', '🧩', 14, '');

INSERT INTO ai_tool (id, name, logo, description, url, category_id, tags, heat, is_recommended, is_hot) VALUES
(13, 'Notion AI', '', '笔记与文档中的 AI 写作助手。', 'https://notion.so', 1, '笔记,效率', 8200, 1, 1),
(14, '秘塔写作猫', '', '中文纠错、改写、续写一体。', 'https://xiezuocat.com', 1, '中文,纠错', 6400, 0, 0),
(15, '火山写作', '', '字节出品免费 AI 写作。', 'https://writing.volcengine.com', 1, '中文,字节', 5200, 0, 0),
(16, 'Jasper', '', '海外营销文案 AI 写作工具。', 'https://jasper.ai', 1, '营销,英文', 4800, 0, 0),
(17, 'Grammarly', '', '英文语法与润色助手。', 'https://grammarly.com', 1, '英文,润色', 6100, 0, 0),
(18, 'Effidit 易撰', '', '腾讯出品写作辅助。', 'https://effidit.com', 1, '中文,腾讯', 4300, 0, 0),
(7, 'Midjourney', '', '最强 AI 绘画，艺术质感与出图质量标杆。', 'https://midjourney.com', 2, '绘画,艺术', 9500, 1, 1),
(8, 'Stable Diffusion', '', '开源绘画模型，可本地部署自由定制。', 'https://stability.ai', 2, '开源,本地', 8700, 1, 1),
(9, 'DALL·E 3', '', 'OpenAI 绘画，与 ChatGPT 深度集成。', 'https://openai.com/dall-e-3', 2, 'OpenAI,集成', 7800, 0, 1),
(10, '即梦 AI', '', '字节跳动出品，中文绘画与视频生成。', 'https://jimeng.jianying.com', 2, '中文,字节', 6900, 0, 0),
(11, '通义万相', '', '阿里通义绘画，国风与商业设计友好。', 'https://tongyi.aliyun.com/wanxiang', 2, '中文,阿里', 6000, 0, 0),
(12, '文心一格', '', '百度文心绘画，国风风格突出。', 'https://yige.baidu.com', 2, '中文,国风', 5600, 0, 0),
(19, 'Runway', '', 'AI 视频生成与剪辑，Gen-2 模型领先。', 'https://runwayml.com', 3, '生成,剪辑', 8300, 1, 1),
(20, 'Pika', '', 'AI 文生视频，动效自然。', 'https://pika.art', 3, '生成,动效', 7900, 1, 1),
(21, '可灵', '', '快手出品高清视频生成。', 'https://klingai.kuaishou.com', 3, '中文,快手', 7400, 0, 1),
(22, '即梦视频', '', '字节 AI 视频生成。', 'https://jimeng.jianying.com', 3, '中文,字节', 6800, 0, 0),
(23, 'HeyGen', '', 'AI 数字人视频口播。', 'https://heygen.com', 3, '数字人,口播', 5900, 0, 0),
(24, 'D-ID', '', '让照片开口说话的 AI 视频。', 'https://d-id.com', 3, '数字人,照片', 5100, 0, 0),
(36, '钉钉 AI', '', '办公协同中的 AI 助手。', 'https://dingtalk.com', 4, '协同,办公', 6200, 0, 0),
(37, '飞书智能伙伴', '', '字节办公 AI 助手。', 'https://feishu.cn', 4, '协同,字节', 6000, 0, 0),
(38, 'WPS AI', '', 'WPS 文档 AI 能力。', 'https://wps.cn', 4, '文档,金山', 5700, 0, 0),
(39, 'ChatPDF', '', '和 PDF 对话，快速提炼要点。', 'https://chatpdf.com', 4, 'PDF,阅读', 6800, 0, 1),
(40, 'Gamma', '', 'AI 一键生成 PPT。', 'https://gamma.app', 4, 'PPT,生成', 7100, 1, 1),
(30, 'GitHub Copilot', '', 'VS Code 中的 AI 结对编程。', 'https://github.com/features/copilot', 5, '补全,IDE', 9400, 1, 1),
(31, 'Cursor', '', 'AI 原生编辑器，懂整个代码库。', 'https://cursor.com', 5, '编辑器,Agent', 9000, 1, 1),
(32, '通义灵码', '', '阿里 AI 编程助手。', 'https://tongyi.aliyun.com/lingma', 5, '中文,阿里', 6600, 0, 0),
(33, 'CodeGeeX', '', '智谱 AI 编程助手。', 'https://codegeex.cn', 5, '中文,智谱', 5800, 0, 0),
(34, 'Codeium', '', '免费 AI 代码补全。', 'https://codeium.com', 5, '免费,补全', 6300, 0, 0),
(35, 'Tabnine', '', '企业级 AI 代码补全。', 'https://tabnine.com', 5, '企业,补全', 4900, 0, 0),
(50, 'Coze 扣子', '', '字节 AI Bot / 智能体搭建平台。', 'https://coze.cn', 6, 'Bot,字节', 7600, 1, 1),
(51, 'Dify', '', '开源 LLM 应用与智能体开发平台。', 'https://dify.ai', 6, '开源,工作流', 7200, 1, 1),
(54, 'LangChain', '', '构建智能体与 LLM 应用的开发框架。', 'https://langchain.com', 6, '框架,开源', 6700, 0, 0),
(61, 'FastGPT', '', '开源知识库问答与智能体编排平台。', 'https://fastgpt.in', 6, '开源,知识库', 6100, 0, 1),
(62, 'MetaGPT', '', '多智能体协作软件公司框架。', 'https://github.com/geekan/MetaGPT', 6, '多智能体,开源', 5400, 0, 0),
(63, 'AutoGPT', '', '自主任务规划与执行的智能体框架。', 'https://agpt.co', 6, '自主,开源', 5000, 0, 0),
(1, 'ChatGPT', '', 'OpenAI 出品，最强通用对话 AI，支持联网、代码解释器。', 'https://chat.openai.com', 7, '聊天,GPT-4', 9999, 1, 1),
(2, 'Claude', '', 'Anthropic 出品，长文本理解与写作能力出众。', 'https://claude.ai', 7, '长文本,写作', 8800, 1, 1),
(3, '文心一言', '', '百度出品的中文大模型，中文理解能力强。', 'https://yiran.baidu.com', 7, '中文,百度', 7600, 0, 1),
(4, '通义千问', '', '阿里云出品，多模态对话助手。', 'https://tongyi.aliyun.com', 7, '中文,阿里', 7200, 0, 0),
(5, 'Kimi', '', '月之暗面出品，超长上下文（200 万字）对话。', 'https://kimi.moonshot.cn', 7, '长文本,搜索', 8100, 1, 1),
(6, '智谱清言', '', '智谱 AI 出品，GLM 大模型对话。', 'https://chatglm.cn', 7, '中文,GLM', 6500, 0, 0),
(25, 'Suno', '', 'AI 音乐生成，一句话写歌。', 'https://suno.com', 8, '音乐,生成', 8600, 1, 1),
(26, 'Udio', '', 'AI 音乐生成，音质出众。', 'https://udio.com', 8, '音乐,生成', 7000, 0, 1),
(27, 'ElevenLabs', '', '最强 AI 语音克隆与合成。', 'https://elevenlabs.io', 8, '语音,克隆', 7700, 1, 1),
(28, 'Fish Audio', '', '中文语音克隆。', 'https://fishaudio.com', 8, '中文,语音', 5400, 0, 0),
(29, 'Whisper', '', 'OpenAI 开源语音转文字。', 'https://openai.com/research/whisper', 8, '转写,开源', 6200, 0, 0),
(41, 'Canva 魔力工作室', '', '在线设计中的 AI 能力。', 'https://canva.com', 9, '设计,模板', 7000, 0, 1),
(42, '稿定设计', '', '中文在线设计工具。', 'https://gaoding.com', 9, '中文,电商', 5200, 0, 0),
(43, 'Pixso AI', '', '国产 UI 设计协作 + AI。', 'https://pixso.cn', 9, 'UI,协作', 4800, 0, 0),
(44, '即时 AI', '', '文本生成可编辑设计稿。', 'https://js.design', 9, 'UI,生成', 4600, 0, 0),
(45, 'Remove.bg', '', '一键抠图。', 'https://remove.bg', 9, '抠图,工具', 5900, 0, 0),
(52, '百度千帆', '', '百度大模型开发与调用平台。', 'https://qianfan.cloud.baidu.com', 10, '中文,百度', 6000, 0, 0),
(53, '阿里百炼', '', '阿里大模型服务平台。', 'https://bailian.console.aliyun.com', 10, '中文,阿里', 5600, 0, 0),
(64, 'DeepSeek', '', '深度求索出品，强推理开源大模型。', 'https://deepseek.com', 10, '中文,开源', 9100, 1, 1),
(65, 'GLM-4', '', '智谱 AI 旗舰大模型。', 'https://bigmodel.cn', 10, '中文,智谱', 7300, 1, 1),
(66, 'Llama', '', 'Meta 开源大模型系列。', 'https://llama.com', 10, '开源,Meta', 7000, 0, 1),
(67, '文心大模型', '', '百度文心系列大模型。', 'https://wenxin.baidu.com', 10, '中文,百度', 6400, 0, 0),
(55, 'Khanmigo', '', '可汗学院 AI 导师。', 'https://khanacademy.org', 11, '教育,导师', 4800, 0, 0),
(56, 'Question.AI', '', '作业答疑 AI。', 'https://question.ai', 11, '答疑,学生', 5200, 0, 0),
(57, 'Socratic', '', '谷歌出品学习助手。', 'https://socratic.org', 11, '教育,谷歌', 4300, 0, 0),
(58, '微软爱写作', '', '英语写作批改。', 'https://aimwriting.mtutor.engkoo.com', 11, '英语,批改', 4100, 0, 0),
(59, 'Hi Echo', '', '有道 AI 口语私教。', 'https://echos.163.com', 11, '口语,有道', 4500, 0, 0),
(46, 'Perplexity', '', 'AI 搜索引擎，带引用来源。', 'https://perplexity.ai', 12, '搜索,引用', 8800, 1, 1),
(47, '秘塔搜索', '', '中文 AI 搜索，无广告。', 'https://metaso.cn', 12, '中文,无广告', 7300, 1, 1),
(48, 'Devv AI', '', '面向开发者的 AI 搜索。', 'https://devv.ai', 12, '开发者,代码', 5500, 0, 0),
(49, 'Phind', '', '开发者问答搜索。', 'https://phind.com', 12, '开发者,问答', 5000, 0, 0),
(68, 'GPTZero', '', 'AIGC 文本检测，判断内容是否 AI 生成。', 'https://gptzero.me', 13, '检测,AIGC', 6300, 0, 1),
(69, '朱雀 AI 检测', '', '腾讯出品，图文 AIGC 检测。', 'https://matrix.tencent.com', 13, '中文,腾讯', 5500, 0, 0),
(70, 'Copyleaks', '', 'AI 内容与抄袭检测平台。', 'https://copyleaks.com', 13, '检测,抄袭', 4700, 0, 0),
(71, '妙鸭相机', '', 'AI 写真生成应用。', 'https://miaoya.aliyun.com', 14, '写真,阿里', 6600, 0, 1),
(72, '通义听悟', '', '阿里会议纪要/学习整理应用。', 'https://tongyi.aliyun.com/tingwu', 14, '中文,纪要', 5300, 0, 0),
(73, '讯飞听见', '', 'AI 实时转写与字幕应用。', 'https://iflyrec.com', 14, '转写,讯飞', 4900, 0, 0);

INSERT INTO "user" (id, user_account, user_password, user_name, role) VALUES
(1, 'admin', '0b9835153a177bb9be34675b9b929bb4', '管理员', 'admin');

INSERT INTO ai_post (title, content, author_name, view_num, like_num, comment_num, user_id) VALUES
('用 Cursor 一周撸完一个全栈项目的心得', '分享我用 AI 编辑器提效的完整工作流……', 'toolly', 1280, 96, 32, 1),
('DeepSeek 本地部署踩坑记录', '从显存到量化，把大模型跑在自己机器上的全过程。', '摸鱼学姐', 860, 61, 18, 1),
('提示词工程实战：让 AI 写出可用的营销文案', '结构化提示词模板与案例拆解。', 'AI 产品菌', 640, 44, 12, 1),
('2026 年最值得关注的 10 个 AI 智能体平台', '从 Coze 到 Dify 的横向评测。', '极客老王', 970, 73, 25, 1);

INSERT INTO ai_prompt (title, content, category_name, use_count, user_id) VALUES
('通用写作助手', '你是一位资深中文编辑，请帮我润色以下文字，使其更流畅专业：', '写作', 5200, 1),
('代码解释器', '请逐行解释下面这段代码的作用，并指出潜在问题：', '编程', 4800, 1),
('小红书文案生成', '请以小红书爆款风格，为以下产品写 3 条种草文案：', '营销', 6100, 1),
('英文邮件助手', '请把下面的中文改写成礼貌专业的商务英文邮件：', '办公', 3900, 1);

-- ===== 知识库示例数据 =====
INSERT INTO ai_column_category (id, name, sort, description) VALUES
(1, '新手入门', 1, 'AI 工具与概念零基础指南'),
(2, 'DeepSeek', 2, 'DeepSeek 系列模型使用与部署'),
(3, 'AI 编程', 3, '用 AI 提升编码效率'),
(4, 'AI 工具测评', 4, '热门 AI 工具横向评测');

INSERT INTO ai_column (id, title, description, cover_color, category_id, category_name, tags, need_vip, article_count, view_num, like_num, collect_num, sort, status) VALUES
(1, 'DeepSeek 从入门到精通', '系统讲解 DeepSeek 的能力边界与实战技巧。', '#3874F7', 2, 'DeepSeek', 'DeepSeek,大模型', 0, 2, 1200, 86, 40, 1, 1),
(2, 'AI 编程实战专栏', '用 Cursor、Copilot 等工具高效写代码。', '#22C55E', 3, 'AI 编程', 'Cursor,编程', 0, 1, 980, 70, 33, 2, 1);

INSERT INTO ai_article (id, column_id, title, summary, content, cover_url, view_num, like_num, collect_num, sort, status) VALUES
(1, 1, 'DeepSeek 本地部署踩坑记录', '从显存到量化的完整过程。', '这里是正文 markdown 内容……', '', 600, 40, 18, 1, 1),
(2, 1, 'DeepSeek 提示词技巧', '让回答更精准的 10 个技巧。', '正文 markdown 内容……', '', 540, 33, 15, 2, 1),
(3, 2, '用 Cursor 一周撸完全栈', 'AI 编辑器提效工作流。', '正文 markdown 内容……', '', 480, 28, 12, 1, 1);

INSERT INTO ai_comment (id, target_type, target_id, user_id, user_name, user_avatar, content, parent_id, like_num, status) VALUES
(1, 'article', 1, 1, '管理员', '', '写得很实用，已收藏！', 0, 5, 1),
(2, 'article', 1, 1, '管理员', '', '请问量化有推荐参数吗？', 0, 2, 1);

ALTER TABLE category ALTER COLUMN id RESTART WITH 100;
ALTER TABLE ai_tool ALTER COLUMN id RESTART WITH 200;
ALTER TABLE ai_post ALTER COLUMN id RESTART WITH 100;
ALTER TABLE ai_prompt ALTER COLUMN id RESTART WITH 100;
ALTER TABLE "user" ALTER COLUMN id RESTART WITH 100;
ALTER TABLE ai_column_category ALTER COLUMN id RESTART WITH 100;
ALTER TABLE ai_column ALTER COLUMN id RESTART WITH 100;
ALTER TABLE ai_article ALTER COLUMN id RESTART WITH 100;
ALTER TABLE ai_comment ALTER COLUMN id RESTART WITH 100;
