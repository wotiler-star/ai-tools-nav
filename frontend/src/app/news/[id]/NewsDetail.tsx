"use client";

import { useState } from "react";
import Link from "next/link";
import {
  FireFilled,
  LikeOutlined,
  ShareAltOutlined,
  ArrowLeftOutlined
} from "@ant-design/icons";
import { useToast, Toast } from "@/components/Toast";
import Markdown from "@/components/Markdown";
import { NewsItem } from "@/types";
import { AI_NEWS } from "@/lib/mockData";
import { SITE } from "@/config/site";

const SOURCES = ["机器之心", "量子位", "InfoQ", "36氪", "新智元", "钛媒体"];

function buildMarkdown(item: NewsItem): string {
  if (item.content?.trim()) return item.content;
  const source = SOURCES[(item.rank - 1) % SOURCES.length];
  return [
    `## 事件概要`,
    `${item.title}。本条资讯来自 **${source}**，在 ${SITE.name} AI 资讯榜位列第 **${item.rank}** 位，是近期社区关注的热点之一。`,
    ``,
    `## 为什么重要`,
    `这一进展反映了 AI 行业的快速演进：从底层模型能力到上层应用生态，相关技术正在被更快地落地到真实场景。对开发者与使用者而言，及时掌握此类动态有助于把握工具选型与学习路线。`,
    ``,
    `## 可能影响`,
    `若趋势延续，相关能力与产品形态会进一步普及，带动上下游工具链的更新。建议持续关注官方发布与社区实测，优先在低风险场景中验证再投入生产。`
  ].join("\n");
}

export default function NewsDetail({ item }: { item: NewsItem }) {
  const { msg, show } = useToast();
  const [liked, setLiked] = useState(false);

  const source = SOURCES[(item.rank - 1) % SOURCES.length];
  const mdSource = buildMarkdown(item);
  const heat = 2000 - (item.rank - 1) * 130;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: item.title,
    description: `AI 行业动态：${item.title}`,
    datePublished: new Date().toISOString().slice(0, 10),
    author: { "@type": "Organization", name: source },
    publisher: {
      "@type": "Organization",
      name: SITE.name,
      logo: { "@type": "ImageObject", url: `https://${SITE.domain}/icon.svg` }
    },
    mainEntityOfPage: `https://${SITE.domain}/news/${item.id}`
  };

  const related = AI_NEWS.filter((n) => n.id !== item.id).slice(0, 5);

  const onShare = async () => {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      show("链接已复制，去分享吧");
    } catch {
      show(url);
    }
  };

  return (
    <div style={{ maxWidth: 820, margin: "0 auto", padding: "20px 16px" }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <nav style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "var(--text-3)", marginBottom: 16 }}>
        <Link href="/" style={{ color: "var(--text-3)" }}>首页</Link>
        <span>/</span>
        <Link href="/news" style={{ color: "var(--text-3)" }}>AI资讯</Link>
        <span>/</span>
        <span style={{ color: "var(--text-2)" }}>详情</span>
      </nav>

      <Link href="/news" style={{ color: "var(--text-3)", fontSize: 14, display: "inline-flex", alignItems: "center", gap: 6 }}>
        <ArrowLeftOutlined /> 返回资讯
      </Link>

      <article className="detail-card" style={{ marginTop: 14 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, color: "var(--text-3)", fontSize: 13, marginBottom: 12, flexWrap: "wrap" }}>
          <span className="chip chip-brand">第 {item.rank} 名</span>
          <span>{source}</span>
          <span>热度 {heat.toLocaleString()}</span>
          {item.hot && (
            <span style={{ color: "#ff4d4f", display: "inline-flex", alignItems: "center", gap: 4 }}>
              <FireFilled /> 热
            </span>
          )}
        </div>

        <h1 style={{ margin: 0, fontSize: 26, lineHeight: 1.4, color: "var(--text-1)" }}>
          {item.title}
        </h1>

        <Divider />

        <div className="article-body">
          <Markdown source={mdSource} />
        </div>

        <div style={{ display: "flex", gap: 12, marginTop: 24, flexWrap: "wrap" }}>
          <button
            type="button"
            className="brand-btn-ghost"
            onClick={() => setLiked((v) => !v)}
            style={
              liked
                ? { borderColor: "#3874f7", color: "#3874f7", background: "var(--brand-tint)" }
                : undefined
            }
          >
            <LikeOutlined />
            {liked ? "已点赞" : "点赞"}
          </button>
          <button type="button" className="brand-btn-ghost" onClick={onShare}>
            <ShareAltOutlined />分享
          </button>
        </div>
      </article>

      <div style={{ marginTop: 28 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 14, color: "var(--text-1)" }}>更多资讯</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {related.map((r) => (
            <Link key={r.id} href={`/news/${r.id}`} className="group hover-brand">
              <div
                style={{
                  background: "var(--surface)",
                  border: "1px solid var(--border)",
                  borderRadius: 12,
                  padding: 14,
                  display: "flex",
                  gap: 12,
                  alignItems: "center"
                }}
              >
                <span
                  style={{
                    width: 26,
                    height: 26,
                    borderRadius: 8,
                    flexShrink: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 800,
                    fontSize: 13,
                    color: "#fff",
                    background: r.rank <= 3 ? "#ff4d4f" : "#c9cdd4"
                  }}
                >
                  {r.rank}
                </span>
                <span className="hover-brand-title" style={{ fontSize: 15, fontWeight: 600, color: "var(--text-1)" }}>
                  {r.title}
                  {r.hot && <FireFilled style={{ color: "#ff4d4f", marginLeft: 6 }} />}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <Toast msg={msg} />
    </div>
  );
}

function Divider() {
  return <div style={{ height: 1, background: "var(--border)", margin: "4px 0" }} />;
}
