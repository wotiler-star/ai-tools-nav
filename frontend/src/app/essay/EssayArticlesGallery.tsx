"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Input, Tag } from "antd";
import { SearchOutlined, EyeOutlined, LikeOutlined, MessageOutlined } from "@ant-design/icons";
import { ESSAY_ARTICLES, type EssayArticle } from "@/lib/essayArticles";
import SafeCover from "@/components/SafeCover";

const BRAND = "#3874F7";
const SORTS = ["推荐", "最新", "热门"] as const;
const TOPICS = ["全部", "AI", "编程", "程序员", "AI编程", "GitHub", "Claude", "DeepSeek", "教程", "职场"];

function formatCount(n: number) { return n >= 10000 ? (n/10000).toFixed(1)+"万" : String(n); }

export default function EssayArticlesGallery() {
  const [sort, setSort] = useState<(typeof SORTS)[number]>("推荐");
  const [topic, setTopic] = useState("全部");
  const [kw, setKw] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 12;

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
          <article key={a.id} className="group hover-brand tool-card" style={{ background: "#fff", borderRadius: 12, overflow: "hidden" }}>
            <Link href={`/essay/${a.id}`} style={{ textDecoration: "none" }}>
              <div style={{ position: "relative", height: 160, overflow: "hidden", background: "#f5f6f8" }}>
                <SafeCover src={a.cover} alt={a.title} className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105" />
              </div>
              <div style={{ padding: 16 }}>
                <h2 style={{ fontSize: 16, fontWeight: 700, margin: "0 0 8px", lineHeight: 1.5 }} className="hover-brand-title">{a.title}</h2>
                <p style={{ fontSize: 13, color: "#6b7280", margin: "0 0 10px", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{a.description}</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 10 }}>
                  {a.tags.slice(0, 4).map((t) => <Tag key={t} color="blue" style={{ margin: 0, fontSize: 11 }}>#{t}</Tag>)}
                </div>
                <div style={{ display: "flex", gap: 14, fontSize: 12, color: "#9ca3af" }}>
                  <span><EyeOutlined /> {formatCount(a.viewCount)}</span>
                  <span><LikeOutlined /> {a.likeNum}</span>
                  <span><MessageOutlined /> {a.commentNum}</span>
                </div>
              </div>
            </Link>
          </article>
        ))}
      </div>
      {shown.length === 0 && <div style={{ textAlign: "center", color: "#9ca3af", padding: 40 }}>暂无匹配文章</div>}

      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 12, marginTop: 28 }}>
        <button type="button" disabled={cur <= 1} onClick={() => setPage(cur - 1)}
          style={{ padding: "6px 16px", borderRadius: 8, border: "1px solid #eaecef", background: "#fff", cursor: cur <= 1 ? "not-allowed" : "pointer", opacity: cur <= 1 ? 0.5 : 1 }}>上一页</button>
        <span style={{ fontSize: 13, color: "#6b7280" }}>第 {cur} / {totalPages} 页 · 共 {list.length} 篇</span>
        <button type="button" disabled={cur >= totalPages} onClick={() => setPage(cur + 1)}
          style={{ padding: "6px 16px", borderRadius: 8, border: "1px solid #eaecef", background: "#fff", cursor: cur >= totalPages ? "not-allowed" : "pointer", opacity: cur >= totalPages ? 0.5 : 1 }}>下一页</button>
      </div>
    </div>
  );
}
