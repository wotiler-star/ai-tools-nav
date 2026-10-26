"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { App, Button, Input, Modal, Popconfirm, Spin } from "antd";
import { CopyOutlined, DeleteOutlined } from "@ant-design/icons";
import useSWR from "swr";
import { api } from "@/lib/api";
import { useAppStore } from "@/store/useAppStore";
import {
  AiMessage,
  AiPost,
  AiPrompt,
  BaseResponse,
  BaseResponsePage,
  MemberVO,
  UserFavorite
} from "@/types";

/* ==================== 通用容器 ==================== */

function Panel({
  title,
  desc,
  children
}: {
  title: string;
  desc?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: 14,
        padding: 22
      }}
    >
      <div style={{ fontSize: 16, fontWeight: 600, color: "var(--text-1)" }}>
        {title}
      </div>
      {desc ? (
        <div style={{ fontSize: 13, color: "var(--text-3)", marginTop: 4, marginBottom: 18 }}>
          {desc}
        </div>
      ) : (
        <div style={{ height: 18 }} />
      )}
      {children}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
      <div style={{ width: 80, flexShrink: 0, fontSize: 14, color: "var(--text-2)" }}>
        {label}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>{children}</div>
    </div>
  );
}

function EmptyBox({ text }: { text: string }) {
  return (
    <div
      style={{
        textAlign: "center",
        padding: "52px 16px",
        color: "var(--text-3)",
        fontSize: 14
      }}
    >
      <div style={{ fontSize: 34, marginBottom: 12, opacity: 0.55 }}>📭</div>
      {text}
    </div>
  );
}

function Loading() {
  return (
    <div style={{ display: "flex", justifyContent: "center", padding: "52px 0" }}>
      <Spin />
    </div>
  );
}

/* ==================== 1. 个人资料 ==================== */

export function ProfileTab() {
  const { loginUser, setLoginUser } = useAppStore();
  const { message } = App.useApp();
  const [form, setForm] = useState({
    userName: "",
    userAvatar: "",
    userProfile: "",
    email: "",
    phone: ""
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!loginUser) return;
    setForm({
      userName: loginUser.userName ?? "",
      userAvatar: loginUser.userAvatar ?? "",
      userProfile: loginUser.userProfile ?? "",
      email: loginUser.email ?? "",
      phone: loginUser.phone ?? ""
    });
  }, [loginUser]);

  const onSave = async () => {
    setSaving(true);
    try {
      const res = await api.updateProfile(form);
      if (res.code === 0 && res.data) {
        setLoginUser(res.data);
        message.success("资料已更新");
      }
    } catch (e: any) {
      message.error(e?.message || "保存失败");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Panel title="个人资料" desc="修改你的昵称、头像与联系方式，点击保存后立即生效">
      <Field label="昵称">
        <Input
          value={form.userName}
          onChange={(e) => setForm({ ...form, userName: e.target.value })}
          placeholder="请输入昵称"
        />
      </Field>
      <Field label="头像 URL">
        <Input
          value={form.userAvatar}
          onChange={(e) => setForm({ ...form, userAvatar: e.target.value })}
          placeholder="粘贴头像图片地址"
        />
      </Field>
      <Field label="个人简介">
        <Input.TextArea
          value={form.userProfile}
          onChange={(e) => setForm({ ...form, userProfile: e.target.value })}
          placeholder="介绍一下自己"
          rows={3}
        />
      </Field>
      <Field label="邮箱">
        <Input
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          placeholder="用于接收通知"
        />
      </Field>
      <Field label="手机号">
        <Input
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          placeholder="选填"
        />
      </Field>
      <div style={{ marginTop: 22 }}>
        <Button type="primary" loading={saving} onClick={onSave}>
          保存资料
        </Button>
      </div>
    </Panel>
  );
}

/* ==================== 2. 我的帖子 ==================== */

