import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { updateTool, deleteTool } from "@/lib/admin-actions";

export const dynamic = "force-dynamic";

export default async function EditTool({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [tool, categories] = await Promise.all([
    prisma.tool.findUnique({ where: { id } }),
    prisma.category.findMany({ orderBy: { sort: "asc" } }),
  ]);
  if (!tool) notFound();

  const tags = (() => {
    try {
      return JSON.parse(tool.tags).join(", ");
    } catch {
      return "";
    }
  })();

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold mb-1">编辑工具</h1>
      <p className="text-sm mb-5" style={{ color: "var(--text-muted)" }}>
        {tool.name}
      </p>

      <form action={updateTool.bind(null, tool.id)} className="card p-5 space-y-3">
        <input name="name" defaultValue={tool.name} required placeholder="名称" className="h-10 px-3 w-full rounded-lg border outline-none text-sm" style={{ borderColor: "var(--border)", background: "var(--bg-elevated)" }} />
        <input name="url" defaultValue={tool.url} required placeholder="官网链接" className="h-10 px-3 w-full rounded-lg border outline-none text-sm" style={{ borderColor: "var(--border)", background: "var(--bg-elevated)" }} />
        <input name="summary" defaultValue={tool.summary} required placeholder="一句话简介" className="h-10 px-3 w-full rounded-lg border outline-none text-sm" style={{ borderColor: "var(--border)", background: "var(--bg-elevated)" }} />
        <textarea name="description" defaultValue={tool.description ?? ""} placeholder="详细介绍（可选）" rows={4} className="px-3 py-2 w-full rounded-lg border outline-none text-sm" style={{ borderColor: "var(--border)", background: "var(--bg-elevated)" }} />
        <select name="categoryId" defaultValue={tool.categoryId} required className="h-10 px-3 w-full rounded-lg border outline-none text-sm" style={{ borderColor: "var(--border)", background: "var(--bg-elevated)" }}>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
        <input name="tags" defaultValue={tags} placeholder="标签（逗号分隔）" className="h-10 px-3 w-full rounded-lg border outline-none text-sm" style={{ borderColor: "var(--border)", background: "var(--bg-elevated)" }} />
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="featured" defaultChecked={tool.featured} /> 设为精选（首页展示）
        </label>
        <div className="flex gap-3 pt-2">
          <button className="btn-primary h-10 px-6">保存修改</button>
        </div>
      </form>

      <form action={deleteTool.bind(null, tool.id)} className="mt-4">
        <button className="h-10 px-6 rounded-full border text-[var(--accent)]" style={{ borderColor: "var(--accent)" }}>
          删除此工具
        </button>
      </form>
    </div>
  );
}
