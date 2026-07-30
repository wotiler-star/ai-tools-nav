"use client";

import { Category } from "@/types";

export default function CategoryNav({
  categories,
  activeId,
  onChange
}: {
  categories: Category[];
  activeId: number;
  onChange: (id: number) => void;
}) {
  const items = [{ id: 0, name: "全部", icon: "🌟", sort: 0 }, ...categories];
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 12,
        padding: 12,
        border: "1px solid #eaecef"
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: 8
        }}
      >
        {items.map((c) => {
          const active = c.id === activeId;
          return (
            <div
              key={c.id}
              onClick={() => onChange(c.id)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "10px 12px",
                borderRadius: 8,
                cursor: "pointer",
                fontSize: 14,
                fontWeight: active ? 600 : 400,
                background: active ? "#e8f1ff" : "transparent",
                color: active ? "#1677ff" : "#1f2329"
              }}
            >
              <span style={{ fontSize: 16 }}>{c.icon}</span>
              <span>{c.name}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
