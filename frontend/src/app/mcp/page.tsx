"use client";

import { useMemo, useState } from "react";
import { Input, Tag } from "antd";
import { SearchOutlined, ApiOutlined, QuestionCircleOutlined } from "@ant-design/icons";
import { MCP_SERVERS, MCP_CATEGORIES } from "@/lib/mockData";

const BRAND = "#3874F7";

/* 页脚「常见问题」（对齐目标站目录页底部 FAQ，文案沿用旧版 /mcp） */
const MCP_FAQ = [
  {
    q: "什么是 MCP 服务器？",
    a: "MCP（模型上下文协议）服务器是连接 AI 助手（如 Claude、Cursor 等）与外部数据源、API 及服务的工具。它们使 AI 模型能够获取实时信息、执行代码、与数据库交互，并实现超越其基础能力范围的操作。"
  },
  {
    q: "MCP 服务器是如何工作的？",
    a: "MCP 服务器充当人工智能助手与外部系统之间的中介。当您要求 Claude 或 Cursor 执行需要外部数据的任务时，MCP 服务器会处理请求，获取所需数据，并将其转换为人工智能能够理解和使用的格式返回。"
  },
  {
    q: "MCP 服务器能提供什么？",
    a: "MCP 服务器可实现各类资源的共享（包括文件、文档、数据），开放各类工具能力（如 API 集成、操作指令调用），还能提供标准化的交互提示模板；服务器端可自主管控自有资源，同时为保障安全，会搭建清晰的系统边界，做到权限与隔离可控。"
  },
  {
    q: "MCP 服务器安全吗？",
    a: "是的，MCP 协议内置了完善的安全机制。服务器能够独立管理自身资源，因此无需向大型语言模型提供商共享 API 密钥，整个系统界限清晰。每个服务器均自行负责身份验证和访问控制，确保操作安全隔离。"
  },
  {
    q: "如何在 Cursor 中安装 MCP 服务器？",
    a: "要在 Cursor 中安装 MCP 服务器：1) 打开 Cursor 设置 (Cmd+,)，2) 导航至 MCP 服务器部分，3) 点击「添加服务器」，4) 输入服务器配置（名称和命令），5) 重启 Cursor。欢迎查阅我们精心整理的 Cursor 最佳 MCP 服务器合集，内含详细设置指南。"
  },
  {
    q: "如何选择合适的 MCP 服务器？",
    a: "建议您重点关注以下几个方面：1）兼容性：确保服务器能否与您常用的编辑器顺畅协作；2）匹配应用场景：根据您的具体需求，选择为此类任务专门设计的服务器；3）关注维护状态：优先选择正在活跃维护、并有近期更新记录的服务器，这通常意味着更可靠；4）参考社区热度：在 GitHub 上，较高的星标数和频繁的提交更新往往是项目质量和受欢迎程度的体现。"
  }
];

export default function McpPage() {
  const [cat, setCat] = useState("全部");
  const [kw, setKw] = useState("");

  const cats = ["全部", ...MCP_CATEGORIES];

  const list = useMemo(() => {
    let arr = MCP_SERVERS;
    if (cat !== "全部") arr = arr.filter((m) => m.category === cat);
    if (kw.trim()) {
      const k = kw.trim();
      arr = arr.filter((m) => m.name.includes(k) || m.description.includes(k));
    }
    return arr;
  }, [cat, kw]);

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
          发现全球好用的 MCP 服务器
        </h1>
        <p style={{ color: "#6b7280", marginBottom: 20 }}>
          持续更新优质 MCP，重塑你的 AI 工作流
        </p>
        <Input
          allowClear
          value={kw}
          onChange={(e) => setKw(e.target.value)}
          placeholder="搜索 MCP 服务器"
          prefix={<SearchOutlined style={{ color: "#bbb" }} />}
          style={{ maxWidth: 460, borderRadius: 999, height: 44 }}
        />
      </div>

      <div style={{ maxWidth: 1200, margin: "24px auto 0", padding: "24px 16px 0" }}>
        {/* 分类 Tab */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 20 }}>
          {cats.map((c) => (
            <span
              key={c}
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

        {/* MCP 卡片网格 */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: 16
          }}
        >
          {list.map((m) => (
            <div
              key={m.id}
              className="group hover-brand tool-card"
              style={{
                background: "#fff",
                borderRadius: 12,
                padding: 16,
                cursor: "pointer"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                <div
                  style={{
                    width: 40,
                    height: 40,
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
                  <ApiOutlined />
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: 15 }} className="hover-brand-title">{m.name}</div>
                  <Tag color="blue" style={{ marginTop: 2, fontSize: 11 }}>
                    {m.tag}
                  </Tag>
                </div>
              </div>
              <div style={{ fontSize: 13, color: "#4e5969", lineHeight: 1.7, minHeight: 44 }}>
                {m.description}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ===== 常见问题（填补目录页底部，对齐目标站 /mcp FAQ） ===== */}
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
          {MCP_FAQ.map((item, idx) => (
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
