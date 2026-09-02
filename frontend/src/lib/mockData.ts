import {
  AiTool,
  AiPost,
  AiPrompt,
  Category,
  NewsItem,
  FeaturedItem,
  Article,
  HomePrompt,
  McpServer,
  SkillItem,
  EssayPost,
  Tutorial,
  PromptTemplate,
  KbColumn
} from "@/types";

// ===== 14 大类分类（名称/图标/顺序/二级 tags 1:1 对齐 ai.codefather.cn /tool） =====
export const CATEGORIES: Category[] = [
  { id: 1, name: "AI写作", icon: "✍️", sort: 1, tags: ["AI写作工具","AI小红书文案","AI小说","AI论文写作","AI总结摘要","AI提示词","AIGC检测","AI公文","AI标书写作","AI论文查重","AI阅读","降AIGC率"] },
  { id: 2, name: "AI图像", icon: "🎨", sort: 2, tags: ["常用AI图像工具","AI图片优化修复","AI图片背景移除","AI图片无损放大","AI 3D模型生成","AI商品图生成","AI图片插画生成","AI图片物体抹除"] },
  { id: 3, name: "AI视频创作", icon: "🎬", sort: 3, tags: [] },
  { id: 4, name: "AI办公", icon: "📊", sort: 4, tags: ["AI PPT","AI文档工具","AI思维导图","AI表格数据处理","AI语言翻译","AI会议工具","AI招聘求职","AI效率提升","AI法律助手"] },
  { id: 5, name: "AI开发平台", icon: "💻", sort: 5, tags: ["AI编程工具","AI开源项目","AI开发框架","AI开放平台","AI训练模型","AI-SQL数据库","AI低(无)代码编程","AI国际导航","AI开发课堂"] },
  { id: 6, name: "AI智能体", icon: "🤖", sort: 6, tags: [] },
  { id: 7, name: "AI聊天对话", icon: "💬", sort: 7, tags: [] },
  { id: 8, name: "AI音频音乐", icon: "🔊", sort: 8, tags: [] },
  { id: 9, name: "AI商业设计", icon: "🖌️", sort: 9, tags: [] },
  { id: 10, name: "AI大模型", icon: "🧠", sort: 10, tags: ["AI大语言模型","AI视觉大模型","AI视频大模型","AI语音大模型","AI多模态大模型","AI大模型评测","AI海外大模型","AI行业大模型"] },
  { id: 11, name: "AI学习平台", icon: "📚", sort: 11, tags: [] },
  { id: 12, name: "AI搜索引擎", icon: "🔍", sort: 12, tags: [] },
  { id: 13, name: "AI内容检测", icon: "🛡️", sort: 13, tags: [] },
  { id: 14, name: "AI应用", icon: "🧩", sort: 14, tags: [] }
];

const CAT = (id: number) => CATEGORIES.find((c) => c.id === id)!.name;

// ===== AI 工具数据 =====
function t(
  id: number,
  name: string,
  description: string,
  url: string,
  categoryId: number,
  tags: string[],
  heat: number,
  isRecommended = false,
  isHot = false
): AiTool {
  return {
    id,
    name,
    logo: "",
    description,
    url,
    categoryId,
    tags,
    heat,
    isRecommended,
    isHot
  };
}

