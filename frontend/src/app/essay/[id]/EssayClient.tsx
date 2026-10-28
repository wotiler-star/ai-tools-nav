"use client";

import { useMemo } from "react";
import useSWR from "swr";
import { Spin } from "antd";
import { EssayPost, AiPost, BaseResponse, BaseResponsePage } from "@/types";
import { swrFetcher } from "@/lib/api";
import EssayDetail from "./EssayDetail";

function toEssayPost(p: AiPost): EssayPost {
  const summary = p.content
    ? p.content.replace(/\s+/g, " ").slice(0, 80)
    : "（暂无简介）";
  return {
    id: p.id,
    authorName: p.authorName || "匿名用户",
    authorAvatar: p.authorAvatar || "",
    authorTag: "AI社区",
    topic: "AI编程",
    createTime: (p.createTime || "").toString().slice(0, 10),
    title: p.title,
    summary,
    tags: [],
    likeNum: p.likeNum || 0,
    commentNum: p.commentNum || 0,
    content: p.content || ""
  };
}

export function EssayClient({ params }: { params: { id: string } }) {
  const id = params.id;

  const { data: postRes, isLoading: postLoading } = useSWR<BaseResponse<AiPost>>(
    `/ai_post/get?id=${id}`,
    swrFetcher
  );
  const { data: listRes } = useSWR<BaseResponsePage<AiPost>>(
    "/ai_post/list/page?current=1&pageSize=20",
    swrFetcher
  );

  const post: EssayPost | undefined = useMemo(() => {
    const p = postRes?.data;
    return p ? toEssayPost(p) : undefined;
  }, [postRes]);

  const relatedPosts: EssayPost[] = useMemo(() => {
    const records = listRes?.data?.records || [];
    return records
      .filter((p) => String(p.id) !== String(id))
      .slice(0, 3)
      .map(toEssayPost);
  }, [listRes, id]);

  if (postLoading) {
    return (
      <div style={{ textAlign: "center", padding: 60 }}>
        <Spin />
      </div>
    );
  }

  if (!post) {
    return (
      <div style={{ maxWidth: 820, margin: "0 auto", padding: 60, textAlign: "center", color: "#9ca3af" }}>
        帖子不存在或已删除
      </div>
    );
  }

  return <EssayDetail post={post} relatedPosts={relatedPosts} />;
}
