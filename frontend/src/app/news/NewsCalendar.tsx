"use client";

import { useState } from "react";
import { Calendar, Tag } from "antd";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";

const BRAND = "#3874F7";

/**
 * 资讯页右侧「根据指定日期查询」日历。纯展示型 client island：
 * 列表本身由服务端按后端真实 createTime 渲染，日历交互不影响首屏真实数据。
 */
export default function NewsCalendar() {
  const [date, setDate] = useState<Dayjs>(dayjs());

  return (
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
        <div style={{ padding: "8px 4px 0", fontSize: 12, color: "#9ca3af" }}>
          已选：<Tag color="blue">{date.format("M月D日")}</Tag>
        </div>
      </div>
    </aside>
  );
}
