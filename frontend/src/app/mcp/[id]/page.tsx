"use client";

import { useEffect } from "react";
import type { ReactNode } from "react";
import { useParams } from "next/navigation";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import Link from "next/link";
import {
  ApiOutlined,
  LinkOutlined,
  CheckCircleFilled,
  ArrowLeftOutlined
} from "@ant-design/icons";
import { MCP_SERVERS } from "@/lib/mockData";
import { McpServer } from "@/types";
import { SITE } from "@/config/site";

const BRAND = "#1777ff";

export default function McpDetailPage() {
  const params = useParams();
  const id = Number(Array.isArray(params.id) ? params.id[0] : params.id);
  const isMobile = useMediaQuery("(max-width: 900px)");

  const tool = MCP_SERVERS.find((t: McpServer) => t.id === id);

  useEffect(() => {
    if (tool) document.title = `${tool.name} - ${tool.description} ｜ ${SITE.name}`;
  }, [tool]);

  if (!tool) {
    return (
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "64px 20px", textAlign: "center" }}>
        <h1 style={{ fontSize: 24, color: "var(--text-1)", margin: 0 }}>MCP 不存在</h1>
        <p style={{ color: "var(--text-3)", marginTop: 12 }}>
          没有找到该 MCP 服务器，它可能已下架或链接有误。
        </p>
        <div style={{ marginTop: 20 }}>
          <Link href="/mcp" className="brand-btn">
            返回 MCP 列表
          </Link>
        </div>
      </div>
    );
  }

  const officialUrl =
    tool.url || `https://www.bing.com/search?q=${encodeURIComponent(tool.name + " MCP GitHub")}`;

  const others = MCP_SERVERS.filter((t: McpServer) => t.id !== tool.id);
  const latest = [...others].sort((a, b) => b.id - a.id).slice(0, 6);
  const latestIds = new Set(latest.map((t) => t.id));
  const recommended = others.filter((t: McpServer) => !latestIds.has(t.id)).slice(0, 6);
  const related = MCP_SERVERS.filter(
    (t: McpServer) => t.id !== tool.id && t.category === tool.category
  ).slice(0, 6);

  const highlights = Array.from(
    new Set([tool.tag, tool.category].filter(Boolean) as string[])
  );

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: tool.name,
    description: tool.description,
    applicationCategory: "AIApplication",
    url: officialUrl,
    sameAs: officialUrl,
    keywords: highlights.join(", "),
    publisher: {
      "@type": "Organization",
      name: SITE.name,
      logo: { "@type": "ImageObject", url: `https://${SITE.domain}/logo.png` }
    }
  };

  return (
    <div
      style={{
        background: "#f5f6f8",
        minHeight: "100vh",
        padding: isMobile ? "16px 14px" : "24px 20px"
      }}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        {/* 面包屑：首页 > MCP > 工具名 */}
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
          <Link href="/mcp" style={{ color: "var(--text-3)" }}>
            MCP
          </Link>
          <span>/</span>
          <span style={{ color: "var(--text-2)" }}>{tool.name}</span>
        </nav>

        <Link
          href="/mcp"
          style={{
            color: "var(--text-3)",
            fontSize: 14,
            display: "inline-flex",
            alignItems: "center",
            gap: 4
          }}
        >
          <ArrowLeftOutlined /> 返回
        </Link>

        {/* 主区：左内容 + 右推荐 */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "minmax(0, 1fr) 320px",
            gap: 24,
            alignItems: "start",
            marginTop: 12
          }}
        >
          {/* 左：Hero + 简介/核心能力/适用场景 */}
          <div>
            {/* Hero */}
            <div
              style={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: 12,
                padding: 24
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
                    background: "#eaf1fe",
                    color: BRAND,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 28,
                    flexShrink: 0,
                    overflow: "hidden"
                  }}
                >
                  {tool.logo ? (
                    <img
                      src={tool.logo}
                      alt={tool.name}
                      width={64}
                      height={64}
                      style={{ width: 64, height: 64, objectFit: "cover", display: "block" }}
                    />
                  ) : (
                    <ApiOutlined />
                  )}
                </div>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <h1 style={{ margin: 0, fontSize: isMobile ? 20 : 24 }}>{tool.name}</h1>
                  <div style={{ display: "flex", gap: 8, marginTop: 8, flexWrap: "wrap" }}>
                    <span className="chip chip-brand">{tool.category}</span>
                    {tool.tag && tool.tag !== tool.category && (
                      <span className="chip" style={{ background: "#eaf1fe", color: BRAND }}>
                        {tool.tag}
                      </span>
                    )}
                  </div>
                </div>
                <a
                  className="brand-btn"
                  href={officialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    marginLeft: isMobile ? 0 : "auto",
                    marginTop: isMobile ? 12 : 0
                  }}
                >
                  <LinkOutlined /> 立即体验
                </a>
              </div>

              <div style={{ height: 1, background: "var(--border)", margin: "16px 0" }} />
              <p style={{ color: "var(--text-2)", lineHeight: 1.7, margin: 0 }}>
                {tool.description}
              </p>
            </div>

            {/* 内容区块 */}
            <div
              style={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: 12,
                padding: 24,
                marginTop: 16
              }}
            >
              <Section title="简介" first>
                <p style={{ color: "var(--text-2)", lineHeight: 1.8, margin: 0 }}>
                  {tool.description}
                </p>
              </Section>

              <Section title="核心能力速览">
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {highlights.map((h) => (
                    <div
                      key={h}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        color: "var(--text-2)",
                        fontSize: 14
                      }}
                    >
                      <CheckCircleFilled style={{ color: BRAND }} />
                      {h}
                    </div>
                  ))}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      color: "var(--text-2)",
                      fontSize: 14
                    }}
                  >
                    <CheckCircleFilled style={{ color: BRAND }} />
                    通过 MCP 协议为 AI 客户端扩展「{tool.tag || tool.category}」能力
                  </div>
                </div>
              </Section>

              <Section title="适用场景">
                <p style={{ color: "var(--text-2)", lineHeight: 1.8, margin: 0 }}>
                  适用于「{tool.category}」相关场景，可接入支持 Model Context Protocol
                  的 AI 客户端（如 Claude、Cursor、Cline 等），在对话框中直接调用本服务的能力。
                </p>
              </Section>
            </div>
          </div>

          {/* 右：最新 MCP + MCP 推荐 */}
          <aside style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <SideCard title="最新 MCP" items={latest} />
            <SideCard title="MCP 推荐" items={recommended} />
          </aside>
        </div>

        {/* 底部：相关推荐（同分类） */}
        {related.length > 0 && (
          <div style={{ marginTop: 32 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16, color: "var(--text-1)" }}>
              相关推荐
            </h2>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
                gap: 16
              }}
            >
              {related.map((t) => (
                <Link
                  key={t.id}
                  href={`/mcp/${t.id}`}
                  className="group hover-brand-lift block rounded-xl bg-white"
                  style={{ textDecoration: "none", color: "inherit", height: "100%" }}
                >
                  <div style={{ padding: 16, height: "100%" }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        marginBottom: 10
                      }}
                    >
                      <div
                        style={{
                          width: 44,
                          height: 44,
                          borderRadius: 10,
                          background: "#eaf1fe",
                          color: BRAND,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 20,
                          flexShrink: 0,
                          overflow: "hidden"
                        }}
                      >
                        {t.logo ? (
                          <img
                            src={t.logo}
                            alt={t.name}
                            width={44}
                            height={44}
                            style={{ width: 44, height: 44, objectFit: "cover", display: "block" }}
                          />
                        ) : (
                          <ApiOutlined />
                        )}
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <div
                          className="hover-brand-title"
                          style={{
                            fontWeight: 600,
                            fontSize: 15,
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis"
                          }}
                        >
                          {t.name}
                        </div>
                        {t.tag && (
                          <span className="chip chip-brand" style={{ marginTop: 2, fontSize: 11 }}>
                            {t.tag}
                          </span>
                        )}
                      </div>
                    </div>
                    <div
                      style={{
                        fontSize: 13,
                        color: "#4e5969",
                        lineHeight: 1.6,
                        height: 42,
                        overflow: "hidden"
                      }}
                    >
                      {t.description}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Section({
  title,
  children,
  first
}: {
  title: string;
  children: ReactNode;
  first?: boolean;
}) {
  return (
    <div
      style={{
        marginTop: first ? 0 : 20,
        paddingTop: first ? 0 : 16,
        borderTop: first ? "none" : "1px solid var(--border)"
      }}
    >
      <div
        style={{
          fontWeight: 700,
          fontSize: 16,
          marginBottom: 12,
          color: "var(--text-1)"
        }}
      >
        {title}
      </div>
      {children}
    </div>
  );
}

function SideCard({ title, items }: { title: string; items: McpServer[] }) {
  return (
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
          fontWeight: 700,
          fontSize: 15,
          marginBottom: 12,
          color: "var(--text-1)"
        }}
      >
        {title}
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        {items.map((t, i) => (
          <Link
            key={t.id}
            href={`/mcp/${t.id}`}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "10px 0",
              borderTop: i === 0 ? "none" : "1px solid var(--border)",
              textDecoration: "none",
              color: "inherit"
            }}
          >
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 8,
                background: "#eaf1fe",
                color: BRAND,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 16,
                flexShrink: 0,
                overflow: "hidden"
              }}
            >
              {t.logo ? (
                <img
                  src={t.logo}
                  alt={t.name}
                  width={36}
                  height={36}
                  style={{ width: 36, height: 36, objectFit: "cover", display: "block" }}
                />
              ) : (
                <ApiOutlined />
              )}
            </div>
            <div style={{ minWidth: 0 }}>
              <div
                className="hover-brand-title"
                style={{
                  fontWeight: 600,
                  fontSize: 14,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis"
                }}
              >
                {t.name}
              </div>
              <div
                style={{
                  fontSize: 12,
                  color: "var(--text-3)",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis"
                }}
              >
                {t.description}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
