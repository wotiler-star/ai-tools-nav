import { signIn } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import Link from "next/link";

async function loginAction(formData: FormData) {
  "use server";
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");
  const res = await signIn("credentials", {
    email,
    password,
    redirect: false,
  });
  if (res?.error) redirect("/login?error=1");
  redirect("/");
}

async function registerAction(formData: FormData) {
  "use server";
  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");

  if (!name || !email || password.length < 6) {
    redirect("/login?error=invalid");
  }
  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) redirect("/login?error=exists");

  const passwordHash = await bcrypt.hash(password, 10);
  await prisma.user.create({
    data: { name, email, passwordHash, role: "member" },
  });
  await signIn("credentials", { email, password, redirectTo: "/" });
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error: err } = await searchParams;
  const errMsg =
    err === "1"
      ? "邮箱或密码错误"
      : err === "exists"
        ? "该邮箱已注册，请直接登录"
        : err === "invalid"
          ? "请填写完整信息，密码至少 6 位"
          : null;

  return (
    <main className="mx-auto max-w-md px-4 py-12">
      <div className="card p-8">
        <h1 className="text-2xl font-bold mb-1">登录 / 注册</h1>
        <p className="text-sm mb-6" style={{ color: "var(--text-muted)" }}>
          登录后可发帖、评论、收藏与关注；管理员可进入后台。
        </p>

        {errMsg && (
          <div
            className="mb-4 px-3 py-2 rounded-lg text-sm"
            style={{ background: "color-mix(in srgb, var(--accent) 12%, transparent)", color: "var(--accent)" }}
          >
            {errMsg}
          </div>
        )}

        {/* 登录 */}
        <form action={loginAction} className="flex flex-col gap-3">
          <input
            required
            type="email"
            name="email"
            placeholder="邮箱"
            defaultValue="admin@ainav.dev"
            className="h-11 px-3 rounded-lg border outline-none text-sm"
            style={{ borderColor: "var(--border)", background: "var(--bg-elevated)" }}
          />
          <input
            required
            type="password"
            name="password"
            placeholder="密码"
            defaultValue="admin123"
            className="h-11 px-3 rounded-lg border outline-none text-sm"
            style={{ borderColor: "var(--border)", background: "var(--bg-elevated)" }}
          />
          <button className="btn-primary h-11 mt-1">登录</button>
        </form>

        <div className="flex items-center gap-3 my-5" style={{ color: "var(--text-muted)" }}>
          <span className="h-px flex-1" style={{ background: "var(--border)" }} />
          <span className="text-xs">或注册新账号</span>
          <span className="h-px flex-1" style={{ background: "var(--border)" }} />
        </div>

        {/* 注册 */}
        <form action={registerAction} className="flex flex-col gap-3">
          <input
            required
            type="text"
            name="name"
            placeholder="昵称"
            className="h-11 px-3 rounded-lg border outline-none text-sm"
            style={{ borderColor: "var(--border)", background: "var(--bg-elevated)" }}
          />
          <input
            required
            type="email"
            name="email"
            placeholder="邮箱"
            className="h-11 px-3 rounded-lg border outline-none text-sm"
            style={{ borderColor: "var(--border)", background: "var(--bg-elevated)" }}
          />
          <input
            required
            type="password"
            name="password"
            placeholder="密码（至少 6 位）"
            className="h-11 px-3 rounded-lg border outline-none text-sm"
            style={{ borderColor: "var(--border)", background: "var(--bg-elevated)" }}
          />
          <button
            className="h-11 rounded-full border font-semibold"
            style={{ borderColor: "var(--border)" }}
            type="submit"
          >
            注册并登录
          </button>
        </form>

        <p className="text-xs mt-5" style={{ color: "var(--text-muted)" }}>
          演示账号：<code>admin@ainav.dev</code> / <code>admin123</code>（管理员，可在后台管理工具与内容）。
        </p>
        <Link href="/" className="text-xs block mt-2" style={{ color: "var(--primary)" }}>
          ← 返回首页
        </Link>
      </div>
    </main>
  );
}
