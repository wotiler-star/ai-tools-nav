// 前端存活探针：供 Docker HEALTHCHECK 与上游网关探测。
// 返回 200 表示 Next.js 服务已就绪；不依赖后端与数据库，避免级联误判。
export const dynamic = "force-dynamic";

export async function GET() {
  return new Response(
    JSON.stringify({ status: "ok", service: "frontend" }),
    {
      status: 200,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Cache-Control": "no-store, no-cache, must-revalidate",
      },
    }
  );
}
