"use client";

// /essay 详情页：用 craft-anything 采集的真实全文（content），对齐目标站 /post/{id} 结构。
// 列表 666 条 + /post/{id} 详情全文；无 content 时回退 description，不编造段落。
import Link from "next/link";
import { Tag } from "antd";
import { EyeOutlined, LikeOutlined, MessageOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { ESSAY_ARTICLES, type EssayArticle } from "@/lib/essayArticles";
import SafeCover from "@/components/SafeCover";

const BRAND = "#3874F7";

function formatCount(n: number) {
  return n >= 10000 ? (n / 10000).toFixed(1) + "万" : String(n || 0);
}

function formatTime(ts: number) {
  if (!ts) return "";
  try {
    const d = new Date(ts);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  } catch { return ""; }
}

function related(article: EssayArticle): EssayArticle[] {
  return ESSAY_ARTICLES.filter((a) => a.id !== article.id)
    .map((a) => ({ a, score: a.tags.filter((t) => article.tags.includes(t)).length }))
    .sort((x, y) => y.score - x.score || y.a.viewCount - x.a.viewCount)
    .slice(0, 8)
    .map((x) => x.a);
}

export interface PostDetail {
  content?: string;
  author?: string;
  publishTime?: string;
}

export default function EssayArticleDetail({ article, detail }: { article: EssayArticle; detail: PostDetail }) {
  const rel = related(article);
  // 正文：优先真实全文 content，按换行分段；无全文时回退摘要
  const paragraphs = (detail.content || article.description || "")
    .split("\n")
    .map((p) => p.trim())
    .filter(Boolean);
  // 目录：取前若干短段落作为锚点概览（对齐目标站「目录」区）
  const headings = paragraphs.filter((p) => p.length <= 30).slice(0, 8);

  return (
    <div style={{ maxWidth: 960, margin: "0 auto", padding: "24px 16px 64px" }}>
      <Link href="/essay" style={{ color: BRAND, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6, marginBottom: 18, fontSize: 14 }}>
        <ArrowLeftOutlined /> 返回文章列表
      </Link>

      <article style={{ background: "#fff", borderRadius: 14, overflow: "hidden", border: "1px solid #eaecef" }}>
        {article.cover && <div style={{ height: 300, background: "#f5f6f8", overflow: "hidden" }}>
          <SafeCover src={article.cover} alt={article.title} className="h-full w-full object-cover" />
        </div>}
        <div style={{ padding: "28px 32px 32px" }}>
          <h1 style={{ fontSize: 28, fontWeight: 800, lineHeight: 1.4, margin: "0 0 16px", color: "#1f2937" }}>{article.title}</h1>

          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
            <span style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg,#3b82f6,#6366f1)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700 }}>{(detail.author || "鱼")[0]}</span>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: "#374151" }}>{detail.author || "程序员鱼皮"}</div>
              <div style={{ fontSize: 12, color: "#9ca3af" }}>{detail.publishTime || formatTime(article.createTime)} · 阅读 {formatCount(article.viewCount)}</div>
            </div>
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 18 }}>
            {article.tags.map((t) => <Tag key={t} color="blue" style={{ margin: 0, fontSize: 12 }}>#{t}</Tag>)}
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 18, fontSize: 13, color: "#9ca3af", paddingBottom: 18, borderBottom: "1px solid #f0f1f3" }}>
            <span><EyeOutlined /> {formatCount(article.viewCount)} 浏览</span>
            <span><LikeOutlined /> {formatCount(article.likeNum)} 点赞</span>
            <span><MessageOutlined /> {formatCount(article.commentNum)} 评论</span>
          </div>

          {/* 目录 */}
          {headings.length > 1 && (
            <div style={{ margin: "22px 0", padding: "14px 18px", background: "#f8fafc", borderRadius: 10, borderLeft: `3px solid ${BRAND}` }}>
              <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 8 }}>目录</div>
              <ol style={{ margin: 0, paddingLeft: 20, fontSize: 13, color: "#64748b", lineHeight: 1.9 }}>
                {headings.map((h, i) => <li key={i}>{h}</li>)}
              </ol>
            </div>
          )}

          {/* 正文（真实全文，逐段渲染） */}
          <div style={{ marginTop: 22, fontSize: 16, lineHeight: 1.9, color: "#374151" }}>
            {paragraphs.map((p, i) => <p key={i} style={{ margin: "0 0 18px" }}>{p}</p>)}
          </div>
        </div>
      </article>

      {rel.length > 0 && (
        <section style={{ marginTop: 32 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16, paddingLeft: 10, borderLeft: `3px solid ${BRAND}` }}>🔥 热门文章</h2>
          <ol style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gap: 10 }}>
            {rel.map((a, i) => (
              <li key={a.id}>
                <Link href={`/essay/${a.id}`} style={{ display: "flex", alignItems: "center", gap: 12, textDecoration: "none", background: "#fff", borderRadius: 10, padding: "10px 14px", border: "1px solid #eaecef" }}>
                  <span style={{ width: 22, height: 22, borderRadius: 6, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "#fff", background: i < 3 ? "#ff4d4f" : "#c9cdd4" }}>{i + 1}</span>
                  <span style={{ fontSize: 14, color: "#1f2937", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{a.title}</span>
                  <span style={{ marginLeft: "auto", fontSize: 12, color: "#9ca3af", flexShrink: 0 }}>{formatCount(a.viewCount)}</span>
                </Link>
              </li>
            ))}
          </ol>
        </section>
      )}
    </div>
  );
}
