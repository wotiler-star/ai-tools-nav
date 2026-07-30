"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // 上线后可在此接入 Sentry 等错误上报
    console.error(error);
  }, [error]);

  return (
    <div
      style={{
        minHeight: "60vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "32px 16px"
      }}
    >
      <div style={{ textAlign: "center", maxWidth: 420 }}>
        <div
          style={{
            width: 72,
            height: 72,
            margin: "0 auto 16px",
            borderRadius: "50%",
            background: "#fff1f0",
            color: "#ff4d4f",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 36,
            fontWeight: 700,
            lineHeight: 1
          }}
        >
          !
        </div>
        <h1 style={{ fontSize: 22, color: "var(--text-1)", margin: 0 }}>
          页面出错了
        </h1>
        <p
          style={{
            color: "var(--text-3)",
            marginTop: 12,
            fontSize: 14,
            lineHeight: 1.7
          }}
        >
          抱歉，页面渲染时发生了错误，你可以重试或返回首页。
          {error?.digest ? `（错误编号：${error.digest}）` : ""}
        </p>
        <div
          style={{
            marginTop: 24,
            display: "flex",
            gap: 12,
            justifyContent: "center"
          }}
        >
          <button type="button" className="brand-btn" onClick={() => reset()}>
            重试
          </button>
          <Link href="/" className="brand-btn-ghost">
            返回首页
          </Link>
        </div>
      </div>
    </div>
  );
}
