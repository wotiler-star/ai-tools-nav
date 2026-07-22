"use client";

import Link from "next/link";
import { ThumbsUp, MessageSquare, Eye, Flame, Trophy } from "lucide-react";
import type { Post, Prompt } from "@/lib/types";

const TYPE_LABEL: Record<Post["type"], string> = {
  discussion: "讨论",
  question: "问答",
  share: "分享",
  showcase: "作品",
};
const TYPE_COLOR: Record<Post["type"], string> = {
  discussion: "var(--primary)",
  question: "var(--warning)",
  share: "var(--success)",
  showcase: "var(--accent)",
};

export function PostCard({ post }: { post: Post }) {
  return (
    <Link
      href={`/community/${post.id}`}
      className="card p-4 flex flex-col gap-2 hover:-translate-y-0.5 transition"
    >
      <div className="flex items-center gap-2 text-xs">
        <span
          className="px-2 py-0.5 rounded-full"
          style={{ background: "var(--primary-soft)", color: TYPE_COLOR[post.type] }}
        >
          {TYPE_LABEL[post.type]}
        </span>
        <span className="flex items-center gap-1" style={{ color: "var(--text-muted)" }}>
          {post.authorAvatar} {post.author}
        </span>
        <span style={{ color: "var(--text-muted)" }}>
          · {new Date(post.createdAt).toLocaleDateString("zh-CN")}
        </span>
      </div>
      <h3 className="font-semibold leading-snug">{post.title}</h3>
      <p className="text-sm line-clamp-2" style={{ color: "var(--text-muted)" }}>
        {post.content}
      </p>
      <div className="flex flex-wrap gap-1.5">
        {post.tags.map((t) => (
          <span key={t} className="chip !py-0.5 !text-xs">{t}</span>
        ))}
      </div>
      <div className="flex items-center gap-4 text-xs mt-auto pt-1" style={{ color: "var(--text-muted)" }}>
        <span className="flex items-center gap-1"><ThumbsUp size={13} /> {post.likes}</span>
        <span className="flex items-center gap-1"><MessageSquare size={13} /> {post.comments}</span>
        <span className="flex items-center gap-1"><Eye size={13} /> {post.views}</span>
      </div>
    </Link>
  );
}

export function PromptCard({ prompt }: { prompt: Prompt }) {
  return (
    <div className="card p-4 flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">{prompt.title}</h3>
        <span className="text-xs" style={{ color: "var(--text-muted)" }}>
          {prompt.uses.toLocaleString()} 次使用
        </span>
      </div>
      <pre className="text-xs line-clamp-3 whitespace-pre-wrap rounded-lg p-2" style={{ background: "var(--bg-subtle)" }}>
        {prompt.content}
      </pre>
      <div className="flex items-center justify-between mt-auto">
        <div className="flex flex-wrap gap-1">
          {prompt.tags.map((t) => (
            <span key={t} className="chip !py-0.5 !text-xs">{t}</span>
          ))}
        </div>
        <button
          className="flex items-center gap-1 text-xs px-2 py-1 rounded-lg hover:bg-[var(--bg-subtle)]"
          style={{ color: "var(--primary)" }}
          onClick={() => navigator.clipboard.writeText(prompt.content)}
        >
          <Flame size={13} /> 复制
        </button>
      </div>
    </div>
  );
}

export function RankList({ items }: { items: { name: string; value: string | number }[] }) {
  return (
    <ol className="space-y-2">
      {items.map((it, i) => (
        <li key={it.name} className="flex items-center gap-2 text-sm">
          <Trophy size={14} style={{ color: i < 3 ? "var(--warning)" : "var(--text-muted)" }} />
          <span className="flex-1 truncate">{it.name}</span>
          <span style={{ color: "var(--text-muted)" }}>{it.value}</span>
        </li>
      ))}
    </ol>
  );
}
