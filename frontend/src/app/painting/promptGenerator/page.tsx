"use client";

import { useState } from "react";

/** 选项来自常见绘图模型的高频风格/参数，覆盖大多数使用场景 */
const STYLES = [
  "写实摄影",
  "日系插画",
  "3D 渲染",
  "水彩手绘",
  "赛博朋克",
  "国风水墨",
  "黏土定格",
  "极简扁平"
];
const RATIOS = ["1:1", "16:9", "9:16", "4:3", "3:4"];
const LIGHTS = ["自然光", "柔光棚拍", "逆光", "霓虹光", "黄金时刻"];

const fieldStyle: React.CSSProperties = {
  width: "100%",
  height: 40,
  padding: "0 12px",
  borderRadius: 10,
  border: "1px solid var(--border)",
  background: "var(--surface)",
  color: "var(--text-1)",
  fontSize: 14,
  outline: "none"
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: 13,
  fontWeight: 600,
  color: "var(--text-2)",
  marginBottom: 6
};

/** 绘图提示词生成器（对标 ai.codefather.cn 顶部导航「AI提示词 → 绘图提示词生成器」） */
export default function PromptGeneratorPage() {
  const [subject, setSubject] = useState("");
  const [style, setStyle] = useState(STYLES[0]);
  const [ratio, setRatio] = useState(RATIOS[1]);
  const [light, setLight] = useState(LIGHTS[0]);
  const [detail, setDetail] = useState("");
  const [copied, setCopied] = useState(false);

  // 用固定模板拼接，保证每次生成结果稳定、可直接复制使用
  const prompt =
    `${subject.trim() || "（请输入画面主体）"}，${style}风格，${light}，` +
    (detail.trim() ? `${detail.trim()}，` : "") +
    `高质量，超精细细节，构图考究，色彩协调，画面比例 ${ratio}`;

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(prompt);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      // 剪贴板 API 在非安全上下文下不可用，静默失败即可
    }
  };

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "32px 24px" }}>
      <h1 style={{ fontSize: 24, fontWeight: 700, margin: 0 }}>绘图提示词生成器</h1>
      <p style={{ color: "var(--text-3)", margin: "8px 0 24px" }}>
        选好风格与画面参数，一键拼出可直接粘贴到绘图模型里的提示词。
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 16,
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: 12,
          padding: 20
        }}
      >
        <div style={{ gridColumn: "1 / -1" }}>
          <label style={labelStyle} htmlFor="pg-subject">
            画面主体
          </label>
          <input
            id="pg-subject"
            style={fieldStyle}
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="例如：一只坐在窗台的橘猫"
          />
        </div>

        <div>
          <label style={labelStyle} htmlFor="pg-style">
            风格
          </label>
          <select
            id="pg-style"
            style={fieldStyle}
            value={style}
            onChange={(e) => setStyle(e.target.value)}
          >
            {STYLES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label style={labelStyle} htmlFor="pg-light">
            光线
          </label>
          <select
            id="pg-light"
            style={fieldStyle}
            value={light}
            onChange={(e) => setLight(e.target.value)}
          >
            {LIGHTS.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label style={labelStyle} htmlFor="pg-ratio">
            画面比例
          </label>
          <select
            id="pg-ratio"
            style={fieldStyle}
            value={ratio}
            onChange={(e) => setRatio(e.target.value)}
          >
            {RATIOS.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>

        <div style={{ gridColumn: "1 / -1" }}>
          <label style={labelStyle} htmlFor="pg-detail">
            补充细节（可选）
          </label>
          <input
            id="pg-detail"
            style={fieldStyle}
            value={detail}
            onChange={(e) => setDetail(e.target.value)}
            placeholder="例如：背景是虚化的城市夜景"
          />
        </div>
      </div>

      <div style={{ marginTop: 20 }}>
        <div style={{ ...labelStyle, marginBottom: 8 }}>生成结果</div>
        <div
          style={{
            background: "var(--surface-2)",
            border: "1px solid var(--border)",
            borderRadius: 12,
            padding: 16,
            fontSize: 14,
            lineHeight: 1.8,
            color: "var(--text-1)",
            wordBreak: "break-word"
          }}
        >
          {prompt}
        </div>
        <button type="button" className="brand-btn" style={{ marginTop: 12 }} onClick={onCopy}>
          {copied ? "已复制" : "复制提示词"}
        </button>
      </div>
    </div>
  );
}
