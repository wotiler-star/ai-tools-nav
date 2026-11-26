"use client";

import { useEffect, useMemo, useState } from "react";
import { Input, Tag, Button, Empty } from "antd";
import Link from "next/link";
import {
  SearchOutlined,
  ApiOutlined,
  QuestionCircleOutlined,
  RightOutlined,
  LeftOutlined
} from "@ant-design/icons";
import { MCP_SERVERS } from "@/lib/mockData";

const BRAND = "#3874F7";
const PAGE_SIZE = 24;

/* 目标站 /mcp 顶部 19 个分类 tag —— REA v6.7.0 2026-11-13 实测 AX 树 / RSC payload 取得。
   MCP_SERVERS 于 2026-11-19 采集目标站 tab=featured 前 20 页共 480 条真实条目（evidence/mcp_20261119），
   分类取 tags 中首个命中这 19 类的中文标签，确保分类 tab 过滤正确。 */
const TARGET_TAGS: string[] = [
  "开发工具", "研究与数据", "云平台", "数据库", "知识与内容管理", "自主智能体",
  "分析", "安全", "浏览器自动化", "娱乐与媒体", "金融", "通信", "生活管理", "监控",
  "系统自动化", "搜索", "项目管理", "云存储", "版本控制"
];

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

type SortTab = "featured" | "latest";

