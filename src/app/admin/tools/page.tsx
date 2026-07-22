import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { createTool, toggleFeatured, deleteTool, approveTool, rejectTool } from "@/lib/admin-actions";
import { Pencil, Star, Trash2, Plus, Check, X } from "lucide-react";

export const dynamic = "force-dynamic";

function StatusBadge({ status }: { status: string }) {
  if (status === "PENDING") {
    return <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "color-mix(in srgb, var(--warning) 16%, transparent)", color: "var(--warning)" }}>待审核</span>;
  }
  if (status === "REJECTED") {
    return <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "color-mix(in srgb, #ef4444 12%, transparent)", color: "#ef4444" }}>已拒绝</span>;
  }
  return <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "color-mix(in srgb, var(--success) 14%, transparent)", color: "var(--success)" }}>已发布</span>;
}

export default async function AdminTools() {
  const [tools, categories] = await Promise.all([
    prisma.tool.findMany({
      include: { category: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.category.findMany({ orderBy: { sort: "asc" } }),
  ]);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-1">工具管理</h1>
      <p className="text-sm mb-5" style={{ color: "var(--text-muted)" }}>
        共 {tools.length} 个工具，其中 {tools.filter((t) => t.status === "PENDING").length} 个待审核。
        新增工具会出现在首页「精选」与对应分类页。
      </p>

      {/* 新增表单（管理员直接创建，默认 PUBLISHED） */}
      <form
        action={createTool}
        className="card p-4 mb-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-3"
      >
        <input name="name" required placeholder="名称" className="h-10 px-3 rounded-lg border outline-none text-sm" style={{ borderColor: "var(--border)", background: "var(--bg-elevated)" }} />
        <input name="slug" required placeholder="slug（唯一，如 chatgpt）" className="h-10 px-3 rounded-lg border outline-none text-sm" style={{ borderColor: "var(--border)", background: "var(--bg-elevated)" }} />
        <input name="url" required placeholder="官网链接 https://" className="h-10 px-3 rounded-lg border outline-none text-sm" style={{ borderColor: "var(--border)", background: "var(--bg-elevated)" }} />
        <input name="summary" required placeholder="一句话简介" className="h-10 px-3 rounded-lg border outline-none text-sm sm:col-span-2" style={{ borderColor: "var(--border)", background: "var(--bg-elevated)" }} />
        <select name="categoryId" required className="h-10 px-3 rounded-lg border outline-none text-sm" style={{ borderColor: "var(--border)", background: "var(--bg-elevated)" }}>
          <option value="">选择分类</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
        <input name="tags" placeholder="标签（逗号分隔）" className="h-10 px-3 rounded-lg border outline-none text-sm" style={{ borderColor: "var(--border)", background: "var(--bg-elevated)" }} />
        <label className="flex items-center gap-2 text-sm sm:col-span-2 lg:col-span-1">
          <input type="checkbox" name="featured" /> 设为精选（首页展示）
        </label>
        <button className="btn-primary h-10 flex items-center justify-center gap-1 sm:col-span-2 lg:col-span-3">
          <Plus size={16} /> 添加工具
        </button>
      </form>

      {/* 列表 */}
      <div className="card divide-y" style={{ borderColor: "var(--border)" }}>
        {tools.map((t) => (
          <div key={t.id} className="flex items-center gap-3 p-3">
            <div className="w-10 h-10 grid place-items-center rounded-lg bg-[var(--bg-subtle)] text-lg">
              {t.logo || "🔧"}
            </div>
            <div className="min-w-0 flex-1">
              <div className="font-medium truncate flex items-center gap-2">
                {t.name}
                <StatusBadge status={t.status} />
              </div>
              <div className="text-xs truncate" style={{ color: "var(--text-muted)" }}>
                {t.category?.name} · {t.clicks} 访问 · {t.favorites} 收藏
              </div>
            </div>
            {t.featured && (
              <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "var(--primary-soft)", color: "var(--primary)" }}>
                精选
              </span>
            )}
            {/* 审核按钮（仅待审核状态显示） */}
            {t.status === "PENDING" && (
              <>
                <form action={approveTool.bind(null, t.id)}>
                  <button className="w-9 h-9 grid place-items-center rounded-full hover:bg-[var(--bg-subtle)] text-green-600" title="通过审核" aria-label="通过">
                    <Check size={16} />
                  </button>
                </form>
                <form action={rejectTool.bind(null, t.id)}>
                  <button className="w-9 h-9 grid place-items-center rounded-full hover:bg-[var(--bg-subtle)] text-red-500" title="拒绝" aria-label="拒绝">
                    <X size={16} />
                  </button>
                </form>
              </>
            )}
            {/* 已发布的工具显示操作按钮 */}
            {t.status !== "PENDING" && (
              <>
                <form action={toggleFeatured.bind(null, t.id)}>
                  <button className="w-9 h-9 grid place-items-center rounded-full hover:bg-[var(--bg-subtle)]" title="切换精选" aria-label="切换精选">
                    <Star size={16} className={t.featured ? "fill-[var(--warning)] text-[var(--warning)]" : ""} />
                  </button>
                </form>
              </>
            )}
            <Link href={`/admin/tools/${t.id}`} className="w-9 h-9 grid place-items-center rounded-full hover:bg-[var(--bg-subtle)]" title="编辑" aria-label="编辑">
              <Pencil size={16} />
            </Link>
            <form action={deleteTool.bind(null, t.id)}>
              <button className="w-9 h-9 grid place-items-center rounded-full hover:bg-[var(--bg-subtle)]" title="删除" aria-label="删除">
                <Trash2 size={16} />
              </button>
            </form>
          </div>
        ))}
        {tools.length === 0 && (
          <div className="p-6 text-center text-sm" style={{ color: "var(--text-muted)" }}>
            还没有工具，先添加一个吧。
          </div>
        )}
      </div>
    </div>
  );
}
