"use client";

import type { CSSProperties, ReactNode } from "react";

/**
 * 原生空状态（替代 antd Empty，去除 antd 依赖）。
 * 支持自定义 description（可为 ReactNode）与 children（如操作按钮）。
 */
export function EmptyState({
  description = "暂无数据",
  children,
  style
}: {
  description?: ReactNode;
  children?: ReactNode;
  style?: CSSProperties;
}) {
  return (
    <div
      style={{
        textAlign: "center",
        padding: "48px 16px",
        color: "var(--text-3)",
        ...style
      }}
    >
      <svg
        width="64"
        height="41"
        viewBox="0 0 64 41"
        fill="none"
        style={{ display: "block", margin: "0 auto 12px", opacity: 0.55 }}
        aria-hidden="true"
      >
        <ellipse cx="32" cy="33" rx="32" ry="8" fill="var(--chip-bg)" />
        <path
          d="M16 10h22l10 10v17a2 2 0 0 1-2 2H16a2 2 0 0 1-2-2V12a2 2 0 0 1 2-2z"
          fill="var(--surface)"
          stroke="var(--border)"
          strokeWidth="1.5"
        />
        <path d="M38 10l10 10h-8a2 2 0 0 1-2-2v-8z" fill="var(--border)" />
        <path
          d="M22 23h14M22 29h10"
          stroke="var(--border)"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
      <div style={{ fontSize: 14, lineHeight: 1.6 }}>{description}</div>
      {children ? <div style={{ marginTop: 16 }}>{children}</div> : null}
    </div>
  );
}
