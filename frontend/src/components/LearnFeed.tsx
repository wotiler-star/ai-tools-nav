"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { SearchOutlined } from "@ant-design/icons";
import { LEARN_POSTS } from "@/lib/mockData";

/* ============================================================
 * 学习资源文章流（/resource/learn、/resource/course、/resource/encyclopedia 共用）
 * 一比一复刻 ai.codefather.cn/resource/learn 的结构：
 *  - 两栏：主区（flex） + 侧栏 300px（对标站 md:w-[25%]）
 *  - 主区：h1 标题 + 搜索框 + 文章流（封面图 + 标题(line-clamp-1) + 摘要(line-clamp-2/3) + 作者/时间）
 *  - 侧栏：「推荐教程」列表卡 + 「🔥 热门工具」2 列网格卡 + 广告位
 * 封面本地化自对标站（planet_post_image / post_cover），尺寸对标 213×128(桌面)/107×64(移动)
 * ============================================================ */

interface LearnFeedProps {
  /** 页面 h1 标题，如「AI 学习教程」 */
  title: string;
  /** LEARN_POSTS 的 category 过滤值 */
  category: "tutorial" | "course" | "wiki";
  /** 搜索框占位符 */
  searchPlaceholder: string;
  /** 无封面时的占位 emoji */
  emoji: string;
  /** 侧栏热门卡标题（保留兼容，实际用「推荐教程」） */
  hotTitle: string;
  /** 列表与详情路由基路径：course/encyclopedia 指向各自详情页，避免全部跳 /resource/learn */
  basePath: string;
}

/** 侧栏「🔥 热门工具」2 列网格（logo 本地化自 pic.code-nav.cn，链接到 /tool 列表页） */
const HOT_TOOLS: { name: string; logo: string }[] = [
  { name: "朱雀AI检测", logo: "/resource/tools/zhque.png" },
  { name: "Lovart", logo: "/resource/tools/lovart.png" },
  { name: "WritePass", logo: "/resource/tools/writepass.jpg" },
  { name: "Cursor", logo: "/resource/tools/cursor.webp" },
  { name: "零感AI", logo: "/resource/tools/linggan.webp" },
  { name: "星月写作", logo: "/resource/tools/xingyue.webp" },
  { name: "墨得问题", logo: "/resource/tools/mode.webp" },
  { name: "面多多", logo: "/resource/tools/mianduo.png" },
  { name: "老鱼简历", logo: "/resource/tools/laoyu.png" },
  { name: "朱雀AI检测助手", logo: "/resource/tools/zhque2.jpg" }
];

/** 无封面图时按标题生成稳定渐变色（兜底） */
function coverColor(s: string) {
  let h = 0;
  for (const c of s) h = (h * 31 + c.charCodeAt(0)) % 360;
  return `hsl(${h}, 58%, 60%)`;
}

