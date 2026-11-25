"use client";

// /painting/template/{id} 详情交互组件：原文/中文提示词切换、复制
// 结构 1:1 对齐目标站 目标站/painting/template/{id}
import { useState } from "react";
import { CopyOutlined, CheckOutlined, LinkOutlined } from "@ant-design/icons";
import type { PaintingCase } from "@/lib/paintingCases";

const BRAND = "#3874F7";

export interface PaintingDetail {
  promptEn?: string;
  promptZh?: string;
  sourceUrl?: string;
  author?: string;
  updateDate?: string;
}

export default function TemplateDetailClient({ item, detail }: { item: PaintingCase; detail: PaintingDetail }) {
  const [lang, setLang] = useState<"en" | "zh">("en");
  const [copied, setCopied] = useState(false);
  const hasZh = Boolean(detail.promptZh);
  const prompt = lang === "zh" && hasZh ? detail.promptZh! : (detail.promptEn || item.description || "");

  const onCopy = async () => {
    if (!prompt) return;
    try {
      await navigator.clipboard.writeText(prompt);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = prompt;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand("copy"); } catch { /* noop */ }
      document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div style={{ display: "flex", minHeight: 520, borderRadius: 32, background: "#fff", padding: 24, gap: 20, flexWrap: "wrap" }}>
      {/* 左侧：提示词展示区（深色卡片） */}
      <div style={{ flex: "1 1 46%", minWidth: 280, background: "#111827", borderRadius: 20, padding: 16, display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
          <div style={{ display: "flex", gap: 6 }}>
            <button type="button" onClick={() => setLang("en")} style={{ height: 26, padding: "0 12", borderRadius: 8, fontSize: 12, cursor: "pointer", border: "none", background: lang === "en" ? BRAND : "rgba(255,255,255,.08)", color: lang === "en" ? "#fff" : "#9ca3af" }}>原文</button>
            {hasZh && <button type="button" onClick={() => setLang("zh")} style={{ height: 26, padding: "0 12", borderRadius: 8, fontSize: 12, cursor: "pointer", border: "none", background: lang === "zh" ? BRAND : "rgba(255,255,255,.08)", color: lang === "zh" ? "#fff" : "#9ca3af" }}>中文</button>}
          </div>
          <button type="button" onClick={onCopy} title="复制当前提示词" style={{ display: "flex", alignItems: "center", gap: 4, height: 26, padding: "0 10", borderRadius: 8, fontSize: 12, cursor: "pointer", border: "none", background: "rgba(255,255,255,.08)", color: "#e5e7eb" }}>
            {copied ? <CheckOutlined /> : <CopyOutlined />} {copied ? "已复制" : "复制"}
          </button>
        </div>
        <pre style={{ margin: 0, maxHeight: 640, flex: 1, overflow: "auto", whiteSpace: "pre-wrap", wordBreak: "break-word", fontFamily: "inherit", fontSize: 13, lineHeight: 1.7, color: "rgba(255,255,255,.9)" }}>{prompt || "（该模板暂无提示词原文）"}</pre>
      </div>

      {/* 右侧：标题 / 元信息 / 模型 / 来源 */}
      <div style={{ flex: "1 1 46%", minWidth: 280, display: "flex", flexDirection: "column", padding: "8px 4px" }}>
        <h1 style={{ margin: "0 0 14px", fontSize: 30, fontWeight: 900, lineHeight: 1.15, letterSpacing: "-0.02em", color: "#0f172a" }}>{item.title}</h1>

        <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#64748b", marginBottom: 14 }}>
          <span>作者：</span>
          <span style={{ color: "#0f172a", fontWeight: 600 }}>{detail.author || "编程导航"}</span>
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 18 }}>
          {item.tags.map((t) => (
            <span key={t} style={{ padding: "3px 10px", borderRadius: 999, fontSize: 12, background: "#eff6ff", color: BRAND }}>#{t}</span>
          ))}
        </div>

        <dl style={{ margin: "0 0 18px", display: "grid", gridTemplateColumns: "auto 1fr", gap: "10px 18px", fontSize: 13 }}>
          <dt style={{ color: "#94a3b8" }}>适用模型</dt>
          <dd style={{ margin: 0, color: "#334155", fontWeight: 500 }}>{item.models.length ? item.models.join(" / ") : "通用大模型"}</dd>
          {detail.updateDate && <><dt style={{ color: "#94a3b8" }}>更新时间</dt><dd style={{ margin: 0, color: "#334155" }}>{detail.updateDate}</dd></>}
          {detail.sourceUrl && <><dt style={{ color: "#94a3b8" }}>来源</dt><dd style={{ margin: 0 }}><a href={detail.sourceUrl} target="_blank" rel="noopener noreferrer" style={{ color: BRAND, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 4 }}><LinkOutlined /> 查看原文</a></dd></>}
        </dl>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: "auto" }}>
          <a href="/painting/promptGenerator" style={{ padding: "10px 18px", borderRadius: 12, fontSize: 14, fontWeight: 700, color: "#fff", textDecoration: "none", background: "linear-gradient(90deg,#3b82f6,#6366f1)" }}>✦ 生成我的提示词</a>
          <button type="button" onClick={onCopy} style={{ padding: "10px 18px", borderRadius: 12, fontSize: 14, fontWeight: 700, cursor: "pointer", border: "1px solid #e5e7eb", background: "#fff", color: "#374151" }}>{copied ? "已复制" : "⧉ 复制提示词"}</button>
        </div>
        <p style={{ margin: "14px 0 0", fontSize: 12, color: "#94a3b8", lineHeight: 1.6 }}>
          <span style={{ color: "#ff4d4f" }}>*</span> 模板提示词中所有［］内的信息需要填写后，才是完整的绘图提示词
        </p>
      </div>
    </div>
  );
}
