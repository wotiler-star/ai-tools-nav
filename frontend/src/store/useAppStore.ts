import { create } from "zustand";

/**
 * 全局轻量状态：搜索关键字、当前激活分类、登录态、登录弹窗。
 * 与文档一致：Zustand 负责轻量 UI/客户端状态，SWR 负责服务端数据请求。
 */

/** 登录用户（对齐后端 UserVO，无第三方 OAuth 字段） */
export interface LoginUser {
  id: number;
  userName: string;
  userAvatar: string;
  userRole: string; // user / admin
}

interface AppState {
  keyword: string;
  activeCategoryId: number; // 0 表示全部
  // 登录态
  loginUser: LoginUser | null;
  loginModalOpen: boolean;
  // actions
  setKeyword: (v: string) => void;
  setActiveCategory: (id: number) => void;
  setLoginUser: (u: LoginUser | null) => void;
  openLoginModal: () => void;
  closeLoginModal: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  keyword: "",
  activeCategoryId: 0,
  loginUser: null,
  loginModalOpen: false,
  setKeyword: (v) => set({ keyword: v }),
  setActiveCategory: (id) => set({ activeCategoryId: id }),
  setLoginUser: (u) => set({ loginUser: u }),
  openLoginModal: () => set({ loginModalOpen: true }),
  closeLoginModal: () => set({ loginModalOpen: false })
}));
