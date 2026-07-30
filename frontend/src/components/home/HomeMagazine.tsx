import Link from "next/link";
import RecentTools from "@/components/RecentTools";
import TabController from "./TabController";
import ToolCard from "@/components/ToolCard";
import {
  AI_NEWS,
  AI_POSTS,
  ARTICLES,
  HOT_ARTICLES,
  HOME_PROMPTS,
  HOT_SEARCHES,
  NEWS_FEATURED,
  RECOMMENDS,
  AI_TOOLS,
  TOOL_TABS
} from "@/lib/mockData";
import { SITE } from "@/config/site";

const BRAND = "#3874F7";
const BANNER_ICONS = ["💡", "🚀", "🎨", "🔥", "🛠️"];

/** 区块标题 + 更多（服务端组件，内联 SVG 箭头避免引入 antd 图标） */
function SectionHead({
  icon,
  title,
  moreHref
}: {
  icon?: string;
  title: string;
  moreHref?: string;
}) {
  return (
    <div className="mb-4 flex items-center justify-between">
      <h2 className="m-0 flex items-center gap-2 text-xl font-bold text-gray-900">
        {icon && <span>{icon}</span>}
        <span>{title}</span>
      </h2>
      {moreHref && (
        <Link
          href={moreHref}
          className="flex items-center gap-1 text-sm text-gray-500 hover:text-[#3874F7]"
        >
          更多
          <svg width="11" height="11" viewBox="0 0 1024 1024" fill="currentColor" aria-hidden>
            <path d="M765.7 486.8L314.9 134.7A7.97 7.97 0 0 0 302 141v77.3c0 4.9 2.3 9.6 6.1 12.6l360 281.1-360 281.1c-3.9 3-6.1 7.7-6.1 12.6V883c0 6.7 7.7 10.4 12.9 6.3l450.8-352.1a31.96 31.96 0 0 0 0-50.4z" />
          </svg>
        </Link>
      )}
    </div>
  );
}

