"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, Menu, Sun, Moon, PlusCircle, Github, Headphones } from "lucide-react";
import AuthButton from "@/components/AuthButton";
import { categories } from "@/lib/mock-data";

// 对齐截图：主页 | 社区 | AI工具 | AI知识库 | AI提示词 | MCP | Skills | AI学习资源 | AI资讯
const NAV = [
  { label: "主页", href: "/" },
  { label: "社区", href: "/community" },
  { label: "AI工具", href: "/category", children: categories },
  { label: "AI知识库", href: "/#learn" },
  { label: "AI提示词", href: "/#prompts" },
  { label: "MCP", href: "/mcp" },
  { label: "Skills", href: "/skills" },
  { label: "AI学习资源", href: "/#learn" },
  { label: "AI资讯", href: "/news" },
];

export default function Navbar() {
  const [dark, setDark] = useState(false);
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");

  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
  }, []);

  function toggleTheme() {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  }

  return (
    <header
      className="fixed top-0 inset-x-0 z-50 h-16 border-b backdrop-blur-md"
      style={{
        background: "color-mix(in srgb, var(--bg-elevated) 80%, transparent)",
        borderColor: "var(--border)",
      }}
    >
      <nav className="mx-auto max-w-7xl h-full px-4 flex items-center gap-3">
        {/* Logo — 对齐截图：图标 + 「鱼皮AI导航」风格 */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <span className="text-xl">🐱</span>
          <span className="font-bold text-lg hidden sm:block">AI导航</span>
        </Link>

        {/* 桌面菜单 — 与截图完全一致的 9 项 */}
        <ul className="hidden lg:flex items-center gap-0.5 h-full">
          {NAV.map((item) => (
            <li key={item.label} className="h-full flex items-center group relative">
              <Link
                href={item.href}
                className="px-3 py-2 rounded-lg text-sm font-medium hover:bg-[var(--bg-subtle)] transition-colors inline-flex items-center gap-1"
              >
                {item.label}
                {item.children ? <span className="text-[10px] opacity-60">▼</span> : null}
              </Link>
              {item.children && (
                <div className="absolute left-0 top-full hidden group-hover:block pt-1 z-50">
                  <div
                    className="grid grid-cols-2 gap-1 p-3 rounded-xl border shadow-lg w-[460px]"
                    style={{ background: "var(--bg-elevated)", borderColor: "var(--border)" }}
                  >
                    {item.children.map((c) => (
                      <Link
                        key={c.slug}
                        href={`/category/${c.slug}`}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-[var(--bg-subtle)] text-sm"
                      >
                        <span className="text-lg">{c.icon}</span>
                        <span className="truncate">{c.name}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>

        {/* 右侧区 — 对齐截图：GitHub开源 + 功能按钮 */}
        <div className="ml-auto flex items-center gap-2">
          {/* GitHub 开源 — 截图右侧主入口 */}
          <a
            href="#"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-sm font-medium hover:bg-[var(--bg-subtle)] transition-colors"
            style={{ borderColor: "var(--border)" }}
          >
            <Headphones size={15} />
            <span>GitHub 开源</span>
          </a>

          {/* 搜索 */}
          <form
            action="/search"
            method="get"
            className="hidden md:flex items-center gap-2 px-3 h-9 rounded-full border"
            style={{ borderColor: "var(--border)", background: "var(--bg-elevated)" }}
          >
            <Search size={16} className="text-[var(--text-muted)]" />
            <input
              name="q"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="搜索…"
              className="bg-transparent outline-none text-sm w-36"
            />
          </form>

          {/* 主题切换 */}
          <button
            onClick={toggleTheme}
            aria-label="切换主题"
            className="w-9 h-9 grid place-items-center rounded-full hover:bg-[var(--bg-subtle)]"
          >
            {dark ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* 提交工具 */}
          <Link href="/submit" className="btn-primary hidden sm:flex items-center gap-1 text-sm">
            <PlusCircle size={16} /> 提交
          </Link>

          {/* 登录 / 用户 */}
          <AuthButton />

          {/* 移动端汉堡菜单 */}
          <button
            onClick={() => setOpen(true)}
            className="lg:hidden w-9 h-9 grid place-items-center rounded-full hover:bg-[var(--bg-subtle)]"
            aria-label="打开菜单"
          >
            <Menu size={20} />
          </button>
        </div>
      </nav>

      {/* 移动端抽屉 — 包含全部 9 个菜单项 */}
      {open && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setOpen(false)}
          />
          <div
            className="absolute right-0 top-0 h-full w-72 max-w-[80%] card rounded-none p-5 overflow-y-auto"
            style={{ background: "var(--bg-elevated)" }}
          >
            <div className="flex justify-between items-center mb-5">
              <span className="font-bold text-lg">菜单</span>
              <button onClick={() => setOpen(false)} className="text-xl leading-none">
                ✕
              </button>
            </div>
            {/* GitHub 开源 */}
            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 py-2.5 rounded-lg border mb-3 text-sm font-medium"
              style={{ borderColor: "var(--border)" }}
            >
              <Headphones size={16} />
              GitHub 开源
            </a>
            {/* 搜索 */}
            <form action="/search" method="get" className="flex items-center gap-2 px-3 h-10 mb-3 rounded-full border" style={{ borderColor: "var(--border)" }}>
              <Search size={16} className="text-[var(--text-muted)]" />
              <input name="q" placeholder="搜索…" className="bg-transparent outline-none text-sm w-full" />
            </form>
            {/* 全部菜单项 */}
            <ul className="space-y-0.5">
            {NAV.map((item) => (
              <li key={item.label}>
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="block px-3 py-2.5 rounded-lg hover:bg-[var(--bg-subtle)] font-medium text-sm"
                >
                  {item.label}
                </Link>
                {item.children && (
                  <ul className="ml-3 border-l pl-2" style={{ borderColor: "var(--border)" }}>
                    {item.children.map((c) => (
                      <li key={c.slug}>
                        <Link
                          href={`/category/${c.slug}`}
                          onClick={() => setOpen(false)}
                          className="block px-3 py-2 rounded-lg hover:bg-[var(--bg-subtle)] text-sm"
                        >
                          {c.icon} {c.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
            </ul>
            <hr className="my-3" style={{ borderColor: "var(--border)" }} />
            <Link href="/submit" onClick={() => setOpen(false)} className="btn-primary block text-center text-sm mb-2">
              提交工具
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