export const AI_TOOLS: AiTool[] = [
  // AI写作(1)
  t(13, "Notion AI", "笔记与文档中的 AI 写作助手。", "https://notion.so", 1, ["笔记", "效率"], 8200, true, true),
  t(14, "秘塔写作猫", "中文纠错、改写、续写一体。", "https://xiezuocat.com", 1, ["中文", "纠错"], 6400, false, false),
  t(15, "火山写作", "字节出品免费 AI 写作。", "https://writing.volcengine.com", 1, ["中文", "字节"], 5200, false, false),
  t(16, "Jasper", "海外营销文案 AI 写作工具。", "https://jasper.ai", 1, ["营销", "英文"], 4800, false, false),
  t(17, "Grammarly", "英文语法与润色助手。", "https://grammarly.com", 1, ["英文", "润色"], 6100, false, false),
  t(18, "Effidit 易撰", "腾讯出品写作辅助。", "https://effidit.com", 1, ["中文", "腾讯"], 4300, false, false),

  // AI图像(2)
  t(7, "Midjourney", "最强 AI 绘画，艺术质感与出图质量标杆。", "https://midjourney.com", 2, ["绘画", "艺术"], 9500, true, true),
  t(8, "Stable Diffusion", "开源绘画模型，可本地部署自由定制。", "https://stability.ai", 2, ["开源", "本地"], 8700, true, true),
  t(9, "DALL·E 3", "OpenAI 绘画，与 ChatGPT 深度集成。", "https://openai.com/dall-e-3", 2, ["OpenAI", "集成"], 7800, false, true),
  t(10, "即梦 AI", "字节跳动出品，中文绘画与视频生成。", "https://jimeng.jianying.com", 2, ["中文", "字节"], 6900, false, false),
  t(11, "通义万相", "阿里通义绘画，国风与商业设计友好。", "https://tongyi.aliyun.com/wanxiang", 2, ["中文", "阿里"], 6000, false, false),
  t(12, "文心一格", "百度文心绘画，国风风格突出。", "https://yige.baidu.com", 2, ["中文", "国风"], 5600, false, false),

  // AI视频创作(3)
  t(19, "Runway", "AI 视频生成与剪辑，Gen-2 模型领先。", "https://runwayml.com", 3, ["生成", "剪辑"], 8300, true, true),
  t(20, "Pika", "AI 文生视频，动效自然。", "https://pika.art", 3, ["生成", "动效"], 7900, true, true),
  t(21, "可灵", "快手出品高清视频生成。", "https://klingai.kuaishou.com", 3, ["中文", "快手"], 7400, false, true),
  t(22, "即梦视频", "字节 AI 视频生成。", "https://jimeng.jianying.com", 3, ["中文", "字节"], 6800, false, false),
  t(23, "HeyGen", "AI 数字人视频口播。", "https://heygen.com", 3, ["数字人", "口播"], 5900, false, false),
  t(24, "D-ID", "让照片开口说话的 AI 视频。", "https://d-id.com", 3, ["数字人", "照片"], 5100, false, false),

  // AI办公(4)
  t(36, "钉钉 AI", "办公协同中的 AI 助手。", "https://dingtalk.com", 4, ["协同", "办公"], 6200, false, false),
  t(37, "飞书智能伙伴", "字节办公 AI 助手。", "https://feishu.cn", 4, ["协同", "字节"], 6000, false, false),
  t(38, "WPS AI", "WPS 文档 AI 能力。", "https://wps.cn", 4, ["文档", "金山"], 5700, false, false),
  t(39, "ChatPDF", "和 PDF 对话，快速提炼要点。", "https://chatpdf.com", 4, ["PDF", "阅读"], 6800, false, true),
  t(40, "Gamma", "AI 一键生成 PPT。", "https://gamma.app", 4, ["PPT", "生成"], 7100, true, true),

  // AI开发平台(5)
  t(30, "GitHub Copilot", "VS Code 中的 AI 结对编程。", "https://github.com/features/copilot", 5, ["补全", "IDE"], 9400, true, true),
  t(31, "Cursor", "AI 原生编辑器，懂整个代码库。", "https://cursor.com", 5, ["编辑器", "Agent"], 9000, true, true),
  t(32, "通义灵码", "阿里 AI 编程助手。", "https://tongyi.aliyun.com/lingma", 5, ["中文", "阿里"], 6600, false, false),
  t(33, "CodeGeeX", "智谱 AI 编程助手。", "https://codegeex.cn", 5, ["中文", "智谱"], 5800, false, false),
  t(34, "Codeium", "免费 AI 代码补全。", "https://codeium.com", 5, ["免费", "补全"], 6300, false, false),
  t(35, "Tabnine", "企业级 AI 代码补全。", "https://tabnine.com", 5, ["企业", "补全"], 4900, false, false),

  // AI智能体(6)
  t(50, "Coze 扣子", "字节 AI Bot / 智能体搭建平台。", "https://coze.cn", 6, ["Bot", "字节"], 7600, true, true),
  t(51, "Dify", "开源 LLM 应用与智能体开发平台。", "https://dify.ai", 6, ["开源", "工作流"], 7200, true, true),
  t(54, "LangChain", "构建智能体与 LLM 应用的开发框架。", "https://langchain.com", 6, ["框架", "开源"], 6700, false, false),
  t(61, "FastGPT", "开源知识库问答与智能体编排平台。", "https://fastgpt.in", 6, ["开源", "知识库"], 6100, false, true),
  t(62, "MetaGPT", "多智能体协作软件公司框架。", "https://github.com/geekan/MetaGPT", 6, ["多智能体", "开源"], 5400, false, false),
  t(63, "AutoGPT", "自主任务规划与执行的智能体框架。", "https://agpt.co", 6, ["自主", "开源"], 5000, false, false),

  // AI聊天对话(7)
  t(1, "ChatGPT", "OpenAI 出品，最强通用对话 AI，支持联网、代码解释器。", "https://chat.openai.com", 7, ["聊天", "GPT-4"], 9999, true, true),
  t(2, "Claude", "Anthropic 出品，长文本理解与写作能力出众。", "https://claude.ai", 7, ["长文本", "写作"], 8800, true, true),
  t(3, "文心一言", "百度出品的中文大模型，中文理解能力强。", "https://yiyan.baidu.com", 7, ["中文", "百度"], 7600, false, true),
  t(4, "通义千问", "阿里云出品，多模态对话助手。", "https://tongyi.aliyun.com", 7, ["中文", "阿里"], 7200, false, false),
  t(5, "Kimi", "月之暗面出品，超长上下文（200 万字）对话。", "https://kimi.moonshot.cn", 7, ["长文本", "搜索"], 8100, true, true),
  t(6, "智谱清言", "智谱 AI 出品，GLM 大模型对话。", "https://chatglm.cn", 7, ["中文", "GLM"], 6500, false, false),

  // AI音频音乐(8)
  t(25, "Suno", "AI 音乐生成，一句话写歌。", "https://suno.com", 8, ["音乐", "生成"], 8600, true, true),
  t(26, "Udio", "AI 音乐生成，音质出众。", "https://udio.com", 8, ["音乐", "生成"], 7000, false, true),
  t(27, "ElevenLabs", "最强 AI 语音克隆与合成。", "https://elevenlabs.io", 8, ["语音", "克隆"], 7700, true, true),
  t(28, "Fish Audio", "中文语音克隆。", "https://fishaudio.com", 8, ["中文", "语音"], 5400, false, false),
  t(29, "Whisper", "OpenAI 开源语音转文字。", "https://openai.com/research/whisper", 8, ["转写", "开源"], 6200, false, false),

  // AI商业设计(9)
  t(41, "Canva 魔力工作室", "在线设计中的 AI 能力。", "https://canva.com", 9, ["设计", "模板"], 7000, false, true),
  t(42, "稿定设计", "中文在线设计工具。", "https://gaoding.com", 9, ["中文", "电商"], 5200, false, false),
  t(43, "Pixso AI", "国产 UI 设计协作 + AI。", "https://pixso.cn", 9, ["UI", "协作"], 4800, false, false),
  t(44, "即时 AI", "文本生成可编辑设计稿。", "https://js.design", 9, ["UI", "生成"], 4600, false, false),
  t(45, "Remove.bg", "一键抠图。", "https://remove.bg", 9, ["抠图", "工具"], 5900, false, false),

  // AI大模型(10)
  t(52, "百度千帆", "百度大模型开发与调用平台。", "https://qianfan.cloud.baidu.com", 10, ["中文", "百度"], 6000, false, false),
  t(53, "阿里百炼", "阿里大模型服务平台。", "https://bailian.console.aliyun.com", 10, ["中文", "阿里"], 5600, false, false),
  t(64, "DeepSeek", "深度求索出品，强推理开源大模型。", "https://deepseek.com", 10, ["中文", "开源"], 9100, true, true),
  t(65, "GLM-4", "智谱 AI 旗舰大模型。", "https://bigmodel.cn", 10, ["中文", "智谱"], 7300, true, true),
  t(66, "Llama", "Meta 开源大模型系列。", "https://llama.com", 10, ["开源", "Meta"], 7000, false, true),
  t(67, "文心大模型", "百度文心系列大模型。", "https://wenxin.baidu.com", 10, ["中文", "百度"], 6400, false, false),

  // AI学习平台(11)
  t(55, "Khanmigo", "可汗学院 AI 导师。", "https://khanacademy.org", 11, ["教育", "导师"], 4800, false, false),
  t(56, "Question.AI", "作业答疑 AI。", "https://question.ai", 11, ["答疑", "学生"], 5200, false, false),
  t(57, "Socratic", "谷歌出品学习助手。", "https://socratic.org", 11, ["教育", "谷歌"], 4300, false, false),
  t(58, "微软爱写作", "英语写作批改。", "https://aimwriting.mtutor.engkoo.com", 11, ["英语", "批改"], 4100, false, false),
  t(59, "Hi Echo", "有道 AI 口语私教。", "https://echos.163.com", 11, ["口语", "有道"], 4500, false, false),

  // AI搜索引擎(12)
  t(46, "Perplexity", "AI 搜索引擎，带引用来源。", "https://perplexity.ai", 12, ["搜索", "引用"], 8800, true, true),
  t(47, "秘塔搜索", "中文 AI 搜索，无广告。", "https://metaso.cn", 12, ["中文", "无广告"], 7300, true, true),
  t(48, "Devv AI", "面向开发者的 AI 搜索。", "https://devv.ai", 12, ["开发者", "代码"], 5500, false, false),
  t(49, "Phind", "开发者问答搜索。", "https://phind.com", 12, ["开发者", "问答"], 5000, false, false),

  // AI内容检测(13)
  t(68, "GPTZero", "AIGC 文本检测，判断内容是否 AI 生成。", "https://gptzero.me", 13, ["检测", "AIGC"], 6300, false, true),
  t(69, "朱雀 AI 检测", "腾讯出品，图文 AIGC 检测。", "https://matrix.tencent.com", 13, ["中文", "腾讯"], 5500, false, false),
  t(70, "Copyleaks", "AI 内容与抄袭检测平台。", "https://copyleaks.com", 13, ["检测", "抄袭"], 4700, false, false),

  // AI应用(14)
  t(71, "妙鸭相机", "AI 写真生成应用。", "https://miaoya.aliyun.com", 14, ["写真", "阿里"], 6600, false, true),
  t(72, "通义听悟", "阿里会议纪要/学习整理应用。", "https://tongyi.aliyun.com/tingwu", 14, ["中文", "纪要"], 5300, false, false),
  t(73, "讯飞听见", "AI 实时转写与字幕应用。", "https://iflyrec.com", 14, ["转写", "讯飞"], 4900, false, false),

  // ===== 以下为批量扩充（id 74+），补齐各分类覆盖率 =====

  // AI写作(1) 追加
  t(74, "彩云小梦", "彩云科技 AI 写小说与故事创作工具。", "https://ifcyl.com", 1, ["小说", "创作"], 4200, false, false),
  t(75, "百度文库AI", "百度文库智能写作与文档生成。", "https://wenku.baidu.com", 1, ["文档", "百度"], 4500, false, false),
  t(76, "Copy.ai", "海外营销文案与品牌内容 AI 写作。", "https://copy.ai", 1, ["营销", "英文"], 5000, false, false),
  t(77, "Writesonic", "长文与营销落地页 AI 生成。", "https://writesonic.com", 1, ["营销", "英文"], 4600, false, false),
  t(78, "讯飞智作", "科大讯飞 AI 写作与音频创作平台。", "https://zhizuo.xfyun.cn", 1, ["中文", "讯飞"], 4100, false, false),
  t(79, "QuillBot", "英文改写、摘要与润色助手。", "https://quillbot.com", 1, ["英文", "改写"], 4400, false, false),
  t(80, "Sudowrite", "小说创作专用的 AI 写作伙伴。", "https://sudowrite.com", 1, ["小说", "英文"], 3600, false, false),
  t(81, "HyperWrite", "个人写作助手，自动续写与改写。", "https://hyperwriteai.com", 1, ["英文", "助手"], 3500, false, false),
  t(82, "Writer", "企业级品牌语气一致的 AI 写作。", "https://writer.com", 1, ["企业", "英文"], 3800, false, false),
  t(83, "爱制作", "国产一站式 AI 写作与文案生成。", "https://www.aizhizuo.com", 1, ["中文", "文案"], 3300, false, false),

  // AI图像(2) 追加
  t(84, "Adobe Firefly", "Adobe 全家桶原生 AI 绘画与生成。", "https://firefly.adobe.com", 2, ["设计", "Adobe"], 8200, true, true),
  t(85, "Leonardo.AI", "游戏资产与概念图 AI 生成平台。", "https://leonardo.ai", 2, ["游戏", "设计"], 7800, true, false),
  t(86, "Fooocus", "基于 SDXL 的极简本地绘画工具。", "https://github.com/lllyasviel/Fooocus", 2, ["开源", "本地"], 5900, false, false),
  t(87, "ComfyUI", "节点式 Stable Diffusion 工作流引擎。", "https://github.com/comfyanonymous/ComfyUI", 2, ["开源", "节点"], 6400, false, false),
  t(88, "Recraft", "可生成矢量图标与插画的设计 AI。", "https://recraft.ai", 2, ["设计", "图标"], 5600, false, false),
  t(89, "Ideogram", "擅长图文排版与海报的 AI 绘画。", "https://ideogram.ai", 2, ["文", "海报"], 6000, false, false),
  t(90, "海艺 AI", "SeaArt，中文友好的二次元绘画社区。", "https://www.seaart.ai", 2, ["中文", "绘画"], 5200, false, false),
  t(91, "Niji Journey", "专注于动漫二次元风格的绘画。", "https://nijijourney.com", 2, ["二次元", "动漫"], 5500, false, false),
  t(92, "PixAI", "二次元头像与插画 AI 生成。", "https://pixai.art", 2, ["二次元", "绘画"], 4800, false, false),
  t(93, "美图 AI", "美图秀秀旗下 AI 绘画与设计工具。", "https://ai.meitu.com", 2, ["中文", "美图"], 5000, false, false),

  // AI视频创作(3) 追加
  t(94, "Luma Dream Machine", "高保真运动视频生成模型。", "https://lumalabs.ai/dream-machine", 3, ["生成", "运动"], 7000, true, false),
  t(95, "海螺 AI 视频", "MiniMax 出品的文生视频工具。", "https://minimax.io", 3, ["中文", "MiniMax"], 6500, false, false),
  t(96, "Vidu", "生数科技出品的国产文生视频。", "https://vidu.com", 3, ["中文", "生数"], 6200, false, false),
  t(97, "PixVerse", "带特效模板的 AI 视频生成。", "https://pixverse.ai", 3, ["生成", "特效"], 5800, false, false),
  t(98, "Stable Video", "Stability AI 开源视频生成模型。", "https://stability.ai", 3, ["开源", "生成"], 5400, false, false),
  t(99, "Kaiber", "艺术风格化的 AI 视频生成。", "https://kaiber.ai", 3, ["艺术", "视频"], 4600, false, false),
  t(100, "Wonder Studio", "自动绑定与替换 CG 角色特效。", "https://wonderstudio.ai", 3, ["特效", "角色"], 4400, false, false),
  t(101, "Captions", "自动字幕与口播视频 AI。", "https://captions.ai", 3, ["字幕", "口播"], 4200, false, false),
  t(102, "Morph Studio", "智能剪辑与生成一体化视频工具。", "https://morph.studio", 3, ["剪辑", "生成"], 4000, false, false),
  t(103, "Genmo", "开源动画与视频生成模型。", "https://genmo.ai", 3, ["生成", "动画"], 3800, false, false),

  // AI办公(4) 追加
  t(104, "飞书妙记", "字节飞书 AI 会议纪要转写。", "https://www.feishu.cn/product/minutes", 4, ["纪要", "字节"], 4800, false, false),
  t(105, "腾讯文档AI", "腾讯文档智能写作与总结。", "https://docs.qq.com", 4, ["文档", "腾讯"], 4600, false, false),
  t(106, "Microsoft 365 Copilot", "微软办公全家桶 AI 助手。", "https://microsoft.com/copilot", 4, ["办公", "微软"], 7000, true, false),
  t(107, "Otter.ai", "会议实时转录与摘要。", "https://otter.ai", 4, ["转录", "会议"], 5300, false, false),
  t(108, "Tome", "AI 叙事型演示文稿生成。", "https://tome.app", 4, ["PPT", "叙事"], 4900, false, false),
  t(109, "Beautiful.ai", "智能排版自动生成 PPT。", "https://beautiful.ai", 4, ["PPT", "设计"], 4000, false, false),
  t(110, "办公小浣熊", "商汤旗下 AI 办公助手。", "https://www.sensetime.com", 4, ["中文", "商汤"], 3800, false, false),
  t(111, "办公小鲸", "WPS 智能办公助手同类工具。", "https://www.wps.cn", 4, ["文档", "协作"], 3700, false, false),
  t(112, "MindShow", "一键把大纲变成演示视频。", "https://www.mindshow.fun", 4, ["PPT", "演示"], 3600, false, false),
  t(113, "BoardMix", "AI 驱动的在线白板协作。", "https://boardmix.cn", 4, ["白板", "协作"], 3600, false, false),

  // AI开发平台(5) 追加
  t(114, "Amazon Q", "AWS 云原生 AI 编程助手。", "https://aws.amazon.com/codewhisperer", 5, ["AWS", "补全"], 5500, false, false),
  t(115, "Windsurf", "AI 原生编辑器，Cascade 智能体。", "https://windsurf.com", 5, ["编辑器", "Agent"], 6800, true, false),
  t(116, "Zed", "Rust 打造的高性能协作编辑器。", "https://zed.dev", 5, ["编辑器", "Rust"], 4700, false, false),
  t(117, "Aider", "终端里的 AI 结对编程。", "https://aider.chat", 5, ["终端", "开源"], 5200, false, false),
  t(118, "Cline", "VS Code 开源自主编程智能体。", "https://github.com/cline/cline", 5, ["开源", "VS Code"], 5600, false, false),
  t(119, "Continue", "开源的 IDE 内 AI 编程助手。", "https://continue.dev", 5, ["开源", "IDE"], 4800, false, false),
  t(120, "v0 by Vercel", "用自然语言生成前端界面。", "https://v0.dev", 5, ["前端", "生成"], 7200, true, false),
  t(121, "Bolt.new", "浏览器里全栈 AI 开发环境。", "https://bolt.new", 5, ["全栈", "生成"], 7000, true, false),
  t(122, "Replit Agent", "云端 IDE 内的 AI 开发智能体。", "https://replit.com", 5, ["云端", "Agent"], 6000, false, false),
  t(123, "Sourcegraph Cody", "基于代码库语义的 AI 助手。", "https://sourcegraph.com/cody", 5, ["代码", "搜索"], 5000, false, false),

  // AI智能体(6) 追加
  t(124, "文心智能体", "百度一站式智能体搭建平台。", "https://agents.baidu.com", 6, ["中文", "百度"], 5200, false, false),
  t(125, "阿里云百炼", "阿里智能体与应用编排平台。", "https://bailian.console.aliyun.com", 6, ["中文", "阿里"], 4900, false, false),
  t(126, "腾讯元器", "腾讯开放智能体创作平台。", "https://yuanqi.tencent.com", 6, ["中文", "腾讯"], 5100, false, false),
  t(127, "n8n", "开源工作流自动化与 AI 节点。", "https://n8n.io", 6, ["工作流", "开源"], 5400, false, false),
  t(128, "Zapier AI", "无代码自动化连接上千应用。", "https://zapier.com/ai", 6, ["自动化", "工作流"], 4700, false, false),
  t(129, "AgentGPT", "浏览器里配置自主 AI 智能体。", "https://agentgpt.reworkd.ai", 6, ["自主", "开源"], 4500, false, false),
  t(130, "BabyAGI", "经典的任务分解自主智能体框架。", "https://github.com/yoheinakajima/babyagi", 6, ["自主", "开源"], 4000, false, false),
  t(131, "CrewAI", "多角色协作的智能体编排框架。", "https://crewai.com", 6, ["多智能体", "框架"], 4900, false, false),
  t(132, "Flowise", "拖拽式低代码 LLM 应用搭建。", "https://flowiseai.com", 6, ["低代码", "开源"], 4400, false, false),
  t(133, "Botpress", "面向企业的对话智能体平台。", "https://botpress.com", 6, ["对话", "企业"], 4300, false, false),

  // AI聊天对话(7) 追加
  t(134, "Gemini", "谷歌多模态对话大模型。", "https://gemini.google.com", 7, ["谷歌", "多模态"], 8600, true, true),
  t(135, "Microsoft Copilot", "微软整合 Bing 的 AI 助手。", "https://copilot.microsoft.com", 7, ["微软", "搜索"], 7000, true, false),
  t(136, "豆包", "字节跳动出品的国民级 AI 助手。", "https://doubao.com", 7, ["字节", "中文"], 8000, true, false),
  t(137, "元宝", "腾讯混元大模型对话助手。", "https://yuanbao.tencent.com", 7, ["腾讯", "中文"], 7500, true, false),
  t(138, "DeepSeek 对话", "深度求索推理大模型在线对话。", "https://chat.deepseek.com", 7, ["中文", "推理"], 9200, true, true),
  t(139, "Poe", "Quora 聚合多家模型的对话平台。", "https://poe.com", 7, ["聚合", "Quora"], 6400, false, false),
  t(140, "Character.AI", "角色扮演与虚拟陪伴对话。", "https://character.ai", 7, ["角色", "陪伴"], 6000, false, false),
  t(141, "HuggingChat", "Hugging Face 开源模型对话。", "https://huggingface.co/chat", 7, ["开源", "HF"], 5000, false, false),
  t(142, "Groq", "极速推理的 LPU 对话服务。", "https://groq.com", 7, ["极速", "推理"], 5500, false, false),
  t(143, "Pi", "Inflection 出品温和陪伴型 AI。", "https://pi.ai", 7, ["陪伴", "英文"], 4200, false, false),

  // AI音频音乐(8) 追加
  t(144, "ACE Studio", "AI 歌声合成与音乐人声。", "https://ace-studio.ai", 8, ["音乐", "歌声"], 4300, false, false),
  t(145, "Riffusion", "实时生成音乐的 AI 工具。", "https://riffusion.com", 8, ["音乐", "生成"], 4000, false, false),
  t(146, "Boomy", "一键生成并发布 AI 音乐。", "https://boomy.com", 8, ["音乐", "生成"], 4200, false, false),
  t(147, "Lalal.ai", "人声与伴奏音轨分离。", "https://lalal.ai", 8, ["分离", "人声"], 3800, false, false),
  t(148, "Moises", "音乐练习与扒谱 AI 助手。", "https://moises.ai", 8, ["练习", "音乐"], 3700, false, false),
  t(149, "Resemble AI", "高拟真 AI 语音克隆。", "https://resemble.ai", 8, ["语音", "克隆"], 3600, false, false),
  t(150, "Murf", "企业级 AI 配音与语音合成。", "https://murf.ai", 8, ["配音", "语音"], 4400, false, false),
  t(151, "Voicemaker", "多语种 AI 文本转语音。", "https://voicemaker.in", 8, ["配音", "语音"], 3400, false, false),

  // AI商业设计(9) 追加
  t(152, "MasterGo AI", "国产 UI 设计协作与 AI 能力。", "https://mastergo.com", 9, ["UI", "协作"], 5000, false, false),
  t(153, "Figma AI", "全球主流 UI 设计工具内置 AI。", "https://figma.com", 9, ["UI", "设计"], 6800, true, false),
  t(154, "Adobe Express", "在线快速设计与海报生成。", "https://adobe.com/express", 9, ["设计", "模板"], 4600, false, false),
  t(155, "美图设计室", "电商与商用 AI 设计工具。", "https://www.designkit.com", 9, ["电商", "中文"], 4200, false, false),
  t(156, "Uizard", "文本生成可编辑 UI 设计稿。", "https://uizard.io", 9, ["UI", "生成"], 4000, false, false),
  t(157, "Khroma", "AI 配色方案生成器。", "https://khroma.co", 9, ["配色", "设计"], 3200, false, false),
  t(158, "Brandmark", "AI 一键生成 Logo 与品牌。", "https://brandmark.io", 9, ["Logo", "生成"], 3300, false, false),
  t(159, "Designs.ai", "全套品牌视觉 AI 生成。", "https://designs.ai", 9, ["品牌", "设计"], 3100, false, false),

  // AI大模型(10) 追加
  t(160, "Qwen 通义千问", "阿里开源大模型系列（Qwen2.5）。", "https://qwenlm.com", 10, ["中文", "阿里"], 7800, true, true),
  t(161, "Mistral", "欧洲开源大模型与 Le Chat。", "https://mistral.ai", 10, ["开源", "法国"], 6000, false, false),
  t(162, "Grok", "xAI 马斯克出品推理大模型。", "https://x.com/grok", 10, ["马斯克", "推理"], 6500, false, false),
  t(163, "Yi 零一万物", "李开复团队开源大模型。", "https://01.ai", 10, ["中文", "开源"], 5600, false, false),
  t(164, "MiniMax", "国内多模态开源大模型。", "https://minimax.io", 10, ["中文", "多模态"], 5800, false, false),
  t(165, "阶跃星辰 Step", "跃问多模态大模型对话。", "https://www.stepfun.com", 10, ["中文", "多模态"], 4800, false, false),
  t(166, "Phi", "微软小参数高性能模型系列。", "https://azure.microsoft.com/phi", 10, ["微软", "小模型"], 4500, false, false),
  t(167, "Gemma", "谷歌开源轻量大模型系列。", "https://deepmind.google/gemma", 10, ["谷歌", "开源"], 5200, false, false),

  // AI学习平台(11) 追加
  t(168, "Coursera", "国际名校 AI 与数据科学课程。", "https://coursera.org", 11, ["课程", "英文"], 5000, false, false),
  t(169, "DeepLearning.AI", "吴恩达出品 AI 系统课程。", "https://deeplearning.ai", 11, ["课程", "Andrew"], 5500, false, false),
  t(170, "fast.ai", "实战导向的深度学习课程。", "https://fast.ai", 11, ["课程", "实战"], 4200, false, false),
  t(171, "freeCodeCamp", "完全免费的编程学习平台。", "https://freecodecamp.org", 11, ["免费", "英文"], 4300, false, false),
  t(172, "菜鸟教程", "中文编程与 AI 入门教程站。", "https://www.runoob.com", 11, ["教程", "中文"], 4000, false, false),
  t(173, "DataCamp", "交互式数据科学学习。", "https://datacamp.com", 11, ["数据", "课程"], 3800, false, false),
  t(174, "Codecademy", "交互式编程技能学习。", "https://codecademy.com", 11, ["编程", "课程"], 3600, false, false),
  t(175, "W3Schools", "基础 Web 与 AI 概念教程。", "https://w3schools.com", 11, ["教程", "英文"], 3400, false, false),

  // AI搜索引擎(12) 追加
  t(176, "Andi", "对话式无广告 AI 搜索引擎。", "https://andi.com", 12, ["搜索", "无广告"], 4000, false, false),
  t(177, "You.com", "聚合多模型的 AI 搜索门户。", "https://you.com", 12, ["搜索", "聚合"], 5200, false, false),
  t(178, "Brave Search AI", "注重隐私的 AI 搜索答案。", "https://search.brave.com", 12, ["搜索", "隐私"], 4300, false, false),
  t(179, "Felo", "中日英多语 AI 搜索与总结。", "https://felo.ai", 12, ["搜索", "总结"], 3900, false, false),
  t(180, "Genspark", "Agent 式 AI 搜索与写作。", "https://genspark.ai", 12, ["搜索", "代理"], 4100, false, false),
  t(181, "iAsk", "免费 AI 问答搜索引擎。", "https://iask.ai", 12, ["搜索", "问答"], 3400, false, false),
  t(182, "Komo", "聊天式 AI 搜索体验。", "https://komo.ai", 12, ["搜索", "聊天"], 3600, false, false),

  // AI内容检测(13) 追加
  t(183, "Originality.ai", "面向营销的 AI 内容与抄袭检测。", "https://originality.ai", 13, ["检测", "抄袭"], 4400, false, false),
  t(184, "Writer AI Detector", "英文 AI 文本检测工具。", "https://writer.com/ai-content-detector", 13, ["检测", "英文"], 3600, false, false),
  t(185, "ZeroGPT", "免费 AI 文本生成检测。", "https://zerogpt.com", 13, ["检测", "免费"], 4200, false, false),
  t(186, "Hive Moderation", "图像与视频 AIGC 检测。", "https://hivemoderation.com", 13, ["检测", "图像"], 3700, false, false),
  t(187, "Content at Scale", "长文 AI 检测与去 AI 味。", "https://contentatscale.ai", 13, ["检测", "营销"], 3400, false, false),

  // AI应用(14) 追加
  t(188, "Remini", "AI 修复老照片与高清放大。", "https://remini.ai", 14, ["老照片", "修复"], 5600, true, false),
  t(189, "Lensa", "AI 魔法头像与艺术滤镜。", "https://lensa.ai", 14, ["头像", "魔法"], 5200, false, false),
  t(190, "Wombo Dream", "手机端 AI 艺术绘画应用。", "https://dream.ai", 14, ["绘画", "手机"], 4800, false, false),
  t(191, "FaceApp", "AI 人脸编辑与特效。", "https://faceapp.com", 14, ["照片", "特效"], 4500, false, false),
  t(192, "PhotoRoom", "电商与社媒一键抠图。", "https://photoroom.com", 14, ["抠图", "电商"], 4600, false),
  t(193, "Voicemod", "实时 AI 变声与音效。", "https://voicemod.net", 14, ["变声", "语音"], 4000, false, false)
];

