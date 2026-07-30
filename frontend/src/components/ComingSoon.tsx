"use client";

import { EmptyState } from "@/components/EmptyState";

export default function ComingSoon({
  icon,
  title,
  desc
}: {
  icon: string;
  title: string;
  desc?: string;
}) {
  return (
    <div style={{ maxWidth: 1400, margin: "0 auto", padding: "24px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ fontSize: 26 }}>{icon}</span>
        <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>{title}</h1>
      </div>
      <div
        style={{
          marginTop: 40,
          background: "#fff",
          borderRadius: 12,
          border: "1px solid #eaecef",
          padding: "80px 20px",
          textAlign: "center"
        }}
      >
        <EmptyState
          description={
            <span style={{ color: "#86909c" }}>
              {desc || `${title}模块正在建设中，敬请期待`}
            </span>
          }
        />
      </div>
    </div>
  );
}
