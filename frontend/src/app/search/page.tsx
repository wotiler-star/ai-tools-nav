"use client";

import { Suspense, useMemo, useState, type ReactNode } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import useSWR from "swr";
import { App, Tabs, Tag, Button } from "antd";
import { EmptyState } from "@/components/EmptyState";
import {
  EyeOutlined,
  LikeOutlined,
  MessageOutlined,
  CopyOutlined,
  RightOutlined
} from "@ant-design/icons";
import { swrFetcher } from "@/lib/api";
import ToolCard from "@/components/ToolCard";
import { SkeletonGrid } from "@/components/Loading";
import SectionTitle from "@/components/SectionTitle";
import { CATEGORIES } from "@/lib/mockData";
import {
  AiPost,
  AiPrompt,
  AiTool,
  BaseResponse,
  BaseResponsePage
} from "@/types";

/** 关键词高亮：按关键字切分文本，命中处用 <mark class="search-hl"> 包裹 */
function highlight(text: string, kw: string): ReactNode {
  if (!kw) return text;
  const lower = text.toLowerCase();
  const k = kw.toLowerCase();
  const parts: ReactNode[] = [];
  let i = 0;
  let idx: number;
  let n = 0;
  while ((idx = lower.indexOf(k, i)) !== -1) {
    if (idx > i) parts.push(text.slice(i, idx));
    parts.push(
      <mark key={n++} className="search-hl">
        {text.slice(idx, idx + k.length)}
      </mark>
    );
    i = idx + k.length;
  }
  parts.push(text.slice(i));
  return parts;
}

