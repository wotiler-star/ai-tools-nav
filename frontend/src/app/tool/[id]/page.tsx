"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import Link from "next/link";
import useSWR from "swr";
import {
  ArrowLeftOutlined,
  LinkOutlined,
  ShareAltOutlined,
  CheckCircleFilled
} from "@ant-design/icons";
import { swrFetcher } from "@/lib/api";
import { DetailSkeleton } from "@/components/Loading";
import { useToast, Toast } from "@/components/Toast";
import ToolCard from "@/components/ToolCard";
import FavoriteButton from "@/components/FavoriteButton";
import { addRecent } from "@/lib/recentTools";
import { CATEGORIES } from "@/lib/mockData";
import { SITE } from "@/config/site";
import { AiTool, BaseResponse } from "@/types";

interface ToolDetail extends AiTool {
  related: AiTool[];
  detail?: string;
}

export default function ToolDetailPage() {
  const params = useParams();
  const id = Number(params.id);
  const { msg, show } = useToast();
  const isMobile = useMediaQuery("(max-width: 767px)");

  const { data, isLoading } = useSWR<BaseResponse<ToolDetail>>(
    `/ai_tool/get?id=${id}`,
    swrFetcher
  );

  // 记录最近浏览（客户端，避免水合不一致）
  useEffect(() => {
    if (id) addRecent(id);
  }, [id]);

  if (isLoading) {
    return <DetailSkeleton />;
  }

  if (!data?.data) {
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

  const tool = data.data;
  const catName =
    CATEGORIES.find((c) => c.id === tool.categoryId)?.name ?? "AI 工具";

  const toolJsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: tool.name,
    description: tool.description,
    applicationCategory: "AIApplication",
    url: tool.url,
    sameAs: tool.url,
    keywords: tool.tags.join(", "),
    publisher: {
      "@type": "Organization",
      name: SITE.name,
      logo: { "@type": "ImageObject", url: `https://${SITE.domain}/icon.svg` }
    }
  };
  // 功能亮点：优先用 features 字段，否则由标签生成
  const features: string[] =
    (tool as AiTool & { features?: string[] }).features?.length
      ? (tool as AiTool & { features?: string[] }).features!
      : tool.tags;

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
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "24px 20px" }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(toolJsonLd) }}
      />

      {/* 面包屑：首页 > 分类 > 工具 */}
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
        <Link href="/tool" style={{ color: "var(--text-3)" }}>
          {catName}
        </Link>
        <span>/</span>
        <span style={{ color: "var(--text-2)" }}>{tool.name}</span>
      </nav>

      <Link href="/" style={{ color: "var(--text-3)", fontSize: 14 }}>
        <ArrowLeftOutlined /> 返回
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
              href={tool.url}
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

        {/* 功能亮点 */}
        <div style={{ marginTop: 16 }}>
          <div style={{ fontWeight: 600, marginBottom: 10 }}>功能亮点</div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
              gap: 8
            }}
          >
            {features.map((f) => (
              <div
                key={f}
                style={{ display: "flex", alignItems: "center", gap: 6, color: "var(--text-2)", fontSize: 14 }}
              >
                <CheckCircleFilled style={{ color: "#3874F7" }} />
                {f}
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 16 }}>
          {tool.tags.map((tag) => (
            <span key={tag} className="chip chip-brand">
              {tag}
            </span>
          ))}
        </div>
      </div>

      {tool.related?.length > 0 && (
        <div style={{ marginTop: 32 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>相关推荐</h2>
          <div
            style={{
              display: "flex",
              gap: 16,
              overflowX: "auto",
              paddingBottom: 8,
              scrollSnapType: "x mandatory"
            }}
          >
            {tool.related.map((t) => (
              <div
                key={t.id}
                style={{ minWidth: 240, flexShrink: 0, scrollSnapAlign: "start" }}
              >
                <ToolCard tool={t} />
              </div>
            ))}
          </div>
        </div>
      )}

      <Toast msg={msg} />
    </div>
  );
}

function Divider() {
  return <div style={{ height: 1, background: "var(--border)", margin: "4px 0" }} />;
}
