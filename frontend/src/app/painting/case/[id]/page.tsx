// /painting/case/{id} —— 1:1 对齐目标站 目标站/painting/case/{19位id}
// 复用 template 详情页实现（同一份案例数据/正文/相关推荐），仅把路由形态与 SEO 文案对齐目标站。
import type { Metadata } from "next";
import { PAINTING_CASES } from "@/lib/paintingCases";
import { SITE } from "@/config/site";

export { generateStaticParams, dynamicParams, default } from "../../template/[id]/page";

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const item = PAINTING_CASES.find((c) => c.id === params.id);
  if (!item) return { title: { absolute: `案例未找到｜${SITE.name}` } };
  const desc = `${item.title}——${item.tags.map((t) => "#" + t).join(" ")}。${item.description}`;
  return {
    title: { absolute: `${item.title} - AI绘图案例与提示词 | ${SITE.name}` },
    description: desc.slice(0, 160),
    keywords: [...item.tags, "AI绘图案例", "AI绘图提示词"].join(","),
    alternates: { canonical: `/painting/case/${item.id}` },
    openGraph: {
      title: `${item.title} - AI绘图案例与提示词`,
      description: desc.slice(0, 160),
      url: `/painting/case/${item.id}`,
      type: "article"
    }
  };
}
