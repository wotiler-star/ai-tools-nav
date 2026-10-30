SET NAMES utf8mb4;
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
    sort  INT          DEFAULT 0,
    tags  VARCHAR(512) DEFAULT '' COMMENT '二级子标签，逗号分隔（分类→子标签导航）'
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
    comment_num  BIGINT DEFAULT 0,
    user_id      BIGINT DEFAULT NULL COMMENT '发布用户 id'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- AI 提示词
DROP TABLE IF EXISTS ai_prompt;
CREATE TABLE ai_prompt (
    id           BIGINT PRIMARY KEY AUTO_INCREMENT,
    title        VARCHAR(256) NOT NULL,
    content      TEXT,
    category_name VARCHAR(64) DEFAULT '',
    use_count    BIGINT DEFAULT 0,
    user_id      BIGINT DEFAULT NULL COMMENT '发布用户 id'
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
    points        BIGINT        DEFAULT 0 COMMENT '积分',
    level         INT           DEFAULT 1 COMMENT '成长等级',
    vip_type      TINYINT       DEFAULT 0 COMMENT '会员类型 0普通/1月度/2年度/3永久',
    vip_expire_time DATETIME     DEFAULT NULL COMMENT '会员过期时间',
    create_time   DATETIME DEFAULT CURRENT_TIMESTAMP,
    update_time   DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uk_user_account (user_account)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 初始管理员账号：admin / 12345678（密码为加盐 MD5，salt=ai_nav）
INSERT INTO `user` (user_account, user_password, user_name, role) VALUES
('admin', MD5(CONCAT('ai_nav','12345678')), '管理员', 'admin');

-- 用户收藏（工具 / 帖子 / 提示词）
DROP TABLE IF EXISTS user_favorite;
CREATE TABLE user_favorite (
    id            BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id       BIGINT      NOT NULL,
    target_type   VARCHAR(32) NOT NULL COMMENT 'tool / post / prompt',
    target_id     BIGINT      NOT NULL,
    target_title  VARCHAR(256) DEFAULT '',
    target_cover  VARCHAR(512) DEFAULT '',
    target_desc   VARCHAR(512) DEFAULT '',
    target_url    VARCHAR(512) DEFAULT '',
    create_time   DATETIME    DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uk_user_target (user_id, target_type, target_id),
    KEY idx_user (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ===== 初始分类数据（14 大类，名称/图标/顺序/二级 tags） =====
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

-- ===== 示例工具数据 =====
INSERT INTO ai_tool (name, logo, description, url, category_id, tags, heat, is_recommended, is_hot) VALUES
('ChatGPT','', 'OpenAI 出品的通用对话 AI，全球用户量最大的聊天模型', 'https://chat.openai.com', 7, '聊天,GPT-4', 9999, 1, 1),
('Claude','', 'Anthropic 出品，以长文本理解与严谨推理见长的对话模型', 'https://claude.ai', 7, '长文本,写作', 8800, 1, 1),
('Midjourney','', 'Midjourney 出品，主打高质感 AI 绘画与艺术创作', 'https://midjourney.com', 2, '绘画,艺术', 9500, 1, 1),
('Stable Diffusion','', 'Stability AI 开源扩散模型，可本地部署与微调', 'https://stability.ai', 2, '开源,本地', 8700, 1, 1),
('GitHub Copilot','', 'GitHub 与 OpenAI 联合推出的 IDE 代码补全', 'https://github.com/features/copilot', 5, '补全,IDE', 9400, 1, 1),
('Cursor','', 'AI 原生代码编辑器，支持对话式重构与多文件编辑', 'https://cursor.com', 5, '编辑器,Agent', 9000, 1, 1),
('Perplexity','', 'AI 搜索问答引擎，回答附带来源引用', 'https://perplexity.ai', 12, '搜索,引用', 8800, 1, 1),
('Suno','', 'Suno 出品，输入想法即可生成完整歌曲与人声', 'https://suno.com', 8, '音乐,生成', 8600, 1, 1),
('Runway','', 'Runway 出品，文生视频与视频后期 AI 工具', 'https://runwayml.com', 3, '生成,剪辑', 8300, 1, 1),
('Coze','', '字节推出的 AI Bot 可视化搭建与分发平台', 'https://coze.com', 6, 'Bot,字节', 7600, 1, 1);
-- AI 导航站内容采集种子（utf8mb4）
-- 新增真实 AI 工具，覆盖全部 11 个分类，补齐写作/办公/设计/学习空分类
-- 同时填充社区帖子 ai_post 与提示词 ai_prompt

SET NAMES utf8mb4;

-- ============ 分类 1 对话 ============
INSERT INTO ai_tool (name, url, description, tags, category_id, heat, is_recommended, is_hot) VALUES
('Kimi', 'https://kimi.moonshot.cn', '月之暗面出品，支持超长上下文的对话助手', '对话,长文本', 1, 9100, 1, 1),
('文心一言', 'https://yiyan.baidu.com', '百度文心大模型，中文理解与多模态生成', '中文,百度', 1, 8200, 1, 1),
('通义千问', 'https://tongyi.aliyun.com', '阿里通义大模型，具备多模态与工具调用能力', '阿里,多模态', 1, 8000, 1, 1),
('豆包', 'https://www.doubao.com', '字节跳动 AI 助手，免费且接入抖音生态', '字节,助手', 1, 7800, 0, 0),
('智谱清言', 'https://chatglm.cn', '清华智谱 GLM 大模型，支持 Agent 与代码', '清华,GLM', 1, 7600, 0, 0),
('讯飞星火', 'https://xinghuo.xfyun.cn', '科大讯飞认知大模型，强于语音与行业应用', '讯飞,语音', 1, 7400, 0, 0),
('元宝', 'https://yuanbao.tencent.com', '腾讯混元大模型 AI 助手，深度整合微信生态', '腾讯,混元', 1, 7200, 0, 0),
('Gemini', 'https://gemini.google.com', 'Google 多模态对话模型，原生接入搜索', '谷歌,多模态', 1, 7000, 0, 0),
('Copilot', 'https://copilot.microsoft.com', '微软 Windows 内置 AI 助手，跨应用协作', '微软,助手', 1, 6900, 0, 0),
('DeepSeek', 'https://chat.deepseek.com', '深度求索开源大模型，推理与代码能力突出', '开源,推理', 1, 8800, 1, 1),
('百川智能', 'https://www.baichuan-ai.com', '百川开源大模型，主打中文与行业方案', '开源,百川', 1, 6500, 0, 0),
('Poe', 'https://poe.com', 'Quora 推出的多模型聚合对话平台', '聚合,Quora', 1, 6300, 0, 0),
('Character.AI', 'https://character.ai', '角色扮演 AI 聊天，可创建专属虚拟角色', '角色,聊天', 1, 6100, 0, 0),
('Grok', 'https://x.com/grok', 'xAI 推出的实时联网对话，对接 X 平台', '马斯克,联网', 1, 6000, 0, 0);

-- ============ 分类 2 绘画 ============
INSERT INTO ai_tool (name, url, description, tags, category_id, heat, is_recommended, is_hot) VALUES
('DALL·E 3', 'https://openai.com/dall-e', 'OpenAI 文生图模型，提示词理解力强', '文生图,OpenAI', 2, 8700, 1, 1),
('通义万相', 'https://tongyi.aliyun.com/wanxiang', '阿里通义文生图，国风与中式审美突出', '阿里,国风', 2, 7900, 1, 1),
('文心一格', 'https://yige.baidu.com', '百度 AI 艺术绘画平台，风格多样', '百度,艺术', 2, 7200, 0, 0),
('Leonardo.AI', 'https://leonardo.ai', '面向游戏与概念美术的 AI 绘画工具', '游戏,美术', 2, 8300, 1, 1),
('Adobe Firefly', 'https://www.adobe.com/products/firefly.html', 'Adobe 创意套件中的生成式 AI，商用安全', '创意,Adobe', 2, 7400, 0, 0),
('即梦', 'https://dreamina.capcut.com', '字节剪映旗下 AI 绘画与视频生成', '字节,创作', 2, 7100, 0, 0),
('Civitai', 'https://civitai.com', '开源绘画模型（LoRA/Checkpoint）分享社区', '模型,社区', 2, 6800, 0, 0),
('Ideogram', 'https://ideogram.ai', '擅长图文排版与英文海报的 AI 绘画', '海报,文字', 2, 6600, 0, 0),
('NightCafe', 'https://nightcafe.studio', '在线 AI 艺术生成，多种风格与赛事', '艺术,在线', 2, 6200, 0, 0),
('6pen', 'https://6pen.art', '国产免费 AI 绘画，支持中文提示词', '国产,免费', 2, 6000, 0, 0),
('SeaArt', 'https://www.seaart.ai', '二次元风格 AI 绘画，含模型社区', '二次元,风格', 2, 5900, 0, 0),
('NovelAI', 'https://novelai.net', '二次元动漫角色绘制与剧情辅助', '动漫,角色', 2, 6400, 0, 0),
('Recraft', 'https://www.recraft.ai', '矢量图标与品牌素材的 AI 生成', '矢量,图标', 2, 6300, 0, 0),
('Fooocus', 'https://github.com/lllyasviel/Fooocus', '本地部署的极简绘画工具，开箱即用', '本地,开源', 2, 5800, 0, 0);

-- ============ 分类 3 写作 ============
INSERT INTO ai_tool (name, url, description, tags, category_id, heat, is_recommended, is_hot) VALUES
('Notion AI', 'https://www.notion.so/product/ai', '笔记与文档中的智能写作与总结', '笔记,文档', 3, 8200, 1, 1),
('Jasper', 'https://www.jasper.ai', '面向团队的营销文案批量生成', '营销,文案', 3, 7600, 1, 1),
('Copy.ai', 'https://www.copy.ai', '社交媒体与广告文案快速生成', '广告,社媒', 3, 6500, 0, 0),
('Grammarly', 'https://www.grammarly.com', '英文语法校对、润色与语气调整', '语法,英文', 3, 7900, 1, 1),
('QuillBot', 'https://quillbot.com', '改写、摘要与多语种翻译工具', '改写,摘要', 3, 6800, 0, 0),
('Writesonic', 'https://writesonic.com', '长文与 SEO 内容批量生成', 'SEO,长文', 3, 6400, 0, 0),
('秘塔写作猫', 'https://xiezuocat.com', '中文纠错、润色与改写', '中文,纠错', 3, 7300, 1, 1),
('火山写作', 'https://www.volcengine.com/products/writing', '字节智能写作助手，提纲与扩写', '字节,助手', 3, 6200, 0, 0),
('Sudowrite', 'https://www.sudowrite.com', '小说创作辅助，角色与情节打磨', '小说,创作', 3, 6000, 0, 0),
('Rytr', 'https://rytr.me', '低成本多语言营销写作', '多语言,便宜', 3, 5800, 0, 0),
('通义听悟', 'https://tingwu.aliyun.com', '会议录音转写、总结与待办提取', '会议,转写', 3, 6600, 0, 0),
('彩云小梦', 'https://iflow.cn', '中文小说 AI 续写与剧情生成', '小说,续写', 3, 6100, 0, 0),
('笔灵 AI', 'https://ibiling.cn', '公文、简历与学术写作辅助', '公文,简历', 3, 6300, 0, 0);

-- ============ 分类 4 视频 ============
INSERT INTO ai_tool (name, url, description, tags, category_id, heat, is_recommended, is_hot) VALUES
('Pika', 'https://pika.art', '文本生成趣味短视频与动态特效', '文本,短视频', 4, 8200, 1, 1),
('HeyGen', 'https://www.heygen.com', '数字人视频与多语种口播生成', '数字人,口播', 4, 8000, 1, 1),
('Synthesia', 'https://www.synthesia.io', '企业级 AI 数字人视频，多语言 avatar', '企业,数字人', 4, 7000, 0, 0),
('可灵', 'https://klingai.com', '快手 AI 视频生成，运镜与一致性突出', '快手,运镜', 4, 8400, 1, 1),
('Luma AI', 'https://lumalabs.ai', '梦幻视频与 3D 场景生成', '3D,梦幻', 4, 6900, 0, 0),
('Sora', 'https://openai.com/sora', 'OpenAI 长时长、高一致性的文生视频', '文生视频,OpenAI', 4, 8600, 1, 1),
('D-ID', 'https://www.d-id.com', '让照片开口说话的数字人视频', '照片,口播', 4, 6800, 0, 0),
('剪映', 'https://www.capcut.cn', '字节全能视频剪辑，含 AI 成片', '剪辑,字节', 4, 7500, 0, 0),
('智影', 'https://zenvideo.qq.com', '腾讯智能视频创作，脚本到成片', '腾讯,创作', 4, 6600, 0, 0),
('Kaiber', 'https://kaiber.ai', '音乐可视化与风格化视频生成', '音乐,可视化', 4, 6200, 0, 0),
('Pictory', 'https://pictory.ai', '文章转短视频的自动剪辑', '文章,短视频', 4, 6000, 0, 0),
('一帧秒创', 'https://1s2c.com', '图文转视频的 AIGC 创作', '图文,创作', 4, 5900, 0, 0),
('Vidnoz', 'https://vidnoz.com', '免费数字人视频与口播模板', '免费,数字人', 4, 5800, 0, 0),
('度加', 'https://aigc.baidu.com', '百度 AI 视频创作，智能剪辑', '百度,创作', 4, 5700, 0, 0);

-- ============ 分类 5 音频 ============
INSERT INTO ai_tool (name, url, description, tags, category_id, heat, is_recommended, is_hot) VALUES
('Udio', 'https://udio.com', '高质量 AI 音乐生成，接近人声演唱', '音乐,生成', 5, 8000, 1, 1),
('ElevenLabs', 'https://elevenlabs.io', '顶级 AI 语音合成与声音克隆', '语音,合成', 5, 8300, 1, 1),
('讯飞听见', 'https://www.iflyrec.com', '会议录音转写与字幕生成', '转写,字幕', 5, 7600, 1, 1),
('Murf', 'https://murf.ai', '配音与有声内容批量生成', '配音,有声', 5, 6800, 0, 0),
('魔音工坊', 'https://www.moyin.com', '中文 AI 配音与音频剪辑平台', '中文,配音', 5, 7000, 0, 0),
('Boomy', 'https://boomy.com', '一键生成可发布的背景音乐', '背景乐,一键', 5, 6400, 0, 0),
('Stable Audio', 'https://stableaudio.com', 'Stability AI 音乐与音效生成', '开源,音乐', 5, 6200, 0, 0),
('TTSMaker', 'https://ttsmaker.com', '免费文字转语音，多语种音色', '免费,语音', 5, 6600, 0, 0),
('标贝', 'https://www.data-baker.com', '中文语音合成与声音定制方案', '中文,方案', 5, 6000, 0, 0),
('Voicemaker', 'https://voicemaker.in', '多语种语音生成与下载', '多语种,语音', 5, 5900, 0, 0),
('讯飞智作', 'https://www.xfzhizuo.cn', '讯飞 AI 音频创作与配音', '讯飞,创作', 5, 6300, 0, 0),
('Resemble', 'https://www.resemble.ai', '克隆声音与实时语音合成', '克隆,语音', 5, 6100, 0, 0);

-- ============ 分类 6 编程 ============
INSERT INTO ai_tool (name, url, description, tags, category_id, heat, is_recommended, is_hot) VALUES
('Codeium', 'https://codeium.com', '免费 AI 代码补全与聊天', '补全,免费', 6, 8100, 1, 1),
('Tabnine', 'https://www.tabnine.com', '隐私优先的代码补全助手', '隐私,补全', 6, 7000, 0, 0),
('通义灵码', 'https://tongyi.aliyun.com/lingma', '阿里 IDE 智能编码与单元测试', '阿里,IDE', 6, 7900, 1, 1),
('Claude Code', 'https://claude.ai/code', 'Anthropic 终端编程 Agent，自主改代码', '终端,Agent', 6, 8500, 1, 1),
('v0', 'https://v0.dev', 'Vercel AI 前端界面与组件生成', '前端,UI', 6, 8000, 1, 1),
('Replit', 'https://replit.com', '云端 AI 编程环境与 Agent', '云端,环境', 6, 7200, 0, 0),
('bolt.new', 'https://bolt.new', '浏览器内全栈 AI 应用开发', '全栈,浏览器', 6, 7700, 0, 0),
('Cody', 'https://sourcegraph.com/cody', 'Sourcegraph 代码问答与检索', '问答,代码', 6, 6800, 0, 0),
('文心快码', 'https://comate.baidu.com', '百度 Comate 编码助手，上下文感知', '百度,IDE', 6, 6900, 0, 0),
('CodeGeeX', 'https://codegeex.cn', '智谱开源代码模型，多语言补全', '开源,智谱', 6, 6700, 0, 0),
('Devin', 'https://devin.ai', '首个能自主完成任务的 AI 软件工程师', '工程师,自动', 6, 7300, 0, 0),
('豆包 MarsCode', 'https://marscode.com', '字节 AI IDE，云端与本地协同', '字节,IDE', 6, 7100, 0, 0),
('CodeWhisperer', 'https://aws.amazon.com/codewhisperer', 'AWS 代码补全与安全检查', '亚马逊,补全', 6, 6600, 0, 0),
('Augment', 'https://www.augmentcode.com', '面向大型代码库的 AI 编程助手', '大型库,助手', 6, 6400, 0, 0);

-- ============ 分类 7 办公 ============
INSERT INTO ai_tool (name, url, description, tags, category_id, heat, is_recommended, is_hot) VALUES
('钉钉 AI', 'https://www.dingtalk.com', '阿里智能办公协同，会议纪要自动化', '阿里,协同', 7, 7800, 1, 1),
('飞书', 'https://www.feishu.cn', '字节一站式办公套件，含 AI 助理', '字节,套件', 7, 8000, 1, 1),
('腾讯文档', 'https://docs.qq.com', '在线协作文档中的 AI 写作与总结', '腾讯,协作', 7, 7000, 0, 0),
('WPS AI', 'https://www.wps.cn', '金山办公智能助手，公文与表格', '金山,助手', 7, 7900, 1, 1),
('Microsoft 365 Copilot', 'https://www.microsoft.com/microsoft-365/copilot', '微软全家桶 AI，跨 Word/Excel/PPT', '微软,全家桶', 7, 8200, 1, 1),
('Google Workspace', 'https://workspace.google.com', '谷歌办公套件内置 Gemini', '谷歌,套件', 7, 7100, 0, 0),
('Gamma', 'https://gamma.app', 'AI 一键生成 PPT 与网页演示', '演示,PPT', 7, 8300, 1, 1),
('Tome', 'https://tome.app', '叙事型 AI 演示文稿与故事板', '叙事,演示', 7, 6900, 0, 0),
('讯飞智文', 'https://zhiwen.xfyun.cn', '讯飞 AI 生成 PPT 与大纲', '讯飞,PPT', 7, 6800, 0, 0),
('Slack AI', 'https://slack.com/features/ai', '团队沟通中的智能总结与问答', '沟通,总结', 7, 6600, 0, 0),
('百度文库', 'https://wenku.baidu.com', 'AI 文档搜索、总结与生成', '百度,文档', 7, 6700, 0, 0),
('印象笔记 AI', 'https://www.yinxiang.com', '智能笔记整理与信息提炼', '笔记,整理', 7, 6300, 0, 0),
('万兴脑图', 'https://www.edrawmind.cn', 'AI 思维导图与结构化梳理', '脑图,思维', 7, 6400, 0, 0),
('ProcessOn', 'https://www.processon.com', '在线流程图与协作白板', '流程,协作', 7, 6200, 0, 0);

-- ============ 分类 8 设计 ============
INSERT INTO ai_tool (name, url, description, tags, category_id, heat, is_recommended, is_hot) VALUES
('Canva', 'https://www.canva.com', '在线设计海报、Logo 与社媒素材', '海报,素材', 8, 8400, 1, 1),
('Figma', 'https://www.figma.com', '协作式 UI 设计与原型工具', '设计,UI', 8, 8200, 1, 1),
('稿定设计', 'https://www.gaoding.com', '电商与新媒体一键制图', '电商,新媒体', 8, 7700, 1, 1),
('创客贴', 'https://www.chuangkit.com', '极简平面设计，模板丰富', '平面,简单', 8, 7200, 0, 0),
('即时设计', 'https://js.design', '国产协作设计软件，可导入 Figma', '国产,协作', 8, 7600, 1, 1),
('MasterGo', 'https://mastergo.com', '团队设计协作与组件库平台', '团队,协作', 8, 7100, 0, 0),
('美图秀秀 AI', 'https://ai.meitu.com', '人像美容与 AI 修图', '人像,修图', 8, 7300, 0, 0),
('墨刀', 'https://www.modao.cc', '产品原型设计与交付', '原型,产品', 8, 6900, 0, 0),
('Remove.bg', 'https://www.remove.bg', '一键智能抠图与背景替换', '抠图,一键', 8, 7500, 0, 0),
('爱设计', 'https://www.ipaituan.com', '企业营销设计与素材中台', '企业,营销', 8, 6400, 0, 0),
('鹿班', 'https://luban.aliyun.com', '阿里智能电商设计，批量出图', '阿里,电商', 8, 6600, 0, 0),
('iconfont', 'https://www.iconfont.cn', '阿里矢量图标库与资源管理', '图标,矢量', 8, 6700, 0, 0),
('Pixso', 'https://pixso.cn', '国产 Figma 替代品，设计协作', '国产,替代', 8, 6800, 0, 0),
('笔魂', 'https://www.bihun.ai', 'AI 商用素材与设计生成', '商用,素材', 8, 6300, 0, 0);

-- ============ 分类 9 搜索 ============
INSERT INTO ai_tool (name, url, description, tags, category_id, heat, is_recommended, is_hot) VALUES
('秘塔搜索', 'https://metaso.cn', '无广告 AI 搜索引擎，结构化回答', '搜索,无广告', 9, 8100, 1, 1),
('360 AI 搜索', 'https://so.360.com', '360 大模型驱动的答案引擎', '360,搜索', 9, 6800, 0, 0),
('百度 AI 搜索', 'https://chat.baidu.com', '百度对话式搜索与总结', '百度,搜索', 9, 7000, 0, 0),
('天工 AI', 'https://www.tiangong.cn', '昆仑万维 AI 助手与搜索', '昆仑,助手', 9, 7900, 1, 1),
('Brave Search', 'https://search.brave.com', '隐私优先的独立搜索引擎', '隐私,独立', 9, 6600, 0, 0),
('You.com', 'https://you.com', '多引擎 AI 聚合搜索与助手', '聚合,搜索', 9, 6700, 0, 0),
('Phind', 'https://www.phind.com', '开发者专用 AI 搜索与代码解答', '开发,搜索', 9, 7700, 1, 1),
('Devv', 'https://devv.ai', '面向程序员 AI 搜索引擎', '编程,搜索', 9, 7000, 0, 0),
('知乎直答', 'https://zhida.zhihu.com', '知乎 AI 问答搜索，引用社区内容', '知乎,问答', 9, 6500, 0, 0),
('纳米搜索', 'https://nani.so.com', '360 纳米 AI 搜索，多模态答案', '360,纳米', 9, 6200, 0, 0),
('Genspark', 'https://genspark.ai', '智能体式搜索与自动摘要', '智能体,摘要', 9, 6400, 0, 0),
('Andi', 'https://andisearch.com', '对话式 AI 搜索，简洁答案', '对话,搜索', 9, 6000, 0, 0),
('Felo', 'https://felo.ai', '多语种 AI 搜索与资料整理', '多语种,搜索', 9, 6100, 0, 0);

-- ============ 分类 10 开发平台 ============
INSERT INTO ai_tool (name, url, description, tags, category_id, heat, is_recommended, is_hot) VALUES
('OpenAI Platform', 'https://platform.openai.com', 'OpenAI 官方 API 平台，GPT 系列模型', 'API,OpenAI', 10, 8800, 1, 1),
('Anthropic API', 'https://www.anthropic.com', 'Claude 模型 API 接入与微调', 'API,Claude', 10, 8200, 1, 1),
('Google AI Studio', 'https://aistudio.google.com', 'Gemini 模型调试与 Prompt 实验', 'API,Gemini', 10, 7600, 0, 0),
('阿里云百炼', 'https://bailian.console.aliyun.com', '阿里大模型一站式微调与部署', '阿里,平台', 10, 7900, 1, 1),
('百度千帆', 'https://cloud.baidu.com/product/wenxinworkshop', '百度企业大模型平台与 Agent', '百度,企业', 10, 7400, 0, 0),
('火山方舟', 'https://www.volcengine.com/product/ark', '字节大模型服务平台，推理与精调', '字节,平台', 10, 7500, 0, 0),
('智谱 BigModel', 'https://open.bigmodel.cn', '智谱 GLM 开放平台与 API', '智谱,开放', 10, 7700, 1, 1),
('腾讯云 TI', 'https://cloud.tencent.com/product/ti', '腾讯大模型训练与推理平台', '腾讯,训练', 10, 7100, 0, 0),
('Hugging Face', 'https://huggingface.co', '开源模型社区与推理托管', '开源,社区', 10, 8300, 1, 1),
('Replicate', 'https://replicate.com', '云端运行开源模型的 API 平台', 'API,开源', 10, 7800, 0, 0),
('硅基流动', 'https://siliconflow.cn', '国内大模型推理与微调平台', '国内,推理', 10, 7200, 0, 0),
('月之暗面平台', 'https://platform.moonshot.cn', 'Kimi 开放 API 接入与长上下文', 'API,Kimi', 10, 7300, 0, 0),
('讯飞开放平台', 'https://www.xfyun.cn', '讯飞语音与认知能力开放', '讯飞,语音', 10, 6900, 0, 0),
('NVIDIA NGC', 'https://catalog.ngc.nvidia.com', 'GPU 与模型仓库，加速深度学习', '英伟达,模型', 10, 7000, 0, 0),
('Modal', 'https://modal.com', '云端弹性算力平台，按需运行代码', '算力,云端', 10, 6800, 0, 0);

-- ============ 分类 11 学习 ============
INSERT INTO ai_tool (name, url, description, tags, category_id, heat, is_recommended, is_hot) VALUES
('多邻国', 'https://www.duolingo.com', '游戏化外语学习，打卡与口语练习', '外语,游戏', 11, 8200, 1, 1),
('网易有道翻译', 'https://fanyi.youdao.com', 'AI 翻译、词典与文档互译', '翻译,词典', 11, 8000, 1, 1),
('Khan Academy', 'https://www.khanacademy.org', '免费全科学习平台，含 AI 辅导', '免费,全科', 11, 7100, 0, 0),
('夸克学习', 'https://www.quark.cn', '阿里智能学习助手，作业与考点', '阿里,助手', 11, 6900, 0, 0),
('学而思九章', 'https://www.jiuzhang.com', '数学 AI 解题辅导与讲题', '数学,解题', 11, 7200, 0, 0),
('Quizlet', 'https://quizlet.com', '记忆卡片与自适应测验', '记忆,测验', 11, 6600, 0, 0),
('作业帮', 'https://www.zyb.com', '中小学拍照搜题与讲解', '搜题,中小学', 11, 7300, 0, 0),
('小猿搜题', 'https://www.yuansouti.com', '猿辅导旗下搜题与错题本', '搜题,猿', 11, 6800, 0, 0),
('松鼠 AI', 'https://www.songshuai.com', '自适应智适应学习系统', '自适应,智适', 11, 6400, 0, 0),
('Coursera', 'https://www.coursera.org', '名校在线课程与认证', '课程,名校', 11, 7000, 0, 0),
('Socratic', 'https://socratic.org', '谷歌 AI 作业辅导，拍照解题', '作业,辅导', 11, 6300, 0, 0),
('智学网', 'https://www.zhixue.com', '学情分析与智能测评', '学情,测评', 11, 6200, 0, 0),
('流利说', 'https://www.liulishuo.com', 'AI 英语口语训练与评测', '口语,英语', 11, 6500, 0, 0);

-- ============ 社区提示词 ai_prompt ============
INSERT INTO ai_prompt (title, content, category_name, use_count) VALUES
('公文写作助手', '你是一位资深机关公文写作专家，擅长通知、报告、请示、总结等文种。请根据我的要点，输出格式规范、语言严谨、符合公文要求的完整文稿。', '写作', 1240),
('小红书爆款文案', '你是有 10 年经验的小红书爆款文案写手。请围绕主题生成一篇带有 emoji、强钩子标题和种草口吻的笔记，并附 5 个相关话题标签。', '营销', 2310),
('代码审查专家', '你是一位资深后端工程师。请审查我给出的代码，指出潜在 Bug、安全隐患、性能与可读性问题，并给出具体修改建议和重构示例。', '编程', 1870),
('英文邮件润色', '请将我提供的中文内容翻译为专业、地道的英文商务邮件，语气礼貌且简洁，并说明修改理由。', '翻译', 1560),
('周报生成器', '根据我列出的本周工作要点，生成一份条理清晰、重点突出、适合直接发给领导的周报，使用要点式表达。', '办公', 980),
('苏格拉底式引导', '你是一位引导型导师，请用苏格拉底式提问帮我拆解问题、厘清概念，而不是直接给答案。每次只提一个关键问题。', '学习', 760),
('国风插画提示词', '请为我生成一段国风工笔画的中英文 AI 绘画提示词，包含主体、构图、色彩、光影与画质词，并解释其效果。', '绘画', 1120),
('AI 模拟面试官', '你是一家大厂严格的技术面试官。请针对我应聘的岗位连续追问，考察基础知识与系统设计，并在最后给出点评与建议。', '职场', 830);

-- ============ 社区帖子 ai_post ============
INSERT INTO ai_post (title, content, author_name, author_avatar, thumb_url, view_num, like_num, comment_num) VALUES
('我用 AI 一周做了 3 个网站，方法全公开', '最近尝试用 v0、Cursor 和 Claude 组合，把想法快速落地成可上线的小网站。核心心法是：先用对话明确需求，再让 AI 生成骨架，最后人工精修细节。', 'toolly', 'https://api.dicebear.com/7.x/initials/svg?seed=Yupi', 'https://picsum.photos/seed/aiweb/600/400', 5200, 320, 45),
('2026 年最值得收藏的 20 个 AI 工具', '整理了对话、绘画、视频、编程各赛道的神器，按使用频率和性价比排序，建议先码后看。', '星河', 'https://api.dicebear.com/7.x/initials/svg?seed=Xinghe', 'https://picsum.photos/seed/aitools/600/400', 8800, 510, 88),
('从零搭建你的 AI 绘画工作流', '分享我如何用 Midjourney 出图、Stable Diffusion 精修、ComfyUI 串联节点，效率提升 3 倍。', '阿木', 'https://api.dicebear.com/7.x/initials/svg?seed=Amu', 'https://picsum.photos/seed/aiart/600/400', 4100, 260, 33),
('Prompt 工程的 7 个实用技巧', '好的提示词决定了一半的产出质量。本文总结角色设定、少样本、链式思考等可立即上手的技巧。', '墨笔', 'https://api.dicebear.com/7.x/initials/svg?seed=Mobi', 'https://picsum.photos/seed/prompt/600/400', 6700, 410, 67),
('普通人如何用 AI 做副业', '不需要代码基础，用 Copilot、剪映、即梦就能跑通内容变现闭环，附具体赛道与避坑指南。', '小满', 'https://api.dicebear.com/7.x/initials/svg?seed=Xiaoman', 'https://picsum.photos/seed/sidehustle/600/400', 9300, 620, 102),
('我把公司周报交给 AI 后发生了什么', '用 Gamma 和通义听悟搭了一套自动化工位，会议纪要与周报全自动生成，领导还夸我汇报清晰。', '老张', 'https://api.dicebear.com/7.x/initials/svg?seed=Zhang', 'https://picsum.photos/seed/report/600/400', 3600, 210, 29),
('开发者必看的 10 个大模型平台', '从 OpenAI 到硅基流动、月之暗面，横向对比价格、延迟、中文能力与 SDK 体验。', '码农小李', 'https://api.dicebear.com/7.x/initials/svg?seed=Lilei', 'https://picsum.photos/seed/platform/600/400', 5400, 300, 51),
('AI 学习外语的亲测有效的方法', '用多邻国打卡、DeepSeek 陪练口语、有道查词，三个月从哑巴英语到能开会。', '果果', 'https://api.dicebear.com/7.x/initials/svg?seed=Guoguo', 'https://picsum.photos/seed/learn/600/400', 4800, 270, 40);

-- 给前几条帖子/提示词归属到 admin（id=1），便于演示「我的帖子 / 我的提示词」
UPDATE ai_post SET user_id = 1 WHERE id <= 3;
UPDATE ai_prompt SET user_id = 1 WHERE id <= 3;

-- ============================================================
-- 存量补齐：以下 5 张表原仅存在于 migrations/ 子目录。
-- docker-entrypoint-initdb.d 挂载的是 backend/sql 顶层目录，MySQL initdb
-- 不会递归子目录，导致新环境从零初始化时缺表（知识库/评论/消息中心全线不可用）。
-- 现同步到本文件，保证「全新环境只跑 schema.sql 也能建全表」。
-- 全部使用 CREATE TABLE IF NOT EXISTS，对已存在的线上库重复执行安全。
-- ============================================================

-- 知识库分类
CREATE TABLE IF NOT EXISTS ai_column_category (
    id          BIGINT      PRIMARY KEY AUTO_INCREMENT,
    name        VARCHAR(64) NOT NULL DEFAULT '' COMMENT '分类名称（新手入门 / DeepSeek / AI 编程 ...）',
    sort        INT         DEFAULT 0 COMMENT '排序，越小越靠前',
    description VARCHAR(256) DEFAULT '' COMMENT '分类描述',
    KEY idx_sort (sort)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='AI 知识库分类';

-- 知识库专栏
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

-- 知识库文章
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

-- 通用评论（当前用于知识库文章；target_type 预留 post 扩展）
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

-- 站内消息（评论 / 回复通知）
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='站内消息';
