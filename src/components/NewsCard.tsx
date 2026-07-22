import Link from "next/link";
import { Eye } from "lucide-react";
import { parseJsonTags, formatDate } from "@/lib/format";

export type NewsCardItem = {
  id: string;
  title: string;
  slug?: string;
  summary?: string | null;
  source?: string | null;
  cover?: string | null;
  tags?: string | null;
  views?: number | null;
  publishedAt?: Date | string | null;
};

// 资讯卡片：列表与详情页「相关推荐」复用
export default function NewsCard({
  item,
  compact = false,
}: {
  item: NewsCardItem;
  compact?: boolean;
}) {
  const tags = parseJsonTags(item.tags);
  const isGradient = !!item.cover && item.cover.includes("gradient");

  return (
    <Link
      href={`/news/${item.id}`}
      className="card overflow-hidden hover:border-[var(--primary)] transition group flex flex-col"
    >
      {!compact && (
        <div
          className="h-32 flex items-center justify-center text-4xl"
          style={isGradient ? { background: item.cover! } : undefined}
        >
          {isGradient ? "" : item.cover || "📰"}
        </div>
      )}
      <div className="p-4 flex-1 flex flex-col">
        <h3 className="font-semibold leading-snug group-hover:text-[var(--primary)] line-clamp-2">
          {item.title}
        </h3>
        {item.summary && (
          <p
            className="text-sm mt-1 line-clamp-2"
            style={{ color: "var(--text-muted)" }}
          >
            {item.summary}
          </p>
        )}
        <div
          className="mt-auto pt-3 flex items-center gap-2 text-xs"
          style={{ color: "var(--text-muted)" }}
        >
          <span className="truncate">{item.source || "AI 导航"}</span>
          <span>·</span>
          <span className="shrink-0">{formatDate(item.publishedAt)}</span>
          <span className="ml-auto flex items-center gap-1 shrink-0">
            <Eye size={12} /> {item.views ?? 0}
          </span>
        </div>
        {tags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {tags.slice(0, 3).map((t) => (
              <span
                key={t}
                className="text-xs px-2 py-0.5 rounded-full"
                style={{ background: "var(--bg-subtle)" }}
              >
                {t}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}
