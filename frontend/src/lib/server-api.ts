/**
 * 服务端取数 helper（供 generateMetadata / layout 在服务端真实拉取后端数据）
 *
 * 与浏览器端 swrFetcher 不同，这里在 Next 服务端（容器网络内）直连后端，
 * 走内网服务名 backend:8123，不经过 nginx 回环。用于生成精确的 per-page
 * metadata（title/description/canonical）与 SSR 结构化数据，避免详情页
 * 因 mock 数据错位而全部回退成重复标题。
 *
 * 失败（后端不可达 / code!=0）一律返回 null，由调用方回退到泛型文案，
 * 绝不让页面 500。结果带 1h 缓存，降低后端压力。
 */

/** 容器内网直连后端（同属 ainav-net），与 sitemap.xml/route.ts 一致 */
const INTERNAL_API = process.env.SITEMAP_API_BASE || "http://backend:8123/api";

export async function serverGet<T = unknown>(
  path: string,
  params: Record<string, string | number> = {}
): Promise<T | null> {
  const usp = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") usp.append(k, String(v));
  });
  const qs = usp.toString();
  const url = `${INTERNAL_API}${path}${qs ? `?${qs}` : ""}`;
  try {
    const res = await fetch(url, {
      headers: { "Content-Type": "application/json" },
      next: { revalidate: 3600 }
    });
    if (!res.ok) return null;
    const json = (await res.json()) as { code?: number; data?: T };
    // 后端统一返回 { code, data, message }；code 存在且非 0 视为无数据
    if (typeof json.code === "number" && json.code !== 0) return null;
    return (json?.data ?? (json as unknown as T)) as T;
  } catch {
    return null;
  }
}
