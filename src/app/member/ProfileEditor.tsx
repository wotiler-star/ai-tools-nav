"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateProfile } from "@/app/member/actions";
import { Loader2, Check } from "lucide-react";

export default function ProfileEditor({
  initial,
}: {
  initial: { name: string; bio?: string | null; avatar?: string | null };
}) {
  const router = useRouter();
  const [name, setName] = useState(initial.name ?? "");
  const [bio, setBio] = useState(initial.bio ?? "");
  const [avatar, setAvatar] = useState(initial.avatar ?? "");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [ok, setOk] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    setOk(false);
    setLoading(true);
    const fd = new FormData();
    fd.set("name", name);
    fd.set("bio", bio);
    fd.set("avatar", avatar);
    const res = await updateProfile(fd);
    setLoading(false);
    if (!res.ok) return setMsg(res.message ?? "保存失败");
    setOk(true);
    setMsg("资料已保存");
    router.refresh();
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-3">
      <div>
        <label className="text-xs mb-1 block" style={{ color: "var(--text-muted)" }}>
          昵称
        </label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="h-11 w-full px-3 rounded-lg border outline-none text-sm"
          style={{ borderColor: "var(--border)", background: "var(--bg)" }}
        />
      </div>
      <div>
        <label className="text-xs mb-1 block" style={{ color: "var(--text-muted)" }}>
          头像地址（可选，留空则显示首字母）
        </label>
        <input
          value={avatar}
          onChange={(e) => setAvatar(e.target.value)}
          placeholder="https://..."
          className="h-11 w-full px-3 rounded-lg border outline-none text-sm"
          style={{ borderColor: "var(--border)", background: "var(--bg)" }}
        />
      </div>
      <div>
        <label className="text-xs mb-1 block" style={{ color: "var(--text-muted)" }}>
          个人简介（可选）
        </label>
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          rows={3}
          placeholder="介绍一下你自己…"
          className="w-full px-3 py-2 rounded-lg border outline-none text-sm resize-none"
          style={{ borderColor: "var(--border)", background: "var(--bg)" }}
        />
      </div>

      {msg && (
        <div
          className="px-3 py-2 rounded-lg text-sm"
          style={
            ok
              ? { background: "color-mix(in srgb, #16a34a 14%, transparent)", color: "#16a34a" }
              : { background: "color-mix(in srgb, var(--accent) 12%, transparent)", color: "var(--accent)" }
          }
        >
          {ok && <Check size={14} className="inline mr-1" />}
          {msg}
        </div>
      )}

      <button type="submit" disabled={loading} className="btn-primary h-11 flex items-center justify-center gap-2">
        {loading && <Loader2 size={16} className="animate-spin" />}
        保存资料
      </button>
    </form>
  );
}
