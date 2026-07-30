"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import dynamic from "next/dynamic";
import Link from "next/link";
// 抽屉仅在移动端点汉堡后弹出，动态导入将其拆出首屏 JS（antd Drawer 体积较大）
const Drawer = dynamic(() => import("antd").then((m) => m.Drawer), {
  ssr: false
});
import SearchBox from "@/components/SearchBox";
import {
  UserOutlined,
  LogoutOutlined,
  SettingOutlined,
  GithubOutlined,
  MoonOutlined,
  BulbOutlined,
  MenuOutlined
} from "@ant-design/icons";
import { useAppStore } from "@/store/useAppStore";
import { api } from "@/lib/api";
import { useTheme } from "@/app/provider";
import { useMediaQuery } from "@/hooks/useMediaQuery";

/** 顶部主导航：与 ai.codefather.cn 实测顺序完全一致 */
const NAV: { label: string; href: string; external?: boolean }[] = [
  { label: "主页", href: "/" },
  { label: "社区", href: "/essay" },
  { label: "AI工具", href: "/tool" },
  { label: "AI知识库", href: "/library" },
  { label: "AI提示词", href: "/painting" },
  { label: "MCP", href: "/mcp" },
  { label: "Skills", href: "/skills" },
  { label: "AI学习资源", href: "/resource/learn" },
  { label: "AI资讯", href: "/news" },
  {
    label: "GitHub开源",
    href: "https://github.com/liyupi/ai-guide",
    external: true
  }
];

