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
// 对齐目标站：热门搜索固定 4 个（原 5 个）
export const HOT_SEARCHES: string[] = [
  "Vibe Coding 教程",
  "AI 学习路线",
  "AI 项目",
  "AI 编程"
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
  mcp(1, "n8n", "开发工具", "用拖拽+代码组合搭建自动化流程，连私有部署和AI集成都安排得明明白白。", ["开发工具", "命令行工具"], "https://ai.codefather.cn/mcp/2010664903835574277"),
  mcp(2, "MCP Toolbox For Databases", "开发工具", "用自然语言操作数据库，AI写SQL、管表、建索引，开发快到飞起。", ["开发工具"], "https://ai.codefather.cn/mcp/2010664905790119943"),
  mcp(3, "Context7", "开发工具", "将最新的库文档和代码示例直接获取到 LLM 的 prompts 中。", ["开发工具", "AI"], "https://ai.codefather.cn/mcp/2010664905790119939"),
  mcp(4, "Bright Data MCP", "研究与数据", "查天气、抓市场数据，AI直接读网页做决策，省时又高效。", ["研究与数据", "scraping"], "https://ai.codefather.cn/mcp/2010664902036217864"),
  mcp(5, "Apify MCP Server", "浏览器自动化", "让 AI 代理一键调用 Apify 海量现成爬虫，轻松抓取社交、电商、地图等任意网站数据。", ["浏览器自动化"], "https://ai.codefather.cn/mcp/2111533207756259329"),
  mcp(6, "XcodeBuildMCP", "开发工具", "用AI直接操作Xcode项目，构建、清理、运行模拟器全都能一句话搞定。", ["开发工具", "xcode"], "https://ai.codefather.cn/mcp/2010664904850595847"),
  mcp(7, "🛡️ A.I.G（AI-Infra-Guard）", "安全", "一键扫描本地MCP服务器，自动揪出配置错误、接口暴露等AI基础设施安全风险。", ["安全"], "https://ai.codefather.cn/mcp/2117939930272405739"),
  mcp(8, "Dbhub", "分析", "提供一个实现 Model Context Protocol（MCP）服务端接口的通用数据库网关。", ["分析", "AI"], "https://ai.codefather.cn/mcp/2010664903055433737"),
  mcp(9, "MCP Containers", "开发工具", "几百个MCP服务器一键部署，用Docker跑模型服务省时又省心。", ["开发工具", "智能体"], "https://ai.codefather.cn/mcp/2010664902187212810"),
  mcp(10, "🪐✨ Jupyter MCP Server", "开发工具", "在Jupyter里和AI实时协作写代码，Claude直接调用本地笔记本太方便了。", ["开发工具", "工具"], "https://ai.codefather.cn/mcp/2010664903109959706"),
  mcp(11, "GSuite MCP Server", "开发工具", "用于集成 Google Workspace（GSuite）的 MCP 服务端，使 AI 助手能够访问 Gmail、日历及其他 Google 服务。", ["开发工具", "gsuite"], "https://ai.codefather.cn/mcp/2010664904867373084"),
  mcp(12, "QueryWeaver", "开发工具", "利用图驱动的模式理解，将自然语言问题转换为 SQL 查询。", ["开发工具", "text2sql"], "https://ai.codefather.cn/mcp/2010664903076405257"),
  mcp(13, "🌳 MCPJungle 🌳", "研究与数据", "统一管理私有MCP工具服务，注册即用、一键下线，让AI代理调用更安全省心。", ["研究与数据", "AI", "智能体"], "https://ai.codefather.cn/mcp/2117939930272404696"),
  mcp(14, "BioMCP: Biomedical Model Context Protocol", "研究与数据", "查文献、找基因变异、搜临床试验，一个工具全搞定。", ["研究与数据", "bioinformatics"], "https://ai.codefather.cn/mcp/2010664904821235715"),
  mcp(15, "SonarQube", "开发工具", "实现与 SonarQube 服务端 或 Cloud 的无缝集成，并允许在 agent 上下文中进行代码片段分析。", ["开发工具", "集成"], "https://ai.codefather.cn/mcp/2010664904926093322"),
  mcp(16, "Kagi MCP server", "开发工具", "用Kagi MCP在Claude里直接调用精准搜索，查资料写代码更高效。", ["开发工具"], "https://ai.codefather.cn/mcp/2010664904921899024"),
  mcp(17, "Sentry MCP Server", "开发工具", "让 AI 助手直接查 Sentry 错误、分析堆栈、评估影响，发布后自动巡检稳定性，排查故障不用切页面。", ["开发工具", "sentry"], "https://ai.codefather.cn/mcp/2117939930272405804"),
  mcp(18, "MCP server to deploy code to Google Cloud Run", "云平台", "在AI对话中一键部署应用到Cloud Run，自动处理构建、推送和上线，省去命令行和配置烦恼。", ["云平台", "google-cloud"], "https://ai.codefather.cn/mcp/2117939930272404402"),
  mcp(19, "Time", "开发工具", "通过 Model Context Protocol (MCP) 服务端为大型语言模型提供时间感知能力。", ["开发工具", "AI"], "https://ai.codefather.cn/mcp/2010664903135125508"),
  mcp(20, "🚀 monday.com MCP", "研究与数据", "让AI代理安全接入monday.com数据，自动化任务和智能决策一键搞定。", ["研究与数据", "copilot"], "https://ai.codefather.cn/mcp/2010664904842207241"),
  mcp(21, "Atomic Mail Agentic", "通信", "让 AI 代理自动收发邮件、智能响应，彻底告别手动操作邮件。", ["通信"], "https://ai.codefather.cn/mcp/2101386064513069058"),
  mcp(22, "Run Model Context Protocol (MCP) servers with AWS Lambda", "云平台", "把MCP服务一键部署到AWS Lambda，轻松实现无服务器化云端运行。", ["云平台"], "https://ai.codefather.cn/mcp/2010664903810408465"),
  mcp(23, "1MCP - One MCP Server for All", "开发工具", "统一管理多个MCP服务，省资源、免重启、热更新配置，开发调试更省心。", ["开发工具", "unified-mcp-server"], "https://ai.codefather.cn/mcp/2117939930272405849"),
  mcp(24, "Neon", "分析", "用自然语言直接操作 Neon 数据库，建表、改结构、复制数据一气呵成，告别 SQL 和多工具切换。", ["分析", "AI"], "https://ai.codefather.cn/mcp/2117939930272404462")
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
