import Link from "next/link";
import { PlusCircle, Plug, Puzzle } from "lucide-react";

const ENTRIES = [
  { href: "/submit", label: "AI 工具", desc: "提交一个 AI 工具，展示在工具大全与对应分类页。", icon: PlusCircle, ready: false },
  { href: "/submit/mcp", label: "MCP 服务", desc: "提交 Model Context Protocol 服务，上线到 MCP 广场与首页。", icon: Plug, ready: true },
  { href: "/submit/skill", label: "Skills 技能", desc: "提交可复用 AI 技能包，上线到 Skills 技能库与首页。", icon: Puzzle, ready: true },
];

export default function SubmitPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-2xl font-bold mb-1 flex items-center gap-2">
        <PlusCircle style={{ color: "var(--primary)" }} /> 提交内容
      </h1>
      <p className="text-sm mb-6" style={{ color: "var(--text-muted)" }}>
        好内容值得被更多人发现。选择要提交的类型，提交后将由编辑审核。
      </p>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {ENTRIES.map((e) => (
          <Link
            key={e.label}
            href={e.href}
            className="card p-5 flex flex-col gap-2 hover:-translate-y-0.5 transition"
          >
            <span className="text-2xl"><e.icon style={{ color: "var(--primary)" }} /></span>
            <h3 className="font-semibold text-lg">{e.label}</h3>
            <p className="text-sm line-clamp-3" style={{ color: "var(--text-muted)" }}>
              {e.desc}
            </p>
            <span className="text-sm mt-auto font-medium" style={{ color: "var(--primary)" }}>
              {e.ready ? "去提交 →" : "敬请期待"}
            </span>
          </Link>
        ))}
      </div>
    </main>
  );
}
