import { ExternalLink, Star } from "lucide-react";
import type { Tool } from "@/lib/types";

export default function ToolCard({ tool }: { tool: Tool }) {
  return (
    <a
      href={tool.url}
      target="_blank"
      rel="noopener noreferrer"
      className="card group p-4 flex flex-col gap-2 hover:-translate-y-0.5 transition"
    >
      <div className="flex items-center gap-3">
        <span className="w-11 h-11 grid place-items-center rounded-xl text-2xl bg-[var(--bg-subtle)]">
          {tool.logo ?? "🛠️"}
        </span>
        <div className="min-w-0">
          <div className="font-semibold truncate flex items-center gap-1">
            {tool.name}
            <ExternalLink size={13} className="opacity-0 group-hover:opacity-60" />
          </div>
          <div className="text-xs flex items-center gap-1" style={{ color: "var(--warning)" }}>
            <Star size={12} fill="currentColor" /> {tool.rating}
          </div>
        </div>
      </div>
      <p className="text-sm line-clamp-2" style={{ color: "var(--text-muted)" }}>
        {tool.summary}
      </p>
      <div className="flex flex-wrap gap-1.5 mt-auto pt-1">
        {tool.tags.map((t) => (
          <span key={t} className="chip !py-0.5 !text-xs">
            {t}
          </span>
        ))}
      </div>
    </a>
  );
}
