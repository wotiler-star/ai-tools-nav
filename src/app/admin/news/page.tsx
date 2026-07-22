import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { deleteNews, togglePublishNews } from "@/lib/news-actions";
import { Pencil, Trash2, Eye, EyeOff } from "lucide-react";
import { formatDate } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function AdminNews() {
  const list = await prisma.news.findMany({
    orderBy: { publishedAt: "desc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">AI 资讯管理</h1>
        <Link href="/admin/news/new" className="btn-primary text-sm">
          + 新建资讯
        </Link>
      </div>

      <div
        className="card divide-y"
        style={{ borderColor: "var(--border)" }}
      >
        {list.map((n) => (
          <div key={n.id} className="flex items-center gap-3 p-3">
            <div className="min-w-0 flex-1">
              <div className="font-medium truncate">{n.title}</div>
              <div
                className="text-xs truncate"
                style={{ color: "var(--text-muted)" }}
              >
                {n.source} · {formatDate(n.publishedAt)} · {n.views} 阅读
              </div>
            </div>
            <span
              className="text-xs px-2 py-0.5 rounded-full shrink-0"
              style={{
                background: n.published
                  ? "color-mix(in srgb, var(--success) 15%, transparent)"
                  : "var(--bg-subtle)",
                color: n.published ? "var(--success)" : "var(--text-muted)",
              }}
            >
              {n.published ? "已发布" : "草稿"}
            </span>
            <Link
              href={`/admin/news/${n.id}`}
              className="w-9 h-9 grid place-items-center rounded-full hover:bg-[var(--bg-subtle)] shrink-0"
              title="编辑"
            >
              <Pencil size={16} />
            </Link>
            <form action={togglePublishNews.bind(null, n.id)}>
              <button
                type="submit"
                className="w-9 h-9 grid place-items-center rounded-full hover:bg-[var(--bg-subtle)] shrink-0"
                title={n.published ? "转为草稿" : "发布"}
                style={{ color: n.published ? "var(--text-muted)" : "var(--success)" }}
              >
                {n.published ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </form>
            <form action={deleteNews.bind(null, n.id)}>
              <button
                type="submit"
                className="w-9 h-9 grid place-items-center rounded-full hover:bg-[var(--bg-subtle)] shrink-0"
                title="删除"
                style={{ color: "var(--accent)" }}
              >
                <Trash2 size={16} />
              </button>
            </form>
          </div>
        ))}
        {list.length === 0 && (
          <div
            className="p-6 text-center text-sm"
            style={{ color: "var(--text-muted)" }}
          >
            暂无资讯，点击右上角「新建资讯」发布第一篇。
          </div>
        )}
      </div>
    </div>
  );
}
