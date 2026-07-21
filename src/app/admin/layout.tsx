import type { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/lib/auth-helpers";
import { adminSignOut } from "@/lib/admin-actions";
import {
  LayoutDashboard,
  Boxes,
  MessageSquare,
  Sparkles,
  Plug,
  Puzzle,
  ExternalLink,
  LogOut,
} from "lucide-react";

export const metadata: Metadata = {
  title: "后台管理",
  robots: { index: false, follow: false },
};

const NAV = [
  { href: "/admin", label: "概览", icon: LayoutDashboard, exact: true },
  { href: "/admin/tools", label: "工具管理", icon: Boxes },
  { href: "/admin/posts", label: "内容审核", icon: MessageSquare },
  { href: "/admin/prompts", label: "提示词", icon: Sparkles },
  { href: "/admin/mcp", label: "MCP 服务", icon: Plug },
  { href: "/admin/skills", label: "Skills 技能", icon: Puzzle },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdmin();

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 grid md:grid-cols-[200px_1fr] gap-6">
      <aside className="md:sticky md:top-20 h-fit">
        <div className="card p-3 space-y-1">
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium hover:bg-[var(--bg-subtle)]"
            >
              <n.icon size={16} /> {n.label}
            </Link>
          ))}
          <div className="my-2 h-px" style={{ background: "var(--border)" }} />
          <Link
            href="/"
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm hover:bg-[var(--bg-subtle)]"
            style={{ color: "var(--text-muted)" }}
          >
            <ExternalLink size={16} /> 查看站点
          </Link>
          <form action={adminSignOut}>
            <button
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm w-full text-left hover:bg-[var(--bg-subtle)]"
              style={{ color: "var(--text-muted)" }}
            >
              <LogOut size={16} /> 退出登录
            </button>
          </form>
        </div>
      </aside>
      <section>{children}</section>
    </div>
  );
}
