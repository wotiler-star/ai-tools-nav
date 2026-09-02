"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { App, Button, Input, Spin } from "antd";
import { CopyOutlined, DeleteOutlined } from "@ant-design/icons";
import useSWR from "swr";
import { api } from "@/lib/api";
import { useAppStore } from "@/store/useAppStore";
import {
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
  const { data, isLoading } = useSWR<BaseResponsePage<AiPost>>(
    "/user/mypost?current=1&pageSize=50"
  );
  const posts = data?.data?.records ?? [];

  return (
    <Panel title="我的帖子" desc="你发布过的社区帖子">
      {isLoading ? (
        <Loading />
      ) : posts.length === 0 ? (
        <EmptyBox text="还没有发布过帖子" />
      ) : (
        <div>
          {posts.map((p) => (
            <Link
              key={p.id}
              href={`/essay/${p.id}`}
              style={{
                display: "block",
                padding: "14px 12px",
                borderRadius: 10,
                borderBottom: "1px solid var(--border)",
                textDecoration: "none"
              }}
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
          ))}
        </div>
      )}
    </Panel>
  );
}

/* ==================== 3. 我的提示词 ==================== */

export function MyPromptsTab() {
  const { message } = App.useApp();
  const { data, isLoading } = useSWR<BaseResponsePage<AiPrompt>>(
    "/user/myprompt?current=1&pageSize=50"
  );
  const prompts = data?.data?.records ?? [];

  const onCopy = async (p: AiPrompt) => {
    try {
      await navigator.clipboard.writeText(p.content || "");
      message.success(`已复制「${p.title}」`);
    } catch {
      message.info(p.content || "");
    }
  };

  return (
    <Panel title="我的提示词" desc="你发布过的 AI 提示词模板">
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
              <Button size="small" icon={<CopyOutlined />} onClick={() => onCopy(p)}>
                复制
              </Button>
            </div>
          ))}
        </div>
      )}
    </Panel>
  );
}

/* ==================== 4. 我的收藏 ==================== */

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
                  alt=""
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

/* ==================== 5. 会员中心 ==================== */

export function MemberTab() {
  const { message } = App.useApp();
  const { data, isLoading } = useSWR<BaseResponse<MemberVO>>("/user/member");
  const m = data?.data;

  if (isLoading) return <Panel title="会员中心"><Loading /></Panel>;

  return (
    <Panel title="会员中心" desc="查看你的成长等级与会员权益">
      {/* 会员卡片 */}
      <div
        style={{
          borderRadius: 14,
          padding: 22,
          background: m?.isVip
            ? "linear-gradient(135deg,#ffd76a,#ffb020)"
            : "linear-gradient(135deg,#e3ecff,#ece9ff)",
          color: m?.isVip ? "#7a4a00" : "#1f2937",
          marginBottom: 20
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
          <span style={{ fontSize: 20 }}>{m?.isVip ? "👑" : "🎖️"}</span>
          <span style={{ fontSize: 18, fontWeight: 700 }}>
            {m?.vipTypeName ?? "普通用户"}
          </span>
          {m?.isVip && m?.vipExpireTime && (
            <span style={{ fontSize: 13, opacity: 0.85 }}>
              · 到期 {String(m.vipExpireTime).slice(0, 10)}
            </span>
          )}
        </div>
        <div style={{ display: "flex", gap: 28, flexWrap: "wrap" }}>
          <div>
            <div style={{ fontSize: 12, opacity: 0.75, marginBottom: 2 }}>成长等级</div>
            <div style={{ fontSize: 22, fontWeight: 700 }}>Lv{m?.level ?? 1}</div>
          </div>
          <div>
            <div style={{ fontSize: 12, opacity: 0.75, marginBottom: 2 }}>我的积分</div>
            <div style={{ fontSize: 22, fontWeight: 700 }}>{m?.points ?? 0}</div>
          </div>
        </div>
      </div>

      {/* 权益列表 */}
      <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text-1)", marginBottom: 10 }}>
        当前权益
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 20 }}>
        {(m?.benefits ?? []).map((b) => (
          <span
            key={b}
            style={{
              fontSize: 13,
              padding: "6px 12px",
              borderRadius: 20,
              background: "var(--surface-2)",
              color: "var(--text-2)"
            }}
          >
            ✓ {b}
          </span>
        ))}
      </div>

      <Button
        type="primary"
        onClick={() => message.info("演示站点暂未接入支付，会员功能仅作展示")}
      >
        {m?.isVip ? "续费会员" : "开通会员"}
      </Button>
    </Panel>
  );
}

/* ==================== 6. 账号设置 ==================== */

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
