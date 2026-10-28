-- ============================================
-- Toolly 导航：补齐「参考站红框」内容
-- (1) 改名匹配参考站的笔灵AI写作
-- (2) 给 9 个空分类补子标签，让它们也出现 ▾ 下拉
-- (3) 插入 9 个目标红框论文写作工具（10 个含改名后的笔灵AI写作）
-- ============================================

-- (1) 重命名匹配参考站
UPDATE ai_tool SET name = '笔灵AI写作' WHERE id = 51;

-- (2) 给 9 个空分类补子标签
UPDATE category SET tags = 'AI视频生成,AI文字转视频,AI视频剪辑,AI数字人,AI短视频,AI视频特效,AI视频配音,AI视频翻译' WHERE id = 3;
UPDATE category SET tags = 'AI智能体平台,AI数字员工,AI客服机器人,AI销售助手,AI Agent框架,AI智能体搭建,AI工作流,AI插件工具' WHERE id = 6;
UPDATE category SET tags = 'AI聊天助手,AI对话机器人,AI陪伴,AI角色对话,AI心理咨询,AI语音助手,AI社交聊天,AI企业对话' WHERE id = 7;
UPDATE category SET tags = 'AI文字转语音,AI音乐生成,AI配音,AI语音克隆,AI有声书,AI音频处理,AI语音识别,AI歌声合成' WHERE id = 8;
UPDATE category SET tags = 'AI Logo设计,AI名片设计,AI海报设计,AI PPT设计,AI UI设计,AI品牌设计,AI包装设计,AI 3D设计' WHERE id = 9;
UPDATE category SET tags = 'AI课程平台,AI编程学习,AI英语学习,AI儿童教育,AI考试辅导,AI论文写作学习,AI技能学习,AI学习社区' WHERE id = 11;
UPDATE category SET tags = 'AI搜索,AI语义搜索,AI问答,AI知识检索,AI企业搜索,AI学术搜索,AI代码搜索,AI垂直搜索' WHERE id = 12;
UPDATE category SET tags = 'AI内容审核,AI内容检测,AIGC检测,AI鉴伪,AI原创检测,AI文本检测,AI图像检测,AI视频检测' WHERE id = 13;
UPDATE category SET tags = 'AI行业应用,AI办公应用,AI教育应用,AI医疗应用,AI金融应用,AI营销应用,AI法律应用,AI政务应用' WHERE id = 14;

-- (3) 插入 9 个目标红框论文工具（全部进 AI写作 category_id=1）
INSERT INTO ai_tool (name, description, url, category_id, tags, heat, is_recommended, is_hot) VALUES
('有道写作', '网易有道词典APP，手写英文写作习语助手，AI智能写作平台', 'https://write.youdao.com', 1, 'AI写作工具,AI论文写作', 6800, 1, 0),
('稿定AI文案', '稿定智能推出的AI文案工具，一键生成高质量营销/论文/小红书文案', 'https://ai.gaoding.com', 1, 'AI写作工具,AI论文写作,AI小红书文案', 6500, 1, 0),
('万彩AI', '一款由广州万彩信息技术有限公司推出的AI写作工具，支持论文/营销/公文', 'https://www.uncai.com', 1, 'AI写作工具,AI论文写作,AI公文', 5500, 0, 0),
('析易-AI论文_数据分析', 'AI论文辅助、文稿综述、SCI论文写作、学术数据分析', 'https://www.xiyi.com', 1, 'AI写作工具,AI论文写作,AI总结摘要', 4500, 0, 0),
('PaperFake AI写论文', '一键AI生成3万字论文，低重复率，多学科覆盖', 'https://paperfake.cn', 1, 'AI写作工具,AI论文写作', 4200, 0, 0),
('心文AI', '提供AI智能写作服务的平台，论文/作文/营销文案一键生成', 'https://www.xinwenai.com', 1, 'AI写作工具,AI论文写作,AI小说', 4800, 0, 0),
('满血DeepSeek-问小白', '免费无限量使用DeepSeek R1模型的智能助手，论文写作与问答', 'https://wenxiaobai.com', 1, 'AI写作工具,AI论文写作,AI大语言模型', 9500, 1, 1),
('千笔AI论文-AIPaperPass', 'AIPaperPass是全网首家免费改稿AI论文平台，千字极速生成', 'https://www.aipaperpass.com', 1, 'AI写作工具,AI论文写作', 5200, 0, 0),
('AI内容管家-免费100稿', 'AI驱动的SEO挖词、写作、发布工具，免费生成100篇稿件', 'https://www.aicontentmaster.com', 1, 'AI写作工具,AI提示词', 4600, 0, 0);