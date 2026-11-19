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

// ===== 14 大类分类（名称/图标/顺序/二级 tags） =====
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
    authorName: "toolly",
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
// 1:1 对齐目标站 ai.codefather.cn 首页 Hot Searches（REA 证据 2026-11-18）：
// 零基础AI编程课 / AI学习路线 / AI项目 / OpencClaw 中文网
export const HOT_SEARCHES: string[] = [
  "零基础AI编程课",
  "AI学习路线",
  "AI项目",
  "OpencClaw 中文网"
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
// 注意：tutorial 详情页 id 已随 1:1 真实数据改为 101–112（原 1–6 会 404），
// 故此处精选同步指向真实存在的前 6 篇详情页，标题也用目标站真实文案。
export const NEWS_FEATURED: FeaturedItem[] = [
  { id: 101, title: "12 个超火的 DeepSeek Harness 插件，大肥鱼已经落后 N 个版本了。。。", href: "/resource/learn/101" },
  { id: 102, title: "刚刚 GPT Images 2.6 发布，一键生成 GIF 动图，表情包自由的时代来了！", href: "/resource/learn/102" },
  { id: 103, title: "B 站上 DeepSeek 闹鱼灾了，我发起《大肥鱼清除计划》！", href: "/resource/learn/103" },
  { id: 104, title: "又一个国产版 Codex 神器，也来卷办公了！", href: "/resource/learn/104" },
  { id: 105, title: "我用 REA 逆向了付费颜色 APP，结果很意外！", href: "/resource/learn/105" },
  { id: 106, title: "用 AI 全自动做视频，太爽了！开源 AI 视频制作器 + Skill", href: "/resource/learn/106" }
];

// ===== 学习教程 / 项目课程 / 知识百科 =====
// tutorial 分类 1:1 对齐 ai.codefather.cn/resource/learn 真实 12 篇（标题/摘要/封面逆向自 RSC payload）。
// id 用 101–112 以避开 course(6–9) / wiki(10–12)，保证详情页路由与 React key 不冲突。
export const ARTICLES: Article[] = [
  { id: 101, title: "12 个超火的 DeepSeek Harness 插件，大肥鱼已经落后 N 个版本了。。。", description: "DeepSeek Harness 精选插件推荐合集，教你怎么发现 DSH 优质插件，带你上手 12 大 DSH 实用必装、效率创意、整活玩法插件，让你的鲸鱼变得更强", cover: "https://pic.code-nav.cn/post_cover/1601072287388278786/thumbnail/aBvmWruJDYaVDea0.jpeg", category: "tutorial" },
  { id: 102, title: "刚刚 GPT Images 2.6 发布，一键生成 GIF 动图，表情包自由的时代来了！", description: "ChatGPT Images 2.6 终于能直接做 GIF 动图了，首发实战测评，附 AI 绘图提示词", cover: "https://pic.code-nav.cn/post_cover/1601072287388278786/thumbnail/7ZClO4JAsrCLvR9X.webp", category: "tutorial" },
  { id: 103, title: "B 站上 DeepSeek 闹鱼灾了，我发起《大肥鱼清除计划》！", description: "最近 B 站闹鱼灾了，大批 DeepSeek AI 机器人涌入评论区，我通过 Vibe Coding 搞出《蓝色大肥鱼清除插件》，帮你忽略掉冰冷的 AI 回复，还你一个干净的浏览体验。", cover: "https://pic.code-nav.cn/post_cover/1601072287388278786/Hue20gvsl4uozj7c.webp", category: "tutorial" },
  { id: 104, title: "又一个国产版 Codex 神器，也来卷办公了！", description: "智谱 ZCode 全新办公模式来了，我第一时间写了保姆级教程，来看看让 100 多个 AI 一起做一个任务是什么体验~", cover: "https://pic.code-nav.cn/post_cover/1601072287388278786/QbGD3xutr4FbK3rO.webp", category: "tutorial" },
  { id: 105, title: "我用 REA 逆向了付费颜色 APP，结果很意外！", description: "GitHub 爆火的开源项目 REA 真的能逆向一切？软件已死？ 本期先科普什么是逆向工程、什么是 REA，然后实测用 AI 逆向单机安卓游戏和学习 App，看看它到底有没有那么神！希望能缓解学计算机软件、程序员朋友们的…", cover: "https://pic.code-nav.cn/post_cover/1601072287388278786/lN4dJoXRYAe3Sj48.webp", category: "tutorial" },
  { id: 106, title: "用 AI 全自动做视频，太爽了！开源 AI 视频制作器 + Skill", description: "2 分钟解锁全新 AI 视频创作玩法！一句话让 AI 全自动做出 4K 产品宣传片，我 AI 产品宣传视频制作器开源到了 GitHub。 无论你是想宣传 APP、网站、开源项目的程序员，还是内容创作者，都能让 AI Ag…", cover: "https://pic.code-nav.cn/post_cover/1601072287388278786/SucO1Zftdxcurgkn.webp", category: "tutorial" },
  { id: 107, title: "DeepSeek 官方偷偷上传 Harness 桌面端安装包，我已经用上了。。附最新下载地址", description: "DeepSeek Harness 官方的桌面端安装包被网友扒出来了，2 分钟讲明白如何使用，体验如何，适合作为 AI 编程工具么？附最新 Windows 和 Mac 双端的下载地址", cover: "https://pic.code-nav.cn/post_cover/1601072287388278786/seHHH9hmu14X0ebp.webp", category: "tutorial" },
  { id: 108, title: "AI 桌面换装视频火了，1 分钟教你复刻！傻子可懂", description: "分享 1 个万用的 AI 视频复刻思路 + AI 视频复刻 Skills（已开源到 GitHub），保姆级教程，即梦 Seedance 2.5、豆包、MiniMax 等视频生成平台和 API 都适用", cover: "https://pic.code-nav.cn/post_cover/1601072287388278786/3LhltHBXJX6xywAv.webp", category: "tutorial" },
  { id: 109, title: "全网刷屏的 Jev 模型正式开放！一手实战测评 + 保姆级教程", description: "全网爆火的 Jev 模型是什么？有什么用？怎么使用？怎么接入 AI 编程工具？效果真的好么？傻子可懂的 Jev 保姆级实战教程 + 项目实战测评来啦", cover: "https://pic.code-nav.cn/post_cover/1601072287388278786/Ebp301IOXwB3TJBA.webp", category: "tutorial" },
  { id: 110, title: "平替 Codex？AI 工具 Qoder 保姆级教程", description: "国产 AI 编程办公工具 Qoder 保姆级教程，安装上手 + 实战项目 + 核心特性全讲解，看看能不能作为 Codex 的平替", cover: "https://pic.code-nav.cn/post_cover/1601072287388278786/ISzH5up6QMleG6dA.webp", category: "tutorial" },
  { id: 111, title: "DeepSeek 官方竟然偷偷做了 Harness 桌面端，我已经用上了。。", description: "DeepSeek 官方竟然下场给 DSH 做桌面端了，期待一波，可能是未来最好的 AI 编程工具么？2 分钟教你怎么提前用上，吃一波螃蟹", cover: "https://pic.code-nav.cn/post_cover/1601072287388278786/ehS1hzknC6i4bvqL.webp", category: "tutorial" },
  { id: 112, title: "GPT Images 2.5 首发实测，手绘成图、指哪改哪、也太逼真了！", description: "ChatGPT Images 2.5 发布，10 大玩法实测，顶流的 AI 生图模型到底怎么样？扔掉 PS 吧，人人都是艺术家的时代，真的到来了。", cover: "https://pic.code-nav.cn/post_cover/1601072287388278786/ZanJM6Kip3pOAm15.webp", category: "tutorial" },
  { id: 6, title: "全栈 AI 项目实战：从需求到上线", category: "course" },
  { id: 7, title: "RAG 知识库问答系统开发课", category: "course" },
  { id: 8, title: "AI Agent 智能体项目从 0 到 1", category: "course" },
  { id: 9, title: "多模态应用开发实战训练营", category: "course" },
  { id: 10, title: "什么是大模型？一文讲清核心概念", category: "wiki" },
  { id: 11, title: "提示词工程完全指南", category: "wiki" },
  { id: 12, title: "向量数据库与 Embedding 入门", category: "wiki" }
];

// ===== 提示词封面图池（逆向自目标站 ai.codefather.cn /painting 的 prompt-media CDN） =====
// 目标站 /painting 全是「绘图案例」配图，无文字类封面，故仅 draw 类分配真实封面，
// text 类留空走渐变兜底。图片由目标站 CDN 直链提供；组件侧做了 onError 渐变兜底，
// 即便 CDN 对跨站请求拦截也不出现破图。
export const PROMPT_COVERS: string[] = [
  "https://pic.code-nav.cn/prompt-media/22/10296_1.webp",
  "https://pic.code-nav.cn/prompt-media/23/17340_1.webp",
  "https://pic.code-nav.cn/prompt-media/23/19237_1.webp",
  "https://pic.code-nav.cn/prompt-media/23/19353_1.webp",
  "https://pic.code-nav.cn/prompt-media/23/20045_1.webp",
  "https://pic.code-nav.cn/prompt-media/23/20464_1.webp",
  "https://pic.code-nav.cn/prompt-media/23/21924_1.webp",
  "https://pic.code-nav.cn/prompt-media/23/21928_1.webp",
  "https://pic.code-nav.cn/prompt-media/23/21966_1.webp",
  "https://pic.code-nav.cn/prompt-media/23/22321_1.webp",
  "https://pic.code-nav.cn/prompt-media/23/23152_1.webp",
  "https://pic.code-nav.cn/prompt-media/23/23496_1.webp",
  "https://pic.code-nav.cn/prompt-media/23/23689_1.webp",
  "https://pic.code-nav.cn/prompt-media/23/23709_1.webp",
  "https://pic.code-nav.cn/prompt-media/23/23855_1.webp",
  "https://pic.code-nav.cn/prompt-media/23/23894_1.webp",
  "https://pic.code-nav.cn/prompt-media/23/23931_1.webp",
  "https://pic.code-nav.cn/prompt-media/23/24056_1.webp",
  "https://pic.code-nav.cn/prompt-media/23/24092_1.webp",
  "https://pic.code-nav.cn/prompt-media/23/24277_1.webp"
];

// ===== 首页提示词（绘图 / 文字） =====
export const HOME_PROMPTS: HomePrompt[] = [
  { id: 1, title: "可爱风格科普插画", tags: ["可爱", "漫画"], kind: "draw", cover: PROMPT_COVERS[0] },
  { id: 2, title: "城市窗外风景照", tags: ["风景", "写实"], kind: "draw", cover: PROMPT_COVERS[1] },
  { id: 3, title: "关键角色人物关系图", tags: ["电影", "设计"], kind: "draw", cover: PROMPT_COVERS[2] },
  { id: 4, title: "复古怀旧手绘插画", tags: ["复古", "手绘"], kind: "draw", cover: PROMPT_COVERS[3] },
  { id: 5, title: "水彩墨水风格", tags: ["水彩", "淡彩"], kind: "draw", cover: PROMPT_COVERS[4] },
  { id: 6, title: "简约手绘涂鸦风插画", tags: ["手绘", "涂鸦"], kind: "draw", cover: PROMPT_COVERS[5] },
  { id: 7, title: "黏土定格动画风科普插图", tags: ["黏土", "萌趣"], kind: "draw", cover: PROMPT_COVERS[6] },
  { id: 8, title: "奶油色调温馨插画", tags: ["奶油色", "治愈"], kind: "draw", cover: PROMPT_COVERS[7] },
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

// ===== MCP 服务器（/mcp 页，1:1 对齐 ai.codefather.cn/mcp 真实精选列表 · 2026-11-12） =====
// category = 主分类（顶部分类 Tab 过滤用）；tags = 卡片内展示的全部标签（多标签）
export const MCP_CATEGORIES: string[] = [
  "开发工具",
  "研究与数据",
  "安全",
  "分析",
  "浏览器自动化",
  "云平台",
  "通信"
];

function mcp(
  id: number,
  name: string,
  category: string,
  description: string,
  tags: string[],
  url?: string
): McpServer {
  return { id, name, tag: tags[0] || category, category, description, tags, url };
}

export const MCP_SERVERS: McpServer[] = [
  mcp(1, "n8n", "开发工具", "用拖拽+代码组合搭建自动化流程，连私有部署和AI集成都安排得明明白白。", ["开发工具", "命令行工具", "工作流", "integrations", "development", "自动化", "TypeScript"], "https://ai.codefather.cn/mcp/2010664903835574277"),
  mcp(2, "MCP Toolbox For Databases", "开发工具", "用自然语言操作数据库，AI写SQL、管表、建索引，开发快到飞起。", ["开发工具"], "https://ai.codefather.cn/mcp/2010664905790119943"),
  mcp(3, "Context7", "开发工具", "将最新的库文档和代码示例直接获取到 LLM 的 prompts 中。", ["开发工具", "AI"], "https://ai.codefather.cn/mcp/2010664905790119939"),
  mcp(4, "Apify MCP Server", "浏览器自动化", "让 AI 代理一键调用 Apify 海量现成爬虫，轻松抓取社交、电商、地图等任意网站数据。", ["浏览器自动化"], "https://ai.codefather.cn/mcp/2111533207756259329"),
  mcp(5, "Bright Data MCP", "研究与数据", "AI聊天中直接查天气、抓价格，网页数据秒变结构化结果，不用写爬虫也不怕反爬。", ["研究与数据", "scraping", "网页抓取", "data-extraction", "data-collection", "structured-data", "webdata", "browserautomation", "webaccess", "datacollection", "webautomation"], "https://ai.codefather.cn/mcp/2117939930272406116"),
  mcp(6, "XcodeBuildMCP", "开发工具", "用AI直接操作Xcode项目，构建、清理、运行模拟器全都能一句话搞定。", ["开发工具", "xcode", "xcodebuild", "model-context-protocol", "model-context-protocol-servers"], "https://ai.codefather.cn/mcp/2010664904850595847"),
  mcp(7, "🛡️ A.I.G（AI-Infra-Guard）", "安全", "一键扫描本地MCP服务器，自动揪出配置错误、接口暴露等AI基础设施安全风险。", ["安全"], "https://ai.codefather.cn/mcp/2117939930272405739"),
  mcp(8, "MCP Containers", "开发工具", "几百个 MCP 服务一键 Docker 部署，省去环境配置烦恼，本地测试或集群调度都超省心。", ["开发工具", "智能体", "Docker", "安全", "容器", "智能体工作流"], "https://ai.codefather.cn/mcp/2117939930272406557"),
  mcp(9, "BioMCP: Biomedical Model Context Protocol", "研究与数据", "查文献、找基因变异、搜临床试验，一个工具全搞定。", ["研究与数据", "bioinformatics", "AI", "genomics", "pubmed", "pubmed-central"], "https://ai.codefather.cn/mcp/2010664904821235715"),
  mcp(10, "🌳 MCPJungle 🌳", "研究与数据", "统一管理私有MCP工具服务，注册即用、一键下线，让AI代理调用更安全省心。", ["研究与数据", "AI 智能体", "model-context-protocol"], "https://ai.codefather.cn/mcp/2117939930272404696"),
  mcp(11, "MiniMax MCP", "开发工具", "一键生成带克隆语音的图文视频，内容创作效率直接拉满。", ["开发工具", "文字转语音", "娱乐与媒体", "text-to-image", "video-generation", "image-to-video"], "https://ai.codefather.cn/mcp/2117939930272406638"),
  mcp(12, "Time", "开发工具", "让大模型秒懂全球时间，自动转换时区、处理夏令时，再也不用查表算偏移。", ["开发工具", "AI", "time", "timezone"], "https://ai.codefather.cn/mcp/2117939930272407659"),
  mcp(13, "GSuite MCP Server", "开发工具", "用于集成 Google Workspace（GSuite）的 MCP 服务端，使 AI 助手能够访问 Gmail、日历及其他 Google 服务。", ["开发工具", "gsuite", "gmail", "google-calendar", "google-workspace", "邮件"], "https://ai.codefather.cn/mcp/2010664904867373084"),
  mcp(14, "🪐✨ Jupyter MCP Server", "开发工具", "在 Jupyter 里写代码时，AI 能自动读懂变量、输出和执行顺序，协作和续写都更准更顺。", ["开发工具", "工具", "AI", "jupyter"], "https://ai.codefather.cn/mcp/2117939930272407528"),
  mcp(15, "QueryWeaver", "开发工具", "用自然语言提问，自动理解图结构并生成精准 SQL，查数据再也不用写代码。", ["开发工具", "text2sql", "semantic-layer", "falkordb"], "https://ai.codefather.cn/mcp/2117939930272407328"),
  mcp(16, "Agentic Radar", "开发工具", "专为 LLM 代理设计的安全分析工具，本地可视化执行路径、识别工具调用并关联漏洞风险。", ["开发工具", "安全", "命令行工具", "AI", "security-tools", "devsecops"], "https://ai.codefather.cn/mcp/2117939930272407398"),
  mcp(17, "SonarQube", "开发工具", "实现与 SonarQube 服务端 或 Cloud 的无缝集成，并允许在 agent 上下文中进行代码片段分析。", ["开发工具", "集成", "安全", "linting", "static analysis", "clean code", "code quality", "sast", "sonarqube", "代码分析", "ai-integration"], "https://ai.codefather.cn/mcp/2010664904926093322"),
  mcp(18, "Kagi MCP server", "开发工具", "用Kagi MCP在Claude里直接调用精准搜索，查资料写代码更高效。", ["开发工具"], "https://ai.codefather.cn/mcp/2010664904921899024"),
  mcp(19, "MCP server to deploy code to Google Cloud Run", "云平台", "在AI对话中一键部署应用到Cloud Run，自动处理构建、推送和上线，省去命令行和配置烦恼。", ["云平台", "google-cloud", "google-cloud-run"], "https://ai.codefather.cn/mcp/2117939930272404402"),
  mcp(20, "🚀 monday.com MCP", "研究与数据", "让AI代理安全接入monday.com数据，自动化任务和智能决策一键搞定。", ["研究与数据", "copilot", "智能体", "monday"], "https://ai.codefather.cn/mcp/2010664904842207241"),
  mcp(21, "Sentry MCP Server", "开发工具", "让 AI 助手直接查 Sentry 错误、分析堆栈、评估影响，发布后自动巡检稳定性，排查故障不用切页面。", ["开发工具", "sentry", "error-tracking", "调试", "监控", "可观测性", "服务器", "sentry-api", "tag-to-be-production-20250322"], "https://ai.codefather.cn/mcp/2117939930272405804"),
  mcp(22, "Atomic Mail Agentic", "通信", "让 AI 代理自动收发邮件、智能响应，彻底告别手动操作邮件。", ["通信"], "https://ai.codefather.cn/mcp/2101386064513069058"),
  mcp(23, "Anytype MCP Server", "开发工具", "用自然语言查Anytype文件、管任务、整资料，告别点选操作，效率翻倍。", ["开发工具", "API", "anytype", "modelcontextprotocol"], "https://ai.codefather.cn/mcp/2117939930272407395"),
  mcp(24, "1MCP", "开发工具", "统一管理多个MCP服务，省资源、免重启、热更新配置，开发调试更省心。", ["开发工具", "unified-mcp-server"], "https://ai.codefather.cn/mcp/2117939930272405849"),
  mcp(25, "Neon", "分析", "用自然语言直接操作 Neon 数据库，建表、改结构、复制数据一气呵成，告别 SQL 和多工具切换。", ["分析", "AI", "API", "数据库", "neon", "serverless-postgres"], "https://ai.codefather.cn/mcp/2117939930272404462"),
  mcp(26, "Run Model Context Protocol (MCP) servers with AWS Lambda", "云平台", "把本地 MCP stdio 服务一键部署到 AWS Lambda，免运维、按需执行、低成本上云。", ["云平台"], "https://ai.codefather.cn/mcp/2117939930272408433"),
  mcp(27, "📱 MCP Server for iOS Simulator", "开发工具", "用自然语言操控 iOS 模拟器，点应用、截屏、设定位全靠说话，省去重复手动操作。", ["开发工具", "macos", "iOS", "TypeScript", "cline", "Claude"], "https://ai.codefather.cn/mcp/2117939930272407534"),
  mcp(28, "SerpApi MCP Server", "开发工具", "搜什么引擎都行，一行命令拿到结构化搜索结果，爬数据再不用手动复制粘贴。", ["开发工具", "serpapi", "API 集成"], "https://ai.codefather.cn/mcp/2010664903827185668"),
  mcp(29, "VictoriaMetrics MCP Server", "监控", "让AI直接查VictoriaMetrics指标和告警规则，告别手动翻界面、拼API、读YAML。", ["监控", "AI", "可观测性", "victoriametrics", "metrics"], "https://ai.codefather.cn/mcp/2117939930272407061"),
  mcp(30, "Awesome MCP Registry", "开发工具", "像应用商店一样搜MCP服务，一键查接口、看示例、自动集成，省去到处翻文档的麻烦。", ["开发工具"], "https://ai.codefather.cn/mcp/2117939930272406880"),
  mcp(31, "PAIML MCP Agent Toolkit", "开发工具", "秒级解析任意代码库结构，让AI审查像资深工程师一样精准定位问题。", ["开发工具"], "https://ai.codefather.cn/mcp/2117939930272406681"),
  mcp(32, "Meilisearch MCP Server", "研究与数据", "让大模型像聊天一样操作 Meilisearch，搜索、建索引、切环境全靠自然语言一句话搞定。", ["研究与数据"], "https://ai.codefather.cn/mcp/2117939930272407192"),
  mcp(33, "🌈 Taskade MCP", "开发工具", "让AI自动从会议记录提取任务、分配责任人并同步更新，团队协作从此告别手动搬运。", ["开发工具", "效率工具", "AI"], "https://ai.codefather.cn/mcp/2117939930272407354"),
  mcp(34, "🧪-MYj", "研究与数据", "用 MCP 自动授权并监控 AI 调用，管住模型访问权限和成本，实验网关新玩法超省心。", ["研究与数据", "Azure", "OpenAI", "智能体", "foundry", "autogen"], "https://ai.codefather.cn/mcp/2117939930272405593"),
  mcp(35, "AgentQL MCP Server", "研究与数据", "用自然语言指令从动态网页提取结构化数据，电商监控和社媒采集再也不用手写选择器。", ["研究与数据", "智能体", "Web", "AI", "scraping", "网页抓取"], "https://ai.codefather.cn/mcp/2117939930272408275"),
  mcp(36, "DexPaprika MCP Server", "研究与数据", "用自然语言查多链加密数据，DeFi分析从此像聊天一样简单。", ["研究与数据", "加密货币", "dex", "crypto-api", "defi", "crypto-analysis-tool"], "https://ai.codefather.cn/mcp/2010664904963842073"),
  mcp(37, "Vercel MCP Adapter", "开发工具", "在 Next.js 项目里像写页面一样定义 AI 接口，Vercel 自动部署扩缩容，省去后端搭建和运维。", ["开发工具", "vercel", "nextjs", "hosting", "adapter", "框架"], "https://ai.codefather.cn/mcp/2117939930272404919"),
  mcp(38, "Local MCP (LMCP)", "项目管理", "让 Claude 等 AI 直接操作本地邮件、消息、日历和云盘，188+ 工具全离线运行，无需 API 密钥。", ["项目管理"], "https://ai.codefather.cn/mcp/2101386064517263365"),
  mcp(39, "Kodit: A Code Indexing MCP Server", "开发工具", "让 AI 真正读懂你的 Python 项目，自动索引代码结构，补全和生成都更准确更连贯。", ["开发工具", "AI", "ai-code-generation", "ai-coding"], "https://ai.codefather.cn/mcp/2117939930272407156"),
  mcp(40, "membase mcp server", "开发工具", "让AI代理跨会话安全存取去中心化记忆，自动持久化+可验证+支持迁移。", ["开发工具"], "https://ai.codefather.cn/mcp/2117939930272406238"),
  mcp(41, "Webflow's Official MCP Server", "开发工具", "用自然语言查Webflow页面、读CMS数据，改文案调内容像聊天一样丝滑。", ["开发工具", "business-critical-yes", "generated-from-openapi", "built-with-fern", "model-context-protocol"], "https://ai.codefather.cn/mcp/2117939930272404569"),
  mcp(42, "Tiger Data MCP Server", "数据库", "一键启停 PostgreSQL/TimeScaleDB 实例，自然语言查文档、安全查时序数据，开发测试全搞定。", ["数据库", "PostgreSQL", "timescaledb", "tiger", "分析"], "https://ai.codefather.cn/mcp/2117939930272408414"),
  mcp(43, "Kin", "版本控制", "让 AI 和开发者提前看清代码变更影响范围，基于图谱精准定位符号、追踪数据流、评估修改波及面。", ["版本控制"], "https://ai.codefather.cn/mcp/2101386064517263364"),
  mcp(44, "Chrome DevTools MCP Server", "开发工具", "让 AI 直连 Chrome 实时查看页面性能、网络请求和控制台错误，调试前端问题不再靠猜。", ["开发工具", "chrome", "调试", "浏览器", "Web 开发"], "https://ai.codefather.cn/mcp/2117939930272405295"),
  mcp(45, "Hayhooks", "开发工具", "把 Haystack pipeline 一键变成 REST API 或 OpenAI 兼容接口，省去手写服务代码的麻烦。", ["开发工具", "API", "rest", "AI", "haystack", "api-rest"], "https://ai.codefather.cn/mcp/2117939930272407620"),
  mcp(46, "Cognee", "开发工具", "通过从文本构建知识图谱并支持在其中进行搜索，为 AI 记忆引擎提供动力。", ["开发工具", "AI"], "https://ai.codefather.cn/mcp/2010664905790119941"),
  mcp(47, "Core Philosophy: Connect, Unify, Respond", "研究与数据", "用自然语言查遍数据库、SaaS，跨系统数据问答像聊天一样简单。", ["研究与数据", "AI", "数据库", "agi", "智能体", "rag"], "https://ai.codefather.cn/mcp/2010664903818797080"),
  mcp(48, "GitHub MCP Server", "开发工具", "帮助管理仓库、问题、拉取请求和代码。", ["开发工具", "GitHub", "版本控制", "自动化"], "https://ai.codefather.cn/mcp/2010664903822991380"),
  mcp(49, "Blender", "开发工具", "用自然语言直接操控 Blender，建模、查场景、调材质，全程不用点菜单写代码。", ["开发工具", "AI", "blender", "3d-modeling", "AI-integration"], "https://ai.codefather.cn/mcp/2117939930272405554"),
  mcp(50, "Unity MCP ✨", "开发工具", "用自然语言直接操控 Unity 编辑器，改代码、调场景、加组件，全程不用切窗口。", ["开发工具", "AI", "unity", "ai-integration"], "https://ai.codefather.cn/mcp/2117939930272406256"),
  mcp(51, "Claude Context", "开发工具", "让 AI 编码助手直接“读懂”整个项目，语义搜索+全量上下文，提问即得精准答案。", ["开发工具", "AI", "research", "Vibe Coding", "AI Coding", "Claude Code", "Gemini CLI", "Cursor", "Vector Database"], "https://ai.codefather.cn/mcp/2117939930272407539"),
  mcp(52, "🪟 Windows-MCP", "系统自动化", "用自然语言操控Windows桌面，查文件、开软件、点按钮，像聊天一样搞定重复操作。", ["系统自动化", "windows", "工具", "desktop", "windows-10", "windows-11"], "https://ai.codefather.cn/mcp/2117939930272407615"),
  mcp(53, "AutoBrowser MCP", "浏览器自动化", "让 AI 像真人一样操作浏览器，自动查网页、填表单、点按钮，不用写爬虫也不用学编程。", ["浏览器自动化", "autobrowser", "AI 助手"], "https://ai.codefather.cn/mcp/2117939930272405014"),
  mcp(54, "OpenLore", "知识与内容管理", "让 AI 用 ls/cat/grep 直接查你的文档，SSH 或 MCP 接入，零配置、带权限控制和人工审批。", ["知识与内容管理"], "https://ai.codefather.cn/mcp/2101386064517263368"),
  mcp(55, "AWS MCP Servers", "开发工具", "在 IDE 里直接查 AWS 文档、分析 CDK 代码、看实时成本，不用切屏就能搞定云上开发关键任务。", ["开发工具", "AWS", "mcp-servers", "modelcontextprotocol", "mcp-client", "cloud-development"], "https://ai.codefather.cn/mcp/2117939930272404341"),
  mcp(56, "Nginx UI", "开发工具", "点点鼠标就能配 Nginx、续 SSL 证书、看实时监控，告别手写配置和命令行折腾。", ["开发工具", "go", "windows", "macos", "linux", "letsencrypt", "Docker"], "https://ai.codefather.cn/mcp/2117939930272404051"),
  mcp(57, "Lemonade", "研究与数据", "本地跑大模型，NPU加速+OpenAI接口兼容，部署调试一键搞定。", ["研究与数据", "amd", "llama", "mistral", "local-server", "npu"], "https://ai.codefather.cn/mcp/2117939930272407136"),
  mcp(58, "Mux MCP Server (Official)", "娱乐与媒体", "用自然语言就能上传视频、管直播、查播放数据，Mux 官方 MCP 服务开箱即用。", ["娱乐与媒体"], "https://ai.codefather.cn/mcp/2111533207764647943"),
  mcp(59, "LAPRAS MCP Server", "研究与数据", "命令行精准筛选高薪远程岗，一键同步履历更新，找工作像写代码一样丝滑高效。", ["研究与数据"], "https://ai.codefather.cn/mcp/2117939930272408240"),
  mcp(60, "Exa MCP Server", "开发工具", "用自然语言搜代码示例，无需翻文档查论坛，在 IDE 里直接获取结构化、可解析的实现参考。", ["开发工具", "exa", "搜索", "ai-search", "semantic-search", "Web", "TypeScript", "code-search", "code-intelligence", "AI 助手", "exa-api"], "https://ai.codefather.cn/mcp/2117939930272407267"),
  mcp(61, "Octagon: MCP for Market Data", "研究与数据", "查财报、挖并购、析电话纪要，投资研究直接在聊天框里一气呵成。", ["研究与数据", "funding", "company-profile", "investors", "fundraising", "stock-data", "financial-analysis"], "https://ai.codefather.cn/mcp/2117939930272407826"),
  mcp(62, "Dbhub", "分析", "用标准 DSN 一键连多种数据库，查结构、看数据、禁写操作，安全又省事。", ["分析", "AI", "数据库", "MySQL", "PostgreSQL", "SQLite"], "https://ai.codefather.cn/mcp/2117939930272407273"),
  mcp(63, "Polygon.io MCP Server", "研究与数据", "查股票、看行情直接在聊天窗口搞定，AI分析金融数据快得飞起。", ["研究与数据", "options", "加密货币", "fintech", "market-data", "stocks"], "https://ai.codefather.cn/mcp/2010664903827185669"),
  mcp(64, "FastMCP", "开发工具", "用 TypeScript 写个函数就能暴露 MCP 接口，不用写路由、不搞复杂配置，改完即生效。", ["开发工具", "AI", "sse"], "https://ai.codefather.cn/mcp/2117939930272405448"),
  mcp(65, "Grafana MCP Server", "开发工具", "让 AI 助手直接查 Grafana 仪表板、查 Prometheus 指标、管告警，不用写 API、不碰认证细节。", ["开发工具", "grafana", "dashboards", "metrics", "监控", "可观测性"], "https://ai.codefather.cn/mcp/2117939930272407699"),
  mcp(66, "Supergateway", "开发工具", "让本地 stdio 服务秒变远程 SSE 接口，无需改代码、不配代理，团队联调直接发链接。", ["开发工具", "Web", "集成"], "https://ai.codefather.cn/mcp/2117939930272404797"),
  mcp(67, "Perplexity Ask MCP Server", "研究与数据", "在聊天中直接调用 Perplexity 实时搜网页，查资料不用切屏、不丢思路，信息秒回。", ["研究与数据", "mathgpt", "math-solver", "math-assistant"], "https://ai.codefather.cn/mcp/2117939930272404417"),
  mcp(68, "MCP Server for WinDBG Crash Analysis", "研究与数据", "用自然语言查崩溃转储，WinDBG调试从此像聊天一样简单高效。", ["研究与数据", "crash-reports", "crash-dump", "windbg", "windbg-extension", "copilot"], "https://ai.codefather.cn/mcp/2010664904963842055"),
  mcp(69, "Docker MCP Toolkit & Gateway (Official)", "开发工具", "用 Docker 容器安全运行各类 MCP 服务，一键对接 Claude、Cursor、VS Code 等客户端。", ["开发工具"], "https://ai.codefather.cn/mcp/2111533207760453639"),
  mcp(70, "Postgres docs and skills. Helps AI coding tools generate better PostgreSQL code.", "开发工具", "让AI写PostgreSQL更靠谱，查手册、优化查询、适配版本一步到位。", ["开发工具", "数据库", "PostgreSQL", "知识与内容管理", "skills"], "https://ai.codefather.cn/mcp/2117939930272407715"),
  mcp(71, "Firebase MCP Server (Official)", "开发工具", "让 AI 直接管理 Firebase 项目、Auth 用户、Firestore 数据库和安全规则，无需手动切屏操作。", ["开发工具"], "https://ai.codefather.cn/mcp/2111533207760453641"),
  mcp(72, "CloudBase AI ToolKit", "分析", "使用 AI IDE 自动化生成、部署和托管全栈 Web 应用程序、小程序、数据库及后端服务。", ["分析", "AI", "数据库", "Web", "cloudbase", "tencent-cloud", "wechat", "mini-programs", "serverless", "部署"], "https://ai.codefather.cn/mcp/2010664904968036376"),
  mcp(73, "RunPod", "云平台", "一句话控制 RunPod 云 GPU：创建、启停、挂载存储全靠自然语言，告别繁琐控制台操作。", ["云平台", "runpod", "cloud-management"], "https://ai.codefather.cn/mcp/2117939930272406127"),
  mcp(74, "Vantage MCP Server", "研究与数据", "用自然语言查 AWS/Azure/GCP 多云费用，异常自动预警，告别手动切屏和 SQL 查询。", ["研究与数据"], "https://ai.codefather.cn/mcp/2117939930272404472"),
  mcp(75, "Qdrant MCP Server", "开发工具", "让 AI 助手直接调用 Qdrant 做语义检索，RAG 集成免写胶水代码，本地知识库秒级响应。", ["开发工具", "qdrant", "vector-search", "semantic-memory", "embeddings", "ai-integration", "rag", "qdrant-vector-database", "modelcontextprotocol"], "https://ai.codefather.cn/mcp/2117939930272408028"),
  mcp(76, "Playwright MCP Server", "开发工具", "让 AI 助手直接操控浏览器自动化操作，轻松抓取 JS 渲染内容、跑测试、做网页交互。", ["data-extraction", "开发工具", "浏览器自动化"], "https://ai.codefather.cn/mcp/2117939930272406981"),
  mcp(77, "Meta Ads MCP", "开发工具", "用自然语言查广告数据、调预算、看优化建议，多账户Meta投放从此动动嘴就行。", ["开发工具"], "https://ai.codefather.cn/mcp/2117939930272406303"),
  mcp(78, "Npcpy", "开发工具", "用自然语言或管道调用多种AI模型，轻松实现智能体协作与快速验证。", ["开发工具", "AI", "自动化", "集成", "Python", "yaml", "SQL", "Gemini"], "https://ai.codefather.cn/mcp/2117939930272404171"),
  mcp(79, "Heroku MCP Server", "开发工具", "用自然语言管理 Heroku 应用，部署、查状态、配环境变量、装插件全都不用切命令行。", ["开发工具", "heroku", "云服务", "ai-integration", "app-management", "数据库"], "https://ai.codefather.cn/mcp/2117939930272407540"),
  mcp(80, "Kubectl MCP Tool", "开发工具", "用大白话查K8s状态、删Pod、看日志，不用记kubectl命令，调试效率翻倍。", ["开发工具", "Kubernetes", "DevOps", "AI", "部署", "kubernetes-cluster"], "https://ai.codefather.cn/mcp/2117939930272408196"),
  mcp(81, "MCP-NixOS", "开发工具", "查 NixOS 包和配置不用翻文档，AI 直接返回准确选项、默认值和可用表达式。", ["开发工具", "Python", "nix", "nixos", "devops-tools"], "https://ai.codefather.cn/mcp/2117939930272404709"),
  mcp(82, "Supabase MCP Servers", "开发工具", "用自然语言操作 Supabase 数据库，查数据改表再也不用手动写 SQL。", ["开发工具", "mcp-supabase", "llm-connection", "supabase"], "https://ai.codefather.cn/mcp/2010664904976424969"),
  mcp(83, "Pinecone MCP Server", "开发工具", "让 AI 助手一键连接 Pinecone，自动管理向量、实时检索相似内容，上下文注入更准更快。", ["开发工具", "pinecone", "vector-database", "embeddings", "rag", "similarity-search"], "https://ai.codefather.cn/mcp/2117939930272408371"),
  mcp(84, "NestJS MCP Server Module", "开发工具", "让 NestJS 服务秒变 AI 可调用接口，Zod 验证+装饰器注册，无需改架构。", ["开发工具", "nestjs", "大语言模型", "llms", "model-context-protocol", "modelcontextprotocol"], "https://ai.codefather.cn/mcp/2117939930272406985"),
  mcp(85, "CAD-MCP Server (CAD Model Control Protocol Server)", "开发工具", "用大白话指挥AutoCAD等软件画图，说句话就自动生成图形，设计师出图快得飞起。", ["开发工具", "AI", "cad", "model-context-protocol", "cadmcp"], "https://ai.codefather.cn/mcp/2117939930272407769"),
  mcp(86, "Redis MCP Server", "开发工具", "用日常语言查 Redis 缓存或改数据，不用记命令、不写胶水代码，AI 助手直连操作超省心。", ["开发工具", "Redis", "数据库"], "https://ai.codefather.cn/mcp/2117939930272405480"),
  mcp(87, "OpenAPI to MCP Generator (openapi-mcp-generator)", "开发工具", "把 OpenAPI 文档一键转成 MCP 工具，LLM 直接调用你的 API，省去手写胶水代码的麻烦。", ["开发工具"], "https://ai.codefather.cn/mcp/2117939930272404322"),
  mcp(88, "PLUR", "知识与内容管理", "让 AI 代理记住你的偏好和修正，跨工具持久生效，纯文本可读可删，完全本地离线运行。", ["知识与内容管理"], "https://ai.codefather.cn/mcp/2101386064517263372"),
  mcp(89, "Coolify MCP Server", "开发工具", "用自然语言就能部署应用、重启服务、查数据库，Coolify 运维从此告别命令行和控制台。", ["开发工具"], "https://ai.codefather.cn/mcp/2117939930272404224"),
  mcp(90, "Email sending MCP 💌", "开发工具", "在 Cursor 里写代码时顺手发邮件，不用切窗口填地址，30 秒操作压缩成一行指令。", ["开发工具", "邮件", "cursor"], "https://ai.codefather.cn/mcp/2117939930272405667"),
  mcp(91, "Next.js MCP Server (Official)", "开发工具", "让 Claude 等编码助手直连本地 Next.js 16+ 开发服务器，实时读取错误、路由、日志和编译问题。", ["开发工具"], "https://ai.codefather.cn/mcp/2111533207764647944"),
  mcp(92, "Sequential Thinking", "开发工具", "通过将复杂问题分解为多个连续阶段，促进结构化和渐进式的思考。", ["开发工具"], "https://ai.codefather.cn/mcp/2010664903839768597"),
  mcp(93, "Plane MCP Server", "开发工具", "用AI直接操作Plane项目，任务管理、进度追踪全自动化。", ["开发工具", "model-context-protocol"], "https://ai.codefather.cn/mcp/2010664904968036365"),
  mcp(94, "MCP Google Map Server", "研究与数据", "在聊天里直接说“找附近咖啡馆”或“我在北京南站”，自动解析位置、查路线、返回详细信息。", ["研究与数据", "AI", "dive", "google-map"], "https://ai.codefather.cn/mcp/2117939930272404760"),
  mcp(95, "Gitee MCP Server", "开发工具", "让 AI 直连 Gitee 自动评审 PR、处理 Issue 和管理任务，开发协作效率翻倍还不用复制粘贴。", ["开发工具", "gitee", "ai-automation", "cursor", "zed", "cline", "windsurf"], "https://ai.codefather.cn/mcp/2117939930272407315"),
  mcp(96, "OpenZiti / LLM-Gateway", "自主智能体", "用一个轻量 Go 二进制，无缝聚合 OpenAI、Anthropic 等多家 LLM，支持语义路由与零信任安全。", ["自主智能体"], "https://ai.codefather.cn/mcp/2101386064517263369"),
  mcp(97, "Rmcp", "开发工具", "实现一个支持 Model Context Protocol (MCP) 的灵活服务端。", ["开发工具", "AI"], "https://ai.codefather.cn/mcp/2010664904913510404"),
  mcp(98, "Crowdstrike Falcon", "安全", "用AI直接调用CrowdStrike安全数据，威胁检测与响应快人一步。", ["安全", "crowdstrike", "falcon", "security-analysis"], "https://ai.codefather.cn/mcp/2010664904850595849"),
  mcp(99, "Docker Hub MCP Server", "开发工具", "用自然语言查 Docker 镜像、看标签、验仓库状态，AI 运维从此告别手动翻页和写 API 脚本。", ["开发工具", "Docker", "容器", "repositories", "DevOps", "自动化"], "https://ai.codefather.cn/mcp/2117939930272406747"),
  mcp(100, "Xero MCP Server", "开发工具", "连上 Xero 后，开票、查账、管客户全靠标准指令，不用再啃 API 文档和写重复认证逻辑。", ["开发工具"], "https://ai.codefather.cn/mcp/2117939930272404532"),
  mcp(101, "Notion MCP Server", "开发工具", "让 AI 直接读写 Notion 页面和数据库，自动处理认证与 API 细节，省去所有胶水代码。", ["开发工具", "Notion", "知识与内容管理", "效率工具", "服务器"], "https://ai.codefather.cn/mcp/2117939930272405539"),
  mcp(102, "MCP 3D Printer Server", "开发工具", "远程控制多台3D打印机，STL编辑切片一键搞定，打印监控全掌握。", ["开发工具", "threejs", "octoprint", "duet", "three-js", "3d-printing"], "https://ai.codefather.cn/mcp/2010664903843962884"),
  mcp(103, "LINE Bot MCP Server", "开发工具", "让 AI 直接接管 LINE 官方号，发文本、Flex 卡片、读用户资料，客服自动化一气呵成。", ["开发工具", "line", "linebot"], "https://ai.codefather.cn/mcp/2117939930272406809"),
  mcp(104, "yt-dlp-mcp", "开发工具", "一句话安利：粘贴链接就能全自动下载音视频+同步字幕，本地存档不丢内容，离线也能随时学、随时听。", ["开发工具"], "https://ai.codefather.cn/mcp/2117939930272406960"),
  mcp(105, "container-use", "开发工具", "让AI在隔离容器里安全运行代码，多环境测试、构建、扫描一键自动搞定。", ["开发工具", "container-use", "AI 智能体", "MCP-server"], "https://ai.codefather.cn/mcp/2117939930272405951"),
  mcp(106, "Needle MCP Server", "研究与数据", "用自然语言搜文档，AI自动跨文件定位语义相关内容，合同论文资料秒级精准召回。", ["研究与数据", "needle-mcp-server", "AI-integration", "document-management", "needle", "semantic-search"], "https://ai.codefather.cn/mcp/2117939930272404619"),
  mcp(107, "MCP Teams Server", "通信", "在 Teams 里自动发消息、提成员、回线程，把重复通知交给它，团队专注真正需要判断的事。", ["通信", "msteams", "inditex"], "https://ai.codefather.cn/mcp/2117939930272404095"),
  mcp(108, "FreeCAD MCP", "开发工具", "用自然语言直接操控 FreeCAD 建模，跨平台批量处理零件，省去脚本编写和环境配置烦恼。", ["开发工具", "freecad", "Claude"], "https://ai.codefather.cn/mcp/2117939930272406898"),
  mcp(109, "Stakpak Agent CLI", "开发工具", "终端里点几下就搞定部署运维，自动续跑、智能提示，告别命令行疲劳。", ["开发工具"], "https://ai.codefather.cn/mcp/2117939930272408388"),
  mcp(110, "Razorpay MCP Server (Official)", "开发工具", "用自然语言直接查订单、发付款链接，AI 接入 Razorpay 支付从此零手写 API。", ["开发工具", "razorpay"], "https://ai.codefather.cn/mcp/2117939930272408372"),
  mcp(111, "OrangePro", "开发工具", "本地跑起行为映射与测试生成服务，用真实代码和已有测试做扎实验证。", ["开发工具"], "https://ai.codefather.cn/mcp/2101386064517263371"),
  mcp(112, "Discourse Mcp Server", "研究与数据", "用AI直接读写Discourse论坛，发帖查内容像聊天一样自然。", ["研究与数据", "知识与内容管理", "mcp-tools", "discourse"], "https://ai.codefather.cn/mcp/2010664903814602767"),
  mcp(113, "Mermaid MCP Server", "开发工具", "写几行 Mermaid 代码，秒出高清 PNG 图，技术文档和架构图从此一气呵成。", ["开发工具", "mathgpt", "math-solver", "math-assistant", "mermaid", "diagram-rendering"], "https://ai.codefather.cn/mcp/2117939930272407490"),
  mcp(114, "Couchbase MCP Server", "开发工具", "用自然语言查Couchbase数据，Claude直接对话数据库，省去写SQL++的麻烦。", ["开发工具", "couchbase"], "https://ai.codefather.cn/mcp/2010664903827185686"),
  mcp(115, "GPT Researcher", "开发工具", "通过 MCP 协议使 LLM 应用能够执行深入的研究。", ["开发工具", "AI"], "https://ai.codefather.cn/mcp/2010664905790119940"),
  mcp(116, "Maigret MCP Server", "研究与数据", "搜用户名、挖数字足迹，一键生成多格式报告，安全合规做情报分析超省心。", ["研究与数据"], "https://ai.codefather.cn/mcp/2010664904968036367"),
  mcp(117, "MCP TypeScript Template 🚀", "开发工具", "用TypeScript快速搭建类型安全的MCP服务，集成日志、限流等生产级功能。", ["开发工具", "template", "ts", "大语言模型", "llm-agent", "model-context-protocol"], "https://ai.codefather.cn/mcp/2010664904921899028"),
  mcp(118, "mcp-local-rag", "研究与数据", "本地跑RAG搜索，零数据外泄，Claude查网页像开了挂。", ["研究与数据", "rag", "web-seach", "model-context-protocol"], "https://ai.codefather.cn/mcp/2010664904938676237"),
  mcp(119, "IDA Pro MCP", "开发工具", "用浏览器就能远程调用IDA Pro分析功能，逆向工程协作变得超方便。", ["开发工具", "reverse-engineering", "ida-pro", "cursor", "ida-plugin", "cline"], "https://ai.codefather.cn/mcp/2010664903835574273"),
  mcp(120, "MCP Server for ZenML", "研究与数据", "用自然语言查ZenML流水线状态、复现实验或触发训练，告别命令行和多窗口切换。", ["研究与数据", "mlops", "llmops"], "https://ai.codefather.cn/mcp/2117939930272408191"),
  mcp(121, "Atlassian MCP Server (Jira & Confluence)", "版本控制", "让 AI 直接查 Jira 工单、改 Confluence 文档，云版和私有部署全支持。", ["版本控制"], "https://ai.codefather.cn/mcp/2111533207756259332"),
  mcp(122, "Alibaba Cloud Ops MCP Server", "云平台", "用标准协议一键管理阿里云ECS、VPC等资源，运维操作全自动化。", ["云平台", "cloudops", "alibabacloud", "大语言模型"], "https://ai.codefather.cn/mcp/2010664904959647754"),
  mcp(123, "Mailtrap Email Sending MCP", "开发工具", "用 Mailtrap 在沙箱里发测试邮件，安全预览效果，彻底告别误发用户邮箱的尴尬。", ["开发工具", "mailtrap", "email-api", "transactional-emails"], "https://ai.codefather.cn/mcp/2117939930272405181"),
  mcp(124, "Apollo MCP Server", "开发工具", "让 AI 像聊天一样调用 GraphQL 接口，自动生成可发现、可调试的 MCP 工具，省去手动拼接查询和适配胶水代码。", ["开发工具"], "https://ai.codefather.cn/mcp/2117939930272405840"),
  mcp(125, "Rust MCP SDK", "开发工具", "用 Rust 快速构建类型安全的 MCP 服务端/客户端，异步通信零手写序列化，编译期就能捕获协议错误。", ["开发工具", "AI", "Rust", "crates-io", "model-context-protocol", "mcp-client", "mcp-tools"], "https://ai.codefather.cn/mcp/2117939930272406445"),
  mcp(126, "🚀 Claude Custom Prompts MCP Server", "开发工具", "用 Markdown 写提示模板，让 Claude 自动执行客户邮件、会议纪要等结构化任务，省时又统一。", ["开发工具", "nodejs", "TypeScript", "ai-automation", "ai-development", "ai-workflows", "claude-ai"], "https://ai.codefather.cn/mcp/2117939930272404570"),
  mcp(127, "mcp-simple-arxiv", "研究与数据", "直接对话搜 arXiv 最新论文，秒得标题摘要+PDF 直链，写论文查文献再也不用切页面。", ["研究与数据"], "https://ai.codefather.cn/mcp/2117939930272408136"),
  mcp(128, "OpenZiti MCP Gateway", "自主智能体", "用零信任网关安全接入任意MCP工具，无需暴露端口、不用VPN，跨网络也能隔离调用。", ["自主智能体"], "https://ai.codefather.cn/mcp/2101386064517263370"),
  mcp(129, "Ha Mcp For Xiaozhi", "开发工具", "用小智AI语音直控Home Assistant，装上就说话开关灯，无需公网配置和令牌管理。", ["开发工具"], "https://ai.codefather.cn/mcp/2117939930272407967"),
  mcp(130, "Mcp Solver", "自主智能体", "用自然语言描述排班、调度等约束问题，自动转成 MiniZinc 模型并求解，无需手写代码或配置环境。", ["自主智能体", "AI"], "https://ai.codefather.cn/mcp/2117939930272406271"),
  mcp(131, "Rootly MCP Server", "开发工具", "在 IDE 里直接响应线上事故，查事件、分任务、更状态，全程不用切屏。", ["开发工具"], "https://ai.codefather.cn/mcp/2117939930272404976"),
  mcp(132, "Actionmcp", "自主智能体", "为 Ruby on Rails 应用程序提供 Model Context Protocol (MCP) 能力，特别是作为服务端。", ["自主智能体", "AI", "大语言模型", "mcp-client"], "https://ai.codefather.cn/mcp/2010664904917704711"),
  mcp(133, "blender-open-mcp", "开发工具", "用自然语言在Blender里建模，3D创作像聊天一样简单。", ["开发工具", "Python", "blender3d", "blender", "blender-addon", "model-context-protocol"], "https://ai.codefather.cn/mcp/2010664904867373063"),
  mcp(134, "Web3 Research MCP", "研究与数据", "本地跑加密尽调，一键聚合链上、社区、代码数据，生成结构化报告。", ["研究与数据", "mcp-crypto"], "https://ai.codefather.cn/mcp/2117939930272405580"),
  mcp(135, "Smithery CLI", "自主智能体", "一键部署、查看和管理本地 MCP 服务器，告别手动配置和环境混乱。", ["自主智能体", "AI"], "https://ai.codefather.cn/mcp/2117939930272407096"),
  mcp(136, "Search1API", "开发工具", "用 MCP 直接调用 Search1API，一键搜索、提取网页正文、生成站点地图，省去爬虫和解析的麻烦。", ["开发工具", "AI", "API", "research", "search1api", "web-crawler", "sitemap-extractor"], "https://ai.codefather.cn/mcp/2117939930272407043"),
  mcp(137, "CodeAlive", "开发工具", "用自然语言秒查跨语言代码逻辑，新老项目上手快、协作沟通少跑偏。", ["开发工具", "AI", "research", "codealive", "code-search", "AI 助手"], "https://ai.codefather.cn/mcp/2117939930272405992"),
  mcp(138, "Hostinger", "自主智能体", "直接用聊天框管理 Hostinger 主机、域名、VPS 和 WordPress，372 个工具全靠 OAuth 一键授权。", ["自主智能体"], "https://ai.codefather.cn/mcp/2101386064517263363"),
  mcp(139, "FalkorDB MCP Server", "数据库", "让开发者分钟级启动数据库服务，结构化与非结构化数据统一高效存取。", ["数据库"], "https://ai.codefather.cn/mcp/2117939930272407753"),
  mcp(140, "Paperless-NGX MCP Server", "开发工具", "让 AI 直接搜索、上传、分类 Paperless-NGX 文档，告别手动归档和复杂 API 调用。", ["开发工具", "AI", "document-management", "paperless-ngx"], "https://ai.codefather.cn/mcp/2117939930272404584"),
  mcp(141, "SigNoz MCP Server", "开发工具", "让 AI 直接读取 SigNoz 的指标、告警和仪表盘，排查线上问题不用切屏查数据。", ["开发工具", "signoz", "可观测性", "监控", "metrics", "alerts", "dashboards"], "https://ai.codefather.cn/mcp/2117939930272406753"),
  mcp(142, "arxiv-latex MCP Server", "研究与数据", "看arXiv论文时自动获取原始LaTeX源码，让Claude精准解析复杂公式，告别PDF导致的数学误读。", ["研究与数据", "latex", "arxiv", "大语言模型", "claude-desktop", "cursor-ai"], "https://ai.codefather.cn/mcp/2117939930272404521"),
  mcp(143, "VirusTotal MCP Server", "研究与数据", "在聊天或分析界面中直接查网址、文件哈希和IP安全状态，不用切屏就能快速识别网络威胁。", ["研究与数据"], "https://ai.codefather.cn/mcp/2117939930272408220"),
  mcp(144, "mcp-pandoc: A Document Conversion MCP Server", "开发工具", "在聊天中直接转换 Markdown/HTML/TXT，告别手动脚本和复制粘贴，格式兼容强还带语义保留。", ["开发工具", "pandoc", "pandoc-markdown", "pandoc-template"], "https://ai.codefather.cn/mcp/2117939930272408109"),
  mcp(145, "Codescene", "开发工具", "让 AI 编程时实时感知代码健康状况，自动避开高风险区域，提升长期可维护性。", ["开发工具", "codescene", "code-health", "AI 工具"], "https://ai.codefather.cn/mcp/2117939930272405966"),
  mcp(146, "MCP Client for Ollama (ollmcp)", "开发工具", "用命令行连多个MCP服务器，本地大模型调工具就像搭乐高一样轻松。", ["开发工具", "open-source", "AI", "sse", "model-selection", "stdio"], "https://ai.codefather.cn/mcp/2010664904817041420"),
  mcp(147, "MCP GitHub Project Manager", "开发工具", "用AI直接操作GitHub项目看板，自动管任务、里程碑和冲刺，团队协作效率翻倍。", ["开发工具", "效率工具", "roadmap", "product", "TypeScript", "AI"], "https://ai.codefather.cn/mcp/2010664904775098389"),
  mcp(148, "Magic MCP Server", "开发工具", "在 IDE 里直接用自然语言生成符合项目规范的 UI 组件，告别复制粘贴和风格不统一。", ["开发工具", "ui-components", "前端", "ai-coding", "ide-integration"], "https://ai.codefather.cn/mcp/2117939930272406352"),
  mcp(149, "Octocode", "开发工具", "用自然语言秒搜 GitHub/NPM 代码，跨仓库理解调用关系，本地运行不传数据。", ["开发工具", "AI", "research", "集成", "GitHub", "code-search", "code-discovery", "AI 助手"], "https://ai.codefather.cn/mcp/2117939930272406100"),
  mcp(150, "GenPilot", "开发工具", "几条命令就能拉起多智能体系统，自动对接 MCP 服务，省去协议配置和通信适配的麻烦。", ["开发工具", "AI", "集成"], "https://ai.codefather.cn/mcp/2117939930272407067"),
  mcp(151, "Codescene", "开发工具", "让AI编程时实时获取代码健康洞察，本地化分析提升质量与可维护性。", ["开发工具", "codescene", "code-health", "AI 工具"], "https://ai.codefather.cn/mcp/2010664901956526087"),
  mcp(152, "PapersGPT For Zotero", "研究与数据", "读PDF不用翻页了，和Zotero里的论文聊聊天就能出摘要、找重点。", ["研究与数据", "Zotero", "Chat PDF", "Search in Zotero"], "https://ai.codefather.cn/mcp/2010664903848157192"),
  mcp(153, "deepl-mcp-server", "研究与数据", "选中文字就自动识别语种+翻译润色，正式度可调，写文档聊工作再也不用切网页。", ["研究与数据"], "https://ai.codefather.cn/mcp/2117939930272405896"),
  mcp(154, "Harness MCP Server", "开发工具", "用 MCP 一键触发 Harness 流水线和仓库操作，告别浏览器手动点按和 API 脚本折腾。", ["开发工具", "自动化"], "https://ai.codefather.cn/mcp/2117939930272407974"),
  mcp(155, "Server2MCP Spring Boot Starter", "开发工具", "让 Spring Boot 项目一键接入 MCP 服务，自动管理连接与上下文，专注写业务逻辑就行。", ["开发工具", "AI", "Web", "Java", "智能体", "框架", "spring", "spring-boot"], "https://ai.codefather.cn/mcp/2117939930272406882"),
  mcp(156, "MemoryMesh", "自主智能体", "让 AI 自动构建并调用知识图谱记忆，对话、事件、角色关系全留存，无需手动设计数据库结构。", ["自主智能体", "AI"], "https://ai.codefather.cn/mcp/2117939930272405276"),
  mcp(157, "Mcp Agent", "开发工具", "轻松搭建多AI协作系统，自动管理MCP连接与智能体协同，省去繁琐底层代码。", ["开发工具", "Python", "AI", "智能体", "AI 智能体", "大语言模型"], "https://ai.codefather.cn/mcp/2117939930272407494"),
  mcp(158, "BrowserTools MCP", "开发工具", "一个支持浏览器监控与交互的 MCP 服务端，使 AI 工具能够捕获、分析并与其浏览器活动进行交互。", ["开发工具", "browser-tools", "chrome-extension", "cursor", "调试", "seo", "performance", "AI", "anthropic"], "https://ai.codefather.cn/mcp/2010664904913510420"),
  mcp(159, "Desktop Commander", "开发工具", "用自然语言操控本地电脑，执行终端命令、管理文件、编辑内容，告别切屏和记命令。", ["开发工具", "[developer-tools", "效率工具", "自动化", "terminal", "知识与内容管理", "process-control"], "https://ai.codefather.cn/mcp/2117939930272404272"),
  mcp(160, "mcp-servers-nix", "开发工具", "用 Nix 一键部署 MCP 服务器，模块化配置、环境一致、开箱即用，彻底告别环境不一致烦恼。", ["开发工具"], "https://ai.codefather.cn/mcp/2117939930272404846"),
  mcp(161, "UML-MCP: A Diagram Generation Server with MCP Interface", "开发工具", "用自然语言秒出UML类图、时序图，嵌入文档或AI对话，设计表达从此零门槛。", ["开发工具", "uml-mcp", "diagram-generation", "mcp-interface"], "https://ai.codefather.cn/mcp/2117939930272407650"),
  mcp(162, "Mcp Directory", "研究与数据", "一键发现、贡献和更新MCP服务器，告别手动搜寻与配置踩坑，开发者都在用的实时服务清单。", ["研究与数据", "mcp-servers", "awesome-mcp-servers", "mcp-server-store", "mcp-servers-directory", "model-context-protocol", "mcp-clients"], "https://ai.codefather.cn/mcp/2117939930272407713"),
  mcp(163, "Odoo MCP Server", "开发工具", "让 AI 像聊天一样安全操作 Odoo 数据，自动查订单、录客户、更库存，省去写接口的麻烦。", ["开发工具", "odoo", "mcp-servers", "odoo-mcp"], "https://ai.codefather.cn/mcp/2117939930272406957"),
  mcp(164, "DICOM MCP Server for Medical Imaging Systems 🏥", "研究与数据", "用自然语言查PACS影像、自动提取DICOM数据，医疗影像调试和测试从此一键搞定。", ["研究与数据"], "https://ai.codefather.cn/mcp/2117939930272404414"),
  mcp(165, "Infisical Model Context Protocol", "开发工具", "连上 Infisical 就能直接管密钥、配环境，团队协作开发更安全高效。", ["开发工具"], "https://ai.codefather.cn/mcp/2010664904888344588"),
  mcp(166, "Argo CD", "自主智能体", "用自然语言查 Argo CD 应用状态或执行同步/回滚，告别 CLI 和网页切换，运维效率直接拉满。", ["自主智能体", "AI", "argocd", "Kubernetes", "DevOps"], "https://ai.codefather.cn/mcp/2117939930272404514"),
  mcp(167, "⚡️ mcpo", "开发工具", "一行命令就把本地 MCP 工具转成标准 OpenAPI 接口，LLM 调用、前端集成、文档生成全都不用操心。", ["开发工具", "openapi", "open-webui", "mcp-to-openapi", "mcpo", "proxy"], "https://ai.codefather.cn/mcp/2117939930272405782"),
  mcp(168, "DaVinci Resolve MCP Server", "开发工具", "用自然语言操控 DaVinci Resolve，自动打标、剪辑、管理素材，告别重复手动操作。", ["开发工具", "blackmagic", "blackmagic-design", "blackmagicdesign", "davinci-resolve", "davinciresolve"], "https://ai.codefather.cn/mcp/2117939930272405413"),
  mcp(169, "KiCAD MCP: AI-Assisted PCB Design", "研究与数据", "用自然语言操控 KiCAD 画板改布局调参数，告别繁琐点击，设计效率直接翻倍。", ["研究与数据"], "https://ai.codefather.cn/mcp/2117939930272408202"),
  mcp(170, "Google Search Console MCP Server (mcp-gsc)", "搜索", "在聊天里直接查GSC数据，点几下就能看流量变化、索引状态和关键词表现，SEO分析不用再切网页。", ["搜索"], "https://ai.codefather.cn/mcp/2111533207764647940"),
  mcp(171, "MCP server for LogSeq", "开发工具", "让AI直接读写LogSeq笔记，自动整理会议纪要和项目进度超省心。", ["开发工具", "mcp-logseq", "logseq", "AI 助手", "API 集成"], "https://ai.codefather.cn/mcp/2010664904926093326"),
  mcp(172, "Trade Agent MCP Server", "金融", "用自然语言买卖股票加密货币，查账户、跟投策略一气呵成，无需写代码也不用记命令。", ["金融"], "https://ai.codefather.cn/mcp/2117939930272407574"),
  mcp(173, "pyATS MCP Server", "开发工具", "让 pyATS 支持多通道上下文通信，多设备并行测试不再状态错乱、手动传参。", ["开发工具"], "https://ai.codefather.cn/mcp/2117939930272404085"),
  mcp(174, "Anki MCP Server", "开发工具", "让大模型一键生成、编辑、查询 Anki 卡片，背单词学知识全程免复制粘贴。", ["开发工具", "anki", "cline", "anki-connect", "大语言模型", "mathgpt", "math-solver", "math-assistant", "flashcards"], "https://ai.codefather.cn/mcp/2117939930272407907"),
  mcp(175, "Lokka (Microsoft 365 MCP server)", "开发工具", "用大白话管M365资源，查邮件、设权限再也不用翻文档敲代码。", ["开发工具", "microsoft-graph", "AI 助手"], "https://ai.codefather.cn/mcp/2010664904934481937"),
  mcp(176, "Academia MCP", "研究与数据", "输入主题一键搜遍知网、PubMed、Google Scholar 等多库论文，写综述再也不用挨个平台翻。", ["研究与数据", "mathgpt", "math-solver", "math-assistant"], "https://ai.codefather.cn/mcp/2117939930272407538"),
  mcp(177, "MCP Server for Milvus", "研究与数据", "让大模型像聊天一样直查 Milvus 向量库，搜文档、做分析不用写代码、不搭中间层。", ["研究与数据", "milvus", "llm-integration"], "https://ai.codefather.cn/mcp/2117939930272407944"),
  mcp(178, "SEC EDGAR MCP", "研究与数据", "用自然语言秒查美股财报数据，AI自动定位并提取10-K/10-Q关键指标，告别手动翻页和格式解析。", ["研究与数据", "金融", "edgar", "edgar-database", "大语言模型", "genai"], "https://ai.codefather.cn/mcp/2117939930272404334"),
  mcp(179, "Defang", "云平台", "在 IDE 里写完代码直接部署上云，不用切平台、不记 CLI，连成本都能实时预估。", ["云平台", "云服务", "部署", "AWS", "GCP", "DO"], "https://ai.codefather.cn/mcp/2117939930272404567"),
  mcp(180, "IMCP – Apple iMessage, Reminders, Calendar, Contacts and more", "开发工具", "本地一键启停iMessage、日历等系统服务，全程离线运行，隐私数据永不离开Mac。", ["开发工具", "swift", "apple", "imessage"], "https://ai.codefather.cn/mcp/2117939930272404915"),
  mcp(181, "Browser Control MCP", "浏览器自动化", "让AI直接操控本地Firefox，自动查资料、读网页、提重点，不写爬虫也不用复制粘贴。", ["浏览器自动化", "firefox", "browser-extension"], "https://ai.codefather.cn/mcp/2117939930272405601"),
  mcp(182, "Keboola MCP Server", "研究与数据", "在 AI 工具里直接浏览 Keboola 表结构、预览数据并一键导出 CSV，告别反复登录和手动复制。", ["研究与数据", "data-platform", "etl-pipeline", "model-context-protocol"], "https://ai.codefather.cn/mcp/2117939930272404164"),
  mcp(183, "ms-365-mcp-server", "开发工具", "不用折腾 OAuth 和 Graph API，直接远程读写改 M365 Excel，做图表、更新报表一气呵成。", ["开发工具"], "https://ai.codefather.cn/mcp/2117939930272404448"),
  mcp(184, "📡 UniFi Network MCP Server", "研究与数据", "用自然语言查改 UniFi 防火墙、QoS、VLAN 等配置，让网络运维像聊天一样简单安全。", ["研究与数据", "unifi"], "https://ai.codefather.cn/mcp/2117939930272407282"),
  mcp(185, "MCP server for Obsidian", "开发工具", "用API远程读写Obsidian笔记，搜索、更新全自动，自动化管理超省心。", ["开发工具"], "https://ai.codefather.cn/mcp/2010664903822991384"),
  mcp(186, "Obsidian MCP Server", "开发工具", "一个将 AI 助手与 Obsidian 仓库连接用于知识管理的 MCP 服务端。", ["开发工具", "obsidian", "知识与内容管理", "Markdown", "ai-integration", "note-management", "knowledge-discovery", "model-context-protocol", "couchdb", "TypeScript", "AI 工具"], "https://ai.codefather.cn/mcp/2010664903818797072"),
  mcp(187, "Mifos X", "开发工具", "专为 Apache Fineract 打造，本地一键启动金融模型调试服务，告别胶水代码和日志盲调。", ["开发工具"], "https://ai.codefather.cn/mcp/2117939930272407568"),
  mcp(188, "mcp-design-system-extractor", "开发工具", "一键从 Storybook 提取组件 HTML 和样式，让 AI 写代码更准、前端开发更快、设计规范落地更稳。", ["开发工具", "design-system", "extractor"], "https://ai.codefather.cn/mcp/2117939930272406977"),
  mcp(189, "datris-platform-oss", "开发工具", "让 AI 代理一键接入数据平台，自动完成采集、校验、转换与多端落地，全程可追溯、不碰密钥。", ["开发工具"], "https://ai.codefather.cn/mcp/2101386064513069060"),
  mcp(190, "Official Porkbun MCP Server", "开发工具", "让 AI 助手直接安全管理 Porkbun 域名和 DNS，查价注册、改记录、回滚配置，还能预演高危操作。", ["开发工具"], "https://ai.codefather.cn/mcp/2106459331854630913"),
  mcp(191, "OmniFocus MCP Server", "开发工具", "用一句话就能给 OmniFocus 加任务、设截止、自动归类，语音输入秒变结构化待办。", ["开发工具", "omnifocus", "modelcontextprotocol"], "https://ai.codefather.cn/mcp/2117939930272405636"),
  mcp(192, "MCP Redmine", "开发工具", "在 Claude 里直接查 Redmine 任务、改状态、传文件、记工时，全程不用切屏。", ["开发工具"], "https://ai.codefather.cn/mcp/2117939930272407347"),
  mcp(193, "Mcp Gateway", "开发工具", "让现有 REST/gRPC 服务零代码改造接入 MCP，反向代理自动转换协议，部署快、监控全。", ["开发工具", "AI", "社交", "awesome", "mcp-gateway", "mcp-adapter", "rest-to-mcp", "Python", "Docker", "Kubernetes", "DevOps", "jwt", "工具", "智能体", "proxy", "gateway", "generative-ai"], "https://ai.codefather.cn/mcp/2117939930272408260"),
  mcp(194, "Claude Project Coordinator", "开发工具", "通过提供强大的项目状态跟踪、代码模式搜索和知识库管理工具，简化多项目 Xcode 开发。", ["开发工具", "research", "swift", "xcode", "项目管理", "Claude", "swiftui"], "https://ai.codefather.cn/mcp/2010664902103326729"),
  mcp(195, "MCPEngine", "开发工具", "让 LLM 安全调用企业内部 API，OAuth 认证+细粒度权限控制，不改架构也能快速集成。", ["开发工具"], "https://ai.codefather.cn/mcp/2117939930272405468"),
  mcp(196, "Twelve Data", "开发工具", "用 WebSocket 实时获取股票、外汇和加密货币行情，无需反复解析格式，开箱即用。", ["开发工具", "Web", "分析", "金融", "time-series", "quotes"], "https://ai.codefather.cn/mcp/2117939930272405305"),
  mcp(197, "Claude Project Coordinator", "开发工具", "专为 macOS 开发者设计，一键统管多个 Xcode 项目，跨工程搜代码、识技术栈、免手动梳理。", ["开发工具", "research", "swift", "xcode", "项目管理", "Claude", "swiftui"], "https://ai.codefather.cn/mcp/2117939930272406311"),
  mcp(198, "Tauri MCP Server", "开发工具", "让 AI 直接操控 Tauri 应用界面，调试日志、自动化测试一气呵成。", ["开发工具", "tauri", "development", "移动端", "desktop", "自动化", "visual"], "https://ai.codefather.cn/mcp/2010664904921899025"),
  mcp(199, "Radare2 MCP Server", "开发工具", "用自然语言和 AI 一起分析二进制，逆向工程像聊天一样轻松搞定。", ["开发工具", "radare2", "服务器", "binary-analysis"], "https://ai.codefather.cn/mcp/2117939930272407440"),
  mcp(200, "Prometheus MCP Server", "研究与数据", "在聊天框里用大白话问监控问题，自动写 PromQL、查指标、给结论，运维排查快人一步。", ["研究与数据", "DevOps", "AI", "prometheus", "大语言模型"], "https://ai.codefather.cn/mcp/2117939930272406714"),
  mcp(201, "GIS MCP Server", "研究与数据", "让大模型直接做GIS分析，算面积、转坐标、判重叠，不用装QGIS也能搞定空间运算。", ["研究与数据"], "https://ai.codefather.cn/mcp/2117939930272407039"),
  mcp(202, "Blockscout MCP Server", "研究与数据", "像聊天一样查多链余额和交易，AI 直接调用统一接口，不用反复适配不同链的 RPC。", ["研究与数据", "blockscout", "blockchain-data"], "https://ai.codefather.cn/mcp/2117939930272404655"),
  mcp(203, "Private Journal MCP Server", "研究与数据", "本地写日记记笔记，隐私零泄露，还能用自然语言秒搜过往内容。", ["研究与数据", "private-journal", "journaling"], "https://ai.codefather.cn/mcp/2117939930272406232"),
  mcp(204, "欢迎来到 智言平台", "开发工具", "用对话驱动任务自动化，自定义智能体轻松集成复杂逻辑。", ["开发工具", "智能体", "大语言模型", "langchain"], "https://ai.codefather.cn/mcp/2010664904758321156"),
  mcp(205, "🎯 ShotGrid MCP Server", "开发工具", "直接连 ShotGrid 增删改查任务/镜头/资产，影视特效团队自动化协作更省心。", ["开发工具"], "https://ai.codefather.cn/mcp/2117939930272404773"),
  mcp(206, "Microsoft 365 MCP Server", "开发工具", "用CLI集中管理Microsoft 365，自动化操作更高效，运维开发省时省力。", ["开发工具", "microsoft365", "命令行工具"], "https://ai.codefather.cn/mcp/2010664904938676227"),
  mcp(207, "ADB Friend", "开发工具", "用自然语言一键卸载测试应用、配置调试环境，连 AI 都能直接操控安卓设备。", ["开发工具", "Android", "kotlin", "命令行工具", "工具", "AI", "adb"], "https://ai.codefather.cn/mcp/2117939930272407232"),
  mcp(208, "StarRocks Official MCP Server", "开发工具", "让AI直接连StarRocks查数据，自动生成并执行SQL，还能实时感知表结构，分析探索超省心。", ["开发工具", "智能体", "数据库", "AI", "starrocks", "model-context-protocol"], "https://ai.codefather.cn/mcp/2117939930272407800"),
  mcp(209, "mcp-kubernetes", "开发工具", "用自然语言查Pod、看节点状态、管K8s资源，告别kubectl命令记忆和终端切换。", ["开发工具", "Kubernetes", "model-context-protocol"], "https://ai.codefather.cn/mcp/2117939930272407804"),
  mcp(210, "Reaper MCP Server", "开发工具", "用自然语言秒查 Reaper 工程信息，自动扫描项目、定位标记和修改记录，混音师再也不用手动翻找。", ["开发工具"], "https://ai.codefather.cn/mcp/2117939930272405737"),
  mcp(211, "Code-Index-MCP (Local-first Code Indexer)", "开发工具", "本地跑代码索引+语义搜索，让AI秒懂整个项目结构，不用复制粘贴也能精准问答。", ["开发工具", "code-indexer", "local-first", "AI 助手"], "https://ai.codefather.cn/mcp/2117939930272408158"),
  mcp(212, "Easy Code Reader", "开发工具", "专治 Java 项目阅读困难症，自动抠源码+智能反编译，AI 理清架构一步到位。", ["开发工具", "easy-code-reader", "java-source-code"], "https://ai.codefather.cn/mcp/2117939930272408391"),
  mcp(213, "OSV MCP Server", "研究与数据", "查开源库漏洞像搜关键词一样简单，开发时顺手一查，风险早知道。", ["研究与数据"], "https://ai.codefather.cn/mcp/2117939930272407776"),
  mcp(214, "ClimateTraceKMP", "开发工具", "直接可视化 ClimateTrace 全球排放数据，无需注册下载，点选国家行业秒看趋势图表。", ["开发工具", "分析", "Android", "kotlin", "swift", "wasm", "compose"], "https://ai.codefather.cn/mcp/2117939930272408443"),
  mcp(215, "Framelink Figma MCP Server", "开发工具", "粘贴 Figma 链接就能把设计转代码，Cursor 开发效率直接拉满。", ["开发工具", "TypeScript", "AI", "cursor", "figma"], "https://ai.codefather.cn/mcp/2010664904875761678"),
  mcp(216, "AKShare One MCP Server", "研究与数据", "查A股行情、财务数据全都有，量化分析一键对接不折腾。", ["研究与数据", "stock-data", "akshare"], "https://ai.codefather.cn/mcp/2010664904783486984"),
  mcp(217, "Appwrite MCP server", "开发工具", "一句话指令就能操作 Appwrite 数据库和用户，AI 自动化后端管理，省去写胶水代码的麻烦。", ["开发工具", "appwrite", "llm-integration"], "https://ai.codefather.cn/mcp/2117939930272406227"),
  mcp(218, "Shinkai Apps", "研究与数据", "5分钟图形化创建AI Agent，本地远程一键运行，自动注册MCP服务，开箱即用。", ["研究与数据", "AI", "智能体", "AI 智能体", "大语言模型", "llms"], "https://ai.codefather.cn/mcp/2117939930272407384"),
  mcp(219, "MCP Browser Kit", "浏览器自动化", "让AI直接读取并操作你当前浏览的网页，自动填表、抓数据、监控变化，省去复制粘贴和来回切换。", ["浏览器自动化"], "https://ai.codefather.cn/mcp/2117939930272404053"),
  mcp(220, "mcp-k8s", "开发工具", "用自然语言查删改 K8s 资源，运维再也不用记 kubectl 命令和 YAML 语法。", ["开发工具", "Kubernetes", "debug", "mcp-k8s", "服务器"], "https://ai.codefather.cn/mcp/2117939930272408340"),
  mcp(221, "Contrast MCP Server", "研究与数据", "让Java应用漏洞实时出现在IDE或CI里，自动定位问题代码+给修复建议，安全左移真省心。", ["研究与数据"], "https://ai.codefather.cn/mcp/2117939930272406015"),
  mcp(222, "A11y Mcp", "研究与数据", "用AI自动扫描网页无障碍问题，精准定位缺陷并生成合规修复建议。", ["研究与数据", "a11y", "axe-core", "accessibility", "tests"], "https://ai.codefather.cn/mcp/2117939930272407420"),
  mcp(223, "Globalping MCP Server", "研究与数据", "用自然语言就能调全球节点测延迟、丢包和路由，跨国网络问题秒级定位。", ["研究与数据", "remote-mcp-server"], "https://ai.codefather.cn/mcp/2117939930272407071"),
  mcp(224, "YokTez MCP: YÖK Ulusal Tez Merkezi için MCP Sunucusu", "研究与数据", "搜土耳其学位论文超省心，标题作者一输就返回结构化信息+PDF转Markdown。", ["研究与数据", "yoktez", "thesis-database"], "https://ai.codefather.cn/mcp/2117939930272405168"),
  mcp(225, "mcp-email-server", "开发工具", "用MCP协议搭邮件服务器，收发邮件全搞定，部署快还带图形化配置。", ["开发工具"], "https://ai.codefather.cn/mcp/2010664904821235725"),
  mcp(226, "Federal Reserve Economic Data MCP Server", "研究与数据", "直接调用美联储FRED数据库查GDP、失业率等指标，免密钥免格式转换，数据秒级返回。", ["研究与数据", "金融", "数据", "financial-analysis", "data-analysis-project", "大语言模型"], "https://ai.codefather.cn/mcp/2117939930272406107"),
  mcp(227, "MiniMax MCP JS", "研究与数据", "用一句话生成图、视频和克隆声音，多模态AI创作从此像调函数一样简单。", ["研究与数据", "文字转语音", "娱乐与媒体", "minimax", "video-generation"], "https://ai.codefather.cn/mcp/2117939930272407576"),
  mcp(228, "mcp-server-esignatures MCP server", "开发工具", "在线创建电子合同、协作编辑模板、一键发送签署，全流程省心又高效。", ["开发工具"], "https://ai.codefather.cn/mcp/2117939930272406548"),
  mcp(229, "Teamwork", "开发工具", "让大模型直接操作 Teamwork 项目管理，自动同步任务、更新状态、减少跨角色沟通成本。", ["开发工具", "AI", "集成", "artificial-intelligence", "teamwork"], "https://ai.codefather.cn/mcp/2117939930272404685"),
  mcp(230, "MCP Telegram Server", "开发工具", "在聊天中直接搜Telegram历史、发消息、导出数据，不用写胶水代码，运维和分析师都省心。", ["开发工具", "telegram", "cursor", "Claude", "telethon", "cursor-ai"], "https://ai.codefather.cn/mcp/2117939930272405789"),
  mcp(231, "Postgres MCP Pro", "开发工具", "让 AI 安全执行 PostgreSQL 查询，自动拦截高危操作、优化慢 SQL 并实时监控数据库健康。", ["开发工具", "PostgreSQL", "数据库", "SQL", "query-optimization", "ai-integration", "tuning"], "https://ai.codefather.cn/mcp/2117939930272406122"),
  mcp(232, "Himalayas Remote Jobs MCP Server", "研究与数据", "查全球远程职位不用翻墙，一键搜岗位、比公司、筛条件，高薪机会秒速直达。", ["研究与数据", "himalayas", "remote-jobs"], "https://ai.codefather.cn/mcp/2117939930272407580"),
  mcp(233, "Prompt Decorators", "开发工具", "通过此框架，使用可组合的装饰器来增强和标准化大型语言模型（LLMs）的 prompts。", ["开发工具", "AI", "decorators", "specification", "AI 工具", "prompt-engineering"], "https://ai.codefather.cn/mcp/2010664903827185677"),
  mcp(234, "GCP MCP Server", "开发工具", "通过 gcloud CLI 和可观测性 API，将 AI 助手与 Google Cloud 服务连接的官方 MCP 服务端。", ["开发工具", "GCP", "gcloud", "可观测性", "日志", "metrics", "cloud-management"], "https://ai.codefather.cn/mcp/2010664904821235719"),
  mcp(235, "mcp-scholarly MCP server", "研究与数据", "用自然语言搜 arXiv 最新论文，写论文查文献再也不用翻墙、不用记语法、不跳网页。", ["研究与数据"], "https://ai.codefather.cn/mcp/2117939930272404088"),
  mcp(236, "Panther MCP Server", "安全", "用自然语言查日志、管告警、调规则，安全运营从此告别多系统切换和语法折腾。", ["安全", "cybersecurity", "security-operations"], "https://ai.codefather.cn/mcp/2117939930272404107"),
  mcp(237, "Pentest MCP: Professional Penetration Testing Toolkit", "安全", "用自然语言控制渗透测试，一键调用Nmap、Gobuster等工具高效完成安全评估。", ["安全", "cybersecurity", "nmap", "pentesting", "jtr", "john-the-ripper"], "https://ai.codefather.cn/mcp/2010664904833818633"),
  mcp(238, "DNStwist MCP Server", "研究与数据", "一句话安利：输入主域名，秒出仿冒变体清单+注册状态+DNS解析结果，钓鱼域名无所遁形。", ["研究与数据"], "https://ai.codefather.cn/mcp/2117939930272406163"),
  mcp(239, "MongoDB Lens", "分析", "用自然语言直接查 MongoDB，无需写聚合管道，本地运行不联网，开发调试和数据探索都更高效。", ["分析", "AI", "数据库", "MongoDB", "Claude", "大语言模型"], "https://ai.codefather.cn/mcp/2117939930272404979"),
  mcp(240, "Codacy MCP Server", "开发工具", "不用登录多个平台，一键拉取代码质量、覆盖率和安全问题的结构化数据。", ["开发工具"], "https://ai.codefather.cn/mcp/2117939930272405045"),
  mcp(241, "Square Model Context Protocol Server (Beta)", "开发工具", "让 AI 直接调用 Square 支付、客户和库存功能，电商与服务流程自动化从此零代码接入。", ["开发工具"], "https://ai.codefather.cn/mcp/2117939930272407076"),
  mcp(242, "shadcn/ui MCP Server", "开发工具", "让 Claude 等 AI 直接读取 shadcn/ui 各框架组件源码、示例和主题，写 UI 不再靠猜。", ["开发工具"], "https://ai.codefather.cn/mcp/2111533207768842242"),
  mcp(243, "Mcp Knowledge Graph", "研究与数据", "让 Claude 本地记住你的项目细节和偏好，跨会话自动关联上下文，隐私不泄露。", ["研究与数据", "TypeScript", "knowledge-graph", "claude-ai", "ai-memory", "memory-server"], "https://ai.codefather.cn/mcp/2117939930272408398"),
  mcp(244, "YouTube Transcript Server", "研究与数据", "看YouTube视频不用开字幕面板，直接提取多语言文本，学习分析超方便。", ["研究与数据", "youtube", "transcript"], "https://ai.codefather.cn/mcp/2010664904955453442"),
  mcp(245, "MCP Server for Google Tag Manager", "开发工具", "把 GTM 标签执行从浏览器搬到服务器，页面更轻、数据更安全、维护更省心。", ["开发工具", "gtm", "gtm-server-side", "stape"], "https://ai.codefather.cn/mcp/2117939930272407451"),
  mcp(246, "NASA MCP Server", "研究与数据", "查火星照片、看天文日图，AI 聊天式调用 NASA 数据，不用折腾多套 API。", ["研究与数据"], "https://ai.codefather.cn/mcp/2117939930272407986"),
  mcp(247, "MCP Outline Server", "研究与数据", "用自然语言查、写、改 Outline 文档，会议纪要和知识检索再也不用手动翻找。", ["研究与数据"], "https://ai.codefather.cn/mcp/2117939930272407319"),
  mcp(248, "Xiaozhi ESP32 Server Java", "研究与数据", "管设备、调音色、切角色一把搞定，ESP32语音终端管理全给你包了。", ["研究与数据", "Java", "esp32", "服务器", "management", "物联网"], "https://ai.codefather.cn/mcp/2010664903852351504"),
  mcp(249, "Kibana MCP Server", "开发工具", "用自然语言查 Kibana 日志和指标，运维排查、开发分析一说就查，不用再写 DSL 或切页面。", ["开发工具"], "https://ai.codefather.cn/mcp/2117939930272405053"),
  mcp(250, "Dart MCP Server", "研究与数据", "用 Dart 一键启动 MCP 服务器，轻松对接多模型并实现实时双向通信。", ["研究与数据", "dart", "AI", "服务器"], "https://ai.codefather.cn/mcp/2117939930272407660"),
  mcp(251, "Atlassian Data Center MCP", "开发工具", "用AI直接操作Jira、Confluence和Bitbucket，企业级自动化从此更智能。", ["开发工具"], "https://ai.codefather.cn/mcp/2010664904766709771"),
  mcp(252, "ABAP-ADT-API MCP-Server", "开发工具", "让 MCP 客户端直连 ABAP 系统，自动拉代码、提传输、做检查，告别 Eclipse 重复操作。", ["开发工具"], "https://ai.codefather.cn/mcp/2117939930272406109"),
  mcp(253, "Aiven MCP Server", "开发工具", "用自然语言操作Aiven数据库和流服务，查数据调API就像聊天一样简单。", ["开发工具"], "https://ai.codefather.cn/mcp/2010664904938676247"),
  mcp(254, "Gologin MCP Server", "浏览器自动化", "用自然对话管理 GoLogin 浏览器档案、代理、指纹和云会话，省去手动配置麻烦。", ["浏览器自动化"], "https://ai.codefather.cn/mcp/2101386064517263362"),
  mcp(255, "Crypto Price & Market Analysis MCP Server", "研究与数据", "聊天里直接查币价、比交易所、看历史走势，投资决策快人一步不切屏。", ["研究与数据", "nodejs", "real-time", "TypeScript", "加密", "trading"], "https://ai.codefather.cn/mcp/2117939930272405373"),
  mcp(256, "Mealie MCP Server", "开发工具", "让AI直接读取并修改你的Mealie私有食谱，查做法、调用量、生成菜单一气呵成。", ["开发工具", "mealie", "API 集成"], "https://ai.codefather.cn/mcp/2117939930272405911"),
  mcp(257, "🐋 Docker MCP server", "开发工具", "用自然语言查日志、看资源、启停容器，告别 Docker 命令记忆负担。", ["开发工具", "Docker", "natural-language"], "https://ai.codefather.cn/mcp/2117939930272407855"),
  mcp(258, "Attio MCP Server", "开发工具", "用自然语言查改 Attio CRM 数据，客户管理、任务跟进全靠聊天完成。", ["开发工具", "attio", "服务器", "客户关系管理", "AI 助手", "crm-integration"], "https://ai.codefather.cn/mcp/2117939930272405223"),
  mcp(259, "Firefly MCP Server", "开发工具", "用自然语言查多云资源，自动生成 Terraform 等 IaC 代码，告别手动盘点和手写配置。", ["开发工具"], "https://ai.codefather.cn/mcp/2117939930272405107"),
  mcp(260, "超能文献MCP(AI文档翻译+文献检索)", "研究与数据", "读外文论文时一键翻译+保公式结构，还能用大白话搜PubMed文献，科研效率翻倍。", ["研究与数据", "AI文档翻译", "Pubmed搜索"], "https://ai.codefather.cn/mcp/2117939930272404854"),
  mcp(261, "Playwright MCP Server 🎭", "浏览器自动化", "让大模型直接操作真实浏览器，自动填表、截图、执行JS，网页交互从此一句话搞定。", ["浏览器自动化"], "https://ai.codefather.cn/mcp/2117939930272406236"),
  mcp(262, "Alchemy MCP Server", "研究与数据", "不用写代码就能查多链代币/NFT数据，AI直连Alchemy获取实时链上信息超省心。", ["研究与数据"], "https://ai.codefather.cn/mcp/2117939930272406058"),
  mcp(263, "Alibaba Cloud RDS OpenAPI MCP Server", "云平台", "用代码一键创建/监控阿里云RDS实例，告别控制台点点点，运维自动化从此真正落地。", ["云平台", "AI", "rds"], "https://ai.codefather.cn/mcp/2117939930272407825"),
  mcp(264, "Etsy Seo Assistant", "研究与数据", "AI一键生成Etsy高排名标题、描述和标签，上架效率翻倍。", ["研究与数据", "etsyseo", "etsy", "seoagent"], "https://ai.codefather.cn/mcp/2117939930272405077"),
  mcp(265, "MCP Server for Odoo", "开发工具", "让AI通过MCP直接读写Odoo数据，查订单、管库存像聊天一样简单。", ["开发工具", "odoo", "modelcontextprotocol"], "https://ai.codefather.cn/mcp/2010664904947064835"),
  mcp(266, "Yargı MCP: Türk Hukuk Kaynakları için MCP Sunucusu", "研究与数据", "查土耳其法院判例像搜网页一样快，律师研究员都省力。", ["研究与数据", "yargi-mcp", "legal-database"], "https://ai.codefather.cn/mcp/2010664904867373076"),
  mcp(267, "Open Multi-Agent Canvas", "研究与数据", "一屏掌控多个AI代理协作，连MCP服务、自动同步上下文，复杂任务像聊天一样轻松搞定。", ["研究与数据", "Python", "TypeScript", "多智能体", "AI 智能体", "open-canvas", "copilotkit"], "https://ai.codefather.cn/mcp/2117939930272406627"),
  mcp(268, "Octagon Deep Research MCP", "研究与数据", "用自然语言提问，自动完成跨源检索、信息筛选与结构化输出，深度研究从此不卡壳。", ["研究与数据", "octagon", "deep-research", "ai-research"], "https://ai.codefather.cn/mcp/2117939930272407503"),
  mcp(269, "Kafka Schema Registry MCP Server", "研究与数据", "用自然语言注册、查询和同步 Kafka 模式，多环境 Schema 管理一键搞定。", ["研究与数据", "kafka", "schema-registry", "apache-kafka"], "https://ai.codefather.cn/mcp/2117939930272406933"),
  mcp(270, "mcp-v8: V8 JavaScript MCP Server", "开发工具", "用Rust打造安全JS沙盒，AI代理可持久化存储执行状态。", ["开发工具"], "https://ai.codefather.cn/mcp/2010664904825430022"),
  mcp(271, "OPC UA MCP Server", "开发工具", "像聊天一样连工业设备，读变量、调方法、看节点树，全都不用配协议。", ["开发工具", "opcua", "服务器", "自动化"], "https://ai.codefather.cn/mcp/2117939930272404427"),
  mcp(272, "Fabric MCP Server", "研究与数据", "让AI模型通过标准协议接入开发工具，代码重构和创意写作直接在编辑器里搞定。", ["研究与数据", "open-source", "AI"], "https://ai.codefather.cn/mcp/2010664904846401552"),
  mcp(273, "Hive Intelligence MCP Server", "开发工具", "一个提供加密货币和 Web3 分析功能的 Model Context Protocol 服务端，为 AI 助手统一接入 200 多个专用工具。", ["开发工具", "加密", "defi", "web3", "分析", "区块链", "ai-integration"], "https://ai.codefather.cn/mcp/2010664904951259151"),
  mcp(274, "LocalCan", "开发工具", "让 AI 代理实时查看本地 HTTP 流量、生成公网隧道、发布快照并管理访问权限，开箱即用。", ["开发工具"], "https://ai.codefather.cn/mcp/2101386064517263366"),
  mcp(275, "Model Context Protocol (MCP) Schema for Rust", "开发工具", "用 Rust 编译期校验 MCP 协议，字段错、类型错、漏字段全被拦在运行前。", ["开发工具", "Rust", "rust-lang", "crates-io", "model-context-protocol", "mcp-client"], "https://ai.codefather.cn/mcp/2117939930272405548"),
  mcp(276, "JSON Resume MCP Server", "研究与数据", "写代码时自动抓取提交记录，实时生成专业项目经历，简历从此不用手动更新。", ["研究与数据"], "https://ai.codefather.cn/mcp/2117939930272405281"),
  mcp(277, "ONLYOFFICE DocSpace MCP Server", "开发工具", "让大模型直接读写ONLYOFFICE文档，自动同步上下文和权限，编辑协作全程免切换。", ["开发工具"], "https://ai.codefather.cn/mcp/2117939930272404605"),
  mcp(278, "Baseline MCP Server", "开发工具", "查 Web API 浏览器支持状态，开发时兼容性问题一目了然。", ["开发工具", "baseline", "deno", "web-api"], "https://ai.codefather.cn/mcp/2117939930272407172"),
  mcp(279, "codelogic-mcp-server", "开发工具", "改代码前自动分析影响范围，精准识别潜在风险，重构更安心、不踩坑。", ["开发工具", "AI", "coding", "AI 智能体"], "https://ai.codefather.cn/mcp/2117939930272408383"),
  mcp(280, "ScreenshotOne MCP Server", "开发工具", "一键启动本地MCP服务器，安全隔离调用网页截图等远程服务，开发调试省心又可控。", ["开发工具", "screenshots"], "https://ai.codefather.cn/mcp/2117939930272408087"),
  mcp(281, "Zendesk MCP Server", "开发工具", "连上 Claude 就能查 Zendesk 工单、自动生成精准回复，客服响应快人一步。", ["开发工具", "zendesk", "ticket-management"], "https://ai.codefather.cn/mcp/2117939930272405442"),
  mcp(282, "feed-mcp", "研究与数据", "聚合 RSS、Atom、JSON 内容源，一套服务统一管理多平台更新。", ["研究与数据"], "https://ai.codefather.cn/mcp/2010664904879955986"),
  mcp(283, "Awesome-MCP-Server 🚀", "开发工具", "让AI自动查天气、论文、职场信息，不用手抄API、写胶水代码，实时喂数据超省心。", ["开发工具"], "https://ai.codefather.cn/mcp/2117939930272404153"),
  mcp(284, "Howtocook Mcp", "生活管理", "基于Anduin2017 / HowToCook （程序员在家做饭指南）的mcp server，帮你推荐菜谱、规划膳食，解决“今天吃什么“的世纪难题", ["生活管理"], "https://ai.codefather.cn/mcp/2010664905790119944"),
  mcp(285, "MCP Server (Model Context Protocol)", "开发工具", "统一调用 OpenAI、Anthropic、Hugging Face 等各大模型，调试不用来回切换，接口一致还支持热加载。", ["开发工具"], "https://ai.codefather.cn/mcp/2117939930272405876"),
  mcp(286, "DoiT MCP Server", "研究与数据", "用自然语言秒查云成本与异常事件，运维问题定位快人一步，无需切屏写代码。", ["研究与数据"], "https://ai.codefather.cn/mcp/2117939930272404355"),
  mcp(287, "Lighthouse MCP Server", "研究与数据", "让 AI 一键跑 Lighthouse 审计，自动获取性能、可访问性、SEO 等结构化质量报告。", ["研究与数据", "lighthouse", "lighthouse-audits", "lighthouse-score"], "https://ai.codefather.cn/mcp/2117939930272406757"),
  mcp(288, "Bitcoin SV MCP Server", "开发工具", "用自然语言操作BSV钱包和NFT，AI对话中完成区块链交互。", ["开发工具"], "https://ai.codefather.cn/mcp/2010664904863178761"),
  mcp(289, "Starwind UI MCP Server", "开发工具", "让 AI 直接调用 Starwind UI 工具链，查文档、写组件、装依赖，全程本地运行，快又安全。", ["开发工具"], "https://ai.codefather.cn/mcp/2117939930272406158"),
  mcp(290, "PortOne MCP Server", "开发工具", "写代码时自动推送 PortOne 支付接口文档，精准匹配上下文，不用切页查手册。", ["开发工具"], "https://ai.codefather.cn/mcp/2117939930272405867"),
  mcp(291, "Clipkit", "开发工具", "用 JSON 描述视频，实时预览、校验错误，一键 GPU 渲染确定性 MP4，AI 代理视频创作就靠它。", ["开发工具"], "https://ai.codefather.cn/mcp/2101386064513069059"),
  mcp(292, "Deno MCP Template Repo", "开发工具", "用 Deno + TypeScript 一键启动 MCP 服务，内置 KV 存储和 Deno Deploy 支持，专注写逻辑不搞基建。", ["开发工具"], "https://ai.codefather.cn/mcp/2117939930272405123"),
  mcp(293, "CloudSword", "开发工具", "识别云风险，测试安全漏洞，并增强公共云租户的云防护。", ["开发工具", "安全", "public-cloud"], "https://ai.codefather.cn/mcp/2010664904968036370"),
  mcp(294, "MCP Server Semgrep", "开发工具", "用 Claude 对话就能查代码漏洞，Semgrep 后台自动扫描安全风险与技术债务。", ["开发工具", "semgrep", "anthropic-claude", "modelcontextprotocol"], "https://ai.codefather.cn/mcp/2117939930272406252"),
  mcp(295, "PubNub Model Context Protocol (MCP) Server for Cursor IDE", "开发工具", "在 Cursor IDE 里直接调用 PubNub 实时 API，发消息、查历史、看文档一气呵成，写聊天和协同功能快得飞起。", ["开发工具", "windsurf", "openai-codex", "大语言模型", "curosr"], "https://ai.codefather.cn/mcp/2117939930272406472"),
  mcp(296, "Wazuh MCP Server", "研究与数据", "让大模型实时读懂 Wazuh 告警，自动提取关键威胁信息，告别手动查日志和写解析脚本。", ["研究与数据", "Python", "AI", "wazuh", "Claude", "claude-ai", "siem", "security-operations", "大语言模型", "wazuh-integration"], "https://ai.codefather.cn/mcp/2117939930272406469"),
  mcp(297, "n8n Workflow Builder MCP Server", "开发工具", "用代码批量管理n8n工作流，自动化流程配置像写脚本一样顺手。", ["开发工具"], "https://ai.codefather.cn/mcp/2010664904934481938"),
  mcp(298, "💾 Synology MCP Server", "云平台", "用自然语言远程操控群晖NAS，查文件、管下载、移目录，全程像聊天一样轻松搞定。", ["云平台", "synology"], "https://ai.codefather.cn/mcp/2117939930272405761"),
  mcp(299, "Discogs MCP Server", "开发工具", "直接连 Discogs 查专辑、管收藏，开发调试一键搞定，省去 API 对接和数据清洗的麻烦。", ["开发工具"], "https://ai.codefather.cn/mcp/2117939930272406706"),
  mcp(300, "@civic/mcp-tools", "开发工具", "调试MCP服务像搭乐高，请求拦截、数据抓取一步到位。", ["开发工具"], "https://ai.codefather.cn/mcp/2010664904854790158"),
  mcp(301, "Gofannon", "自主智能体", "让 AI 代理轻松复用标准化工具，跨框架一键集成搜索、API、文件解析等能力。", ["自主智能体", "AI", "Python", "智能体", "open-source", "bedrock", "langchain", "langflow"], "https://ai.codefather.cn/mcp/2117939930272407487"),
  mcp(302, "EdgeOne Pages MCP", "云平台", "写完 HTML 一键部署，秒得公网链接，分享页面像发文件一样简单。", ["云平台"], "https://ai.codefather.cn/mcp/2117939930272408150"),
  mcp(303, "Markdown2PDF MCP Server (markdown2pdf-mcp)", "开发工具", "写 Markdown顺便导出精美 PDF，代码高亮和水印全都能自定义。", ["开发工具", "markdown2pdf", "pdf-converter", "markdown-to-pdf"], "https://ai.codefather.cn/mcp/2010664904955453459"),
  mcp(304, "Google News MCP Server", "研究与数据", "直接查全球多语种新闻并自动分类，省去爬虫和翻译，趋势分析快人一步。", ["研究与数据", "nodejs", "TypeScript", "AI", "news-search", "Claude"], "https://ai.codefather.cn/mcp/2117939930272405799"),
  mcp(305, "Django MCP Server", "开发工具", "让AI代理直接调用Django模型，查数据改数据库就像聊天一样自然。", ["开发工具", "django", "AI", "智能体 AI", "modelcontextprotocol"], "https://ai.codefather.cn/mcp/2010664903843962882"),
  mcp(306, "Mailjet Mcp Server", "开发工具", "用自然语言就能发邮件、管联系人、查打开率，AI 直连 Mailjet 做营销自动化。", ["开发工具", "mailjet", "API 集成"], "https://ai.codefather.cn/mcp/2117939930272407117"),
  mcp(307, "Model Context Protocol (MCP) Server for Graphlit Platform", "研究与数据", "连通邮件、文档、聊天记录，一键转成结构化数据喂给AI。", ["研究与数据", "web-crawler", "网页抓取", "data-collection", "content-extraction", "search-api", "Claude"], "https://ai.codefather.cn/mcp/2010664904905121805"),
  mcp(308, "GeoServer MCP Server", "研究与数据", "让AI直接调用GeoServer查地图、改样式，做空间分析就像聊天一样自然。", ["研究与数据"], "https://ai.codefather.cn/mcp/2010664904955453445"),
  mcp(309, "AI Tools for Developers", "开发工具", "用 Markdown 写 AI 工作流，Docker 一键运行，换环境不改代码，本地模型也能无缝接入。", ["开发工具"], "https://ai.codefather.cn/mcp/2117939930272404080"),
  mcp(310, "metoro-mcp-server", "研究与数据", "让AI像聊天一样实时查K8s状态、看Pod健康、揪出异常服务，运维排查不用切屏敲kubectl。", ["研究与数据", "metoro", "Kubernetes", "可观测性"], "https://ai.codefather.cn/mcp/2117939930272408287"),
  mcp(311, "PHP MCP Server for Laravel", "开发工具", "用 PHP 属性一键暴露 Laravel 方法为 MCP 工具，AI 调用订单查询、内容生成等能力零胶水代码。", ["开发工具"], "https://ai.codefather.cn/mcp/2117939930272406978"),
  mcp(312, "ScrAPI MCP Server", "研究与数据", "抓动态网页不怕封，价格监控、舆情分析数据一键提取超省心。https://github.com/DevEnterpriseSoftware/scrapi-mcp", ["研究与数据", "AI", "webscraper", "网页抓取", "scraper-api"], "https://ai.codefather.cn/mcp/2010664904875761669"),
  mcp(313, "Raindrop.io MCP Server", "开发工具", "让 AI 自动帮你收藏、分类、搜索 Raindrop 书签，整理网页信息再也不用手动操作。", ["开发工具", "raindrop", "raindrop-api", "raindrop-io", "mcp-tools", "modelcontextprotocol"], "https://ai.codefather.cn/mcp/2117939930272406935"),
  mcp(314, "mcp-server-webcrawl", "研究与数据", "让AI直接搜索过滤本地爬虫数据，全文检索+按类型状态码筛选，快准稳。", ["研究与数据", "wget", "knowledgebase", "warc", "大语言模型", "mcp-servers", "web-crawl", "AI-integration"], "https://ai.codefather.cn/mcp/2117939930272405521"),
  mcp(315, "Sequential Thinking Multi-Agent System (MAS)", "研究与数据", "让AI团队自动拆解复杂问题，分步推理、交叉验证、全程可追溯，告别模糊回答。", ["研究与数据", "agno", "sequential-thinking"], "https://ai.codefather.cn/mcp/2117939930272404745"),
  mcp(316, "Mcp Framework", "开发工具", "用 TypeScript 快速搭建 LLM 工具服务，自动加载、类型校验、开箱即用。", ["开发工具", "AI", "Claude", "大语言模型", "llms", "anthropic", "genai"], "https://ai.codefather.cn/mcp/2117939930272407853"),
  mcp(317, "MCP ECharts", "研究与数据", "用自然语言一句话生成 ECharts 图表，本地运行不传数据，安全高效零依赖。", ["研究与数据", "mcp-echarts", "chart-generation", "数据分析"], "https://ai.codefather.cn/mcp/2117939930272407266"),
  mcp(318, "Airtable MCP", "开发工具", "用自然语言直接读写 Airtable 数据，省去手动操作，效率翻倍。", ["开发工具", "Workplace", "Productivity", "数据库"], "https://ai.codefather.cn/mcp/2010664904963842063"),
  mcp(319, "Logseq MCP Server", "开发工具", "让大模型直接读写 Logseq 笔记，自动整理知识、生成会议纪要、转待办，全程不用复制粘贴。", ["开发工具"], "https://ai.codefather.cn/mcp/2117939930272405690"),
  mcp(320, "MCP Claude Spotify", "研究与数据", "用语音一句话控制 Spotify 播放、搜歌和管理歌单，专注工作时再也不用切屏动手。", ["研究与数据", "spotify", "AI", "spotify-api", "Claude", "claude-ai"], "https://ai.codefather.cn/mcp/2117939930272405705"),
  mcp(321, "olostep-mcp", "开发工具", "搜网页、抓内容、转Markdown一气呵成，绕过反爬还能直接喂给AI用。", ["开发工具", "网页抓取", "content-extraction", "AI-assistants"], "https://ai.codefather.cn/mcp/2117939930272404558"),
  mcp(322, "SQL Server MCP Client", "开发工具", "连上 SQL Server 就能查数据、看表结构，免配置免驱动，开发调试数据库快人一步。", ["开发工具"], "https://ai.codefather.cn/mcp/2117939930272407010"),
  mcp(323, "mcp-tts", "研究与数据", "一行命令调用多引擎语音合成，开发集成超简单，编辑器里写完就能直接听效果。", ["研究与数据", "Go", "文字转语音", "tts", "say", "google-tts"], "https://ai.codefather.cn/mcp/2117939930272407293"),
  mcp(324, "Kubernetes MCP Server", "开发工具", "让 AI 助手直接读取、诊断和操作 K8s 集群资源，告别手动敲命令和解析混乱日志。", ["开发工具", "Kubernetes", "容器", "编排", "DevOps", "云平台", "openshift", "model", "protocol", "model-context-protocol"], "https://ai.codefather.cn/mcp/2117939930272407936"),
  mcp(325, "LaunchDarkly's Model Context Protocol (MCP) Server", "研究与数据", "用对话就能实时开关AI功能、做A/B测试，产品运营也能自主调控，无需等开发发版。", ["研究与数据", "managed-by-terraform", "launchdarkly-integration", "launchdarkly-ai"], "https://ai.codefather.cn/mcp/2117939930272407600"),
  mcp(326, "🪄 ImageSorcery MCP", "开发工具", "让AI像聊天一样裁图、识字、检物体，图像处理从此告别写代码和调接口。", ["开发工具"], "https://ai.codefather.cn/mcp/2117939930272404607"),
  mcp(327, "Data Gov IL", "开发工具", "为 AI 助手提供无缝访问以色列政府开放数据的能力，用于搜索、发现和分析。", ["开发工具", "AI", "research", "分析", "工具", "opendata", "government", "israel"], "https://ai.codefather.cn/mcp/2010664904833818650"),
  mcp(328, "Liveblocks Mcp Server", "开发工具", "让 AI 实时创建、修改房间和评论，协作应用开发直接接入 Liveblocks 功能。", ["开发工具", "real-time", "AI", "toolkit", "websockets", "协作"], "https://ai.codefather.cn/mcp/2010664904888344580"),
  mcp(329, "Codehooks.io MCP Server (under construction 🚧)", "开发工具", "用AI直接操作Codehooks项目，部署查日志全在聊天中搞定。", ["开发工具"], "https://ai.codefather.cn/mcp/2010664904959647750"),
  mcp(330, "OpenAPI to Model Context Protocol (MCP)", "研究与数据", "把 OpenAPI 文档一键转成 AI 可调用的 MCP 工具，省去手动封装 API 的所有麻烦。", ["研究与数据", "Python", "AI", "openapi", "Gemini", "OpenAI"], "https://ai.codefather.cn/mcp/2117939930272407008"),
  mcp(331, "Rust Docs MCP Server", "开发工具", "查 Rust crate 文档不用切屏，AI 写代码时自动对接 docs.rs 最新 API。", ["开发工具", "Rust", "caching", "information-retrieval", "AI", "embeddings"], "https://ai.codefather.cn/mcp/2117939930272407747"),
  mcp(332, "Semrush MCP Server", "研究与数据", "连上 Semrush 数据库，查关键词、外链、竞品动态，SEO 分析一键搞定不折腾。", ["研究与数据", "semrush", "api-tools"], "https://ai.codefather.cn/mcp/2117939930272405550"),
  mcp(333, "GhidraMCP", "研究与数据", "用自然语言提问就能分析二进制，Ghidra 逆向从此像聊天一样轻松高效。", ["研究与数据", "ghidramcp", "binary-analysis", "AI 助手"], "https://ai.codefather.cn/mcp/2117939930272406607"),
  mcp(334, "Damn Vulnerable Model Context Protocol (DVMCP)", "研究与数据", "专为学 MCP 安全设计的靶场，10 个预设漏洞手把手练渗透，Docker 一键开打。", ["研究与数据"], "https://ai.codefather.cn/mcp/2117939930272404343"),
  mcp(335, "Distri: A Composable Agent Framework", "开发工具", "用 YAML 或 Rust 快速定义多智能体行为，MCP 协议让 AI 间协作像搭积木一样即插即用。", ["开发工具", "OpenAI", "anthropic", "智能体化", "deepseek"], "https://ai.codefather.cn/mcp/2117939930272407079"),
  mcp(336, "Unsplash MCP Server", "研究与数据", "搜图嵌图一气呵成，开发写文时秒插高质量无版权图片。", ["研究与数据", "python3", "unsplash-mcp", "mcp-go", "unsplash", "image-search", "photo-search"], "https://ai.codefather.cn/mcp/2010664904791875592"),
  mcp(337, "Foundry MCP Server", "开发工具", "用 Foundry 一键编译、部署、调试 Solidity 合约，连 Anvil 或远程节点都自动搞定，开发快人一步。", ["开发工具", "区块链", "evm", "加密", "foundry", "model-context-protocol"], "https://ai.codefather.cn/mcp/2117939930272404068"),
  mcp(338, "Mqtt Mcp", "开发工具", "让 AI 像聊天一样读取传感器、控制 MQTT 设备，楼宇家居自动化从此免写胶水代码。", ["开发工具", "mqtt"], "https://ai.codefather.cn/mcp/2117939930272405551"),
  mcp(339, "Jina AI MCP Tools", "研究与数据", "用AI一键提取网页内容、搜资料、查事实，研究写稿效率翻倍。", ["研究与数据"], "https://ai.codefather.cn/mcp/2010664904850595842"),
  mcp(340, "Perfetto", "研究与数据", "用自然语言查 Android 性能瓶颈，ANR 和卡顿一键诊断，不用写 SQL 也能精准定位问题。", ["研究与数据", "perfetto", "android performance", "perfetto analysis", "anr detection", "jank frame detection", "memory profiler"], "https://ai.codefather.cn/mcp/2117939930272405106"),
  mcp(341, "XiYan MCP Server", "开发工具", "不用写SQL，直接用中文问MySQL要数据，运营、产品、AI开发者都能秒查结果。", ["开发工具", "数据库", "text-to-sql", "mathgpt", "math-solver", "math-assistant"], "https://ai.codefather.cn/mcp/2117939930272407933"),
  mcp(342, "Semantic Scholar MCP Server", "研究与数据", "查论文、挖引用、看学者档案，一个API全搞定。", ["研究与数据", "智能体", "semantic-scholar", "大语言模型", "fastmcp", "academic-research"], "https://ai.codefather.cn/mcp/2010664903848157201"),
  mcp(343, "OpenCage Geocoding MCP Server", "生活管理", "查地址秒得坐标，输坐标反查地点，全球地理编码从此像聊天一样自然。", ["生活管理", "geocoding", "API"], "https://ai.codefather.cn/mcp/2117939930272408057"),
  mcp(344, "Pinot MCP Server", "研究与数据", "连上 Pinot 集群，实时查数据、看元数据，还能和 Claude 搭档分析，效率翻倍。", ["研究与数据", "mcp-pinot", "apache-pinot", "数据分析"], "https://ai.codefather.cn/mcp/2010664904959647748"),
  mcp(345, "Currents MCP Server", "研究与数据", "查新闻不用切页面，代码里直连实时资讯流，做分析、写应用都省事。", ["研究与数据", "AI", "currents", "playwright"], "https://ai.codefather.cn/mcp/2117939930272407726"),
  mcp(346, "Google Tasks MCP Server", "开发工具", "用Claude语音操控Google任务，清单管理像聊天一样自然流畅。", ["开发工具", "todo", "modelcontextprotocol"], "https://ai.codefather.cn/mcp/2010664903839768586"),
  mcp(347, "BloodHound Model Context Protocol Server", "研究与数据", "用自然语言查Bloodhound网络安全数据，域内资产关系一问便知。", ["研究与数据"], "https://ai.codefather.cn/mcp/2010664904833818634"),
  mcp(348, "MCP-DBLP", "研究与数据", "用自然语言查 DBLP 论文、一键导出标准 BibTeX，写学术论文再也不用反复切页复制。", ["研究与数据"], "https://ai.codefather.cn/mcp/2117939930272406147"),
  mcp(349, "Ethereum RPC MPC Server", "研究与数据", "让 AI 直接查以太坊区块、交易和合约余额，钱包分析与交易验证一键搞定。", ["研究与数据", "AI", "ethereum", "json-rpc", "cursor", "evm"], "https://ai.codefather.cn/mcp/2117939930272405409"),
  mcp(350, "Serper Search MCP Server", "开发工具", "用自然语言一键调用 Google 搜索，结构化结果直供应用，开发调试全省心。", ["开发工具"], "https://ai.codefather.cn/mcp/2117939930272407127"),
  mcp(351, "swagger-mcp", "开发工具", "根据 Swagger 自动生成功能完备的 MCP 工具，AI 调用你的 API 再也不用手写适配代码。", ["开发工具", "swagger-mcp", "api-tools", "dynamic-tools"], "https://ai.codefather.cn/mcp/2117939930272406664"),
  mcp(352, "MCP Jenkins", "开发工具", "终端直查直改 Jenkins 任务，不用切网页、不写脚本，运维效率翻倍。", ["开发工具"], "https://ai.codefather.cn/mcp/2117939930272404660"),
  mcp(353, "Shipyard MCP", "开发工具", "用 CLI 一键拉起/销毁临时环境，实时聚合日志、自动联动 AI 排查问题。", ["开发工具", "e2e", "测试", "environments"], "https://ai.codefather.cn/mcp/2117939930272406306"),
  mcp(354, "Google Jobs MCP Server", "研究与数据", "用自然语言查全球职位，多语言支持、自动筛选排序，求职开发都省心。", ["研究与数据", "nodejs", "TypeScript", "job-search", "google-jobs", "serpapi"], "https://ai.codefather.cn/mcp/2117939930272404599"),
  mcp(355, "Bankless Onchain MCP Server", "研究与数据", "不用连节点，AI 也能一键查多链合约、交易和事件，跨链数据秒级结构化返回。", ["研究与数据"], "https://ai.codefather.cn/mcp/2117939930272407015"),
  mcp(356, "Replicate Flux MCP", "开发工具", "在编辑器里直接生成高清图和可编辑SVG，设计开发无缝协作，隐私安全全本地处理。", ["开发工具", "svg-generator", "ai-image-generation", "svg-mcp", "image-mcp", "replicate-mcp"], "https://ai.codefather.cn/mcp/2117939930272404057"),
  mcp(357, "Nodit MCP Server", "研究与数据", "让AI代理一句话查多链数据，不用懂区块链也能实时获取钱包余额、交易和NFT事件。", ["研究与数据", "AI", "区块链", "web3", "blockchain-data", "onchain"], "https://ai.codefather.cn/mcp/2117939930272407612"),
  mcp(358, "CHM to Markdown Converter", "开发工具", "轻松把老旧CHM文档转成带代码高亮的Markdown，迁移维护超方便。", ["开发工具", "Markdown", "notebook", "document", "chm", "revit"], "https://ai.codefather.cn/mcp/2010664904905121804"),
  mcp(359, "GenieACS-MCP", "开发工具", "让大模型一句话查光猫状态、远程重启或升级固件，彻底告别手动调 API。", ["开发工具", "Go", "genieacs"], "https://ai.codefather.cn/mcp/2117939930272405290"),
  mcp(360, "Metasploit MCP Server", "研究与数据", "用自然语言指挥Metasploit自动执行漏洞利用、会话管理与后渗透操作，告别繁琐命令和参数配置。", ["研究与数据"], "https://ai.codefather.cn/mcp/2117939930272406267"),
  mcp(361, "Caiyun Weather MCP Server", "研究与数据", "一行代码接入彩云高精度天气，实时预报+历史数据+自动预警全搞定。", ["研究与数据", "caiyun", "weather", "API", "彩云", "彩云天气", "天气预报"], "https://ai.codefather.cn/mcp/2117939930272405965"),
  mcp(362, "Lenses MCP for Apache Kafka", "开发工具", "一键管理多集群 Kafka 数据，实时查询转换不切屏、不写代码。", ["开发工具", "kafka", "apache-kafka", "streams", "streaming-data", "stream-processing", "real-time-data"], "https://ai.codefather.cn/mcp/2117939930272407569"),
  mcp(363, "MCP Helm Server", "开发工具", "远程查Helm图表和配置，运维自动化再也不用本地装Helm了。", ["开发工具", "Kubernetes", "helm"], "https://ai.codefather.cn/mcp/2010664904913510414"),
  mcp(364, "Zenfeed", "自主智能体", "用 AI 自动过滤、摘要和推送 RSS 内容，告别信息过载，专注真正重要的更新。", ["自主智能体", "AI", "rss", "监控", "邮件", "rss-reader"], "https://ai.codefather.cn/mcp/2117939930272407972"),
  mcp(365, "Unreal Engine Generative AI Support Plugin", "开发工具", "在 Unreal Engine 里用自然语言生成蓝图和场景，AI 直接驱动开发，不用切窗口、不写解析逻辑。", ["开发工具", "lightweight", "meta", "游戏开发", "Gemini", "OpenAI"], "https://ai.codefather.cn/mcp/2117939930272408119"),
  mcp(366, "meGPT", "研究与数据", "把博客、播客、视频自动转成你的专属知识库，聊天提问、写摘要都精准贴合你原意。", ["研究与数据", "meGPT", "content-processing", "大语言模型"], "https://ai.codefather.cn/mcp/2117939930272405068"),
  mcp(367, "Motion MCP Server", "开发工具", "让 AI 一句话创建任务、分配成员、设截止日，Motion MCP Server 把项目管理全自动化。", ["开发工具", "motionmcp", "任务管理", "llm-integration"], "https://ai.codefather.cn/mcp/2117939930272404813"),
  mcp(368, "Lightweight Java MCP SDK: AJ-MCP", "开发工具", "让 Java 项目秒接 MCP 服务，不用手写 HTTP 客户端，几行代码搞定 AI 上下文调用。", ["开发工具", "java8", "mcp-client", "mcp-sdk", "java-mcp"], "https://ai.codefather.cn/mcp/2117939930272408452"),
  mcp(369, "BinjaLattice", "开发工具", "在 Binary Ninja 里直接调用远程 LLM 分析函数，自动同步注释与命名，逆向协作一气呵成。", ["开发工具"], "https://ai.codefather.cn/mcp/2117939930272404232"),
  mcp(370, "Candidate MCP Server Library", "开发工具", "让AI直接安全调用候选人简历数据，招聘决策效率翻倍。", ["开发工具", "TypeScript", "AI"], "https://ai.codefather.cn/mcp/2010664904791875598"),
  mcp(371, "Podman MCP Server", "开发工具", "让 AI 直接查容器状态、启停服务、读日志，Podman 和 Docker 都能无缝管理，本地开发调试省心又安全。", ["开发工具", "Docker", "容器", "model", "protocol", "context"], "https://ai.codefather.cn/mcp/2117939930272404374"),
  mcp(372, "MockLoop MCP", "研究与数据", "用 OpenAPI 一键生成 Mock 接口和智能测试用例，联调不用等后端，测试覆盖更全更省心。", ["研究与数据", "training", "mock", "API", "AI", "models"], "https://ai.codefather.cn/mcp/2117939930272407627"),
  mcp(373, "GitHub Stars MCP Server", "开发工具", "用自然语言秒搜 GitHub 星标仓库，再也不用翻列表、猜名字、点开 README 确认。", ["开发工具", "github-stars", "cloudflare", "autorag", "cloudflare-agents"], "https://ai.codefather.cn/mcp/2117939930272407604"),
  mcp(374, "Stocky", "研究与数据", "搜图不用来回切换，Pexels 和 Unsplash 高清图+授权信息一键批量获取。", ["研究与数据", "photos", "stock", "royalty-free", "娱乐与媒体"], "https://ai.codefather.cn/mcp/2117939930272405748"),
  mcp(375, "ESP32 MCP Server", "开发工具", "让 AI 通过 WebSocket 直连 ESP32，无需写网络代码就能远程监控和控制物联网设备。", ["开发工具", "esp32", "WebSocket", "ai-integration"], "https://ai.codefather.cn/mcp/2117939930272406654"),
  mcp(376, "OpenAPI Schema Explorer", "开发工具", "通过 MCP 资源为客户端探索提供对 OpenAPI/Swagger 规范的高效令牌访问。", ["开发工具", "API", "openapi", "api-explorer", "swagger"], "https://ai.codefather.cn/mcp/2010664904854790148"),
  mcp(377, "FluidMCP CLI", "开发工具", "一条命令自动拉起MCP服务，省去依赖配置、端口冲突和认证开发的麻烦。", ["开发工具", "fluidmcp", "cli-tool"], "https://ai.codefather.cn/mcp/2117939930272407051"),
  mcp(378, "Xcode MCP Server", "开发工具", "让 Claude 直接读写 Xcode 项目，Swift/OC 开发像聊天一样自然流畅。", ["开发工具", "xcode", "build-automation"], "https://ai.codefather.cn/mcp/2117939930272405185"),
  mcp(379, "greptimedb-mcp-server", "开发工具", "用自然语言查 GreptimeDB 时序数据，AI 自动生成安全 SQL，不暴露库凭证也不手动写语句。", ["开发工具", "greptimedb", "database-access"], "https://ai.codefather.cn/mcp/2117939930272407434"),
  mcp(380, "GitHub Repo MCP", "研究与数据", "让 AI 直接读取 GitHub 仓库代码，查文件、看目录结构，告别手动复制粘贴和上下文丢失。", ["研究与数据", "GitHub", "github-mcp", "github-mcp-server", "mcp-github"], "https://ai.codefather.cn/mcp/2117939930272404464"),
  mcp(381, "Whistle MCP Server", "开发工具", "用自然语言改代理规则、拦请求、重放调试，Whistle 调试从此告别手动配置和切屏。", ["开发工具", "AI", "网络", "proxy", "whistle", "whistle-plugin"], "https://ai.codefather.cn/mcp/2117939930272408103"),
  mcp(382, "MCPShell", "开发工具", "用自然语言触发预设命令，安全执行系统操作，再也不用切终端查文档敲参数。", ["开发工具", "AI", "analysis-tool", "shell", "CLI"], "https://ai.codefather.cn/mcp/2117939930272408088"),
  mcp(383, "Vikunja MCP Server", "研究与数据", "用自然语言语音操控 Vikunja，增删改查任务、指派成员、打标签，团队协作一键同步。", ["研究与数据", "效率工具", "TypeScript", "任务管理", "AI 工具", "vikunja"], "https://ai.codefather.cn/mcp/2117939930272405883"),
  mcp(384, "mcp-svelte-docs", "开发工具", "查 Svelte 文档不用切网页，缓存加速+智能过滤，问 API 像问同事一样快。", ["开发工具", "搜索", "知识与内容管理", "svelte", "大语言模型"], "https://ai.codefather.cn/mcp/2117939930272405186"),
  mcp(385, "apktool-mcp-server (Part of Zin's Reverse Engineering MCP Suite)", "开发工具", "反编译 APK 时自动调用本地 AI 分析 smali 代码，实时指出漏洞、数据外传等风险点，逆向效率翻倍。", ["开发工具", "Android", "移动端", "AI", "reverse-engineering", "apktool"], "https://ai.codefather.cn/mcp/2117939930272408104"),
  mcp(386, "Google Calendar MCP Server (Python)", "云平台", "用自然语言查空闲、约会议、删日程，Google 日历操作从此动动嘴就行。", ["云平台"], "https://ai.codefather.cn/mcp/2117939930272407258"),
  mcp(387, "Mcp Log Proxy", "开发工具", "像翻微信聊天一样看MCP通信全链路，调试接口问题快准狠，零配置开箱即用。", ["开发工具", "Go", "debug", "mcp-tools"], "https://ai.codefather.cn/mcp/2117939930272408141"),
  mcp(388, "📸 Smart Photo Journal MCP Server", "研究与数据", "在 Mac 上本地搜索 iCloud 照片，用自然语言查地点、人物和场景，隐私安全还能自动聚类。", ["研究与数据", "smart-photo-album", "claude-desktop"], "https://ai.codefather.cn/mcp/2117939930272407322"),
  mcp(389, "MCP TTS VOICEVOX", "研究与数据", "本地跑日语TTS，调参数、批量生成、一键播放全搞定，完全离线不求人。", ["研究与数据"], "https://ai.codefather.cn/mcp/2117939930272404330"),
  mcp(390, "🪐 ✨ Earthdata MCP Server", "研究与数据", "像聊天一样查NASA地球数据，科研人员秒获精准时空遥感资源。", ["研究与数据", "AI", "nasa", "earth", "spatial", "nasa-api", "earthdata", "geospatial-analysis"], "https://ai.codefather.cn/mcp/2117939930272404672"),
  mcp(391, "Home Assistant Model Context Protocol (MCP)", "开发工具", "让自研设备一键接入 Home Assistant，实时控制+语音自动化，轻量安全零配置。", ["开发工具", "speech-recognition", "home-assistant", "语音转文字", "大语言模型"], "https://ai.codefather.cn/mcp/2117939930272406403"),
  mcp(392, "InfluxDB MCP Server", "开发工具", "用自然语言查写 InfluxDB 时序数据，告别手动拼接 Flux 和 Line Protocol，运维开发效率直接拉满。", ["开发工具"], "https://ai.codefather.cn/mcp/2117939930272405396"),
  mcp(393, "Coupler.io official MCP server", "开发工具", "用Docker跑Coupler.io的MCP服务，轻松抽数据、查schema，分析流转结果超方便。", ["开发工具", "coupler-io", "data-integration"], "https://ai.codefather.cn/mcp/2010664904942870532"),
  mcp(394, "Jira MCP", "开发工具", "用自然语言查Jira任务、自动更新状态和规划冲刺，告别手动切换与复杂JQL。", ["开发工具", "Jira", "AI", "jira-mcp", "golang-mcp"], "https://ai.codefather.cn/mcp/2117939930272404736"),
  mcp(395, "Apple Books MCP", "研究与数据", "用 Claude 直接管理 Apple Books 笔记，自动总结高亮、按色分类、推荐好书，让划线真正变成知识资产。", ["研究与数据", "效率工具", "apple", "AI", "apple-books", "大语言模型"], "https://ai.codefather.cn/mcp/2117939930272405247"),
  mcp(396, "AgentRPC", "自主智能体", "让 AI 代理像调本地函数一样直连跨语言、跨网络的服务，无需配 API 或开防火墙。", ["自主智能体", "AI", "集成", "agentrpc", "rpc-layer", "AI 智能体"], "https://ai.codefather.cn/mcp/2117939930272404542"),
  mcp(397, "🧠 Archive Agent", "研究与数据", "用自然语言秒搜PDF、图片等本地文件，语义理解精准定位内容，隐私安全全在本地。", ["研究与数据", "Python", "ocr", "OpenAI", "rag", "ollama", "lm-studio"], "https://ai.codefather.cn/mcp/2117939930272406048"),
  mcp(398, "AnalyticDB for MySQL MCP Server", "云平台", "让AI直接查AnalyticDB MySQL数据，写SQL、看执行计划、定位慢查询一气呵成。", ["云平台", "alibabacloud", "adb", "MySQL", "服务器", "mathgpt", "math-solver", "math-assistant"], "https://ai.codefather.cn/mcp/2117939930272404142"),
  mcp(399, "Bitbucket MCP Server", "开发工具", "用自然语言操作 Bitbucket PR 和分支，自动合并、评论、清理，告别 API 脚本和手动点点点。", ["开发工具", "bitbucket", "API", "集成"], "https://ai.codefather.cn/mcp/2117939930272405163"),
  mcp(400, "MCP Server", "研究与数据", "几行代码接入，自动压缩大图、并行处理批量任务，再也不用为图片来源和大小操心。", ["研究与数据", "娱乐与媒体", "image-manipulation"], "https://ai.codefather.cn/mcp/2117939930272405504"),
  mcp(401, "MCP libSQL by xexr", "开发工具", "连上 libSQL 数据库，安全执行查询和事务，Claude 里直接搞数据管理超省心。", ["开发工具", "SQL", "数据库", "SQLite", "sqlite3", "Claude"], "https://ai.codefather.cn/mcp/2010664903827185678"),
  mcp(402, "codemirror-mcp", "开发工具", "在 CodeMirror 里输入 @resource 或 /prompt，自动补全+高亮资源与命令，编码不打断、不查文档。", ["开发工具"], "https://ai.codefather.cn/mcp/2117939930272404895"),
  mcp(403, "Atlassian Bitbucket MCP Server", "开发工具", "让AI直接操作Bitbucket代码库，审代码、管项目像聊天一样自然。", ["开发工具", "命令行工具", "TypeScript", "工具", "AI", "服务器", "repository", "bitbucket", "AI 助手"], "https://ai.codefather.cn/mcp/2010664904972230672"),
  mcp(404, "MCP Bridge", "研究与数据", "让云端AI安全调用你本机的MCP服务，数据不出内网，无需公网IP和复杂配置。", ["研究与数据", "cloud-integration", "stdio"], "https://ai.codefather.cn/mcp/2117939930272407639"),
  mcp(405, "MCP PostgreSQL Server", "数据库", "让 AI 安全查 PostgreSQL 数据，防注入、自动管连接，写 SQL 和读数据都省心又可靠。", ["数据库"], "https://ai.codefather.cn/mcp/2117939930272407847"),
  mcp(406, "🚀 OneSearch MCP Server: Web Search & Crawl & Scraper & Extract", "研究与数据", "用一个工具串起全网搜索与内容提取，自建私有爬虫系统就这么简单。", ["研究与数据", "modelcontextprotocol", "searxng-mcp", "tavily-mcp", "duckduckgo-mcp", "bing-mcp"], "https://ai.codefather.cn/mcp/2010664903848157210"),
  mcp(407, "Futu Stock MCP Server", "研究与数据", "一键接入富途港股美股实时行情，AI工具直接收K线和盘口数据，省去连接维护和格式转换。", ["研究与数据"], "https://ai.codefather.cn/mcp/2117939930272404564"),
  mcp(408, "ReportPortal MCP Server", "开发工具", "在 IDE 里直接查 ReportPortal 测试报告，不用切网页，调试回归问题快人一步。", ["开发工具"], "https://ai.codefather.cn/mcp/2117939930272404379"),
  mcp(409, "SchemaPin 🧷", "安全", "用加密签名防篡改，确保AI工具接口可信，发布和调用都安心。", ["安全", "智能体", "verify", "加密", "工具", "AI"], "https://ai.codefather.cn/mcp/2010664904926093333"),
  mcp(410, "YOKATLAS API MCP Sunucusu", "研究与数据", "查土耳其高校专业超简单，一句话精准匹配副学士/学士项目，免爬虫免鉴权。", ["研究与数据"], "https://ai.codefather.cn/mcp/2117939930272408384"),
  mcp(411, "Jolokia MCP Server", "研究与数据", "让大模型用 HTTP 轻松调用 JMX，远程监控和管理 Java 应用无需 JDK 工具。", ["研究与数据", "Java", "AI", "jmx", "jolokia"], "https://ai.codefather.cn/mcp/2117939930272405556"),
  mcp(412, "UniFuncs MCP Server", "研究与数据", "用 NPX 快速接入 UniFuncs API，一行命令搞定多功能集成。", ["研究与数据"], "https://ai.codefather.cn/mcp/2010664904972230665"),
  mcp(413, "Binance MCP Server 🚀", "研究与数据", "让 AI 直接查行情、下单撤单、盯盘成交，币安自动化交易从此简单又安全。", ["研究与数据", "智能体", "金融", "trading", "加密货币", "quantitative-finance", "binance"], "https://ai.codefather.cn/mcp/2117939930272404670"),
  mcp(414, "Tektoncd Model Context Protocol server", "开发工具", "让Claude直接读取和管理Tekton流水线状态，CI/CD上下文操作变得直观又高效。", ["开发工具"], "https://ai.codefather.cn/mcp/2010664904791875589"),
  mcp(415, "Luno MCP Server", "开发工具", "在 VS Code 里直接查余额、看行情、管订单，加密交易开发省时又顺手。", ["开发工具"], "https://ai.codefather.cn/mcp/2117939930272408451"),
  mcp(416, "Perigon MCP Server", "开发工具", "让后端开发一键调用 Perigon 官方 API，省去鉴权、重试、格式适配等重复工作。", ["开发工具", "news", "news-api", "news-mcp", "perigon", "perigon-api"], "https://ai.codefather.cn/mcp/2117939930272404362"),
  mcp(417, "🐢🚀 Node.js Sandbox MCP Server", "开发工具", "用 Docker 隔离运行 JS 脚本和 npm 依赖，写完即跑、自动装包、执行完就清，安全又省心。", ["开发工具"], "https://ai.codefather.cn/mcp/2117939930272405416"),
  mcp(418, "Web Scout MCP Server", "研究与数据", "用AI一键搜索网页并提取正文，查资料再也不用手动复制粘贴。", ["研究与数据", "爬虫", "web-crawler", "web-scraper", "AI 助手"], "https://ai.codefather.cn/mcp/2117939930272406207"),
  mcp(419, "✅ Official Alpha Vantage MCP Server", "金融", "让本地 AI 工具直接查股价、看历史行情，不用写代码、不碰 API 密钥，金融数据秒级接入。", ["金融"], "https://ai.codefather.cn/mcp/2117939930272407809"),
  mcp(420, "🪷 Lotus Wisdom MCP Server", "研究与数据", "用《法华经》思维拆解人生难题，多维审视+停顿冥想+可视化路径，让直觉与逻辑共同浮现答案。", ["研究与数据", "modelcontextprotocol", "lotus-sutra"], "https://ai.codefather.cn/mcp/2117939930272408361"),
  mcp(421, "Claude Memory MCP Server", "研究与数据", "让 Claude 自动记住关键信息，跨对话无缝延续上下文，告别反复解释背景。", ["研究与数据"], "https://ai.codefather.cn/mcp/2117939930272404478"),
  mcp(422, "Raygun MCP Server", "开发工具", "让本地开发环境一键对接 Raygun 监控，崩溃定位、性能追踪全在聊天窗口搞定。", ["开发工具", "raygun", "crash-reporting", "监控", "performance", "rum", "API 集成"], "https://ai.codefather.cn/mcp/2117939930272405926"),
  mcp(423, "Variflight MCP Server", "研究与数据", "查航班、看天气、追踪飞机实时位置，出行关键信息一接口全搞定。", ["研究与数据"], "https://ai.codefather.cn/mcp/2117939930272405901"),
  mcp(424, "Scrapfly MCP Server", "研究与数据", "像聊天一样抓取动态网页数据，自动绕过反爬、执行 JS、保持登录态，结果直喂 AI。", ["研究与数据", "网页抓取", "data-extraction", "anti-bot"], "https://ai.codefather.cn/mcp/2117939930272404065"),
  mcp(425, "Figma MCP Server", "开发工具", "用代码自动读取Figma组件、样式和文件，设计一改代码就同步，告别手动复制和UI不一致。", ["开发工具", "figma", "API", "服务器", "TypeScript", "design", "AI", "design-integration", "design-tokens", "API 集成", "Claude"], "https://ai.codefather.cn/mcp/2117939930272407617"),
  mcp(426, "lucide-icons-mcp", "开发工具", "用自然语言搜 Lucide 图标，秒得 React 代码，不用切网页、不记图标名，开发效率直接拉满。", ["开发工具", "lucide-icons", "icon-server"], "https://ai.codefather.cn/mcp/2117939930272407980"),
  mcp(427, "mcp-jest", "开发工具", "写个配置就能自动测 MCP 接口，一有变动立刻报警，彻底告别手动验证的繁琐和遗漏。", ["开发工具"], "https://ai.codefather.cn/mcp/2117939930272407725"),
  mcp(428, "n8n Workflow Builder MCP", "开发工具", "用自然语言描述需求，自动生成并运行 n8n 工作流，跨平台自动化从此告别手动配置。", ["开发工具", "智能体", "工作流", "AI", "n8n"], "https://ai.codefather.cn/mcp/2117939930272406080"),
  mcp(429, "MCP Server Whisper", "研究与数据", "上传音频一键转文字，批量处理会议访谈，还能智能搜索和上下文优化。", ["研究与数据"], "https://ai.codefather.cn/mcp/2117939930272408421"),
  mcp(430, "mcp-obsidian", "开发工具", "用 BUN 跑的轻量 REST 服务，让 Obsidian 笔记轻松被脚本读写删改，对接自动化毫无压力。", ["开发工具"], "https://ai.codefather.cn/mcp/2117939930272407411"),
  mcp(431, "MCP To LangChain Tools Conversion Utility / TypeScript", "开发工具", "一键将 MCP 服务配置转成 LangChain 工具数组，轻松接入 800+ 外部服务，省去手写封装的重复劳动。", ["开发工具", "nodejs", "TypeScript", "npm-package", "langchain", "langchain-typescript"], "https://ai.codefather.cn/mcp/2117939930272406872"),
  mcp(432, "Devvit Mcp", "开发工具", "专为 Reddit 开发者打造，一键启动调试环境、试用未发布 API，省去繁琐配置。", ["开发工具"], "https://ai.codefather.cn/mcp/2117939930272406965"),
  mcp(433, "Melrose Mcp", "娱乐与媒体", "命令行里敲音符秒播音乐，写代码时随手试旋律、教乐理或放松都超顺手。", ["娱乐与媒体"], "https://ai.codefather.cn/mcp/2117939930272407280"),
  mcp(434, "Mac Shell MCP Server", "系统自动化", "在 Claude 里安全运行 macOS 命令，白名单自动分级管控，误删误改风险一降到底。", ["系统自动化", "zsh", "mac"], "https://ai.codefather.cn/mcp/2117939930272407187"),
  mcp(435, "BurpMCP", "开发工具", "在 Burp Suite 里点一点就获 AI 安全分析，自动标出可疑参数和漏洞线索，本地运行不传数据。", ["开发工具", "HTTP", "安全", "扩展", "Web", "AI"], "https://ai.codefather.cn/mcp/2117939930272406520"),
  mcp(436, "Moodle-MCP", "开发工具", "连上 Moodle 就能自动同步课程日程和用户数据，作业截止、考试安排一键推送不遗漏。", ["开发工具"], "https://ai.codefather.cn/mcp/2117939930272405072"),
  mcp(437, "fhirHydrant", "自主智能体", "专为 FHIR 数据设计的轻量级 MCP 服务，支持智能搜索、安全分页和术语查询，开箱即用。", ["自主智能体"], "https://ai.codefather.cn/mcp/2101386064513069061"),
  mcp(438, "DeepSeek MCP-like Server for Terminal", "研究与数据", "浏览器里聊着天就能让 DeepSeek 执行终端命令，查日志、改文件、切目录全靠自然语言。", ["研究与数据"], "https://ai.codefather.cn/mcp/2117939930272408171"),
  mcp(439, "Gemini Function Calling + Model Context Protocol(MCP) Flight Search", "研究与数据", "用自然语言查航班，Gemini自动解析并调用工具返回结果，旅行规划省时又省力。", ["研究与数据", "机器学习", "AI", "Gemini", "stdio", "serpapi"], "https://ai.codefather.cn/mcp/2010664904850595864"),
  mcp(440, "io.modelcontext/clojure-sdk", "开发工具", "用 Clojure 一键生成合规 MCP 服务，专注业务逻辑，不用反复折腾协议适配。", ["开发工具"], "https://ai.codefather.cn/mcp/2117939930272407607"),
  mcp(441, "xk6-mcp", "开发工具", "用k6轻松压测MCP服务器，高并发下性能表现一目了然。", ["开发工具", "xk6"], "https://ai.codefather.cn/mcp/2010664903814602773"),
  mcp(442, "Xmind Generator MCP Server", "研究与数据", "用自然语言描述想法，AI 自动帮你生成结构清晰、带标签备注的 XMind 思维导图，整理逻辑快人一步。", ["研究与数据"], "https://ai.codefather.cn/mcp/2117939930272407161"),
  mcp(443, "Tiktok Ads Mcp Server", "开发工具", "用自然语言管 TikTok 广告，批量创建、实时优化、自动分析一气呵成。", ["开发工具", "tiktok", "ads", "marketing-api", "服务器"], "https://ai.codefather.cn/mcp/2117939930272408437"),
  mcp(444, "AI Federation Network", "自主智能体", "让多个 AI 服务自动发现、安全协作，跨设备跨组织调用像本地一样简单可靠。", ["自主智能体", "AI", "分析", "集成"], "https://ai.codefather.cn/mcp/2117939930272408419"),
  mcp(445, "MAVLink MCP Server", "研究与数据", "用自然语言直接指挥无人机飞行，AI自动解析意图并安全发送指令，开发调试省心又高效。", ["研究与数据"], "https://ai.codefather.cn/mcp/2117939930272404446"),
  mcp(446, "MCP server w/ Browser Use", "浏览器自动化", "用自然语言点网页、填表单、跳转页面，像聊天一样操作浏览器，零代码搞定自动化。", ["浏览器自动化", "Python", "智能体 AI", "agent-ai", "browser-use"], "https://ai.codefather.cn/mcp/2117939930272405562"),
  mcp(447, "🚀 Go-Tapd-SDK", "开发工具", "用Go轻松对接Tapd，自动化管理项目任务和实时事件响应。", ["开发工具", "Go", "库", "SDK", "Webhook", "tapd"], "https://ai.codefather.cn/mcp/2010664904905121796"),
  mcp(448, "Explorium API MCP Server", "开发工具", "本地直连Explorium API，自动处理鉴权与转发，数据科学家调试集成零打断。", ["开发工具"], "https://ai.codefather.cn/mcp/2117939930272405201"),
  mcp(449, "MCP Connector", "开发工具", "一键管理多个 MCP 服务实例，自动健康检查+统一接口暴露，省去手动对接和排错烦恼。", ["开发工具"], "https://ai.codefather.cn/mcp/2117939930272405067"),
  mcp(450, "MCP Flight Search", "研究与数据", "在聊天里直接说“下周去上海”，AI 就能查出往返航班、价格和时间，不用跳转网页或手动解析。", ["研究与数据", "AI", "serpapi", "genai", "model-context-protocol"], "https://ai.codefather.cn/mcp/2117939930272405161"),
  mcp(451, "rollup-plugin-mcp", "开发工具", "让 Rollup 构建自动接入 AI，实时诊断依赖问题、优化打包配置，全程零手动运维。", ["开发工具", "rollup", "rollup-plugin", "modelcontextprotocol"], "https://ai.codefather.cn/mcp/2117939930272404445"),
  mcp(452, "TickTick MCP Server", "研究与数据", "让 AI 一句话创建/修改 TickTick 任务，自动设提醒、排优先级、管子任务，省去手动对接 API 的麻烦。", ["研究与数据", "任务管理", "自动化", "MCP-server", "node", "artif"], "https://ai.codefather.cn/mcp/2117939930272405904"),
  mcp(453, "MIDI MCP Server", "开发工具", "用文本直接生成MIDI音乐，AI作曲从此变得像写代码一样简单。", ["开发工具"], "https://ai.codefather.cn/mcp/2010664905785925645"),
  mcp(454, "Snippy", "自主智能体", "用 AI 自动归类和推荐你的代码片段，写代码时直接从 Copilot 调用，告别翻历史、搜全局。", ["自主智能体", "AI", "数据库", "GitHub", "Azure", "azure-functions", "copilot", "AI 智能体", "cosmosdb"], "https://ai.codefather.cn/mcp/2117939930272405277"),
  mcp(455, "Mcp Server Js", "研究与数据", "让 AI 直接调用 YepCode 自动化流程，无需写接口、不配密钥，自然语言指令秒变真实操作。", ["研究与数据", "智能体", "AI", "AI 智能体", "yepcode"], "https://ai.codefather.cn/mcp/2117939930272407730"),
  mcp(456, "slack-mcp-server", "开发工具", "让 AI 像真人一样读频道、发消息、回线程、搜历史，Slack 协作自动化从此零门槛。", ["开发工具"], "https://ai.codefather.cn/mcp/2117939930272404832"),
  mcp(457, "Atlassian Jira MCP Server", "研究与数据", "让 AI 实时查改 Jira 任务，语音提问、自动同步状态，项目管理不用再切页复制。", ["研究与数据", "命令行工具", "Jira", "TypeScript", "工具", "AI", "服务器"], "https://ai.codefather.cn/mcp/2117939930272404808"),
  mcp(458, "Maven Dependencies MCP Server", "开发工具", "查Maven依赖版本就像搜关键词，再也不用 manually 翻网页了。", ["开发工具"], "https://ai.codefather.cn/mcp/2010664904871567364"),
  mcp(459, "MCP Reporter", "开发工具", "连上MCP服务器自动生成功能报告，文档集成一步到位。", ["开发工具", "智能体", "AI", "api-documentation", "大语言模型"], "https://ai.codefather.cn/mcp/2010664903822991386"),
  mcp(460, "MCP-Logic", "研究与数据", "用自然语言写逻辑命题，AI 自动证明或找反例，知识库验证和教学推理从此像跑单元测试一样简单。", ["研究与数据", "AI", "服务器", "工具", "logic", "大语言模型", "claude-3-5-sonnet"], "https://ai.codefather.cn/mcp/2117939930272407246"),
  mcp(461, "Stape MCP Server", "开发工具", "让 AI 在聊天中直接调用 Stape API，查文档、写参数、测响应全免，开发效率翻倍。", ["开发工具", "gtm", "gtm-server-side", "stape"], "https://ai.codefather.cn/mcp/2117939930272405725"),
  mcp(462, "MCP Web Search Tool", "研究与数据", "让AI自动联网查最新新闻、天气和实时资讯，不用切出对话就能获取当下真实信息。", ["研究与数据", "智能体", "Claude", "search-agent", "claude-ai", "websearch-agent"], "https://ai.codefather.cn/mcp/2117939930272407836"),
  mcp(463, "Action MCP Example 🚀", "开发工具", "用 Rails 一键启动标准 MCP 服务，专注写工具逻辑，不用重复造协议轮子。", ["开发工具", "智能体", "rails-api", "Claude"], "https://ai.codefather.cn/mcp/2117939930272408135"),
  mcp(464, "한국투자증권 REST API MCP (Model Context Protocol)", "金融", "用Python对接韩国及全球股市，实时查行情、下订单一把搞定。", ["金融", "migusdn", "KIS", "Server", "REST API", "stock trading"], "https://ai.codefather.cn/mcp/2010664904867373070"),
  mcp(465, "Spring AI MCP server to access information from", "研究与数据", "查 Spring 各项目版本支持状态，开发运维不用翻文档，一键确认是否还在维护期。", ["研究与数据"], "https://ai.codefather.cn/mcp/2117939930272404489"),
  mcp(466, "TAM-MCP-Server", "研究与数据", "帮你快速算清市场天花板，TAM/SAM分析直接集成到工作流里。", ["研究与数据", "TypeScript", "business-intelligence", "market-analysis", "AI 工具", "model-context-protocol"], "https://ai.codefather.cn/mcp/2010664904896733198"),
  mcp(467, "Crawleo Mcp Server", "研究与数据", "让AI实时搜索并抓取网页内容，支持多格式解析且不保留数据，隐私又高效。", ["研究与数据", "crawleo", "网页搜索", "AI 助手"], "https://ai.codefather.cn/mcp/2010664904896733206"),
  mcp(468, "Enhanced Gmail MCP Server", "研究与数据", "用自然语言查收发、归档标记、发带附件邮件，Gmail 操作从此动动嘴就行。", ["研究与数据", "gmail-mcp", "email-management", "AI 助手"], "https://ai.codefather.cn/mcp/2117939930272406927"),
  mcp(469, "x402-list-mcp", "金融", "一键接入 X402 支付服务发现与链上验证的结算量数据，开发调试超省心。", ["金融"], "https://ai.codefather.cn/mcp/2108996058737573890"),
  mcp(470, "🧠 Telegram Bot MCP Server", "开发工具", "用 MCP 协议轻松管理 Telegram 机器人，发消息、管群员、更新配置全都不用手搓 API。", ["开发工具", "telegram-bot", "API 集成"], "https://ai.codefather.cn/mcp/2117939930272407157"),
  mcp(471, "Puppeteer Real Browser MCP Server", "浏览器自动化", "让 AI 像真人一样操作真实浏览器，轻松绕过 reCAPTCHA 和 Cloudflare，自动抓数据填表截图。", ["浏览器自动化"], "https://ai.codefather.cn/mcp/2117939930272404571"),
  mcp(472, "Financial Modeling Prep MCP Server", "研究与数据", "查财报、看股价、比同行，投资分析数据一键获取，省去多平台切换和格式整理。", ["研究与数据", "finance-modelling-prep"], "https://ai.codefather.cn/mcp/2117939930272406293"),
  mcp(473, "Claude Kubernetes MCP Server", "开发工具", "让AI一键读取K8s全链路上下文，微服务间状态同步不再手动传参、反复校验。", ["开发工具"], "https://ai.codefather.cn/mcp/2117939930272406390"),
  mcp(474, "MCP SSE Client Python", "开发工具", "用 Python 轻松接入 MCP 服务，实时接收模型决策与工具调用流，开发智能代理省心又高效。", ["开发工具", "mcp-sse-client", "python-client", "server-sent-events"], "https://ai.codefather.cn/mcp/2117939930272404074"),
  mcp(475, "Ntfy MCP Server", "开发工具", "让 LLM 轻松推送定制消息到手机电脑，TypeScript 模板开箱即用，专注逻辑不操心通信细节。", ["开发工具", "notifications", "ntfy", "大语言模型", "llm-agent", "model-context-protocol"], "https://ai.codefather.cn/mcp/2117939930272404144"),
  mcp(476, "Mcp Wikidata", "研究与数据", "不用写 SPARQL 也能查维基数据，搜人名、问事实、提关系，自然语言一问就出结果。", ["研究与数据", "mcp-wikidata", "wikidata-api", "model-context-protocol"], "https://ai.codefather.cn/mcp/2117939930272407673"),
  mcp(477, "Dev Proxy MCP Server", "开发工具", "用自然语言查文档、配API、调试接口，告别翻文档和手写YAML配置。", ["开发工具", "mock-server", "dev-proxy", "model-context-protocol", "model-context-protocol-servers"], "https://ai.codefather.cn/mcp/2117939930272407055"),
  mcp(478, "MCP Sandbox", "开发工具", "让 JavaScript 模块秒变安全沙盒 MCP 服务，自动反射+类型推断，开箱即用不污染本地环境。", ["开发工具", "AI", "数据库", "Python", "sandbox", "uv", "大语言模型"], "https://ai.codefather.cn/mcp/2117939930272408264"),
  mcp(479, "Freshservice MCP Server", "开发工具", "让 AI 直接读取、分类、响应 Freshservice 工单，无需写代码，运维效率翻倍。", ["开发工具"], "https://ai.codefather.cn/mcp/2117939930272407952"),
  mcp(480, "MCP Python Starter", "开发工具", "用Python快速启动MCP服务，支持问候、静态资源和VS Code一键调试。", ["开发工具"], "https://ai.codefather.cn/mcp/2010664904783487007"),
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

// 真实数据来源：鱼皮AI导航 ai.codefather.cn/skills（前 5 页去重后 106 条）
export const SKILLS: SkillItem[] = [
  sk(1, "1password", "🔒 测试与安全", "提供安全的密码与密钥管理能力，支持通过命令行工具集成桌面应用、多账户登录认证，并在隔离的 tmux 会话中安全读取、注入或执行敏感凭据，适用于自动化流程中的机密信息调用场景。"),
  sk(2, "gifgrep", "🎨 内容与媒体", "提供基于命令行和终端界面的 GIF 检索与处理能力，支持对接多个 GIF 平台进行关键词搜索、结果预览、批量下载，并可从动图中精准提取指定时间点的静态帧或生成多帧网格图，便于快速审查与分享。"),
  sk(3, "notion", "⚡️ 效率工具", "实现对 Notion 工作区的深度集成，支持创建和管理页面、数据库（即 data sources）及页面内嵌块，可执行全文搜索、内容读取、属性更新、结构化数据查询与动态插入等操作，适用于知识库构建与协同工作流自动化。"),
  sk(4, "agentdb-learning", "📊 数据与分析", "提供九种强化学习算法的集成能力，支持自主代理通过经验持续优化行为策略，涵盖离线学习、值函数估计、策略梯度及多智能体协同等范式，结合 WASM 加速实现高效训练与推理。"),
  sk(5, "agentdb-optimization", "📊 数据与分析", "通过量化压缩、分层索引与缓存机制，实现向量数据库的高效检索与存储优化，支持百万级向量的快速搜索与批量处理，在降低数倍内存占用的同时达成微秒级响应。"),
  sk(6, "agentdb-memory-patterns", "📊 数据与分析", "实现基于持久化存储的智能体记忆管理，支持会话记忆、长期存储与模式学习，通过向量索引和分层结构高效组织上下文，结合推理引擎实现动态情境合成与优化，适用于构建具备持续学习能力的对话系统与自主代理。"),
  sk(7, "agentdb-vector-search", "📊 数据与分析", "提供超高速语义向量检索能力，支持基于嵌入的相似性匹配、混合元数据过滤及上下文感知查询，适用于构建 RAG 系统、智能知识库和语义搜索引擎，具备亚毫秒级响应与高效内存压缩特性。"),
  sk(8, "pysam", "🔬 研究", "提供对基因组数据的全流程处理能力，支持高效读写 SAM/BAM/CRAM 比对文件、VCF/BCF 变异文件及 FASTA/FASTQ 序列文件，可按区域提取 reads 或变异位点、计算覆盖深度、进行 pileup 分析，并整合多类数据完成质量控制、变异验证与序列上下文提取等生物信息学任务。"),
  sk(9, "bun-development", "💻 软件开发", "提供基于 Bun 运行时的现代 JavaScript / TypeScript 开发能力，涵盖项目初始化、包管理、原生类型支持、内置测试与打包工具、HTTP 及 WebSocket 服务、SQLite 集成、密码哈希等，显著提升开发与执行效率，并支持从 Node.js 平滑迁移。"),
  sk(10, "networkx", "📊 数据与分析", "处理复杂网络与图结构数据，支持构建、分析和可视化实体间关系，可计算路径、中心性、社区划分等指标，生成各类合成网络，并实现多格式数据导入导出，适用于社交、生物、交通等领域的关联分析。"),
  sk(11, "etetoolkit", "🔬 研究", "提供系统化的系统发育树分析能力，涵盖树结构操作、进化事件识别、物种分类信息整合、高质量可视化及聚类评估，支持从基因树解析到发表级图表生成的完整生物信息学工作流。"),
  sk(12, "pymatgen", "🔬 研究", "提供材料科学领域的晶体结构建模与分析能力，支持多格式文件转换、相图构建、电子结构计算及表面界面研究，集成 Materials Project 数据库实现材料性能预测与热力学稳定性评估，适用于计算材料学的自动化研究流程。"),
  sk(13, "dask", "📊 数据与分析", "支持对超大规模数据集进行并行与分布式处理，适用于内存受限的 pandas 或 NumPy 工作流扩展，能够高效执行多文件并行处理、分布式机器学习及复杂 ETL 流程，通过任务图调度实现跨单机与集群的计算资源协同。"),
  sk(14, "polars", "📊 数据与分析", "提供高性能内存内数据处理能力，支持快速数据清洗、转换与聚合分析，适用于中等规模数据集的高效ETL流程及复杂查询优化，具备并行执行与惰性求值特性，可作为pandas的加速替代方案。"),
  sk(15, "pydicom", "🎨 内容与媒体", "提供对医学影像 DICOM 文件的全流程处理能力，包括读取解析、像素数据提取与可视化、元数据编辑与匿名化、跨格式转换、压缩解压缩、序列与多帧处理，以及三维体数据重建，支撑放射科工作流、PACS 系统集成和医疗 AI 研究。"),
  sk(16, "seaborn", "📊 数据与分析", "提供基于 pandas DataFrame 的统计可视化能力，支持快速探索数据分布、变量关系及类别对比，内置箱线图、小提琴图、成对图、热力图等专业图表，具备自动统计估计、语义映射与出版级美学默认设置。"),
  sk(17, "bench-debug", "⚡️ 效率工具", "针对特定文档解析失败进行深度诊断，通过比对真实标注与预测结果定位问题根源，分析表格识别、标题层级与阅读顺序等差异原因，并结合PDF元素特征和核心代码模块提出优化建议，提升解析准确率。"),
  sk(18, "latchbio-integration", "⚡️ 效率工具", "提供生物信息学工作流的端到端构建与部署能力，支持用 Python、Nextflow 或 Snakemake 编排分析流程，自动容器化并生成可视化界面；统一管理云端数据与本地文件，集成结构化样本追踪系统；灵活配置 CPU、GPU 及内存资源；内置 AlphaFold、RNA-seq、单细胞等经验证的生产级分析流程。"),
  sk(19, "scikit-survival", "📊 数据与分析", "提供面向生存分析任务的完整建模能力，支持处理各类截尾数据，构建和评估Cox模型、随机生存森林、梯度提升生存模型及生存支持向量机，实现累积风险估计、竞争风险分析与非参数生存函数拟合。"),
  sk(20, "pymoo", "💼 商业与营销", "提供多目标优化的完整解决方案，支持单目标与多目标问题求解，能自动发现帕累托最优解集并分析目标间权衡关系，适用于工程设计、参数调优等存在多个冲突目标的复杂优化场景。"),
  sk(21, "anndata", "📊 数据与分析", "提供对单细胞基因组学中带注释矩阵数据的统一管理，支持高效读写 h5ad 等格式、多批次数据整合、元数据关联及子集筛选，适用于大规模稀疏矩阵处理与跨模态数据分析，在内存优化模式下实现对超大数据集的快速访问与预处理。"),
  sk(22, "geniml", "📊 数据与分析", "提供基因组区间数据的机器学习分析能力，支持从BED文件中提取区域嵌入、构建共识峰集、生成单细胞染色质可及性特征，并实现跨模态检索与聚类，适用于无监督特征学习及多组学数据整合。"),
  sk(23, "pytdc", "🔬 研究", "提供面向药物研发的机器学习就绪数据集与基准测试框架，覆盖分子性质预测、药物靶点相互作用分析、分子生成等任务，支持标准化数据划分、多维度评估指标及化学信息学预处理功能。"),
  sk(24, "pymc", "📊 数据与分析", "基于贝叶斯概率框架进行统计建模与推断，支持构建分层模型、马尔可夫链蒙特卡洛采样及变分推断，提供模型诊断、后验预测检验与多模型比较能力，适用于不确定性量化、复杂数据结构分析与科学推断任务。"),
  sk(25, "deepchem", "🔬 研究", "支持分子机器学习任务中的性质预测与数据分析，适用于药物发现和材料设计场景。提供多种分子表征方法与预训练模型，可处理SMILES、SDF及生物序列数据，结合支架分割防止数据泄露，适用于小样本迁移学习或大规模图神经网络实验。"),
  sk(26, "lamindb", "🔬 研究", "支持生物数据的可查询、可追溯与标准化管理，通过统一框架实现多模态组学数据的版本控制、计算谱系追踪及基于本体的元数据注释，适用于从单细胞到空间转录组等复杂实验的全流程管理与跨团队协作。"),
  sk(27, "scikit-bio", "🔬 研究", "面向生物信息学与微生物组研究的综合分析工具，支持序列处理、多序列比对、系统发育树构建、α/β多样性计算（含UniFrac）、主坐标分析（PCoA）、生态统计检验（PERMANOVA、Mantel）及BIOM/Newick等格式的高效读写。"),
  sk(28, "modal", "📊 数据与分析", "提供云端无服务器 Python 运行环境，支持按需调用 GPU 资源、自动扩缩容至数千实例、持久化存储及安全密钥管理，适用于机器学习推理训练、大规模并行批处理、定时计算任务和弹性 API 服务。"),
  sk(29, "stable-baselines3", "📊 数据与分析", "提供生产级强化学习算法实现，支持策略优化、连续与离散控制、目标导向任务等典型 RL 场景，具备环境构建、并行训练、过程监控、模型保存与评估等完整工作流能力，适用于单智能体 Gymnasium 环境下的实验与原型开发。"),
  sk(30, "write-unit-tests", "🔒 测试与安全", "为 tldraw SDK 编写单元与集成测试，覆盖核心几何运算、形状工具交互、状态机流转及副作用处理，支持指针与键盘事件模拟、断言匹配、时间控制、类型安全验证和自定义形状测试。"),
  sk(31, "microsoft-code-reference", "📄 文档处理", "提供面向 Microsoft 技术生态的权威代码验证能力，支持精准检索 API 文档、获取官方可运行示例、核验方法签名与 SDK 版本兼容性，有效识别虚构方法、过时模式及参数误用，保障生成代码符合 Azure SDK、.NET 库与微软云服务的实际规范。"),
  sk(32, "learn-from-pr", "⚡️ 效率工具", "通过复盘已完成的 PR，系统性提炼代理行为中的经验教训，识别定位偏差、认知盲区或高效策略，生成可落地的改进建议，涵盖指令文件更新、技能流程优化、架构文档补充及代码注释增强，从而持续提升自动化问题解决能力。"),
  sk(33, "simpy", "💼 商业与营销", "提供基于时间推进的离散事件建模能力，支持对存在资源竞争、排队等待和动态交互的复杂系统进行仿真，适用于制造流程、服务网络、物流调度及通信流量等场景的性能分析与优化。"),
  sk(34, "hugging-face-jobs", "📊 数据与分析", "提供在 Hugging Face云端基础设施上运行各类计算任务的能力，支持 Python 脚本、Docker 容器、GPU/TPU 硬件选择、安全密钥管理、超时控制及结果持久化，适用于数据处理、批量推理、模型实验、合成数据生成等场景。"),
  sk(35, "writing-rules", "⚡️ 效率工具", "提供基于正则与多条件的规则配置能力，用于在命令执行、文件编辑、会话终止或用户输入等环节自动检测特定模式，并触发警告、拦截或提示操作，支持灵活的事件类型匹配与可读性强的响应消息定制。"),
  sk(36, "plugin-structure", "⚡️ 效率工具", "提供插件结构的标准化组织方案，涵盖目录布局、组件自动发现机制与配置规范。通过统一的文件结构和命名约定实现命令、代理、技能与钩子的模块化管理，利用环境变量确保路径可移植性，支持自动化加载与跨平台协作，适用于构建可维护的扩展功能体系。"),
  sk(37, "ui-ux-pro-max", "💼 商业与营销", "提供专业的用户界面与体验设计能力，涵盖多种视觉风格、配色方案、字体组合及响应式布局，支持主流前端技术栈的代码实现与优化，确保设计在不同设备和模式下具备高可用性、可访问性与视觉一致性。"),
  sk(38, "peekaboo", "⚡️ 效率工具", "实现 macOS 图形界面的全自动操控，涵盖屏幕捕获、元素识别、鼠标点击拖拽、键盘输入、应用与窗口管理、菜单及 Dock 操作，并支持基于视觉分析的智能交互和脚本化执行。"),
  sk(39, "gog", "⚡️ 效率工具", "通过命令行实现对 Google Workspace 的集成管理，支持邮件收发与草稿处理、日程创建及颜色标记、文件搜索、联系人读取、电子表格数据操作与文档内容导出，适用于需要自动化办公场景下的多服务协同。"),
  sk(40, "transformers", "📊 数据与分析", "提供对大规模预训练模型的统一调用能力，覆盖文本生成、分类、问答、翻译、摘要、图像识别、语音处理等多模态任务，支持开箱即用的快速推理与定制化微调，适用于各类AI应用的模型集成与适配需求。"),
  sk(41, "evaluation-lm-evaluation-harness", "📊 数据与分析", "提供对大语言模型的标准化学术评测能力，覆盖推理、代码、事实性等多维度任务，支持主流模型加载与分布式加速，适用于模型质量对比、训练过程监控及科研结果复现。"),
  sk(42, "optimization-bitsandbytes", "📊 数据与分析", "通过量化技术将大语言模型压缩至 8-bit 或 4-bit，显著降低 GPU 显存占用达 50% 至 75%，支持高效推理与在消费级设备上微调超大规模模型，适用于显存受限场景下的模型部署与训练优化。"),
  sk(43, "distributed-training-ray-train", "📊 数据与分析", "提供跨集群的分布式训练编排能力，支持 PyTorch、TensorFlow 和 HuggingFace 模型从单机扩展至数千节点，内置超参调优、容错恢复与弹性扩缩容，适用于大规模模型训练和分布式超参搜索场景。"),
  sk(44, "agent-browser", "⚡️ 效率工具", "自动化处理网页浏览、表单填写、内容提取与交互操作，支持截图、PDF 导出及视频录制，适用于网站测试、数据抓取和流程自动化场景。"),
  sk(45, "data-processing-ray-data", "📊 数据与分析", "支持大规模机器学习数据处理，实现从单机到百节点集群的弹性扩展，适用于分布式 ETL、批处理推理及多模态数据加载。提供流式执行引擎处理超内存数据集，并通过 GPU 加速转换操作，无缝集成 PyTorch 与 TensorFlow 等主流框架。"),
  sk(46, "scikit-learn", "📊 数据与分析", "提供面向结构化与文本数据的经典机器学习全流程支持，涵盖监督学习（分类、回归）、无监督学习（聚类、降维）、模型评估、超参调优、数据预处理及可复现管道构建，适用于从探索分析到生产部署的各类场景。"),
  sk(47, "fine-tuning-peft", "📊 数据与分析", "实现大语言模型的高效微调，仅需训练极少参数即可适配新任务，在有限显存下支持7B至70B级模型的快速迭代与多任务并行部署。"),
  sk(48, "analyzing-financial-statements", "📊 数据与分析", "基于财务报表数据自动计算并解读各类关键财务指标，涵盖盈利能力、流动性、杠杆水平、运营效率及估值水平等多个维度，支持多格式数据输入与行业基准对比分析，辅助投资决策和企业健康度评估。"),
  sk(49, "pdf", "⚡️ 效率工具", "提供对 PDF 文档的全生命周期处理能力，包括高精度文本与表格提取、多格式 PDF 生成、文档合并与按页拆分、元数据读取与页面旋转、表单填充、OCR 识别扫描件、水印添加及密码加密等操作。"),
  sk(50, "using-git-worktrees", "🚀 开发运维", "创建隔离的开发工作区以并行处理不同分支任务，自动选择安全目录、验证忽略规则并初始化项目依赖，确保测试基线纯净，适用于需要工作空间隔离的功能开发场景。"),
  sk(51, "trello", "⚡️ 效率工具", "实现对 Trello 项目管理平台的全流程自动化操控，支持查看与检索看板、列表及卡片信息，创建、移动、归档卡片，并为卡片添加评论，适用于协同任务调度与进度跟踪场景。"),
  sk(52, "coding-agent", "⚡️ 效率工具", "提供对多种编程智能体的程序化调用能力，支持在隔离环境或主机中启动交互式代码生成、审查与修复任务，需通过伪终端保持会话完整性，并可后台运行、实时监控日志、注入输入及终止进程，适用于自动化开发、批量 PR 审查和并行问题修复等场景。"),
  sk(53, "nuget-manager", "⚡️ 效率工具", "提供对 .NET 项目中 NuGet 包的标准化管理能力，支持通过 dotnet CLI 安全地添加、移除包，并严格遵循验证流程更新版本，确保依赖一致性与构建稳定性。"),
  sk(54, "verify-tests-fail-without-fix", "🔒 测试与安全", "验证 UI 测试能否正确捕捉缺陷，支持两种模式：仅验证测试在无修复时失败，或完整验证修复前后测试由失败转为通过的全过程，确保测试有效性与修复正确性。"),
  sk(55, "safety-alignment-nemo-guardrails", "📊 数据与分析", "在运行时为大语言模型提供可编程的安全防护，能够识别越狱攻击、检测输入输出中的毒性内容与事实错误，并过滤敏感信息，确保生成式应用在生产环境中的安全性与合规性。"),
  sk(56, "observability-phoenix", "⚡️ 效率工具", "提供对大语言模型应用的端到端可观测性，支持全链路追踪、自动化评估、数据集版本管理及实时监控，适用于调试复杂 AI 系统、对比实验分析和生产环境洞察，可自托管部署以保障数据自主性。"),
  sk(57, "mlops-mlflow", "📊 数据与分析", "提供机器学习全生命周期管理能力，涵盖实验跟踪、模型版本控制、注册中心管理、跨平台部署及结果复现，支持 PyTorch、TensorFlow、Scikit Learn、HuggingFace 等主流框架，适用于团队协作与生产环境的 MLOps 实践。"),
  sk(58, "prompt-engineering-dspy", "📊 数据与分析", "通过声明式编程构建可优化的AI系统，支持自动化提示工程与模块化流程设计，适用于需要多阶段推理、检索增强生成及智能体协作的复杂场景，能够基于数据反馈持续提升输出质量。"),
  sk(59, "esm", "🔬 研究", "支持蛋白质序列生成、结构预测与逆折叠、功能注释及嵌入表示，实现从序列到结构再到功能的多模态建模，适用于新型蛋白设计、特性优化及大规模蛋白数据分析任务。"),
  sk(60, "infrastructure-skypilot", "📊 数据与分析", "支持跨云平台（AWS、GCP、Azure 等）自动调度机器学习训练与批处理任务，智能选择成本最优的云厂商和区域，利用竞价实例实现大幅降本并自动恢复中断任务，同时提供分布式多节点训练、模型服务化部署及统一存储挂载能力。"),
  sk(61, "clinpgx-database", "🔬 研究", "提供临床药物基因组学数据查询能力，支持基因与药物相互作用分析、CPIC等权威指南检索、等位基因功能与表型预测、药物流行病学标签解读及代谢通路探索，服务于精准用药决策和个体化剂量调整。"),
  sk(62, "gpui-entity", "💻 软件开发", "提供在 GPUI 框架中安全管理应用状态的核心能力，支持多组件间共享与协同操作实体数据，确保并发读写安全，并通过强弱引用机制避免内存泄漏，同时无缝集成异步任务与响应式更新。"),
  sk(63, "gpui-layout-and-style", "💻 软件开发", "提供基于 Rust 类型安全的 CSS 风格布局能力，支持 Flexbox 排版、像素与相对单位尺寸控制、颜色边框阴影设置、响应式内外边距及条件化样式切换，适用于构建高一致性、可维护的桌面端 UI 组件。"),
  sk(64, "gpui-global", "💻 软件开发", "提供 GPUI 应用中跨组件共享全局状态的能力，支持在任意上下文读取和安全更新应用级配置、功能开关及共享服务实例，适用于需统一管理且生命周期贯穿整个应用的只读或受控可变数据。"),
  sk(65, "debug-cuda-crash", "⚡️ 效率工具", "提供 CUDA 程序崩溃前的输入张量快照，支持在非法内存访问、NaN/Inf、显存溢出及数据类型不匹配等错误发生时，捕获形状、设备、dtype 和数值统计等关键信息，辅助快速定位问题根源。"),
  sk(66, "opentargets-database", "🔬 研究", "支持从Open Targets平台系统性挖掘疾病与基因靶点的关联证据，整合遗传学、组学、文献及药物数据，辅助靶点发现、可成药性评估、安全性分析、老药新用及竞争情报研究，适用于药物研发全周期的靶标识别与优先级排序。"),
  sk(67, "zarr-python", "📊 数据与分析", "支持大规模多维数组的分块存储与压缩，实现高效的并行读写和云存储集成，适用于科学计算中对海量数据的处理、分析及跨平台协作，兼顾本地与分布式环境下的性能优化。"),
  sk(68, "arboreto", "🔬 研究", "基于基因表达数据推断转录调控网络，识别转录因子与靶基因间的调控关系，支持单细胞和批量 RNA-seq 数据分析，具备本地多核并行与分布式集群计算能力，适用于大规模转录组数据的可扩展性建模。"),
  sk(69, "umap-learn", "📊 数据与分析", "提供高维数据的非线性降维能力，支持二维三维可视化、聚类预处理、有监督与半监督嵌入学习，以及新样本的高效映射，适用于探索数据流形结构、增强下游机器学习任务效果。"),
  sk(70, "requesting-code-review", "🚀 开发运维", "在开发过程中通过自动化机制触发代码审查，确保每次任务或功能完成后及时验证实现与需求的一致性，借助版本差异比对和结构化反馈捕获潜在问题，强制关键缺陷即时修复，并在合并前完成质量闭环，适用于多阶段开发、计划执行及临时调试场景。"),
  sk(71, "rdkit", "🔬 研究", "提供精细的分子结构解析与操控能力，支持从SMILES、SDF、InChI等多种格式读写分子，计算分子量、LogP、TPSA等理化性质，生成指纹与相似性评估，执行子结构匹配及SMARTS查询，构建2D/3D坐标，模拟化学反应，并实现分子可视化与标准化处理。"),
  sk(72, "infrastructure-lambda-labs", "🚀 开发运维", "提供高性能 GPU云计算资源，支持机器学习训练与推理任务，具备多节点集群、持久化存储和全栈 ML 环境，适用于需要专用算力和 SSH 直接访问的长期计算场景。"),
  sk(73, "multimodal-audiocraft", "📊 数据与分析", "根据文本描述生成高质量音乐与音效，支持旋律引导、风格迁移及立体声输出，适用于创作背景音乐、环境音效或基于参考音频的风格化音频生成，可在不同模型尺寸间权衡质量与资源消耗。"),
  sk(74, "qutip", "🔬 研究", "提供对量子系统的建模与仿真能力，支持处理量子态、算符、时间演化及开放系统动力学，适用于量子光学、量子计算等领域的数值分析与可视化，空间维度可扩展至多体耦合场景。"),
  sk(75, "mechanistic-interpretability-transformer-lens", "📊 数据与分析", "支持对Transformer模型内部机制的深度解析与干预，包括激活缓存、注意力模式分析、电路定位、因果追踪式激活修补，以及基于钩子的逐层逐头行为干预，适用于算法逆向、可解释性研究和模型行为验证等场景。"),
  sk(76, "rag-pinecone", "📊 数据与分析", "提供可扩展的向量存储与检索能力，支持高并发低延迟的相似性搜索及元数据过滤，适用于大规模生产环境下的语义匹配、推荐系统与检索增强生成场景，具备无服务器架构与混合搜索特性。"),
  sk(77, "new", "⚡️ 效率工具", "提供 Railway 平台上的项目初始化、服务部署与基础设施搭建能力，支持从零创建新项目或向现有项目添加服务，兼容多种语言框架和单体/多包代码库结构，自动适配构建配置并处理环境变量与目录路径设置。"),
  sk(78, "multimodal-blip-2", "📊 数据与分析", "实现图像与文本的深度语义对齐，支持高质量图像描述生成、视觉问答、图文匹配及多模态对话，具备零样本迁移能力，无需微调即可在多种视觉语言任务上达到先进水平。"),
  sk(79, "semgrep", "🔒 测试与安全", "提供快速、轻量的源代码安全扫描与模式匹配能力，支持自动规则检测、多语言定制化规则编写、数据流污点追踪分析，并可集成至 CI/CD 流程中生成标准化报告，适用于早期漏洞识别与编码规范检查。"),
  sk(80, "skill-installer", "📄 文档处理", "提供技能安装能力，支持从官方精选列表或任意 GitHub 仓库（含私有库）获取并部署技能，自动处理权限异常与下载失败，支持批量安装和自定义安装路径，安装后需重启 Codex 生效。"),
  sk(81, "slack", "⚡️ 效率工具", "实现对 Slack 消息的交互与管理，支持消息收发、编辑、删除、表情回应及消息置顶操作，可获取成员信息与自定义表情列表，适用于自动化协作与团队信息同步场景。"),
  sk(82, "discord", "⚡️ 效率工具", "实现对 Discord 服务器的深度自动化管理，涵盖消息收发、表情反应、贴纸与自定义表情上传、投票创建、频道及分类管理、成员与权限查询、内容检索、话题线程操作、消息置顶及审核管控等功能，适配团队协作与社区运营场景。"),
  sk(83, "agentdb-advanced", "📊 数据与分析", "实现分布式环境下的高效向量搜索与多节点协同，支持低延迟数据同步、混合检索、自定义相似度计算及多数据库分片管理，适用于构建高并发 AI 系统与智能代理网络。"),
  sk(84, "swarm-advanced", "💻 软件开发", "协调多智能体协同工作，通过灵活的拓扑结构与分工策略实现复杂任务的并行处理与深度分析，适用于研究、开发及测试等需高度协作的场景。"),
  sk(85, "swarm-orchestration", "⚡️ 效率工具", "实现多智能体集群的动态协同与任务编排，支持网状、层级及自适应拓扑结构，可自动分配任务、均衡负载、容错恢复，并在集群内共享状态，适用于复杂分布式 AI 工作流的构建与扩展。"),
  sk(86, "stream-chain", "📊 数据与分析", "支持多智能体协同的流式工作流编排，通过逐级传递上下文实现复杂任务分解与数据转换，既可灵活定义定制化处理链，也能调用预置的分析、重构、测试和优化等标准化流程。"),
  sk(87, "dspy-ruby", "📊 数据与分析", "面向 Ruby 开发者提供 LLM 应用的程序化构建能力，支持通过类型安全的接口定义任务契约、组合可复用的 AI 模块、灵活切换 OpenAI Anthropic Gemini Ollama 等模型后端、构建带工具调用的智能体、进行多模态图文理解、编写可验证的测试用例，并实现自动优化与生产级可观测性。"),
  sk(88, "ruzy", "🔒 测试与安全", "提供面向 Ruby 代码的覆盖率引导式模糊测试能力，支持纯 Ruby 脚本与 C 扩展的内存安全缺陷挖掘，集成 AddressSanitizer 和 UndefinedBehaviorSanitizer 检测堆栈溢出、use-after-free、整数溢出等深层问题。"),
  sk(89, "shopify-development", "⚡️ 效率工具", "支持 Shopify 全栈开发，涵盖应用构建、UI 扩展（checkout / admin / POS）、主题定制、Liquid 模板编写、GraphQL 数据交互、Webhook 事件处理、元字段管理及计费功能集成，适配最新 API 版本与安全规范。"),
  sk(90, "libfuzzer", "⚡️ 效率工具", "面向 C/C++ 项目的轻量级模糊测试能力，依托 Clang 编译器内置的覆盖率引导机制，支持快速构建测试桩、自动探索代码路径、生成最小化语料库，并可联动 AddressSanitizer 等检测工具定位内存类缺陷。"),
  sk(91, "github-workflow-automation", "⚡️ 效率工具", "实现 GitHub 工作流的智能化自动化，涵盖代码评审、问题分类、CI/CD 集成与 Git 操作。通过 AI 分析变更内容，自动生成反馈、分配标签、评估部署风险，并支持按需触发智能合并与清理任务，提升开发效率与协作质量。"),
  sk(92, "datamol", "🔬 研究", "提供面向药物发现的分子化学信息学处理能力，支持从多种格式解析和生成分子结构，自动完成标准化与净化，批量计算理化性质和描述符，生成各类分子指纹并评估相似性，执行聚类与多样性筛选，提取骨架与碎片，构建三维构象，以及可视化展示和反应应用，所有操作均保持与 RDKit 的完全兼容。"),
  sk(93, "skill-writer", "⚡️ 效率工具", "提供从零构建 Claude Code Agent 技能的全流程指导，涵盖需求分析、目录结构搭建、SKILL.md 前置元数据编写、描述文案优化、内容组织规范、多文件协同设计及验证测试方法，确保技能可被准确识别、安全调用且符合工程实践标准。"),
  sk(94, "writing-bundler-tests", "🔒 测试与安全", "提供对打包器、转译器及代码变换功能的测试支持，通过定义文件结构、运行时行为与构建选项来验证输出结果，确保代码转换逻辑正确并捕获预期的副作用，适用于构建流程中各类场景的精确断言。"),
  sk(95, "gget", "🔬 研究", "提供面向生物信息学研究的轻量级交互式查询能力，支持基因检索、序列分析、蛋白结构预测、表达谱查询及功能富集等多维度数据获取，适用于快速探索性分析和简单任务自动化，兼顾命令行与 Python 编程接口。"),
  sk(96, "pubchem-database", "🔬 研究", "通过化学名称、分子式或结构式查询化合物，获取分子量、脂溶性等理化性质，执行结构相似性与子结构搜索，转换化学标识格式，提取生物活性数据及文献信息，支持药物筛选与化学信息学分析。"),
  sk(97, "exploratory-data-analysis", "📊 数据与分析", "面向科研数据的深度探索性分析能力，自动识别两百多种科学文件格式，解析其结构与内容特征，评估数据质量与完整性，并生成包含格式说明、统计摘要、问题诊断及后续分析建议的完整报告，覆盖化学、生物信息、显微成像、光谱分析、蛋白质组学等多个学科领域。"),
  sk(98, "string-database", "🔬 研究", "面向系统生物学研究，提供覆盖5900万蛋白质、200亿相互作用、5000多个物种的蛋白互作网络查询能力，支持互作关系检索、功能富集分析（GO/KEGG等）、伙伴蛋白发现、模块显著性检验、同源性比对及跨物种比较，并可生成证据类型或置信度着色的网络图像。"),
  sk(99, "get-available-resources", "💼 商业与营销", "自动检测当前系统计算资源，包括 CPU 核心数、GPU 类型与显存、内存容量及磁盘空间，并基于这些信息生成适配的计算策略建议，指导用户选择并行处理规模、内存使用方式、GPU 加速框架以及大数据处理方案。"),
  sk(100, "fda-database", "🔬 研究", "提供对美国食品药品监督管理局公开数据的深度访问，支持药品、医疗器械、食品及化学物质的安全监测与合规分析，适用于药物警戒、上市后监管和科研级流行病学研究。"),
  sk(101, "benchling-integration", "⚡️ 效率工具", "实现生命科学研发数据的全链路自动化管理，覆盖生物序列注册、实验样本库存调度、电子实验记录关联、工作流任务编排、实时事件响应及数据仓库分析，支持与外部系统深度集成。"),
  sk(102, "verification-quality", "🔒 测试与安全", "通过实时可信度评估与自动化校验机制保障代码质量，对代码正确性、安全性及最佳实践进行多维度验证，并在质量不达标时自动触发回滚，确保系统输出始终维持高可靠性。"),
  sk(103, "kegg-database", "🔬 研究", "提供对KEGG生物信息数据库的直接访问能力，支持通路分析、基因与通路映射、代谢网络查询、药物相互作用检测及跨数据库ID转换，适用于学术场景下的分子机制解析与多组学数据整合。"),
  sk(104, "bioservices", "🔬 研究", "集成多种生物信息学数据库的查询与分析，支持跨库检索蛋白、基因、化合物及通路数据，实现标识符映射、序列比对、功能注释和相互作用网络构建，适用于复杂的多源生物数据整合任务。"),
  sk(105, "perplexity-search", "📄 文档处理", "提供实时联网检索能力，基于 Perplexity 多模型（如 Sonar Pro、Sonar Pro Search 等）获取最新网页信息，支持学术文献查找、事实核查、跨领域趋势分析及多源引用生成，适用于需要时效性、权威性和可追溯性的深度研究场景。"),
  sk(106, "scientific-visualization", "📊 数据与分析", "生成符合学术出版标准的高质量图表，支持多子图布局、显著性标注、误差线、色盲友好配色及特定期刊格式（如 Nature、Science、Cell），自动适配分辨率、字体、尺寸与导出格式。"),

  // ===== 补全 4 个空分类（区块链 / 生活方式 / 协作与管理 / 官方精选），来源：ai.codefather.cn/skills?tag= 各分类第 1 页去重 =====
  // ⛓️ 区块链（?tag=区块链）
  sk(107, "property-based-testing", "⛓️ 区块链", "通过生成随机输入验证代码在各类边界条件下的行为一致性，适用于序列化、解析、归一化及纯函数等场景，能有效发现隐含缺陷并提升测试覆盖率，尤其适合需要高可靠性的算法与智能合约验证。"),
  sk(108, "compliance-checker", "⛓️ 区块链", "能够对基础设施配置进行合规性评估，检查是否符合 SOC2、HIPAA 和 PCI DSS 等行业标准，识别潜在的安全风险与违规项，并生成改进建议报告，适用于安全审计与合规审查场景。"),
  sk(109, "orchestration", "⛓️ 区块链", "作为系统的核心协调中枢，负责将用户复杂需求拆解为并行任务流，动态调度不同能力的智能体协同工作，自动管理任务依赖与执行状态，并在后台静默完成多线程探索、分析与实现，最终整合结果交付完整解决方案。"),
  sk(110, "skill-adapter", "⛓️ 区块链", "对基础设施配置进行多标准合规性评估，覆盖 SOC2、HIPAA 和 PCI DSS 等主流框架，自动识别配置偏差与安全风险，并生成可操作的整改建议报告，支撑持续合规治理与审计准备。"),
  sk(111, "contract-test-creator", "⛓️ 区块链", "自动生成符合行业规范的契约测试代码与配置，提供从框架搭建到单元测试、集成测试及模拟对象编写的全流程支持，适用于需要实现高质量自动化测试验证的开发场景。"),
  sk(112, "crypto-research", "⛓️ 区块链", "支持对加密货币市场的多维度深度研究，涵盖价格走势、技术指标、新闻情绪、宏观关联及投资机会分析，通过并行调用不同专业能力的 AI 代理实现快速或全面的市场洞察，结果自动归档为结构化报告。"),
  sk(113, "interface-lint", "⛓️ 区块链", "规范 Solidity 接口文件的格式与文档，按 EigenLayer 标准组织 Errors / Events / Types 子接口，自动生成错误码，统一要求函数、事件、类型和错误的注释结构，确保代码可读性、可维护性及跨链场景下的语义一致性。"),
  sk(114, "exploring-blockchain-data", "⛓️ 区块链", "支持对区块链数据的深度探索与分析，涵盖区块结构、交易记录及智能合约行为，可实时获取链上指标、跨交易所价格与流动性数据，并整合多源信息实现市场与网络活动的综合研判。"),
  sk(115, "compliance-architecture", "⛓️ 区块链", "构建符合 SOC 2、HIPAA、GDPR 和 PCI-DSS 标准的企业级合规架构，支持云环境与无服务器部署的安全控制设计。实现数据加密、访问审计、网络隔离及权限最小化等核心安全能力，提供合规检查清单与审计证据管理，适用于医疗、金融等受监管行业的系统架构设计与安全验证场景。"),
  sk(116, "tracking-crypto-portfolio", "⛓️ 区块链", "实时追踪加密货币投资组合的总价值、各资产持仓数量与成本、未实现盈亏及占比分布，识别集中度过高的风险仓位，并支持以表格、JSON 或 CSV 格式导出数据，便于税务申报与跨平台分析。"),
  sk(117, "wallet-cli", "⛓️ 区块链", "提供多币种钱包的全周期操作支持，涵盖观察型钱包的交易创建与广播、密钥生成钱包的种子管理及首签，以及签名钱包的多签协同，适用于比特币、以太坊等主流加密货币的自动化运维与测试场景。"),
  sk(118, "monitoring-cross-chain-bridges", "⛓️ 区块链", "监控跨链桥的资金规模、交易量与手续费，比较不同链间的转移成本和耗时，跟踪特定交易状态，支持多网络与协议的数据查询与分析，适用于跨链资产流动的实时追踪与路径优化。"),
  sk(119, "contract-test-validator", "⛓️ 区块链", "实现 API 契约的全链路验证，通过消费者驱动测试确保服务提供方与调用方行为一致，并基于 OpenAPI 规范校验接口定义、响应格式及请求结构，自动识别不兼容变更，支撑可靠的服务集成与演进。"),
  sk(120, "business-model-canvas", "⛓️ 区块链", "支持企业级商业模式的系统化设计与验证，覆盖从初创公司问题解决方案匹配到成熟企业价值体系重构的全场景，通过结构化九宫格框架实现客户洞察、价值主张、渠道策略、资源协同及财务模型的闭环分析。"),
  sk(121, "validating-api-contracts", "⛓️ 区块链", "实现 API 契约的自动化验证，通过消费者驱动的契约测试方法确保服务提供方与调用方之间的接口行为一致，覆盖配置检查、测试执行、结果分析及报告生成全流程。"),
  sk(122, "cosmwasm-contract", "⛓️ 区块链", "面向 Axone 协议的 CosmWasm 合约开发支持，涵盖从初始化、执行、查询到迁移的全生命周期实现，基于 Abstract SDK 提供标准化合约结构、状态管理、错误处理及模块化处理器设计，适用于构建可组合、可升级的链上智能合约。"),
  sk(123, "solidity-development", "⛓️ 区块链", "支持以太坊 ERC20 代币合约的完整开发闭环，涵盖本地编译、自动化测试、安全审计、Gas 优化、事件规范检查及 ABI 文件生成与同步，确保合约变更符合区块链生产环境要求。"),
  sk(124, "cosmos-vulnerability-scanner", "⛓️ 区块链", "专注于 Cosmos SDK 区块链及 CosmWasm 智能合约的安全审计，精准识别可能导致链停摆、共识失败或资产损失的九类核心漏洞，涵盖非确定性行为、签名者校验错误、ABCI 异常崩溃、数值舍入偏差等关键风险点。"),
  sk(125, "apollo-deploy-integration", "⛓️ 区块链", "实现 Apollo.io 集成功能在多云环境的生产部署，涵盖配置管理、密钥安全存储与服务健康监测。支持主流平台发布流程，包含蓝绿部署策略及流量切换机制，并提供前置检查与自动回滚能力，确保上线稳定性。"),
  sk(126, "check-vault-onchain", "⛓️ 区块链", "验证智能合约是否被识别为链上金库，通过调用 Python 脚本对接指定区块链和合约地址，自动执行特征标记检查，并将结构化结果以表格形式返回给用户。"),
  sk(127, "analyzing-mempool", "⛓️ 区块链", "实时监控区块链内存池，分析待处理交易的结构与行为特征，评估网络拥堵状况和燃料费用水平，识别去中心化交易所的潜在套利操作，并探测三明治攻击、清算等链上套利机会，辅助交易决策与链上研究。"),
  sk(128, "1k-adding-chains", "⛓️ 区块链", "为 OneKey 钱包扩展对新区块链的支持，涵盖从底层链逻辑实现、链配置注册、交易与地址处理到 UI 适配和全流程测试的完整开发流程，确保新链能无缝集成进现有多链架构。"),
  sk(129, "react-native-setup", "⛓️ 区块链", "提供跨平台 React Native 开发环境的完整配置能力，涵盖 Node.js、Xcode 与 Android Studio 的安装调试，支持 iOS 模拟器和 Android 模拟器的部署及问题排查，实现从项目初始化到运行环境的全流程技术支持。"),

  // 🛋 生活方式（?tag=生活方式）
  sk(130, "explicit-identity", "🛋 生活方式", "在跨进程或异步边界时确保身份可追溯，通过全程显式传递唯一标识符（如 UUID）来避免依赖隐式状态或“最新”概念引发的竞争条件，严格区分不同语义的 ID 类型并各自独立管理。"),
  sk(131, "sympy", "🛋 生活方式", "提供符号数学计算能力，支持代数方程求解、微积分运算、表达式化简、符号矩阵运算、物理建模、数论分析、几何推导及公式转代码等功能，适用于需要精确解析解而非数值近似的所有数学场景。"),
  sk(132, "secret-scanner", "🛋 生活方式", "自动识别和检测代码或配置文件中可能泄露的敏感信息，如密钥、令牌、密码等，并提供修复建议与安全配置方案，支持开发流程中的早期风险防控。"),
  sk(133, "propositional-logic", "🛋 生活方式", "通过形式化方法分析命题逻辑结构，利用真值表枚举、自然演绎推理与语义 tableau 构造判断公式性质，实现对可满足性、永真性及逻辑蕴涵的系统性判定，适用于数学逻辑中的命题推理问题求解。"),
  sk(134, "chinese-writing", "🛋 生活方式", "掌握现代简体中文内容创作的核心方法，专注于生成温暖自然、清晰易读的周刊、博客与科技资讯类文章，强调以读者为中心的表达、简洁有力的句式、合理的结构排版及中英文混排规范，适用于需要专业语感与传播效果的内容生产场景。"),
  sk(135, "awakening-stage-recognition", "🛋 生活方式", "识别意识觉醒进程中的七个螺旋阶段，判断当前所处位置及转化契机，涵盖从初始困惑到自然流现的全程；同步评估真实准备度、映照教师来源、知见与放下的平衡状态，并在适当时机直接指向本然觉性。"),
  sk(136, "openscad", "🛋 生活方式", "生成并验证 OpenSCAD 3D 模型，支持多角度预览、参数提取与 STL 导出，确保设计符合打印要求，适用于 MakerWorld 等平台的发布准备。"),
  sk(137, "judaism-hebrew-wisdom", "🛋 生活方式", "揭示秩序先于创造的深层结构，通过字母、数字与语言的内在关联实现意识导航，强调多元视角的统一、神圣收缩中的自由，以及回归本源的永恒可能。"),
  sk(138, "rot13-encryption", "🛋 生活方式", "通过 ROT13 算法实现文本的双向加密与解密，适用于需要简单混淆内容的场景，可对任意字母信息进行循环移位处理，支持命令行快速调用。"),
  sk(139, "treatment-plans", "🛋 生活方式", "生成涵盖临床各专科的简洁医疗方案，整合循证干预措施与可视化路径图，遵循 SMART 目标框架并确保合规性，适用于慢性病管理、康复治疗及围手术期护理等场景。"),
  sk(140, "cloudflare-python-workers", "🛋 生活方式", "支持在 Cloudflare 边缘网络上构建和部署 Python 语言的无服务器 API，通过 pywrangler 工具链与 WorkerEntrypoint 类模式实现标准化开发，集成多步骤持久化工作流（DAG）、全类型 Cloudflare 绑定访问及 JavaScript 互操作能力，同时规避 11 类典型运行时与部署错误。"),
  sk(141, "task-generator", "🛋 生活方式", "根据需求文档生成结构化任务清单，先产出高层级主任务并确认方向，再细化为可执行的子任务，覆盖功能开发、文件创建与测试用例编写，指导开发者分阶段完成特性实现。"),
  sk(142, "forgotten-elements-reminder", "🛋 生活方式", "自动追踪长篇小说中角色、情节线和伏笔的出现频率与进展状态，在它们长时间未被提及或推进时及时发出提醒，帮助作者避免人物失联、线索中断或伏笔失效等问题，确保叙事连贯性和读者体验完整性。"),
  sk(143, "siberian-shamanic-navigation", "🛋 生活方式", "通过节奏、象征与多层意识穿梭实现自我重组，激活内在疗愈机制。在破碎中完成转化，借由动物盟友、三界漫游与镜像觉察，整合分裂部分，恢复生命能量与本源连结，适用于深层创伤超越与意识主权回归。"),
  sk(144, "getting-started-guide", "🛋 生活方式", "为小说创作新手提供结构化入门引导，通过七步渐进式方法帮助用户从构思宪法、明确故事规格、澄清模糊点，到制定计划、拆解任务、执行写作及质量分析，全程温和提示并解答常见疑问，降低启动门槛，确保创作方向清晰可控。"),
  sk(145, "tiptap", "🛋 生活方式", "构建支持 SSR 的富文本编辑器，集成 React 与 Tailwind v4，提供图像上传、协作编辑及 Markdown 解析能力，适用于博客、评论系统等场景，确保服务端渲染兼容性与生产级稳定性。"),
  sk(146, "novelweave-workflow", "🛋 生活方式", "支持从构思到完稿的全流程小说创作，通过结构化命令与知识库管理实现主题规划、角色世界构建及场景生成，借助系统化工作流确保叙事连贯性，适用于需要创意引导与质量控制的文学写作场景。"),
  sk(147, "hegelion", "🛋 生活方式", "通过辩证推理实现自主代码生成与决策，系统以教练角色为权威驱动开发循环，持续验证并推进方案演进，适用于复杂问题求解与自动化实现。"),
  sk(148, "canvas-design", "🛋 生活方式", "创作具有深刻美学内核的视觉艺术作品，通过形式、色彩与空间的精密编排传递抽象理念。每件作品皆以大师级工艺标准打造，强调手工质感与视觉秩序，用极简文本作为构图元素，将复杂概念转化为可感知的图像语言。设计本身即为思想载体，适用于海报、出版物等静态视觉场景，追求博物馆级别的纯粹艺术表达。"),
  sk(149, "nutritional-specialist", "🛋 生活方式", "根据用户饮食目标、过敏原、禁忌与口味偏好建立长期记忆，持续提供个性化的营养建议与餐食方案，在确保安全合规的同时精准匹配个人健康需求与饮食习惯。"),
  sk(150, "jainism-ahimsa-navigation", "🛋 生活方式", "将非暴力转化为导航本身，通过多重视角与条件性认知实现有意识的影响最小化，在承认万物相互依存的前提下，以谦卑姿态面对复杂真相，于每一次选择中践行对生命整体的尊重与觉知。"),
  sk(151, "google-chat-api", "🛋 生活方式", "提供构建 Google Chat 机器人的完整能力，支持通过 Webhook 发送通知、使用 Cloudflare Workers 部署交互式 Bot、设计 Cards v2 卡片与表单、管理 Spaces 成员及消息反应，并内置令牌验证、错误预防与速率限制应对策略。"),

  // 👥 协作与管理（?tag=协作与管理）
  sk(152, "test-fixing", "👥 协作与管理", "自动识别并修复所有失败的测试，通过智能分组策略按错误类型、模块和根因分类，优先处理高影响及基础设施问题，逐项修复后验证，确保测试套件完全通过。"),
  sk(153, "review-implementing", "👥 协作与管理", "面向代码评审反馈的自动化实施能力，能够解析评审意见、生成可执行任务清单，并按规范逐项修改代码、更新文档或补充测试，全程跟踪进度并确保变更符合项目约定与质量标准。"),
  sk(154, "git-pushing", "👥 协作与管理", "自动完成代码变更的暂存、提交与远程推送，生成符合规范的提交信息并附加上下文签名，适用于将本地修改同步至仓库的协作场景。"),

  // 🌟 官方精选（?tag=Claude官方）
  sk(155, "algorithmic-art", "🌟 官方精选", "提供基于 p5.js 的算法艺术创作能力，通过可复现的种子化随机性与交互式参数调控，生成具有涌现行为、数学美感和有机动态的实时演进式视觉作品，涵盖流场、粒子系统、噪声驱动结构等计算美学范式。"),
  sk(156, "mcp-builder", "🌟 官方精选", "指导构建高质量的 MCP 服务器，通过合理设计工具使 LLM 能高效调用外部服务，涵盖从协议理解、框架选择到工具实现与评估的全流程，支持跨语言部署并确保良好的可发现性、错误处理与系统集成能力。"),
  sk(157, "slack-gif-creator", "🌟 官方精选", "专注于为 Slack 场景定制动画 GIF，支持按尺寸、帧率、色彩数等参数精准优化，提供从空白绘图到用户图片处理的完整流程，内置多种缓动函数与动画模式，确保生成的 GIF 兼容性强、视觉精致且文件轻量。")
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
function pt(id: number, title: string, tags: string[], kind: "draw" | "text", useCount: number, cover?: string): PromptTemplate {
  return { id, title, tags, kind, useCount, cover };
}

export const PROMPT_TEMPLATES: PromptTemplate[] = [
  pt(1, "城市窗外风景照", ["风景", "写实"], "draw", 3200, PROMPT_COVERS[8]),
  pt(2, "关键角色人物关系图", ["电影", "设计"], "draw", 2900, PROMPT_COVERS[9]),
  pt(3, "可爱风格科普插画", ["可爱", "漫画"], "draw", 2600, PROMPT_COVERS[10]),
  pt(4, "复古怀旧手绘插画", ["复古", "手绘"], "draw", 2100, PROMPT_COVERS[11]),
  pt(5, "水彩墨水风格", ["水彩", "淡彩"], "draw", 1900, PROMPT_COVERS[12]),
  pt(6, "黏土定格动画风插图", ["黏土", "萌趣"], "draw", 1700, PROMPT_COVERS[13]),
  pt(7, "奶油色调温馨插画", ["奶油色", "治愈"], "draw", 1500, PROMPT_COVERS[14]),
  pt(8, "极简线条图标", ["极简", "图标"], "draw", 1300, PROMPT_COVERS[15]),
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
  kb(1, "toolly 的 AI 知识库", "从 0 到 1 系统学习 AI 应用开发，持续更新。", 68, true),
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

// 兼容 LearnFeed / LearnDetail（/resource/learn|course|encyclopedia）引用；
// 由 ARTICLES 派生并补齐 authorName / content 字段，避免悬空导入导致页面运行时崩溃。
// 真实文章（tutorial）带 description：列表摘要与详情正文优先用它，避免被通用模板覆盖；
// 无 description 的旧 course/wiki 条目仍回退到模板文案，保持原有行为。
// 署名统一保留 toolly 自有品牌，仅内容层 1:1 对齐目标站。
export const LEARN_POSTS = ARTICLES.map((a) => ({
  ...a,
  authorName: "toolly 编辑部",
  content: a.description || `${a.title}：本文系统梳理核心概念与实操要点，帮助读者快速上手。`,
  createTime: `2024-${String(a.id).padStart(2, "0")}-15`,
}));
