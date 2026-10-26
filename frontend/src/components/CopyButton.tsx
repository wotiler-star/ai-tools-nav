"use client";

import { useState } from "react";
import { CopyOutlined, CheckOutlined } from "@ant-design/icons";

/**
 * 轻量复制按钮：将传入文本写入剪贴板，并在 1.5s 内给出「已复制」反馈。
 * 作为客户端组件被服务端详情页（/skills/[id]）渲染。
 */
export default function CopyButton({
  text,
  label = "复制",
  className,
  primary = false
}: {
  text: string;
  label?: string;
  className?: string;
  /** 主按钮样式（品牌蓝底白字），用于「生成我的提示词」等主操作 */
  primary?: boolean;
}) {
  const [copied, setCopied] = useState(false);

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // 退路：clipboard API 不可用时忽略（按钮仍给出反馈）
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand("copy");
      } catch {
        /* noop */
      }
      document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <button
      type="button"
      onClick={onCopy}
      className={className}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        border: primary ? "none" : "1px solid var(--border, #e5e7eb)",
        background: primary
          ? copied
            ? "#2f66e0"
            : "#1777ff"
          : copied
          ? "#eaf1fe"
          : "var(--surface, #fff)",
        color: primary ? "#fff" : copied ? "#1777ff" : "var(--text-2, #4e5969)",
        borderRadius: 8,
        padding: primary ? "10px 20px" : "8px 14px",
        fontSize: 13,
        fontWeight: 600,
        cursor: "pointer"
      }}
    >
      {copied ? <CheckOutlined /> : <CopyOutlined />}
      {copied ? "已复制" : label}
    </button>
  );
}
