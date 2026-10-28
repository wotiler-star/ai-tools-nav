"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Avatar, App, Modal } from "antd";
import {
  UserOutlined,
  SmileOutlined,
  PictureOutlined,
  TagsOutlined,
  LikeOutlined,
  MessageOutlined,
  ShareAltOutlined,
  RightOutlined
} from "@ant-design/icons";
import { useAppStore } from "@/store/useAppStore";
import { AiPost, KbColumn } from "@/types";
import { api } from "@/lib/api";
import RichTextEditor from "@/components/RichTextEditor";

/* ============================================================
 * /essay 社区页（客户端渲染部分）
 * 布局：左 75% 主区（快捷发布区 + 推荐/精选/话题 Tab + 帖子流）
 *       右 25% 侧栏（站长卡片 + 推荐教程 + 广告位）
 * 数据：服务端已把 posts / columns 作为 props 注入，客户端直接渲染
 *       —— 首屏 SSR HTML 即含帖子流与推荐教程（对齐目标站 SSR，利于 SEO）。
 *       数据为静态 mock，无需客户端再经 /api 拉取。
 * ============================================================ */

const BRAND = "#1777ff";

/** 服务端注入的初始数据形状（首屏 SSR 即含内容，无需客户端再拉取） */
type EssayFeedProps = {
  /** 帖子流 */
  posts: AiPost[];
  /** 推荐教程（热门专栏） */
  columns: KbColumn[];
};

/** 页面内展示用的帖子视图（在后端 AiPost 基础上补充展示字段） */
interface PostView {
  id: number;
  authorName: string;
  authorAvatar: string;
  level: string; // 作者等级/职业徽标，如「后端」
  topic: string; // 话题：AI编程 / AI智能体 / 资源教程 / 创意玩法
  createTime: string;
  title: string;
  summary: string;
  tags: string[];
  likeNum: number;
  commentNum: number;
  content: string;
  bestComment?: { user: string; text: string };
}

// ---------- 确定性兜底数据池（后端无该字段时映射） ----------
function hash(input: string | number): number {
  const s = String(input);
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}
const TOPICS = ["AI编程", "AI智能体", "资源教程", "创意玩法"];
const LEVELS = ["后端", "前端开发", "全栈工程师", "Java后端", "网站运营", "AI玩家", "产品经理"];
const EXTRA_TAGS = ["AI", "交流", "实战", "经验分享"];
const COMMENTERS = ["编程导航_小y", "加油鸭", "青碧凝霜", "不会喷火的小火龙", "一天创造一个奇迹", "离殇"];
const COMMENTS = [
  "太棒了，感谢分享！已经收藏～",
  "鱼皮这波测评太硬核了，学到了！",
  "正需要这个，楼主牛！",
  "收藏了，回头慢慢研究。",
  "思路很清晰，受教了🙏",
  "这个实战案例太有参考价值了！"
];

/** 后端 AiPost → 前端 PostView（话题/等级/标签/神评做确定性兜底映射） */
function toPostView(p: AiPost): PostView {
  const h = hash(p.id);
  const topic = TOPICS[h % TOPICS.length];
  const summary = p.content
    ? p.content.replace(/\s+/g, " ").trim().slice(0, 90)
    : "（暂无简介）";
  const tags = Array.from(new Set([topic, EXTRA_TAGS[h % EXTRA_TAGS.length]]));
  return {
    id: p.id,
    authorName: p.authorName || "匿名用户",
    authorAvatar: p.authorAvatar || "",
    level: LEVELS[h % LEVELS.length],
    topic,
    createTime: (p.createTime || "").toString(),
    title: p.title,
    summary,
    tags,
    likeNum: p.likeNum || 0,
    commentNum: p.commentNum || 0,
    content: p.content || "",
    bestComment: {
      user: COMMENTERS[h % COMMENTERS.length],
      text: COMMENTS[(h >> 3) % COMMENTS.length]
    }
  };
}

