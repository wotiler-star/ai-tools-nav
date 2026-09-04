"use client";

import { Card, Col, Row, Spin, Statistic } from "antd";
import useSWR from "swr";
import { swrFetcher } from "@/lib/api";
import { AdminStatsVO, BaseResponse } from "@/types";

/** 数据概览：全站核心指标统计卡片 */
export default function AdminOverview() {
  const { data, isLoading } = useSWR<BaseResponse<AdminStatsVO>>(
    "/admin/stats",
    swrFetcher
  );
  const s = data?.data ?? {};

  const items: { title: string; value: number; color: string }[] = [
    { title: "注册用户", value: s.userCount ?? 0, color: "#3874F7" },
    { title: "AI 工具", value: s.toolCount ?? 0, color: "#00b42a" },
    { title: "工具分类", value: s.categoryCount ?? 0, color: "#ff7d00" },
    { title: "社区帖子", value: s.postCount ?? 0, color: "#722ed1" },
    { title: "AI 提示词", value: s.promptCount ?? 0, color: "#eb0aa4" },
    { title: "评论", value: s.commentCount ?? 0, color: "#0fc6c2" },
    { title: "知识库专栏", value: s.columnCount ?? 0, color: "#f73284" },
    { title: "知识库文章", value: s.articleCount ?? 0, color: "#3491fa" },
    { title: "站内消息", value: s.messageCount ?? 0, color: "#86909c" }
  ];

  if (isLoading) {
    return (
      <div style={{ textAlign: "center", padding: 60 }}>
        <Spin />
      </div>
    );
  }

  return (
    <Row gutter={[16, 16]}>
      {items.map((i) => (
        <Col key={i.title} xs={24} sm={12} md={8} xxl={8}>
          <Card>
            <Statistic
              title={i.title}
              value={i.value}
              valueStyle={{ color: i.color }}
            />
          </Card>
        </Col>
      ))}
    </Row>
  );
}
