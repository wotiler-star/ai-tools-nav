import fs from "fs";
import path from "path";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import MarkdownIt from "markdown-it";
import Link from "next/link";
import { SITE } from "@/config/site";

// 详情按需动态渲染：33MB 详情 JSON 只在服务端按 id 读取，不预渲染 3427 个静态页
export const dynamic = "force-dynamic";

const BRAND = "#1677ff";
const md = new MarkdownIt({ html: false, linkify: true, breaks: false });

interface Detail {
  title: string;
  desc: string;
  tag: string;
  content: string;
  externalLink: string;
  github: string;
}

let detailsCache: Record<string, Detail> | null = null;
function getDetails(): Record<string, Detail> {
  if (!detailsCache) {
    try {
      detailsCache = JSON.parse(fs.readFileSync(path.join(process.cwd(), "data", "dsh-plugin-details.json"), "utf8"));
    } catch {
      detailsCache = {};
    }
  }
  return detailsCache!;
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const d = getDetails()[params.id];
  if (!d) return { title: `插件未找到｜${SITE.name}` };
  return {
    title: `${d.title} - DeepSeek Harness 插件｜${SITE.name}`,
    description: d.desc.slice(0, 160),
    alternates: { canonical: `/dsh-plugin/${params.id}` }
  };
}

/**
 * DSH 插件详情 —— 对齐目标站 ai.codefather.cn/dsh-plugin/{id}
 * 顶部信息卡（h1 + 描述 + geekblue tag + GitHub 按钮）+ 左侧 Markdown 正文。
 */
export default function DshPluginDetailPage({ params }: { params: { id: string } }) {
  const d = getDetails()[params.id];
  if (!d) notFound();

  const html = md.render(d.content || "");
  const githubUrl = d.github
    ? `https://github.com/${d.github.split("/").slice(0, 2).join("/")}`
    : (d.externalLink || "");

  return (
    <div style={{ background: "#f8fafc", minHeight: "100vh", padding: "24px 16px 60px" }}>
      <div style={{ maxWidth: 1400, margin: "0 auto" }}>
        <div style={{ display: "flex", flexDirection: "row", flexWrap: "wrap", gap: 16, alignItems: "flex-start" }}>
          <article style={{ flex: "1 1 75%", minWidth: 0 }}>
            {/* 顶部信息卡 */}
            <section style={{ background: "#fff", borderRadius: 4, padding: 16 }}>
              <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h1 style={{ fontSize: 24, fontWeight: 600, color: "#0f172a", margin: 0, lineHeight: 1.35 }}>
                    {d.title}
                  </h1>
                  <p style={{ marginTop: 8, fontSize: 14, color: "#475569" }}>{d.desc}</p>
                  <div style={{ marginTop: 8, display: "flex", gap: 8, flexWrap: "wrap" }}>
                    {d.tag && (
                      <span style={{ display: "inline-flex", alignItems: "center", height: 22, padding: "0 7px",
                        borderRadius: 4, border: "none", background: "#f0f5ff", color: "#1d39c4", fontSize: 12 }}>
                        {d.tag}
                      </span>
                    )}
                  </div>
                </div>
                {githubUrl && (
                  <a href={githubUrl} target="_blank" rel="noreferrer"
                    style={{ display: "inline-flex", alignItems: "center", gap: 6, height: 32, padding: "0 14px",
                      borderRadius: 6, background: BRAND, color: "#fff", fontSize: 14, textDecoration: "none", flexShrink: 0 }}>
                    <svg viewBox="0 0 496 512" width="14" height="14" fill="currentColor" aria-hidden="true">
                      <path d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3.3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.6-5.6 0-6.2 2.3zm43.8-8.6c-.2 1.6 1.8 3.3 4.5 3.9 2.6.6 5.5-.1 5.7-1.7.2-1.6-1.8-3.3-4.5-3.9-2.6-.6-5.5.1-5.7 1.7zM248 8C111 8 0 119 0 256c0 109.7 69.8 202.9 166.7 236 12.2 2.2 16.6-5.3 16.6-11.8 0-5.8-.2-21.2-.4-41.6-67.7 14.7-82-32.6-82-32.6-11-28-27-35.4-27-35.4-22-15.1 1.7-14.8 1.7-14.8 24.5 1.7 37.3 25.1 37.3 25.1 21.7 37.2 56.9 26.5 70.8 20.2 2.2-15.7 8.5-26.5 15.4-32.6-53.8-6.1-110.3-26.9-110.3-119.7 0-26.4 9.5-48 25-64.9-2.5-6.1-10.8-30.7 2.3-63.9 0 0 20.5-6.6 67.1 25 19.4-5.4 40.2-8.1 60.9-8.2 20.6.1 41.5 2.8 60.9 8.2 46.6-31.6 67-25 67-25 13.2 33.2 4.9 57.8 2.4 63.9 15.6 16.9 25 38.5 25 64.9 0 93-56.6 113.5-110.5 119.5 8.7 7.5 16.4 22.2 16.4 44.7 0 32.3-.3 58.3-.3 66.2 0 6.5 4.4 14.1 16.7 11.7C427 458.7 496 365.7 496 256 496 119 385 8 248 8z" />
                    </svg>
                    GitHub
                  </a>
                )}
              </div>
            </section>
            {/* Markdown 正文 */}
            <section style={{ background: "#fff", borderRadius: 4, padding: 20, marginTop: 12 }}>
              <div className="md-body" dangerouslySetInnerHTML={{ __html: html }} />
            </section>
          </article>
          <aside style={{ flex: "0 1 22%", minWidth: 220 }}>
            <section style={{ background: "#fff", borderRadius: 4, padding: 16 }}>
              <h3 style={{ fontSize: 16, fontWeight: 600, margin: "0 0 12px", color: "#0f172a" }}>相关插件</h3>
              <Link href="/dsh-plugin" style={{ fontSize: 14, color: BRAND, textDecoration: "none" }}>
                查看全部 DSH 插件 →
              </Link>
            </section>
          </aside>
        </div>
      </div>
    </div>
  );
}