// ===== AI 社区帖子 =====
export const AI_POSTS: AiPost[] = [
  {
    id: 1,
    title: "我用 AI 工具一个月，效率翻了 3 倍：我的全栈工作流",
    content:
      "分享我日常使用的 AI 工具组合：Cursor 写代码、Kimi 读长文档、Gamma 做汇报、Suno 配背景音乐……",
    authorName: "鱼皮",
    authorAvatar: "",
    thumbUrl: "",
    createTime: "2026-07-20 10:00:00",
    viewNum: 12800,
    likeNum: 860,
    commentNum: 132
  },
  {
    id: 2,
    title: "Midjourney 提示词工程：从入门到出图的 7 个技巧",
    content: "参数 --ar、--v、风格化 --s，以及构图关键词的排布顺序，决定了出图质量。",
    authorName: "设计师小李",
    authorAvatar: "",
    thumbUrl: "",
    createTime: "2026-07-19 14:30:00",
    viewNum: 9200,
    likeNum: 540,
    commentNum: 88
  },
  {
    id: 3,
    title: "开源还是闭源？Stable Diffusion 本地部署避坑指南",
    content: "显存、模型、插件、ControlNet……本地部署 SD 的完整踩坑记录。",
    authorName: "老王",
    authorAvatar: "",
    thumbUrl: "",
    createTime: "2026-07-18 09:15:00",
    viewNum: 7600,
    likeNum: 410,
    commentNum: 65
  },
  {
    id: 4,
    title: "AI 搜索横评：Perplexity、秘塔、Devv 谁更适合程序员",
    content: "从引用质量、代码理解和中文支持三个维度对比三款 AI 搜索。",
    authorName: "CoderZ",
    authorAvatar: "",
    thumbUrl: "",
    createTime: "2026-07-17 20:00:00",
    viewNum: 6100,
    likeNum: 320,
    commentNum: 47
  },
  {
    id: 5,
    title: "从 0 到 1 做 AI 绘画：我的工具流与出图心法",
    content: "从灵感收集、提示词到后期，分享一套可复用的 AI 绘画工作流与避坑清单。",
    authorName: "阿杰",
    authorAvatar: "",
    thumbUrl: "",
    createTime: "2026-07-16 11:20:00",
    viewNum: 5400,
    likeNum: 380,
    commentNum: 52
  },
  {
    id: 6,
    title: "Claude vs GPT：我同时用了 3 个月后的真实对比",
    content: "长文本、代码、写作三个维度，说清两个模型的取舍与适用场景。",
    authorName: "TechLin",
    authorAvatar: "",
    thumbUrl: "",
    createTime: "2026-07-15 19:40:00",
    viewNum: 8900,
    likeNum: 520,
    commentNum: 77
  },
  {
    id: 7,
    title: "用 Dify 十分钟搭一个客服 Bot，附完整配置",
    content: "零代码把知识库问答接到微信，中小企业也能用，附导出配置。",
    authorName: "产品记",
    authorAvatar: "",
    thumbUrl: "",
    createTime: "2026-07-14 10:05:00",
    viewNum: 4700,
    likeNum: 290,
    commentNum: 44
  },
  {
    id: 8,
    title: "AI 视频生成实测：6 款工具谁最适合做口播",
    content: "统一脚本横测 6 款文生视频，给出口播场景的真实推荐。",
    authorName: "影像猫",
    authorAvatar: "",
    thumbUrl: "",
    createTime: "2026-07-13 15:25:00",
    viewNum: 6100,
    likeNum: 350,
    commentNum: 61
  },
  {
    id: 9,
    title: "我把日常工作流全交给 Agent 之后",
    content: "邮件、排期、周报自动化，一个月省下 40 小时，讲讲踩过的坑。",
    authorName: "效率怪",
    authorAvatar: "",
    thumbUrl: "",
    createTime: "2026-07-12 09:50:00",
    viewNum: 7200,
    likeNum: 410,
    commentNum: 58
  },
  {
    id: 10,
    title: "提示词不是越长越好：3 个让效果翻倍的原则",
    content: "结构、约束、示例，比堆字数更重要，附反面案例对照。",
    authorName: "小柯",
    authorAvatar: "",
    thumbUrl: "",
    createTime: "2026-07-11 21:10:00",
    viewNum: 5300,
    likeNum: 300,
    commentNum: 39
  },
  {
    id: 11,
    title: "开源模型本地部署踩坑：显存到底怎么算",
    content: "用一张表讲清 7B/13B/70B 的显存占用与量化方案。",
    authorName: "老周",
    authorAvatar: "",
    thumbUrl: "",
    createTime: "2026-07-10 13:30:00",
    viewNum: 6800,
    likeNum: 430,
    commentNum: 66
  },
  {
    id: 12,
    title: "AI 编程三个月，我从手写 CRUD 到只写需求",
    content: "真实项目复盘，AI 帮我做了什么、没做什么，以及我的新定位。",
    authorName: "CoderZ",
    authorAvatar: "",
    thumbUrl: "",
    createTime: "2026-07-09 18:00:00",
    viewNum: 7600,
    likeNum: 470,
    commentNum: 72
  }
];

