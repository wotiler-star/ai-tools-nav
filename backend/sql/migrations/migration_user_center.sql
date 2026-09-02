-- 用户中心上线迁移（针对已初始化的 MySQL，不重建表，保留现有数据）
-- 执行：mysql -uroot -p ai_nav < migration_user_center.sql

-- 用户表：会员字段
ALTER TABLE `user`
    ADD COLUMN points          BIGINT   DEFAULT 0  COMMENT '积分',
    ADD COLUMN level           INT      DEFAULT 1  COMMENT '成长等级',
    ADD COLUMN vip_type        TINYINT  DEFAULT 0  COMMENT '会员类型 0普通/1月度/2年度/3永久',
    ADD COLUMN vip_expire_time DATETIME DEFAULT NULL COMMENT '会员过期时间';

-- 社区帖子：归属用户
ALTER TABLE ai_post
    ADD COLUMN user_id BIGINT DEFAULT NULL COMMENT '发布用户 id';

-- 提示词：归属用户
ALTER TABLE ai_prompt
    ADD COLUMN user_id BIGINT DEFAULT NULL COMMENT '发布用户 id';

-- 收藏表（新增）
CREATE TABLE IF NOT EXISTS user_favorite (
    id            BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id       BIGINT     NOT NULL,
    target_type   VARCHAR(32) NOT NULL COMMENT 'tool / post / prompt',
    target_id     BIGINT     NOT NULL,
    target_title  VARCHAR(256) DEFAULT '',
    target_cover  VARCHAR(512) DEFAULT '',
    target_desc   VARCHAR(512) DEFAULT '',
    target_url    VARCHAR(512) DEFAULT '',
    create_time   DATETIME   DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uk_user_target (user_id, target_type, target_id),
    KEY idx_user (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 给前几条帖子/提示词归属到 admin（id=1），便于演示「我的帖子 / 我的提示词」
UPDATE ai_post SET user_id = 1 WHERE id <= 3 AND user_id IS NULL;
UPDATE ai_prompt SET user_id = 1 WHERE id <= 3 AND user_id IS NULL;
