"use client";

import { useState } from "react";

/** 轻量 toast（替代 antd message，去除 antd 依赖）。返回 show 触发器与 <Toast> 渲染节点。 */
export function useToast() {
  const [msg, setMsg] = useState<string | null>(null);
  const show = (m: string) => {
    setMsg(m);
    if (typeof window !== "undefined") {
      window.setTimeout(() => setMsg(null), 2000);
    }
  };
  return { msg, show };
}

export function Toast({ msg }: { msg: string | null }) {
  if (!msg) return null;
  return (
    <div
      style={{
        position: "fixed",
        top: 20,
        left: "50%",
        transform: "translateX(-50%)",
        background: "#1f2937",
        color: "#fff",
        padding: "10px 18px",
        borderRadius: 10,
        fontSize: 14,
        zIndex: 2000,
        boxShadow: "0 8px 24px rgba(0,0,0,0.2)"
      }}
    >
      {msg}
    </div>
  );
}
