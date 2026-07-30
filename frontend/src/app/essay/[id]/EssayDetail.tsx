"use client";

import { useState } from "react";
import Link from "next/link";
import {
  UserOutlined,
  LikeOutlined,
  MessageOutlined,
  ShareAltOutlined,
  EyeOutlined,
  ArrowLeftOutlined
} from "@ant-design/icons";
import { useToast, Toast } from "@/components/Toast";
import { EssayPost } from "@/types";
import { ESSAY_POSTS } from "@/lib/mockData";
import { SITE } from "@/config/site";

/** 由 summary + 标签合成正文段落（mock 数据无正文，演示用） */
function buildBody(post: EssayPost): { h: string; p: string }[] {
  const lead = post.summary;
  const tagText = post.tags.join("、");
  return [
    { h: "导读", p: lead },
    {
      h: "核心思路",
      p: `在「${post.topic}」这个话题下，作者（${post.authorName} · ${post.authorTag}）把实践中的关键经验梳理成了可复用的方法：${lead} 文中涉及的要点主要围绕 ${tagText} 展开。`
    },
    {
      h: "实操建议",
      p: `如果你也想上手，建议先明确目标场景，再结合文中提到的 ${tagText} 逐步验证。遇到问题时回到社区交流，往往比独自摸索更高效。`
    },
    {
      h: "小结",
      p: `这篇文章来自鱼皮 AI 社区的真实讨论，欢迎在评论区补充你的做法，或把同话题的优质内容推荐给更多人。`
    }
  ];
}

export default function EssayDetail({ post }: { post: EssayPost }) {
  const { msg, show } = useToast();
  const [liked, setLiked] = useState(false);

  const related = ESSAY_POSTS.filter((p) => p.topic === post.topic && p.id !== post.id).slice(0, 3);
  const body = buildBody(post);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.summary,
    author: { "@type": "Person", name: post.authorName },
    publisher: {
      "@type": "Organization",
      name: SITE.name,
      logo: {
        "@type": "ImageObject",
        url: `https://${SITE.domain}/icon.svg`
      }
    },
    mainEntityOfPage: `https://${SITE.domain}/essay/${post.id}`
  };

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

      {/* 面包屑 */}
      <nav style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "var(--text-3)", marginBottom: 16 }}>
        <Link href="/" style={{ color: "var(--text-3)" }}>首页</Link>
        <span>/</span>
        <Link href="/essay" style={{ color: "var(--text-3)" }}>社区</Link>
        <span>/</span>
        <span style={{ color: "var(--text-2)" }}>帖子</span>
      </nav>

      <Link href="/essay" style={{ color: "var(--text-3)", fontSize: 14, display: "inline-flex", alignItems: "center", gap: 6 }}>
        <ArrowLeftOutlined /> 返回社区
      </Link>

      <article className="detail-card" style={{ marginTop: 14 }}>
        <h1 style={{ margin: 0, fontSize: 26, lineHeight: 1.4, color: "var(--text-1)" }}>
          {post.title}
        </h1>

        <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 16, color: "var(--text-3)", fontSize: 13 }}>
          <span
            style={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              background: "#9ca3af",
              color: "#fff",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 16,
              flexShrink: 0
            }}
          >
            <UserOutlined />
          </span>
          <span style={{ color: "var(--text-2)", fontWeight: 600 }}>{post.authorName}</span>
          <span className="chip">{post.authorTag}</span>
          <span>{post.createTime}</span>
          <span style={{ marginLeft: "auto", display: "flex", gap: 14 }}>
            <span><EyeOutlined /> {post.likeNum + post.commentNum * 3}</span>
          </span>
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, margin: "16px 0" }}>
          {post.tags.map((tag) => (
            <span key={tag} className="chip chip-brand">#{tag}</span>
          ))}
        </div>

        <Divider />

        <div className="article-body">
          {body.map((sec, i) => (
            <section key={i} style={{ marginBottom: 18 }}>
              <h2>{sec.h}</h2>
              <p>{sec.p}</p>
            </section>
          ))}
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
            {liked ? "已点赞" : "点赞"} {post.likeNum + (liked ? 1 : 0)}
          </button>
          <button type="button" className="brand-btn-ghost">
            <MessageOutlined />评论 {post.commentNum}
          </button>
          <button type="button" className="brand-btn-ghost" onClick={onShare}>
            <ShareAltOutlined />分享
          </button>
        </div>
      </article>

      {related.length > 0 && (
        <div style={{ marginTop: 28 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 14, color: "var(--text-1)" }}>
            相关帖子 · {post.topic}
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {related.map((r) => (
              <Link key={r.id} href={`/essay/${r.id}`} className="group hover-brand">
                <div
                  style={{
                    background: "var(--surface)",
                    border: "1px solid var(--border)",
                    borderRadius: 12,
                    padding: 16
                  }}
                >
                  <div className="hover-brand-title" style={{ fontSize: 16, fontWeight: 700, marginBottom: 6, color: "var(--text-1)" }}>
                    {r.title}
                  </div>
                  <div style={{ fontSize: 14, color: "var(--text-2)", lineHeight: 1.7 }}>
                    {r.summary}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      <Toast msg={msg} />
    </div>
  );
}

function Divider() {
  return <div style={{ height: 1, background: "var(--border)", margin: "4px 0" }} />;
}
