import fs from "fs";
import path from "path";
import type { McpServer } from "@/types";

/**
 * MCP 数据统一查找（server only）：先查全量 mcp-list.json（9201 条，19 位 id），
 * 兜底再查 mockData。id 用 string 保留精度（19 位数字转 number 会丢精度）。
 */
let cache: Record<string, McpServer> | null = null;
export function findMcp(id: string): McpServer | undefined {
  if (!cache) {
    const map: Record<string, McpServer> = {};
    try {
      const arr = JSON.parse(fs.readFileSync(path.join(process.cwd(), "data", "mcp-list.json"), "utf8")) as
        Array<{ id: string; title: string; desc: string; tags: string[]; avatar: string; time: number }>;
      for (const it of arr) {
        map[it.id] = {
          id: it.id as unknown as number,
          name: it.title,
          tag: it.tags[0] || "",
          category: it.tags[0] || "其他",
          description: it.desc,
          tags: it.tags,
          logo: it.avatar || undefined,
          url: `/mcp/${it.id}`
        };
      }
    } catch { /* 数据缺失则空 */ }
    cache = map;
  }
  return cache[id];
}

/** 详情页侧栏：与主条目同类的若干条 + 最新若干条（只传切片，避免 9201 条进 bundle） */
export function detailSidebar(id: string, category: string): { latest: McpServer[]; related: McpServer[] } {
  findMcp(id); // 触发缓存
  const all = Object.values(cache || {}).filter((t) => String(t.id) !== id);
  const latest = [...all].sort((a, b) => String(b.id).localeCompare(String(a.id))).slice(0, 6);
  const latestIds = new Set(latest.map((t) => String(t.id)));
  const related = all.filter((t) => t.category === category && !latestIds.has(String(t.id))).slice(0, 6);
  return { latest, related };
}
