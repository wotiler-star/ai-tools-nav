import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Boxes, MessageSquare, Sparkles, Users, Plug, Puzzle, Newspaper } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const [tools, toolsPending, postsTotal, pending, users, prompts, mcpTotal, mcpPending, skillTotal, skillPending, newsTotal, newsDraft] =
    await Promise.all([
      prisma.tool.count(),
      prisma.tool.count({ where: { status: "PENDING" } }),
      prisma.post.count(),
      prisma.post.count({ where: { status: "PENDING" } }),
      prisma.user.count(),
      prisma.prompt.count(),
      prisma.mcpServer.count(),
      prisma.mcpServer.count({ where: { status: "PENDING" } }),
      prisma.skill.count(),
      prisma.skill.count({ where: { status: "PENDING" } }),
      prisma.news.count(),
      prisma.news.count({ where: { published: false } }),
    ]);

  const cards = [
    { label: "工具总数", value: tools, href: "/admin/tools", icon: Boxes, warn: toolsPending > 0, sub: `${toolsPending} 待审核` },
    { label: "AI 资讯", value: newsTotal, href: "/admin/news", icon: Newspaper, warn: newsDraft > 0, sub: `${newsDraft} 草稿` },
    { label: "MCP 服务", value: mcpTotal, href: "/admin/mcp", icon: Plug, warn: mcpPending > 0, sub: `${mcpPending} 待审核` },
    { label: "Skills 技能", value: skillTotal, href: "/admin/skills", icon: Puzzle, warn: skillPending > 0, sub: `${skillPending} 待审核` },
    { label: "待审核内容", value: pending, href: "/admin/posts", icon: MessageSquare, warn: pending > 0 },
    { label: "注册用户", value: users, href: "/admin/posts", icon: Users },
    { label: "提示词", value: prompts, href: "/admin/prompts", icon: Sparkles },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-1">后台概览</h1>
      <p className="text-sm mb-6" style={{ color: "var(--text-muted)" }}>
        社区共 {postsTotal} 条内容，其中 {pending} 条待审核；工具 {toolsPending} 条、MCP {mcpPending} 条、Skills {skillPending} 条待审核。
      </p>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map((c) => (
          <Link key={c.label} href={c.href} className="card p-5 hover:border-[var(--primary)] transition">
            <c.icon
              size={22}
              style={{ color: c.warn ? "var(--warning)" : "var(--primary)" }}
            />
            <div className="text-3xl font-bold mt-3">{c.value}</div>
            <div className="text-sm" style={{ color: "var(--text-muted)" }}>
              {c.label}
              {c.sub ? ` · ${c.sub}` : ""}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