function SearchInner() {
  const sp = useSearchParams();
  const keyword = (sp.get("keyword") || "").trim();
  const [tab, setTab] = useState("tool");
  const [catId, setCatId] = useState<number | null>(null);
  const { message } = App.useApp();

  // 三类数据全量拉取后前端按关键字过滤（Mock 模式）；真实后端可将 keyword 传入接口
  const { data: toolData, isLoading: toolLoading } = useSWR<
    BaseResponsePage<AiTool>
  >("/ai_tool/list/page", swrFetcher);
  const { data: postData, isLoading: postLoading } = useSWR<
    BaseResponsePage<AiPost>
  >("/ai_post/list/page", swrFetcher);
  const { data: promptData, isLoading: promptLoading } = useSWR<
    BaseResponsePage<AiPrompt>
  >("/ai_prompt/list/page", swrFetcher);

  const kw = keyword.toLowerCase();

  const tools = useMemo(() => {
    const all = toolData?.data?.records || [];
    const byCat = catId == null ? all : all.filter((t) => t.categoryId === catId);
    if (!kw) return byCat;
    return byCat.filter(
      (t) =>
        t.name.toLowerCase().includes(kw) ||
        t.description.toLowerCase().includes(kw) ||
        t.tags.some((tag) => tag.toLowerCase().includes(kw))
    );
  }, [toolData, kw, catId]);

  const posts = useMemo(() => {
    const all = postData?.data?.records || [];
    if (!kw) return all;
    return all.filter(
      (p) =>
        p.title.toLowerCase().includes(kw) ||
        p.content.toLowerCase().includes(kw)
    );
  }, [postData, kw]);

  const prompts = useMemo(() => {
    const all = promptData?.data?.records || [];
    if (!kw) return all;
    return all.filter(
      (p) =>
        p.title.toLowerCase().includes(kw) ||
        p.content.toLowerCase().includes(kw)
    );
  }, [promptData, kw]);

  const onCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    message.success("已复制到剪贴板");
  };

  const loading = toolLoading || postLoading || promptLoading;
  const allEmpty = kw && tools.length === 0 && posts.length === 0 && prompts.length === 0;

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "24px 20px" }}>
      {/*
        搜索结果页此前缺 h1：顶部 SectionTitle 是 h2，ToolCard/文章/提示词卡片均用 h3，
        会形成 h2→h3 跳级。这里补一个视觉隐藏的 h1 作为页面主标题（与 ToolExplorer 同款
        视觉隐藏写法），让 h1→h2(SectionTitle)→h3(卡片) 层级成立，版式不变。
      */}
      <h1
        style={{
          position: "absolute",
          width: 1,
          height: 1,
          padding: 0,
          margin: -1,
          overflow: "hidden",
          clip: "rect(0, 0, 0, 0)",
          whiteSpace: "nowrap",
          border: 0
        }}
      >
        {keyword ? `搜索：${keyword}` : "搜索"}
      </h1>
      <SectionTitle
        title={keyword ? `搜索：${keyword}` : "搜索"}
        extra={
          <span style={{ color: "#86909c", fontSize: 13 }}>
            工具 {tools.length} · 文章 {posts.length} · 提示词 {prompts.length}
          </span>
        }
      />

      {loading ? (
        <SkeletonGrid count={8} />
      ) : allEmpty ? (
        <EmptyState
          style={{ padding: 80 }}
          description={`没有找到与“${keyword}”相关的内容`}
        >
          <Link href="/tool">
            <Button type="primary">
              去 AI 工具大全看看 <RightOutlined />
            </Button>
          </Link>
        </EmptyState>
      ) : (
        <Tabs
          activeKey={tab}
          onChange={setTab}
          size="small"
          items={[
            {
              key: "tool",
              label: `AI 工具 (${tools.length})`,
              children: (
                <>
                  {/* 分类筛选 chips（不影响文章/提示词 Tab） */}
                  <div
                    style={{
                      display: "flex",
                      gap: 8,
                      flexWrap: "wrap",
                      marginBottom: 16
                    }}
                  >
                    <button
                      className="tab-pill"
                      data-active={catId === null}
                      onClick={() => setCatId(null)}
                      style={{
                        appearance: "none",
                        fontFamily: "inherit",
                        cursor: "pointer",
                        padding: "6px 14px",
                        borderRadius: 999,
                        fontSize: 13
                      }}
                    >
                      全部
                    </button>
                    {CATEGORIES.map((c) => (
                      <button
                        key={c.id}
                        className="tab-pill"
                        data-active={catId === c.id}
                        onClick={() => setCatId(c.id)}
                        style={{
                          appearance: "none",
                          fontFamily: "inherit",
                          cursor: "pointer",
                          padding: "6px 14px",
                          borderRadius: 999,
                          fontSize: 13
                        }}
                      >
                        {c.icon} {c.name}
                      </button>
                    ))}
                  </div>

                  {tools.length === 0 ? (
                    <EmptyState style={{ padding: 60 }} description="没有匹配的工具" />
                  ) : (
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
                        gap: 16
                      }}
                    >
                      {tools.map((t) => (
                        <ToolCard key={t.id} tool={t} />
                      ))}
                    </div>
                  )}
                </>
              )
            },
            {
              key: "post",
              label: `社区文章 (${posts.length})`,
              children:
                posts.length === 0 ? (
                  <EmptyState style={{ padding: 60 }} description="没有匹配的文章" />
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                    {posts.map((p) => (
                      <div
                        key={p.id}
                        className="group hover-brand bg-white rounded-xl"
                        style={{ padding: 18 }}
                      >
                        <h3
                          className="hover-brand-title m-0 mb-2 text-base font-semibold"
                          style={{ fontSize: 16 }}
                        >
                          {highlight(p.title, keyword)}
                        </h3>
                        <p
                          style={{
                            margin: 0,
                            color: "#4e5969",
                            fontSize: 14,
                            lineHeight: 1.7
                          }}
                        >
                          {highlight(p.content, keyword)}
                        </p>
                        <div
                          style={{
                            display: "flex",
                            gap: 16,
                            marginTop: 12,
                            color: "#86909c",
                            fontSize: 13
                          }}
                        >
                          <span>{p.authorName}</span>
                          <span>
                            <EyeOutlined /> {p.viewNum}
                          </span>
                          <span>
                            <LikeOutlined /> {p.likeNum}
                          </span>
                          <span>
                            <MessageOutlined /> {p.commentNum}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )
            },
            {
              key: "prompt",
              label: `提示词 (${prompts.length})`,
              children:
                prompts.length === 0 ? (
                  <EmptyState style={{ padding: 60 }} description="没有匹配的提示词" />
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                    {prompts.map((p) => (
                      <div
                        key={p.id}
                        className="group hover-brand bg-white rounded-xl"
                        style={{ padding: 18 }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between"
                          }}
                        >
                          <h3
                            className="hover-brand-title m-0 text-base font-semibold"
                            style={{ margin: 0, fontSize: 16 }}
                          >
                            {highlight(p.title, keyword)}
                          </h3>
                          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <Tag color="purple">{p.categoryName}</Tag>
                            <Button
                              size="small"
                              icon={<CopyOutlined />}
                              onClick={() => onCopy(p.content)}
                            >
                              复制
                            </Button>
                          </div>
                        </div>
                        <pre
                          style={{
                            margin: "12px 0 0",
                            background: "#f7f8fa",
                            borderRadius: 8,
                            padding: 14,
                            fontSize: 13,
                            whiteSpace: "pre-wrap",
                            wordBreak: "break-word",
                            color: "#1f2329"
                          }}
                        >
                          {highlight(p.content, keyword)}
                        </pre>
                      </div>
                    ))}
                  </div>
                )
            }
          ]}
        />
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div style={{ textAlign: "center", padding: 100 }}>
          <span
            className="spinner"
            style={{ width: 40, height: 40, borderWidth: 4 }}
          />
        </div>
      }
    >
      <SearchInner />
    </Suspense>
  );
}
