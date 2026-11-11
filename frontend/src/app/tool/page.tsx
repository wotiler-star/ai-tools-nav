import { Suspense } from "react";
import type { Metadata } from "next";
import ToolCatalog from "@/components/ToolCatalog";
import type { AiTool, Category } from "@/types";

export const metadata: Metadata = {
  title: "AI 工具大全",
  description:
    "汇集 AI 写作、AI 图像、AI 视频、AI 编程、AI 办公等 14 大类数百款优质 AI 工具，一站式发现好用的人工智能工具。",
  alternates: { canonical: "/tool" }
};

// 服务端直连后端（容器内网地址，与 HomeMagazine 同款），SSR 直出全部工具卡，SEO 友好。
export const dynamic = "force-dynamic";

const SERVER_API = process.env.INTERNAL_API_BASE || "http://backend:8123";

interface PageResult<T> {
  records: T[];
  total: number;
  size?: number;
  current?: number;
  pages?: number;
}

/**
 * 服务端取数：统一拼装后端地址、8s 超时、异常兜底返回 null。
 * 任一接口异常均返回空数组，由客户端 SWR revalidate 兜底，绝不让整页崩溃。
 */
async function serverFetch<T = any>(
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

export default async function ToolListPage() {
  const [toolRes, catRes] = await Promise.all([
    serverFetch<PageResult<AiTool>>("/ai_tool/list/page", {
      categoryId: 0,
      current: 1,
      pageSize: 1000
    }),
    serverFetch<Category[]>("/category/list")
  ]);

  const initialTools: AiTool[] = toolRes?.records ?? [];
  const initialCategories: Category[] = catRes ?? [];

  return (
    <Suspense fallback={null}>
      <ToolCatalog initialTools={initialTools} initialCategories={initialCategories} />
    </Suspense>
  );
}