// ===== AI 提示词 =====
export const AI_PROMPTS: AiPrompt[] = [
  { id: 1, title: "爆款小红书文案", content: "你是一位资深小红书运营，请为「{产品}」写一篇 300 字种草文案，带 5 个话题标签。", categoryName: "写作", useCount: 3200 },
  { id: 2, title: "代码审查专家", content: "你是资深架构师，请审查以下代码并给出性能、安全、可读性三方面的改进建议：\n{code}", categoryName: "编程", useCount: 2800 },
  { id: 3, title: "国风插画提示词", content: "水墨风格，远山如黛，一位侠客策马，留白构图，宣纸质感，8k。", categoryName: "绘画", useCount: 2500 },
  { id: 4, title: "周报生成器", content: "根据以下工作要点，生成一份结构清晰、语气专业的周报：\n{points}", categoryName: "办公", useCount: 2100 },
  { id: 5, title: "英语口语陪练", content: "你是我的英语口语老师，请用 CEFR B1 水平与我对话，纠正我的语法错误。", categoryName: "学习", useCount: 1800 },
  { id: 6, title: "小红书爆款标题", content: "你是有 10 年经验的小红书运营，为「{主题}」生成 10 个吸引点击的标题，带 emoji。", categoryName: "写作", useCount: 2600 },
  { id: 7, title: "雅思写作批改", content: "你是雅思考官，请批改以下作文并给出 0-9 分与改进建议：\n{essay}", categoryName: "学习", useCount: 2300 },
  { id: 8, title: "Python 代码注释", content: "请为以下 Python 代码逐行添加清晰中文注释，并解释核心逻辑：\n{code}", categoryName: "编程", useCount: 2100 },
  { id: 9, title: "简历优化师", content: "你是资深 HR，请优化我的简历要点，突出量化成果与岗位匹配度：\n{points}", categoryName: "办公", useCount: 1900 },
  { id: 10, title: "旅行攻略生成", content: "你是旅行规划师，为「{目的地}」制定 5 天 4 晚行程，含预算与美食推荐。", categoryName: "生活", useCount: 1700 },
  { id: 11, title: "会议纪要整理", content: "根据以下录音转写，整理成结论、待办与负责人三段式纪要：\n{text}", categoryName: "办公", useCount: 2000 },
  { id: 12, title: "故事续写大师", content: "你是小说家，请以悬疑风格续写以下段落，保持人设与节奏：\n{text}", categoryName: "写作", useCount: 1600 },
  { id: 13, title: "Excel 公式专家", content: "请写出实现「{需求}」的 Excel 公式，并解释参数含义。", categoryName: "办公", useCount: 1500 },
  { id: 14, title: "翻译润色", content: "将以下中文翻译成地道英文商务邮件，语气专业：\n{text}", categoryName: "学习", useCount: 1400 },
  { id: 15, title: "思维导图大纲", content: "将「{主题}」拆解为层级化思维导图大纲，适合做分享。", categoryName: "学习", useCount: 1300 }
];

