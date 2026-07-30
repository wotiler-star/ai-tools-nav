import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AI_NEWS } from "@/lib/mockData";
import { SITE } from "@/config/site";
import NewsDetail from "./NewsDetail";

interface Props {
  params: { id: string };
}

const SOURCES = ["机器之心", "量子位", "InfoQ", "36氪", "新智元", "钛媒体"];

export function generateMetadata({ params }: Props): Metadata {
  const item = AI_NEWS.find((n) => n.id === Number(params.id));
  if (!item) {
    return { title: "资讯不存在", description: SITE.description };
  }
  const desc = `AI 行业动态：${item.title}。来源 ${SOURCES[(item.rank - 1) % SOURCES.length]}，${SITE.name} 为你持续追踪最新 AI 资讯。`;
  return {
    title: item.title,
    description: desc,
    alternates: { canonical: `/news/${item.id}` },
    openGraph: {
      type: "article",
      title: item.title,
      description: desc,
      url: `https://${SITE.domain}/news/${item.id}`
    }
  };
}

export default function Page({ params }: Props) {
  const item = AI_NEWS.find((n) => n.id === Number(params.id));
  if (!item) notFound();
  return <NewsDetail item={item} />;
}
