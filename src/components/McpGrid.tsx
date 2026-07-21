"use client";

import { useState } from "react";
import Link from "next/link";
import { Star, Download, ExternalLink, Search, PlusCircle, CheckCircle2 } from "lucide-react";
import type { McpServer } from "@/lib/types";

export default function McpGrid({
  items,
  categories,
  submitted = false,
}: {
  items: McpServer[];
  categories: string[];
  submitted?: boolean;
}) {
  const [cat, setCat] = useState("全部");
  const [q, setQ] = useState("");

  const list = items.filter(
    (m) =>
      (cat === "全部" || m.category === cat) &&
      (q === "" ||
        m.name.toLowerCase().includes(q.toLowerCase()) ||
        m.summary.includes(q))
  );

  return (
    <main>
      <section className="hero-gradient">
        <div className="mx-auto max-w-7xl px-4 py-10">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">🔌</span>
            <h1 className="text-3xl font-bold">
              <span className="text-gradient">MCP 服务</span> 广场
            </h1>
          </div>
          <p className="text-sm max-w-2xl" style={{ color: "var(--text-muted)" }}>
            Model Context Protocol 让 AI 助手安全连接文件系统、数据库、浏览器与外部工具。挑一个服务，复制到你的客户端即可扩展能力。
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
                placeholder="搜索 MCP 服务…"
                className="bg-transparent outline-none text-sm w-full"
              />
            </div>
            <Link href="/submit/mcp" className="btn-primary flex items-center gap-1 text-sm h-11">
              <PlusCircle size={16} /> 提交 MCP
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
            <CheckCircle2 size={16} /> 提交成功，感谢贡献！我们将在审核通过后展示到广场。
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
          {list.map((m) => (
            <div key={m.id} className="card p-5 flex flex-col gap-3 hover:-translate-y-0.5 transition">
              <div className="flex items-start gap-3">
                <span className="text-3xl">{m.logo}</span>
                <div className="min-w-0">
                  <h3 className="font-semibold text-lg leading-tight">{m.name}</h3>
                  <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                    {m.category}
                  </span>
                </div>
                {m.featured && (
                  <span className="chip self-start ml-auto" style={{ color: "var(--accent)", borderColor: "var(--accent)" }}>
                    精选
                  </span>
                )}
              </div>
              <p className="text-sm line-clamp-2" style={{ color: "var(--text-muted)" }}>
                {m.summary}
              </p>
              <div className="flex flex-wrap gap-1">
                {m.tags.map((t) => (
                  <span key={t} className="chip !py-0.5 !text-xs">{t}</span>
                ))}
              </div>
              <div className="flex items-center gap-4 text-xs mt-auto" style={{ color: "var(--text-muted)" }}>
                <span className="flex items-center gap-1"><Star size={13} /> {m.stars.toLocaleString()}</span>
                <span className="flex items-center gap-1"><Download size={13} /> {m.installs.toLocaleString()}</span>
                <a
                  href={m.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-auto flex items-center gap-1 font-medium"
                  style={{ color: "var(--primary)" }}
                >
                  使用 <ExternalLink size={13} />
                </a>
              </div>
            </div>
          ))}
        </div>

        {list.length === 0 && (
          <p className="text-center text-sm py-16" style={{ color: "var(--text-muted)" }}>
            没有匹配的 MCP 服务，换个关键词试试。
          </p>
        )}
      </section>
    </main>
  );
}
