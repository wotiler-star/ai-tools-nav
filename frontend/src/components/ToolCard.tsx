import Link from "next/link";
import { AiTool } from "@/types";

function colorFromName(name: string): string {
  let h = 0;
  for (const c of name) h = (h * 31 + c.charCodeAt(0)) % 360;
  return `hsl(${h}, 62%, 55%)`;
}

/**
 * AI 工具卡（服务端组件，无 antd / 无 "use client"，可在 SSR HTML 中直出）。
 * hover 语言统一走 .hover-brand-lift / .hover-brand-title。
 */
export default function ToolCard({ tool }: { tool: AiTool }) {
  return (
    <Link
      href={`/tool/${tool.id}`}
      className="group hover-brand-lift block rounded-xl bg-white"
      style={{ height: "100%" }}
    >
      <div style={{ padding: 16, height: "100%" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 10,
              background: colorFromName(tool.name),
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 20,
              fontWeight: 700,
              flexShrink: 0
            }}
          >
            {tool.name.charAt(0)}
          </div>
          <div style={{ minWidth: 0 }}>
            <div
              className="hover-brand-title"
              style={{
                fontWeight: 600,
                fontSize: 15,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis"
              }}
            >
              {tool.name}
              {tool.isHot && (
                <span style={{ color: "#ff4d4f", marginLeft: 6, fontSize: 13 }}>🔥</span>
              )}
            </div>
            <div style={{ fontSize: 12, color: "#86909c" }}>热度 {tool.heat}</div>
          </div>
        </div>

        <div
          style={{
            fontSize: 13,
            color: "#4e5969",
            lineHeight: 1.6,
            height: 42,
            overflow: "hidden"
          }}
        >
          {tool.description}
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 10 }}>
          {tool.tags.map((tag) => (
            <span
              key={tag}
              className="rounded px-1.5 py-0.5 text-xs"
              style={{ background: "var(--chip-bg)", color: "var(--chip-text)", fontSize: 12 }}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}
