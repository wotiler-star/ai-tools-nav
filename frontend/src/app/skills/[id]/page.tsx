import fs from "fs";
import path from "path";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import MarkdownIt from "markdown-it";
import Link from "next/link";
import { SKILLS, AI_TOOLS } from "@/lib/mockData";
import { SITE } from "@/config/site";
import { GithubOutlined, ThunderboltOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import CopyButton from "@/components/CopyButton";

// 详情页按需动态渲染：不预渲染上百个静态页，避免构建期把小内存服务器压垮
export const dynamic = "force-dynamic";

const BRAND = "#1777ff";
const md = new MarkdownIt({ html: false, linkify: true, breaks: false });

let mdCache: Record<string, string> | null = null;
function skillMd(): Record<string, string> {
  if (mdCache) return mdCache;
  try {
    const file = path.join(process.cwd(), "data", "skill-md.json");
    mdCache = JSON.parse(fs.readFileSync(file, "utf-8")) as Record<string, string>;
  } catch {
    mdCache = {};
  }
  return mdCache!;
}

/** 解析 SKILL.md 的 YAML frontmatter（支持一层嵌套的 metadata） */
function parseFrontmatter(raw: string): { meta: Array<[string, string]>; body: string } {
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!m) return { meta: [], body: raw };
  const meta: Array<[string, string]> = [];
  let currentTop = "";
  for (const line of m[1].split(/\r?\n/)) {
    if (!line.trim() || line.trim().startsWith("#")) continue;
    const nested = line.match(/^\s{2,}([A-Za-z0-9_-]+):\s*(.*)$/);
    const top = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (nested && currentTop) {
      meta.push([`${currentTop}.${nested[1]}`, nested[2].trim().replace(/^["']|["']$/g, "")]);
    } else if (top) {
      currentTop = top[1];
      const v = top[2].trim();
      if (v) meta.push([currentTop, v.replace(/^["']|["']$/g, "")]);
    }
  }
  return { meta, body: m[2] };
}

function ghInstall(url: string): string {
  const m = url.match(/^https:\/\/github\.com\/([^/]+)\/([^/]+)/);
  return m ? `npx skills add ${m[1]}/${m[2]}` : "";
}

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const skill = SKILLS.find((s) => s.id === Number(params.id));
  if (!skill) return { title: { absolute: `AI Skill 详情｜${SITE.name}` } };
  return {
    title: { absolute: `${skill.name} - AI Skill 详情｜${SITE.name}` },
    description: skill.description?.slice(0, 120) || "",
  };
}

export default function SkillDetailPage({ params }: { params: { id: string } }) {
  const skill = SKILLS.find((s) => s.id === Number(params.id));
  if (!skill) notFound();

  const raw = skillMd()[String(skill.id)] || "";
  const { meta, body } = raw ? parseFrontmatter(raw) : { meta: [], body: "" };
  const html = body ? md.render(body) : "";
  const officialUrl =
    skill.url || `https://www.bing.com/search?q=${encodeURIComponent(skill.name + " skill GitHub")}`;
  const install = ghInstall(skill.url || "");

  const others = SKILLS.filter((s) => s.id !== skill.id);
  const latest = [...others].sort((a, b) => b.id - a.id).slice(0, 6);
  const latestIds = new Set(latest.map((t) => t.id));
  const recommended = others.filter((t) => !latestIds.has(t.id)).slice(0, 6);
  const hotTools = [...AI_TOOLS].sort((a, b) => (b.heat || 0) - (a.heat || 0)).slice(0, 6);
  const related = SKILLS.filter((s) => s.category === skill.category && s.id !== skill.id).slice(0, 8);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: skill.name,
    description: skill.description,
    applicationCategory: "DeveloperApplication",
    url: officialUrl,
    sameAs: officialUrl,
    keywords: skill.category,
    publisher: {
      "@type": "Organization",
      name: "toolly"
    }
  };

  return (
    <div
      style={{
        background: "#f5f6f8",
        minHeight: "100vh",
        padding: "24px 20px"
      }}
    >
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <style>{`
        .skill-detail-grid {
          display: grid;
          grid-template-columns: minmax(0, 1fr) 320px;
          gap: 24px;
          align-items: start;
        }
        @media (max-width: 900px) {
          .skill-detail-grid { grid-template-columns: 1fr; }
        }
        .skill-related-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
          gap: 16px;
        }
        .skill-md { color:#1f2328; font-size:14px; line-height:1.85; }
        .skill-md h1 { font-size:22px; } .skill-md h2 { font-size:19px; } .skill-md h3 { font-size:16px; }
        .skill-md h1, .skill-md h2, .skill-md h3 { font-weight:700; margin:22px 0 10px; color:#111; }
        .skill-md p { margin:10px 0; }
        .skill-md ul, .skill-md ol { padding-left:24px; margin:10px 0; }
        .skill-md li { margin:4px 0; }
        .skill-md code { background:#f0f2f5; border-radius:4px; padding:2px 6px; font-size:13px; font-family:ui-monospace,Consolas,monospace; }
        .skill-md pre { background:#0d1117; color:#e6edf3; border-radius:10px; padding:16px; overflow:auto; margin:14px 0; }
        .skill-md pre code { background:transparent; color:inherit; padding:0; }
        .skill-md a { color:#1777ff; }
        .skill-md blockquote { border-left:4px solid #d0d7de; margin:12px 0; padding:4px 14px; color:#57606a; background:#fafbfc; }
        .skill-md table { border-collapse:collapse; margin:14px 0; width:100%; }
        .skill-md th, .skill-md td { border:1px solid #e5e7eb; padding:8px 12px; text-align:left; }
        .skill-md th { background:#f6f8fa; }
        .skill-md hr { border:none; border-top:1px solid #eaecef; margin:20px 0; }
      `}</style>

      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        {/* 面包屑：首页 > Skills > 名称 */}
        <nav
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            fontSize: 13,
            color: "var(--text-3, #86909c)",
            marginBottom: 12
          }}
        >
          <Link href="/" style={{ color: "var(--text-3, #86909c)" }}>
            首页
          </Link>
          <span>/</span>
          <Link href="/skills" style={{ color: "var(--text-3, #86909c)" }}>
            Skills
          </Link>
          <span>/</span>
          <span style={{ color: "var(--text-2, #4e5969)" }}>{skill.name}</span>
        </nav>

        <Link
          href="/skills"
          style={{
            color: "var(--text-3, #86909c)",
            fontSize: 14,
            display: "inline-flex",
            alignItems: "center",
            gap: 4
          }}
        >
          <ArrowLeftOutlined /> 返回
        </Link>

        <div className="skill-detail-grid" style={{ marginTop: 12 }}>
          {/* 左：Hero + 内容区块 */}
          <div>
            {/* Hero */}
            <div
              style={{
                background: "var(--surface, #fff)",
                border: "1px solid var(--border, #e5e7eb)",
                borderRadius: 12,
                padding: 24
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  flexWrap: "wrap"
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
                    flexShrink: 0
                  }}
                >
                  <ThunderboltOutlined />
                </div>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <h1 style={{ margin: 0, fontSize: 24 }}>{skill.name}</h1>
                  <div style={{ display: "flex", gap: 8, marginTop: 8, flexWrap: "wrap" }}>
                    <span className="chip chip-brand">{skill.category}</span>
                  </div>
                </div>
                <a
                  className="brand-btn"
                  href={officialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ marginLeft: "auto" }}
                >
                  <GithubOutlined /> 访问 GitHub
                </a>
              </div>

              <div style={{ height: 1, background: "var(--border, #e5e7eb)", margin: "16px 0" }} />
              <p style={{ color: "var(--text-2, #4e5969)", lineHeight: 1.7, margin: 0 }}>
                {skill.description}
              </p>
            </div>

            {/* 内容区块 */}
            <div
              style={{
                background: "var(--surface, #fff)",
                border: "1px solid var(--border, #e5e7eb)",
                borderRadius: 12,
                padding: 24,
                marginTop: 16
              }}
            >
              <Section title="简介" first>
                <p style={{ color: "var(--text-2, #4e5969)", lineHeight: 1.8, margin: 0 }}>
                  {skill.description}
                </p>
              </Section>

              <Section title="核心能力速览">
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  <Capability text={`所属分类：${skill.category}`} />
                  <Capability text="通过 Agent Skills 协议，将「能力」封装为可复用、可安装的 AI 组件" />
                  <Capability text="支持按需加载领域知识与工具，让通用模型转变为特定任务的专家" />
                </div>
              </Section>

              <Section title="适用场景">
                <p style={{ color: "var(--text-2, #4e5969)", lineHeight: 1.8, margin: 0 }}>
                  适用于「{skill.category}」相关场景，可作为可复用的 AI 能力组件，接入支持 Agent
                  Skills 的 AI 客户端（如 Claude、Cursor、Cline 等），按需调用以扩展模型能力。
                </p>
              </Section>

              {html ? (
                <Section title="Skills.MD">
                  {meta.length > 0 && (
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, marginBottom: 16 }}>
                      <tbody>
                        {meta.map(([k, v], i) => (
                          <tr key={i} style={{ borderBottom: "1px solid #f0f2f5" }}>
                            <td
                              style={{
                                padding: "8px 14px",
                                color: "#86909c",
                                width: 160,
                                verticalAlign: "top",
                                fontWeight: 600
                              }}
                            >
                              {k}
                            </td>
                            <td
                              style={{
                                padding: "8px 14px",
                                fontFamily: "ui-monospace,Consolas,monospace",
                                wordBreak: "break-word"
                              }}
                            >
                              {v}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                  <div className="skill-md" dangerouslySetInnerHTML={{ __html: html }} />
                </Section>
              ) : (
                <Section title="Skills.MD">
                  <div
                    style={{
                      padding: 16,
                      background: "#f7f8fa",
                      borderRadius: 10,
                      color: "#86909c",
                      fontSize: 13
                    }}
                  >
                    该 Skill 的 SKILL.md 暂未收录，可点击「访问 GitHub」查看完整文档。
                  </div>
                </Section>
              )}

              {install && (
                <Section title="快捷安装">
                  <p style={{ color: "var(--text-2, #4e5969)", lineHeight: 1.8, margin: "0 0 12px" }}>
                    在终端执行以下命令，即可将本 Skill 安装到本地 AI 客户端：
                  </p>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 12,
                      background: "#0d1117",
                      color: "#e6edf3",
                      borderRadius: 8,
                      padding: "12px 14px",
                      fontFamily: "ui-monospace,Consolas,monospace",
                      fontSize: 13,
                      wordBreak: "break-all"
                    }}
                  >
                    <code style={{ background: "transparent", color: "inherit", padding: 0 }}>{install}</code>
                    <CopyButton text={install} label="复制" />
                  </div>
                </Section>
              )}
            </div>
          </div>

          {/* 右：热门工具 + Skills 推荐 */}
          <aside style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <SideCard
              title="热门工具"
              items={hotTools.map((t) => ({
                id: t.id,
                name: t.name,
                desc: t.description,
                href: `/tool/${t.id}`
              }))}
            />
            <SideCard
              title="Skills 推荐"
              items={recommended.map((t) => ({
                id: t.id,
                name: t.name,
                desc: t.description,
                href: `/skills/${t.id}`
              }))}
            />
          </aside>
        </div>

        {/* 底部：相关推荐（同分类） */}
        {related.length > 0 && (
          <div style={{ marginTop: 32 }}>
            <h2
              style={{
                fontSize: 18,
                fontWeight: 700,
                marginBottom: 16,
                color: "var(--text-1, #1d2129)"
              }}
            >
              相关推荐
            </h2>
            <div className="skill-related-grid">
              {related.map((t) => (
                <Link
                  key={t.id}
                  href={`/skills/${t.id}`}
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
                          flexShrink: 0
                        }}
                      >
                        <ThunderboltOutlined />
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
                        <span className="chip chip-brand" style={{ marginTop: 2, fontSize: 11 }}>
                          {t.category}
                        </span>
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
  children: React.ReactNode;
  first?: boolean;
}) {
  return (
    <div
      style={{
        marginTop: first ? 0 : 20,
        paddingTop: first ? 0 : 16,
        borderTop: first ? "none" : "1px solid var(--border, #e5e7eb)"
      }}
    >
      <div
        style={{
          fontWeight: 700,
          fontSize: 16,
          marginBottom: 12,
          color: "var(--text-1, #1d2129)"
        }}
      >
        {title}
      </div>
      {children}
    </div>
  );
}

function Capability({ text }: { text: string }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        color: "var(--text-2, #4e5969)",
        fontSize: 14
      }}
    >
      <span style={{ color: BRAND, fontSize: 16, lineHeight: 1 }}>✓</span>
      {text}
    </div>
  );
}

function SideCard({
  title,
  items
}: {
  title: string;
  items: Array<{ id: number; name: string; desc: string; href: string }>;
}) {
  return (
    <div
      style={{
        background: "var(--surface, #fff)",
        border: "1px solid var(--border, #e5e7eb)",
        borderRadius: 12,
        padding: 16
      }}
    >
      <div
        style={{
          fontWeight: 700,
          fontSize: 15,
          marginBottom: 12,
          color: "var(--text-1, #1d2129)"
        }}
      >
        {title}
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        {items.map((t, i) => (
          <Link
            key={t.id}
            href={t.href}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "10px 0",
              borderTop: i === 0 ? "none" : "1px solid var(--border, #e5e7eb)",
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
                fontSize: 15,
                fontWeight: 700,
                flexShrink: 0
              }}
            >
              {t.name.charAt(0).toUpperCase()}
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
                  color: "var(--text-3, #86909c)",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis"
                }}
              >
                {t.desc}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
