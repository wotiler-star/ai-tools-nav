import { listSkills, getSkillCategories } from "@/lib/entries";
import SkillGrid from "@/components/SkillGrid";

export const dynamic = "force-dynamic";

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
