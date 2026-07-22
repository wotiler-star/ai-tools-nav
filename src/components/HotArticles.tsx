import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { articles as mockArticles } from "@/lib/mock-data";

// 鱼皮风格：🔥 热门文章（编号列表 + 浏览量）。数据来源与 AI 资讯一致（按浏览量排序）。
export default async function HotArticles() {
  let items: any[] = [];
  let useMock = false;
  try {
    items = await prisma.news.findMany({
      where: { published: true },
      orderBy: { views: "desc" },
      take: 10,
    });
  } catch {
    items = mockArticles as any[];
    useMock = true;
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-8">
      <h2 className="text-xl font-bold mb-5">🔥 热门文章</h2>
      <ol className="space-y-2">
        {items.map((a, i) => {
          const href = useMock ? a.href || "#" : `/news/${a.id}`;
          return (
            <li key={a.id} className="flex items-start gap-3">
              <span
                className="text-sm font-bold w-5 text-center shrink-0"
                style={{ color: "var(--text-muted)" }}
              >
                {i + 1}
              </span>
              <Link
                href={href}
                className="hover:underline leading-snug flex-1"
              >
                {a.title}
              </Link>
              <span
                className="text-xs shrink-0"
                style={{ color: "var(--text-muted)" }}
              >
                {a.views ?? 0} 阅读
              </span>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
