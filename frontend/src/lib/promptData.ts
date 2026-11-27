// AI提示词板块真实数据（2026-11-27 从 ai.codefather.cn/prompt SSR DOM 逐字提取）
// 24 张卡片与 19 个分类 chip，1:1 对齐目标站

export interface PromptCard {
  title: string;
  desc: string;
  author: string;
  source: string;
  tags: string[];
}

export const PROMPT_CATEGORIES = ["全部", "📚 学习成长", "🎓 教育学习", "🐴 职场工作", "💻 技术", "✍️ 写作", "🔬 研究", "💼 商业", "🌏 文化", "💪 健康与养生", "👤 个人生活", "📈 市场营销", "🏢 品牌建设", "🎥 视频创作", "🎨 设计", "📷 摄影", "⚖️ 法律", "🎮 游戏", "🗣️ 语言"] as const;

export const PROMPT_CARDS: PromptCard[] = [
  {"title": "提示词质量审计助手", "desc": "用于检查提示词的清晰度、完整性、歧义等问题，并提供改进建议和优化版本", "author": "senoldak", "source": "收录自prompts.chat", "tags": ["技术", "写作", "学习成长"]},
  {"title": "AI自然对话生成器", "desc": "让AI用日常聊天语气回复，避免营销话术和AI腔，适合需要真实感交互的场景", "author": "prompts.chat 社区", "source": "收录自prompts.chat", "tags": ["技术", "写作", "职场工作", "教育学习"]},
  {"title": "Vue 3 前端开发专家", "desc": "辅助 Vue 3 + TypeScript 项目开发、重构、性能优化与可访问性实现", "author": "awesome-copilot 社区", "source": "收录自awesome-copilot agents", "tags": ["技术", "职场工作", "教育学习"]},
  {"title": "个性化学习路径规划", "desc": "输入学科、基础水平和可用时间，自动生成技能树、学习路线、资源清单、练习计划和进度跟踪表", "author": "kenicodes", "source": "收录自prompts.chat", "tags": ["教育学习"]},
  {"title": "React前端架构师助手", "desc": "帮开发者设计符合Clean Architecture和FSD规范的Next.js 15+生产级前端架构与代码", "author": "prompts.chat 社区", "source": "收录自prompts.chat", "tags": ["技术", "职场工作", "教育学习"]},
  {"title": "网页UI/UX设计提案助手", "desc": "输入客户信息和需求，生成包含设计概念、布局策略、视觉方向和交互亮点的完整提案", "author": "gokbeyinac", "source": "收录自prompts.chat", "tags": ["设计"]},
  {"title": "QA工程最佳实践指南", "desc": "为测试工程师提供覆盖测试策略、金字塔模型、命名规范、断言模式、缺陷报告和自动化指南的完整实践框架。", "author": "awesome-copilot 社区", "source": "收录自awesome-copilot instructions", "tags": ["技术", "职场工作"]},
  {"title": "自解释代码注释指南", "desc": "为开发者提供高质量代码注释规范，聚焦解释‘为什么’而非‘做什么’，提升可维护性。", "author": "awesome-copilot 社区", "source": "收录自awesome-copilot instructions", "tags": ["技术", "职场工作"]},
  {"title": "电商产品图精修", "desc": "将普通产品照片转为纯白背景、专业布光的高清电商主图，适配网站、广告和印刷", "author": "prompts.chat 社区", "source": "收录自prompts.chat", "tags": ["市场营销"]},
  {"title": "Python代码质量与性能优化", "desc": "审查并增强Python代码的文档、PEP8规范和运行性能，输出改进版代码及详细优化对比", "author": "sivasaiyadav8143", "source": "收录自prompts.chat", "tags": ["技术"]},
  {"title": "终端命令速查助手", "desc": "在 PowerShell 或 Bash 中快速获取可直接运行的命令，支持语法、管道、重定向等常见操作 troubleshooting", "author": "awesome-copilot 社区", "source": "收录自awesome-copilot agents", "tags": ["技术", "职场工作", "学习成长"]},
  {"title": "PRD文档自动生成", "desc": "输入产品想法或描述，一键生成结构完整、符合专业标准的产品需求文档", "author": "fabric 社区", "source": "收录自fabric", "tags": ["职场工作", "技术", "商业"]},
  {"title": "7天深度学习计划", "desc": "为任意技能定制高强度7日学习方案，聚焦核心20%内容，含每日三段式任务安排与明确达标标准。", "author": "prompts.chat 社区", "source": "收录自prompts.chat", "tags": ["学习成长"]},
  {"title": "概念对比学习助手", "desc": "用于系统学习新领域，生成含差异点、缺陷、混淆辨析和知识层级的对比表格", "author": "prompts.chat 社区", "source": "收录自prompts.chat", "tags": ["学习成长"]},
  {"title": "家庭应急计划生成器", "desc": "输入家庭基本信息，自动生成可打印的 YAML 格式应急计划，含风险评估、联络方案、物资清单和实操演练安排", "author": "f", "source": "收录自prompts.chat", "tags": ["健康与养生", "个人生活", "职场工作", "教育学习"]},
  {"title": "Spring Boot 开发规范", "desc": "为 Spring Boot 项目提供代码结构、依赖注入、配置管理、日志与安全等全链路开发最佳实践指南", "author": "awesome-copilot 社区", "source": "收录自awesome-copilot instructions", "tags": ["技术", "职场工作", "教育学习"]},
  {"title": "新手盲打训练教练", "desc": "为零基础或两指打字者定制6周盲打训练计划，兼顾准确率、办公场景和免费工具", "author": "f", "source": "收录自prompts.chat", "tags": ["教育学习", "职场工作", "学习成长"]},
  {"title": "摩洛哥蓝巷日出场景构建", "desc": "为AI绘图与视频生成定制蓝巷日出静帧+动画分镜，含可动元素标注与双Prompt种子", "author": "f", "source": "收录自prompts.chat", "tags": ["视频创作", "设计", "文化", "摄影"]},
  {"title": "家庭露营周末计划生成器", "desc": "输入家庭信息、目的地和装备，自动生成含行程、食宿、安全、分工和环保的完整露营计划（YAML格式）", "author": "f", "source": "收录自prompts.chat", "tags": ["个人生活", "教育学习", "职场工作", "健康与养生"]},
  {"title": "专业文本校对助手", "desc": "针对不同需求（如语法检查、风格优化、正式化等）提供10种校对方案，一键提升文本准确性与表达质量", "author": "this-is-lab", "source": "收录自prompts.chat", "tags": ["写作"]},
  {"title": "Rust 代码规范助手", "desc": "帮助开发者编写符合 Rust 社区标准、安全可维护的高质量代码", "author": "awesome-copilot 社区", "source": "收录自awesome-copilot instructions", "tags": ["技术"]},
  {"title": "创作者变现机会分析", "desc": "分析视频或文章内容，识别适合的 affiliate、赞助、数字产品等变现路径，并给出30天内可落地的高价值方案。", "author": "fabric 社区", "source": "收录自fabric", "tags": ["商业", "市场营销", "职场工作", "教育学习"]},
  {"title": "视频商业实体提取", "desc": "从视频字幕中自动识别产品、品牌、工具等可带货实体，标注类别、出现位置和购买潜力", "author": "fabric 社区", "source": "收录自fabric", "tags": ["视频创作", "市场营销", "商业", "技术"]},
  {"title": "小红书爆款标题生成器", "desc": "输入主题（如ChatGPT指令学习），一键生成10个带emoji、口语化、20字内的高点击率小红书标题", "author": "wonderful-prompts 社区", "source": "收录自wonderful-prompts", "tags": ["写作", "市场营销", "教育学习"]},
];
