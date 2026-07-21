"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ThumbsUp,
  MessageSquare,
  Image as ImageIcon,
  Hash,
  Send,
  Sparkles,
  Star,
} from "lucide-react";
import type { Post, NewsItem } from "@/lib/types";
import { posts, news } from "@/lib/mock-data";

// ── 侧栏数据 ──
const tutorials = [
  { title: "鱼皮的 AI 知识库（免费）", href: "/#learn" },
  { title: "2026 全栈编程学习路线汇总：AI/Java/Go/...", href: "/#learn" },
  { title: "Vue3 + SpringBoot + AI + DDD 企业级驾...", href: "/#learn" },
];

const sidebarNews: NewsItem[] = news.slice(0, 4);

// ── Tab 定义（对齐截图） ──
type CommunityTab =
  | "recommend"
  | "featured"
  | "ai-coding"
  | "ai-agent"
  | "tutorials"
  | "creative"
  | "ai-tools";

const TABS: { key: CommunityTab; label: string }[] = [
  { key: "recommend", label: "推荐" },
  { key: "featured", label: "精选" },
  { key: "ai-coding", label: "AI编程" },
  { key: "ai-agent", label: "AI智能体" },
  { key: "tutorials", label: "资源教程" },
  { key: "creative", label: "创意玩法" },
  { key: "ai-tools", label: "AI工具" },
];

// ── 发帖器 Tab ──
type ComposerTab = "chat" | "article";

