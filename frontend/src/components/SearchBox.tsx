"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import useSWR from "swr";
import { SearchOutlined, FireFilled } from "@ant-design/icons";
import { swrFetcher } from "@/lib/api";
import { HOT_SEARCHES } from "@/lib/mockData";
import { AiTool, AiPrompt, AiPost, BaseResponsePage } from "@/types";

interface SuggestionItem {
  key: string;
  kind: "hot" | "tool" | "prompt" | "post";
  label: string;
  sub?: string;
  href: string;
  group: string;
}

/** 关键词高亮（与搜索结果页保持一致 .search-hl） */
function highlight(text: string, kw: string) {
  if (!kw) return text;
  const lower = text.toLowerCase();
  const k = kw.toLowerCase();
  const out: React.ReactNode[] = [];
  let i = 0;
  let idx = 0;
  let n = 0;
  while ((idx = lower.indexOf(k, i)) !== -1) {
    if (idx > i) out.push(<span key={n++}>{text.slice(i, idx)}</span>);
    out.push(
      <mark key={n++} className="search-hl">
        {text.slice(idx, idx + k.length)}
      </mark>
    );
    i = idx + k.length;
  }
  out.push(<span key={n++}>{text.slice(i)}</span>);
  return out;
}

export default function SearchBox() {
  const router = useRouter();
  const [val, setVal] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const wrapRef = useRef<HTMLDivElement>(null);

  // 聚焦时才拉取建议源（避免每个页面都预取），Mock 与真实后端共用同一套接口
  const { data: toolData } = useSWR<BaseResponsePage<AiTool>>(
    open ? "/ai_tool/list/page" : null,
    swrFetcher
  );
  const { data: promptData } = useSWR<BaseResponsePage<AiPrompt>>(
    open ? "/ai_prompt/list/page" : null,
    swrFetcher
  );
  const { data: postData } = useSWR<BaseResponsePage<AiPost>>(
    open ? "/ai_post/list/page" : null,
    swrFetcher
  );

  const kw = val.trim().toLowerCase();

  const groups = useMemo(() => {
    if (!kw) {
      return [
        {
          title: "热门搜索",
          items: HOT_SEARCHES.map<SuggestionItem>((h, i) => ({
            key: `hot-${i}`,
            kind: "hot",
            label: h,
            href: `/search?keyword=${encodeURIComponent(h)}`,
            group: "热门搜索"
          }))
        }
      ];
    }
    const g: { title: string; items: SuggestionItem[] }[] = [];

    const tools = (toolData?.data?.records || [])
      .filter(
        (t) =>
          t.name.toLowerCase().includes(kw) ||
          t.description.toLowerCase().includes(kw) ||
          t.tags.some((tag) => tag.toLowerCase().includes(kw))
      )
      .slice(0, 5)
      .map<SuggestionItem>((t) => ({
        key: `tool-${t.id}`,
        kind: "tool",
        label: t.name,
        sub: t.description,
        href: `/tool/${t.id}`,
        group: "AI 工具"
      }));
    if (tools.length) g.push({ title: "AI 工具", items: tools });

    const prompts = (promptData?.data?.records || [])
      .filter((p) => p.title.toLowerCase().includes(kw) || p.content.toLowerCase().includes(kw))
      .slice(0, 3)
      .map<SuggestionItem>((p) => ({
        key: `prompt-${p.id}`,
        kind: "prompt",
        label: p.title,
        sub: p.categoryName,
        href: `/search?keyword=${encodeURIComponent(p.title)}`,
        group: "AI 提示词"
      }));
    if (prompts.length) g.push({ title: "AI 提示词", items: prompts });

    const posts = (postData?.data?.records || [])
      .filter((p) => p.title.toLowerCase().includes(kw) || p.content.toLowerCase().includes(kw))
      .slice(0, 3)
      .map<SuggestionItem>((p) => ({
        key: `post-${p.id}`,
        kind: "post",
        label: p.title,
        sub: p.authorName,
        href: `/search?keyword=${encodeURIComponent(p.title)}`,
        group: "社区文章"
      }));
    if (posts.length) g.push({ title: "社区文章", items: posts });

    return g;
  }, [kw, toolData, promptData, postData]);

  const flat = useMemo(() => groups.flatMap((g) => g.items), [groups]);

  // 点击外部关闭
  useEffect(() => {
    function onDocMouseDown(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onDocMouseDown);
    return () => document.removeEventListener("mousedown", onDocMouseDown);
  }, []);

  // 输入变化后重置高亮项
  useEffect(() => {
    setActive(-1);
  }, [kw, open]);

  const go = (item: SuggestionItem) => {
    setOpen(false);
    setVal("");
    router.push(item.href);
  };

  const submit = () => {
    const q = val.trim();
    if (!q) return;
    setOpen(false);
    router.push(`/search?keyword=${encodeURIComponent(q)}`);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setOpen(true);
      setActive((a) => (flat.length ? (a + 1) % flat.length : -1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => (flat.length ? (a - 1 + flat.length) % flat.length : -1));
    } else if (e.key === "Enter") {
      if (open && active >= 0 && flat[active]) {
        e.preventDefault();
        go(flat[active]);
      } else {
        submit();
      }
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  return (
    <div ref={wrapRef} style={{ position: "relative", width: "100%", maxWidth: 320 }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          height: 38,
          borderRadius: 999,
          border: open ? "1px solid #3874f7" : "1px solid #e5e7eb",
          background: "var(--surface)",
          padding: "0 12px 0 14px",
          transition: "border-color 0.2s ease"
        }}
      >
        <SearchOutlined style={{ color: "#bbb", fontSize: 15 }} />
        <input
          value={val}
          onChange={(e) => {
            setVal(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
          placeholder="全站搜索 AI 相关工具、资源、信息"
          aria-label="全站搜索"
          style={{
            flex: 1,
            border: "none",
            outline: "none",
            background: "transparent",
            marginLeft: 8,
            fontSize: 14,
            color: "var(--text-1)"
          }}
        />
      </div>

      {open && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 8px)",
            left: 0,
            right: 0,
            minWidth: 320,
            maxHeight: "70vh",
            overflowY: "auto",
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: 12,
            boxShadow: "0 12px 32px rgba(0,0,0,0.12)",
            padding: 8,
            zIndex: 1000
          }}
        >
          {flat.length === 0 ? (
            <div style={{ padding: "14px 12px", color: "var(--text-3)", fontSize: 13 }}>
              输入关键词，联想 AI 工具 / 提示词 / 文章
            </div>
          ) : (
            groups.map((grp) => (
              <div key={grp.title} style={{ marginBottom: 6 }}>
                <div
                  style={{
                    fontSize: 12,
                    color: "var(--text-3)",
                    padding: "6px 12px 4px",
                    fontWeight: 600
                  }}
                >
                  {grp.title}
                </div>
                {grp.items.map((item) => {
                  const idx = flat.indexOf(item);
                  const isActive = idx === active;
                  return (
                    <div
                      key={item.key}
                      onMouseEnter={() => setActive(idx)}
                      onClick={() => go(item)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        padding: "9px 12px",
                        borderRadius: 8,
                        cursor: "pointer",
                        background: isActive ? "var(--brand-tint)" : "transparent"
                      }}
                    >
                      {item.kind === "hot" ? (
                        <FireFilled style={{ color: "#ff4d4f", fontSize: 14 }} />
                      ) : (
                        <SearchOutlined style={{ color: "var(--text-3)", fontSize: 13 }} />
                      )}
                      <div style={{ minWidth: 0, flex: 1 }}>
                        <div
                          style={{
                            fontSize: 14,
                            color: "var(--text-1)",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis"
                          }}
                        >
                          {highlight(item.label, kw)}
                        </div>
                        {item.sub && (
                          <div
                            style={{
                              fontSize: 12,
                              color: "var(--text-3)",
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis"
                            }}
                          >
                            {highlight(item.sub, kw)}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ))
          )}
          <div
            style={{
              borderTop: "1px solid var(--border)",
              marginTop: 4,
              padding: "8px 12px 4px",
              fontSize: 12,
              color: "var(--text-3)"
            }}
          >
            回车搜索 · ↑↓ 选择 · 点击直达
          </div>
        </div>
      )}
    </div>
  );
}
