import Link from "next/link";
import { categories } from "@/lib/mock-data";

export default function CategoryGrid() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-10">
      <div className="flex items-end justify-between mb-5">
        <h2 className="text-xl font-bold">📚 全部分类</h2>
        <Link href="/category" className="text-sm hover:underline" style={{ color: "var(--primary)" }}>
          查看全部 →
        </Link>
      </div>
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
        {categories.map((c) => (
          <Link
            key={c.slug}
            href={`/category/${c.slug}`}
            className="card flex flex-col items-center gap-2 p-4 text-center hover:-translate-y-0.5 transition"
          >
            <span className="text-2xl">{c.icon}</span>
            <span className="text-sm font-medium">{c.name}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
