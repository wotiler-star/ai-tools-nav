// 服务端直连后端（RSC 在 Node 内无法使用浏览器相对 /api，必须走容器内网地址）。
// docker-compose 中后端服务名为 backend（端口 8123），与前端同在 ainav-net 网络，已实测可达。
// 可用 INTERNAL_API_BASE 覆盖（如迁移到独立后端域名）。
const SERVER_API = process.env.INTERNAL_API_BASE || "http://backend:8123";

export interface PageResult<T> {
  records: T[];
  total: number;
  size?: number;
  current?: number;
  pages?: number;
}

/**
 * 服务端取数：统一拼装后端地址、带 8s 超时与异常兜底。
 * 任一接口异常都返回 null，由调用处回退到 mock，绝不因接口抖动导致整页崩溃。
 * 与首页 HomeMagazine 中的 serverFetch 逻辑一致，抽成共享工具避免重复。
 */
export async function serverFetch<T = any>(
  path: string,
  params?: Record<string, any>
): Promise<T | null> {
  try {
    const url = new URL(`${SERVER_API}/api${path}`);
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        if (v !== undefined && v !== null && v !== "") url.searchParams.set(k, String(v));
      });
    }
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 8000);
    const res = await fetch(url.toString(), {
      cache: "no-store",
      headers: { "Content-Type": "application/json" },
      signal: controller.signal
    });
    clearTimeout(timer);
    if (!res.ok) return null;
    const json = await res.json();
    if (json?.code !== 0 && json?.code !== undefined) return null;
    return (json.data as T) ?? null;
  } catch {
    return null;
  }
}
