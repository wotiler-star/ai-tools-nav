"use client";

// /essay 详情页：直接用 craft-anything 采集的 666 条真实文章数据（ESSAY_ARTICLES）
// 旧实现走 /ai_post/get 后端（社区帖表），19 位真实文章 id 查不到 → 标题/正文全兜底、列表→详情断链。
// 本组件只展示采集到的真实字段；数据无全文正文，摘要即正文，不编造 extra 内容。
import Link from "next/link";
import { Tag } from "antd";
import {
  EyeOutlined,
  LikeOutlined,
  MessageOutlined,
  ArrowLeftOutlined
} from "@ant-design/icons";
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
  } catch {
    return "";
  }
}

function related(article: EssayArticle): EssayArticle[] {
  const scored = ESSAY_ARTICLES.filter((a) => a.id !== article.id).map((a) => ({
    a,
    score: a.tags.filter((t) => article.tags.includes(t)).length
  }));
  return scored
    .sort((x, y) => y.score - x.score || y.a.likeNum - x.a.likeNum)
    .slice(0, 4)
    .map((x) => x.a);
}

export default function EssayArticleDetail({ article }: { article: EssayArticle }) {
  const rel = related(article);

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "24px 16px 64px" }}>
      <Link href="/essay" style={{ color: BRAND, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6, marginBottom: 18, fontSize: 14 }}>
        <ArrowLeftOutlined /> 返回文章列表
      </Link>

      <article style={{ background: "#fff", borderRadius: 14, overflow: "hidden", border: "1px solid #eaecef" }}>
        <div style={{ height: 300, background: "#f5f6f8", overflow: "hidden" }}>
          <SafeCover src={article.cover} alt={article.title} className="h-full w-full object-cover" />
        </div>
        <div style={{ padding: "28px 32px 32px" }}>
          <h1 style={{ fontSize: 26, fontWeight: 800, lineHeight: 1.4, margin: "0 0 14px" }}>{article.title}</h1>

          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 8, marginBottom: 18 }}>
            {article.tags.map((t) => (
              <Tag key={t} color="blue" style={{ margin: 0, fontSize: 12 }}>#{t}</Tag>
            ))}
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 18, fontSize: 13, color: "#9ca3af", paddingBottom: 18, borderBottom: "1px solid #f0f1f3" }}>
            {formatTime(article.createTime) && <span>{formatTime(article.createTime)}</span>}
            <span><EyeOutlined /> {formatCount(article.viewCount)} 浏览</span>
            <span><LikeOutlined /> {formatCount(article.likeNum)} 点赞</span>
            <span><MessageOutlined /> {formatCount(article.commentNum)} 评论</span>
          </div>

          {/* 真实数据只有摘要（≤200字），摘要即正文；不合成虚构段落 */}
          <div style={{ marginTop: 22, fontSize: 16, lineHeight: 1.9, color: "#374151", whiteSpace: "pre-wrap" }}>
            {article.description || "（该文章暂无详细摘要）"}
          </div>
        </div>
      </article>

      {rel.length > 0 && (
        <section style={{ marginTop: 32 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16, paddingLeft: 10, borderLeft: `3px solid ${BRAND}` }}>相关文章</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 14 }}>
            {rel.map((a) => (
              <Link key={a.id} href={`/essay/${a.id}`} style={{ textDecoration: "none", background: "#fff", borderRadius: 10, overflow: "hidden", border: "1px solid #eaecef" }}>
                <div style={{ height: 100, background: "#f5f6f8", overflow: "hidden" }}>
                  <SafeCover src={a.cover} alt={a.title} className="h-full w-full object-cover" />
                </div>
                <div style={{ padding: 12 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, lineHeight: 1.5, color: "#1f2937", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{a.title}</div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
