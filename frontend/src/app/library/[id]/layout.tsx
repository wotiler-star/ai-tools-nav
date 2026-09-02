import type { Metadata } from "next";
import { KB_COLUMNS } from "@/lib/mockData";
import { SITE } from "@/config/site";

export function generateMetadata({
  params
}: {
  params: { id: string };
}): Metadata {
  const col = KB_COLUMNS.find((c) => String(c.id) === params.id);
  if (!col) {
    return {
      title: "知识库专栏",
      description: `AI 知识库专栏——${SITE.name}。`
    };
  }
  return {
    title: col.title,
    description: `${col.title}——${col.description}`,
    alternates: { canonical: `/library/${col.id}` },
    openGraph: {
      title: `${col.title}｜${SITE.name}`,
      description: col.description,
      url: `/library/${col.id}`,
      type: "article"
    }
  };
}

export default function LibraryDetailLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return children;
}
