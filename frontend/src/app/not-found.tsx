import Link from "next/link";

const BRAND = "#3874F7";

export default function NotFound() {
  return (
    <div
      style={{
        minHeight: "60vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "48px 16px",
        textAlign: "center"
      }}
    >
      <div
        style={{
          fontSize: 96,
          fontWeight: 800,
          lineHeight: 1,
          background: `linear-gradient(135deg, ${BRAND}, #5b9bff)`,
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text"
        }}
      >
        404
      </div>
      <h1 style={{ fontSize: 22, fontWeight: 600, color: "var(--text-1)", margin: "16px 0 8px" }}>
        页面走丢了
      </h1>
      <p style={{ color: "var(--text-3)", maxWidth: 420, marginBottom: 28 }}>
        你访问的页面不存在或已被移动。返回首页继续发现好用的 AI 工具吧。
      </p>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
        <Link
          href="/"
          style={{
            background: BRAND,
            color: "#fff",
            padding: "10px 24px",
            borderRadius: 8,
            fontWeight: 500
          }}
        >
          返回首页
        </Link>
        <Link
          href="/tool"
          style={{
            background: "#fff",
            color: BRAND,
            padding: "10px 24px",
            borderRadius: 8,
            fontWeight: 500,
            border: `1px solid ${BRAND}`
          }}
        >
          浏览 AI 工具
        </Link>
      </div>
    </div>
  );
}
