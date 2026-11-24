"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Input } from "antd";
import { SearchOutlined, EyeOutlined, LikeOutlined, MessageOutlined } from "@ant-design/icons";
import { ESSAY_ARTICLES, type EssayArticle } from "@/lib/essayArticles";
import SafeCover from "@/components/SafeCover";

const BRAND = "#3874F7";
const SORTS = ["推荐", "最新", "热门"] as const;
const TOPICS = ["全部", "AI", "编程", "程序员", "AI编程", "GitHub", "Claude", "DeepSeek", "教程", "职场"];

function formatCount(n: number) { return n >= 10000 ? (n/10000).toFixed(1)+"万" : String(n); }

export default function EssayArticlesGallery({ initialPage = 1 }: { initialPage?: number }) {
  const [sort, setSort] = useState<(typeof SORTS)[number]>("推荐");
  const [topic, setTopic] = useState("全部");
  const [kw, setKw] = useState("");
  const [page, setPage] = useState(initialPage);
  // 首屏直出 30 条（1:1 目标站长列表；667 条真实文章按页切分，SSR 即含 30 张卡）
  const pageSize = 30;

  // 浏览器前进/后退时同步 state（分页用 Link 导航，URL 是唯一真源）
  useEffect(() => {
    const p = Math.max(1, Number(new URLSearchParams(window.location.search).get("page")) || 1);
    setPage(p);
  }, []);

  const pageHref = (p: number) => `/essay?page=${p}`;

  const list = useMemo(() => {
    let arr = [...ESSAY_ARTICLES];
    if (topic !== "全部") arr = arr.filter((a) => a.tags.includes(topic));
    if (kw.trim()) {
      const q = kw.trim();
      arr = arr.filter((a) => a.title.includes(q) || a.description.includes(q) || a.tags.some((t) => t.includes(q)));
    }
    if (sort === "最新") arr.sort((a, b) => b.createTime - a.createTime);
    else if (sort === "热门") arr.sort((a, b) => (b.likeNum + b.viewCount) - (a.likeNum + a.viewCount));
    return arr;
  }, [sort, topic, kw]);

  const totalPages = Math.max(1, Math.ceil(list.length / pageSize));
  const cur = Math.min(page, totalPages);
  const shown = list.slice((cur - 1) * pageSize, cur * pageSize);

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "24px 16px" }}>
      <div style={{ textAlign: "center", marginBottom: 20 }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, marginBottom: 6 }}>
          AI 学习交流<span style={{ color: BRAND }}>社区</span>
        </h1>
        <p style={{ color: "#6b7280" }}>分享最新最有趣的 AI 工具、资源、信息</p>
      </div>

      <div style={{ display: "flex", justifyContent: "center", gap: 8, marginBottom: 14, flexWrap: "wrap" }}>
        {TOPICS.map((t) => (
          <button key={t} type="button" onClick={() => { setTopic(t); setPage(1); }}
            style={{ padding: "5px 14px", borderRadius: 999, fontSize: 13, cursor: "pointer", fontWeight: topic === t ? 700 : 400,
              color: topic === t ? "#fff" : "#4e5969", background: topic === t ? BRAND : "#f5f6f8", border: `1px solid ${topic === t ? BRAND : "transparent"}` }}>
            {t}
          </button>
        ))}
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18, flexWrap: "wrap", gap: 12 }}>
        <div role="tablist" aria-label="文章排序" style={{ display: "flex", gap: 8 }}>
          {SORTS.map((s) => (
            <button key={s} type="button" role="tab" aria-selected={sort === s} onClick={() => { setSort(s); setPage(1); }}
              style={{ padding: "6px 18px", borderRadius: 999, fontSize: 14, cursor: "pointer", fontWeight: sort === s ? 700 : 500,
                color: sort === s ? "#fff" : "#4e5969", background: sort === s ? BRAND : "#fff", border: `1px solid ${sort === s ? BRAND : "#eaecef"}` }}>
              {s}
            </button>
          ))}
        </div>
        <Input allowClear value={kw} onChange={(e) => { setKw(e.target.value); setPage(1); }}
          placeholder="搜索文章" prefix={<SearchOutlined style={{ color: "#bbb" }} />}
          style={{ maxWidth: 300, borderRadius: 999 }} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 18 }}>
        {shown.map((a) => (
          <article key={a.id} className="group hover-brand tool-card" style={{ background: "#fff", borderRadius: 12, overflow: "hidden", display: "flex", flexDirection: "column" }}>
            <Link href={`/essay/${a.id}`} style={{ textDecoration: "none", display: "block" }}>
              <div style={{ position: "relative", height: 160, overflow: "hidden", background: "#f5f6f8" }}>
                <SafeCover src={a.cover} alt={a.title} className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105" />
              </div>
              <div style={{ padding: "16px 16px 0" }}>
                <h2 style={{ fontSize: 16, fontWeight: 700, margin: "0 0 8px", lineHeight: 1.5 }} className="hover-brand-title">{a.title}</h2>
                <p style={{ fontSize: 13, color: "#6b7280", margin: "0 0 10px", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{a.description}</p>
              </div>
            </Link>
            {/* 最佳评论预览：1:1 对齐目标站 div.best-comment（真实采集 bestComment 数据，623 条） */}
            {a.bestComment && (
              <div className="best-comment" style={{
                fontSize: 14, color: "rgba(0,0,0,0.88)", background: "#f8f8f8",
                padding: "3px 24px 3px 8px", margin: "0 16px 10px", borderRadius: 4,
                minHeight: 28, boxSizing: "border-box"
              }}>
                <span style={{ fontWeight: 600 }}>{a.bestComment.user}：</span>
                <span>{a.bestComment.text}</span>
              </div>
            )}
            {/* 话题层：目标站 tag 是 /tag/{tag} 链接（a.tagItem），非纯展示 chip */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, padding: "0 16px 10px" }}>
              {a.tags.slice(0, 5).map((t) => (
                <Link key={t} href={`/tag/${encodeURIComponent(t)}`}
                  style={{ fontSize: 11, color: BRAND, textDecoration: "none", background: "#eef4ff", borderRadius: 4, padding: "2px 8px" }}>#{t}</Link>
              ))}
            </div>
            {/* 作者层：目标站作者头像是 /user/{id} 链接，这里用真实作者数据 + onError 兜底 */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, padding: "0 16px 12px", marginTop: "auto" }}>
              <Link href={`/user/${a.author?.id || ""}`} style={{ display: "flex", alignItems: "center", gap: 6, textDecoration: "none", color: "#4e5969", fontSize: 12, minWidth: 0 }}>
                <img src={a.author?.avatar || ""} alt={a.author?.name || ""} onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
                  style={{ width: 22, height: 22, borderRadius: "50%", objectFit: "cover", background: "#f0f1f3", flexShrink: 0 }} />
                <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{a.author?.name || "佚名"}</span>
              </Link>
              <div style={{ display: "flex", gap: 12, fontSize: 12, color: "#9ca3af", flexShrink: 0 }}>
                <span><EyeOutlined /> {formatCount(a.viewCount)}</span>
                <span><LikeOutlined /> {a.likeNum}</span>
                <span><MessageOutlined /> {a.commentNum}</span>
              </div>
            </div>
          </article>
        ))}
      </div>
      {shown.length === 0 && <div style={{ textAlign: "center", color: "#9ca3af", padding: 40 }}>暂无匹配文章</div>}

      {/* 分页器：全部用 <Link>，每页可爬取；页码窗口 7 个 + 首尾 */}
      <nav aria-label="文章分页" style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 6, marginTop: 28, flexWrap: "wrap" }}>
        <Link href={pageHref(Math.max(1, cur - 1))} aria-disabled={cur <= 1}
          onClick={(e) => { if (cur <= 1) e.preventDefault(); }}
          style={{ padding: "6px 12px", borderRadius: 8, border: "1px solid #eaecef", background: "#fff", color: cur <= 1 ? "#c9cdd4" : "#4e5969", textDecoration: "none", pointerEvents: cur <= 1 ? "none" : "auto" }}>上一页</Link>
        {Array.from({ length: Math.min(7, totalPages) }, (_, i) => {
          const p = Math.min(Math.max(1, cur - 3) + i, totalPages);
          return (
            <Link key={p} href={pageHref(p)} aria-current={p === cur ? "page" : undefined}
              onClick={(e) => { e.preventDefault(); setPage(p); }}
              style={{ minWidth: 32, textAlign: "center", padding: "6px 10px", borderRadius: 8, fontSize: 13, textDecoration: "none",
                border: `1px solid ${p === cur ? BRAND : "#eaecef"}`, background: p === cur ? BRAND : "#fff", color: p === cur ? "#fff" : "#4e5969" }}>
              {p}
            </Link>
          );
        })}
        <Link href={pageHref(Math.min(totalPages, cur + 1))} aria-disabled={cur >= totalPages}
          onClick={(e) => { if (cur >= totalPages) e.preventDefault(); }}
          style={{ padding: "6px 12px", borderRadius: 8, border: "1px solid #eaecef", background: "#fff", color: cur >= totalPages ? "#c9cdd4" : "#4e5969", textDecoration: "none", pointerEvents: cur >= totalPages ? "none" : "auto" }}>下一页</Link>
        <span style={{ fontSize: 13, color: "#6b7280", marginLeft: 8 }}>第 {cur} / {totalPages} 页 · 共 {list.length} 篇</span>
      </nav>
    </div>
  );
}