// ===== 首页热门搜索词 =====
export const HOT_SEARCHES: string[] = [
  "Vibe Coding 教程",
  "AI 学习路线",
  "AI 项目",
  "AI 编程",
  "提示词大全"
];

// ===== AI 资讯榜单（首页 1-10） =====
export const AI_NEWS: NewsItem[] = [
  { id: 1, rank: 1, title: "多模态大模型再进化：原生音视频同步生成能力发布", hot: true },
  { id: 2, rank: 2, title: "国产开源大模型登顶权威榜单，推理成本再降一半" },
  { id: 3, rank: 3, title: "AI 编程助手重大更新：支持整仓理解与自动重构" },
  { id: 4, rank: 4, title: "视频生成模型迭代：分钟级长镜头与一致性大幅提升" },
  { id: 5, rank: 5, title: "AI Agent 平台开放：一句话搭建可上线的智能体" },
  { id: 6, rank: 6, title: "语音克隆延迟进入毫秒级，实时对话体验升级" },
  { id: 7, rank: 7, title: "端侧小模型爆发，手机本地运行大模型成为现实" },
  { id: 8, rank: 8, title: "AI 绘画商用授权规范落地，创作者收益更有保障" },
  { id: 9, rank: 9, title: "检索增强新范式：知识库问答准确率突破新高" },
  { id: 10, rank: 10, title: "开发者生态繁荣：MCP 与 Skills 成为新标配" },
  { id: 11, rank: 11, title: "AI 编程从辅助走向主导：自动修复 PR 成现实", hot: true },
  { id: 12, rank: 12, title: "多语言实时翻译耳机发布，跨语言通话零延迟" },
  { id: 13, rank: 13, title: "开源社区推出统一 Agent 协议，互联互通更进一步" },
  { id: 14, rank: 14, title: "AI 面试官走红，校招初筛效率提升 10 倍" },
  { id: 15, rank: 15, title: "图像生成迈入 4K 时代，细节与一致性双突破" },
  { id: 16, rank: 16, title: "企业知识库接入大模型，内部搜索体验焕新" },
  { id: 17, rank: 17, title: "AI 辅助科研：一周完成原需一月的文献综述" },
  { id: 18, rank: 18, title: "端云协同推理落地，隐私与性能兼得" },
  { id: 19, rank: 19, title: "AI 配音已难辨真伪，内容创作门槛再降低" },
  { id: 20, rank: 20, title: "编程教育变革：中小学生也能用自然语言做应用" }
];

