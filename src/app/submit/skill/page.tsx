"use client";

import { useActionState } from "react";
import Link from "next/link";
import { PlusCircle, AlertCircle, ArrowLeft } from "lucide-react";
import { submitSkill } from "@/lib/submit-actions";
import { skillCategories } from "@/lib/mock-data";

export default function SubmitSkillPage() {
  const [state, formAction, pending] = useActionState(submitSkill, {});
  const cats = skillCategories.filter((c) => c !== "全部");

  return (
    <main className="mx-auto max-w-2xl px-4 py-8">
      <Link href="/skills" className="inline-flex items-center gap-1 text-sm mb-4 hover:underline" style={{ color: "var(--text-muted)" }}>
        <ArrowLeft size={15} /> 返回 Skills 技能库
      </Link>
      <h1 className="text-2xl font-bold mb-1 flex items-center gap-2">
        <PlusCircle style={{ color: "var(--primary)" }} /> 提交 Skill 技能
      </h1>
      <p className="text-sm mb-6" style={{ color: "var(--text-muted)" }}>
        分享你的 AI 技能包，提交后由编辑审核，通过即上线到技能库。
      </p>

      {state.error && (
        <div className="flex items-center gap-2 rounded-lg px-4 py-3 text-sm mb-4" style={{ background: "color-mix(in srgb, var(--warning) 14%, transparent)", color: "var(--warning)" }}>
          <AlertCircle size={16} /> {state.error}
        </div>
      )}

      <form action={formAction} className="card p-6 flex flex-col gap-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <label className="flex flex-col gap-1 text-sm">
            技能名称 <span style={{ color: "var(--text-muted)" }}>（必填）</span>
            <input name="name" required placeholder="如 doc-writer" className="h-11 px-3 rounded-lg border outline-none text-sm" style={{ borderColor: "var(--border)", background: "var(--bg-elevated)" }} />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            分类 <span style={{ color: "var(--text-muted)" }}>（必填）</span>
            <select name="category" required className="h-11 px-3 rounded-lg border outline-none text-sm" style={{ borderColor: "var(--border)", background: "var(--bg-elevated)" }}>
              <option value="">选择分类</option>
              {cats.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </label>
        </div>
        <label className="flex flex-col gap-1 text-sm">
          安装命令 <span style={{ color: "var(--text-muted)" }}>（必填）</span>
          <input name="installCmd" required placeholder="npx skills add your-skill" className="h-11 px-3 rounded-lg border outline-none text-sm font-mono" style={{ borderColor: "var(--border)", background: "var(--bg-elevated)" }} />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          一句话简介 <span style={{ color: "var(--text-muted)" }}>（必填）</span>
          <textarea name="summary" required placeholder="这个 Skill 能做什么？" rows={3} className="px-3 py-2 rounded-lg border outline-none text-sm resize-none" style={{ borderColor: "var(--border)", background: "var(--bg-elevated)" }} />
        </label>
        <div className="grid sm:grid-cols-2 gap-4">
          <label className="flex flex-col gap-1 text-sm">
            作者（可选）
            <input name="author" placeholder="AI 导航" className="h-11 px-3 rounded-lg border outline-none text-sm" style={{ borderColor: "var(--border)", background: "var(--bg-elevated)" }} />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            Logo（单个 emoji，可选）
            <input name="logo" maxLength={4} placeholder="🧩" className="h-11 px-3 rounded-lg border outline-none text-sm" style={{ borderColor: "var(--border)", background: "var(--bg-elevated)" }} />
          </label>
        </div>
        <label className="flex flex-col gap-1 text-sm">
          标签（逗号分隔，可选）
          <input name="tags" placeholder="文档, 写作, 润色" className="h-11 px-3 rounded-lg border outline-none text-sm" style={{ borderColor: "var(--border)", background: "var(--bg-elevated)" }} />
        </label>
        <button type="submit" disabled={pending} className="btn-primary self-start disabled:opacity-60">
          {pending ? "提交中…" : "提交审核"}
        </button>
      </form>
    </main>
  );
}
