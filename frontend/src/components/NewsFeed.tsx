"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Calendar } from "antd";
import type { Dayjs } from "dayjs";
import { AiTool, AiPost, NewsItem } from "@/types";

/* ============================================================
 * /news 资讯列表客户端组件 —— 由服务端 news/page.tsx 注入 mock 数据（SSR 首屏即含内容）。
 * 结构（与目标站 ai.codefather.cn/news 一致）：
 *   两栏 [左：Hero Banner 图 /news_banner.webp + 按日期分组的时间线 |
 *         右 300px：指定日期查询日历 + 🔥热门工具 + 🔥热门文章]
 *  - 数据由 props 直接驱动（不再走 useSWR），首屏 HTML 即含资讯时间线与侧栏热门。
 * ============================================================ */

const BRAND = "#1777ff";
const WEEK = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];

/** 取 YYYY-MM-DD 分组键（兼容 ISO 与空格分隔两种时间格式） */
function toDateKey(v?: string): string {
  if (!v) return "";
  let d = new Date(v);
  if (isNaN(d.getTime())) d = new Date(v.replace(" ", "T"));
  if (isNaN(d.getTime())) return "";
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

/** 分组标题：9月10日 · 周四 */
function dateLabel(key: string): string {
  const d = new Date(`${key}T00:00:00`);
  return `${d.getMonth() + 1}月${d.getDate()}日 · ${WEEK[d.getDay()]}`;
}

/** 摘要：优先 summary，回退正文，再空则占位 */
function excerptOf(n: NewsItem): string {
  return (n.summary || n.content || "").replace(/\s+/g, " ").trim() || "（暂无摘要）";
}

export default function NewsFeed({
  news,
  tools,
  posts
}: {
  news: NewsItem[];
  tools: AiTool[];
  posts: AiPost[];
}) {
  const list = news;

  /** 热门工具：取热度最高的 10 个 */
  const hotTools = useMemo(
    () => [...tools].sort((a, b) => (b.heat ?? 0) - (a.heat ?? 0)).slice(0, 10),
    [tools]
  );

  /** 热门文章：按阅读量倒序取 10 篇 */
  const hotPosts = useMemo(
    () => [...posts].sort((a, b) => (b.viewNum ?? 0) - (a.viewNum ?? 0)).slice(0, 10),
    [posts]
  );

  /** 选中日期（YYYY-MM-DD），为空表示不过滤 */
  const [selected, setSelected] = useState<string>("");

  /** 按日期分组，最新日期在前 */
  const groups = useMemo(() => {
    const map = new Map<string, NewsItem[]>();
    list.forEach((n) => {
      const k = toDateKey(n.createTime);
      if (!k) return;
      const arr = map.get(k);
      if (arr) arr.push(n);
      else map.set(k, [n]);
    });
    return Array.from(map.entries()).sort((a, b) => b[0].localeCompare(a[0]));
  }, [list]);

  const shownGroups = useMemo(
    () => (selected ? groups.filter(([k]) => k === selected) : groups),
    [groups, selected]
  );

  const onSelectDate = (d: Dayjs) => {
    const key = d.format("YYYY-MM-DD");
    // 再次点击同一天 → 取消筛选，回到全部
    setSelected((prev) => (prev === key ? "" : key));
  };

  return (
    <div style={{ background: "var(--page-bg)", minHeight: "100vh", padding: "24px 0" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 16px" }}>
        <div className="news-row">
          {/* ===== 主区：Hero Banner + 按日期分组的时间线 ===== */}
          <main className="news-main">
            {/* Banner 图（与目标站同源图 /images/news_banner.webp） */}
            <section
              style={{
                background: "var(--surface)",
                borderRadius: 6,
                overflow: "hidden",
                marginBottom: 24
              }}
            >
              <img
                src="/images/news_banner.webp"
                alt="鱼皮AI导航每日AI资讯"
                draggable={false}
                style={{ display: "block", width: "100%", aspectRatio: "4 / 1", objectFit: "cover" }}
              />
            </section>

            {shownGroups.length === 0 ? (
              <div
                style={{
                  background: "var(--surface)",
                  border: "1px solid var(--border)",
                  borderRadius: 8,
                  padding: 48,
                  textAlign: "center",
                  color: "var(--text-3)",
                  fontSize: 14
                }}
              >
                {selected ? "该日期暂无资讯" : "暂无资讯"}
              </div>
            ) : (
              shownGroups.map(([key, items]) => (
                <section key={key} style={{ marginBottom: 24 }}>
                  {/* 日期分组头 */}
                  <h3
                    style={{
                      fontSize: 18,
                      fontWeight: 600,
                      color: BRAND,
                      margin: "0 0 12px"
                    }}
                  >
                    {dateLabel(key)}
                  </h3>

                  {/* 该日资讯列表 */}
                  <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    {items.map((n) => (
                      <div key={n.id} style={{ position: "relative", paddingLeft: 24 }}>
                        {/* 时间线圆点 */}
                        <span
                          style={{
                            position: "absolute",
                            left: 8,
                            top: 12,
                            width: 12,
                            height: 12,
                            borderRadius: "50%",
                            border: `2px solid ${BRAND}`,
                            background: "#fff",
                            transform: "translateX(-50%)"
                          }}
                        />
                        <Link
                          href={`/news/${n.id}`}
                          target="_blank"
                          rel="noreferrer"
                          style={{ display: "block" }}
                        >
                          <article
                            style={{
                              background: "var(--surface)",
                              border: "1px solid var(--border)",
                              borderRadius: 2,
                              padding: 16
                            }}
                          >
                            <h4
                              style={{
                                margin: 0,
                                fontSize: 16,
                                fontWeight: 600,
                                color: "var(--text-1)",
                                lineHeight: 1.5
                              }}
                            >
                              {n.title}
                            </h4>
                            <p
                              style={{
                                margin: "4px 0 0",
                                fontSize: 14,
                                lineHeight: "22px",
                                color: "var(--text-2)",
                                display: "-webkit-box",
                                WebkitBoxOrient: "vertical",
                                WebkitLineClamp: 3,
                                overflow: "hidden"
                              }}
                            >
                              {excerptOf(n)}
                            </p>
                          </article>
                        </Link>
                      </div>
                    ))}
                  </div>
                </section>
              ))
            )}
          </main>

          {/* ===== 侧栏 300px ===== */}
          <aside className="news-side">
            {/* 根据指定日期查询 */}
            <div
              style={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: 8,
                padding: 8,
                marginBottom: 16
              }}
            >
              <h2
                style={{
                  margin: "0 0 8px",
                  fontSize: 16,
                  fontWeight: 600,
                  color: "var(--text-1)"
                }}
              >
                根据指定日期查询 AI资讯
              </h2>
              <Calendar fullscreen={false} onSelect={onSelectDate} />
              {selected && (
                <button
                  onClick={() => setSelected("")}
                  style={{
                    marginTop: 8,
                    width: "100%",
                    border: "none",
                    background: "transparent",
                    color: BRAND,
                    fontSize: 13,
                    cursor: "pointer"
                  }}
                >
                  查看全部日期
                </button>
              )}
            </div>

            {/* 🔥 热门工具（2 列图标网格） */}
            <div
              style={{
                background: "var(--surface)",
                borderRadius: 8,
                padding: 16,
                marginBottom: 16
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  fontWeight: 700,
                  fontSize: 16,
                  color: "var(--text-1)",
                  marginBottom: 8
                }}
              >
                <span>🔥</span>
                <span>热门工具</span>
              </div>
              <div className="news-tools-grid">
                {(hotTools.length ? hotTools : []).map((t) => (
                  <Link
                    key={t.id}
                    href={`/tool/${t.id}`}
                    className="news-tool-item"
                    title={t.name}
                  >
                    {t.logo ? (
                      <img src={t.logo} alt={t.name} className="news-tool-icon" />
                    ) : (
                      <span className="news-tool-icon news-tool-icon--ph">
                        {t.name.slice(0, 1)}
                      </span>
                    )}
                    <span className="news-tool-name">{t.name}</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* 🔥 热门文章（序号 + 单行标题） */}
            <div
              style={{
                background: "var(--surface)",
                borderRadius: 8,
                padding: "0 8px 8px"
              }}
            >
              <div
                style={{
                  padding: "16px 16px 8px",
                  fontWeight: 700,
                  fontSize: 16,
                  color: "var(--text-1)"
                }}
              >
                🔥 热门文章
              </div>
              <div>
                {hotPosts.map((p, i) => (
                  <Link
                    key={p.id}
                    href={`/post/${p.id}`}
                    className="news-hot-article"
                  >
                    <span className="news-hot-rank">{i + 1}</span>
                    <span className="news-hot-title">{p.title}</span>
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
