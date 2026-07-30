import { request } from "@/lib/request";
import {
  AiPost,
  AiPrompt,
  AiTool,
  BaseResponse,
  BaseResponsePage,
  Category,
  UserVO
} from "@/types";

/**
 * API 路径与 SWR fetcher。
 * 真实后端路径对齐 api.codefather.cn：
 *   /ai_tool/list/page、/ai_tool/get、/category/list
 *   /ai_post/list/page、/ai_prompt/list/page
 * 真实模式直连后端；Mock 模式由 src/app/api/* 路由返回内置数据。
 */

export const api = {
  listTools: (params: {
    categoryId?: number;
    keyword?: string;
    current?: number;
    pageSize?: number;
  }) =>
    request<BaseResponsePage<AiTool>>("/ai_tool/list/page", {
      params: { current: 1, pageSize: 60, ...params }
    }),

  getTool: (id: number | string) =>
    request<BaseResponse<AiTool>>("/ai_tool/get", { params: { id } }),

  listCategories: () => request<BaseResponse<Category[]>>("/category/list"),

  listPosts: (params: { current?: number; pageSize?: number; keyword?: string }) =>
    request<BaseResponsePage<AiPost>>("/ai_post/list/page", {
      params: { current: 1, pageSize: 12, ...params }
    }),

  listPrompts: (params: { current?: number; pageSize?: number }) =>
    request<BaseResponsePage<AiPrompt>>("/ai_prompt/list/page", {
      params: { current: 1, pageSize: 20, ...params }
    }),

  // ===== 用户鉴权（Sa-Token SESSION，无第三方 OAuth）=====
  login: (userAccount: string, userPassword: string) =>
    request<BaseResponse<UserVO>>("/user/login", {
      method: "POST",
      body: { userAccount, userPassword }
    }),

  register: (userAccount: string, userPassword: string, checkPassword: string) =>
    request<BaseResponse<number>>("/user/register", {
      method: "POST",
      body: { userAccount, userPassword, checkPassword }
    }),

  getLoginUser: () => request<BaseResponse<UserVO>>("/user/get/login"),

  logout: () => request<BaseResponse<boolean>>("/user/logout", { method: "POST" }),

  // ===== 后台管理（对齐后端 AdminController /admin/**，@SaCheckRole("admin")）=====
  admin: {
    addTool: (tool: Partial<AiTool>) =>
      request<BaseResponse<number>>("/admin/tool/add", {
        method: "POST",
        body: tool
      }),
    updateTool: (tool: Partial<AiTool>) =>
      request<BaseResponse<boolean>>("/admin/tool/update", {
        method: "PUT",
        body: tool
      }),
    deleteTool: (id: number) =>
      request<BaseResponse<boolean>>(`/admin/tool/${id}`, { method: "DELETE" }),

    addCategory: (category: Partial<Category>) =>
      request<BaseResponse<number>>("/admin/category/add", {
        method: "POST",
        body: category
      }),
    updateCategory: (category: Partial<Category>) =>
      request<BaseResponse<boolean>>("/admin/category/update", {
        method: "PUT",
        body: category
      }),
    deleteCategory: (id: number) =>
      request<BaseResponse<boolean>>(`/admin/category/${id}`, {
        method: "DELETE"
      })
  }
};

/** SWR fetcher（直接透传 request 结果） */
export const swrFetcher = <T>(path: string, params?: Record<string, any>) =>
  request<T>(path, { params });
