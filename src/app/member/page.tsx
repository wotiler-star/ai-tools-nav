import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import ProfileEditor from "./ProfileEditor";
import { FileText, Heart, Pencil } from "lucide-react";

export const metadata: Metadata = {
  title: "会员中心",
  robots: { index: false, follow: false },
};

const ROLE_LABEL: Record<string, string> = {
  admin: "管理员",
  editor: "编辑",
  member: "会员",
};

const TYPE_LABEL: Record<string, string> = {
  discussion: "讨论",
  question: "问答",
  share: "分享",
  showcase: "展示",
};

function fmt(d: Date) {
  return new Date(d).toLocaleDateString("zh-CN", { year: "numeric", month: "2-digit", day: "2-digit" });
}

export default async function MemberPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      posts: { orderBy: { createdAt: "desc" }, take: 30 },
      likes: { include: { post: true }, orderBy: { id: "desc" }, take: 30 },
    },
  });
  if (!user) redirect("/login");

  const avatar = user.avatar ?? user.image ?? null;
  const initial = (user.name?.[0] ?? "🙂").toUpperCase();
  const roleLabel = ROLE_LABEL[user.role] ?? "会员";
  const likedPosts = user.likes.map((l) => l.post).filter(Boolean) as {
    id: string;
    title: string;
    likes: number;
  }[];

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">会员中心</h1>

      <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
        {/* 左侧：资料卡 + 编辑 */}
        <div className="space-y-6">
          <div className="card p-6">
            <div className="flex items-center gap-4">
              <span className="w-16 h-16 grid place-items-center rounded-2xl text-2xl font-bold bg-[var(--primary-soft)] text-[var(--primary)] overflow-hidden">
                {avatar ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={avatar} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  initial
                )}
              </span>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-lg truncate">{user.name}</span>
                  <span
                    className="text-xs px-2 py-0.5 rounded-full"
                    style={{
                      background:
                        user.role === "admin"
                          ? "color-mix(in srgb, #ef4444 16%, transparent)"
                          : "color-mix(in srgb, var(--primary) 14%, transparent)",
                      color: user.role === "admin" ? "#ef4444" : "var(--primary)",
                    }}
                  >
                    {roleLabel}
                  </span>
                </div>
                <p className="text-sm truncate" style={{ color: "var(--text-muted)" }}>
                  {user.email ?? "未绑定邮箱"}
                </p>
              </div>
            </div>

            {user.bio && <p className="text-sm mt-4" style={{ color: "var(--text-muted)" }}>{user.bio}</p>}

            <div className="flex gap-2 mt-5">
              <div className="flex-1 rounded-xl p-3 text-center" style={{ background: "var(--bg-subtle)" }}>
                <div className="text-lg font-bold">{user.posts.length}</div>
                <div className="text-xs" style={{ color: "var(--text-muted)" }}>发帖</div>
              </div>
              <div className="flex-1 rounded-xl p-3 text-center" style={{ background: "var(--bg-subtle)" }}>
                <div className="text-lg font-bold">{likedPosts.length}</div>
                <div className="text-xs" style={{ color: "var(--text-muted)" }}>点赞</div>
              </div>
              <div className="flex-1 rounded-xl p-3 text-center" style={{ background: "var(--bg-subtle)" }}>
                <div className="text-lg font-bold">{user.points}</div>
                <div className="text-xs" style={{ color: "var(--text-muted)" }}>积分</div>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center gap-2 mb-4 font-semibold">
              <Pencil size={16} /> 编辑资料
            </div>
            <ProfileEditor initial={{ name: user.name, bio: user.bio, avatar: user.avatar }} />
          </div>
        </div>

        {/* 右侧：我的发帖 / 我的点赞 */}
        <div className="space-y-6">
          <section className="card p-6">
            <div className="flex items-center gap-2 mb-4 font-semibold">
              <FileText size={16} /> 我的发帖
            </div>
            {user.posts.length === 0 ? (
              <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                还没有发过帖，去
                <Link href="/community" className="text-[var(--primary)]">
                  社区
                </Link>
                逛逛吧。
              </p>
            ) : (
              <ul className="divide-y" style={{ borderColor: "var(--border)" }}>
                {user.posts.map((p) => (
                  <li key={p.id} className="py-3 first:pt-0 last:pb-0">
                    <Link href={`/community/${p.id}`} className="font-medium hover:underline">
                      {p.title}
                    </Link>
                    <div className="flex items-center gap-3 mt-1 text-xs" style={{ color: "var(--text-muted)" }}>
                      <span className="px-1.5 py-0.5 rounded" style={{ background: "var(--bg-subtle)" }}>
                        {TYPE_LABEL[p.type] ?? p.type}
                      </span>
                      <span>❤ {p.likes}</span>
                      <span>💬 {p.comments}</span>
                      <span>{fmt(p.createdAt)}</span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="card p-6">
            <div className="flex items-center gap-2 mb-4 font-semibold">
              <Heart size={16} /> 我的点赞
            </div>
            {likedPosts.length === 0 ? (
              <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                还没有点赞任何帖子。
              </p>
            ) : (
              <ul className="divide-y" style={{ borderColor: "var(--border)" }}>
                {likedPosts.map((p) => (
                  <li key={p.id} className="py-3 first:pt-0 last:pb-0">
                    <Link href={`/community/${p.id}`} className="font-medium hover:underline">
                      {p.title}
                    </Link>
                    <div className="flex items-center gap-3 mt-1 text-xs" style={{ color: "var(--text-muted)" }}>
                      <span>❤ {p.likes}</span>
                      <span>{fmt(new Date())}</span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