export default function LearnFeed({
  title,
  category,
  searchPlaceholder,
  emoji,
  hotTitle,
  basePath
}: LearnFeedProps) {
  const [kw, setKw] = useState("");

  const posts = useMemo(
    () => LEARN_POSTS.filter((p) => p.category === category),
    [category]
  );

  const filtered = useMemo(() => {
    const q = kw.trim().toLowerCase();
    if (!q) return posts;
    return posts.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        (p.content || "").toLowerCase().includes(q)
    );
  }, [posts, kw]);

  const hotPosts = useMemo(() => posts.slice(0, 6), [posts]);

  return (
    <div style={{ background: "var(--surface-2)", minHeight: "100vh", padding: "24px 0" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 16px" }}>
        <div className="two-col-row">
          {/* ===== 主区 ===== */}
          <main className="two-col-main">
            {/* 标题 + 搜索 */}
            <section style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <h1 style={{ margin: 0, fontSize: 18, fontWeight: 600, color: "var(--text-1)" }}>
                {title}
              </h1>
              <form
                method="GET"
                onSubmit={(e) => e.preventDefault()}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  background: "var(--surface)",
                  border: "1px solid var(--border)",
                  borderRadius: 6,
                  padding: "4px 8px"
                }}
              >
                <SearchOutlined style={{ color: "var(--text-3)" }} />
                <input
                  name="q"
                  value={kw}
                  onChange={(e) => setKw(e.target.value)}
                  placeholder={searchPlaceholder}
                  style={{
                    outline: "none",
                    border: "none",
                    background: "transparent",
                    minWidth: 0,
                    flex: 1,
                    fontSize: 14,
                    color: "var(--text-1)"
                  }}
                />
              </form>
            </section>

            {/* 文章流 */}
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 12 }}>
              {filtered.length === 0 ? (
                <div
                  style={{
                    background: "var(--surface)",
                    borderRadius: 8,
                    padding: 48,
                    textAlign: "center",
                    color: "var(--text-3)",
                    fontSize: 14
                  }}
                >
                  暂无相关内容
                </div>
              ) : (
                filtered.map((p) => (
                  <Link
                    key={p.id}
                    href={`${basePath}/${p.id}`}
                    className="learn-card-link"
                    style={{ display: "block" }}
                  >
                    <article
                      style={{
                        background: "var(--surface)",
                        borderRadius: 4,
                        padding: 16,
                        display: "flex",
                        gap: 16,
                        alignItems: "flex-start",
                        overflow: "hidden"
                      }}
                    >
                      {/* 封面：对标站 213×128(桌面)/107×64(移动)，灰底占位 */}
                      <div
                        className="learn-cover flex-shrink-0 w-[107px] h-[64px] md:w-[213px] md:h-[128px] overflow-hidden rounded-sm"
                        style={{ background: "var(--surface-2)" }}
                      >
                        {p.cover ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={p.cover}
                            alt={p.title}
                            className="learn-cover-img w-full h-full"
                            loading="lazy"
                          />
                        ) : (
                          <div
                            style={{
                              width: "100%",
                              height: "100%",
                              background: `linear-gradient(135deg, ${coverColor(p.title)}, #ffffff)`,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              color: "#fff",
                              fontSize: 26
                            }}
                          >
                            {emoji}
                          </div>
                        )}
                      </div>
                      <div style={{ minWidth: 0, flex: 1 }}>
                        <h3
                          className="learn-post-title line-clamp-1"
                          style={{
                            margin: 0,
                            fontSize: 18,
                            fontWeight: 600,
                            color: "var(--text-1)",
                            lineHeight: 1.4
                          }}
                        >
                          {p.title}
                        </h3>
                        <p
                          className="learn-excerpt line-clamp-2 md:line-clamp-3"
                          style={{
                            margin: "4px 0 0",
                            fontSize: 14,
                            lineHeight: "22px",
                            color: "var(--text-2)"
                          }}
                        >
                          {p.content}
                        </p>
                        <div
                          style={{
                            marginTop: 6,
                            fontSize: 12,
                            color: "var(--text-3)",
                            display: "flex",
                            gap: 12,
                            flexWrap: "wrap"
                          }}
                        >
                          <span>{p.authorName}</span>
                          <span>{(p.createTime || "").slice(0, 10)}</span>
                        </div>
                      </div>
                    </article>
                  </Link>
                ))
              )}
            </div>
          </main>

          {/* ===== 侧栏 ===== */}
          <aside className="two-col-side">
            {/* 推荐教程 列表卡（对标站 ant-card「推荐教程」+ 更多） */}
            <div
              style={{
                background: "var(--surface)",
                borderRadius: 8,
                marginBottom: 16,
                overflow: "hidden"
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "12px 16px",
                  borderBottom: "1px solid var(--border)"
                }}
              >
                <div style={{ fontWeight: 700, fontSize: 15, color: "var(--text-1)" }}>
                  推荐教程
                </div>
                <Link href={`${basePath}`} style={{ fontSize: 12, color: "var(--text-3)" }}>
                  更多
                </Link>
              </div>
              <div style={{ padding: "4px 0" }}>
                {hotPosts.map((p, i) => (
                  <Link
                    key={p.id}
                    href={`${basePath}/${p.id}`}
                    className="learn-side-item"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      height: 40,
                      padding: "0 16px",
                      borderTop: i ? "1px solid var(--border)" : "none",
                      color: "var(--text-2)",
                      fontSize: 14
                    }}
                  >
                    <span
                      style={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap"
                      }}
                    >
                      {p.title}
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            {/* 热门工具 2 列网格卡（对标站「🔥 热门工具」） */}
            <div
              style={{
                background: "var(--surface)",
                borderRadius: 8,
                marginBottom: 16,
                padding: 16
              }}
            >
              <div
                style={{
                  fontWeight: 700,
                  fontSize: 15,
                  marginBottom: 12,
                  color: "var(--text-1)",
                  display: "flex",
                  alignItems: "center",
                  gap: 6
                }}
              >
                <span>🔥</span>
                <span>热门工具</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                {HOT_TOOLS.map((t) => (
                  <Link
                    key={t.name}
                    href="/tool"
                    className="learn-tool-chip"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      background: "var(--surface-2)",
                      borderRadius: 6,
                      padding: "0 8px",
                      height: 36,
                      color: "var(--text-1)",
                      fontSize: 12
                    }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={t.logo}
                      alt={t.name}
                      style={{
                        width: 20,
                        height: 20,
                        borderRadius: 4,
                        objectFit: "cover",
                        flexShrink: 0
                      }}
                      loading="lazy"
                    />
                    <span
                      style={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap"
                      }}
                    >
                      {t.name}
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            {/* 广告位 */}
            <div
              style={{
                background: "var(--surface)",
                border: "1px dashed var(--border)",
                borderRadius: 12,
                padding: 28,
                textAlign: "center",
                color: "var(--text-3)",
                fontSize: 13,
                marginBottom: 16
              }}
            >
              广告位
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
