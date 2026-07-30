import type { Metadata } from "next";
import { CATEGORIES } from "@/lib/mockData";

export function generateMetadata({
  params
}: {
  params: { id: string };
}): Metadata {
  const cat = CATEGORIES.find((c) => String(c.id) === params.id);
  const name = cat ? cat.name : "分类";
  return {
    title: `${name} 工具`,
    description: `${name}——收录该分类下的优质 AI 工具，鱼皮AI导航。`,
    alternates: { canonical: `/category/${params.id}` },
    openGraph: {
      title: `${name} 工具｜鱼皮AI导航`,
      description: `收录 ${name} 分类下的优质 AI 工具。`,
      url: `/category/${params.id}`,
      type: "website"
    }
  };
}

export default function CategoryDetailLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return children;
}
