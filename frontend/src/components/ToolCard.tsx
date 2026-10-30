import Link from "next/link";
import { AiTool } from "@/types";

function colorFromName(name: string): string {
  let h = 0;
  for (const c of name) h = (h * 31 + c.charCodeAt(0)) % 360;
  return `hsl(${h}, 62%, 55%)`;
}

/**
 * AI 工具卡（服务端组件，无 antd / 无 "use client"，可在 SSR HTML 中直出）。
 * 紧凑版式：图标居左，右侧一列「名称 + 一行灰描述」，无热度、无标签。
 * hover 语言统一走 .hover-brand-lift / .hover-brand-title。
 */
export default function ToolCard({ tool }: { tool: AiTool }) {
  return (
    <Link
      href={`/tool/${tool.id}`}
      className="group hover-brand-lift block rounded-lg bg-white"
      style={{ height: "100%" }}
    >
      <div
        style={{
          padding: 12,
          height: "100%",
          display: "flex",
          alignItems: "center",
          gap: 8
        }}
      >
        {tool.logo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={tool.logo}
            alt={tool.name}
            width={40}
            height={40}
            loading="lazy"
            style={{
              width: 40,
              height: 40,
              borderRadius: 10,
              objectFit: "cover",
              flexShrink: 0
            }}
          />
        ) : (
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 10,
              background: colorFromName(tool.name),
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 18,
              fontWeight: 700,
              flexShrink: 0
            }}
          >
            {tool.name.charAt(0)}
          </div>
        )}
        <div style={{ minWidth: 0, flex: 1 }}>
          {/*
            工具名用 h3：卡片在板块 h2 之下，构成 h1→h2→h3 的正确层级，便于搜索引擎与
            读屏软件理解结构。显式 margin:0 + fontSize/fontWeight 抵消 h3 默认样式，保持视觉不变。
          */}
          <h3
            className="hover-brand-title"
            style={{
              margin: 0,
              fontWeight: 600,
              fontSize: 14,
              color: "var(--text-1)",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis"
            }}
          >
            {tool.name}
          </h3>
          <div
            style={{
              marginTop: 3,
              fontSize: 12,
              color: "var(--text-3)",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis"
            }}
          >
            {tool.description}
          </div>
        </div>
      </div>
    </Link>
  );
}
