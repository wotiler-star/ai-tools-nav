import Link from "next/link";
import { categories } from "@/lib/mock-data";

export default function CategoryIndexPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="text-2xl font-bold mb-5">📚 全部分类</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {categories.map((c) => (
          <Link
            key={c.slug}
            href={`/category/${c.slug}`}
            className="card flex items-center gap-3 p-4 hover:-translate-y-0.5 transition"
          >
            <span className="text-2xl">{c.icon}</span>
            <span>
              <span className="block font-medium">{c.name}</span>
              <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                {c.desc}
              </span>
            </span>
          </Link>
        ))}
      </div>
    </main>
  );
}
