"use client";

import { useMemo } from "react";
import Link from "next/link";
import { AiColumn, AiColumnCategory } from "@/types";

/* ============================================================
 * /library 知识库 —— 客户端渲染部分。
 * 数据（专栏 columns + 分类 cats）由服务端 library/page.tsx serverGet 后作为 props 注入，
 * 首屏 SSR HTML 即含 Banner/简介 + 全部分类小节与专栏表格（利于 SEO，对齐目标站内容页）。
 * 本站用后端真实数据映射：小节 = 专栏分类（categoryName），表格行 = 该分类下的专栏。
 * ============================================================ */

export default function LibraryIndex({
  columns,
  cats
}: {
  columns: AiColumn[];
  cats: AiColumnCategory[];
}) {
  /** 按分类分组：小节标题 = 分类名，行 = 该分类下的专栏 */
  const sections = useMemo(() => {
    const map = new Map<string, AiColumn[]>();
    columns.forEach((c) => {
      const key = c.categoryName || "知识专栏";
      const arr = map.get(key);
      if (arr) arr.push(c);
      else map.set(key, [c]);
    });
    // 有后端分类时按其顺序排列，其余追加在后
    const ordered: { name: string; items: AiColumn[] }[] = [];
    cats.forEach((cat) => {
      const items = map.get(cat.name);
      if (items && items.length) {
        ordered.push({ name: cat.name, items });
        map.delete(cat.name);
      }
    });
    map.forEach((items, name) => ordered.push({ name, items }));
    return ordered;
  }, [columns, cats]);

  return (
    <div style={{ background: "var(--page-bg)", minHeight: "100vh", padding: "24px 0" }}>
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 16px" }}>
        <article
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: 12,
            padding: 28
          }}
        >
          {/* ===== Banner：🚀 AI 知识库启航 ===== */}
          <div
            style={{
              borderRadius: 12,
              padding: "36px 20px",
              textAlign: "center",
              background: "linear-gradient(135deg, #eef3ff 0%, #f7f9ff 40%, #fdf2fb 100%)",
              marginBottom: 24
            }}
          >
            <div style={{ fontSize: 40, lineHeight: 1 }}>🚀</div>
            <h1 style={{ margin: "12px 0 8px", fontSize: 26, fontWeight: 800, color: "var(--text-1)" }}>
              AI 知识库启航
            </h1>
            <div style={{ fontSize: 18, fontWeight: 700, color: "var(--text-1)" }}>✦ toolly 的 AI 知识库</div>
            <div style={{ marginTop: 8, fontSize: 14, color: "var(--text-2)" }}>
              完全免费开放的 AI 知识共享平台 | 减少信息差，让每个人都能享受技术红利
            </div>
          </div>

          {/* ===== 简介 ===== */}
          <p style={{ margin: "0 0 24px", fontSize: 15, lineHeight: 1.9, color: "var(--text-2)" }}>
            汇总整合目前热门的 AI 工具相关信息，包括产品介绍、使用指南、工具测评、技巧分享、应用场景、AI
            变现、行业资讯、教程资源等一系列内容。toolly 希望带领大家打破 AI
            技术的信息壁垒，让每个人都能平等获取 AI 时代的工具与认知，利用科技让生活更美好。
          </p>

          {/* ===== 🧭 AI 知识库导航 ===== */}
          <h2 style={{ margin: "0 0 16px", fontSize: 22, fontWeight: 800, color: "var(--text-1)" }}>
            🧭 AI 知识库导航
          </h2>

          {sections.length === 0 ? (
            <div style={{ padding: "40px 0", textAlign: "center", color: "var(--text-3)", fontSize: 14 }}>
              暂无知识专栏
            </div>
          ) : (
            sections.map((sec) => (
              <section key={sec.name} style={{ marginBottom: 28 }}>
                <h3 style={{ margin: "0 0 10px", fontSize: 18, fontWeight: 700, color: "var(--text-1)" }}>
                  {sec.name}
                </h3>
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
                    <thead>
                      <tr>
                        <th style={thStyle}>资源</th>
                        <th style={thStyle}>链接</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sec.items.map((c) => (
                        <tr key={c.id}>
                          <td style={tdStyle}>
                            <span style={{ fontWeight: 600, color: "var(--text-1)" }}>{c.title}</span>
                            {c.needVip === 1 && <span style={vipStyle}>会员</span>}
                            {c.description ? (
                              <div
                                style={{
                                  fontSize: 12,
                                  color: "var(--text-3)",
                                  marginTop: 2,
                                  lineHeight: 1.6
                                }}
                              >
                                {c.description}
                              </div>
                            ) : null}
                          </td>
                          <td style={tdStyle}>
                            <Link href={`/library/${c.id}`} className="library-link" style={{ color: "#1777ff" }}>
                              进入专栏
                            </Link>
                            {c.articleCount ? (
                              <span style={{ color: "var(--text-3)", marginLeft: 8 }}>{c.articleCount} 篇</span>
                            ) : null}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            ))
          )}
        </article>

        {/* ===== 长文叙事模块：1:1 对齐目标站「🔥 Vibe Coding 零基础入门教程」落地页 ===== */}
        <article style={{ marginTop: 24, background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, padding: 28 }}>
          <h2 style={{ margin: "0 0 16px", fontSize: 22, fontWeight: 800, color: "var(--text-1)" }}>
            🔥 Vibe Coding 零基础入门教程
          </h2>
          <p style={{ fontSize: 15, lineHeight: 1.9, color: "var(--text-2)", margin: "0 0 16px" }}>
            Vibe Coding（氛围编程）已经火遍全网。不仅是程序员，设计师、产品运营、甚至完全不懂技术的人，都开始用它把自己的想法做成产品并盈利变现。这套从零到上线的入门教程，帮你快速掌握用 AI 开发产品的完整流程。
          </p>

          <h3 style={{ margin: "24px 0 10px", fontSize: 18, fontWeight: 700, color: "var(--text-1)" }}>
            教程包含什么？
          </h3>
          <p style={{ fontSize: 14, lineHeight: 1.9, color: "var(--text-2)", margin: "0 0 12px" }}>
            内容结构经过梳理，既能一条龙系统学习，也能按需快速定位感兴趣的主题。
          </p>
          <ul style={{ margin: 0, paddingLeft: 22, lineHeight: 2.0, color: "var(--text-2)", fontSize: 14 }}>
            <li><strong>基础必读</strong>：快速理解 Vibe Coding 并上手实践，做出第一个作品</li>
            <li><strong>编程工具</strong>：AI 模型、零代码平台、智能体平台、代码编辑器、命令行工具、IDE 插件</li>
            <li><strong>项目实战</strong>：从 0 到 1 做出真实可用的产品，覆盖工具、AI 应用、全栈、小程序</li>
            <li><strong>经验技巧</strong>：核心心法、对话工程、上下文管理、幻觉处理、代码质量保障</li>
            <li><strong>产品变现</strong>：需求分析、技术选型、架构设计、盈利模式、SEO 与运营</li>
            <li><strong>编程学习</strong>：学习路线、知识百科、资源大全、MCP 开发、面试刷题</li>
            <li><strong>资源宝库</strong>：工具大全、提示词模板、AI 概念大全、常见问题</li>
          </ul>

          <h3 style={{ margin: "24px 0 10px", fontSize: 18, fontWeight: 700, color: "var(--text-1)" }}>
            学习路径推荐
          </h3>
          <h4 style={{ margin: "14px 0 6px", fontSize: 15, fontWeight: 700, color: "var(--text-1)" }}>零基础新手</h4>
          <p style={{ fontSize: 14, lineHeight: 1.9, color: "var(--text-2)", margin: "0 0 8px" }}>
            第 1 天：读完基础必读，做出第一个作品；第 1–2 周：学习 AI 编程工具 + 做几个简单项目；之后按需学习经验技巧与产品变现。
          </p>
          <h4 style={{ margin: "14px 0 6px", fontSize: 15, fontWeight: 700, color: "var(--text-1)" }}>有编程基础</h4>
          <p style={{ fontSize: 14, lineHeight: 1.9, color: "var(--text-2)", margin: "0 0 8px" }}>
            第 1 天：快速过完基础内容，完成快速上手教程；第 1 周：学习主流 AI 编程工具，重构已有项目；之后重点提升对话与上下文管理能力。
          </p>

          <h3 style={{ margin: "24px 0 10px", fontSize: 18, fontWeight: 700, color: "var(--text-1)" }}>
            交流渠道
          </h3>
          <p style={{ fontSize: 14, lineHeight: 1.9, color: "var(--text-2)", margin: 0 }}>
            欢迎加入 AI 交流社区，一起获取最新资讯、探讨 AI 应用实践。你可以在本站
            <Link href="/essay" style={{ color: "#1777ff", margin: "0 4px" }}>社区</Link>
            发帖交流，或在
            <Link href="/news" style={{ color: "#1777ff", margin: "0 4px" }}>AI 资讯</Link>
            板块跟进前沿动态。
          </p>

          <h3 style={{ margin: "24px 0 10px", fontSize: 18, fontWeight: 700, color: "var(--text-1)" }}>
            参与共建
          </h3>
          <p style={{ fontSize: 14, lineHeight: 1.9, color: "var(--text-2)", margin: "0 0 12px" }}>
            如果你也是 AI 探索者、爱好者，乐于分享和沉淀知识与想法，欢迎参与知识库共建，一起构建属于所有人的 AI 知识宝藏。
          </p>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
              <thead><tr><th style={thStyle}>收获</th><th style={thStyle}>说明</th></tr></thead>
              <tbody>
                <tr><td style={tdStyle}>🌟 影响力提升</td><td style={tdStyle}>在活跃社区中展示才华，建立个人品牌与专业声誉</td></tr>
                <tr><td style={tdStyle}>📚 深度学习</td><td style={tdStyle}>接触多元视角，与同行切磋，加速个人成长</td></tr>
                <tr><td style={tdStyle}>🏆 价值认同</td><td style={tdStyle}>贡献将被明确署名，获得社区成员的尊重与感谢</td></tr>
                <tr><td style={tdStyle}>🤝 拓展人脉</td><td style={tdStyle}>连接志同道合的伙伴，融入充满活力的 AI 生态圈</td></tr>
              </tbody>
            </table>
          </div>

          <h3 style={{ margin: "24px 0 10px", fontSize: 18, fontWeight: 700, color: "var(--text-1)" }}>
            写在最后
          </h3>
          <p style={{ fontSize: 14, lineHeight: 1.9, color: "var(--text-2)", margin: 0 }}>
            知识分享是互利共赢的。toolly 希望这个完全免费开放的知识库，能帮更多人打开 AI 的大门。欢迎从上方导航进入各专栏系统学习，也欢迎把优质内容分享给朋友。
          </p>
          <p style={{ fontSize: 14, lineHeight: 1.9, color: "var(--text-2)", margin: "8px 0 0" }}>
            探索更多：
            <Link href="/tool" style={{ color: "#1777ff", margin: "0 4px" }}>AI 工具大全</Link>
            <Link href="/prompt" style={{ color: "#1777ff", margin: "0 4px" }}>AI 提示词</Link>
            <Link href="/resource/learn" style={{ color: "#1777ff", margin: "0 4px" }}>学习资源</Link>
          </p>
        </article>
      </div>
    </div>
  );
}

const thStyle: React.CSSProperties = {
  border: "1px solid var(--border)",
  padding: "8px 12px",
  textAlign: "left",
  background: "var(--surface-2)",
  fontWeight: 700,
  color: "var(--text-1)"
};

const tdStyle: React.CSSProperties = {
  border: "1px solid var(--border)",
  padding: "10px 12px",
  verticalAlign: "top",
  color: "var(--text-2)"
};

const vipStyle: React.CSSProperties = {
  marginLeft: 8,
  fontSize: 11,
  color: "#d48806",
  background: "#fffbe6",
  border: "1px solid #ffe58f",
  borderRadius: 4,
  padding: "0 6px"
};