// ===== 精选推荐（资讯区右侧） =====
// 历史遗留的 /learn 死链已修复：每条编辑精选分别指向真实存在的路由
export const NEWS_FEATURED: FeaturedItem[] = [
  { id: 1, title: "Vibe Coding 零基础入门教程", href: "/resource/learn" },
  { id: 2, title: "AI 编程保姆级实战教程", href: "/resource/learn" },
  { id: 3, title: "主流大模型一手横向实测", href: "/news" },
  { id: 4, title: "AI 编辑器隐藏高效技巧", href: "/resource/learn" },
  { id: 5, title: "从零学会 AI 编程的正确姿势", href: "/essay" }
];

// ===== 学习教程 / 项目课程 / 知识百科 =====
export const ARTICLES: Article[] = [
  { id: 1, title: "用 AI 十分钟做出一个可运行的小工具", category: "tutorial" },
  { id: 2, title: "最简单的 AI 应用部署教程，5 分钟拥有 AI 员工", category: "tutorial" },
  { id: 3, title: "名校公开的 AI 编程课，值得从头学一遍", category: "tutorial" },
  { id: 4, title: "AI 编程效率的真相：提效还是重构工作流", category: "tutorial" },
  { id: 5, title: "免费的 AI 应用开发课程，入门首选", category: "tutorial" },
  { id: 6, title: "全栈 AI 项目实战：从需求到上线", category: "course" },
  { id: 7, title: "RAG 知识库问答系统开发课", category: "course" },
  { id: 8, title: "AI Agent 智能体项目从 0 到 1", category: "course" },
  { id: 9, title: "多模态应用开发实战训练营", category: "course" },
  { id: 10, title: "什么是大模型？一文讲清核心概念", category: "wiki" },
  { id: 11, title: "提示词工程完全指南", category: "wiki" },
  { id: 12, title: "向量数据库与 Embedding 入门", category: "wiki" }
];

// ===== 首页提示词（绘图 / 文字） =====
export const HOME_PROMPTS: HomePrompt[] = [
  { id: 1, title: "可爱风格科普插画", tags: ["可爱", "漫画"], kind: "draw" },
  { id: 2, title: "城市窗外风景照", tags: ["风景", "写实"], kind: "draw" },
  { id: 3, title: "关键角色人物关系图", tags: ["电影", "设计"], kind: "draw" },
  { id: 4, title: "复古怀旧手绘插画", tags: ["复古", "手绘"], kind: "draw" },
  { id: 5, title: "水彩墨水风格", tags: ["水彩", "淡彩"], kind: "draw" },
  { id: 6, title: "简约手绘涂鸦风插画", tags: ["手绘", "涂鸦"], kind: "draw" },
  { id: 7, title: "黏土定格动画风科普插图", tags: ["黏土", "萌趣"], kind: "draw" },
  { id: 8, title: "奶油色调温馨插画", tags: ["奶油色", "治愈"], kind: "draw" },
  { id: 9, title: "爆款社交种草文案", tags: ["营销", "文案"], kind: "text" },
  { id: 10, title: "代码审查专家", tags: ["编程", "架构"], kind: "text" },
  { id: 11, title: "周报生成器", tags: ["办公", "效率"], kind: "text" },
  { id: 12, title: "英语口语陪练", tags: ["学习", "口语"], kind: "text" }
];

// ===== 推荐内容（提示词区下方） =====
export const RECOMMENDS: FeaturedItem[] = [
  { id: 1, title: "AI 大模型应用开发学习路线，零基础到精通一条龙" },
  { id: 2, title: "AI 编程工具官方文档 + 命令大全" },
  { id: 3, title: "AI 热点监控工具项目实战" },
  { id: 4, title: "十分钟速通 Python：AI 入门必备课" }
];

// ===== 热门文章（首页，按阅读量排序，1:1 对齐真站 🔥 热门文章） =====
export const HOT_ARTICLES: {
  id: number;
  title: string;
  viewNum: number;
  href: string;
}[] = [
  { id: 1, title: "如何从 0 到 1 Vibe Coding 一个项目，并长期维护", viewNum: 2740, href: "/essay" },
  { id: 2, title: "揭秘 GitHub 最火的开源 Skills 仓库，30 秒带你用上", viewNum: 620, href: "/essay" },
  { id: 3, title: "Claude Code 动态工作流速通指南，多 Agent 效率起飞", viewNum: 460, href: "/essay" },
  { id: 4, title: "用 Claude Code 重构百万行代码？官方教程终于来了", viewNum: 430, href: "/essay" },
  { id: 5, title: "想问问大家现在大模型性价比比较高的有哪些呀", viewNum: 390, href: "/essay" },
  { id: 6, title: "平安好医生面试面经-附带回答版本", viewNum: 380, href: "/essay" },
  { id: 7, title: "耄耋专属 AI Loop 全自动编码器技术笔记", viewNum: 380, href: "/essay" },
  { id: 8, title: "开源一个能自动发现和分析 GitHub 仓库的 AI Skill", viewNum: 370, href: "/essay" },
  { id: 9, title: "AI 应用开发中的流式输出：从原理到工程实战", viewNum: 360, href: "/essay" },
  { id: 10, title: "全网安装量前 3 的神级 Skill，竟然只有几句话？", viewNum: 300, href: "/essay" }
];

// ===== AI 工具大全 分类 Tab（首页底部，对齐真站 tab 名称） =====
export const TOOL_TABS: { key: number; label: string }[] = [
  { key: 1, label: "AI写作" },
  { key: 2, label: "AI图像" },
  { key: 3, label: "AI视频创作" },
  { key: 4, label: "AI办公" },
  { key: 5, label: "AI开发平台" },
  { key: 6, label: "AI智能体" },
  { key: 7, label: "AI聊天对话" },
  { key: 8, label: "AI音频音乐" },
  { key: 9, label: "AI商业设计" },
  { key: 10, label: "AI大模型" },
  { key: 11, label: "AI学习平台" },
  { key: 12, label: "AI搜索引擎" },
  { key: 13, label: "AI内容检测" },
  { key: 14, label: "AI应用" }
];