/** AI 工具大全：全部分类面板服务端直出，默认分类可见，Tab 切换由 TabController 接管 */
function ToolSection() {
  return (
    <section data-tabs="tool">
      <SectionHead title="AI 工具大全" moreHref="/tool" />
      <div className="tab-bar mb-4 flex flex-wrap gap-2">
        {TOOL_TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            data-tab={t.key}
            data-active={t.key === TOOL_TABS[0].key}
            className="tab-pill rounded-full px-4 py-1.5 text-sm"
          >
            {t.label}
          </button>
        ))}
      </div>
      <div className="tab-panels">
        {TOOL_TABS.map((t) => (
          <div
            key={t.key}
            data-panel={t.key}
            className={t.key === TOOL_TABS[0].key ? "" : "hidden"}
          >
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {AI_TOOLS.filter((x) => x.categoryId === t.key)
                .slice(0, 8)
                .map((tool) => (
                  <ToolCard key={tool.id} tool={tool} />
                ))}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 text-center">
        <Link href="/tool" className="brand-btn">
          查看更多工具
        </Link>
      </div>
    </section>
  );
}

/** AI 提示词：绘图/文字两面板服务端直出 + 推荐内容（常驻） */
function PromptSection() {
  const kinds: Array<"draw" | "text"> = ["draw", "text"];
  const labelOf = (k: "draw" | "text") =>
    k === "draw" ? "AI 绘图提示词" : "AI 文字提示词";
  return (
    <section data-tabs="prompt">
      <div className="tab-bar mb-4 flex items-center justify-between">
        <div className="flex flex-wrap gap-2">
          {kinds.map((k) => (
            <button
              key={k}
              type="button"
              data-tab={k}
              data-active={k === "draw"}
              className="tab-pill rounded-full px-4 py-1.5 text-sm"
            >
              {labelOf(k)}
            </button>
          ))}
        </div>
        <Link
          href="/painting"
          className="text-sm text-gray-500 hover:text-[#3874F7]"
        >
          全部提示词
        </Link>
      </div>
      <div className="tab-panels">
        {kinds.map((k) => (
          <div
            key={k}
            data-panel={k}
            className={k === "draw" ? "" : "hidden"}
          >
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {HOME_PROMPTS.filter((p) => p.kind === k)
                .slice(0, 8)
                .map((p) => (
                  <Link
                    key={p.id}
                    href="/painting"
                    className="group hover-brand-lift block rounded-2xl bg-white p-4 shadow-sm"
                  >
                    <div
                      className="mb-3 flex h-24 w-full items-center justify-center rounded-lg text-3xl transition-transform duration-200 group-hover:scale-105"
                      style={{
                        background: k === "draw" ? "var(--tint-pink)" : "var(--tint-blue)"
                      }}
                    >
                      {k === "draw" ? "🎨" : "✍️"}
                    </div>
                    <div className="line-clamp-1 font-medium text-gray-900 hover-brand-title">
                      {p.title}
                    </div>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {p.tags.map((t) => (
                        <span key={t} className="text-xs text-gray-400">
                          #{t}
                        </span>
                      ))}
                    </div>
                  </Link>
                ))}
            </div>
          </div>
        ))}
      </div>

      {/* 推荐内容（常驻，不随 Tab 切换） */}
      <div className="mt-8 rounded-2xl bg-white p-5 shadow-sm">
        <div className="mb-3 font-semibold text-gray-900">推荐内容</div>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {RECOMMENDS.map((r) => (
            <div
              key={r.id}
              className="group hover-brand flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-700"
            >
              <span
                className="font-semibold hover-brand-title"
                style={{ color: BRAND }}
              >
                #
              </span>
              <span className="line-clamp-1 text-gray-700 hover-brand-title">
                {r.title}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/** 学习教程：教程/课程/百科三面板服务端直出 + 右侧小助手二维码（常驻） */
function ArticleSection() {
  const tabs = [
    { key: "tutorial", label: "AI 学习教程" },
    { key: "course", label: "AI 项目课程" },
    { key: "wiki", label: "AI 知识百科" }
  ];
  return (
    <section>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        <div className="lg:col-span-3" data-tabs="article">
          <div className="tab-bar mb-4 flex flex-wrap gap-2">
            {tabs.map((t) => (
              <button
                key={t.key}
                type="button"
                data-tab={t.key}
                data-active={t.key === "tutorial"}
                className="tab-pill rounded-full px-4 py-1.5 text-sm"
              >
                {t.label}
              </button>
            ))}
          </div>
          <div className="tab-panels">
            {tabs.map((t) => (
              <div
                key={t.key}
                data-panel={t.key}
                className={t.key === "tutorial" ? "" : "hidden"}
              >
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {ARTICLES.filter((a) => a.category === t.key)
                    .slice(0, 6)
                    .map((a) => (
                      <div
                        key={a.id}
                        className="group hover-brand-lift flex cursor-pointer gap-3 rounded-2xl bg-white p-4 shadow-sm"
                      >
                        <div
                          className="flex h-16 w-24 flex-shrink-0 items-center justify-center rounded-lg text-2xl"
                          style={{ background: "var(--tint-blue)" }}
                        >
                          📘
                        </div>
                        <div className="flex flex-col justify-center">
                          <div className="line-clamp-2 font-medium text-gray-900 hover-brand-title">
                            {a.title}
                          </div>
                          <div className="mt-2 text-xs text-gray-400">
                            鱼皮 · 精选
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-5 text-center">
            <button type="button" className="brand-btn" style={{ height: 40, fontSize: 14 }}>
              加载更多
            </button>
          </div>
        </div>

        {/* 小助手二维码（静态常驻） */}
        <aside className="lg:col-span-1">
          <div className="rounded-2xl bg-white p-5 text-center shadow-sm">
            <div
              className="mx-auto flex h-32 w-32 items-center justify-center rounded-xl text-5xl"
              style={{ background: "var(--qr-bg)" }}
            >
              📱
            </div>
            <div className="mt-3 text-sm font-semibold text-gray-900">
              扫码添加小助手
            </div>
            <div className="mt-1 text-xs leading-relaxed text-gray-400">
              免费领 AI 大模型应用学习路线，
              <br />
              保姆级写简历指南
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}

/**
 * 首页内容（Server Component）。
 * 所有区块（含各 Tab 默认/全部面板、搜索框、二维码）均在此服务端直出，
 * dev/生产都能拿到完整 SSR HTML；仅 Tab 切换由 <TabController/>（渲染 null）在客户端水合。
 */
export default function HomeMagazine() {
  return (
    <div className="pb-10">
      {/* ===== Hero 搜索区（文案静态 + 原生 form 无 JS 可提交） ===== */}
      <section style={{ background: "var(--hero-bg)" }}>
        <div className="container-1200 py-10 text-center md:py-14">
          <h1 className="m-0 text-4xl font-extrabold leading-tight text-gray-900 md:text-5xl">
            探索 AI，
            <span style={{ color: BRAND }}>从这里开始</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-gray-500">
            {SITE.slogan}
          </p>

          <form action="/search" method="get" className="home-search-form" role="search">
            <input
              type="text"
              name="keyword"
              placeholder="全站搜索 AI 相关工具、资源、信息"
              className="home-search-input"
              aria-label="全站搜索"
            />
            <button type="submit" className="home-search-btn">
              搜索
            </button>
          </form>

          <div className="mx-auto mt-4 flex max-w-2xl flex-wrap items-center justify-center gap-2 text-sm">
            <span className="text-gray-400">热门搜索：</span>
            {HOT_SEARCHES.map((s) => (
              <Link
                key={s}
                href={`/search?keyword=${encodeURIComponent(s)}`}
                className="cursor-pointer rounded-full px-3 py-1 transition hover:text-[#3874F7]"
                style={{ background: "var(--chip-bg)", color: "var(--chip-text)" }}
              >
                {s}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <div className="container-1200 mt-8 space-y-12">
        {/* ===== 精选推荐 横幅 ===== */}
        <section
          className="rounded-2xl p-1 shadow-sm"
          style={{ background: "var(--banner-bg)" }}
        >
          <div
            className="flex items-start gap-3 rounded-xl px-4 py-3 backdrop-blur-sm max-[640px]:flex-col max-[640px]:items-start"
            style={{ background: "var(--banner-inner)" }}
          >
            <span
              className="mt-0.5 flex flex-shrink-0 items-center gap-1 rounded-md px-3 py-1.5 text-sm font-semibold text-white shadow-sm"
              style={{ background: "linear-gradient(135deg,#3874F7,#7c3aed)" }}
            >
              ✨ 编辑精选
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
                {NEWS_FEATURED.map((f, idx) => (
                  <Link
                    key={f.id}
                    href={f.href ?? "/resource/learn"}
                    className="group flex items-center gap-1.5 text-sm text-gray-700 transition-all duration-200 hover:gap-2.5 hover:font-medium hover:text-[#3874F7]"
                  >
                    <span className="text-[#3874F7] transition-transform duration-200 group-hover:scale-125 group-hover:translate-x-0.5">
                      {BANNER_ICONS[idx % BANNER_ICONS.length]}
                    </span>
                    {f.title}
                  </Link>
                ))}
              </div>
              <div className="mt-1.5 text-xs text-gray-400">
                鱼皮团队严选 · 覆盖 AI 教程 / 工具实测 / 学习路线，每日更新
              </div>
            </div>
          </div>
        </section>

        {/* ===== 最近浏览（localStorage，仅在有记录时显示） ===== */}
        <RecentTools />

        {/* ===== AI 工具大全（全分类面板 SSR 直出） ===== */}
        <ToolSection />

        {/* ===== AI 交流社区 ===== */}
        <section>
          <SectionHead title="AI 交流社区" moreHref="/essay" />
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {AI_POSTS.map((p) => (
              <Link
                key={p.id}
                href="/essay"
                className="group hover-brand-lift block rounded-2xl bg-white p-5 shadow-sm"
              >
                <div className="mb-3 flex items-center gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-100 text-sm">
                    👤
                  </span>
                  <span className="text-sm font-medium text-gray-800">
                    {p.authorName}
                  </span>
                  <span className="text-xs text-gray-400">
                    · {p.createTime.slice(5, 16)}
                  </span>
                </div>
                <div className="mb-2 line-clamp-1 font-semibold text-gray-900 hover-brand-title">
                  {p.title}
                </div>
                <div className="line-clamp-2 text-sm text-gray-500">
                  {p.content}
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ===== 🌟 AI 资讯 ===== */}
        <section>
          <SectionHead icon="🌟" title="AI 资讯" moreHref="/news" />
          <div className="rounded-2xl bg-white p-2 shadow-sm">
            <ul className="m-0 list-none p-0">
              {AI_NEWS.map((n) => {
                const top = n.rank <= 3;
                return (
                  <li
                    key={n.id}
                    className="group flex transform-gpu cursor-pointer items-center gap-3 rounded-lg border-b border-gray-50 px-3 py-3 transition-all duration-200 last:border-0 hover:bg-[var(--list-row-hover)] hover:pl-4 hover:shadow-sm"
                  >
                    <span
                      className={`flex h-6 w-6 flex-shrink-0 items-center justify-center rounded text-xs font-bold transition-all duration-200 group-hover:scale-110 group-hover:shadow ${
                        top ? "bg-[#ff4d4f] text-white" : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {n.rank}
                    </span>
                    <span className="flex-1 truncate text-sm text-gray-700 transition-all duration-200 group-hover:translate-x-0.5 group-hover:font-medium hover-brand-title">
                      {n.title}
                    </span>
                    {n.hot && <span>🔥</span>}
                  </li>
                );
              })}
            </ul>
          </div>
        </section>

        {/* ===== 🔥 热门文章 ===== */}
        <section>
          <SectionHead icon="🔥" title="热门文章" moreHref="/essay" />
          <div className="rounded-2xl bg-white p-2 shadow-sm">
            <ul className="m-0 list-none p-0">
              {HOT_ARTICLES.map((a, i) => {
                const top = i < 3;
                return (
                  <li
                    key={a.id}
                    className="group flex transform-gpu cursor-pointer items-center gap-3 rounded-lg border-b border-gray-50 px-3 py-3 transition-all duration-200 last:border-0 hover:bg-[var(--list-row-hover)] hover:pl-4 hover:shadow-sm"
                  >
                    <span
                      className={`flex h-6 w-6 flex-shrink-0 items-center justify-center rounded text-xs font-bold transition-all duration-200 group-hover:scale-110 group-hover:shadow ${
                        top ? "bg-[#ff4d4f] text-white" : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {i + 1}
                    </span>
                    <span className="flex-1 truncate text-sm text-gray-700 transition-all duration-200 group-hover:translate-x-0.5 group-hover:font-medium hover-brand-title">
                      {a.title}
                    </span>
                    <span className="flex-shrink-0 text-xs tabular-nums text-gray-400 transition-colors duration-200 hover-brand-title">
                      {a.viewNum} 阅读
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>

        {/* ===== AI 提示词（两面板 SSR 直出 + 推荐内容） ===== */}
        <PromptSection />

        {/* ===== 学习教程 / 项目课程 / 知识百科（三面板 SSR 直出 + 二维码） ===== */}
        <ArticleSection />
      </div>

      {/* 唯一的客户端水合组件：接管所有 [data-tabs] 的切换行为 */}
      <TabController />
    </div>
  );
}
