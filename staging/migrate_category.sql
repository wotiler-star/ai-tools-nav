USE ai_nav;
SET NAMES utf8mb4;

-- 1) 加 tags 列（幂等：不存在才加）
SET @c = (SELECT COUNT(*) FROM information_schema.columns WHERE table_schema='ai_nav' AND table_name='category' AND column_name='tags');
SET @sql = IF(@c=0, 'ALTER TABLE category ADD COLUMN tags VARCHAR(512) NOT NULL DEFAULT '''' COMMENT ''二级子标签，逗号分隔（复刻目标站分类→子标签导航）''', 'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- 2) 先把现有 160 个工具按「旧分类名」映射到「新分类 id」（此时旧分类仍在）
UPDATE ai_tool t
JOIN category c ON t.category_id = c.id
SET t.category_id = CASE c.name
  WHEN '对话'     THEN 7
  WHEN '绘画'     THEN 2
  WHEN '写作'     THEN 1
  WHEN '视频'     THEN 3
  WHEN '音频'     THEN 8
  WHEN '编程'     THEN 5
  WHEN '办公'     THEN 4
  WHEN '设计'     THEN 9
  WHEN '搜索'     THEN 12
  WHEN '开发平台' THEN 5
  WHEN '学习'     THEN 11
  ELSE t.category_id
END;

-- 3) 清空旧分类，写入 14 个目标分类（与 ai.codefather.cn 100% 一致，含二级 tags）
DELETE FROM category;
ALTER TABLE category AUTO_INCREMENT = 1;
INSERT INTO category (id, name, icon, sort, tags) VALUES
(1,'AI写作','✍️',1,'AI写作工具,AI小红书文案,AI小说,AI论文写作,AI总结摘要,AI提示词,AIGC检测,AI公文,AI标书写作,AI论文查重,AI阅读,降AIGC率'),
(2,'AI图像','🎨',2,'常用AI图像工具,AI图片优化修复,AI图片背景移除,AI图片无损放大,AI 3D模型生成,AI商品图生成,AI图片插画生成,AI图片物体抹除'),
(3,'AI视频创作','🎬',3,''),
(4,'AI办公','📊',4,'AI PPT,AI文档工具,AI思维导图,AI表格数据处理,AI语言翻译,AI会议工具,AI招聘求职,AI效率提升,AI法律助手'),
(5,'AI开发平台','💻',5,'AI编程工具,AI开源项目,AI开发框架,AI开放平台,AI训练模型,AI-SQL数据库,AI低(无)代码编程,AI国际导航,AI开发课堂'),
(6,'AI智能体','🤖',6,''),
(7,'AI聊天对话','💬',7,''),
(8,'AI音频音乐','🔊',8,''),
(9,'AI商业设计','🖌️',9,''),
(10,'AI大模型','🧠',10,'AI大语言模型,AI视觉大模型,AI视频大模型,AI语音大模型,AI多模态大模型,AI大模型评测,AI海外大模型,AI行业大模型'),
(11,'AI学习平台','📚',11,''),
(12,'AI搜索引擎','🔍',12,''),
(13,'AI内容检测','🛡️',13,''),
(14,'AI应用','🧩',14,'');

-- 4) 核验：列出每个分类的工具数
SELECT id, name, (SELECT COUNT(*) FROM ai_tool WHERE category_id=category.id) AS tool_cnt FROM category ORDER BY id;
SELECT 'TOTAL_TOOLS' AS k, COUNT(*) AS v FROM ai_tool;
