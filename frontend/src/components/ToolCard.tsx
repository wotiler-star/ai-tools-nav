import Link from "next/link";
import { AiTool } from "@/types";
import { TOOL_REAL_IDS } from "@/lib/toolRealIds";

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
      href={`/tool/${TOOL_REAL_IDS[String(tool.id)] || tool.id}`}
      className="group hover-brand-lift tool-card"
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
            borderRadius: "50%",
            objectFit: "cover",
            flexShrink: 0
          }}
        />
      ) : (
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: "50%",
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
      <div className="tool-card-text">
        {/*
          工具名用 h3：卡片在板块 h2 之下，构成 h1→h2→h3 的正确层级，便于搜索引擎与
          读屏软件理解结构。样式与 1:1 对齐目标站：14px/500/#000。
        */}
        <h3 className="hover-brand-title tool-card-name">{tool.name}</h3>
        <div className="tool-card-desc">{tool.description}</div>
      </div>
    </Link>
  );
}
