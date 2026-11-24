import Link from "next/link";
import ToolCard from "@/components/ToolCard";
import type { AiTool, Category } from "@/types";
import { getSectionTabs } from "@/lib/toolCatalogAlign";

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
  // 1:1 对齐目标站（fnd_L10）：网格 gap 16px；6 列由 .tool-grid CSS 断点控制
  gap: 16
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
  const tag = activeTag.trim();

  // 卡片是否匹配当前筛选（与下方渲染共用，保证「分组可见性」与「卡片可见性」一致）
  const isVisible = (t: AiTool) => {
    const haystack = `${t.name} ${t.description} ${(t.tags || []).join(" ")}`.toLowerCase();
    const matchKw = !kw || haystack.includes(kw);
    const matchCat = activeCat === 0 || t.categoryId === activeCat;
    const matchTag = !tag || (t.tags || []).includes(tag);
    return matchKw && matchCat && matchTag;
  };

  // 分组收敛：选中 cat 时只渲染该分类分区；keyword/tag 筛选时跳过没有任何可见卡片的分区。
  // 修复 ?cat=N 时顶部 tab 高亮正确、正文却仍列出全部分区标题+空卡片的 bug。
  const groups = categories
    .filter((c) => activeCat === 0 || c.id === activeCat)
    .map((c) => ({
      cat: c,
      items: tools.filter((t) => t.categoryId === c.id)
    }))
    .filter((g) => g.items.length > 0 && g.items.some(isVisible));

  return (
    <div>
      {groups.length === 0 && (
        <div style={{ textAlign: "center", padding: "72px 16px", color: "var(--text-3)" }}>
          <div style={{ fontSize: 16, fontWeight: 600, color: "var(--text-2)", marginBottom: 8 }}>
            {keyword.trim()
              ? `没有找到与「${keyword.trim()}」相关的工具`
              : activeTag
                ? `「${activeTag}」标签下暂无工具`
                : "该分类暂无工具"}
          </div>
          <Link href="/tool" style={{ color: "#3874F7", fontSize: 14, textDecoration: "none" }}>
            查看全部 AI 工具 →
          </Link>
        </div>
      )}
      {groups.map(({ cat, items }) => {
        // 1:1 对齐目标站：仅 6 个分区有固定 tab 行，其余 8 个分区无 tab（直接出卡片）。
        // 固定 tab 全量展示以对齐目标站数量；个别标签本站库无工具时点击落到空态兜底文案。
        const tagChips = getSectionTabs(cat.name);

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

            <div className="tool-grid" style={gridStyle}>
              {items.map((tool) => {
                const haystack = `${tool.name} ${tool.description} ${(
                  tool.tags || []
                ).join(" ")}`.toLowerCase();
                const visible = isVisible(tool);
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
