import Link from "next/link";
import { Star, Download, ExternalLink } from "lucide-react";
import { featuredMcpServers } from "@/lib/entries";

export default async function McpSection() {
  const items = await featuredMcpServers(6);
  if (items.length === 0) return null;

  return (
    <section id="mcp" className="mx-auto max-w-7xl px-4 py-8 scroll-mt-20">
      <div className="flex items-end justify-between mb-5">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <span>🔌</span> MCP 服务广场{" "}
          <span className="text-base font-normal" style={{ color: "var(--text-muted)" }}>
            / 让 AI 连接真实世界
          </span>
        </h2>
        <Link href="/mcp" className="text-sm hover:underline" style={{ color: "var(--primary)" }}>
          查看全部 →
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((m) => (
          <Link
            key={m.id}
            href={m.url}
            target="_blank"
            rel="noopener noreferrer"
            className="card p-5 flex flex-col gap-3 hover:-translate-y-0.5 transition"
          >
            <div className="flex items-start gap-3">
              <span className="text-3xl">{m.logo}</span>
              <div className="min-w-0">
                <h3 className="font-semibold text-lg leading-tight">{m.name}</h3>
                <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                  {m.category}
                </span>
              </div>
              {m.featured && (
                <span className="chip self-start ml-auto" style={{ color: "var(--accent)", borderColor: "var(--accent)" }}>
                  精选
                </span>
              )}
            </div>
            <p className="text-sm line-clamp-2" style={{ color: "var(--text-muted)" }}>
              {m.summary}
            </p>
            <div className="flex items-center gap-4 text-xs mt-auto" style={{ color: "var(--text-muted)" }}>
              <span className="flex items-center gap-1"><Star size={13} /> {m.stars.toLocaleString()}</span>
              <span className="flex items-center gap-1"><Download size={13} /> {m.installs.toLocaleString()}</span>
              <span className="ml-auto flex items-center gap-1 font-medium" style={{ color: "var(--primary)" }}>
                使用 <ExternalLink size={13} />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
