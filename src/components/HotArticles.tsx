import { articles } from "@/lib/mock-data";

// 鱼皮风格：🔥 热门文章（编号列表 + 浏览量）
export default function HotArticles() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-8">
      <h2 className="text-xl font-bold mb-5">🔥 热门文章</h2>
      <ol className="space-y-2">
        {articles.map((a, i) => (
          <li key={a.id} className="flex items-start gap-3">
            <span
              className="text-sm font-bold w-5 text-center shrink-0"
              style={{ color: "var(--text-muted)" }}
            >
              {i + 1}
            </span>
            <a href={a.href} className="hover:underline leading-snug flex-1">
              {a.title}
            </a>
            <span className="text-xs shrink-0" style={{ color: "var(--text-muted)" }}>
              {a.views} 阅读
            </span>
          </li>
        ))}
      </ol>
    </section>
  );
}
