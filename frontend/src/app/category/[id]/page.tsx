"use client";

import { useParams } from "next/navigation";
import { Suspense } from "react";
import ToolExplorer from "@/components/ToolExplorer";

export const dynamic = "force-dynamic";

export default function CategoryPage() {
  const params = useParams();
  const id = Number(params.id) || 0;
  return (
    <Suspense fallback={null}>
      <ToolExplorer initialCategoryId={id} />
    </Suspense>
  );
}
