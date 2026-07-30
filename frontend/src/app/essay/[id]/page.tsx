import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ESSAY_POSTS } from "@/lib/mockData";
import { SITE } from "@/config/site";
import EssayDetail from "./EssayDetail";

interface Props {
  params: { id: string };
}

export function generateMetadata({ params }: Props): Metadata {
  const post = ESSAY_POSTS.find((p) => p.id === Number(params.id));
  if (!post) {
    return {
      title: "帖子不存在",
      description: SITE.description
    };
  }
  const desc = post.summary.slice(0, 120);
  return {
    title: post.title,
    description: desc,
    alternates: { canonical: `/essay/${post.id}` },
    openGraph: {
      type: "article",
      title: post.title,
      description: desc,
      url: `https://${SITE.domain}/essay/${post.id}`
    }
  };
}

export default function Page({ params }: Props) {
  const post = ESSAY_POSTS.find((p) => p.id === Number(params.id));
  if (!post) notFound();
  return <EssayDetail post={post} />;
}
