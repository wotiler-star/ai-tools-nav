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
  }
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
        sameAs: ["https://github.com/liyupi/ai-guide"]
      }
    ]
  };

  return (
    <html lang="zh-CN">
      <body>
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
