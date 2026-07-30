import type { MetadataRoute } from "next";
import { SITE } from "@/config/site";
import { AI_TOOLS, KB_COLUMNS, CATEGORIES } from "@/lib/mockData";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = `https://${SITE.domain}`;
  const now = new Date();

  // 静态主路由
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${base}/`, lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: `${base}/tool`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${base}/essay`, lastModified: now, changeFrequency: "daily", priority: 0.8 },
    { url: `${base}/painting`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/news`, lastModified: now, changeFrequency: "daily", priority: 0.8 },
    { url: `${base}/mcp`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${base}/skills`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${base}/resource/learn`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${base}/library`, lastModified: now, changeFrequency: "weekly", priority: 0.7 }
  ];

  // 动态：工具详情
  const toolRoutes: MetadataRoute.Sitemap = AI_TOOLS.map((t) => ({
    url: `${base}/tool/${t.id}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.6
  }));

  // 动态：知识库专栏
  const libraryRoutes: MetadataRoute.Sitemap = KB_COLUMNS.map((c) => ({
    url: `${base}/library/${c.id}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.6
  }));

  // 动态：分类页
  const categoryRoutes: MetadataRoute.Sitemap = CATEGORIES.map((c) => ({
    url: `${base}/category/${c.id}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.5
  }));

  return [...staticRoutes, ...toolRoutes, ...libraryRoutes, ...categoryRoutes];
}