export function MyPostsTab() {
  const { message } = App.useApp();
  const { data, isLoading, mutate } = useSWR<BaseResponsePage<AiPost>>(
    "/user/mypost?current=1&pageSize=50"
  );
  const posts = data?.data?.records ?? [];

  const [editing, setEditing] = useState<AiPost | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [saving, setSaving] = useState(false);

  const openEdit = (p: AiPost) => {
    setEditing(p);
    setEditTitle(p.title ?? "");
    setEditContent(p.content ?? "");
  };

  const onSaveEdit = async () => {
    if (!editing) return;
    if (!editTitle.trim()) {
      message.warning("标题不能为空");
      return;
    }
    setSaving(true);
    try {
      await api.updatePost({
        id: editing.id as number,
        title: editTitle.trim(),
        content: editContent
      });
      message.success("已保存");
      setEditing(null);
      mutate();
    } catch (e: any) {
      message.error(e?.message || "保存失败");
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async (p: AiPost) => {
    try {
      await api.deletePost(p.id as number);
      message.success("已删除");
      mutate();
    } catch (e: any) {
      message.error(e?.message || "删除失败");
    }
  };

  return (
    <Panel title="我的帖子" desc="你发布过的社区帖子，可编辑或删除">
      {isLoading ? (
        <Loading />
      ) : posts.length === 0 ? (
        <EmptyBox text="还没有发布过帖子" />
      ) : (
        <div>
          {posts.map((p) => (
            <div
              key={p.id}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 12,
                padding: "14px 12px",
                borderBottom: "1px solid var(--border)"
              }}
            >
              <Link
                href={`/essay/${p.id}`}
                style={{ flex: 1, minWidth: 0, textDecoration: "none" }}
              >
                <div
                  style={{
                    fontSize: 15,
                    fontWeight: 600,
                    color: "var(--text-1)",
                    marginBottom: 6
                  }}
                >
                  {p.title}
                </div>
                <div
                  style={{
                    fontSize: 13,
                    color: "var(--text-3)",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    marginBottom: 8
                  }}
                >
                  {p.content?.replace(/\s+/g, " ").slice(0, 90) || "（无正文）"}
                </div>
                <div style={{ fontSize: 12, color: "var(--text-3)" }}>
                  {(p.createTime || "").toString().slice(0, 10)} · 👍 {p.likeNum ?? 0} · 💬{" "}
                  {p.commentNum ?? 0}
                </div>
              </Link>
              <div
                style={{
                  display: "flex",
                  gap: 8,
                  flexShrink: 0,
                  paddingTop: 4
                }}
              >
                <Button size="small" onClick={() => openEdit(p)}>
                  编辑
                </Button>
                <Popconfirm
                  title="确认删除这篇帖子？"
                  okText="删除"
                  cancelText="取消"
                  onConfirm={() => onDelete(p)}
                >
                  <Button size="small" danger>
                    删除
                  </Button>
                </Popconfirm>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        title="编辑帖子"
        open={!!editing}
        onCancel={() => !saving && setEditing(null)}
        onOk={onSaveEdit}
        okText="保存"
        cancelText="取消"
        confirmLoading={saving}
        destroyOnClose
      >
        <div
          style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 12 }}
        >
          <Input
            placeholder="标题"
            value={editTitle}
            maxLength={80}
            onChange={(e) => setEditTitle(e.target.value)}
          />
          <Input.TextArea
            placeholder="正文内容"
            rows={8}
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
          />
        </div>
      </Modal>
    </Panel>
  );
}

/* ==================== 3. 我的提示词 ==================== */

export function MyPromptsTab() {
  const { message } = App.useApp();
  const { data, isLoading, mutate } = useSWR<BaseResponsePage<AiPrompt>>(
    "/user/myprompt?current=1&pageSize=50"
  );
  const prompts = data?.data?.records ?? [];

  const [saving, setSaving] = useState(false);

  // ===== 发布 =====
  const [publishing, setPublishing] = useState(false);
  const [pubTitle, setPubTitle] = useState("");
  const [pubCategory, setPubCategory] = useState("");
  const [pubContent, setPubContent] = useState("");

  const onPublish = async () => {
    if (!pubTitle.trim()) {
      message.warning("标题不能为空");
      return;
    }
    setSaving(true);
    try {
      await api.addPrompt({
        title: pubTitle.trim(),
        content: pubContent,
        categoryName: pubCategory.trim() || undefined
      });
      message.success("已发布");
      setPublishing(false);
      setPubTitle("");
      setPubCategory("");
      setPubContent("");
      mutate();
    } catch (e: any) {
      message.error(e?.message || "发布失败");
    } finally {
      setSaving(false);
    }
  };

  // ===== 编辑 =====
  const [editing, setEditing] = useState<AiPrompt | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [editContent, setEditContent] = useState("");

  const openEdit = (p: AiPrompt) => {
    setEditing(p);
    setEditTitle(p.title ?? "");
    setEditCategory(p.categoryName ?? "");
    setEditContent(p.content ?? "");
  };

  const onSaveEdit = async () => {
    if (!editing) return;
    if (!editTitle.trim()) {
      message.warning("标题不能为空");
      return;
    }
    setSaving(true);
    try {
      await api.updatePrompt({
        id: editing.id as number,
        title: editTitle.trim(),
        content: editContent,
        categoryName: editCategory.trim() || undefined
      });
      message.success("已保存");
      setEditing(null);
      mutate();
    } catch (e: any) {
      message.error(e?.message || "保存失败");
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async (p: AiPrompt) => {
    try {
      await api.deletePrompt(p.id as number);
      message.success("已删除");
      mutate();
    } catch (e: any) {
      message.error(e?.message || "删除失败");
    }
  };

  const onCopy = async (p: AiPrompt) => {
    try {
      await navigator.clipboard.writeText(p.content || "");
      message.success(`已复制「${p.title}」`);
    } catch {
      message.info(p.content || "");
    }
  };

  return (
    <Panel title="我的提示词" desc="你发布过的 AI 提示词模板，可发布、编辑或删除">
      <div style={{ marginBottom: 16 }}>
        <Button type="primary" onClick={() => setPublishing(true)}>
          发布提示词
        </Button>
      </div>
      {isLoading ? (
        <Loading />
      ) : prompts.length === 0 ? (
        <EmptyBox text="还没有发布过提示词" />
      ) : (
        <div>
          {prompts.map((p) => (
            <div
              key={p.id}
              style={{
                padding: "14px 12px",
                borderBottom: "1px solid var(--border)",
                display: "flex",
                alignItems: "center",
                gap: 12
              }}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 15, fontWeight: 600, color: "var(--text-1)", marginBottom: 6 }}>
                  {p.title}
                </div>
                <div
                  style={{
                    fontSize: 13,
                    color: "var(--text-3)",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap"
                  }}
                >
                  {p.content?.replace(/\s+/g, " ").slice(0, 90) || "（无内容）"}
                </div>
              </div>
              {p.categoryName && (
                <span
                  style={{
                    fontSize: 12,
                    padding: "2px 8px",
                    borderRadius: 20,
                    background: "var(--surface-2)",
                    color: "var(--text-2)",
                    flexShrink: 0
                  }}
                >
                  {p.categoryName}
                </span>
              )}
              <div style={{ display: "flex", gap: 8, flexShrink: 0, paddingTop: 2 }}>
                <Button size="small" onClick={() => openEdit(p)}>
                  编辑
                </Button>
                <Popconfirm
                  title="确认删除这条提示词？"
                  okText="删除"
                  cancelText="取消"
                  onConfirm={() => onDelete(p)}
                >
                  <Button size="small" danger>
                    删除
                  </Button>
                </Popconfirm>
                <Button size="small" icon={<CopyOutlined />} onClick={() => onCopy(p)}>
                  复制
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        title="发布提示词"
        open={publishing}
        onCancel={() => !saving && setPublishing(false)}
        onOk={onPublish}
        okText="发布"
        cancelText="取消"
        confirmLoading={saving}
        destroyOnClose
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 12 }}>
          <Input
            placeholder="提示词标题"
            value={pubTitle}
            maxLength={80}
            onChange={(e) => setPubTitle(e.target.value)}
          />
          <Input
            placeholder="分类（选填，如 写作 / 绘画 / 编程）"
            value={pubCategory}
            maxLength={20}
            onChange={(e) => setPubCategory(e.target.value)}
          />
          <Input.TextArea
            placeholder="提示词内容"
            rows={8}
            value={pubContent}
            onChange={(e) => setPubContent(e.target.value)}
          />
        </div>
      </Modal>

      <Modal
        title="编辑提示词"
        open={!!editing}
        onCancel={() => !saving && setEditing(null)}
        onOk={onSaveEdit}
        okText="保存"
        cancelText="取消"
        confirmLoading={saving}
        destroyOnClose
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 12 }}>
          <Input
            placeholder="提示词标题"
            value={editTitle}
            maxLength={80}
            onChange={(e) => setEditTitle(e.target.value)}
          />
          <Input
            placeholder="分类（选填）"
            value={editCategory}
            maxLength={20}
            onChange={(e) => setEditCategory(e.target.value)}
          />
          <Input.TextArea
            placeholder="提示词内容"
            rows={8}
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
          />
        </div>
      </Modal>
    </Panel>
  );
}

/* ==================== 4. 消息中心 ==================== */

/** 消息类型 → 文案 */
const MSG_TYPE_LABEL: Record<string, string> = {
  comment: "评论了你的帖子",
  reply: "回复了你的评论",
  system: "系统通知"
};

const MSG_ICON: Record<string, string> = {
  comment: "📝",
  reply: "💬",
  system: "🔔"
};

export function MessagesTab() {
  const { message } = App.useApp();
  const { data, isLoading, mutate } = useSWR<BaseResponsePage<AiMessage>>(
    "/ai_message/list/page?current=1&pageSize=50"
  );
  const list = data?.data?.records ?? [];
  const unread = list.filter((m) => m.isRead === 0).length;

  const onRead = async (m: AiMessage) => {
    try {
      await api.markMessagesRead(m.id);
      mutate();
    } catch (e: any) {
      message.error(e?.message || "操作失败");
    }
  };

  const onReadAll = async () => {
    try {
      await api.markMessagesRead();
      message.success("已全部标记为已读");
      mutate();
    } catch (e: any) {
      message.error(e?.message || "操作失败");
    }
  };

  const onDelete = async (m: AiMessage) => {
    try {
      await api.deleteMessage(m.id);
      message.success("已删除");
      mutate();
    } catch (e: any) {
      message.error(e?.message || "删除失败");
    }
  };

  return (
    <Panel
      title="消息中心"
      desc={
        list.length === 0
          ? "暂无消息"
          : `共 ${list.length} 条消息，其中 ${unread} 条未读`
      }
    >
      <div style={{ marginBottom: 16 }}>
        <Button onClick={onReadAll} disabled={unread === 0}>
          全部标记为已读
        </Button>
      </div>
      {isLoading ? (
        <Loading />
      ) : list.length === 0 ? (
        <EmptyBox text="还没有收到任何消息" />
      ) : (
        <div>
          {list.map((m) => {
            const isUnread = m.isRead === 0;
            return (
              <div
                key={m.id}
                style={{
                  padding: "14px 12px",
                  borderBottom: "1px solid var(--border)",
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 12,
                  background: isUnread ? "var(--brand-tint)" : undefined
                }}
              >
                <span style={{ fontSize: 18, flexShrink: 0, lineHeight: 1.4 }}>
                  {MSG_ICON[m.type ?? "system"] ?? "🔔"}
                </span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: 14,
                      color: "var(--text-1)",
                      marginBottom: 4
                    }}
                  >
                    <b>{m.fromUserName || "某位用户"}</b>{" "}
                    {MSG_TYPE_LABEL[m.type ?? "system"] ?? "给你发来消息"}
                    {isUnread ? (
                      <span
                        style={{
                          marginLeft: 8,
                          fontSize: 12,
                          color: "#3874F7"
                        }}
                      >
                        未读
                      </span>
                    ) : null}
                  </div>
                  {m.targetTitle ? (
                    <div
                      style={{
                        fontSize: 13,
                        color: "var(--text-2)",
                        marginBottom: 4
                      }}
                    >
                      《{m.targetTitle}》
                    </div>
                  ) : null}
                  <div
                    style={{
                      fontSize: 13,
                      color: "var(--text-3)",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap"
                    }}
                  >
                    {m.content || "（无内容）"}
                  </div>
                  <div
                    style={{ fontSize: 12, color: "var(--text-3)", marginTop: 6 }}
                  >
                    {(m.createTime || "").toString().slice(0, 16)}
                  </div>
                </div>
                <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                  {isUnread ? (
                    <Button size="small" onClick={() => onRead(m)}>
                      标记已读
                    </Button>
                  ) : null}
                  <Popconfirm
                    title="确认删除这条消息？"
                    okText="删除"
                    cancelText="取消"
                    onConfirm={() => onDelete(m)}
                  >
                    <Button size="small" danger>
                      删除
                    </Button>
                  </Popconfirm>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Panel>
  );
}

/* ==================== 5. 我的收藏 ==================== */

const TYPE_LABEL: Record<string, string> = {
  tool: "AI 工具",
  post: "社区帖子",
  prompt: "提示词"
};

export function FavoritesTab() {
  const { message } = App.useApp();
  const { data, isLoading, mutate } = useSWR<BaseResponse<UserFavorite[]>>(
    "/user/favorite/list"
  );
  const list = data?.data ?? [];

  const onRemove = async (f: UserFavorite) => {
    try {
      await api.removeFavorite(f.targetType, f.targetId);
      message.success("已取消收藏");
      mutate();
    } catch (e: any) {
      message.error(e?.message || "操作失败");
    }
  };

  return (
    <Panel title="我的收藏" desc="收藏过的 AI 工具、帖子与提示词">
      {isLoading ? (
        <Loading />
      ) : list.length === 0 ? (
        <EmptyBox text="还没有收藏任何内容" />
      ) : (
        <div>
          {list.map((f) => (
            <div
              key={f.id}
              style={{
                padding: "14px 12px",
                borderBottom: "1px solid var(--border)",
                display: "flex",
                alignItems: "center",
                gap: 12
              }}
            >
              {f.targetCover ? (
                <img
                  src={f.targetCover}
                  alt={f.targetTitle ? `${f.targetTitle}封面` : "收藏封面"}
                  style={{ width: 40, height: 40, borderRadius: 8, objectFit: "cover", flexShrink: 0 }}
                />
              ) : null}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 15, fontWeight: 600, color: "var(--text-1)", marginBottom: 4 }}>
                  {f.targetTitle || "（无标题）"}
                </div>
                {f.targetDesc ? (
                  <div
                    style={{
                      fontSize: 13,
                      color: "var(--text-3)",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap"
                    }}
                  >
                    {f.targetDesc}
                  </div>
                ) : null}
              </div>
              <span
                style={{
                  fontSize: 12,
                  padding: "2px 8px",
                  borderRadius: 20,
                  background: "var(--brand-tint)",
                  color: "#3874F7",
                  flexShrink: 0
                }}
              >
                {TYPE_LABEL[f.targetType] ?? f.targetType}
              </span>
              <Button
                size="small"
                danger
                icon={<DeleteOutlined />}
                onClick={() => onRemove(f)}
              >
                取消
              </Button>
            </div>
          ))}
        </div>
      )}
    </Panel>
  );
}

/* ==================== 6. 会员中心 ==================== */

/** 成长等级体系（等级 + 等级名 + 升级所需成长值阈值） */
const GROWTH_LEVELS = [
  { lv: 1, name: "初出茅庐", min: 0 },
  { lv: 2, name: "小有名气", min: 100 },
  { lv: 3, name: "崭露头角", min: 300 },
  { lv: 4, name: "独当一面", min: 600 },
  { lv: 5, name: "行业精英", min: 1000 },
  { lv: 6, name: "toolly 之友", min: 2000 }
];

/** 会员套餐（会员中心 开通会员区） */
const VIP_PLANS = [
  { type: 1, name: "月度会员", price: "¥19", unit: "/月", desc: "连续包月，随时可取消", tag: "" },
  { type: 2, name: "年度会员", price: "¥198", unit: "/年", desc: "立省 ¥130，超值推荐", tag: "推荐" },
  { type: 3, name: "永久会员", price: "¥998", unit: "一次性", desc: "一次开通，终身畅享", tag: "" }
];

export function MemberTab() {
  const { message } = App.useApp();
  const { data, isLoading } = useSWR<BaseResponse<MemberVO>>("/user/member");
  const m = data?.data;

  if (isLoading) return <Panel title="会员中心"><Loading /></Panel>;

  const isVip = !!m?.isVip;
  const level = m?.level ?? 1;
  const growth = m?.points ?? 0;
  const curLevel = GROWTH_LEVELS.find((l) => l.lv === level) ?? GROWTH_LEVELS[0];
  const nextLevel = GROWTH_LEVELS.find((l) => l.lv === level + 1);
  const curMin = curLevel.min;
  const nextMin = nextLevel?.min ?? curMin;
  const progress = nextLevel
    ? Math.max(2, Math.min(100, Math.round(((growth - curMin) / (nextMin - curMin)) * 100)))
    : 100;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* 会员卡片 */}
      <div
        style={{
          borderRadius: 14,
          padding: 24,
          background: isVip
            ? "linear-gradient(135deg,#ffd76a,#ff9d2e)"
            : "linear-gradient(135deg,#3b6ff5,#7a5cff)",
          color: "#fff",
          position: "relative",
          overflow: "hidden"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18 }}>
          <span style={{ fontSize: 26 }}>{isVip ? "👑" : "🎖️"}</span>
          <div>
            <div style={{ fontSize: 20, fontWeight: 800, lineHeight: 1.2 }}>
              {m?.vipTypeName ?? "普通用户"}
            </div>
            {isVip && m?.vipExpireTime ? (
              <div style={{ fontSize: 13, opacity: 0.9, marginTop: 2 }}>
                有效期至 {String(m.vipExpireTime).slice(0, 10)}
              </div>
            ) : (
              <div style={{ fontSize: 13, opacity: 0.9, marginTop: 2 }}>
                开通会员解锁全部专属权益
              </div>
            )}
          </div>
        </div>
        <div style={{ display: "flex", gap: 36, flexWrap: "wrap" }}>
          <div>
            <div style={{ fontSize: 12, opacity: 0.85 }}>成长等级</div>
            <div style={{ fontSize: 24, fontWeight: 800, marginTop: 2 }}>Lv{level}</div>
          </div>
          <div>
            <div style={{ fontSize: 12, opacity: 0.85 }}>成长值</div>
            <div style={{ fontSize: 24, fontWeight: 800, marginTop: 2 }}>{growth}</div>
          </div>
          <div>
            <div style={{ fontSize: 12, opacity: 0.85 }}>当前头衔</div>
            <div style={{ fontSize: 24, fontWeight: 800, marginTop: 2 }}>{curLevel.name}</div>
          </div>
        </div>
      </div>

      {/* 成长体系 */}
      <Panel title="成长体系" desc="通过每日签到、发布内容、收藏点赞获取成长值，解锁更高等级与头衔">
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 10 }}>
          <div style={{ fontSize: 14, color: "var(--text-2)" }}>
            当前 <b style={{ color: "var(--text-1)" }}>Lv{level} {curLevel.name}</b>
          </div>
          <div style={{ fontSize: 13, color: "var(--text-3)" }}>
            {nextLevel ? (
              <>距 Lv{nextLevel.lv} {nextLevel.name} 还需 <b style={{ color: "#3874F7" }}>{Math.max(0, nextMin - growth)}</b> 成长值</>
            ) : (
              <>已达最高等级 🎉</>
            )}
          </div>
        </div>
        <div
          style={{
            height: 12,
            borderRadius: 999,
            background: "var(--surface-2)",
            overflow: "hidden",
            marginBottom: 14
          }}
        >
          <div
            style={{
              width: `${progress}%`,
              height: "100%",
              borderRadius: 999,
              background: "linear-gradient(90deg,#3874F7,#69b1ff)",
              transition: "width .4s ease"
            }}
          />
        </div>
        {/* 等级节点 */}
        <div style={{ display: "flex", justifyContent: "space-between", gap: 6, flexWrap: "wrap" }}>
          {GROWTH_LEVELS.map((l) => {
            const reached = level >= l.lv;
            return (
              <div
                key={l.lv}
                style={{
                  flex: "1 1 0",
                  minWidth: 78,
                  textAlign: "center",
                  padding: "8px 4px",
                  borderRadius: 10,
                  background: reached ? "var(--brand-tint)" : "var(--surface-2)",
                  border: reached ? "1px solid #3874F7" : "1px solid transparent"
                }}
              >
                <div style={{ fontSize: 13, fontWeight: 700, color: reached ? "#3874F7" : "var(--text-3)" }}>
                  Lv{l.lv}
                </div>
                <div style={{ fontSize: 12, color: "var(--text-3)", marginTop: 2 }}>{l.name}</div>
              </div>
            );
          })}
        </div>
      </Panel>

      {/* 会员权益 */}
      <Panel title="会员权益" desc="不同身份可享受到的特权">
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
          {(m?.benefits ?? []).length === 0 ? (
            <span style={{ fontSize: 13, color: "var(--text-3)" }}>暂无权益</span>
          ) : (
            (m?.benefits ?? []).map((b) => (
              <span
                key={b}
                style={{
                  fontSize: 13,
                  padding: "7px 14px",
                  borderRadius: 10,
                  background: "var(--surface-2)",
                  color: "var(--text-2)",
                  border: "1px solid var(--border)"
                }}
              >
                ✓ {b}
              </span>
            ))
          )}
        </div>
      </Panel>

      {/* 开通会员 */}
      <Panel title="开通会员" desc="升级会员，解锁更多专属特权与成长加速">
        <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
          {VIP_PLANS.map((p) => {
            const active = p.type === (m?.vipType ?? 0);
            return (
              <div
                key={p.type}
                style={{
                  flex: "1 1 0",
                  minWidth: 180,
                  position: "relative",
                  borderRadius: 14,
                  padding: "22px 18px",
                  background: "var(--surface)",
                  border: active
                    ? "2px solid #3874F7"
                    : p.tag
                    ? "2px solid #ffb020"
                    : "1px solid var(--border)"
                }}
              >
                {p.tag ? (
                  <span
                    style={{
                      position: "absolute",
                      top: -1,
                      right: 14,
                      fontSize: 12,
                      fontWeight: 700,
                      color: "#7a4a00",
                      background: "linear-gradient(135deg,#ffd76a,#ffb020)",
                      padding: "2px 10px",
                      borderBottomLeftRadius: 8,
                      borderBottomRightRadius: 8
                    }}
                  >
                    {p.tag}
                  </span>
                ) : null}
                <div style={{ fontSize: 16, fontWeight: 700, color: "var(--text-1)" }}>{p.name}</div>
                <div style={{ margin: "12px 0 4px", display: "flex", alignItems: "baseline", gap: 4 }}>
                  <span style={{ fontSize: 28, fontWeight: 800, color: "#3874F7" }}>{p.price}</span>
                  <span style={{ fontSize: 13, color: "var(--text-3)" }}>{p.unit}</span>
                </div>
                <div style={{ fontSize: 12, color: "var(--text-3)", marginBottom: 16 }}>{p.desc}</div>
                <Button
                  type={active ? "default" : "primary"}
                  block
                  onClick={() => message.info("演示站点暂未接入支付，会员功能仅作展示")}
                >
                  {active ? "当前套餐" : isVip ? "升级会员" : "开通会员"}
                </Button>
              </div>
            );
          })}
        </div>
      </Panel>
    </div>
  );
}

/* ==================== 7. 账号设置 ==================== */

export function SettingsTab() {
  const { message } = App.useApp();
  const { loginUser, setLoginUser } = useAppStore();
  const [pwd, setPwd] = useState({ oldPassword: "", newPassword: "", checkPassword: "" });
  const [saving, setSaving] = useState(false);

  const onChangePwd = async () => {
    if (!pwd.oldPassword || !pwd.newPassword || !pwd.checkPassword) {
      message.warning("请填写完整");
      return;
    }
    setSaving(true);
    try {
      await api.updatePassword(pwd.oldPassword, pwd.newPassword, pwd.checkPassword);
      message.success("密码修改成功");
      setPwd({ oldPassword: "", newPassword: "", checkPassword: "" });
    } catch (e: any) {
      message.error(e?.message || "修改失败");
    } finally {
      setSaving(false);
    }
  };

  const onLogout = async () => {
    try {
      await api.logout();
    } catch {}
    setLoginUser(null);
    message.success("已退出登录");
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <Panel title="修改密码" desc="修改后请使用新密码登录">
        <Field label="原密码">
          <Input.Password
            value={pwd.oldPassword}
            onChange={(e) => setPwd({ ...pwd, oldPassword: e.target.value })}
            placeholder="请输入当前密码"
          />
        </Field>
        <Field label="新密码">
          <Input.Password
            value={pwd.newPassword}
            onChange={(e) => setPwd({ ...pwd, newPassword: e.target.value })}
            placeholder="至少 6 位"
          />
        </Field>
        <Field label="确认新密码">
          <Input.Password
            value={pwd.checkPassword}
            onChange={(e) => setPwd({ ...pwd, checkPassword: e.target.value })}
            placeholder="再次输入新密码"
          />
        </Field>
        <div style={{ marginTop: 22 }}>
          <Button type="primary" loading={saving} onClick={onChangePwd}>
            确认修改
          </Button>
        </div>
      </Panel>

      <Panel title="账号信息">
        <div style={{ fontSize: 14, color: "var(--text-2)", lineHeight: 2 }}>
          <div>用户 ID：{loginUser?.id}</div>
          <div>角色：{loginUser?.userRole === "admin" ? "管理员" : "普通用户"}</div>
          <div>注册时间：{String(loginUser?.createTime ?? "").slice(0, 10) || "—"}</div>
        </div>
        <div style={{ marginTop: 20 }}>
          <Button danger onClick={onLogout}>
            退出登录
          </Button>
        </div>
      </Panel>
    </div>
  );
}
