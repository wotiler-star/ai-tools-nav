"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { User, LogOut, Shield } from "lucide-react";
import { useAuthModal } from "@/components/AuthModalContext";

export default function AuthButton() {
  const { data: session, status } = useSession();
  const { open } = useAuthModal();

  if (status === "loading") {
    return (
      <span className="w-9 h-9 grid place-items-center rounded-full">
        <User size={18} className="text-[var(--text-muted)]" />
      </span>
    );
  }

  if (!session?.user) {
    return (
      <button
        onClick={() => open("login")}
        className="w-9 h-9 grid place-items-center rounded-full hover:bg-[var(--bg-subtle)]"
        aria-label="登录"
        title="登录 / 注册"
      >
        <User size={18} />
      </button>
    );
  }

  const isAdmin = session.user.role === "admin";

  return (
    <div className="flex items-center gap-2">
      {isAdmin && (
        <Link
          href="/admin"
          className="hidden sm:flex items-center gap-1 text-sm px-3 h-9 rounded-full hover:bg-[var(--bg-subtle)]"
          title="后台管理"
        >
          <Shield size={16} /> 后台
        </Link>
      )}
      <Link
        href="/member"
        className="flex items-center gap-2 text-sm px-2 h-9 rounded-full hover:bg-[var(--bg-subtle)]"
        title={session.user.name ?? "会员中心"}
      >
        <span className="w-7 h-7 grid place-items-center rounded-full bg-[var(--primary-soft)] text-[var(--primary)]">
          {session.user.image || (session.user.name?.[0] ?? "🙂")}
        </span>
        <span className="hidden sm:block max-w-[80px] truncate font-medium">
          {session.user.name}
        </span>
      </Link>
      <button
        onClick={() => signOut({ callbackUrl: "/" })}
        className="w-9 h-9 grid place-items-center rounded-full hover:bg-[var(--bg-subtle)]"
        aria-label="退出登录"
        title="退出登录"
      >
        <LogOut size={16} />
      </button>
    </div>
  );
}
