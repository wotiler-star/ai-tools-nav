-- 红框对齐 v2：增加 category.cloud_count 字段，控制每个分类在全局混合标签云中出现的标签数
-- 配额依据：参考目标 ai.codefather.cn/tool 全局标签云的精选（约 20 个）
-- 1 AI写作=4 / 2 AI图像=4 / 3 AI视频创作=0 / 4 AI办公=7 / 5 AI开发平台=1 / 6 AI智能体=1
-- 7 AI聊天对话=0 / 8 AI音频音乐=1 / 9 AI商业设计=0 / 10 AI大模型=0 / 11 AI学习平台=0
-- 12 AI搜索引擎=0 / 13 AI内容检测=0 / 14 AI应用=1
-- 合计 4+4+0+7+1+1+0+1+0+0+0+0+0+1 = 19 个全局云标签

SET NAMES utf8mb4;

-- 幂等：先加列（如果不存在）
SET @col := (SELECT COUNT(*) FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'category' AND COLUMN_NAME = 'cloud_count');
SET @sql := IF(@col = 0, 'ALTER TABLE category ADD COLUMN cloud_count INT NOT NULL DEFAULT 1 COMMENT "全局标签云配额" AFTER tags', 'SELECT 1');
PREPARE s FROM @sql; EXECUTE s; DEALLOCATE PREPARE s;

-- 设置每个分类的配额
UPDATE category SET cloud_count = 4 WHERE id IN (1, 2);
UPDATE category SET cloud_count = 7 WHERE id = 4;
UPDATE category SET cloud_count = 1 WHERE id IN (5, 6, 8, 14);
UPDATE category SET cloud_count = 0 WHERE id IN (3, 7, 9, 10, 11, 12, 13);

-- 验证
SELECT id, name, cloud_count FROM category ORDER BY sort;