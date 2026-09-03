-- 消息中心上线迁移（针对已初始化的 MySQL，不重建表，保留现有数据）
-- 执行（服务器上）：
--   docker exec -i ai-nav-mysql mysql -uroot -p"$MYSQL_ROOT_PASSWORD" ai_nav < migration_message_center.sql

CREATE TABLE IF NOT EXISTS ai_message (
    id               BIGINT       PRIMARY KEY AUTO_INCREMENT,
    user_id          BIGINT       NOT NULL COMMENT '接收消息的用户 id',
    type             VARCHAR(32)  NOT NULL DEFAULT 'comment' COMMENT 'comment 评论 / reply 回复 / system 系统',
    target_type      VARCHAR(32)  NOT NULL DEFAULT '' COMMENT 'post / article',
    target_id        BIGINT       DEFAULT NULL COMMENT '关联目标 id',
    target_title     VARCHAR(256) DEFAULT '' COMMENT '目标标题快照（目标被删后消息仍可读）',
    from_user_id     BIGINT       DEFAULT NULL COMMENT '触发者用户 id',
    from_user_name   VARCHAR(128) DEFAULT '' COMMENT '触发者昵称',
    from_user_avatar VARCHAR(512) DEFAULT '' COMMENT '触发者头像',
    content          VARCHAR(512) DEFAULT '' COMMENT '消息摘要（评论内容截断）',
    is_read          TINYINT      DEFAULT 0 COMMENT '0 未读 / 1 已读',
    create_time      DATETIME     DEFAULT CURRENT_TIMESTAMP,
    KEY idx_user (user_id),
    KEY idx_user_read (user_id, is_read),
    KEY idx_create (create_time)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
