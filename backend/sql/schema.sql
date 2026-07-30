-- AI 导航站数据库 schema（MySQL 8）
-- 执行：mysql -uroot -p ai_nav < schema.sql

CREATE DATABASE IF NOT EXISTS ai_nav DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE ai_nav;

-- 分类
DROP TABLE IF EXISTS category;
CREATE TABLE category (
    id    BIGINT PRIMARY KEY AUTO_INCREMENT,
    name  VARCHAR(64)  NOT NULL,
    icon  VARCHAR(32)  DEFAULT '',
    sort  INT          DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- AI 工具
DROP TABLE IF EXISTS ai_tool;
CREATE TABLE ai_tool (
    id            BIGINT PRIMARY KEY AUTO_INCREMENT,
    name          VARCHAR(128) NOT NULL,
    logo          VARCHAR(512) DEFAULT '',
    description   VARCHAR(512) DEFAULT '',
    url           VARCHAR(512) DEFAULT '',
    category_id   BIGINT,
    tags          VARCHAR(256) DEFAULT '',
    heat          INT DEFAULT 0,
    is_recommended TINYINT(1) DEFAULT 0,
    is_hot        TINYINT(1) DEFAULT 0,
    create_time   DATETIME DEFAULT CURRENT_TIMESTAMP,
    update_time   DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- AI 社区帖子
DROP TABLE IF EXISTS ai_post;
CREATE TABLE ai_post (
    id           BIGINT PRIMARY KEY AUTO_INCREMENT,
    title        VARCHAR(256) NOT NULL,
    content      TEXT,
    author_name  VARCHAR(64)  DEFAULT '',
    author_avatar VARCHAR(512) DEFAULT '',
    thumb_url    VARCHAR(512) DEFAULT '',
    create_time  DATETIME DEFAULT CURRENT_TIMESTAMP,
    view_num     BIGINT DEFAULT 0,
    like_num     BIGINT DEFAULT 0,
    comment_num  BIGINT DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- AI 提示词
DROP TABLE IF EXISTS ai_prompt;
CREATE TABLE ai_prompt (
    id           BIGINT PRIMARY KEY AUTO_INCREMENT,
    title        VARCHAR(256) NOT NULL,
    content      TEXT,
    category_name VARCHAR(64) DEFAULT '',
    use_count    BIGINT DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 用户
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
    id            BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_account  VARCHAR(64)  NOT NULL DEFAULT '' COMMENT '登录账号',
    user_password VARCHAR(128) NOT NULL DEFAULT '' COMMENT '加盐 MD5 密码',
    user_name     VARCHAR(64)  DEFAULT '',
    user_avatar   VARCHAR(512) DEFAULT '',
    user_profile  VARCHAR(512) DEFAULT '',
    phone         VARCHAR(32)  DEFAULT '',
    email         VARCHAR(128) DEFAULT '',
    role          VARCHAR(32)  DEFAULT 'user',
    create_time   DATETIME DEFAULT CURRENT_TIMESTAMP,
    update_time   DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uk_user_account (user_account)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 初始管理员账号：admin / 12345678（密码为加盐 MD5，salt=ai_nav）
INSERT INTO `user` (user_account, user_password, user_name, role) VALUES
('admin', MD5(CONCAT('ai_nav','12345678')), '管理员', 'admin');

-- ===== 初始分类数据（11 大类） =====
INSERT INTO category (name, icon, sort) VALUES
('对话','💬',1),('绘画','🎨',2),('写作','✍️',3),('视频','🎬',4),('音频','🔊',5),
('编程','💻',6),('办公','📊',7),('设计','🖌️',8),('搜索','🔍',9),('开发平台','🧩',10),('学习','📚',11);

-- ===== 示例工具数据 =====
INSERT INTO ai_tool (name, logo, description, url, category_id, tags, heat, is_recommended, is_hot) VALUES
('ChatGPT','', 'OpenAI 出品，最强通用对话 AI', 'https://chat.openai.com', 1, '聊天,GPT-4', 9999, 1, 1),
('Claude','', 'Anthropic 出品，长文本理解强', 'https://claude.ai', 1, '长文本,写作', 8800, 1, 1),
('Midjourney','', '最强 AI 绘画', 'https://midjourney.com', 2, '绘画,艺术', 9500, 1, 1),
('Stable Diffusion','', '开源绘画模型', 'https://stability.ai', 2, '开源,本地', 8700, 1, 1),
('GitHub Copilot','', 'VS Code AI 结对编程', 'https://github.com/features/copilot', 6, '补全,IDE', 9400, 1, 1),
('Cursor','', 'AI 原生编辑器', 'https://cursor.com', 6, '编辑器,Agent', 9000, 1, 1),
('Perplexity','', 'AI 搜索引擎', 'https://perplexity.ai', 9, '搜索,引用', 8800, 1, 1),
('Suno','', 'AI 音乐生成', 'https://suno.com', 5, '音乐,生成', 8600, 1, 1),
('Runway','', 'AI 视频生成', 'https://runwayml.com', 4, '生成,剪辑', 8300, 1, 1),
('Coze','', '字节 AI Bot 搭建平台', 'https://coze.com', 10, 'Bot,字节', 7600, 1, 1);
