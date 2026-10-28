import "antd/dist/reset.css";
import "./globals.css";
import type { Metadata } from "next";
import Provider from "./provider";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LoginModal from "@/components/LoginModal";
import BackToTop from "@/components/BackToTop";
import { SITE } from "@/config/site";

export const metadata: Metadata = {
  metadataBase: new URL(`https://${SITE.domain}`),
  title: {
    default: SITE.title,
    template: `%s｜${SITE.name}`
  },
  description: SITE.description,
  keywords: [
    "AI导航",
    "AI工具",
    "AI提示词",
    "AI社区",
    "MCP",
    "Skills",
    "AI学习资源",
    "AI资讯",
    "AI知识库",
    SITE.name
  ],
  applicationName: SITE.name,
  authors: [{ name: SITE.owner }],
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
    apple: "/icon.svg"
  },
  alternates: {
    canonical: "/"
  },
  openGraph: {
    type: "website",
    locale: "zh_CN",
    url: `https://${SITE.domain}`,
    siteName: SITE.name,
    title: SITE.title,
    description: SITE.description
  },
  twitter: {
    card: "summary_large_image",
    title: SITE.title,
    description: SITE.description
  },
  robots: {
    index: true,
    follow: true
  },
  // Google Search Console 站点验证：拿到 GSC 提供的 token 后，通过环境变量
  // NEXT_PUBLIC_GOOGLE_VERIFICATION 注入即可输出 <meta name="google-site-verification">，
  // 留空则不输出该标签（不影响其他 SEO 配置）。
  ...(process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION
    ? { verification: { google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION } }
    : {})
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  // 全局结构化数据：网站 + 组织 + 站内搜索动作（利于 SEO 富媒体展现）
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        name: SITE.name,
        url: `https://${SITE.domain}`,
        description: SITE.description,
        potentialAction: {
          "@type": "SearchAction",
          target: `https://${SITE.domain}/search?keyword={search_term_string}`,
          "query-input": "required name=search_term_string"
        }
      },
      {
        "@type": "Organization",
        name: SITE.name,
        url: `https://${SITE.domain}`,
        logo: `https://${SITE.domain}/icon.svg`,
        description: SITE.description,
        founder: { "@type": "Person", name: SITE.owner },
        sameAs: ["https://github.com/wotiler-star/ai-tools-nav"]
      }
    ]
  };

  return (
    // 内联脚本会在首屏渲染前改写 <html data-theme>，与 SSR 输出不一致，故抑制水合警告
    <html lang="zh-CN" suppressHydrationWarning>
      <body>
        {/* 主题预置：必须在页面内容之前同步执行，否则暗色用户会先看到一帧白屏再跳暗色。
            未存过偏好时跟随系统 prefers-color-scheme。 */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("theme");if(t!=="dark"&&t!=="light"){t=window.matchMedia&&window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";}document.documentElement.dataset.theme=t;}catch(e){document.documentElement.dataset.theme="light";}})();`
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Provider>
          <Header />
          <main className="min-h-[calc(100vh-120px)]">{children}</main>
          <Footer />
          <LoginModal />
          <BackToTop />
        </Provider>
      </body>
    </html>
  );
}
