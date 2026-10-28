import { NextResponse } from "next/server";

// 强制动态：确保每次请求都执行重定向，不被静态化/缓存成 200 页。
export const dynamic = "force-dynamic";

/**
 * 社区列表真实入口是 /essay；旧路由 /post 仅剩详情 /post/[id]，其列表 /post 原本 404。
 *
 * 为什么用 Route Handler 而不是 page + permanentRedirect：
 *   page 里的 permanentRedirect 在本站(Next 14.2.15)对文档请求会被降级为
 *   200 + <meta http-equiv="refresh" content="0;url=/essay">，既不是真正的 3xx、也难传递权重。
 *   Route Handler 直接返回 HTTP 308，是干净、可被搜索引擎/爬虫识别的永久重定向。
 *
 * 为什么用「相对」Location(/essay) 而非 request.url 拼绝对地址：
 *   站点经 nginx 反代到 localhost:3000，request.url 的主机是内部 localhost:3000，
 *   直接拼会把 Location 泄漏成 https://localhost:3000/essay（外网用户点到本机，必坏）。
 *   相对 Location 由浏览器/爬虫按当前访问主机解析 → https://www.toolly.cc/essay，且 nginx 原样透传。
 *
 * 只处理精确的 /post；/post/[id] 详情路由由 app/post/[id]/page.tsx 独立处理，互不影响。
 */
function redirectToEssay() {
  return new NextResponse(null, {
    status: 308,
    headers: { Location: "/essay" },
  });
}

export function GET() {
  return redirectToEssay();
}

// HEAD 一并重定向，避免对 /post 的 HEAD 探测返回 405。
export function HEAD() {
  return redirectToEssay();
}
