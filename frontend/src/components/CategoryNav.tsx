"use client";

import { Category } from "@/types";

export default function CategoryNav({
  categories,
  activeId,
  activeTag,
  onChange,
  onTagChange
}: {
  categories: Category[];
  activeId: number;
  activeTag?: string | null;
  onChange: (id: number) => void;
  onTagChange?: (tag: string | null) => void;
}) {
  const items = [{ id: 0, name: "全部", icon: "🌟", sort: 0, tags: [] as string[] }, ...categories];
  const activeCat = items.find((c) => c.id === activeId);

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
              onClick={() => {
                onChange(c.id);
                onTagChange?.(null);
              }}
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

      {/* 二级子标签：复刻目标站『分类→子标签』导航，仅当前激活分类有标签时展示 */}
      {activeCat && activeCat.id !== 0 && activeCat.tags && activeCat.tags.length > 0 && (
        <div
          style={{
            marginTop: 10,
            paddingTop: 10,
            borderTop: "1px solid #f0f2f5",
            display: "flex",
            flexWrap: "wrap",
            gap: 6
          }}
        >
          {activeCat.tags.map((t) => {
            const at = activeTag === t;
            return (
              <span
                key={t}
                onClick={(e) => {
                  e.stopPropagation();
                  onTagChange?.(at ? null : t);
                }}
                style={{
                  fontSize: 12,
                  padding: "3px 10px",
                  borderRadius: 14,
                  cursor: "pointer",
                  background: at ? "#1677ff" : "#f2f3f5",
                  color: at ? "#fff" : "#4e5969"
                }}
              >
                {t}
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
}
