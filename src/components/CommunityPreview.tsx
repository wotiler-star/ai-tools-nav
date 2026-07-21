import Link from "next/link";
import { posts } from "@/lib/mock-data";
import type { Post } from "@/lib/types";

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const h = Math.floor(diff / 3600000);
  if (h < 1) return "刚刚";
  if (h < 24) return `${h} 小时前`;
  return `${Math.floor(h / 24)} 天前`;
}

// 鱼皮风格：AI 交流社区（作者·时间 + 标题 + 摘要 的列表流）
export default function CommunityPreview() {
  const list = posts.slice(0, 5);
  return (
    <section id="community" className="mx-auto max-w-7xl px-4 py-8 scroll-mt-20">
      <div className="flex items-end justify-between mb-5">
        <h2 className="text-xl font-bold">AI 交流社区</h2>
        <Link
          href="/community"
          className="text-sm hover:underline"
          style={{ color: "var(--primary)" }}
        >
          更多 →
        </Link>
      </div>
      <ul className="divide-y" style={{ borderColor: "var(--border)" }}>
        {list.map((p: Post) => (
          <li key={p.id} className="py-4">
            <div
              className="flex items-center gap-2 text-xs mb-1"
              style={{ color: "var(--text-muted)" }}
            >
              <span>
                {p.authorAvatar} {p.author}
              </span>
              <span>· {timeAgo(p.createdAt)}</span>
            </div>
            <Link
              href={`/community/${p.id}`}
              className="font-semibold leading-snug hover:underline block"
            >
              {p.title}
            </Link>
            <p className="text-sm line-clamp-2 mt-1" style={{ color: "var(--text-muted)" }}>
              {p.content}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
