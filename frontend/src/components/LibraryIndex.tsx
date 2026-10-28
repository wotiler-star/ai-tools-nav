"use client";

import { useMemo } from "react";
import Link from "next/link";
import { AiColumn, AiColumnCategory } from "@/types";

/* ============================================================
 * /library 知识库 —— 客户端渲染部分。
 * 数据（专栏 columns + 分类 cats）由服务端 library/page.tsx serverGet 后作为 props 注入，
 * 首屏 SSR HTML 即含 Banner/简介 + 全部分类小节与专栏表格（利于 SEO，对齐目标站内容页）。
 * 本站用后端真实数据映射：小节 = 专栏分类（categoryName），表格行 = 该分类下的专栏。
 * ============================================================ */

export default function LibraryIndex({
  columns,
  cats
}: {
  columns: AiColumn[];
  cats: AiColumnCategory[];
}) {
  /** 按分类分组：小节标题 = 分类名，行 = 该分类下的专栏 */
  const sections = useMemo(() => {
    const map = new Map<string, AiColumn[]>();
    columns.forEach((c) => {
      const key = c.categoryName || "知识专栏";
      const arr = map.get(key);
      if (arr) arr.push(c);
      else map.set(key, [c]);
    });
    // 有后端分类时按其顺序排列，其余追加在后
    const ordered: { name: string; items: AiColumn[] }[] = [];
    cats.forEach((cat) => {
      const items = map.get(cat.name);
      if (items && items.length) {
        ordered.push({ name: cat.name, items });
        map.delete(cat.name);
      }
    });
    map.forEach((items, name) => ordered.push({ name, items }));
    return ordered;
  }, [columns, cats]);

  return (
    <div style={{ background: "var(--page-bg)", minHeight: "100vh", padding: "24px 0" }}>
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 16px" }}>
        <article
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: 12,
            padding: 28
          }}
        >
          {/* ===== Banner：🚀 AI 知识库启航 ===== */}
          <div
            style={{
              borderRadius: 12,
              padding: "36px 20px",
              textAlign: "center",
              background: "linear-gradient(135deg, #eef3ff 0%, #f7f9ff 40%, #fdf2fb 100%)",
              marginBottom: 24
            }}
          >
            <div style={{ fontSize: 40, lineHeight: 1 }}>🚀</div>
            <h1 style={{ margin: "12px 0 8px", fontSize: 26, fontWeight: 800, color: "var(--text-1)" }}>
              AI 知识库启航
            </h1>
            <div style={{ fontSize: 18, fontWeight: 700, color: "var(--text-1)" }}>🐟 鱼皮的 AI 知识库</div>
            <div style={{ marginTop: 8, fontSize: 14, color: "var(--text-2)" }}>
              完全免费开放的 AI 知识共享平台 | 减少信息差，让每个人都能享受技术红利
            </div>
          </div>

          {/* ===== 简介 ===== */}
          <p style={{ margin: "0 0 24px", fontSize: 15, lineHeight: 1.9, color: "var(--text-2)" }}>
            汇总整合目前热门的 AI 工具相关信息，包括产品介绍、使用指南、工具测评、技巧分享、应用场景、AI
            变现、行业资讯、教程资源等一系列内容。鱼皮希望带领大家打破 AI
            技术的信息壁垒，让每个人都能平等获取 AI 时代的工具与认知，利用科技让生活更美好。
          </p>

          {/* ===== 🧭 AI 知识库导航 ===== */}
          <h2 style={{ margin: "0 0 16px", fontSize: 22, fontWeight: 800, color: "var(--text-1)" }}>
            🧭 AI 知识库导航
          </h2>

          {sections.length === 0 ? (
            <div style={{ padding: "40px 0", textAlign: "center", color: "var(--text-3)", fontSize: 14 }}>
              暂无知识专栏
            </div>
          ) : (
            sections.map((sec) => (
              <section key={sec.name} style={{ marginBottom: 28 }}>
                <h3 style={{ margin: "0 0 10px", fontSize: 18, fontWeight: 700, color: "var(--text-1)" }}>
                  {sec.name}
                </h3>
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
                    <thead>
                      <tr>
                        <th style={thStyle}>资源</th>
                        <th style={thStyle}>链接</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sec.items.map((c) => (
                        <tr key={c.id}>
                          <td style={tdStyle}>
                            <span style={{ fontWeight: 600, color: "var(--text-1)" }}>{c.title}</span>
                            {c.needVip === 1 && <span style={vipStyle}>会员</span>}
                            {c.description ? (
                              <div
                                style={{
                                  fontSize: 12,
                                  color: "var(--text-3)",
                                  marginTop: 2,
                                  lineHeight: 1.6
                                }}
                              >
                                {c.description}
                              </div>
                            ) : null}
                          </td>
                          <td style={tdStyle}>
                            <Link href={`/library/${c.id}`} className="library-link" style={{ color: "#1777ff" }}>
                              进入专栏
                            </Link>
                            {c.articleCount ? (
                              <span style={{ color: "var(--text-3)", marginLeft: 8 }}>{c.articleCount} 篇</span>
                            ) : null}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            ))
          )}
        </article>
      </div>
    </div>
  );
}

const thStyle: React.CSSProperties = {
  border: "1px solid var(--border)",
  padding: "8px 12px",
  textAlign: "left",
  background: "var(--surface-2)",
  fontWeight: 700,
  color: "var(--text-1)"
};

const tdStyle: React.CSSProperties = {
  border: "1px solid var(--border)",
  padding: "10px 12px",
  verticalAlign: "top",
  color: "var(--text-2)"
};

const vipStyle: React.CSSProperties = {
  marginLeft: 8,
  fontSize: 11,
  color: "#d48806",
  background: "#fffbe6",
  border: "1px solid #ffe58f",
  borderRadius: 4,
  padding: "0 6px"
};
