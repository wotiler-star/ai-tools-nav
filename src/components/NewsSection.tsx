import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { news as mockNews } from "@/lib/mock-data";

// 鱼皮风格：🌟 AI 资讯（编号列表）。优先读数据库，数据库不可用时降级到 Mock。
export default async function NewsSection() {
  let items: any[] = [];
  let useMock = false;
  try {
    items = await prisma.news.findMany({
      where: { published: true },
      orderBy: { publishedAt: "desc" },
      take: 10,
    });
  } catch {
    items = mockNews as any[];
    useMock = true;
  }

  return (
    <section id="news" className="mx-auto max-w-7xl px-4 py-8 scroll-mt-20">
      <div className="flex items-end justify-between mb-5">
        <h2 className="text-xl font-bold">🌟 AI 资讯</h2>
        <Link
          href="/news"
          className="text-sm hover:underline"
          style={{ color: "var(--primary)" }}
        >
          更多资讯 →
        </Link>
      </div>
      <ol className="space-y-2">
        {items.map((n, i) => {
          const href = useMock ? n.url || "#" : `/news/${n.id}`;
          return (
            <li key={n.id} className="flex items-start gap-3">
              <span
                className="text-sm font-bold w-5 text-center shrink-0"
                style={{ color: "var(--primary)" }}
              >
                {i + 1}
              </span>
              <Link href={href} className="hover:underline leading-snug">
                {n.title}
              </Link>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
