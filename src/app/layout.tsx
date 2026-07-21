import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ThemeScript from "@/components/ThemeScript";
import Providers from "@/components/SessionProvider";

export const metadata: Metadata = {
  title: {
    default: "AI 导航 · 发现最好的 AI 工具与社区",
    template: "%s · AI 导航",
  },
  description:
    "精选全球优质 AI 工具，提供分类导航、热榜、最新收录，以及 AI 交流社区、资讯、提示词广场。",
  keywords: ["AI工具", "AI导航", "AI社区", "提示词", "ChatGPT", "Midjourney"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body>
        <Providers>
          <Navbar />
          <div className="min-h-screen pt-[64px]">{children}</div>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
