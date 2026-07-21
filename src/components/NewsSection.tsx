import { news } from "@/lib/mock-data";

// 鱼皮风格：🌟 AI 资讯（编号列表）
export default function NewsSection() {
  return (
    <section id="news" className="mx-auto max-w-7xl px-4 py-8 scroll-mt-20">
      <div className="flex items-end justify-between mb-5">
        <h2 className="text-xl font-bold">🌟 AI 资讯</h2>
        <a href="#news" className="text-sm hover:underline" style={{ color: "var(--primary)" }}>
          更多资讯 →
        </a>
      </div>
      <ol className="space-y-2">
        {news.map((n, i) => (
          <li key={n.id} className="flex items-start gap-3">
            <span
              className="text-sm font-bold w-5 text-center shrink-0"
              style={{ color: "var(--primary)" }}
            >
              {i + 1}
            </span>
            <a href={n.url} className="hover:underline leading-snug">
              {n.title}
            </a>
          </li>
        ))}
      </ol>
    </section>
  );
}
