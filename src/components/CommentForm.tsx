"use client";

import { useState } from "react";
import { Send } from "lucide-react";

export default function CommentForm({ postId }: { postId: string }) {
  const [content, setContent] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit() {
    if (!content.trim()) return;
    setBusy(true);
    try {
      await fetch(`/api/posts/${postId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, author: "我" }),
      });
      setContent("");
      alert("评论已提交，审核通过后将展示（演示环境直接刷新可见）。");
      location.reload();
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="card p-4 flex flex-col gap-2">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="友善地发表你的看法…"
        rows={3}
        className="px-3 py-2 rounded-lg border outline-none text-sm resize-none"
        style={{ borderColor: "var(--border)", background: "var(--bg-elevated)" }}
      />
      <div className="flex justify-end">
        <button onClick={submit} disabled={busy} className="btn-primary flex items-center gap-1">
          <Send size={14} /> {busy ? "发送中…" : "发表评论"}
        </button>
      </div>
    </div>
  );
}