export default function Header() {
  const pathname = usePathname();
  const { loginUser, setLoginUser, openLoginModal } = useAppStore();
  const { theme, toggle } = useTheme();
  const isMobile = useMediaQuery("(max-width: 767px)");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // 用户菜单点击外部关闭
  useEffect(() => {
    function onDocMouseDown(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", onDocMouseDown);
    return () => document.removeEventListener("mousedown", onDocMouseDown);
  }, []);

  // 挂载时尝试恢复登录态（读取 satoken 会话）
  useEffect(() => {
    api
      .getLoginUser()
      .then((res) => {
        if (res.code === 0 && res.data) setLoginUser(res.data);
      })
      .catch(() => {});
  }, [setLoginUser]);

  const onLogout = async () => {
    try {
      await api.logout();
    } catch {}
    setLoginUser(null);
    setToast("已退出登录");
    window.setTimeout(() => setToast(null), 2000);
  };

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  // 原生头像（替代 antd Avatar，去掉 antd 依赖）
  const userAvatar = (size = 32, bg = "#3874F7", iconColor = "#fff") =>
    loginUser?.userAvatar ? (
      <img
        src={loginUser.userAvatar}
        alt=""
        style={{ width: size, height: size, borderRadius: "50%", objectFit: "cover" }}
      />
    ) : (
      <span
        style={{
          width: size,
          height: size,
          borderRadius: "50%",
          background: bg,
          color: iconColor,
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: size * 0.5
        }}
      >
        <UserOutlined />
      </span>
    );

  // 右侧：主题切换 + 登录/用户（桌面与移动共用，纯原生实现，无 antd）
  const rightCluster = (
    <>
      <button
        type="button"
        className="icon-btn"
        aria-label="切换明暗主题"
        onClick={toggle}
        style={{ flexShrink: 0 }}
      >
        {theme === "dark" ? <BulbOutlined /> : <MoonOutlined />}
      </button>
      {loginUser ? (
        <div ref={menuRef} style={{ position: "relative" }}>
          <div
            onClick={() => setMenuOpen((v) => !v)}
            style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", flexShrink: 0 }}
          >
            {userAvatar(32)}
            <span style={{ fontSize: 14, whiteSpace: "nowrap" }}>{loginUser.userName}</span>
          </div>
          {menuOpen && (
            <div
              style={{
                position: "absolute",
                top: "calc(100% + 8px)",
                right: 0,
                minWidth: 168,
                background: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: 10,
                boxShadow: "0 12px 32px rgba(0,0,0,0.12)",
                padding: 6,
                zIndex: 200
              }}
            >
              {loginUser.userRole === "admin" && (
                <Link
                  href="/admin"
                  onClick={() => setMenuOpen(false)}
                  style={{ display: "flex", alignItems: "center", gap: 8, padding: "9px 12px", borderRadius: 8, fontSize: 14, color: "var(--text-1)" }}
                >
                  <SettingOutlined /> 后台管理
                </Link>
              )}
              <div
                onClick={() => {
                  setMenuOpen(false);
                  onLogout();
                }}
                style={{ display: "flex", alignItems: "center", gap: 8, padding: "9px 12px", borderRadius: 8, fontSize: 14, color: "var(--text-1)", cursor: "pointer" }}
              >
                <LogoutOutlined /> 退出登录
              </div>
            </div>
          )}
        </div>
      ) : (
        <div
          onClick={openLoginModal}
          style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", flexShrink: 0 }}
        >
          {userAvatar(32, "var(--surface-2)", "var(--text-3)")}
          <span style={{ fontSize: 14, color: "#1f2329", whiteSpace: "nowrap" }}>登录/注册</span>
        </div>
      )}
    </>
  );

  const logo = (
    <Link
      href="/"
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        flexShrink: 0
      }}
    >
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: 32,
          height: 32,
          borderRadius: 8,
          background: "linear-gradient(135deg,#3874F7,#69b1ff)",
          color: "#fff",
          fontWeight: 800,
          fontSize: 16
        }}
      >
        鱼
      </span>
      <span style={{ fontSize: 18, fontWeight: 700, whiteSpace: "nowrap" }}>
        鱼皮AI导航
      </span>
    </Link>
  );

  const drawerNav = (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      {NAV.map((n) =>
        n.external ? (
          <a
            key={n.href}
            href={n.href}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setDrawerOpen(false)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "12px 10px",
              borderRadius: 8,
              fontSize: 15,
              color: "#4e5969",
              fontWeight: 500
            }}
          >
            <GithubOutlined />
            {n.label}
          </a>
        ) : (
          <Link
            key={n.href}
            href={n.href}
            onClick={() => setDrawerOpen(false)}
            style={{
              padding: "12px 10px",
              borderRadius: 8,
              fontSize: 15,
              color: isActive(n.href) ? "#3874F7" : "#1f2329",
              fontWeight: isActive(n.href) ? 700 : 500,
              background: isActive(n.href) ? "#eaf1fe" : "transparent"
            }}
          >
            {n.label}
          </Link>
        )
      )}
    </div>
  );

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        background: "#fff",
        borderBottom: "1px solid #eaecef"
      }}
    >
      {isMobile ? (
        /* 移动端：两行 —— 上行 Logo + 汉堡 + 右侧操作；下行全宽搜索 */
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 12,
              height: 56,
              padding: "0 14px"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <button
                type="button"
                className="icon-btn"
                aria-label="打开导航菜单"
                onClick={() => setDrawerOpen(true)}
                style={{ flexShrink: 0 }}
              >
                <MenuOutlined />
              </button>
              {logo}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              {rightCluster}
            </div>
          </div>
          <div style={{ padding: "0 12px 10px" }}>
            <SearchBox />
          </div>
        </div>
      ) : (
        /* 桌面端：单行 Logo + 导航 + 搜索 + 右侧操作 */
        <div
          style={{
            maxWidth: 1400,
            margin: "0 auto",
            height: 64,
            padding: "0 24px",
            display: "flex",
            alignItems: "center",
            gap: 20
          }}
        >
          {logo}

          <nav
            style={{
              display: "flex",
              alignItems: "center",
              gap: 4,
              flexShrink: 0
            }}
          >
            {NAV.map((n) =>
              n.external ? (
                <a
                  key={n.href}
                  href={n.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 4,
                    fontSize: 14,
                    color: "#4e5969",
                    fontWeight: 500,
                    padding: "6px 10px",
                    borderRadius: 8,
                    whiteSpace: "nowrap"
                  }}
                >
                  <GithubOutlined />
                  {n.label}
                </a>
              ) : (
                <Link
                  key={n.href}
                  href={n.href}
                  style={{
                    fontSize: 14,
                    color: isActive(n.href) ? "#3874F7" : "#4e5969",
                    fontWeight: isActive(n.href) ? 700 : 500,
                    padding: "6px 10px",
                    borderRadius: 8,
                    background: isActive(n.href) ? "#eaf1fe" : "transparent",
                    whiteSpace: "nowrap"
                  }}
                >
                  {n.label}
                </Link>
              )
            )}
          </nav>

          <div style={{ flex: 1, display: "flex", justifyContent: "flex-end" }}>
            <SearchBox />
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {rightCluster}
          </div>
        </div>
      )}

      <Drawer
        title="导航"
        placement="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        width={280}
        styles={{ body: { padding: 12 } }}
      >
        {drawerNav}
      </Drawer>

      {toast && (
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
          {toast}
        </div>
      )}
    </header>
  );
}
