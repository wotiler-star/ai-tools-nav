import Link from "next/link";
import ToolCard from "./ToolCard";
import { featuredTop, categories, tools } from "@/lib/mock-data";

// 鱼皮风格：精选推荐（顶部横条）+ AI 工具大全（分类标签行 + 工具网格）
export default function FeaturedTop() {
  const grid = tools.slice(0, 12);
  return (
    <section className="mx-auto max-w-7xl px-4 py-8">
      {/* 精选推荐 */}
      <h2 className="text-xl font-bold mb-4">精选推荐</h2>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {featuredTop.map((f) => (
          <Link
            key={f.id}
            href={f.href}
            className="card p-4 flex flex-col gap-2 hover:-translate-y-0.5 transition"
          >
            <span className="chip self-start">{f.tag}</span>
            <h3 className="font-semibold leading-snug">{f.title}</h3>
            <p className="text-sm line-clamp-2" style={{ color: "var(--text-muted)" }}>
              {f.summary}
            </p>
          </Link>
        ))}
      </div>

      {/* AI 工具大全 */}
      <div className="mt-10">
        <div className="flex items-end justify-between mb-4">
          <h2 className="text-xl font-bold">AI 工具大全</h2>
          <Link
            href="/category"
            className="text-sm hover:underline"
            style={{ color: "var(--primary)" }}
          >
            查看更多 →
          </Link>
        </div>
        <div className="flex flex-wrap gap-2 mb-5">
          {categories.map((c) => (
            <Link key={c.slug} href={`/category/${c.slug}`} className="chip hover:opacity-80">
              {c.name}
            </Link>
          ))}
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {grid.map((t) => (
            <ToolCard key={t.id} tool={t} />
          ))}
        </div>
      </div>
    </section>
  );
}
