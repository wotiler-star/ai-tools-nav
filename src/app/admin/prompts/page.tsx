import { prisma } from "@/lib/prisma";
import { deletePrompt } from "@/lib/admin-actions";
import { Trash2 } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminPrompts() {
  const prompts = await prisma.prompt.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-1">提示词管理</h1>
      <p className="text-sm mb-5" style={{ color: "var(--text-muted)" }}>
        共 {prompts.length} 条提示词，展示在首页「提示词广场」与社区。
      </p>

      <div className="card divide-y" style={{ borderColor: "var(--border)" }}>
        {prompts.map((p) => (
          <div key={p.id} className="flex items-center gap-3 p-3">
            <div className="min-w-0 flex-1">
              <div className="font-medium truncate">{p.title}</div>
              <div className="text-xs truncate" style={{ color: "var(--text-muted)" }}>
                {p.authorName} · {p.category} · {p.uses} 次使用
              </div>
            </div>
            <form action={deletePrompt.bind(null, p.id)}>
              <button className="w-9 h-9 grid place-items-center rounded-full hover:bg-[var(--bg-subtle)]" title="删除" aria-label="删除">
                <Trash2 size={16} />
              </button>
            </form>
          </div>
        ))}
        {prompts.length === 0 && (
          <div className="p-6 text-center text-sm" style={{ color: "var(--text-muted)" }}>
            暂无提示词。
          </div>
        )}
      </div>
    </div>
  );
}
