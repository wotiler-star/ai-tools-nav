"use client";

import Link from "next/link";
import { Copy, Sparkles } from "lucide-react";
import { prompts } from "@/lib/mock-data";

export default function PromptSquare() {
  return (
    <section id="prompts" className="mx-auto max-w-7xl px-4 py-8 scroll-mt-20">
      <div className="flex items-end justify-between mb-5">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Sparkles style={{ color: "var(--primary)" }} /> AI 绘图提示词{" "}
          <span className="text-base font-normal" style={{ color: "var(--text-muted)" }}>
            / AI 文字提示词
          </span>
        </h2>
        <Link href="/community?tab=prompts" className="text-sm hover:underline" style={{ color: "var(--primary)" }}>
          全部绘图提示词 →
        </Link>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {prompts.map((p) => (
          <div key={p.id} className="card p-4 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">{p.title}</h3>
              <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                {p.uses.toLocaleString()} 次使用
              </span>
            </div>
            <pre className="text-xs line-clamp-3 whitespace-pre-wrap rounded-lg p-2" style={{ background: "var(--bg-subtle)", color: "var(--text)" }}>
              {p.content}
            </pre>
            <div className="flex items-center justify-between mt-auto">
              <div className="flex flex-wrap gap-1">
                {p.tags.map((t) => (
                  <span key={t} className="chip !py-0.5 !text-xs">{t}</span>
                ))}
              </div>
              <button
                className="flex items-center gap-1 text-xs px-2 py-1 rounded-lg hover:bg-[var(--bg-subtle)]"
                style={{ color: "var(--primary)" }}
                onClick={() => navigator.clipboard.writeText(p.content)}
                title="复制提示词"
              >
                <Copy size={13} /> 复制
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
