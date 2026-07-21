import Link from "next/link";
import { Download, Copy } from "lucide-react";
import { featuredSkills } from "@/lib/entries";

export default async function SkillSection() {
  const items = await featuredSkills(6);
  if (items.length === 0) return null;

  return (
    <section id="skills" className="mx-auto max-w-7xl px-4 py-8 scroll-mt-20">
      <div className="flex items-end justify-between mb-5">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <span>🧩</span> Skills 技能库{" "}
          <span className="text-base font-normal" style={{ color: "var(--text-muted)" }}>
            / 一键安装 AI 能力包
          </span>
        </h2>
        <Link href="/skills" className="text-sm hover:underline" style={{ color: "var(--primary)" }}>
          查看全部 →
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((s) => (
          <Link
            key={s.id}
            href="/skills"
            className="card p-5 flex flex-col gap-3 hover:-translate-y-0.5 transition"
          >
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
            <div
              className="flex items-center justify-between gap-2 rounded-lg px-3 py-2"
              style={{ background: "var(--bg-subtle)" }}
            >
              <code className="text-xs truncate" style={{ color: "var(--text)" }}>{s.installCmd}</code>
              <Copy size={15} className="shrink-0" style={{ color: "var(--text-muted)" }} />
            </div>
            <div className="flex items-center gap-1 text-xs mt-auto" style={{ color: "var(--text-muted)" }}>
              <Download size={13} /> {s.uses.toLocaleString()} 次使用
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
