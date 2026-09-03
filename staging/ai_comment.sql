-- ============================================================
-- AI 知识库文章评论表（通用评论，targetType = article / post）
-- 用 CREATE TABLE IF NOT EXISTS，避免冲掉已有的知识库数据
-- ============================================================

CREATE TABLE IF NOT EXISTS ai_comment (
  id           BIGINT       NOT NULL AUTO_INCREMENT,
  target_type  VARCHAR(32)  NOT NULL DEFAULT 'article',
  target_id    BIGINT       NOT NULL,
  user_id      BIGINT       DEFAULT NULL,
  user_name    VARCHAR(128) DEFAULT '',
  user_avatar  VARCHAR(512) DEFAULT '',
  content      VARCHAR(1024) NOT NULL,
  parent_id    BIGINT       DEFAULT 0,
  like_num     BIGINT       DEFAULT 0,
  status       INT          DEFAULT 1,
  create_time  DATETIME     DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_target (target_type, target_id),
  KEY idx_create (create_time)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 演示评论（挂在文章 id=1 下，前端详情页能看到）
INSERT INTO ai_comment (target_type, target_id, user_id, user_name, user_avatar, content, parent_id, like_num, status)
VALUES
  ('article', 1, 1, 'admin', '', '讲得很清晰，收藏了，跟着做一遍。', 0, 12, 1),
  ('article', 1, 2, '星河', '', '请问 DeepSeek 本地部署对显卡显存有要求吗？', 0, 3, 1),
  ('article', 3, 1, 'admin', '', 'Cursor 的 Tab 自动补全确实好用，强烈推荐。', 0, 8, 1);
