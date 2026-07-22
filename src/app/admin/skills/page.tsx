import Link from "next/link";
import { prisma } from "@/lib/prisma";
import {
  approveSkill,
  rejectSkill,
  deleteSkill,
  toggleSkillFeatured,
} from "@/lib/admin-actions";
import { Check, X, Trash2, Star, Plus } from "lucide-react";
import CopyButton from "@/components/CopyButton";

export const dynamic = "force-dynamic";

const STATUS_LABEL: Record<string, string> = {
  PENDING: "待审核",
  PUBLISHED: "已发布",
  REJECTED: "已拒绝",
};

export default async function AdminSkills() {
  const skills = await prisma.skill.findMany({
    orderBy: [{ status: "asc" }, { createdAt: "desc" }],
  });

  const pending = skills.filter((s) => s.status === "PENDING").length;

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <h1 className="text-2xl font-bold">Skills 技能管理</h1>
        <Link href="/submit/skill" className="btn-primary flex items-center gap-1 text-sm">
          <Plus size={16} /> 去提交
        </Link>
      </div>
      <p className="text-sm mb-5" style={{ color: "var(--text-muted)" }}>
        共 {skills.length} 个 Skill，其中 {pending} 个待审核。通过后会展示在技能库与首页。
      </p>

      <div className="card divide-y" style={{ borderColor: "var(--border)" }}>
        {skills.map((s) => (
          <div key={s.id} className="flex items-center gap-3 p-3">
            <div className="w-10 h-10 grid place-items-center rounded-lg bg-[var(--bg-subtle)] text-lg shrink-0">
              {s.logo || "🧩"}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="font-medium truncate">{s.name}</span>
                <span
                  className="text-xs px-2 py-0.5 rounded-full shrink-0"
                  style={
                    s.status === "PUBLISHED"
                      ? { background: "var(--primary-soft)", color: "var(--primary)" }
                      : s.status === "PENDING"
                      ? { background: "color-mix(in srgb, var(--warning) 16%, transparent)", color: "var(--warning)" }
                      : { background: "var(--bg-subtle)", color: "var(--text-muted)" }
                  }
                >
                  {STATUS_LABEL[s.status] ?? s.status}
                </span>
              </div>
              <div className="text-xs truncate" style={{ color: "var(--text-muted)" }}>
                {s.category} · {s.author} · 📥{s.uses} 次使用
              </div>
            </div>
            <code className="hidden md:block text-xs truncate max-w-[200px]" style={{ color: "var(--text-muted)" }}>
              {s.installCmd}
            </code>
            {s.status !== "PUBLISHED" && (
              <form action={approveSkill.bind(null, s.id)}>
                <button className="w-9 h-9 grid place-items-center rounded-full hover:bg-[var(--bg-subtle)]" title="通过" aria-label="通过">
                  <Check size={16} style={{ color: "var(--success)" }} />
                </button>
              </form>
            )}
            {s.status !== "REJECTED" && (
              <form action={rejectSkill.bind(null, s.id)}>
                <button className="w-9 h-9 grid place-items-center rounded-full hover:bg-[var(--bg-subtle)]" title="拒绝" aria-label="拒绝">
                  <X size={16} style={{ color: "var(--warning)" }} />
                </button>
              </form>
            )}
            <form action={toggleSkillFeatured.bind(null, s.id)}>
              <button className="w-9 h-9 grid place-items-center rounded-full hover:bg-[var(--bg-subtle)]" title="切换精选" aria-label="切换精选">
                <Star size={16} className={s.featured ? "fill-[var(--warning)] text-[var(--warning)]" : ""} />
              </button>
            </form>
            <CopyButton
              text={s.installCmd}
              className="w-9 h-9 grid place-items-center rounded-full hover:bg-[var(--bg-subtle)]"
              title="复制安装命令"
              label="复制安装命令"
            />
            <form action={deleteSkill.bind(null, s.id)}>
              <button className="w-9 h-9 grid place-items-center rounded-full hover:bg-[var(--bg-subtle)]" title="删除" aria-label="删除">
                <Trash2 size={16} />
              </button>
            </form>
          </div>
        ))}
        {skills.length === 0 && (
          <div className="p-6 text-center text-sm" style={{ color: "var(--text-muted)" }}>
            还没有 Skill，去 <Link href="/submit/skill" className="underline" style={{ color: "var(--primary)" }}>提交一个</Link> 吧。
          </div>
        )}
      </div>
    </div>
  );
}
