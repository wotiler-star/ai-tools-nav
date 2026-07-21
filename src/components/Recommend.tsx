import { recommends } from "@/lib/mock-data";

// 鱼皮风格：推荐内容（编号列表）
export default function Recommend() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-8">
      <h2 className="text-xl font-bold mb-5">推荐内容</h2>
      <ol className="space-y-2">
        {recommends.map((r) => (
          <li key={r.id} className="flex items-start gap-3">
            <span
              className="text-sm font-bold w-6 text-center shrink-0"
              style={{ color: "var(--primary)" }}
            >
              #{r.rank}
            </span>
            <a href={r.href} className="hover:underline leading-snug">
              {r.title}
            </a>
          </li>
        ))}
      </ol>
    </section>
  );
}
