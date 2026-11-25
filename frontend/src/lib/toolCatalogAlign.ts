/**
 * /tool 工具页「红框三板块」1:1 对齐目标站 目标站/tool 的静态配置。
 * 数据源：2026-11-24 实时抓取目标站 SSR DOM（tools/rea/_target_tool_live.html）逐项解析，
 * 不是估算。三块 = ①顶部分类导航(6 项带下拉) + 全局标签云(20 项) ②左侧竖排分类
 * ③内容区 6 个分区的固定 tab 行。
 *
 * 说明：目标站分类名与本站数据库 categories 完全一致（14 项），故按名字映射即可，
 * 不依赖易变的数据库 id。
 */

/** 目标站顶部分类导航中带下拉箭头(antd submenu)的 6 个分类，下拉内容=该分区 tab */
export const DROPDOWN_CATEGORIES = [
  "AI写作",
  "AI图像",
  "AI办公",
  "AI开发平台",
  "AI大模型",
  "AI应用"
] as const;

/** 目标站顶部全局标签云（nav 下 20 个 button，顺序一致） */
export const GLOBAL_TAG_CLOUD = [
  "AI写作工具",
  "AI小红书文案",
  "AI小说",
  "AI论文写作",
  "AI图片优化修复",
  "AI图片背景移除",
  "AI图片插画生成",
  "AI编程工具",
  "AI开源项目",
  "AI PPT",
  "AI文档工具",
  "AI思维导图",
  "AI表格数据处理",
  "AI语言翻译",
  "AI会议工具",
  "AI效率提升",
  "AI法律助手",
  "AI智能体",
  "AI音频音乐",
  "AI应用"
] as const;

/**
 * 分区 tab 行：仅以下 6 个分类有固定 tab（其余 8 个分类目标站无 tab 行，直接出卡片）。
 * 每项顺序与目标站 DOM 一致。
 */
export const SECTION_TABS: Record<string, readonly string[]> = {
  AI写作: [
    "AI写作工具", "AI小红书文案", "AI小说", "AI论文写作", "AI总结摘要", "AI提示词",
    "AIGC检测", "AI公文", "AI标书写作", "AI论文查重", "AI阅读", "降AIGC率"
  ],
  AI图像: [
    "常用AI图像工具", "AI图片优化修复", "AI图片背景移除", "AI图片无损放大",
    "AI 3D模型生成", "AI商品图生成", "AI图片插画生成", "AI图片物体抹除"
  ],
  AI办公: [
    "AI PPT", "AI文档工具", "AI思维导图", "AI表格数据处理", "AI语言翻译",
    "AI会议工具", "AI招聘求职", "AI效率提升", "AI法律助手"
  ],
  AI开发平台: [
    "AI编程工具", "AI开源项目", "AI开发框架", "AI开放平台", "AI训练模型",
    "AI-SQL数据库", "AI低(无)代码编程", "AI国际导航", "AI开发课堂"
  ],
  AI大模型: [
    "AI大语言模型", "AI视觉大模型", "AI视频大模型", "AI语音大模型",
    "AI多模态大模型", "AI大模型评测", "AI海外大模型", "AI行业大模型"
  ],
  AI应用: [
    "AI聊天机器人", "AI图像设计", "AI视频制作", "AI写作助手", "AI扫描识别",
    "AI语音转录", "AI音频生成", "AI语言翻译", "AI教育学习", "AI编程助手", "AI智能体"
  ]
};

/**
 * 取分区 tab：目标站仅 6 个分类有 tab 行，其余 8 个分区直接出卡片、无 tab。
 * 为 1:1 严格对齐，无映射分类返回空数组（不再回退数据库 tags，避免多出目标站没有的 chip 行）。
 */
export function getSectionTabs(catName: string, _dbTags: string[] = []): readonly string[] {
  return SECTION_TABS[catName] ?? [];
}