export default function CommunityClient() {
  const [tab, setTab] = useState<CommunityTab>("recommend");
  const [composerTab, setComposerTab] = useState<ComposerTab>("chat");
  const [composerText, setComposerText] = useState("");
  const [showFullComposer, setShowFullComposer] = useState(false);

  // 按当前 tab 过滤/排序帖子
  const filteredPosts = getFilteredPosts(tab, posts);

  async function handlePublish() {
    if (!composerText.trim()) return;
    // TODO: 调用 API 提交
    alert(composerTab === "chat" ? "已发布讨论！" : "文章提交成功，审核后展示。");
    setComposerText("");
    setShowFullComposer(false);
  }

  return (
    <div className="mx-auto max-w-[1200px] px-4 py-6">
      {/* ══════════════ 发帖器区域 ══════════════ */}
      <div className="card p-4 mb-5">
        {/* 随便聊 / 写文章 切换 */}
        <div className="flex gap-2 mb-3">
          <button
            onClick={() => setComposerTab("chat")}
            className={`h-8 px-4 rounded-md text-sm font-medium transition ${
              composerTab === "chat"
                ? "text-white"
                : ""
            }`}
            style={{
              background: composerTab === "chat" ? "var(--primary)" : "transparent",
              border: `1px solid ${composerTab === "chat" ? "var(--primary)" : "var(--border)"}`,
              color: composerTab === "chat" ? "#fff" : "var(--text)",
            }}
          >
            随便聊
          </button>
          <button
            onClick={() => setComposerTab("article")}
            className={`h-8 px-4 rounded-md text-sm font-medium transition ${
              composerTab === "article"
                ? "text-white"
                : ""
            }`}
            style={{
              background: composerTab === "article" ? "var(--primary)" : "transparent",
              border: `1px solid ${composerTab === "article" ? "var(--primary)" : "var(--border)"}`,
              color: composerTab === "article" ? "#fff" : "var(--text)",
            }}
          >
            写文章
          </button>
        </div>

        {/* 输入框 */}
        <div
          onClick={() => setShowFullComposer(true)}
          className="rounded-lg px-4 py-3 cursor-text text-sm transition hover:border-[var(--primary)]"
          style={{
            background: "var(--bg-subtle)",
            border: "1px solid var(--border)",
            color: showFullComposer || composerText ? "var(--text)" : "var(--text-muted)",
          }}
        >
          {showFullComposer || composerText ? (
            <textarea
              value={composerText}
              onChange={(e) => setComposerText(e.target.value)}
              placeholder="点击 聊聊，快来和大家讨论吧~"
              rows={4}
              className="w-full bg-transparent outline-none resize-none text-sm"
              style={{ color: "var(--text)" }}
              autoFocus
            />
          ) : (
            <span>点击 <span style={{ color: "var(--primary)", fontWeight: 500 }}>聊聊</span>，快来和大家讨论吧~</span>
          )}
        </div>

        {/* 底部工具栏：党情 / 图片 / 关联话题 ... 发布 */}
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-4 text-sm" style={{ color: "var(--text-muted)" }}>
            <button className="flex items-center gap-1 hover:text-[var(--primary)] transition">
              <ThumbsUp size={16} /> 党情
            </button>
            <button className="flex items-center gap-1 hover:text-[var(--primary)] transition">
              <ImageIcon size={16} /> 图片
            </button>
            <button className="flex items-center gap-1 hover:text-[var(--primary)] transition">
              <Hash size={16} /> 关联话题
            </button>
          </div>
          <button
            onClick={handlePublish}
            disabled={!composerText.trim()}
            className="h-8 px-5 rounded-md text-sm font-medium text-white transition disabled:opacity-40"
            style={{ background: "var(--primary)" }}
          >
            发布
          </button>
        </div>
      </div>

      {/* ══════════════ 左右双栏布局 ══════════════ */}
      <div className="grid gap-5 lg:grid-cols-[1fr_320px]" style={{ alignItems: "start" }}>
        {/* ──── 左侧：主内容流 ──── */}
        <div>
          {/* Tab 栏 */}
          <div className="flex gap-5 mb-4 border-b" style={{ borderColor: "var(--border)" }}>
            {TABS.map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`pb-3 text-sm font-medium relative transition ${
                  tab === t.key ? "" : "hover:text-[var(--text)]"
                }`}
                style={{ color: tab === t.key ? "var(--primary)" : "var(--text-muted)" }}
              >
                {t.label}
                {tab === t.key && (
                  <span
                    className="absolute left-0 right-0 -bottom-px h-0.5 rounded-full"
                    style={{ background: "var(--primary)" }}
                  />
                )}
              </button>
            ))}
          </div>

          {/* 帖子列表 */}
          <div className="space-y-4">
            {filteredPosts.length > 0 ? (
              filteredPosts.map((post) => <PostCardWithImage key={post.id} post={post} />)
            ) : (
              <div className="card p-10 text-center" style={{ color: "var(--text-muted)" }}>
                <Sparkles size={32} className="mx-auto mb-3 opacity-30" />
                <p>暂无内容，快来发布第一条吧～</p>
              </div>
            )}
          </div>
        </div>

        {/* ──── 右侧边栏 ──── */}
        <aside className="space-y-5">
          {/* 推荐教程 */}
          <div className="card p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-base">推荐教程</h3>
              <Link
                href="/#learn"
                className="text-xs hover:underline"
                style={{ color: "var(--primary)" }}
              >
                更多
              </Link>
            </div>
            <ul className="space-y-3">
              {tutorials.map((t, i) => (
                <li key={i}>
                  <Link
                    href={t.href}
                    className="flex items-center justify-between group text-sm py-1"
                  >
                    <span className="truncate group-hover:text-[var(--primary)] transition" style={{ color: "var(--text)" }}>
                      {t.title}
                    </span>
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="ml-2 shrink-0 opacity-30 group-hover:opacity-70 group-hover:text-[var(--primary)] transition"
                      style={{ color: "var(--text-muted)" }}
                    >
                      <path d="M9 18l6-6-6-6" />
                    </svg>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ⭐ AI 资讯 */}
          <div className="card p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-base flex items-center gap-1.5">
                <Star size={15} className="fill-amber-400 text-amber-400" />
                AI 资讯
              </h3>
              <Link
                href="/#news"
                className="text-xs hover:underline"
                style={{ color: "var(--primary)" }}
              >
                更多
              </Link>
            </div>
            <ol className="space-y-3">
              {sidebarNews.map((n, i) => (
                <li key={n.id} className="flex gap-2.5 text-sm leading-snug">
                  <span
                    className="shrink-0 w-5 h-5 flex items-center justify-center rounded text-xs font-bold mt-0.5"
                    style={{
                      color: i < 3 ? "#ef4444" : "var(--text-muted)",
                      background: i < 3 ? "#fef2f2" : "var(--bg-subtle)",
                    }}
                  >
                    {i + 1}
                  </span>
                  <Link
                    href={n.url}
                    className="group line-clamp-2 hover:text-[var(--primary)] transition"
                    style={{ color: "var(--text)" }}
                  >
                    {n.title}
                  </Link>
                </li>
              ))}
            </ol>
          </div>
        </aside>
      </div>
    </div>
  );
}

