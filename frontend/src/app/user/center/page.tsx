"use client";

import { useEffect, useState } from "react";
import { App, Button, Spin } from "antd";
import {
  IdcardOutlined,
  FileTextOutlined,
  BulbOutlined,
  StarOutlined,
  CrownOutlined,
  SettingOutlined,
  UserOutlined
} from "@ant-design/icons";
import { useAppStore } from "@/store/useAppStore";
import { api } from "@/lib/api";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import {
  ProfileTab,
  MyPostsTab,
  MyPromptsTab,
  FavoritesTab,
  MemberTab,
  SettingsTab
} from "./tabs";

type TabKey =
  | "profile"
  | "posts"
  | "prompts"
  | "favorites"
  | "member"
  | "settings";

const MENU: { key: TabKey; label: string; icon: React.ReactNode }[] = [
  { key: "profile", label: "个人资料", icon: <IdcardOutlined /> },
  { key: "posts", label: "我的帖子", icon: <FileTextOutlined /> },
  { key: "prompts", label: "我的提示词", icon: <BulbOutlined /> },
  { key: "favorites", label: "我的收藏", icon: <StarOutlined /> },
  { key: "member", label: "会员中心", icon: <CrownOutlined /> },
  { key: "settings", label: "账号设置", icon: <SettingOutlined /> }
];

/** 会员类型文案（注意：page 文件只允许 default + metadata 导出，此函数不可 export） */
function vipLabel(vipType?: number) {
  return vipType === 3
    ? "永久会员"
    : vipType === 2
    ? "年度会员"
    : vipType === 1
    ? "月度会员"
    : "";
}

export default function UserCenterPage() {
  const { loginUser, setLoginUser, openLoginModal } = useAppStore();
  const [tab, setTab] = useState<TabKey>("profile");
  const [ready, setReady] = useState(false);
  const isMobile = useMediaQuery("(max-width: 900px)");

  // 主动确认登录态，避免首帧误判导致闪一下「未登录」
  useEffect(() => {
    let cancelled = false;
    api
      .getLoginUser()
      .then((res) => {
        if (!cancelled && res.code === 0 && res.data) setLoginUser(res.data);
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setReady(true);
      });
    return () => {
      cancelled = true;
    };
  }, [setLoginUser]);

  // 加载中
  if (!ready) {
    return (
      <main
        style={{
          minHeight: "60vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <Spin size="large" />
      </main>
    );
  }

  // 未登录：引导登录（不自动弹窗，避免打扰）
  if (!loginUser) {
    return (
      <main style={{ maxWidth: 900, margin: "0 auto", padding: "48px 24px" }}>
        <div
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: 14,
            padding: "56px 24px",
            textAlign: "center"
          }}
        >
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: "50%",
              background: "var(--surface-2)",
              color: "var(--text-3)",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 28,
              marginBottom: 18
            }}
          >
            <UserOutlined />
          </div>
          <div style={{ fontSize: 17, fontWeight: 600, marginBottom: 8 }}>
            登录后查看个人中心
          </div>
          <div style={{ fontSize: 14, color: "var(--text-3)", marginBottom: 22 }}>
            个人资料 · 我的内容 · 我的收藏 · 会员权益
          </div>
          <Button type="primary" size="large" onClick={openLoginModal}>
            立即登录 / 注册
          </Button>
        </div>
      </main>
    );
  }

  const avatar = loginUser.userAvatar ? (
    <img
      src={loginUser.userAvatar}
      alt=""
      style={{ width: 64, height: 64, borderRadius: "50%", objectFit: "cover" }}
    />
  ) : (
    <span
      style={{
        width: 64,
        height: 64,
        borderRadius: "50%",
        background: "linear-gradient(135deg,#3874F7,#69b1ff)",
        color: "#fff",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 28
      }}
    >
      <UserOutlined />
    </span>
  );

  const sidebar = (
    <aside
      style={{
        width: isMobile ? "100%" : 232,
        flexShrink: 0
      }}
    >
      {/* 用户卡片 */}
      <div
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: 14,
          padding: 20,
          textAlign: "center",
          marginBottom: 14
        }}
      >
        {avatar}
        <div
          style={{
            marginTop: 12,
            fontSize: 16,
            fontWeight: 600,
            color: "var(--text-1)"
          }}
        >
          {loginUser.userName}
        </div>
        <div style={{ marginTop: 6, display: "flex", gap: 6, justifyContent: "center", flexWrap: "wrap" }}>
          <span
            style={{
              fontSize: 12,
              padding: "2px 8px",
              borderRadius: 20,
              background: "var(--brand-tint)",
              color: "#3874F7",
              fontWeight: 600
            }}
          >
            Lv{loginUser.level ?? 1}
          </span>
          <span
            style={{
              fontSize: 12,
              padding: "2px 8px",
              borderRadius: 20,
              background: "var(--surface-2)",
              color: "var(--text-2)"
            }}
          >
            积分 {loginUser.points ?? 0}
          </span>
          {vipLabel(loginUser.vipType) && (
            <span
              style={{
                fontSize: 12,
                padding: "2px 8px",
                borderRadius: 20,
                background: "linear-gradient(135deg,#ffd76a,#ffb020)",
                color: "#7a4a00",
                fontWeight: 600
              }}
            >
              {vipLabel(loginUser.vipType)}
            </span>
          )}
        </div>
        {loginUser.userProfile ? (
          <div
            style={{
              marginTop: 10,
              fontSize: 12,
              color: "var(--text-3)",
              lineHeight: 1.6
            }}
          >
            {loginUser.userProfile}
          </div>
        ) : null}
      </div>

      {/* 菜单 */}
      <div
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: 14,
          padding: 8
        }}
      >
        {MENU.map((m) => {
          const active = tab === m.key;
          return (
            <button
              key={m.key}
              type="button"
              onClick={() => setTab(m.key)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                width: "100%",
                padding: "11px 12px",
                borderRadius: 10,
                border: "none",
                cursor: "pointer",
                fontSize: 14,
                fontWeight: active ? 600 : 500,
                color: active ? "#3874F7" : "var(--text-2)",
                background: active ? "var(--brand-tint)" : "transparent",
                textAlign: "left"
              }}
            >
              <span style={{ fontSize: 15 }}>{m.icon}</span>
              {m.label}
            </button>
          );
        })}
      </div>
    </aside>
  );

  return (
    <main style={{ background: "var(--page-bg)", minHeight: "100vh" }}>
      <div
        style={{
          maxWidth: 1400,
          margin: "0 auto",
          padding: "24px 24px 56px",
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          gap: 20,
          alignItems: "flex-start"
        }}
      >
        {sidebar}
        <section style={{ flex: 1, minWidth: 0 }}>
          {tab === "profile" && <ProfileTab />}
          {tab === "posts" && <MyPostsTab />}
          {tab === "prompts" && <MyPromptsTab />}
          {tab === "favorites" && <FavoritesTab />}
          {tab === "member" && <MemberTab />}
          {tab === "settings" && <SettingsTab />}
        </section>
      </div>
    </main>
  );
}
