import Link from "next/link";
import { Tag } from "antd";
import { FireFilled } from "@ant-design/icons";
import { AI_NEWS } from "@/lib/mockData";
import type { NewsItem } from "@/types";
import { serverFetch, type PageResult } from "@/lib/serverApi";
import NewsCalendar from "./NewsCalendar";

// 首页改为动态渲染：服务端直连后端实时取数（ai_news），失败回退 mock，保证首屏完整且不整页崩溃。
export const dynamic = "force-dynamic";

const BRAND = "#3874F7";

/** 后端 ai_news 记录 → 前端 NewsItem（rank 由 sort 映射；source/viewNum 用真实字段） */
function normNews(raw: any[] | undefined, fallback: NewsItem[]): NewsItem[] {
  if (raw && raw.length) {
    return raw.map((n, i) => ({
      id: n.id,
      rank: typeof n.sort === "number" && n.sort > 0 ? n.sort : i + 1,
      title: n.title,
      hot: !!n.hot,
      content: n.content,
      summary: n.summary,
      createTime: n.createTime,
      source: n.source,
      viewNum: n.viewNum
    }));
  }
  return fallback;
}

export default async function NewsPage() {
  const raw = await serverFetch<PageResult<any>>("/ai_news/list/page", {
    current: 1,
    pageSize: 50
  });
  const news: NewsItem[] = normNews(raw?.records, AI_NEWS as NewsItem[]);

  return (
    <div style={{ maxWidth: 1120, margin: "0 auto", padding: "24px 16px" }}>
      <div style={{ display: "flex", gap: 20, alignItems: "flex-start" }}>
        {/* 左侧：资讯列表（服务端实时渲染真实数据） */}
        <section style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
            <h1 style={{ fontSize: 22, fontWeight: 800, margin: 0 }}>AI 资讯 · 行业动态</h1>
            <Tag color="blue">
              {new Date().toLocaleDateString("zh-CN", { month: "long", day: "numeric" })}
            </Tag>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {news.map((n) => (
              <Link
                key={n.id}
                href={`/news/${n.id}`}
                className="group hover-brand tool-card block bg-white"
                style={{
                  borderRadius: 12,
                  padding: 16,
                  cursor: "pointer"
                }}
              >
                <article style={{ display: "flex", gap: 14, width: "100%" }}>
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: 8,
                      flexShrink: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 800,
                      fontSize: 14,
                      color: "#fff",
                      background: n.rank <= 3 ? "#ff4d4f" : "#c9cdd4"
                    }}
                  >
                    {n.rank}
                  </div>
                  <div style={{ minWidth: 0, flex: 1 }}>
                    {/* 语义化标题：对齐目标站逐项 heading，提升 SEO/可访问性 */}
                    <h2 style={{ fontSize: 16, fontWeight: 600, margin: "0 0 8px", lineHeight: 1.5 }} className="hover-brand-title">
                      {n.title}
                      {n.hot && <FireFilled style={{ color: "#ff4d4f", marginLeft: 8 }} />}
                    </h2>
                    <div style={{ fontSize: 12, color: "#9ca3af", display: "flex", gap: 14, flexWrap: "wrap" }}>
                      <span>{n.source || "AI 资讯"}</span>
                      {n.createTime ? <span>{String(n.createTime).slice(5, 16)}</span> : null}
                      {typeof n.viewNum === "number" && <span>热度 {n.viewNum.toLocaleString()}</span>}
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </section>

        {/* 右侧：日期查询（交互组件，单独 client island） */}
        <NewsCalendar />
      </div>
    </div>
  );
}
