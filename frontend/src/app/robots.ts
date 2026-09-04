import type { MetadataRoute } from "next";
import { SITE } from "@/config/site";

export default function robots(): MetadataRoute.Robots {
  const base = `https://${SITE.domain}`;
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // 后台、登录态个人页、接口与搜索结果页不参与收录
        disallow: ["/admin", "/user/", "/api/", "/search"]
      }
    ],
    sitemap: `${base}/sitemap.xml`,
    host: base
  };
}
