"use client";

import { useState } from "react";
import Link from "next/link";
import { Copy, Check, Search, Download, PlusCircle, CheckCircle2 } from "lucide-react";
import type { Skill } from "@/lib/types";

export default function SkillGrid({
  items,
  categories,
  submitted = false,
}: {
  items: Skill[];
  categories: string[];
  submitted?: boolean;
}) {
  const [cat, setCat] = useState("全部");
  const [q, setQ] = useState("");
  const [copied, setCopied] = useState<string | null>(null);

  const list = items.filter(
    (s) =>
      (cat === "全部" || s.category === cat) &&
      (q === "" ||
        s.name.toLowerCase().includes(q.toLowerCase()) ||
        s.summary.includes(q))
  );

  function copy(cmd: string, id: string) {
    navigator.clipboard.writeText(cmd);
    setCopied(id);
    setTimeout(() => setCopied(null), 1500);
  }

  return (
    <main>
      <section className="hero-gradient">
        <div className="mx-auto max-w-7xl px-4 py-10">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">🧩</span>
            <h1 className="text-3xl font-bold">
              <span className="text-gradient">Skills</span> 技能库
            </h1>
          </div>
          <p className="text-sm max-w-2xl" style={{ color: "var(--text-muted)" }}>
            可复用的 AI 技能包：一键安装到支持 Skills 的客户端，让助手具备写作、编程、绘画、检索等专项能力。复制安装命令即可上手。
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-2">
            <div
              className="flex items-center gap-2 px-4 h-11 w-full max-w-md rounded-full border"
              style={{ borderColor: "var(--border)", background: "var(--bg-elevated)" }}
            >
              <Search size={18} className="text-[var(--text-muted)]" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="搜索技能…"
                className="bg-transparent outline-none text-sm w-full"
              />
            </div>
            <Link href="/submit/skill" className="btn-primary flex items-center gap-1 text-sm h-11">
              <PlusCircle size={16} /> 提交 Skill
            </Link>
          </div>
        </div>
      </section>

      {submitted && (
        <div className="mx-auto max-w-7xl px-4 mt-6">
          <div
            className="flex items-center gap-2 rounded-lg px-4 py-3 text-sm"
            style={{ background: "var(--primary-soft)", color: "var(--primary)" }}
          >
            <CheckCircle2 size={16} /> 提交成功，感谢贡献！我们将在审核通过后展示到技能库。
          </div>
        </div>
      )}

      <section className="mx-auto max-w-7xl px-4 py-8">
        <div className="flex flex-wrap gap-2 mb-6">
          {["全部", ...categories].map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className="chip"
              style={
                cat === c
                  ? { borderColor: "var(--primary)", color: "var(--primary)", background: "var(--primary-soft)" }
                  : undefined
              }
            >
              {c}
            </button>
          ))}
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((s) => (
            <div key={s.id} className="card p-5 flex flex-col gap-3 hover:-translate-y-0.5 transition">
              <div className="flex items-start gap-3">
                <span className="text-3xl">{s.logo}</span>
                <div className="min-w-0">
                  <h3 className="font-semibold text-lg leading-tight">{s.name}</h3>
                  <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                    {s.category} · {s.author}
                  </span>
                </div>
                {s.featured && (
                  <span className="chip self-start ml-auto" style={{ color: "var(--accent)", borderColor: "var(--accent)" }}>
                    精选
                  </span>
                )}
              </div>
              <p className="text-sm line-clamp-2" style={{ color: "var(--text-muted)" }}>
                {s.summary}
              </p>
              <div className="flex flex-wrap gap-1">
                {s.tags.map((t) => (
                  <span key={t} className="chip !py-0.5 !text-xs">{t}</span>
                ))}
              </div>
              <div
                className="flex items-center justify-between gap-2 rounded-lg px-3 py-2 cursor-pointer"
                style={{ background: "var(--bg-subtle)" }}
                onClick={() => copy(s.installCmd, s.id)}
                title="点击复制安装命令"
              >
                <code className="text-xs truncate" style={{ color: "var(--text)" }}>{s.installCmd}</code>
                {copied === s.id ? (
                  <Check size={15} style={{ color: "var(--success)" }} />
                ) : (
                  <Copy size={15} className="shrink-0" style={{ color: "var(--text-muted)" }} />
                )}
              </div>
              <div className="flex items-center gap-1 text-xs mt-auto" style={{ color: "var(--text-muted)" }}>
                <Download size={13} /> {s.uses.toLocaleString()} 次使用
              </div>
            </div>
          ))}
        </div>

        {list.length === 0 && (
          <p className="text-center text-sm py-16" style={{ color: "var(--text-muted)" }}>
            没有匹配的技能，换个关键词试试。
          </p>
        )}
      </section>
    </main>
  );
}
