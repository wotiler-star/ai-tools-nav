import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { updateNews } from "@/lib/news-actions";
import { parseJsonTags } from "@/lib/format";

export const dynamic = "force-dynamic";

function Field({
  label,
  name,
  required,
  textarea,
  big,
  placeholder,
  defaultValue,
}: {
  label: string;
  name: string;
  required?: boolean;
  textarea?: boolean;
  big?: boolean;
  placeholder?: string;
  defaultValue?: string;
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium block mb-1">
        {label}
        {required && <span style={{ color: "var(--accent)" }}> *</span>}
      </span>
      {textarea ? (
        <textarea
          name={name}
          defaultValue={defaultValue}
          placeholder={placeholder}
          rows={big ? 12 : 3}
          className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-[var(--primary)]"
          style={{ borderColor: "var(--border)", background: "var(--bg-elevated)" }}
        />
      ) : (
        <input
          name={name}
          defaultValue={defaultValue}
          placeholder={placeholder}
          className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-[var(--primary)]"
          style={{ borderColor: "var(--border)", background: "var(--bg-elevated)" }}
        />
      )}
    </label>
  );
}

export default async function EditNews({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const n = await prisma.news.findUnique({ where: { id } });
  if (!n) notFound();

  const tags = parseJsonTags(n.tags).join(", ");

  return (
    <div className="max-w-3xl">
      <Link
        href="/admin/news"
        className="text-sm hover:underline"
        style={{ color: "var(--text-muted)" }}
      >
        ← 返回资讯列表
      </Link>
      <h1 className="text-2xl font-bold mt-2 mb-5">编辑资讯</h1>

      <form action={updateNews.bind(null, n.id)} className="card p-5 space-y-4">
        <Field label="标题" name="title" required defaultValue={n.title} />
        <Field label="slug" name="slug" defaultValue={n.slug} />
        <Field label="摘要" name="summary" textarea defaultValue={n.summary} />
        <Field label="正文" name="content" textarea big defaultValue={n.content} />
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="来源" name="source" defaultValue={n.source} />
          <Field label="原文链接" name="sourceUrl" defaultValue={n.sourceUrl ?? ""} />
        </div>
        <Field label="封面" name="cover" defaultValue={n.cover ?? ""} />
        <Field label="标签（逗号分隔）" name="tags" defaultValue={tags} />
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="published" defaultChecked={n.published} />
          立即发布
        </label>
        <button type="submit" className="btn-primary">
          保存修改
        </button>
      </form>
    </div>
  );
}
