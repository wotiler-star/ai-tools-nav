import type { Metadata } from "next";
import Link from "next/link";
import { REVIEWS, ReviewItem } from "@/lib/reviews";

/**
 * 原创内容列表（工具实测 / 使用教程 / 对比评测）
 * 独立于对标站结构，用于沉淀本站原创文章，提升内容价值。
 */

export const metadata: Metadata = {
  title: "原创评测与教程",
  description:
    "本站原创的 AI 工具实测、使用教程与对比评测，基于真实使用场景撰写，帮助你快速选型与上手。",
  alternates: { canonical: "/review" }
};

const TYPE_STYLE: Record<ReviewItem["type"], { bg: string; color: string }> = {
  工具实测: { bg: "#eaf1fe", color: "#1777ff" },
  使用教程: { bg: "#eafaf1", color: "#13a463" },
  对比评测: { bg: "#fff7e6", color: "#d48806" }
};

export default function ReviewListPage() {
  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "28px 20px" }}>
      <h1
        style={{
          margin: 0,
          fontSize: 26,
          fontWeight: 700,
          color: "var(--text-1)"
        }}
      >
        原创评测与教程
      </h1>
      <p style={{ margin: "10px 0 24px", color: "var(--text-3)", fontSize: 14 }}>
        本站原创内容，基于真实使用场景撰写：工具实测、使用教程、对比评测。
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {REVIEWS.map((r) => {
          const st = TYPE_STYLE[r.type];
          return (
            <Link
              key={r.slug}
              href={`/review/${r.slug}`}
              className="group hover-brand-lift block rounded-xl bg-white"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <article style={{ padding: 18 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                  <span
                    style={{
                      background: st.bg,
                      color: st.color,
                      fontSize: 12,
                      borderRadius: 4,
                      padding: "2px 8px",
                      fontWeight: 600
                    }}
                  >
                    {r.type}
                  </span>
                  <span style={{ fontSize: 12, color: "var(--text-3)" }}>
                    {r.date} · {r.author}
                  </span>
                </div>

                <h2
                  className="hover-brand-title"
                  style={{
                    margin: 0,
                    fontSize: 18,
                    fontWeight: 700,
                    color: "var(--text-1)",
                    lineHeight: 1.5
                  }}
                >
                  {r.title}
                </h2>

                <p
                  style={{
                    margin: "8px 0 0",
                    fontSize: 14,
                    lineHeight: 1.75,
                    color: "var(--text-2)"
                  }}
                >
                  {r.summary}
                </p>

                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 10 }}>
                  {r.tags.map((t) => (
                    <span key={t} className="chip">
                      #{t}
                    </span>
                  ))}
                </div>
              </article>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