/* ─────────────────────── 帖子卡片（带右侧缩略图） ─────────────────────── */
function PostCardWithImage({ post }: { post: Post & { coverImage?: string; authorBadges?: string[] } }) {
  // 扩展字段兼容
  const coverImage = (post as any).coverImage ?? "";
  const authorBadges = (post as any).authorBadges ?? [] as string[];

  return (
    <Link
      href={`/community/${post.id}`}
      className="card p-4 flex gap-4 hover:-translate-y-0.5 transition group"
    >
      {/* 左侧：内容区 */}
      <div className="flex-1 min-w-0 flex flex-col gap-1.5">
        {/* 作者行 */}
        <div className="flex items-center gap-2 text-xs flex-wrap">
          {/* 头像 */}
          <span className="w-7 h-7 rounded-full flex items-center justify-center text-sm shrink-0"
            style={{ background: "var(--bg-subtle)" }}>
            {post.authorAvatar || "👤"}
          </span>
          {/* 昵称 + 徽章 */}
          <span className="font-medium truncate" style={{ color: "var(--text)" }}>{post.author}</span>
          {authorBadges.map((b: string) => (
            <span key={b}>{b}</span>
          ))}
          {/* 时间 */}
          <span style={{ color: "var(--text-muted)" }}>{formatTime(post.createdAt)}</span>
        </div>

        {/* 标题 */}
        <h3 className="font-bold text-base leading-snug group-hover:text-[var(--primary)] transition line-clamp-2">
          {post.title}
        </h3>

        {/* 内容预览 */}
        <p className="text-sm line-clamp-2" style={{ color: "var(--text-muted)" }}>
          {post.content}
        </p>

        {/* 底部标签行 */}
        <div className="flex items-center gap-2 mt-auto pt-1">
          <span
            className="text-xs px-2 py-0.5 rounded"
            style={{ background: "var(--bg-subtle)", color: "var(--primary)" }}
          >
            查看全文
          </span>
          <div className="flex items-center gap-3 text-xs" style={{ color: "var(--text-muted)" }}>
            <span className="flex items-center gap-0.5"><ThumbsUp size={13} /> {post.likes}</span>
            <span className="flex items-center gap-0.5"><MessageSquare size={13} /> {post.comments}</span>
          </div>
        </div>
      </div>

      {/* 右侧缩略图 */}
      {coverImage && (
        <div
          className="shrink-0 w-[160px] h-[100px] rounded-lg overflow-hidden hidden sm:block"
          style={{
            background:
              coverImage.startsWith("linear-gradient") || coverImage.startsWith("url(")
                ? coverImage
                : `center/cover no-repeat url(${coverImage})`,
          }}
        />
      )}
    </Link>
  );
}

/* ── 简易时间格式化 ── */
function formatTime(iso: string): string {
  const d = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMin = Math.floor(diffMs / 60000);

  if (diffMin < 1) return "刚刚";
  if (diffMin < 60) return `${diffMin}分钟前`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}小时前`;
  if (diffHr < 48) return "昨天";
  return d.toLocaleDateString("zh-CN", { month: "numeric", day: "numeric" });
}

/* ── 按 Tab 过滤/排序 ── */
function getFilteredPosts(tab: CommunityTab, all: Post[]): Post[] {
  let list = [...all];
  switch (tab) {
    case "featured":
      list = list.filter((p) => p.likes >= 200); // 高赞即精选
      break;
    case "ai-coding":
      list = list.filter((p) =>
        ["编程", "代码", "Claude Code", "Cursor", "Copilot"].some((kw) =>
          p.title.includes(kw) || p.content.includes(kw)
        )
      );
      break;
    case "ai-agent":
      list = list.filter((p) =>
        ["智能体", "Agent", "工作流", "自动化"].some((kw) =>
          p.title.includes(kw) || p.content.includes(kw)
        )
      );
      break;
    case "tutorials":
      list = list.filter((p) =>
        ["教程", "学习", "入门", "实战"].some((kw) =>
          p.title.includes(kw) || p.tags.includes(kw))
      );
      break;
    case "creative":
      list = list.filter((p) =>
        ["绘画", "视频", "音乐", "创作"].some((kw) =>
          p.title.includes(kw) || p.tags.includes(kw))
      );
      break;
    case "ai-tools":
      list = list.filter((p) =>
        p.type === "share" || ["工具", "效率", "推荐"].some((kw) => p.tags.includes(kw))
      );
      break;
    default:
      // recommend: 全部按时间倒序
      break;
  }

  return list.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
}
