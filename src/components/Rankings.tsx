"use client";

import { useState } from "react";
import Link from "next/link";
import { ExternalLink, Flame } from "lucide-react";
import type { Tool } from "@/lib/types";

const TABS = [
  { key: "daily", label: "今日热榜" },
  { key: "weekly", label: "本周收藏" },
  { key: "editor", label: "编辑精选" },
] as const;

function rankColor(i: number) {
  if (i === 0) return "#f59e0b";
  if (i === 1) return "#94a3b8";
  if (i === 2) return "#d97706";
  return "var(--text-muted)";
}

export default function Rankings({ tools }: { tools: Tool[] }) {
  const [tab, setTab] = useState<(typeof TABS)[number]["key"]>("daily");

  const sorted = [...tools].sort((a, b) =>
    tab === "daily"
      ? b.clicks - a.clicks
      : tab === "weekly"
      ? b.favorites - a.favorites
      : b.rating - a.rating
  );
  const list = sorted.slice(0, 10);

  return (
    <section className="mx-auto max-w-7xl px-4 py-8">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Flame style={{ color: "var(--accent)" }} /> 排行榜
        </h2>
        <Link href="/rankings" className="text-sm hover:underline" style={{ color: "var(--primary)" }}>
          完整榜单 →
        </Link>
      </div>

      <div className="card p-2 sm:p-4">
        <div className="flex gap-1 mb-4 border-b" style={{ borderColor: "var(--border)" }}>
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className="px-4 py-2 text-sm font-medium relative"
              style={{ color: tab === t.key ? "var(--primary)" : "var(--text-muted)" }}
            >
              {t.label}
              {tab === t.key && (
                <span
                  className="absolute left-2 right-2 -bottom-px h-0.5 rounded"
                  style={{ background: "var(--primary)" }}
                />
              )}
            </button>
          ))}
        </div>

        <ol className="divide-y" style={{ borderColor: "var(--border)" }}>
          {list.map((t, i) => (
            <li key={t.id} className="flex items-center gap-3 py-2.5">
              <span className="w-6 text-center font-bold" style={{ color: rankColor(i) }}>
                {i + 1}
              </span>
              <span className="w-9 h-9 grid place-items-center rounded-lg bg-[var(--bg-subtle)] text-lg">
                {t.logo ?? "🛠️"}
              </span>
              <div className="min-w-0 flex-1">
                <div className="font-medium truncate flex items-center gap-1">
                  {t.name}
                </div>
                <div className="text-xs truncate" style={{ color: "var(--text-muted)" }}>
                  {t.summary}
                </div>
              </div>
              <Link
                href={t.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs flex items-center gap-1 shrink-0 hover:underline"
                style={{ color: "var(--primary)" }}
              >
                访问 <ExternalLink size={12} />
              </Link>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
