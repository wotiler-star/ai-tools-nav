import Link from "next/link";
import ToolCard from "@/components/ToolCard";
import type { AiTool, Category } from "@/types";

/**
 * 工具卡网格（服务端组件，SSR 直出全部卡片，SEO 友好）。
 * - 默认视图（无筛选参数）全量渲染，HTML 首屏即含所有 /tool/{id} 链接。
 * - 带筛选参数（keyword / cat / tag）时，服务端按条件隐藏不匹配卡片（display:none），
 *   仍保留在 DOM 中，便于搜索引擎收录，也避免客户端水合抖动。
 * - 每张卡外层 <div data-tool-card data-cat data-tags data-search> 供客户端（如需要）做增量过滤/高亮。
 */

const sectionHeaderStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  marginBottom: 10
};

const sectionTitleStyle: React.CSSProperties = {
  fontSize: 20,
  fontWeight: 800,
  margin: 0,
  color: "var(--text-1)",
  display: "flex",
  alignItems: "center"
};

const gridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
  gap: 12
};

export default function ToolGrid({
  tools,
  categories,
  keyword = "",
  activeCat = 0,
  activeTag = ""
}: {
  tools: AiTool[];
  categories: Category[];
  keyword?: string;
  activeCat?: number;
  activeTag?: string;
}) {
  const kw = keyword.trim().toLowerCase();

  const groups = categories
    .map((c) => ({
      cat: c,
      items: tools.filter((t) => t.categoryId === c.id)
    }))
    .filter((g) => g.items.length > 0);

  return (
    <div>
      {groups.map(({ cat, items }) => {
        const tagChips =
          cat.cloudCount && cat.cloudCount > 0
            ? (cat.tags || []).slice(0, cat.cloudCount)
            : cat.tags || [];

        return (
          <section
            key={cat.id}
            id={`cat-${cat.id}`}
            style={{ marginBottom: 36, scrollMarginTop: "var(--cat-top, 96px)" }}
          >
            <div style={sectionHeaderStyle}>
              <h2 style={sectionTitleStyle}>{cat.name}</h2>
              <Link
                href={`/tool?keyword=${encodeURIComponent(cat.name)}`}
                style={{
                  color: "var(--text-2)",
                  fontSize: 13,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 2
                }}
              >
                全部 <span aria-hidden>›</span>
              </Link>
            </div>

            {tagChips.length > 0 && (
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 4,
                  marginBottom: 10,
                  padding: "6px 10px",
                  border: "1px solid var(--chip-border)",
                  borderRadius: 8,
                  background: "var(--surface)",
                  alignItems: "center"
                }}
              >
                {tagChips.map((t) => {
                  const active = activeTag === t && activeCat === cat.id;
                  return (
                    <Link
                      key={t}
                      href={`/tool?cat=${cat.id}&tag=${encodeURIComponent(t)}`}
                      style={{
                        padding: "3px 10px",
                        borderRadius: 4,
                        border: active
                          ? `1px solid ${"#3874F7"}`
                          : "1px solid transparent",
                        background: active ? "var(--brand-tint)" : "transparent",
                        color: active ? "#3874F7" : "var(--text-2)",
                        fontSize: 13,
                        whiteSpace: "nowrap"
                      }}
                    >
                      {t}
                    </Link>
                  );
                })}
              </div>
            )}

            <div style={gridStyle}>
              {items.map((tool) => {
                const haystack = `${tool.name} ${tool.description} ${(
                  tool.tags || []
                ).join(" ")}`.toLowerCase();
                const matchKw = !kw || haystack.includes(kw);
                const matchCat = activeCat === 0 || tool.categoryId === activeCat;
                const matchTag = !activeTag || (tool.tags || []).includes(activeTag);
                const visible = matchKw && matchCat && matchTag;
                return (
                  <div
                    key={tool.id}
                    data-tool-card="1"
                    data-cat={tool.categoryId}
                    data-tags={(tool.tags || []).join("|")}
                    data-search={haystack}
                    style={{ display: visible ? "" : "none" }}
                  >
                    <ToolCard tool={tool} />
                  </div>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}
