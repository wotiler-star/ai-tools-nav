import type { Metadata } from "next";
import { listSkills, getSkillCategories } from "@/lib/entries";
import SkillGrid from "@/components/SkillGrid";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Skills 技能库",
  description:
    "可复用的 AI 技能包库：一键安装 doc-writer、code-reviewer、image-prompt 等 Skills，快速为 AI 助手扩展专业能力。",
  keywords: ["Skills", "AI 技能", "技能包", "AI 助手扩展", "提示词技能"],
  alternates: { canonical: "/skills" },
  openGraph: {
    title: "Skills 技能库 · AI 导航",
    description:
      "可复用的 AI 技能包库：一键安装 doc-writer、code-reviewer、image-prompt 等 Skills，快速为 AI 助手扩展专业能力。",
    url: "/skills",
  },
};

export default async function SkillsPage({
  searchParams,
}: {
  searchParams: Promise<{ submitted?: string }>;
}) {
  const [items, categories] = await Promise.all([
    listSkills(),
    getSkillCategories(),
  ]);
  const sp = await searchParams;

  return <SkillGrid items={items} categories={categories} submitted={sp.submitted === "1"} />;
}
