"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { X, Github, MessageCircle, Loader2, Mail, Lock, User as UserIcon, Phone } from "lucide-react";
import { useAuthModal } from "@/components/AuthModalContext";

const githubEnabled = process.env.NEXT_PUBLIC_GITHUB_LOGIN === "true";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function AuthModal() {
  const { isOpen, tab, setTab, close } = useAuthModal();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [confirm, setConfirm] = useState("");
  const [agree, setAgree] = useState(false);
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  // 打开时锁定背景滚动 + Esc 关闭
  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [isOpen, close]);

  // 切换 Tab 时清空提示
  useEffect(() => setMsg(null), [tab, isOpen]);

  const switchTab = useCallback(
    (t: "login" | "register") => {
      setMsg(null);
      setTab(t);
    },
    [setTab]
  );

  async function doLogin() {
    setMsg(null);
    if (!EMAIL_RE.test(email)) return setMsg("请输入有效的邮箱地址");
    if (!password) return setMsg("请输入密码");
    setLoading(true);
    const res = await signIn("credentials", { email, password, redirect: false });
    setLoading(false);
    if (res?.error) return setMsg("邮箱或密码错误");
    close();
    router.refresh();
  }

  async function doRegister() {
    setMsg(null);
    if (!name.trim()) return setMsg("请填写昵称");
    if (!EMAIL_RE.test(email)) return setMsg("请输入有效的邮箱地址");
    if (password.length < 6) return setMsg("密码至少 6 位");
    if (password !== confirm) return setMsg("两次输入的密码不一致");
    if (!agree) return setMsg("请先阅读并同意用户协议与隐私政策");
    setLoading(true);
    const r = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: name.trim(), email, password }),
    });
    const data = await r.json().catch(() => ({}));
    setLoading(false);
    if (!r.ok) return setMsg(data.message || "注册失败，请稍后再试");
    // 注册成功后自动登录
    const res = await signIn("credentials", { email, password, redirect: false });
    if (res?.error) return setMsg("注册成功，但自动登录失败，请手动登录");
    close();
    router.refresh();
  }

  function socialGitHub() {
    if (!githubEnabled) return setMsg("GitHub 登录暂未开放，请使用邮箱或稍后配置");
    signIn("github", { callbackUrl: "/" });
  }
  function notOpen(method: string) {
    setMsg(`${method}暂未开放，请先使用邮箱或 GitHub 登录`);
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={close} />
      <div
        className="relative w-full max-w-md card rounded-2xl p-6 sm:p-8 max-h-[92vh] overflow-y-auto"
        style={{ background: "var(--bg-elevated)", borderColor: "var(--border)" }}
      >
        <button
          onClick={close}
          aria-label="关闭"
          className="absolute right-4 top-4 w-8 h-8 grid place-items-center rounded-full hover:bg-[var(--bg-subtle)] text-[var(--text-muted)]"
        >
          <X size={18} />
        </button>

        <h2 className="text-xl font-bold mb-1">欢迎来到 AI 导航</h2>
        <p className="text-sm mb-5" style={{ color: "var(--text-muted)" }}>
          登录后可发帖、评论、点赞与收藏，管理员可进入后台。
        </p>

        {/* Tab 切换 */}
        <div className="flex p-1 rounded-xl mb-5" style={{ background: "var(--bg-subtle)" }}>
          {(["login", "register"] as const).map((t) => (
            <button
              key={t}
              onClick={() => switchTab(t)}
              className="flex-1 h-9 rounded-lg text-sm font-semibold transition-colors"
              style={
                tab === t
                  ? { background: "var(--bg-elevated)", color: "var(--primary)", boxShadow: "0 1px 2px rgba(0,0,0,.08)" }
                  : { color: "var(--text-muted)" }
              }
            >
              {t === "login" ? "登录" : "注册"}
            </button>
          ))}
        </div>

        {msg && (
          <div
            className="mb-4 px-3 py-2 rounded-lg text-sm"
            style={{ background: "color-mix(in srgb, var(--accent) 12%, transparent)", color: "var(--accent)" }}
          >
            {msg}
          </div>
        )}

        {tab === "login" ? (
          <div className="flex flex-col gap-3">
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="邮箱"
                className="h-11 w-full pl-9 pr-3 rounded-lg border outline-none text-sm"
                style={{ borderColor: "var(--border)", background: "var(--bg)" }}
              />
            </div>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="密码"
                className="h-11 w-full pl-9 pr-3 rounded-lg border outline-none text-sm"
                style={{ borderColor: "var(--border)", background: "var(--bg)" }}
                onKeyDown={(e) => e.key === "Enter" && doLogin()}
              />
            </div>
            <button onClick={doLogin} disabled={loading} className="btn-primary h-11 flex items-center justify-center gap-2">
              {loading && <Loader2 size={16} className="animate-spin" />}
              登录
            </button>

            {/* 其他登录方式 */}
            <div className="flex items-center gap-3 my-1" style={{ color: "var(--text-muted)" }}>
              <span className="h-px flex-1" style={{ background: "var(--border)" }} />
              <span className="text-xs">其他登录方式</span>
              <span className="h-px flex-1" style={{ background: "var(--border)" }} />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={socialGitHub}
                className="h-11 rounded-lg border flex items-center justify-center gap-1.5 text-sm font-medium hover:bg-[var(--bg-subtle)]"
                style={{ borderColor: "var(--border)" }}
                title="GitHub"
              >
                <Github size={16} /> GitHub
              </button>
              <button
                onClick={() => notOpen("微信登录")}
                className="h-11 rounded-lg border flex items-center justify-center gap-1.5 text-sm font-medium hover:bg-[var(--bg-subtle)]"
                style={{ borderColor: "var(--border)" }}
                title="微信（暂未开放）"
              >
                <MessageCircle size={16} className="text-green-600" /> 微信
              </button>
              <button
                onClick={() => notOpen("Gitee 登录")}
                className="h-11 rounded-lg border flex items-center justify-center gap-1.5 text-sm font-medium hover:bg-[var(--bg-subtle)]"
                style={{ borderColor: "var(--border)" }}
                title="Gitee（暂未开放）"
              >
                <svg width="16" height="16" viewBox="0 0 1024 1024" fill="currentColor" className="text-orange-500">
                  <path d="M512 1024C229.2 1024 0 794.8 0 512S229.2 0 512 0s512 229.2 512 512-229.2 512-512 512z m0-874.7c-200 0-362.7 162.7-362.7 362.7S312 824.7 512 824.7 874.7 662 874.7 462 712 149.3 512 149.3z m-114.4 548.6c-19 0-34.4-15.4-34.4-34.4s15.4-34.4 34.4-34.4 34.4 15.4 34.4 34.4-15.4 34.4-34.4 34.4zm228.8 0c-19 0-34.4-15.4-34.4-34.4s15.4-34.4 34.4-34.4 34.4 15.4 34.4 34.4-15.4 34.4-34.4 34.4z" />
                </svg>
                Gitee
              </button>
            </div>

            {/* 手机号登录（占位） */}
            <div className="flex gap-2 mt-1">
              <div className="relative flex-1">
                <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="手机号（即将开放）"
                  className="h-11 w-full pl-9 pr-3 rounded-lg border outline-none text-sm"
                  style={{ borderColor: "var(--border)", background: "var(--bg)" }}
                />
              </div>
              <button
                onClick={() => notOpen("手机号验证码登录")}
                className="h-11 px-3 rounded-lg border text-sm font-medium whitespace-nowrap hover:bg-[var(--bg-subtle)]"
                style={{ borderColor: "var(--border)" }}
              >
                获取验证码
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <div className="relative">
              <UserIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="昵称"
                className="h-11 w-full pl-9 pr-3 rounded-lg border outline-none text-sm"
                style={{ borderColor: "var(--border)", background: "var(--bg)" }}
              />
            </div>
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="邮箱"
                className="h-11 w-full pl-9 pr-3 rounded-lg border outline-none text-sm"
                style={{ borderColor: "var(--border)", background: "var(--bg)" }}
              />
            </div>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="密码（至少 6 位）"
                className="h-11 w-full pl-9 pr-3 rounded-lg border outline-none text-sm"
                style={{ borderColor: "var(--border)", background: "var(--bg)" }}
              />
            </div>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
              <input
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="确认密码"
                className="h-11 w-full pl-9 pr-3 rounded-lg border outline-none text-sm"
                style={{ borderColor: "var(--border)", background: "var(--bg)" }}
                onKeyDown={(e) => e.key === "Enter" && doRegister()}
              />
            </div>

            <label className="flex items-start gap-2 text-xs mt-1 cursor-pointer" style={{ color: "var(--text-muted)" }}>
              <input
                type="checkbox"
                checked={agree}
                onChange={(e) => setAgree(e.target.checked)}
                className="mt-0.5 accent-[var(--primary)]"
              />
              <span>
                我已阅读并同意
                <a href="/about" className="text-[var(--primary)] hover:underline" onClick={close}>
                  《用户协议》
                </a>
                与
                <a href="/about" className="text-[var(--primary)] hover:underline" onClick={close}>
                  《隐私政策》
                </a>
              </span>
            </label>

            <button onClick={doRegister} disabled={loading} className="btn-primary h-11 flex items-center justify-center gap-2">
              {loading && <Loader2 size={16} className="animate-spin" />}
              注册并登录
            </button>
          </div>
        )}

        <p className="text-xs mt-5 text-center" style={{ color: "var(--text-muted)" }}>
          登录即表示同意
          <a href="/about" className="text-[var(--primary)]" onClick={close}>
            《用户协议》《隐私政策》
          </a>
        </p>
      </div>
    </div>
  );
}
