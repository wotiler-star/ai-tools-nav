/**
 * toolly 品牌标识组件
 * - ToollyMark：渐变圆角方块 + 白色 Spark（四角星，象征 AI / 工具魔法）
 * - ToollyLogo：标识 + 文字（tool 深灰 / ly 品牌蓝，双色更出彩）
 */
export function ToollyMark({ size = 32 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="toolly"
    >
      <defs>
        <linearGradient id="toollyMarkGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#3874F7" />
          <stop offset="1" stopColor="#8B5CF6" />
        </linearGradient>
      </defs>
      <rect x="1.5" y="1.5" width="29" height="29" rx="8" fill="url(#toollyMarkGrad)" />
      {/* Spark：四角星，曲线内凹，干净有辨识度 */}
      <path
        d="M16 4.5C17.4 11.4 20.6 14.6 27.5 16C20.6 17.4 17.4 20.6 16 27.5C14.6 20.6 11.4 17.4 4.5 16C11.4 14.6 14.6 11.4 16 4.5Z"
        fill="#ffffff"
      />
    </svg>
  );
}

export function ToollyLogo({ size = 30 }: { size?: number }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        flexShrink: 0
      }}
    >
      <ToollyMark size={size} />
      <span
        style={{
          fontSize: Math.round(size * 0.6),
          fontWeight: 800,
          letterSpacing: "-0.02em",
          lineHeight: 1,
          color: "#1f2329",
          whiteSpace: "nowrap"
        }}
      >
        tool<span style={{ color: "#3874F7" }}>ly</span>
      </span>
    </span>
  );
}
