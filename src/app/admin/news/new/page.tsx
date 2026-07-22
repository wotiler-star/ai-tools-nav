import Link from "next/link";
import { createNews } from "@/lib/news-actions";

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

export default function NewNews() {
  return (
    <div className="max-w-3xl">
      <Link
        href="/admin/news"
        className="text-sm hover:underline"
        style={{ color: "var(--text-muted)" }}
      >
        ← 返回资讯列表
      </Link>
      <h1 className="text-2xl font-bold mt-2 mb-5">新建资讯</h1>

      <form action={createNews} className="card p-5 space-y-4">
        <Field label="标题" name="title" required placeholder="如：OpenAI 发布多模态新模型" />
        <Field label="slug（留空自动生成）" name="slug" placeholder="openai-multimodal-model" />
        <Field label="摘要" name="summary" textarea placeholder="一句话摘要，展示在列表与详情页顶部" />
        <Field label="正文（支持换行，段落间空一行）" name="content" textarea big placeholder="正文内容…" />
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="来源" name="source" placeholder="如：OpenAI Blog" />
          <Field label="原文链接" name="sourceUrl" placeholder="https://…（可留空）" />
        </div>
        <Field label="封面（渐变 CSS 或 emoji）" name="cover" placeholder="如 linear-gradient(135deg,#1a1a2e,#0f3460) 或 📰" />
        <Field label="标签（逗号分隔）" name="tags" placeholder="AI, 大模型, 产品" />
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="published" defaultChecked />
          立即发布
        </label>
        <button type="submit" className="btn-primary">
          保存
        </button>
      </form>
    </div>
  );
}
