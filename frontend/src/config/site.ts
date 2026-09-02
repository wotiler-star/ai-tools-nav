// 站点全局配置

/** 站点信息 */
export const SITE = {
  name: "toolly",
  title: "toolly - AI工具导航与提示词大全",
  description:
    "分享最新最有趣的 AI 工具、资源、信息，打造最强 AI 社区。汇集 AI 工具、AI 知识库、AI 提示词、MCP、Skills、学习资源与资讯。",
  slogan: "分享最新最有趣的 AI 工具、资源、信息，打造最强 AI 社区",
  owner: "toolly",
  domain: "www.toolly.cc",
  icp: ""
};

/**
 * 后端 API 地址。
 * - 生产：https://api.codefather.cn （复刻目标真实后端）
 * - 本地：Spring Boot 默认 8123 端口
 */
export const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8123/api";

/**
 * 是否使用前端内置 Mock（无 Java 环境时也能完整预览 UI）。
 * 设为 false 即直连真实 Spring Boot 后端。
 */
export const USE_MOCK =
  (process.env.NEXT_PUBLIC_USE_MOCK || "true") === "true";

/** 图片 CDN（复刻 pic.code-nav.cn） */
export const IMG_CDN = "https://pic.code-nav.cn";
