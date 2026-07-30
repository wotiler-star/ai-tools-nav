"use client";

import { useState } from "react";
import Link from "next/link";
import { Calendar, Tag } from "antd";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import { FireFilled } from "@ant-design/icons";
import { AI_NEWS } from "@/lib/mockData";

const BRAND = "#3874F7";

/** 为榜单条目补充来源与时间（占位） */
const SOURCES = ["机器之心", "量子位", "InfoQ", "36氪", "新智元", "钛媒体"];

export default function NewsPage() {
  const [date, setDate] = useState<Dayjs>(dayjs());

  return (
    <div style={{ maxWidth: 1120, margin: "0 auto", padding: "24px 16px" }}>
      <div style={{ display: "flex", gap: 20, alignItems: "flex-start" }}>
        {/* 左侧：资讯列表 */}
        <section style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
            <h1 style={{ fontSize: 22, fontWeight: 800, margin: 0 }}>AI 资讯 · 行业动态</h1>
            <Tag color="blue">{date.format("M月D日")}</Tag>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {AI_NEWS.map((n, i) => (
              <Link
                key={n.id}
                href={`/news/${n.id}`}
                className="group hover-brand tool-card block bg-white"
                style={{
                  borderRadius: 12,
                  padding: 16,
                  display: "flex",
                  gap: 14,
                  cursor: "pointer"
                }}
              >
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 8,
                    flexShrink: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 800,
                    fontSize: 14,
                    color: "#fff",
                    background: n.rank <= 3 ? "#ff4d4f" : "#c9cdd4"
                  }}
                >
                  {n.rank}
                </div>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 8, lineHeight: 1.5 }} className="hover-brand-title">
                    {n.title}
                    {n.hot && <FireFilled style={{ color: "#ff4d4f", marginLeft: 8 }} />}
                  </div>
                  <div style={{ fontSize: 12, color: "#9ca3af", display: "flex", gap: 14 }}>
                    <span>{SOURCES[i % SOURCES.length]}</span>
                    <span>{date.format("MM-DD")} {String(9 + (i % 12)).padStart(2, "0")}:0{i % 6}</span>
                    <span>热度 {(2000 - i * 130).toLocaleString()}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* 右侧：日期查询 */}
        <aside style={{ width: 340, flexShrink: 0 }}>
          <div
            style={{
              background: "#fff",
              border: "1px solid #eaecef",
              borderRadius: 12,
              padding: 12,
              position: "sticky",
              top: 84
            }}
          >
            <div style={{ fontWeight: 700, marginBottom: 8, padding: "0 4px", color: BRAND }}>
              根据指定日期查询 AI 资讯
            </div>
            <Calendar
              fullscreen={false}
              value={date}
              onSelect={(d) => setDate(d)}
            />
          </div>
        </aside>
      </div>
    </div>
  );
}
