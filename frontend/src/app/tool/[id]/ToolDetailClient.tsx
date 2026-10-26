"use client";

import { useEffect } from "react";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import Link from "next/link";
import {
  ArrowLeftOutlined,
  LinkOutlined,
  ShareAltOutlined
} from "@ant-design/icons";
import { useToast, Toast } from "@/components/Toast";
import FavoriteButton from "@/components/FavoriteButton";
import Markdown from "@/components/Markdown";
import { getRelatedReviews } from "@/lib/reviews";
import { addRecent } from "@/lib/recentTools";
import { CATEGORIES, AI_TOOLS } from "@/lib/mockData";
import { AiTool } from "@/types";

interface ToolDetail extends AiTool {
  /** 后端可能附带的相关工具（侧栏「工具推荐」用），缺省则不展示 */
  related?: AiTool[];
  /** 后端真实长正文（markdown 源），缺省时走兜底文案 */
  detail?: string;
}

interface Props {
  id: number;
  /** 服务端直连后端取数后随首屏 SSR 直出的工具数据（不再经客户端 SWR） */
  tool: ToolDetail | null;
  /** 侧栏「最新工具」列表 */
  latest: AiTool[];
}

export default function ToolDetailClient({ id, tool, latest }: Props) {
  const { msg, show } = useToast();
  const isMobile = useMediaQuery("(max-width: 767px)");

  // 记录最近浏览（客户端，避免水合不一致）
  useEffect(() => {
    if (id) addRecent(id);
  }, [id]);

  if (!tool) {
    return (
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "64px 20px", textAlign: "center" }}>
        <h1 style={{ fontSize: 24, color: "var(--text-1)", margin: 0 }}>工具不存在</h1>
        <p style={{ color: "var(--text-3)", marginTop: 12 }}>
          没有找到该工具，它可能已下架或链接有误。
        </p>
        <div style={{ marginTop: 20 }}>
          <Link href="/" className="brand-btn">
            返回首页
          </Link>
        </div>
      </div>
    );
  }

  const effLogo = tool.logo || AI_TOOLS.find((x) => x.id === id)?.logo || "";
  const catName =
    CATEGORIES.find((c) => c.id === tool.categoryId)?.name ?? "AI 工具";

  // 官网链接兜底：url 为空（如历史空缺数据）时回退到 Bing 搜索，避免「访问官网」死链
  const officialUrl =
    tool.url ||
    `https://www.bing.com/search?q=${encodeURIComponent(tool.name + " 官网")}`;

  // 功能亮点：优先用 features 字段，否则由标签生成
  const features: string[] =
    (tool as AiTool & { features?: string[] }).features?.length
      ? (tool as AiTool & { features?: string[] }).features!
      : tool.tags;

  // 关联本站原创评测/教程：打通工具页 ↔ 原创内容，提升原创文章站内权重
  const relatedReviews = getRelatedReviews(tool.name, tool.tags);

  // 后端可能附带的相关工具（侧栏「工具推荐」用），统一兜底为空数组避免可选链比较报错
  const related = tool.related ?? [];

  const onShare = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: tool.name, url });
        return;
      }
    } catch {
      /* 用户取消分享，降级为复制 */
    }
    try {
      await navigator.clipboard.writeText(url);
      show("链接已复制，去分享吧");
    } catch {
      show(url);
    }
  };

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "24px 20px" }}>
      <div className="two-col-row">
      <main className="two-col-main">
      {/* 面包屑：首页 > 分类 > 工具（结构化数据由 layout.tsx 的 BreadcrumbList JSON-LD 提供） */}

      <nav
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          fontSize: 13,
          color: "var(--text-3)",
          marginBottom: 12
        }}
      >
        <Link href="/" style={{ color: "var(--text-3)" }}>
          首页
        </Link>
        <span>/</span>
        <Link href={`/category/${tool.categoryId}`} style={{ color: "var(--text-3)" }}>
          {catName}
        </Link>
        <span>/</span>
        <span style={{ color: "var(--text-2)" }}>{tool.name}</span>
      </nav>

      <Link href="/tool" style={{ color: "var(--text-3)", fontSize: 14 }}>
        <ArrowLeftOutlined /> 返回工具列表
      </Link>

      <div
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: 12,
          padding: 24,
          marginTop: 16
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            flexWrap: isMobile ? "wrap" : "nowrap"
          }}
        >
          {effLogo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={effLogo}
              alt={tool.name}
              width={64}
              height={64}
              style={{
                width: 64,
                height: 64,
                borderRadius: 14,
                objectFit: "cover",
                flexShrink: 0
              }}
            />
          ) : (
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: 14,
                background: "#1677ff",
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 28,
                fontWeight: 700,
                flexShrink: 0
              }}
            >
              {tool.name.charAt(0)}
            </div>
          )}
          <div style={{ minWidth: 0, flex: isMobile ? "1 1 auto" : undefined }}>
            <h1 style={{ margin: 0, fontSize: isMobile ? 20 : 24 }} className="hover-brand-title">
              {tool.name}
            </h1>
            <div style={{ color: "var(--text-3)", marginTop: 4 }}>热度 {tool.heat}</div>
          </div>
          <div
            style={{
              marginLeft: isMobile ? 0 : "auto",
              marginTop: isMobile ? 12 : 0,
              display: "flex",
              gap: 8,
              flexWrap: "wrap",
              width: isMobile ? "100%" : undefined,
              flexShrink: 0
            }}
          >
            <FavoriteButton
              targetType="tool"
              targetId={tool.id}
              style={isMobile ? { flex: "1 1 0", minWidth: 0 } : undefined}
            />
            <button
              type="button"
              className="brand-btn-ghost"
              style={isMobile ? { flex: "1 1 0", minWidth: 0 } : undefined}
              onClick={onShare}
            >
              <ShareAltOutlined />
              分享
            </button>
            <a
              className="brand-btn"
              style={isMobile ? { flex: "1 1 100%", marginTop: 8 } : undefined}
              href={officialUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <LinkOutlined />
              访问官网
            </a>
          </div>
        </div>

        <Divider />

        <p className="tool-desc">
          {tool.description}
        </p>

        {tool.detail ? (
          /* 后端真实长正文（ai_tool.detail，markdown 源） */
          <div className="article-body" style={{ marginTop: 16 }}>
            <Markdown source={tool.detail} />
          </div>
        ) : (
          <>
            {/* 无正文时：由真实标签合成，对齐目标站「⚡ 核心能力速览 1. … 2. …」 */}
            <div style={{ marginTop: 16 }}>
              <div style={{ fontWeight: 600, marginBottom: 10 }}>核心能力速览</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {features.map((f, i) => (
                  <div
                    key={f}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 8,
                      color: "var(--text-2)",
                      fontSize: 14,
                      lineHeight: 1.7
                    }}
                  >
                    <span style={{ color: "#1777ff", fontWeight: 600, flexShrink: 0 }}>
                      {i + 1}.
                    </span>
                    <span>{f}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 适合谁？怎么用？（由真实分类与标签合成，对齐目标站「💡 适合谁？怎么用？」） */}
            <div style={{ marginTop: 16 }}>
              <div style={{ fontWeight: 600, marginBottom: 8 }}>适合谁？怎么用？</div>
              <p style={{ margin: 0, fontSize: 14, lineHeight: 1.8, color: "var(--text-2)" }}>
                {tool.name} 归属于「{catName}」，适合关注
                {tool.tags.slice(0, 3).join("、") || "AI 提效"}的同学使用；建议先在小范围场景中验证效果，再逐步接入日常工作流。
              </p>
            </div>
          </>
        )}

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 16 }}>
          {tool.tags.map((tag) => (
            <span key={tag} className="chip chip-brand">
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* ===== 相关评测：本站原创内容（工具页 ↔ 原创文章 内链） ===== */}
      {relatedReviews.length > 0 && (
        <div style={{ marginTop: 28 }}>
          <h2
            style={{
              fontSize: 18,
              fontWeight: 700,
              marginBottom: 14,
              color: "var(--text-1)"
            }}
          >
            相关评测与教程
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {relatedReviews.map((r) => (
              <Link
                key={r.slug}
                href={`/review/${r.slug}`}
                className="group hover-brand"
                style={{ display: "block", textDecoration: "none", color: "inherit" }}
              >
                <div
                  style={{
                    background: "var(--surface)",
                    border: "1px solid var(--border)",
                    borderRadius: 12,
                    padding: 16
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      marginBottom: 6
                    }}
                  >
                    <span className="chip chip-brand">{r.type}</span>
                    <span style={{ fontSize: 12, color: "var(--text-3)" }}>{r.date}</span>
                  </div>
                  <div
                    className="hover-brand-title"
                    style={{
                      fontSize: 16,
                      fontWeight: 700,
                      color: "var(--text-1)",
                      marginBottom: 4,
                      lineHeight: 1.5
                    }}
                  >
                    {r.title}
                  </div>
                  <div style={{ fontSize: 14, color: "var(--text-2)", lineHeight: 1.7 }}>
                    {r.summary}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      </main>

      {/* ===== 侧栏：最新工具 + 工具推荐（对齐目标站详情页侧栏） ===== */}
      <aside className="two-col-side">
        <style>{`.tool-side-item{transition:color .15s ease}.tool-side-item:hover{color:#1777ff}`}</style>
        {latest.length > 0 && (
          <div style={sideCardStyle}>
            <div style={sideTitleStyle}>最新工具</div>
            {latest.map((t) => (
              <Link
                key={t.id}
                href={`/tool/${t.id}`}
                className="tool-side-item"
                style={sideItemStyle}
              >
                <span style={{ fontWeight: 500 }}>{t.name}</span>
                <span style={sideDescStyle}>{t.description}</span>
              </Link>
            ))}
          </div>
        )}

        {related.length > 0 && (
          <div style={sideCardStyle}>
            <div style={sideTitleStyle}>工具推荐</div>
            {related.map((t) => (
              <Link
                key={t.id}
                href={`/tool/${t.id}`}
                className="tool-side-item"
                style={sideItemStyle}
              >
                <span style={{ fontWeight: 500 }}>{t.name}</span>
                <span style={sideDescStyle}>{t.description}</span>
              </Link>
            ))}
          </div>
        )}
      </aside>
      </div>

      <Toast msg={msg} />
    </div>
  );
}

function Divider() {
  return <div style={{ height: 1, background: "var(--border)", margin: "4px 0" }} />;
}

/* ===== 侧栏样式（对齐目标站「最新工具 / 工具推荐」卡片） ===== */
const sideCardStyle: React.CSSProperties = {
  background: "var(--surface)",
  border: "1px solid var(--border)",
  borderRadius: 8,
  padding: 16,
  marginBottom: 16
};

const sideTitleStyle: React.CSSProperties = {
  fontWeight: 700,
  fontSize: 15,
  marginBottom: 8,
  color: "var(--text-1)"
};

const sideItemStyle: React.CSSProperties = {
  display: "block",
  padding: "9px 0",
  borderTop: "1px solid var(--border)",
  color: "var(--text-2)",
  fontSize: 14,
  minWidth: 0
};

const sideDescStyle: React.CSSProperties = {
  display: "block",
  fontSize: 12,
  color: "var(--text-3)",
  marginTop: 2,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap"
};
