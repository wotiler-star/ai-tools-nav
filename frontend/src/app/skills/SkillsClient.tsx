"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Input, Tag } from "antd";
import { SearchOutlined, QuestionCircleOutlined } from "@ant-design/icons";
import { SKILL_CATEGORIES } from "@/lib/mockData";
import { SKILLS_REAL } from "@/lib/skillsReal";

const BRAND = "#3874F7";

/* 页脚「常见问题」（对齐目标站 /skills FAQ 分区：h1 + h2 + 6×h3） */
const SKILLS_FAQ = [
  {
    q: "什么是 Agent Skills？",
    a: "Agent Skills 是用来扩展 AI 编程助手能力的一种标准化功能模块，通常通过一个 SKILL.md 文件描述，把特定领域的知识、流程与脚本打包，让助手在需要时按需加载。"
  },
  {
    q: "如何安装 Skills？",
    a: "Claude Code：添加到 ~/.claude/skills/（个人）或项目内 .claude/skills/（团队）；其他支持 Skills 的工具按其文档放入对应技能目录即可，安装后重启或刷新会话生效。"
  },
  {
    q: "Skills 是如何工作的？",
    a: "通过统一的集成机制生效。安装后，这些技能会在对话过程中直接对 Claude 可用，Claude 会根据任务语义判断是否需要调用某个技能，并按需读取其中的说明与资源。"
  },
  {
    q: "可以同时使用多个技能吗？",
    a: "可以。Claude Code 支持同时使用多个技能。技能是模块化的，设计为可以协同工作。例如，你可以让一个技能负责代码规范，另一个负责测试生成，两者在同一会话中配合。"
  },
  {
    q: "Skills 库会持续更新吗？",
    a: "我们会定期更新 Skills 库，您可以收藏 toolly，确保您能及时获取最新、最实用的 Agent Skills。"
  },
  {
    q: "如何创建自定义 Skill？",
    a: "你可以使用官方存储库中的技能创建者指南，创建自定义 Agent Skill 并在 GitHub 上分享。核心是编写清晰的 SKILL.md 描述触发条件、工作流步骤与所需资源。"
  }
];

