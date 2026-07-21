import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ThumbsUp, MessageSquare, Eye, ArrowLeft, Reply } from "lucide-react";
import CommentForm from "@/components/CommentForm";
import JsonLd from "@/components/JsonLd";
import { posts, comments } from "@/lib/mock-data";
import { siteConfig } from "@/lib/site";
import type { Comment } from "@/lib/types";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const post = posts.find((p) => p.id === id);
  if (!post) return { title: "内容未找到" };
  return {
    title: post.title,
    description: post.content.slice(0, 120),
    keywords: post.tags,
    alternates: { canonical: `/community/${id}` },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.content.slice(0, 120),
      url: `/community/${id}`,
      tags: post.tags,
    },
  };
}

type TreeNode = Comment & { children: TreeNode[] };

function buildTree(list: Comment[]): TreeNode[] {
  const map = new Map<string, TreeNode>();
  list.forEach((c) => map.set(c.id, { ...c, children: [] }));
  const roots: TreeNode[] = [];
  map.forEach((c) => {
    if (c.parentId && map.has(c.parentId)) map.get(c.parentId)!.children.push(c);
    else roots.push(c);
  });
  return roots;
}

function CommentNode({ node, depth }: { node: TreeNode; depth: number }) {
  return (
    <div className={depth > 0 ? "pl-6 border-l mt-3" : "mt-3"} style={{ borderColor: "var(--border)" }}>
      <div className="flex items-center gap-2 text-sm">
        <span>{node.authorAvatar ?? "👤"}</span>
        <span className="font-medium">{node.author}</span>
        <span className="text-xs" style={{ color: "var(--text-muted)" }}>
          {new Date(node.createdAt).toLocaleString("zh-CN")}
        </span>
      </div>
      <p className="text-sm mt-1">{node.content}</p>
      <div className="flex items-center gap-3 text-xs mt-1" style={{ color: "var(--text-muted)" }}>
        <span className="flex items-center gap-1"><ThumbsUp size={12} /> {node.likes}</span>
        <span className="flex items-center gap-1 cursor-pointer"><Reply size={12} /> 回复</span>
      </div>
      {node.children.map((child) => (
        <CommentNode key={child.id} node={child} depth={depth + 1} />
      ))}
    </div>
  );
}

export default async function PostDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const post = posts.find((p) => p.id === id);
  if (!post) notFound();

  const tree = buildTree(comments.filter((c) => c.postId === id));
  const base = siteConfig.url.replace(/\/$/, "");

  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.content.slice(0, 160),
    datePublished: post.createdAt,
    dateModified: post.createdAt,
    author: { "@type": "Person", name: post.author },
    keywords: post.tags.join(", "),
    mainEntityOfPage: { "@type": "WebPage", "@id": `${base}/community/${post.id}` },
  };

  return (
    <>
      <JsonLd data={articleLd} />
    <main className="mx-auto max-w-3xl px-4 py-8">
      <Link href="/community" className="text-sm flex items-center gap-1 mb-4 hover:underline" style={{ color: "var(--primary)" }}>
        <ArrowLeft size={14} /> 返回社区
      </Link>

      <article className="card p-6">
        <h1 className="text-2xl font-bold">{post.title}</h1>
        <div className="flex items-center gap-2 text-sm mt-2" style={{ color: "var(--text-muted)" }}>
          <span>{post.authorAvatar} {post.author}</span>
          <span>· {new Date(post.createdAt).toLocaleString("zh-CN")}</span>
        </div>
        <div className="flex flex-wrap gap-1.5 my-3">
          {post.tags.map((t) => (
            <span key={t} className="chip !py-0.5 !text-xs">{t}</span>
          ))}
        </div>
        <p className="leading-7 mt-2">{post.content}</p>
        <div className="flex items-center gap-5 text-sm mt-4 pt-4 border-t" style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}>
          <span className="flex items-center gap-1"><ThumbsUp size={14} /> {post.likes}</span>
          <span className="flex items-center gap-1"><MessageSquare size={14} /> {post.comments}</span>
          <span className="flex items-center gap-1"><Eye size={14} /> {post.views}</span>
        </div>
      </article>

      <div className="mt-6">
        <h2 className="font-bold mb-3">评论 {post.comments}</h2>
        <CommentForm postId={post.id} />
        <div className="mt-4 card p-4">
          {tree.length === 0 ? (
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>还没有评论，来抢沙发～</p>
          ) : (
            tree.map((node) => <CommentNode key={node.id} node={node} depth={0} />)
          )}
        </div>
      </div>
    </main>
    </>
  );
}
