"use client";

import { useMemo, useState } from "react";
import { SearchOutlined, QuestionCircleOutlined } from "@ant-design/icons";

/* ============================================================
 * 「发现…」目录页通用组件 —— 一比一复刻 ai.codefather.cn 的 /mcp、/skills
 * 目标站 DOM（已取证）：
 *   <div class="text-center mt-8">
 *     <h1 class="text-3xl font-semibold text-slate-900">发现全球好用的 MCP 服务器</h1>
 *     <p  class="my-4 text-muted-foreground text-lg">持续更新优质 MCP，重塑你的 AI 工作流</p>
 *   <form class="flex items-center gap-2 bg-white rounded-full ring-1 ring-slate-200 px-4 pr-2 h-10 w-full max-w-[600px]">
 *     <span class="text-primary text-xl">🔍</span><input placeholder="搜索 MCP">
 *   单行分类 Chip（text-slate-700 border-slate-200 hover:bg-slate-50）
 *   <div class="w-full grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-3">
 * 与 MockCatalog 的区别：**不做按分类分块**（无小标题/子标签行/全部>），
 * 而是「单行 Chip 过滤 + 单一卡片网格」，与目标站一致。
 * ============================================================ */

const BRAND = "#1777ff";

export interface CatalogItem {
  id: number;
  name: string;
  description: string;
  category: string;
  tag?: string;
  url?: string;
  logo?: string; // 品牌 logo（存在则卡片左上角渲染真实图标，否则回退通用图标）
}

interface DiscoverCatalogProps {
  heroTitle: string;
  heroSubtitle: string;
  categories: string[];
  items: CatalogItem[];
  /** 渲染单张卡片（含外层 <a>/<Link>） */
  renderCard: (item: CatalogItem) => React.ReactNode;
  /** 空状态文案 */
  placeholder?: string;
  /** 搜索框占位符 */
  searchPlaceholder?: string;
  /** 数据加载中：仅内容区 spinner，Hero 照常渲染（避免首屏白闪） */
  loading?: boolean;
  /** 页脚「常见问题」区块（对齐目标站 /mcp、/skills 等目录页底部 FAQ） */
  faq?: { q: string; a: string }[];
}

export default function DiscoverCatalog({
  heroTitle,
  heroSubtitle,
  categories,
  items,
  renderCard,
  placeholder = "没有找到相关内容",
  searchPlaceholder = "搜索",
  loading = false,
  faq
}: DiscoverCatalogProps) {
  const [kw, setKw] = useState("");
  const [activeCat, setActiveCat] = useState("全部");

  const filtered = useMemo(() => {
    let list = items;
    if (activeCat !== "全部") list = list.filter((i) => i.category === activeCat);
    const q = kw.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (i) =>
          i.name.toLowerCase().includes(q) ||
          (i.description || "").toLowerCase().includes(q) ||
          (i.tag || "").toLowerCase().includes(q)
      );
    }
    return list;
  }, [items, activeCat, kw]);

  return (
    <div style={{ background: "var(--page-bg)", minHeight: "100vh" }}>
      {/* 网格：1 列 → md 3 列 → xl 4 列，gap 12（对齐目标站 grid-cols-1/3/4 gap-3） */}
      <style>{`
        .disc-grid{display:grid;grid-template-columns:repeat(1,minmax(0,1fr));gap:12px}
        @media(min-width:768px){.disc-grid{grid-template-columns:repeat(3,minmax(0,1fr))}}
        @media(min-width:1280px){.disc-grid{grid-template-columns:repeat(4,minmax(0,1fr))}}
        .faq-grid{display:grid;grid-template-columns:repeat(1,minmax(0,1fr));gap:16px}
        @media(min-width:768px){.faq-grid{grid-template-columns:repeat(2,minmax(0,1fr));gap:24px 32px}}
      `}</style>

      {/* ===== Hero ===== */}
      <div style={{ maxWidth: 1312, margin: "0 auto", padding: "0 16px" }}>
        <div style={{ textAlign: "center", marginTop: 32 }}>
          <h1
            style={{
              margin: 0,
              fontSize: 30,
              fontWeight: 600,
              color: "#0f172a",
              lineHeight: "36px"
            }}
          >
            {heroTitle}
          </h1>
          <p style={{ margin: "16px 0", fontSize: 18, color: "var(--text-3)" }}>
            {heroSubtitle}
          </p>
        </div>

        {/* 胶囊搜索框（白底 ring + 品牌蓝图标） */}
        <form
          method="get"
          onSubmit={(e) => e.preventDefault()}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            background: "#fff",
            border: "1px solid var(--border)",
            borderRadius: 9999,
            padding: "0 8px 0 16px",
            height: 40,
            maxWidth: 600,
            margin: "0 auto"
          }}
        >
          <SearchOutlined style={{ color: BRAND, fontSize: 18, flexShrink: 0 }} />
          <input
            value={kw}
            onChange={(e) => setKw(e.target.value)}
            placeholder={searchPlaceholder}
            aria-label={searchPlaceholder}
            style={{
              flex: 1,
              minWidth: 0,
              border: "none",
              outline: "none",
              background: "transparent",
              fontSize: 14,
              color: "var(--text-1)"
            }}
          />
        </form>

        {/* ===== 单行分类 Chip ===== */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 8,
            justifyContent: "center",
            marginTop: 24
          }}
        >
          {["全部", ...categories].map((c) => {
            const active = activeCat === c;
            return (
              <button
                key={c}
                type="button"
                onClick={() => setActiveCat(c)}
                style={{
                  padding: "4px 12px",
                  borderRadius: 9999,
                  border: active ? `1px solid ${BRAND}` : "1px solid var(--border)",
                  background: active ? BRAND : "var(--surface)",
                  color: active ? "#fff" : "var(--text-2)",
                  fontSize: 13,
                  lineHeight: 1.7,
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  transition: "all .15s"
                }}
              >
                {c}
              </button>
            );
          })}
        </div>
      </div>

      {/* ===== 卡片网格 ===== */}
      <div style={{ maxWidth: 1312, margin: "24px auto 60px", padding: "0 16px" }}>
        {loading ? (
          <div style={{ padding: "60px 0", textAlign: "center" }}>
            <span className="spinner" />
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: "60px 0", textAlign: "center", color: "var(--text-3)", fontSize: 14 }}>
            {placeholder}
          </div>
        ) : (
          <div className="disc-grid">{filtered.map((it) => renderCard(it))}</div>
        )}
      </div>

      {/* ===== 常见问题（对齐目标站目录页底部 FAQ） ===== */}
      {faq && faq.length > 0 && (
        <section style={{ maxWidth: 1312, margin: "0 auto", padding: "0 16px 64px" }}>
          <h2
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              margin: "0 0 24px",
              fontSize: 24,
              fontWeight: 700,
              color: "#0f172a",
              lineHeight: "32px"
            }}
          >
            <QuestionCircleOutlined style={{ color: BRAND, fontSize: 22 }} />
            常见问题
          </h2>
          <div className="faq-grid">
            {faq.map((item, idx) => (
              <div
                key={idx}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                  background: "#fff",
                  border: "1px solid var(--border)",
                  borderRadius: 12,
                  padding: 20
                }}
              >
                <h3
                  style={{
                    margin: 0,
                    fontSize: 18,
                    fontWeight: 700,
                    color: "#1f2937",
                    lineHeight: 1.4
                  }}
                >
                  {idx + 1}. {item.q}
                </h3>
                <p style={{ margin: 0, fontSize: 15, color: "#4e5969", lineHeight: 1.6 }}>
                  {item.a}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
