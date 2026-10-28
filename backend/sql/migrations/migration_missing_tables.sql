-- 补齐「未纳入版本管理的线上存量表」
-- 背景：ai_column_category / ai_column / ai_article / ai_comment 四张表在线上库已存在，
--       但 schema.sql 与 migrations/ 中均无建表语句，导致新环境从零初始化会缺表，
--       知识库（列表/详情）、评论、消息中心全线不可用。
-- 策略：CREATE TABLE IF NOT EXISTS —— 已存在的线上库重复执行安全，不重建、不清数据。
--
-- 执行（服务器上）：
--   docker exec -i ai-nav-mysql mysql -uroot -p"$MYSQL_ROOT_PASSWORD" ai_nav < migration_missing_tables.sql

-- 1. 知识库分类
CREATE TABLE IF NOT EXISTS ai_column_category (
    id          BIGINT      PRIMARY KEY AUTO_INCREMENT,
    name        VARCHAR(64) NOT NULL DEFAULT '' COMMENT '分类名称（新手入门 / DeepSeek / AI 编程 ...）',
    sort        INT         DEFAULT 0 COMMENT '排序，越小越靠前',
    description VARCHAR(256) DEFAULT '' COMMENT '分类描述',
    KEY idx_sort (sort)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='AI 知识库分类';

-- 2. 知识库专栏
CREATE TABLE IF NOT EXISTS ai_column (
    id            BIGINT       PRIMARY KEY AUTO_INCREMENT,
    title         VARCHAR(128) NOT NULL DEFAULT '' COMMENT '专栏标题',
    description   VARCHAR(512) DEFAULT '' COMMENT '专栏简介',
    cover_color   VARCHAR(32)  DEFAULT '' COMMENT '封面色值（如 #3874F7），前端生成渐变封面',
    category_id   BIGINT       DEFAULT NULL COMMENT '所属分类 id（关联 ai_column_category.id）',
    category_name VARCHAR(64)  DEFAULT '' COMMENT '分类名称冗余，列表直接展示',
    tags          VARCHAR(256) DEFAULT '' COMMENT '标签，逗号分隔，用于标签云',
    need_vip      TINYINT      DEFAULT 0 COMMENT '是否免费：0 免费 / 1 会员',
    article_count INT          DEFAULT 0 COMMENT '文章数（冗余，发布文章时维护）',
    view_num      BIGINT       DEFAULT 0 COMMENT '阅读量',
    like_num      BIGINT       DEFAULT 0 COMMENT '点赞数',
    collect_num   BIGINT       DEFAULT 0 COMMENT '收藏数',
    sort          INT          DEFAULT 0 COMMENT '排序，越小越靠前',
    status        TINYINT      DEFAULT 1 COMMENT '状态：0 下架 / 1 已发布',
    create_time   DATETIME     DEFAULT CURRENT_TIMESTAMP,
    update_time   DATETIME     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    KEY idx_category (category_id),
    KEY idx_status_sort (status, sort)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='AI 知识库专栏';

-- 3. 知识库文章
CREATE TABLE IF NOT EXISTS ai_article (
    id          BIGINT       PRIMARY KEY AUTO_INCREMENT,
    column_id   BIGINT       DEFAULT NULL COMMENT '所属专栏 id（关联 ai_column.id）',
    title       VARCHAR(256) NOT NULL DEFAULT '' COMMENT '文章标题',
    summary     VARCHAR(512) DEFAULT '' COMMENT '文章摘要（列表展示）',
    content     MEDIUMTEXT   COMMENT '正文（markdown）',
    cover_url   VARCHAR(512) DEFAULT '' COMMENT '封面 url，可空（空则前端生成色块）',
    view_num    BIGINT       DEFAULT 0 COMMENT '阅读量',
    like_num    BIGINT       DEFAULT 0 COMMENT '点赞数',
    collect_num BIGINT       DEFAULT 0 COMMENT '收藏数',
    sort        INT          DEFAULT 0 COMMENT '排序，越小越靠前',
    status      TINYINT      DEFAULT 0 COMMENT '状态：0 草稿 / 1 已发布',
    create_time DATETIME     DEFAULT CURRENT_TIMESTAMP,
    update_time DATETIME     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    KEY idx_column (column_id),
    KEY idx_status_sort (status, sort)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='AI 知识库文章';

-- 4. 通用评论（当前用于知识库文章；target_type 预留 post 扩展）
CREATE TABLE IF NOT EXISTS ai_comment (
    id          BIGINT       PRIMARY KEY AUTO_INCREMENT,
    target_type VARCHAR(32)  NOT NULL DEFAULT 'article' COMMENT '评论目标类型：article / post',
    target_id   BIGINT       DEFAULT NULL COMMENT '评论目标 id',
    user_id     BIGINT       DEFAULT NULL COMMENT '评论用户 id',
    user_name   VARCHAR(64)  DEFAULT '' COMMENT '评论人昵称（冗余，避免频繁 join）',
    user_avatar VARCHAR(512) DEFAULT '' COMMENT '评论人头像（冗余）',
    content     VARCHAR(1024) DEFAULT '' COMMENT '评论内容',
    parent_id   BIGINT       DEFAULT 0 COMMENT '父评论 id，0 表示顶级评论',
    like_num    BIGINT       DEFAULT 0 COMMENT '点赞数',
    status      TINYINT      DEFAULT 1 COMMENT '状态：0 已删除 / 1 正常',
    create_time DATETIME     DEFAULT CURRENT_TIMESTAMP,
    KEY idx_target (target_type, target_id),
    KEY idx_user (user_id),
    KEY idx_parent (parent_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='通用评论';