export default function SkillsClient({ current = 1 }: { current?: number }) {
  const [cat, setCat] = useState("全部");
  const [kw, setKw] = useState("");

  const cats = ["全部", ...SKILL_CATEGORIES];
  const PAGE_SIZE = 24;

  // 1:1 对齐目标站：数据源用采集的真实 SKILLS_REAL（19位id、目标同款顺序），
  // 首屏只渲染当前页 24 条（目标 featured tab 每页 24 条），分页由 server page 的 ?current= 驱动。
  const list = useMemo(() => {
    let arr: typeof SKILLS_REAL = SKILLS_REAL;
    // 分类 tab 带 emoji（⚡️ 效率工具），真实数据 category 是纯文字，去掉 emoji 前缀再比
    if (cat !== "全部") {
      const catPlain = cat.replace(/^[^\u4e00-\u9fa5A-Za-z0-9]+/, "");
      arr = arr.filter((s) => s.category === catPlain);
    }
    if (kw.trim()) {
      const k = kw.trim();
      arr = arr.filter((s) => s.name.includes(k) || s.description.includes(k));
    }
    if (cat === "全部" && !kw.trim()) {
      arr = arr.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);
    }
    return arr;
  }, [cat, kw, current]);

  const totalPages = Math.ceil(SKILLS_REAL.length / PAGE_SIZE);

  return (
    <div>
      {/* Hero */}
      <div
        style={{
          background: "linear-gradient(135deg,#eaf1fe,#f7faff)",
          padding: "40px 16px 32px",
          textAlign: "center"
        }}
      >
        <h1 style={{ fontSize: 30, fontWeight: 800, marginBottom: 8 }}>
          发现让 AI 更好用的 Skills
        </h1>
        <p style={{ color: "#6b7280", marginBottom: 20 }}>
          记录全球 Agent Skills，释放 AI 执行潜力
        </p>
        <Input
          allowClear
          value={kw}
          onChange={(e) => setKw(e.target.value)}
          placeholder="搜索 Skills"
          prefix={<SearchOutlined style={{ color: "#bbb" }} />}
          style={{ maxWidth: 460, borderRadius: 999, height: 44 }}
        />
      </div>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "24px 16px" }}>
        {/* 分类 Tab */}
        <div role="tablist" aria-label="Skills 分类" style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 20 }}>
          {cats.map((c) => (
            <span
              key={c}
              role="tab"
              aria-selected={cat === c}
              tabIndex={0}
              onClick={() => setCat(c)}
              style={{
                padding: "6px 14px",
                borderRadius: 999,
                fontSize: 13,
                cursor: "pointer",
                fontWeight: cat === c ? 700 : 500,
                color: cat === c ? "#fff" : "#4e5969",
                background: cat === c ? BRAND : "#fff",
                border: `1px solid ${cat === c ? BRAND : "#eaecef"}`
              }}
            >
              {c}
            </span>
          ))}
        </div>

        {/* Skill 卡片网格 */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: 16
          }}
        >
          {list.map((s) => (
            <Link
              key={s.id}
              href={`/skills/${s.id}`}
              className="group hover-brand-lift skill-card"
              style={{
                background: "#fff",
                borderRadius: 8,
                border: "none",
                padding: 16,
                cursor: "pointer",
                textDecoration: "none"
              }}
            >
              {/* 1:1 对齐目标站卡片：无图标，名称(16px/500) + tag(geekblue) + 描述(14px/#6b7280/2行) */}
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 16, fontWeight: 500, color: "#0f172a", marginBottom: 8,
                  whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }} className="hover-brand-title">
                  {s.name}
                </div>
                <div style={{ margin: "8px 0" }}>
                  <Tag style={{ margin: 0, fontSize: 12, color: "#1677ff", background: "#e6f4ff", border: "none" }}>
                    {s.category}
                  </Tag>
                </div>
              </div>
              <div style={{ fontSize: 14, color: "#6b7280", lineHeight: 1.4, height: 40, overflow: "hidden",
                display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
                {s.description}
              </div>
            </Link>
          ))}
        </div>

        {/* 分页器：对齐目标站 ant-pagination（右对齐、上一页/下一页、页码 Link 驱动 ?current=） */}
        {cat === "全部" && !kw.trim() && totalPages > 1 && (
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 6, alignItems: "center", margin: "16px 0 0" }}>
            {current > 1 && (
              <Link href={`/skills?current=${current - 1}`} style={{ padding: "4px 10px", border: "1px solid #eaecef", borderRadius: 6, textDecoration: "none", color: "#4e5969", fontSize: 13 }}>上一页</Link>
            )}
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              let p: number;
              if (totalPages <= 5) p = i + 1;
              else if (current <= 3) p = i + 1;
              else if (current >= totalPages - 2) p = totalPages - 4 + i;
              else p = current - 2 + i;
              return (
                <Link key={p} href={`/skills?current=${p}`} style={{
                  padding: "4px 10px", border: "1px solid " + (p === current ? BRAND : "#eaecef"),
                  borderRadius: 6, textDecoration: "none", color: p === current ? BRAND : "#4e5969",
                  background: p === current ? "#eef4ff" : "#fff", fontSize: 13, fontWeight: p === current ? 600 : 400
                }}>{p}</Link>
              );
            })}
            {current < totalPages && (
              <Link href={`/skills?current=${current + 1}`} style={{ padding: "4px 10px", border: "1px solid #eaecef", borderRadius: 6, textDecoration: "none", color: "#4e5969", fontSize: 13 }}>下一页</Link>
            )}
          </div>
        )}
      </div>

      {/* ===== 常见问题（对齐目标站 /skills 底部 FAQ 分区） ===== */}
      <section style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 16px 64px" }}>
        <h2
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            margin: "0 0 24px",
            fontSize: 24,
            fontWeight: 700,
            color: "#0f172a",
            lineHeight: "32px"
          }}
        >
          <QuestionCircleOutlined style={{ color: BRAND, fontSize: 22 }} />
          常见问题
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))",
            gap: 16
          }}
        >
          {SKILLS_FAQ.map((item, idx) => (
            <div
              key={idx}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 10,
                background: "#fff",
                border: "1px solid var(--chip-border, #eaecef)",
                borderRadius: 12,
                padding: 20
              }}
            >
              <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: "#1f2937", lineHeight: 1.4 }}>
                {idx + 1}. {item.q}
              </h3>
              <p style={{ margin: 0, fontSize: 15, color: "#4e5969", lineHeight: 1.6 }}>
                {item.a}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
