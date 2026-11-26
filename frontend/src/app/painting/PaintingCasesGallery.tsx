"use client";

// /painting 1:1 对齐目标站 AI提示词页（2026-11-26 实测首屏）
// 目标站结构：36px 标题 → 600×40 搜索 → 统计胶囊 → 双行筛选（排序/类型/模型 + 场景）
// → 4 列瀑布流卡片（案例角标 + 自然比例封面 + 标题 + 标签），首屏 17 张（对齐目标实测），滚动增量加载。
import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { SearchOutlined } from "@ant-design/icons";
import { PAINTING_CASES, type PaintingCase } from "@/lib/paintingCases";
import SafeCover from "@/components/SafeCover";

const BRAND = "#2563EB";
const PAGE_SIZE = 17; // 目标站 craft-anything 实测首屏 h3=17
const MODELS = ["全部", "Nano Banana Pro", "GPT-Image-2"];
const SCENES = [
  "全部场景", "🎨 人像写真", "📸 产品海报", "🎬 奇幻场景", "🍓 美食摄影",
  "📸 时尚大片", "👗 时尚人像", "🎨 角色设计", "🎨 平面设计", "📸 街拍人像",
  "☕ 室内人像", "🎨 艺术海报", "✈️ 旅行插画", "🌧️ 城市街景", "🚉 城市景观", "🎭 角色设定"
];
const sceneKey = (s: string) => s.replace(/^[^\u4e00-\u9fa5]+/, "");

// 目标站「精选」tab 首屏真实顺序（craft-anything 2026-11-26 抓取 DOM h3 顺序，逐 id 提取）。
// 目标站该顺序是运营精选排序，非 id/采集顺序；按此重排才能做到首屏 1:1。
const FEATURED_ORDER = [
  "2117903200341229754", "2117903200341230949", "2117903200341231206",
  "2119524246186180610", "2119523264085704706", "2117903200341232346",
  "2119526187423318017", "2124758517993705474", "2122223704703275009",
  "2119525694781341697", "2122223662537936898", "2119525459145342978",
  "2119516450082340866", "2117903200341232535", "2119522046441504770",
  "2124587539749793793", "2124587722071994369"
];
const FEATURED_RANK = new Map(FEATURED_ORDER.map((id, i) => [id, i]));

function FilterPill({
  active,
  children,
  onClick
}: {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      className={`painting-pill${active ? " active" : ""}`}
      onClick={onClick}
      aria-pressed={active}
    >
      {children}
    </button>
  );
}