// ===== MCP 服务器（/mcp 页，分类对齐真站） =====
export const MCP_CATEGORIES: string[] = [
  "开发工具",
  "研究与数据",
  "云平台",
  "数据库",
  "知识与内容管理",
  "自主智能体",
  "分析",
  "安全",
  "浏览器自动化",
  "娱乐与媒体",
  "金融",
  "通信",
  "生活管理",
  "监控",
  "系统自动化",
  "项目管理",
  "云存储",
  "版本控制"
];

function mcp(id: number, name: string, tag: string, category: string, description: string): McpServer {
  return { id, name, tag, category, description };
}

export const MCP_SERVERS: McpServer[] = [
  mcp(1, "Playwright MCP", "浏览器自动化", "浏览器自动化", "驱动浏览器完成页面访问、截图、表单填写等自动化操作。"),
  mcp(2, "Context7 MCP", "研究与数据", "研究与数据", "把最新的库文档与代码示例直接注入到 LLM 的上下文中。"),
  mcp(3, "Notion MCP", "知识与内容管理", "知识与内容管理", "读取、搜索并管理 Notion 页面与数据库内容。"),
  mcp(4, "GitLab MCP", "版本控制", "版本控制", "查询仓库、合并请求与流水线，辅助代码协作。"),
  mcp(5, "Chrome DevTools MCP", "浏览器自动化", "浏览器自动化", "通过 DevTools 协议调试页面、抓取性能与网络数据。"),
  mcp(6, "GitHub MCP", "版本控制", "版本控制", "管理 Issue、PR 与仓库文件，打通 AI 与代码托管。"),
  mcp(7, "Filesystem MCP", "系统自动化", "系统自动化", "在受控目录内读写文件，作为 Agent 的本地能力。"),
  mcp(8, "PostgreSQL MCP", "数据库", "数据库", "以只读方式查询数据库，安全地回答数据问题。"),
  mcp(9, "Slack MCP", "通信", "通信", "收发消息、查询频道，把 AI 接入团队沟通。"),
  mcp(10, "AWS MCP", "云平台", "云平台", "查询与管理云资源，辅助运维与成本分析。"),
  mcp(11, "Sentry MCP", "监控", "监控", "拉取错误与性能事件，帮助定位线上问题。"),
  mcp(12, "Stripe MCP", "金融", "金融", "查询交易、订阅与账单等支付数据。"),
  mcp(13, "Google Drive MCP", "云存储", "云存储", "检索并读取云端文档，作为知识来源。"),
  mcp(14, "Puppeteer MCP", "浏览器自动化", "浏览器自动化", "无头浏览器自动化，适合爬取与端到端测试。"),
  mcp(15, "Jira MCP", "项目管理", "项目管理", "查询与更新任务、看板，辅助研发管理。"),
  mcp(16, "Elasticsearch MCP", "数据库", "数据库", "全文检索与聚合分析，服务知识问答场景。"),
  mcp(17, "Fetch MCP", "研究与数据", "研究与数据", "抓取网页并转为可读文本，供模型理解引用。"),
  mcp(18, "Memory MCP", "自主智能体", "自主智能体", "为 Agent 提供长期记忆存取能力。")
];

// ===== Skills 指令（/skills 页，分类对齐真站） =====
export const SKILL_CATEGORIES: string[] = [
  "🌟 官方精选",
  "⚡️ 效率工具",
  "💻 软件开发",
  "📊 数据与分析",
  "🚀 开发运维",
  "💼 商业与营销",
  "🔒 测试与安全",
  "📄 文档处理",
  "🎨 内容与媒体",
  "🔬 研究",
  "🗄️ 数据库",
  "⛓️ 区块链",
  "🛋 生活方式",
  "👥 协作与管理"
];

function sk(id: number, name: string, category: string, description: string): SkillItem {
  return { id, name, category, description };
}

export const SKILLS: SkillItem[] = [
  sk(1, "frontend-design", "🎨 内容与媒体", "把设计稿与需求转成高质量前端页面代码。"),
  sk(2, "pdf", "📄 文档处理", "解析、拆分、合并 PDF 并抽取结构化内容。"),
  sk(3, "java-dev", "💻 软件开发", "遵循工程规范生成与重构 Java 后端代码。"),
  sk(4, "docx", "📄 文档处理", "读写 Word 文档，批量生成与排版报告。"),
  sk(5, "skill-creator", "🌟 官方精选", "一步步引导创建符合规范的新 Skill。"),
  sk(6, "ui-ux-pro-max", "🎨 内容与媒体", "输出可用的 UI/UX 设计规范与组件建议。"),
  sk(7, "pptx", "📄 文档处理", "根据大纲自动生成结构清晰的演示文稿。"),
  sk(8, "xlsx", "📊 数据与分析", "读写 Excel、批量处理表格与生成图表。"),
  sk(9, "web-design-guidelines", "🎨 内容与媒体", "沉淀网页设计规范，统一视觉与交互。"),
  sk(10, "code-review", "🔒 测试与安全", "从性能、安全、可读性维度审查代码。"),
  sk(11, "data-analysis", "📊 数据与分析", "清洗数据、做统计分析并给出结论。"),
  sk(12, "devops-deploy", "🚀 开发运维", "编写部署脚本与 CI/CD 流程配置。"),
  sk(13, "marketing-copy", "💼 商业与营销", "生成多平台的营销文案与投放素材。"),
  sk(14, "sql-expert", "🗄️ 数据库", "编写与优化 SQL，设计索引与表结构。"),
  sk(15, "research-assistant", "🔬 研究", "检索文献、归纳要点并生成综述。"),
  sk(16, "meeting-notes", "👥 协作与管理", "整理会议记录并输出待办与结论。"),
  sk(17, "canvas-design", "🎨 内容与媒体", "把草图与需求转成可交付的 Canvas 视觉。"),
  sk(18, "video-editing", "🎨 内容与媒体", "用 AI 完成剪辑、字幕与配乐。"),
  sk(19, "python-pro", "💻 软件开发", "遵循 PEP8 生成与优化 Python 代码。"),
  sk(20, "go-dev", "💻 软件开发", "编写符合 Go 惯用法的后端服务。"),
  sk(21, "frontend-testing", "🔒 测试与安全", "为前端组件编写 Vitest 单测。"),
  sk(22, "security-audit", "🔒 测试与安全", "审查依赖与代码中的安全风险。"),
  sk(23, "data-viz", "📊 数据与分析", "把数据转成清晰图表与洞察。"),
  sk(24, "bi-report", "📊 数据与分析", "自动生成业务分析报告。"),
  sk(25, "seo-copy", "💼 商业与营销", "产出兼顾搜索与转化的内容。"),
  sk(26, "social-media", "💼 商业与营销", "规划多平台社媒内容日历。"),
  sk(27, "research-synth", "🔬 研究", "跨文献归纳研究综述。"),
  sk(28, "knowledge-graph", "🗄️ 数据库", "从文本抽取实体构建知识图谱。")
];

// ===== 社区帖子（/essay 页，带话题分类） =====
export const ESSAY_TOPICS: string[] = [
  "推荐",
  "精选",
  "AI编程",
  "AI智能体",
  "资源教程",
  "创意玩法"
];

function ep(
  id: number,
  authorName: string,
  authorTag: string,
  topic: string,
  createTime: string,
  title: string,
  summary: string,
  tags: string[],
  likeNum: number,
  commentNum: number,
  featured = false
): EssayPost {
  return { id, authorName, authorAvatar: "", authorTag, topic, createTime, title, summary, tags, likeNum, commentNum, featured };
}

