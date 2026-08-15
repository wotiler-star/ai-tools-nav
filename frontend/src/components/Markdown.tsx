"use client";

import { useMemo } from "react";
import MarkdownIt from "markdown-it";

/**
 * markdown-it 实例：
 * - html:false  → 剥离用户传入的原始 HTML，杜绝 XSS（仅渲染 markdown 语法）
 * - linkify:true → 自动把裸链接转成 <a>
 * - typographer  → 智能标点（引号/省略号）
 * - breaks:true  → 单换行即换行，贴合社区内容习惯
 */
const md = new MarkdownIt({
  html: false,
  linkify: true,
  typographer: true,
  breaks: true
});

export interface MarkdownProps {
  /** markdown 源文本 */
  source: string;
  /** 附加 className（默认带 .md-body 排版样式） */
  className?: string;
}

export default function Markdown({ source, className }: MarkdownProps) {
  const html = useMemo(() => md.render(source || ""), [source]);
  return (
    <div
      className={`md-body ${className || ""}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