export default function PaintingCasesGallery() {
  const [sort, setSort] = useState<"featured" | "latest">("featured");
  const [type, setType] = useState("全部");
  const [model, setModel] = useState("全部");
  const [scene, setScene] = useState("全部场景");
  const [kw, setKw] = useState("");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [gridWidth, setGridWidth] = useState(0);
  const [columns, setColumns] = useState(4);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  // 目标站「看看新内容 →」直达 /painting?tab=latest
  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("tab") === "latest") {
      setSort("latest");
    }
  }, []);

  const list = useMemo(() => {
    let arr = [...PAINTING_CASES];
    if (type === "模板") arr = arr.filter((c) => c.models.length === 0);
    if (type === "案例") arr = arr.filter((c) => c.models.length > 0);
    if (model !== "全部") {
      const key = model === "GPT-Image-2" ? "gpt" : model === "Nano Banana Pro" ? "nano" : "flux";
      arr = arr.filter((c) => c.models.some((m) => m.toLowerCase().includes(key)));
    }
    if (scene !== "全部场景") arr = arr.filter((c) => c.tags.includes(sceneKey(scene)));
    const q = kw.trim().toLowerCase();
    if (q) {
      arr = arr.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q) ||
          c.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    if (sort === "latest") arr.reverse();
    else if (sort === "featured" && !q && type === "全部" && model === "全部" && scene === "全部场景") {
      // 无筛选的「精选」首屏：按目标站运营精选顺序置顶这 17 张，其余保持采集顺序。
      arr.sort((a, b) => {
        const ra = FEATURED_RANK.get(a.id);
        const rb = FEATURED_RANK.get(b.id);
        if (ra !== undefined && rb !== undefined) return ra - rb;
        if (ra !== undefined) return -1;
        if (rb !== undefined) return 1;
        return 0;
      });
    }
    return arr;
  }, [sort, type, model, scene, kw]);

  // 任一筛选条件变化后回到首屏 17 张，和目标站增量加载口径一致
  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [sort, type, model, scene, kw]);

  // 目标站 react-masonry：>=1200 四列 / >=768 三列 / 其余两列，卡片按从左到右填充最矮列
  useEffect(() => {
    const el = gridRef.current;
    if (!el) return;
    const update = () => {
      setGridWidth(el.clientWidth);
      const w = window.innerWidth;
      setColumns(w >= 1200 ? 4 : w >= 768 ? 3 : 2);
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    window.addEventListener("resize", update);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", update);
    };
  }, []);

  const shown = list.slice(0, visibleCount);
  const hasMore = visibleCount < list.length;

  const GAP = 16;
  const cardWidth = gridWidth > 0 ? (gridWidth - GAP * (columns - 1)) / columns : 0;
  const layout = useMemo(() => {
    const heights = new Array(columns).fill(0) as number[];
    const items = shown.map((c) => {
      const col = heights.indexOf(Math.min(...heights));
      const mediaH = cardWidth > 0 ? cardWidth / (c.ratio || 0.75) : 0;
      const bodyH = c.title.length > 12 ? 88 : 69;
      const pos = {
        case: c,
        left: col * (cardWidth + GAP),
        top: heights[col],
        width: cardWidth
      };
      heights[col] += mediaH + bodyH + GAP;
      return pos;
    });
    return {
      items,
      height: Math.max(0, Math.max(...heights, 0) - GAP)
    };
  }, [shown, columns, cardWidth]);

  // 滚动到底部继续加载，每次 17 张
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el || !hasMore) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setVisibleCount((v) => Math.min(v + PAGE_SIZE, list.length));
        }
      },
      { rootMargin: "240px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [hasMore, list.length, visibleCount]);

  const stats = useMemo(
    () => ({
      total: PAINTING_CASES.length,
      added: PAINTING_CASES.filter((c) => c.isNew).length
    }),
    []
  );

  const onSearch = (e: React.FormEvent) => e.preventDefault();

  return (
    <div className="painting-page">
      {/* 标题区：目标 36px/900、副标题 16px、顶部 48px */}
      <div className="painting-hero">
        <h1 className="painting-title">
          AI 绘图提示词大全，<span style={{ color: BRAND }}>一键出图</span>
        </h1>
        <p className="painting-subtitle">精选 AI 绘图提示词模板和案例，复制即可使用</p>
      </div>

      {/* 搜索区：目标 600×40 圆角胶囊 + 蓝色搜索按钮 */}
      <form onSubmit={onSearch} className="painting-search">
        <SearchOutlined style={{ color: "#94a3b8", fontSize: 15, flexShrink: 0 }} />
        <input
          value={kw}
          onChange={(e) => setKw(e.target.value)}
          placeholder="搜索 AI 绘图提示词、风格"
          aria-label="搜索 AI 绘图提示词、风格"
        />
        <button type="submit" className="painting-search-btn" style={{ background: BRAND }}>
          搜索
        </button>
      </form>

      {/* 统计胶囊：用本站真实数据口径，不照抄目标站运营数字 */}
      <div className="painting-stats-row">
        <div className="painting-stats">
          <span className="painting-stats-dot" />
          <span>
            最近更新 <b>11月26日（周四）</b>
          </span>
          <span className="painting-stats-sep">|</span>
          <span>
            本周新增 <b>{stats.added}</b> 条
          </span>
          <span className="painting-stats-sep">|</span>
          <span>
            共 <b>{stats.total.toLocaleString("zh-CN")}</b> 条
          </span>
          <a href="/painting?tab=latest" className="painting-stats-link">
            看看新内容 →
          </a>
        </div>
      </div>

      {/* 筛选区：排序/类型在左，模型在右；场景独占一行 */}
      <div className="painting-filters">
        <div className="painting-filter-row">
          <div className="painting-filter-group">
            <div className="painting-sort" role="group" aria-label="排序">
              <button
                type="button"
                className={sort === "featured" ? "active" : ""}
                onClick={() => setSort("featured")}
              >
                精选
              </button>
              <button
                type="button"
                className={sort === "latest" ? "active" : ""}
                onClick={() => setSort("latest")}
              >
                最新
              </button>
            </div>
            <span className="painting-filter-label">类型</span>
            <div className="painting-pills">
              {["全部", "模板", "案例"].map((t) => (
                <FilterPill key={t} active={type === t} onClick={() => setType(t)}>
                  {t}
                </FilterPill>
              ))}
            </div>
          </div>
          <div className="painting-filter-group">
            <span className="painting-filter-label">模型</span>
            <div className="painting-pills">
              {MODELS.map((m) => (
                <FilterPill key={m} active={model === m} onClick={() => setModel(m)}>
                  {m}
                </FilterPill>
              ))}
            </div>
          </div>
        </div>
        <div className="painting-pills painting-scenes">
          {SCENES.map((s) => (
            <FilterPill key={s} active={scene === s} onClick={() => setScene(s)}>
              {s}
            </FilterPill>
          ))}
        </div>
      </div>

      {/* 瀑布流：目标 4 列 / 300px / 16px 间距，卡片比例跟随真实封面 */}
      <div
        ref={gridRef}
        className="painting-masonry"
        role="grid"
        style={{ height: layout.height }}
      >
        {layout.items.map(({ case: c, left, top, width }) => (
          <div
            key={c.id}
            className="painting-card-wrap"
            role="gridcell"
            style={{ left, top, width }}
          >
            <Link
              href={`/painting/case/${c.id}`}
              target="_blank"
              rel="noreferrer"
              className="painting-card"
            >
              <div className="painting-card-media" style={{ aspectRatio: String(c.ratio || 0.75) }}>
                <SafeCover src={c.cover} alt={c.title} />
                <div className="painting-card-badges">
                  <span className="painting-badge">案例</span>
                  {c.isNew && (
                    <span className="painting-badge new" style={{
                      background: "#f5512b", height: 18, fontSize: 11,
                      fontWeight: 700, letterSpacing: "0.02em", padding: "0 6px", borderRadius: 4
                    }}>
                      NEW
                    </span>
                  )}
                </div>
              </div>
              <div className="painting-card-body">
                <h3 className="painting-card-title">{c.title}</h3>
                <div className="painting-card-tags">
                  {c.tags.slice(0, 3).map((t, i) => (
                    <span key={t}>
                      {i > 0 && <span className="painting-tag-sep">•</span>}#{t}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>

      {shown.length === 0 && (
        <div className="painting-empty">暂无匹配的绘图案例</div>
      )}

      <div ref={sentinelRef} className="painting-sentinel" aria-hidden="true" />
      {hasMore && <div className="painting-loading">继续滚动加载更多案例…</div>}
    </div>
  );
}
