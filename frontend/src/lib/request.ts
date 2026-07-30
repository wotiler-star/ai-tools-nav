import { API_BASE, USE_MOCK } from "@/config/site";

/**
 * 轻量请求封装（替代 axios）。
 * - USE_MOCK=true：请求走同源 Next.js Route Handlers（/api/...），返回 mock 数据
 * - USE_MOCK=false：直连 Spring Boot 后端 API_BASE
 *
 * 返回结构与后端 BaseResponse 一致：{ code, data, message }
 */

export interface RequestOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  params?: Record<string, any>;
  body?: any;
  headers?: Record<string, string>;
}

function buildQuery(params?: Record<string, any>): string {
  if (!params) return "";
  const usp = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") usp.append(k, String(v));
  });
  const s = usp.toString();
  return s ? `?${s}` : "";
}

export async function request<T>(
  path: string,
  options: RequestOptions = {}
): Promise<T> {
  const { method = "GET", params, body, headers } = options;

  // Mock 模式：转发到同源 /api 路由
  if (USE_MOCK) {
    const base = path.startsWith("/api") ? path : `/api${path}`;
    const rel = base.replace(/\/api\/(api\/)?/, "/api/");
    const finalPath = rel.startsWith("/api") ? rel : `/api${rel}`;
    const res = await fetch(`${finalPath}${buildQuery(params)}`, {
      method,
      headers: { "Content-Type": "application/json", ...headers },
      body: body ? JSON.stringify(body) : undefined
    });
    if (!res.ok) throw new Error(`Mock 请求失败: ${res.status}`);
    return res.json();
  }

  // 真实后端
  const url = `${API_BASE}${path}${buildQuery(params)}`;
  const res = await fetch(url, {
    method,
    credentials: "include", // Sa-Token SESSION Cookie
    headers: { "Content-Type": "application/json", ...headers },
    body: body ? JSON.stringify(body) : undefined
  });
  if (!res.ok) throw new Error(`请求失败: ${res.status}`);
  const json = await res.json();
  if (json.code !== 0) throw new Error(json.message || "业务错误");
  return json;
}
