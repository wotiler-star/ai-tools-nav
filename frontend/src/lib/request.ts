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
  /** 超时时间（毫秒），默认 15000 */
  timeout?: number;
}

/** 统一路径：确保以 / 开头，并去掉可能多余的 /api 前缀，交给各模式自行拼装 */
function normalizePath(path: string): string {
  let p = path.startsWith("/") ? path : `/${path}`;
  p = p.replace(/^\/api\//, "/");
  return p;
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
  const {
    method = "GET",
    params,
    body,
    headers,
    timeout = 15000
  } = options;
  const p = normalizePath(path);
  const query = buildQuery(params);

  // Mock 模式：转发到同源 /api 路由（与 next.config 的 rewrites 或 route handlers 对应）
  if (USE_MOCK) {
    const res = await fetch(`/api${p}${query}`, {
      method,
      headers: { "Content-Type": "application/json", ...headers },
      body: body ? JSON.stringify(body) : undefined
    });
    if (!res.ok) throw new Error(`Mock 请求失败: ${res.status}`);
    return (await res.json()) as T;
  }

  // 真实后端：API_BASE 已含 /api（或相对路径 /api），路径不再重复前缀
  const url = `${API_BASE}${p}${query}`;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);
  try {
    const res = await fetch(url, {
      method,
      credentials: "include", // Sa-Token SESSION Cookie
      headers: { "Content-Type": "application/json", ...headers },
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal
    });
    if (!res.ok) throw new Error(`请求失败: ${res.status}`);
    const json = await res.json();
    if (json?.code !== 0 && json?.code !== undefined) {
      throw new Error(json.message || "业务错误");
    }
    return json as T;
  } catch (err) {
    if (err instanceof DOMException && err.name === "AbortError") {
      throw new Error("请求超时，请稍后重试");
    }
    throw err;
  } finally {
    clearTimeout(timer);
  }
}