/** 本地乐观发布的帖子（写文章 / 快捷发布） */
function makeLocalView(input: {
  id: number;
  title: string;
  content: string;
  authorName: string;
  authorAvatar: string;
}): PostView {
  const h = hash(input.id);
  const topic = TOPICS[h % TOPICS.length];
  const summary = input.content
    ? input.content.replace(/\s+/g, " ").trim().slice(0, 90)
    : input.title;
  return {
    id: input.id,
    authorName: input.authorName || "我",
    authorAvatar: input.authorAvatar || "",
    level: "AI社区",
    topic,
    createTime: new Date().toISOString(),
    title: input.title,
    summary,
    tags: [topic],
    likeNum: 0,
    commentNum: 0,
    content: input.content,
    bestComment: undefined
  };
}

/** 相对时间：今天 15:14 / 昨天 22:08 / 3 天前 / 08-28 13:51 */
function relTime(s: string): string {
  if (!s) return "";
  let d = new Date(s); // 兼容 ISO：2026-09-03T23:19:50
  if (isNaN(d.getTime())) d = new Date(s.replace(" ", "T")); // 兼容 2026-09-03 23:19:50
  if (isNaN(d.getTime())) return s.slice(0, 10);
  const now = new Date();
  const diff = (now.getTime() - d.getTime()) / 1000;
  const pad = (n: number) => String(n).padStart(2, "0");
  const hm = `${pad(d.getHours())}:${pad(d.getMinutes())}`;
  if (diff < 60) return "刚刚";
  if (diff < 3600) return `${Math.floor(diff / 60)}分钟前`;
  const sameDay = d.toDateString() === now.toDateString();
  if (sameDay) return `今天 ${hm}`;
  const y = new Date(now);
  y.setDate(now.getDate() - 1);
  if (d.toDateString() === y.toDateString()) return `昨天 ${hm}`;
  if (diff < 7 * 86400) return `${Math.floor(diff / 86400)} 天前`;
  return `${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${hm}`;
}

const TABS = [
  { key: "recommend", label: "推荐" },
  { key: "good", label: "精选" },
  { key: "AI编程", label: "AI编程" },
  { key: "AI智能体", label: "AI智能体" },
  { key: "资源教程", label: "资源教程" },
  { key: "创意玩法", label: "创意玩法" },
  { key: "AI工具", label: "AI工具" }
];

