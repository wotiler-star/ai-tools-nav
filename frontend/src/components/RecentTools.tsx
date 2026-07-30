"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import useSWR from "swr";
import { RightOutlined } from "@ant-design/icons";
import { swrFetcher } from "@/lib/api";
import ToolCard from "@/components/ToolCard";
import { getRecent } from "@/lib/recentTools";
import { AiTool, BaseResponsePage } from "@/types";

const BRAND = "#3874F7";

/**
 * 最近浏览：从 localStorage 读取最近的工具 id，匹配全量工具后横向滑动展示。
 * 仅客户端渲染（避免 SSR/CSR 水合不一致），无记录时不显示。
 */
export default function RecentTools() {
  const [ids, setIds] = useState<number[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setIds(getRecent());
    setMounted(true);
  }, []);

  const { data } = useSWR<BaseResponsePage<AiTool>>(
    "/ai_tool/list/page?categoryId=0&pageSize=200",
    swrFetcher
  );
  const all = useMemo(() => data?.data?.records || [], [data]);

  const recent = useMemo(() => {
    const map = new Map(all.map((t) => [t.id, t]));
    return ids.map((id) => map.get(id)).filter(Boolean) as AiTool[];
  }, [ids, all]);

  if (!mounted || recent.length === 0) return null;

  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="m-0 flex items-center gap-2 text-xl font-bold text-gray-900">
          <span>🕘</span>
          <span>最近浏览</span>
        </h2>
        <Link
          href="/tool"
          className="flex items-center gap-1 text-sm text-gray-500 hover:text-[#3874F7]"
        >
          全部工具 <RightOutlined style={{ fontSize: 11 }} />
        </Link>
      </div>
      <div
        style={{
          display: "flex",
          gap: 16,
          overflowX: "auto",
          paddingBottom: 8,
          scrollSnapType: "x mandatory"
        }}
      >
        {recent.map((t) => (
          <div
            key={t.id}
            style={{ minWidth: 240, flexShrink: 0, scrollSnapAlign: "start" }}
          >
            <ToolCard tool={t} />
          </div>
        ))}
      </div>
    </section>
  );
}