export const ESSAY_POSTS: EssayPost[] = [
  ep(1, "Yeb123", "人工智能", "AI编程", "05-03 12:44", "大模型使用经验与模型分工", "分享我在不同任务上如何选择模型：写代码、读长文、做总结各有最优解。", ["AI", "经验"], 47, 21, true),
  ep(2, "RampageRain", "后端", "AI编程", "05-02 09:12", "用 Cursor 重构老项目的一周记录", "从整仓理解到自动重构，AI 编辑器在真实项目里的表现与坑。", ["Cursor", "重构"], 63, 18),
  ep(3, "山海", "全栈", "AI智能体", "05-01 20:30", "我搭了一个能自己查资料的 Agent", "结合搜索 MCP 与记忆模块，让智能体能连续完成多步任务。", ["Agent", "MCP"], 88, 34, true),
  ep(4, "白露", "产品", "创意玩法", "04-30 15:05", "用 AI 绘图批量做公众号封面", "一套提示词模板 + 参数，稳定产出统一风格的封面图。", ["绘图", "效率"], 52, 12),
  ep(5, "CoderZ", "算法", "资源教程", "04-29 11:40", "从零学 RAG：一篇讲清检索增强", "向量库、切分、召回、重排，配一个可跑的最小示例。", ["RAG", "教程"], 120, 40, true),
  ep(6, "小满", "运营", "创意玩法", "04-28 18:22", "AI 帮我写了一个月的短视频脚本", "如何用提示词把选题、脚本、分镜一条龙生成出来。", ["文案", "短视频"], 39, 9),
  ep(7, "老周", "后端", "AI编程", "04-27 10:00", "本地跑大模型的显卡选购建议", "不同预算下的显存与吞吐对比，附实测数据。", ["本地部署", "硬件"], 76, 25),
  ep(8, "Nova", "设计", "资源教程", "04-26 14:16", "提示词工程新手常犯的 5 个错误", "从描述模糊到参数堆砌，逐条给出改法。", ["提示词", "入门"], 58, 15),
  ep(9, "Leo", "算法", "AI智能体", "04-25 09:30", "用 Coze 做了个自动回复客服，配置全记录", "从触发器到知识库，一步步搭建可上线客服 Bot。", ["Coze", "客服"], 71, 28, true),
  ep(10, "阿May", "运营", "创意玩法", "04-24 16:48", "AI 批量生成朋友圈九宫格", "一套模板稳定产出统一视觉的社媒图。", ["社媒", "效率"], 43, 11),
  ep(11, "大山", "全栈", "AI编程", "04-23 11:05", "用 Bolt 三天做出 MVP 并拿到反馈", "零后端基础也能快速验证想法。", ["Bolt", "MVP"], 95, 33, true),
  ep(12, "木子", "设计", "资源教程", "04-22 14:22", "Figma 变量与 AI 插件实战", "用变量系统管理多主题设计。", ["Figma", "设计"], 48, 14),
  ep(13, "阿杰", "产品", "AI智能体", "04-21 10:40", "把公司 SOP 变成可对话的智能体", "让新人随时问、随时查。", ["SOP", "智能体"], 62, 22),
  ep(14, "小满", "运营", "创意玩法", "04-20 19:15", "用 AI 写了一个月公众号，数据复盘", "标题、选题、排版哪些真的有用。", ["公众号", "复盘"], 55, 17),
  ep(15, "老周", "后端", "资源教程", "04-19 13:00", "RAG 生产环境踩坑：召回与延迟如何平衡", "线上真实指标下的取舍。", ["RAG", "生产"], 88, 31, true),
  ep(16, "Nova", "设计", "精选", "04-18 15:30", "提示词审美：为什么你的图总差点意思", "从构图与光影角度拆解。", ["提示词", "审美"], 64, 20)
];

// ===== 学习教程（/resource/learn 页） =====
function tut(id: number, title: string, source: string): Tutorial {
  return { id, title, source };
}

export const TUTORIALS: Tutorial[] = [
  tut(1, "十分钟做出一个可运行的 AI 小工具", "公众号"),
  tut(2, "最简单的 AI 应用部署教程，5 分钟拥有 AI 员工", "公众号"),
  tut(3, "名校公开的 AI 编程课，值得从头学一遍", "B站"),
  tut(4, "AI 编程效率的真相：提效还是重构工作流", "公众号"),
  tut(5, "免费的 AI 应用开发课程，入门首选", "B站"),
  tut(6, "20 个高效 AI 编程扩展，装上就变强", "公众号"),
  tut(7, "7 个技巧，彻底去除网站里的 AI 味儿", "公众号"),
  tut(8, "做一个不用写提示词的 AI 绘图工具", "B站"),
  tut(9, "Agent Skills 傻瓜式入门教程", "公众号"),
  tut(10, "用 AI 制作超长视频，保姆级教程", "B站"),
  tut(11, "让 AI 帮我自动部署网站，太方便了", "公众号"),
  tut(12, "从零搭建你的第一个 RAG 知识库", "B站")
];

// ===== 学习页右侧「热门工具」 =====
export const LEARN_HOT_TOOLS: string[] = [
  "朱雀AI检测",
  "Lovart",
  "面多多",
  "WritePass",
  "Cursor",
  "零感AI",
  "星月写作",
  "秘塔搜索"
];

// ===== 提示词模板（/painting 页，绘图 / 文字） =====
function pt(id: number, title: string, tags: string[], kind: "draw" | "text", useCount: number): PromptTemplate {
  return { id, title, tags, kind, useCount };
}

export const PROMPT_TEMPLATES: PromptTemplate[] = [
  pt(1, "城市窗外风景照", ["风景", "写实"], "draw", 3200),
  pt(2, "关键角色人物关系图", ["电影", "设计"], "draw", 2900),
  pt(3, "可爱风格科普插画", ["可爱", "漫画"], "draw", 2600),
  pt(4, "复古怀旧手绘插画", ["复古", "手绘"], "draw", 2100),
  pt(5, "水彩墨水风格", ["水彩", "淡彩"], "draw", 1900),
  pt(6, "黏土定格动画风插图", ["黏土", "萌趣"], "draw", 1700),
  pt(7, "奶油色调温馨插画", ["奶油色", "治愈"], "draw", 1500),
  pt(8, "极简线条图标", ["极简", "图标"], "draw", 1300),
  pt(9, "爆款社交种草文案", ["营销", "文案"], "text", 3400),
  pt(10, "代码审查专家", ["编程", "架构"], "text", 2800),
  pt(11, "周报生成器", ["办公", "效率"], "text", 2200),
  pt(12, "英语口语陪练", ["学习", "口语"], "text", 1800),
  pt(13, "论文润色助手", ["学术", "润色"], "text", 1600),
  pt(14, "面试题解答教练", ["求职", "面试"], "text", 1400)
];

// ===== 知识库专栏（/library 页） =====
function kb(id: number, title: string, description: string, articleCount: number, free: boolean): KbColumn {
  return { id, title, description, articleCount, free };
}

export const KB_COLUMNS: KbColumn[] = [
  kb(1, "鱼皮的 AI 知识库", "从 0 到 1 系统学习 AI 应用开发，持续更新。", 68, true),
  kb(2, "Vibe Coding 零基础入门", "用自然语言与 AI 协作编程，快速做出可用产品。", 32, true),
  kb(3, "OpenClaw 保姆级教程", "从安装到进阶，玩转 AI 编程助手。", 24, true),
  kb(4, "提示词工程完全指南", "系统讲解提示词设计方法论与实战模板。", 40, false),
  kb(5, "RAG 知识库实战", "检索增强问答系统的完整搭建路径。", 28, false),
  kb(6, "AI Agent 开发指南", "从工具调用到多步规划，构建可靠智能体。", 36, false)
];

// ===== Mock 可变增删改（原地修改数组，进程内持久化，供 /api/admin/* 路由使用） =====
let categorySeq = Math.max(...CATEGORIES.map((c) => c.id)) + 1;
let toolSeq = Math.max(...AI_TOOLS.map((t) => t.id)) + 1;

export function addCategoryMock(input: Partial<Category>): number {
  const id = categorySeq++;
  CATEGORIES.push({
    id,
    name: input.name || "未命名分类",
    icon: input.icon || "📁",
    sort: input.sort ?? CATEGORIES.length + 1
  });
  return id;
}

export function updateCategoryMock(input: Partial<Category>): boolean {
  const c = CATEGORIES.find((x) => x.id === input.id);
  if (!c) return false;
  if (input.name !== undefined) c.name = input.name;
  if (input.icon !== undefined) c.icon = input.icon;
  if (input.sort !== undefined) c.sort = input.sort;
  return true;
}

export function removeCategoryMock(id: number): boolean {
  const i = CATEGORIES.findIndex((x) => x.id === id);
  if (i < 0) return false;
  CATEGORIES.splice(i, 1);
  return true;
}

export function addToolMock(input: Partial<AiTool>): number {
  const id = toolSeq++;
  AI_TOOLS.unshift({
    id,
    name: input.name || "未命名工具",
    logo: input.logo || "",
    description: input.description || "",
    url: input.url || "",
    categoryId: input.categoryId ?? 1,
    tags: input.tags || [],
    heat: input.heat ?? 0,
    isRecommended: !!input.isRecommended,
    isHot: !!input.isHot
  });
  return id;
}

export function updateToolMock(input: Partial<AiTool>): boolean {
  const t = AI_TOOLS.find((x) => x.id === input.id);
  if (!t) return false;
  Object.assign(t, input);
  return true;
}

export function removeToolMock(id: number): boolean {
  const i = AI_TOOLS.findIndex((x) => x.id === id);
  if (i < 0) return false;
  AI_TOOLS.splice(i, 1);
  return true;
}

export { CAT };