export default function EssayFeed({ posts, columns }: EssayFeedProps) {
  const { loginUser, openLoginModal } = useAppStore();
  const { message } = App.useApp();

  const [localPosts, setLocalPosts] = useState<PostView[]>([]);
  const [quickText, setQuickText] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // 写文章弹窗状态
  const [writeOpen, setWriteOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newTags, setNewTags] = useState("");
  const [editorText, setEditorText] = useState("");
  const [publishing, setPublishing] = useState(false);

  const [tab, setTab] = useState("recommend");

  // 帖子流：直接来自服务端注入的 posts（首屏 SSR 即含内容，无需客户端再拉取）
  const realPosts: PostView[] = useMemo(
    () => posts.map(toPostView),
    [posts]
  );

  const allPosts = useMemo(
    () => [...localPosts, ...realPosts],
    [localPosts, realPosts]
  );

  // Tab 过滤：精选=按点赞排序；话题 Tab=按话题过滤；推荐=全部
  const filtered = useMemo(() => {
    let list = allPosts;
    if (tab === "good") list = [...list].sort((a, b) => b.likeNum - a.likeNum);
    else if (tab !== "recommend")
      list = list.filter((p) => p.topic === tab);
    return list;
  }, [allPosts, tab]);

  // 侧栏「推荐教程」：热门专栏（服务端注入 columns，首屏 SSR 即含）
  const sideCols = columns;

  const publish = async (
    title: string,
    summary: string,
    _tags: string[],
    content: string
  ) => {
    if (!loginUser) {
      openLoginModal();
      return;
    }
    if (!title.trim()) {
      message.warning("请填写标题");
      return;
    }
    const tempId = -Date.now();
    const optimistic = makeLocalView({
      id: tempId,
      title: title.trim(),
      content,
      authorName: loginUser.userName || "我",
      authorAvatar: loginUser.userAvatar || ""
    });
    setLocalPosts((prev) => [optimistic, ...prev]);
    setWriteOpen(false);
    setNewTitle("");
    setNewTags("");
    setEditorText("");

    setPublishing(true);
    try {
      await api.addPost({
        title: title.trim(),
        content,
        authorName: loginUser.userName || "我",
        authorAvatar: loginUser.userAvatar || ""
      });
      message.success("发布成功");
    } catch (e: any) {
      setLocalPosts((prev) => prev.filter((p) => p.id !== tempId));
      message.error(e?.message || "发布失败，请稍后再试");
    } finally {
      setPublishing(false);
    }
  };

  const publishQuick = () => {
    if (!loginUser) {
      openLoginModal();
      return;
    }
    const text = quickText.trim();
    if (!text) {
      message.warning("说点什么吧～");
      return;
    }
    publish(text.slice(0, 40) || "来自社区的分享", text.slice(0, 60), [], text);
    setQuickText("");
  };

  const renderPost = (p: PostView) => (
    <article
      key={p.id}
      style={{
        borderBottom: "1px solid var(--border)",
        padding: "18px 4px"
      }}
    >
      {/* 作者信息 */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
        <Avatar
          size={40}
          src={p.authorAvatar || undefined}
          icon={<UserOutlined />}
          style={{ background: "#9ca3af", flexShrink: 0 }}
        />
        <div style={{ lineHeight: 1.35, minWidth: 0 }}>
          <div style={{ fontWeight: 600, fontSize: 14, color: "var(--text-1)" }}>
            {p.authorName}
          </div>
          <div
            style={{
              fontSize: 12,
              color: "var(--text-3)",
              display: "flex",
              gap: 6,
              alignItems: "center",
              flexWrap: "wrap"
            }}
          >
            <span
              style={{
                background: "var(--surface-2)",
                border: "1px solid var(--border)",
                borderRadius: 4,
                padding: "0 6px",
                color: "var(--text-2)"
              }}
            >
              {p.level}
            </span>
            <span>·</span>
            <span style={{ whiteSpace: "nowrap" }}>{relTime(p.createTime)}</span>
          </div>
        </div>
      </div>

      {/* 标题 + 摘要（点击进详情） */}
      <Link
        href={`/post/${p.id}`}
        className="essay-post-title"
        style={{
          display: "block",
          fontSize: 18,
          fontWeight: 700,
          color: "var(--text-1)",
          marginBottom: 6
        }}
      >
        {p.title}
      </Link>
      <Link href={`/post/${p.id}`} style={{ display: "block" }}>
        <p
          style={{
            margin: 0,
            fontSize: 14,
            lineHeight: "22px",
            color: "var(--text-2)",
            display: "-webkit-box",
            WebkitBoxOrient: "vertical",
            WebkitLineClamp: 2,
            overflow: "hidden"
          }}
        >
          {p.summary}
        </p>
        <span
          style={{
            color: BRAND,
            fontSize: 14,
            display: "inline-block",
            marginTop: 4
          }}
        >
          查看全文
        </span>
      </Link>

      {/* 神评 */}
      {p.bestComment && (
        <div
          style={{
            marginTop: 10,
            background: "var(--surface-2)",
            borderRadius: 8,
            padding: "8px 12px",
            fontSize: 13,
            color: "var(--text-2)",
            display: "flex",
            gap: 6,
            alignItems: "flex-start"
          }}
        >
          <MessageOutlined style={{ color: "#9ca3af", marginTop: 2, flexShrink: 0 }} />
          <div>
            <span style={{ fontWeight: 600, color: "var(--text-1)" }}>
              {p.bestComment.user}
            </span>
            ：{p.bestComment.text}
          </div>
        </div>
      )}

      {/* 标签 */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 10 }}>
        {p.tags.map((t) => (
          <span key={t} className="essay-tag">
            #{t}
          </span>
        ))}
      </div>

      {/* 互动栏 */}
      <div
        style={{
          display: "flex",
          gap: 28,
          marginTop: 10,
          color: "var(--text-3)",
          fontSize: 14
        }}
      >
        <span style={{ cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6 }}>
          <LikeOutlined /> {p.likeNum}
        </span>
        <span style={{ cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6 }}>
          <MessageOutlined /> {p.commentNum}
        </span>
        <span style={{ cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6 }}>
          <ShareAltOutlined /> 分享
        </span>
      </div>
    </article>
  );

  const composer = (
    <div
      style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: 12,
        padding: 16,
        marginBottom: 16
      }}
    >
      <div style={{ display: "flex", gap: 10, marginBottom: 12 }}>
        <button
          className="brand-btn"
          style={{ height: 36, borderRadius: 8, padding: "0 18px", fontSize: 14 }}
          onClick={() => inputRef.current?.focus()}
        >
          随便聊
        </button>
        <button
          className="brand-btn-ghost"
          style={{ height: 36, borderRadius: 8, padding: "0 18px", fontSize: 14 }}
          onClick={() => (loginUser ? setWriteOpen(true) : openLoginModal())}
        >
          写文章
        </button>
      </div>

      <textarea
        ref={inputRef}
        value={quickText}
        onChange={(e) => setQuickText(e.target.value)}
        placeholder={
          loginUser ? "随便聊，分享你的想法～" : "点击登录，快来和大家讨论吧～"
        }
        onClick={() => !loginUser && openLoginModal()}
        readOnly={!loginUser}
        style={{
          width: "100%",
          minHeight: 64,
          resize: "vertical",
          border: "1px solid var(--border)",
          borderRadius: 8,
          padding: 12,
          fontSize: 14,
          background: "var(--surface-2)",
          color: "var(--text-1)",
          outline: "none",
          fontFamily: "inherit"
        }}
      />

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: 12
        }}
      >
        <div style={{ display: "flex", gap: 16, color: "var(--text-3)", fontSize: 13 }}>
          <span style={{ cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 4 }}>
            <SmileOutlined /> 表情
          </span>
          <span style={{ cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 4 }}>
            <PictureOutlined /> 图片
          </span>
          <span style={{ cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 4 }}>
            <TagsOutlined /> 关联话题
          </span>
        </div>
        <button
          className="brand-btn"
          style={{ height: 32, borderRadius: 9999, padding: "0 24px", fontSize: 14 }}
          onClick={publishQuick}
        >
          发布
        </button>
      </div>
    </div>
  );

  return (
    <div style={{ background: "var(--page-bg)", minHeight: "100vh", padding: "24px 0" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 16px" }}>
        <div className="essay-row">
          {/* ===== 主区 75% ===== */}
          <article className="essay-main">
            {composer}

            <div
              style={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: 12,
                marginBottom: 16,
                overflow: "hidden"
              }}
            >
              {/* Tab 栏：推荐 / 精选 / 话题 */}
              <div
                style={{
                  display: "flex",
                  borderBottom: "1px solid var(--border)",
                  overflowX: "auto"
                }}
              >
                {TABS.map((t) => (
                  <button
                    key={t.key}
                    className={`essay-tab${tab === t.key ? " essay-tab-active" : ""}`}
                    onClick={() => setTab(t.key)}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              {/* 帖子流 */}
              <div style={{ padding: "4px 16px" }}>
                {filtered.length === 0 ? (
                  <div style={{ padding: "60px 0", textAlign: "center", color: "var(--text-3)", fontSize: 14 }}>
                    暂无帖子，快来发布第一条吧～
                  </div>
                ) : (
                  filtered.map(renderPost)
                )}
              </div>
            </div>
          </article>

          {/* ===== 侧栏 25% ===== */}
          <aside className="essay-side">
            {/* 推荐教程：热门专栏 Top3（对齐目标站右侧「推荐教程」卡） */}
            <div
              style={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: 12,
                padding: 16,
                marginBottom: 16
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 8
                }}
              >
                <div style={{ fontWeight: 700, fontSize: 15 }}>推荐教程</div>
                <Link href="/library" style={{ fontSize: 13, color: "var(--text-3)" }}>
                  更多
                </Link>
              </div>
              {sideCols.length === 0 ? (
                <div style={{ padding: "8px 0", color: "var(--text-3)", fontSize: 13 }}>
                  暂无教程
                </div>
              ) : (
                sideCols.map((c) => (
                  <Link
                    key={c.id}
                    href={`/library/${c.id}`}
                    className="essay-side-link"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      height: 40,
                      padding: "0 4px",
                      borderTop: "1px solid var(--border)",
                      color: "var(--text-2)",
                      fontSize: 14
                    }}
                  >
                    <span
                      style={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        marginRight: 8
                      }}
                    >
                      {c.title}
                    </span>
                    <RightOutlined style={{ color: "var(--text-3)", fontSize: 12, flexShrink: 0 }} />
                  </Link>
                ))
              )}
            </div>

            {/* 站长卡片 */}
            <div
              style={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: 12,
                padding: 16,
                marginBottom: 16
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                <Avatar
                  size={44}
                  src="https://ai.codefather.cn/logo.png"
                  icon={<UserOutlined />}
                  style={{ background: BRAND, flexShrink: 0 }}
                />
                <div style={{ lineHeight: 1.4 }}>
                  <div style={{ fontWeight: 700, fontSize: 15 }}>站长：程序员鱼皮</div>
                  <div style={{ fontSize: 12, color: "var(--text-3)" }}>
                    AI 导航创始人 · 全栈工程师
                  </div>
                </div>
              </div>
              <button
                className="brand-btn"
                style={{ width: "100%", height: 36, borderRadius: 8, fontSize: 14, marginBottom: 12 }}
              >
                关注
              </button>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                <a
                  href="https://www.laoyujianli.com/"
                  target="_blank"
                  rel="noreferrer"
                  className="chip"
                  style={{ fontSize: 12 }}
                >
                  老鱼简历
                </a>
                <a
                  href="https://yuyuanweb.feishu.cn/wiki/AOzgw1mOliX6SskAVEicK6u7nDA"
                  target="_blank"
                  rel="noreferrer"
                  className="chip"
                  style={{ fontSize: 12 }}
                >
                  商务合作
                </a>
              </div>
            </div>

          </aside>
        </div>
      </div>

      {/* 写文章弹窗（Slate 富文本编辑器） */}
      <Modal
        title="写文章"
        open={writeOpen}
        onCancel={() => !publishing && setWriteOpen(false)}
        onOk={() =>
          publish(
            newTitle,
            editorText.slice(0, 60),
            newTags
              .split(/[,，]/)
              .map((s) => s.trim())
              .filter(Boolean),
            editorText
          )
        }
        okText="发布"
        cancelText="取消"
        confirmLoading={publishing}
        width={680}
        destroyOnClose
      >
        <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 12 }}>
          <input
            placeholder="标题"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            maxLength={60}
            style={{
              height: 40,
              padding: "0 12px",
              borderRadius: 8,
              border: "1px solid var(--border)",
              fontSize: 15,
              background: "var(--surface)",
              color: "var(--text-1)",
              outline: "none"
            }}
          />
          <input
            placeholder="标签（逗号分隔，如：AI编程,效率）"
            value={newTags}
            onChange={(e) => setNewTags(e.target.value)}
            style={{
              height: 40,
              padding: "0 12px",
              borderRadius: 8,
              border: "1px solid var(--border)",
              fontSize: 14,
              background: "var(--surface)",
              color: "var(--text-1)",
              outline: "none"
            }}
          />
          <RichTextEditor onChange={(_nodes, plain) => setEditorText(plain)} />
          <div style={{ display: "flex", gap: 16, color: "var(--text-3)", fontSize: 13 }}>
            <span style={{ cursor: "pointer" }}>
              <SmileOutlined /> 表情
            </span>
            <span style={{ cursor: "pointer" }}>
              <PictureOutlined /> 图片
            </span>
            <span style={{ cursor: "pointer" }}>
              <TagsOutlined /> 关联话题
            </span>
          </div>
        </div>
      </Modal>
    </div>
  );
}
