"use client";

import { useState } from "react";
import type { CSSProperties, MouseEvent } from "react";
import useSWR from "swr";
import { HeartOutlined, HeartFilled } from "@ant-design/icons";
import { App } from "antd";
import { useAppStore } from "@/store/useAppStore";
import { api, swrFetcher } from "@/lib/api";
import { BaseResponse, UserFavorite } from "@/types";

interface FavoriteButtonProps {
  /** 收藏目标类型，与后端 UserFavorite.targetType 对齐 */
  targetType: "tool" | "prompt" | "post";
  targetId: number;
  className?: string;
  style?: CSSProperties;
  /** 图标字号，默认 14 */
  size?: number;
}

/**
 * 真实后端收藏按钮（替换原 localStorage 假收藏）。
 *
 * - 已登录：调 /user/favorite/add 或 /user/favorite/delete；收藏态由
 *   /user/favorite/list 派生。多个按钮共用同一 SWR key，缓存共享——
 *   任一按钮操作后会 revalidate，所有按钮同步刷新。
 * - 未登录：点击直接弹出登录框，不发起请求。
 * - 提示：必须在 antd <App> 上下文内使用（message 来自 App.useApp()）。
 */
export default function FavoriteButton({
  targetType,
  targetId,
  className,
  style,
  size = 14
}: FavoriteButtonProps) {
  const loginUser = useAppStore((s) => s.loginUser);
  const openLoginModal = useAppStore((s) => s.openLoginModal);
  const { message } = App.useApp();

  const { data, mutate } = useSWR<BaseResponse<UserFavorite[]>>(
    loginUser ? "/user/favorite/list" : null,
    swrFetcher,
    { revalidateOnFocus: false }
  );

  const faved = !!data?.data?.some(
    (f) => f.targetType === targetType && f.targetId === targetId
  );
  // 乐观更新：操作期间先用本地态，revalidate 后再回落到服务端数据
  const [optimistic, setOptimistic] = useState<boolean | null>(null);
  const isFaved = optimistic ?? faved;
  const [busy, setBusy] = useState(false);

  const onToggle = async (e: MouseEvent) => {
    e.stopPropagation();
    if (!loginUser) {
      openLoginModal();
      return;
    }
    if (busy) return;
    const next = !isFaved;
    setOptimistic(next);
    setBusy(true);
    try {
      if (next) {
        await api.addFavorite(targetType, targetId);
      } else {
        await api.removeFavorite(targetType, targetId);
      }
      message.success(next ? "已收藏" : "已取消收藏");
      await mutate();
    } catch (err: any) {
      message.error(err?.message || "操作失败，请稍后重试");
      await mutate();
    } finally {
      setOptimistic(null);
      setBusy(false);
    }
  };

  return (
    <button
      type="button"
      className={className ?? "brand-btn-ghost"}
      style={style}
      disabled={busy}
      onClick={onToggle}
    >
      {isFaved ? (
        <HeartFilled style={{ color: "#ff4d4f", fontSize: size }} />
      ) : (
        <HeartOutlined style={{ fontSize: size }} />
      )}
      {isFaved ? "已收藏" : "收藏"}
    </button>
  );
}
