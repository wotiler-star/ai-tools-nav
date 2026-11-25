import type { Metadata } from "next";
import SkillsClient from "./SkillsClient";

export const metadata: Metadata = {
  title: "Skills",
  description: "发现让 AI 更好用的 Skills，记录全球 Agent Skills，释放 AI 执行潜力。",
  alternates: { canonical: "/skills" }
};

// 读取 searchParams 让分页按 URL 服务端渲染（爬虫可逐页收录，首屏与目标站同为 24 卡）
export const dynamic = "force-dynamic";

/**
 * /skills 服务端壳：读 ?current= 页码传给 client 组件。
 * 1:1 对齐目标站 ai.codefather.cn/skills 的 featured tab 分页（每页 24 条）。
 */
export default async function SkillsPage({
  searchParams
}: {
  searchParams: { current?: string; tag?: string; tab?: string };
}) {
  const sp = searchParams || {};
  const current = Math.max(1, Number(sp.current) || 1);
  return <SkillsClient current={current} />;
}
