"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

export default function CopyButton({
  text,
  className,
  title = "复制",
  label = "复制",
}: {
  text: string;
  className?: string;
  title?: string;
  label?: string;
}) {
  const [copied, setCopied] = useState(false);

  function copy() {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <button
      type="button"
      onClick={copy}
      className={className}
      title={title}
      aria-label={label}
    >
      {copied ? (
        <Check size={16} style={{ color: "var(--success)" }} />
      ) : (
        <Copy size={16} />
      )}
    </button>
  );
}
