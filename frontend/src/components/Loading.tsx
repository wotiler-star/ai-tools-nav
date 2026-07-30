"use client";

import type { CSSProperties } from "react";

/** 原生骨架屏（替代 antd Skeleton，去除 antd 依赖） */
function Block({
  w,
  h,
  r = 8,
  style
}: {
  w?: number | string;
  h?: number | string;
  r?: number;
  style?: CSSProperties;
}) {
  return (
    <div
      className="skeleton-block"
      style={{ width: w, height: h, borderRadius: r, ...style }}
    />
  );
}

/** 工具卡网格骨架屏（替换 Spin，暗色下随变量生效） */
export function SkeletonGrid({ count = 8 }: { count?: number }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
        gap: 16
      }}
    >
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-white border border-gray-100 rounded-xl p-4">
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <Block w={48} h={48} r={12} />
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
              <Block w="60%" h={14} />
              <Block w="40%" h={12} />
            </div>
          </div>
          <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 8 }}>
            <Block h={12} />
            <Block w="80%" h={12} />
          </div>
        </div>
      ))}
    </div>
  );
}

/** 工具详情骨架屏 */
export function DetailSkeleton() {
  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "24px 20px" }}>
      <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
        <Block w={64} h={64} r={14} />
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
          <Block w="40%" h={20} />
          <Block w="20%" h={12} />
        </div>
      </div>
      <div style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 10 }}>
        <Block h={14} />
        <Block h={14} />
        <Block h={14} />
        <Block w="70%" h={14} />
      </div>
    </div>
  );
}
