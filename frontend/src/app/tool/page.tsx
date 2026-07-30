import { Suspense } from "react";
import type { Metadata } from "next";
import ToolCatalog from "@/components/ToolCatalog";

export const metadata: Metadata = {
  title: "AI 工具大全",
  description:
    "汇集 AI 写作、AI 图像、AI 视频、AI 编程、AI 办公等 14 大类数百款优质 AI 工具，一站式发现好用的人工智能工具。",
  alternates: { canonical: "/tool" }
};

export const dynamic = "force-dynamic";

export default function ToolListPage() {
  return (
    <Suspense fallback={null}>
      <ToolCatalog />
    </Suspense>
  );
}
