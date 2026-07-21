import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { approvePost, rejectPost } from "@/lib/admin-actions";
import { Check, X } from "lucide-react";

export const dynamic = "force-dynamic";

const STATUS: Record<string, { label: string; color: string }> = {
  PENDING: { label: "待审核", color: "var(--warning)" },
  PUBLISHED: { label: "已发布", color: "var(--success)" },
  REJECTED: { label: "已拒绝", color: "var(--accent)" },
};

export default async function AdminPosts() {
  const posts = await prisma.post.findMany({
    orderBy: [{ status: "asc" }, { createdAt: "desc" }],
    take: 100,
  });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-1">内容审核</h1>
      <p className="text-sm mb-5" style={{ color: "var(--text-muted)" }}>
        新用户首帖默认进入「待审核」，审核通过后才在前台展示。
      </p>

      <div className="card divide-y" style={{ borderColor: "var(--border)" }}>
        {posts.map((p) => {
          const s = STATUS[p.status] ?? STATUS.PUBLISHED;
          return (
            <div key={p.id} className="flex items-center gap-3 p-3">
              <div className="min-w-0 flex-1">
                <div className="font-medium truncate">{p.title}</div>
                <div className="text-xs truncate" style={{ color: "var(--text-muted)" }}>
                  {p.authorName} · {new Date(p.createdAt).toLocaleDateString("zh-CN")} · {p.likes} 赞 · {p.comments} 评
                </div>
              </div>
              <span
                className="text-xs px-2 py-0.5 rounded-full shrink-0"
                style={{ background: `color-mix(in srgb, ${s.color} 15%, transparent)`, color: s.color }}
              >
                {s.label}
              </span>
              <Link
                href={`/community/${p.id}`}
                className="text-xs shrink-0 hover:underline"
                style={{ color: "var(--primary)" }}
              >
                查看
              </Link>
              {p.status !== "PUBLISHED" && (
                <form action={approvePost.bind(null, p.id)}>
                  <button className="w-9 h-9 grid place-items-center rounded-full hover:bg-[var(--bg-subtle)]" title="通过" aria-label="通过">
                    <Check size={18} style={{ color: "var(--success)" }} />
                  </button>
                </form>
              )}
              {p.status !== "REJECTED" && (
                <form action={rejectPost.bind(null, p.id)}>
                  <button className="w-9 h-9 grid place-items-center rounded-full hover:bg-[var(--bg-subtle)]" title="拒绝" aria-label="拒绝">
                    <X size={18} style={{ color: "var(--accent)" }} />
                  </button>
                </form>
              )}
            </div>
          );
        })}
        {posts.length === 0 && (
          <div className="p-6 text-center text-sm" style={{ color: "var(--text-muted)" }}>
            暂无内容。
          </div>
        )}
      </div>
    </div>
  );
}
