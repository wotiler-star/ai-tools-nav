import { serverGet } from "@/lib/server-api";
import ToolDetailView from "./ToolDetailView";
import { TOOL_NUM_IDS } from "@/lib/toolRealIds";
import type { AiTool } from "@/types";

/**
 * /tool/{id} 服务端壳 —— 首屏取数直出 DOM（SEO/Googlebot）。
 * 原先 page.tsx 整个是 "use client" + useSWR，SSR 只有骨架（实测 DOM 正文 195 字），
 * 正文全靠客户端 hydrate；改为 server 取数注入 client 组件 fallbackData 后正文直出。
 * 19 位目标站 id 走映射表转本站数字 id，与 layout 的 resolveId 口径一致。
 */
export const dynamic = "force-dynamic";

interface ToolDetail extends AiTool {
  related: AiTool[];
  detail?: string;
}

export default async function ToolDetailPage({ params }: { params: { id: string } }) {
  const routeId = String(params.id);
  const isRealId = /^\d{19}$/.test(routeId);
  const numId = isRealId ? TOOL_NUM_IDS[routeId] || "0" : routeId;
  const tool = numId && numId !== "0"
    ? await serverGet<ToolDetail>("/ai_tool/get", { id: numId })
    : null;
  return <ToolDetailView initialTool={tool ?? null} />;
}
