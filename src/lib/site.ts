// 站点全局配置 —— 供 metadata / sitemap / robots / JSON-LD 统一引用
// 生产上线请在 .env 设置 NEXT_PUBLIC_SITE_URL 为你的真实域名（含 https://）

export const siteConfig = {
  name: "AI 导航",
  shortName: "AINav",
  // 一句话站点描述，用于默认 metadata 与 OG/Twitter
  description:
    "精选全球优质 AI 工具，提供分类导航、热榜、最新收录，以及 AI 交流社区、资讯、提示词广场、MCP 服务与 Skills 技能库。",
  // 站点正式域名（首尾不要带斜杠）
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://ai-nav.example.com",
  locale: "zh-CN",
  // 主题色，用于移动端浏览器地址栏与 PWA
  themeColor: "#1f6feb",
  // 全站关键词
  keywords: [
    "AI工具",
    "AI导航",
    "AI社区",
    "AI资讯",
    "提示词",
    "ChatGPT",
    "Midjourney",
    "Claude",
    "AI绘画",
    "AI写作",
    "大模型",
    "MCP",
    "Skills",
    "AI Agent",
    "人工智能工具",
    "AI工具箱",
    "国产AI",
    "AI工作流",
    "AI编程",
  ],
  author: { name: "AI 导航" },
  creator: "AI 导航",
  publisher: "AI 导航",
  // 社交账号（用于结构化数据与 OG）
  twitter: "@ainav_dev",
  github: "https://github.com/wotiler-star/ai-tools-nav",
  email: "hello@example.com",
} as const;

export type SiteConfig = typeof siteConfig;