export default function McpPage() {
  const [cat, setCat] = useState("全部");
  const [tab, setTab] = useState<SortTab>("featured");
  const [kw, setKw] = useState("");
  const [appliedKw, setAppliedKw] = useState("");
  const [current, setCurrent] = useState(1);

  const cats = useMemo(() => ["全部", ...TARGET_TAGS], []);
  const coveredCount = useMemo(
    () => new Set(MCP_SERVERS.map((m) => m.category)).size,
    []
  );

  // 首屏读取 URL 查询参数（不用 useSearchParams，避免静态生成阶段要求 Suspense 边界）
  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    const t = p.get("tag");
    const s = p.get("tab");
    const c = Number(p.get("current"));
    if (t && cats.includes(t)) setCat(t);
    if (s === "latest" || s === "featured") setTab(s);
    if (Number.isFinite(c) && c > 0) setCurrent(c);
    const k = p.get("keyword");
    if (k) {
      setKw(k);
      setAppliedKw(k);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const syncUrl = (next: { tag?: string; tab?: SortTab; current?: number; keyword?: string }) => {
    const p = new URLSearchParams();
    const tagVal = next.tag ?? cat;
    const tabVal = next.tab ?? tab;
    const curVal = next.current ?? current;
    const kwVal = next.keyword ?? appliedKw;
    if (tagVal !== "全部") p.set("tag", tagVal);
    p.set("tab", tabVal);
    p.set("current", String(curVal));
    if (kwVal) p.set("keyword", kwVal);
    window.history.replaceState(null, "", `/mcp?${p.toString()}`);
  };

  const list = useMemo(() => {
    let arr = MCP_SERVERS;
    if (cat !== "全部") {
      arr = arr.filter(
        (m) => m.category === cat || (m.tags || []).includes(cat)
      );
    }
    if (appliedKw.trim()) {
      const k = appliedKw.trim().toLowerCase();
      arr = arr.filter(
        (m) =>
          m.name.toLowerCase().includes(k) ||
          m.description.toLowerCase().includes(k) ||
          (m.tags || []).some((t) => t.toLowerCase().includes(k))
      );
    }
    // 最新：按收录顺序倒序（本地数据无发布时间字段，不伪造时间排序）
    return tab === "latest" ? arr.slice().reverse() : arr;
  }, [cat, tab, appliedKw]);

  const totalPages = Math.max(1, Math.ceil(list.length / PAGE_SIZE));
  const page = Math.min(current, totalPages);
  const shown = list.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const pickCat = (c: string) => {
    setCat(c);
    setCurrent(1);
    syncUrl({ tag: c, current: 1 });
  };
  const pickTab = (t: SortTab) => {
    setTab(t);
    setCurrent(1);
    syncUrl({ tab: t, current: 1 });
  };
  const doSearch = () => {
    setAppliedKw(kw);
    setCurrent(1);
    syncUrl({ keyword: kw, current: 1 });
  };

  const chipBase = (active: boolean): React.CSSProperties => ({
    padding: "6px 14px",
    borderRadius: 999,
    fontSize: 13,
    cursor: "pointer",
    fontWeight: active ? 700 : 500,
    color: active ? "#fff" : "#4e5969",
    background: active ? BRAND : "#fff",
    border: `1px solid ${active ? BRAND : "#eaecef"}`,
    textDecoration: "none",
    display: "inline-block",
    lineHeight: 1.5
  });

  return (
    <div>
      {/* ===== Hero：h1 + 标语 + 搜索框 + 搜索按钮（对齐目标站） ===== */}
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
        <div style={{ display: "flex", justifyContent: "center", gap: 8 }}>
          <Input
            allowClear
            value={kw}
            onChange={(e) => setKw(e.target.value)}
            onPressEnter={doSearch}
            placeholder="搜索 MCP"
            prefix={<SearchOutlined style={{ color: "#bbb" }} />}
            style={{ maxWidth: 400, borderRadius: 999, height: 44 }}
          />
          <Button
            type="primary"
            icon={<SearchOutlined />}
            onClick={doSearch}
            style={{ height: 44, borderRadius: 999, paddingInline: 20 }}
          >
            搜索
          </Button>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: "24px auto 0", padding: "24px 16px 0" }}>
        {/* ===== 统计条（真实数据，不照抄目标站 9201 全库量） ===== */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
            flexWrap: "wrap",
            background: "#f8faff",
            border: "1px solid #e6ecff",
            borderRadius: 12,
            padding: "12px 16px",
            marginBottom: 18,
            fontSize: 13,
            color: "#4e5969"
          }}
        >
          <span>
            共 <b style={{ color: BRAND }}>{MCP_SERVERS.length}</b> 个精选 MCP · 覆盖{" "}
            <b style={{ color: BRAND }}>{coveredCount}</b> 个主题分类 · 最近更新 2026-11-12
          </span>
          <Link
            href="/mcp?tab=latest"
            onClick={(e) => {
              e.preventDefault();
              setTab("latest");
              setCat("全部");
              setCurrent(1);
              syncUrl({ tag: "全部", tab: "latest", current: 1 });
            }}
            style={{ color: BRAND, fontWeight: 600, textDecoration: "none" }}
          >
            看看新内容 →
          </Link>
        </div>

        {/* ===== 分类 tag 目录（19 个真实分类，链接化 + ARIA tab） ===== */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
          {cats.map((c) => (
            <Link
              key={c}
              aria-current={cat === c ? "true" : undefined}
              href={c === "全部" ? "/mcp?tab=featured&current=1" : `/mcp?tag=${encodeURIComponent(c)}&tab=latest&current=1`}
              onClick={(e) => {
                e.preventDefault();
                pickCat(c);
              }}
              style={chipBase(cat === c)}
            >
              {c}
            </Link>
          ))}
        </div>

        {/* ===== 精选 / 最新 排序 tab ===== */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
            marginBottom: 20,
            borderBottom: "1px solid #eaecef",
            paddingBottom: 10
          }}
        >
          <div style={{ display: "flex", gap: 6 }}>
            <Link
              aria-current={tab === "featured" ? "true" : undefined}
              href="/mcp?tab=featured&current=1"
              onClick={(e) => {
                e.preventDefault();
                pickTab("featured");
              }}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 4,
                padding: "6px 14px",
                borderRadius: 8,
                fontSize: 14,
                fontWeight: tab === "featured" ? 700 : 500,
                color: tab === "featured" ? BRAND : "#86909c",
                background: tab === "featured" ? "#eef3ff" : "#fff",
                border: `1px solid ${tab === "featured" ? BRAND : "#eaecef"}`,
                textDecoration: "none"
              }}
            >
              精选
            </Link>
            <Link
              aria-current={tab === "latest" ? "true" : undefined}
              href="/mcp?tab=latest&current=1"
              onClick={(e) => {
                e.preventDefault();
                pickTab("latest");
              }}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 4,
                padding: "6px 14px",
                borderRadius: 8,
                fontSize: 14,
                fontWeight: tab === "latest" ? 700 : 500,
                color: tab === "latest" ? BRAND : "#86909c",
                background: tab === "latest" ? "#eef3ff" : "#fff",
                border: `1px solid ${tab === "latest" ? BRAND : "#eaecef"}`,
                textDecoration: "none"
              }}
            >
              最新
            </Link>
          </div>
          <span style={{ fontSize: 12, color: "#c9cdd4" }}>
            {tab === "latest" ? "按收录顺序倒序" : "编辑精选顺序"} · 当前 {list.length} 条
          </span>
        </div>

        {/* ===== MCP 卡片网格（article + 详情链接 + h3 标题） ===== */}
        {shown.length === 0 ? (
          <Empty description={`「${cat}」暂无精选 MCP，试试其他分类`} style={{ padding: 60 }}>
            <Link
              href="/mcp?tab=featured&current=1"
              onClick={(e) => {
                e.preventDefault();
                pickCat("全部");
              }}
              style={{ color: BRAND, textDecoration: "none" }}
            >
              查看全部 {MCP_SERVERS.length} 个精选 →
            </Link>
          </Empty>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: 16
            }}
          >
            {shown.map((m) => (
              <article key={m.id} style={{ height: "100%" }}>
                <Link
                  href={`/mcp/${m.id}`}
                  className="group hover-brand tool-card"
                  style={{
                    display: "block",
                    height: "100%",
                    background: "#fff",
                    borderRadius: 12,
                    padding: 16,
                    border: "1px solid #eaecef",
                    textDecoration: "none",
                    color: "inherit"
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
                      <h3
                        className="hover-brand-title"
                        style={{ fontWeight: 600, fontSize: 15, margin: 0, lineHeight: 1.4 }}
                      >
                        {m.name}
                      </h3>
                      <div style={{ marginTop: 4, display: "flex", flexWrap: "wrap", gap: 4 }}>
                        {(m.tags || [m.tag]).map((t: string) => (
                          <Tag key={t} color="blue" style={{ margin: 0, fontSize: 11 }}>
                            {t}
                          </Tag>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div style={{ fontSize: 13, color: "#4e5969", lineHeight: 1.7, minHeight: 44 }}>
                    {m.description}
                  </div>
                </Link>
              </article>
            ))}
          </div>
        )}

        {/* ===== 分页器：1:1 对齐目标站 antd Pagination 折叠形态（1-5 + ••• + 末页） ===== */}
        <nav aria-label="MCP 分页" style={{ margin: "24px 0 8px", display: "flex", alignItems: "center", gap: 12 }}>
          <ul
            style={{
              listStyle: "none",
              display: "flex",
              alignItems: "center",
              gap: 6,
              margin: 0,
              padding: 0
            }}
          >
            <li>
              <button
                disabled={page <= 1}
                aria-label="上一页"
                style={{
                  border: "1px solid #eaecef",
                  background: "#fff",
                  borderRadius: 8,
                  width: 32,
                  height: 32,
                  color: page <= 1 ? "#c9cdd4" : "#4e5969",
                  cursor: page <= 1 ? "not-allowed" : "pointer"
                }}
              >
                <LeftOutlined />
              </button>
            </li>
            {Array.from(
              new Set([
                ...Array.from({ length: Math.min(5, totalPages) }, (_, i) => i + 1),
                ...(totalPages > 6 ? [totalPages] : [])
              ])
            ).map((p, idx, arr) => (
              <li key={p} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                {/* 目标站 antd：第 5 页与末页之间插入 •••（title=向后 5 页） */}
                {idx === arr.length - 1 && totalPages > 6 && arr[idx - 1] === 5 && p === totalPages && (
                  <span title="向后 5 页" aria-label="向后 5 页" style={{ width: 32, textAlign: "center", fontSize: 13, color: "#4e5969" }}>
                    •••
                  </span>
                )}
                <Link
                  href={`/mcp?tab=${tab}&current=${p}`}
                  aria-current={p === page ? "page" : undefined}
                  aria-label={`第 ${p} 页`}
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrent(p);
                    syncUrl({ current: p });
                  }}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 32,
                    height: 32,
                    borderRadius: 6,
                    fontSize: 13,
                    fontWeight: p === page ? 500 : 400,
                    color: p === page ? BRAND : "#4e5969",
                    background: p === page ? "#e6f4ff" : "#fff",
                    border: `1px solid ${p === page ? BRAND : "#eaecef"}`,
                    textDecoration: "none"
                  }}
                >
                  {p}
                </Link>
              </li>
            ))}
            <li>
              <button
                disabled={page >= totalPages}
                aria-label="下一页"
                onClick={() => {
                  setCurrent(page + 1);
                  syncUrl({ current: page + 1 });
                }}
                style={{
                  border: "1px solid #eaecef",
                  background: "#fff",
                  borderRadius: 8,
                  width: 32,
                  height: 32,
                  color: page >= totalPages ? "#c9cdd4" : "#4e5969",
                  cursor: page >= totalPages ? "not-allowed" : "pointer"
                }}
              >
                <RightOutlined />
              </button>
            </li>
          </ul>
          <span style={{ fontSize: 12, color: "#86909c" }}>
            共 {totalPages} 页 · {list.length} 条
          </span>
        </nav>
      </div>

      {/* ===== 常见问题（对齐目标站 /mcp FAQ：h2 + 6×h3） ===== */}
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
            <article
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
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
