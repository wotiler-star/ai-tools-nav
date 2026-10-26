"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import { Button, Result, Tabs } from "antd";
import {
  AppstoreOutlined,
  BookOutlined,
  BulbOutlined,
  DashboardOutlined,
  FileTextOutlined,
  MessageOutlined,
  TeamOutlined,
  ToolOutlined
} from "@ant-design/icons";
import { swrFetcher } from "@/lib/api";
import { useAppStore } from "@/store/useAppStore";
import SectionTitle from "@/components/SectionTitle";
import CategoryChart, { CategoryDatum } from "@/components/CategoryChart";
import AdminOverview from "@/components/admin/AdminOverview";
import AdminTools from "@/components/admin/AdminTools";
import AdminCategories from "@/components/admin/AdminCategories";
import AdminKnowledge from "@/components/admin/AdminKnowledge";
import AdminUsers from "@/components/admin/AdminUsers";
import AdminPosts from "@/components/admin/AdminPosts";
import AdminPrompts from "@/components/admin/AdminPrompts";
import AdminComments from "@/components/admin/AdminComments";
import { AiTool, BaseResponse, BaseResponsePage, Category } from "@/types";

/**
 * 后台管理（对齐后端 /admin/** + @SaCheckRole("admin")）。
 * 仅管理员可见。
 *
 * 本页只负责：登录/管理员鉴权 + 工具分类分布图 + Tab 容器。
 * 各 Tab 的具体实现都在 components/admin/ 下，一个 Tab 一个组件：
 *   AdminOverview / AdminTools / AdminCategories / AdminKnowledge
 *   AdminUsers / AdminPosts / AdminPrompts / AdminComments
 *
 * 列表数据（工具 / 分类）在此处取一次用于概览图；各 Tab 内部用相同的 SWR key 再取一次，
 * 靠 SWR 缓存共享，不会重复请求，任一处 mutate 两边都会刷新。
 */
export default function AdminPage() {
  const router = useRouter();
  const { loginUser, openLoginModal } = useAppStore();
  const isAdmin = loginUser?.userRole === "admin";

  const { data: toolData } = useSWR<BaseResponsePage<AiTool>>(
    isAdmin ? "/ai_tool/list/page" : null,
    swrFetcher
  );
  const { data: catData } = useSWR<BaseResponse<Category[]>>(
    isAdmin ? "/category/list" : null,
    swrFetcher
  );

  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    if (loginUser === null) openLoginModal();
  }, [loginUser, openLoginModal]);

  // 所有 hook 必须在 early return 之前以固定顺序调用（React Hooks 规则）
  const tools = useMemo(() => toolData?.data?.records || [], [toolData]);
  const cats = useMemo(() => catData?.data || [], [catData]);

  // 工具分类分布（d3 图表数据源）
  const catCounts = useMemo<CategoryDatum[]>(() => {
    if (!cats.length) return [];
    return cats.map((c) => ({
      name: c.name,
      count: tools.filter((t) => t.categoryId === c.id).length
    }));
  }, [cats, tools]);

  if (!loginUser) {
    return (
      <Result
        status="403"
        title="需要登录"
        subTitle="请先登录管理员账号（Mock 模式账号填 admin 即为管理员）"
        extra={
          <Button type="primary" onClick={openLoginModal}>
            去登录
          </Button>
        }
      />
    );
  }

  if (loginUser.userRole !== "admin") {
    return (
      <Result
        status="403"
        title="无权访问"
        subTitle="仅管理员可进入后台管理"
        extra={
          <Button type="primary" onClick={() => router.push("/")}>
            返回首页
          </Button>
        }
      />
    );
  }

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "24px 20px" }}>
      <SectionTitle
        title="后台管理"
        extra={
          <span style={{ color: "#86909c", fontSize: 13 }}>
            管理员：{loginUser.userName}
          </span>
        }
      />
      {catCounts.length > 0 && (
        <div
          style={{
            background: "#fff",
            border: "1px solid #eaecef",
            borderRadius: 12,
            padding: 16,
            marginBottom: 16
          }}
        >
          <div
            style={{
              fontSize: 14,
              fontWeight: 700,
              color: "#1d2129",
              marginBottom: 8
            }}
          >
            工具分类分布（共 {tools.length} 个工具）
          </div>
          <CategoryChart data={catCounts} />
        </div>
      )}
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={[
          {
            key: "overview",
            label: (
              <span>
                <DashboardOutlined /> 数据概览
              </span>
            ),
            children: <AdminOverview />
          },
          {
            key: "tool",
            label: (
              <span>
                <ToolOutlined /> AI 工具（{tools.length}）
              </span>
            ),
            children: <AdminTools cats={cats} />
          },
          {
            key: "cat",
            label: (
              <span>
                <AppstoreOutlined /> 分类（{cats.length}）
              </span>
            ),
            children: <AdminCategories />
          },
          {
            key: "kb",
            label: (
              <span>
                <BookOutlined /> 知识库管理
              </span>
            ),
            children: <AdminKnowledge />
          },
          {
            key: "user",
            label: (
              <span>
                <TeamOutlined /> 用户管理
              </span>
            ),
            children: <AdminUsers />
          },
          {
            key: "post",
            label: (
              <span>
                <MessageOutlined /> 社区帖子
              </span>
            ),
            children: <AdminPosts />
          },
          {
            key: "prompt",
            label: (
              <span>
                <BulbOutlined /> AI 提示词
              </span>
            ),
            children: <AdminPrompts />
          },
          {
            key: "comment",
            label: (
              <span>
                <FileTextOutlined /> 评论管理
              </span>
            ),
            children: <AdminComments />
          }
        ]}
      />
    </div>
  );
}
