"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import useSWR from "swr";
import { Button, Spin, Empty, App, Divider, Tag, Input, Avatar, List, Popconfirm, Space } from "antd";
import {
  LeftOutlined,
  EyeOutlined,
  LikeOutlined,
  StarOutlined,
  ShareAltOutlined,
  MessageOutlined,
  DeleteOutlined,
  UserOutlined
} from "@ant-design/icons";
import MarkdownIt from "markdown-it";
import { api, swrFetcher } from "@/lib/api";
import { AiArticle, AiColumn, AiComment, BaseResponse } from "@/types";
import { useAppStore } from "@/store/useAppStore";

const BRAND = "#3874F7";

/** 正文 markdown 渲染容器的样式（作用域限定，避免污染全局） */
const MD_STYLE = `
.ainav-md { font-size: 15px; line-height: 1.85; color: #1f2329; word-break: break-word; }
.ainav-md h1 { font-size: 24px; font-weight: 800; margin: 24px 0 12px; }
.ainav-md h2 { font-size: 20px; font-weight: 700; margin: 22px 0 10px; padding-left: 10px; border-left: 4px solid ${BRAND}; }
.ainav-md h3 { font-size: 17px; font-weight: 700; margin: 18px 0 8px; }
.ainav-md p  { margin: 10px 0; }
.ainav-md ul, .ainav-md ol { margin: 10px 0; padding-left: 22px; }
.ainav-md li { margin: 4px 0; }
.ainav-md blockquote { margin: 12px 0; padding: 8px 14px; background: #f7f8fa; border-left: 4px solid #d9dde3; color: #4e5969; }
.ainav-md pre { background: #1f2430; color: #e6e6e6; padding: 14px 16px; border-radius: 8px; overflow-x: auto; margin: 14px 0; }
.ainav-md code { background: #f2f3f5; padding: 2px 6px; border-radius: 4px; font-size: 13px; }
.ainav-md pre code { background: transparent; padding: 0; color: inherit; }
.ainav-md table { width: 100%; border-collapse: collapse; margin: 14px 0; }
.ainav-md th, .ainav-md td { border: 1px solid #e5e6eb; padding: 8px 12px; text-align: left; }
.ainav-md th { background: #f7f8fa; font-weight: 700; }
.ainav-md a { color: ${BRAND}; }
.ainav-md hr { margin: 20px 0; border: none; border-top: 1px solid #e5e6eb; }
.ainav-md img { max-width: 100%; border-radius: 8px; }
`;

export function ArticleClient({
  params
}: {
  params: { id: string; articleId: string };
}) {
  const columnId = Number(params.id);
  const articleId = Number(params.articleId);
  const { message } = App.useApp();
  const { loginUser, openLoginModal } = useAppStore();
  const [liked, setLiked] = useState(false);
  const [collected, setCollected] = useState(false);

  const { data: colData } = useSWR<{ data: AiColumn }>(
    `/ai_column/get/${columnId}`,
    swrFetcher
  );
  const { data: artData, isLoading } = useSWR<{ data: AiArticle }>(
    `/ai_column/article/get/${articleId}`,
    swrFetcher
  );
  const article = artData?.data;
  const col = colData?.data;

  // 阅读量真实计数：进入详情页调一次，同会话用 sessionStorage 防重复计数
  useEffect(() => {
    const key = `viewed_article_${articleId}`;
    if (typeof window !== "undefined" && sessionStorage.getItem(key)) return;
    if (typeof window !== "undefined") sessionStorage.setItem(key, "1");
    api.viewArticle(articleId).catch(() => {});
  }, [articleId]);

  // 评论列表
  const { data: commentData, mutate: mutateComments } = useSWR<BaseResponse<AiComment[]>>(
    `/ai_comment/list?targetType=article&targetId=${articleId}`,
    swrFetcher
  );
  const comments = useMemo(() => commentData?.data ?? [], [commentData]);
  const [commentText, setCommentText] = useState("");
  const [posting, setPosting] = useState(false);

  const submitComment = async () => {
    if (!loginUser) {
      openLoginModal();
      return;
    }
    const text = commentText.trim();
    if (!text) {
      message.warning("请输入评论内容");
      return;
    }
    setPosting(true);
    try {
      await api.addComment({ targetType: "article", targetId: articleId, content: text });
      setCommentText("");
      message.success("评论已发布");
      mutateComments();
    } catch (e: any) {
      message.error(e?.message || "评论失败");
    } finally {
      setPosting(false);
    }
  };

  const removeComment = async (id: number) => {
    try {
      await api.deleteComment(id);
      message.success("评论已删除");
      mutateComments();
    } catch (e: any) {
      message.error(e?.message || "删除失败");
    }
  };

  // 上下篇导航
  const { data: listData } = useSWR<{ data: { records: AiArticle[] } }>(
    `/ai_column/article/list?current=1&pageSize=50&columnId=${columnId}`,
    swrFetcher
  );
  const all = useMemo(() => listData?.data?.records || [], [listData]);
  const curIdx = all.findIndex((a) => a.id === articleId);
  const prev = curIdx > 0 ? all[curIdx - 1] : null;
  const next = curIdx >= 0 && curIdx < all.length - 1 ? all[curIdx + 1] : null;

  // markdown → html（禁用原始 HTML，避免 XSS）
  const html = useMemo(() => {
    if (!article?.content) return "";
    try {
      const md = new MarkdownIt({ html: false, linkify: true, breaks: false });
      return md.render(article.content);
    } catch {
      return `<p>${article.content.replace(/</g, "&lt;")}</p>`;
    }
  }, [article?.content]);

  // 阅读进度条
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const total = h.scrollHeight - h.clientHeight;
      setProgress(total > 0 ? Math.min(100, (h.scrollTop / total) * 100) : 0);
    };
    window.addEventListener("scroll", onScroll);
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (isLoading) {
    return (
      <div style={{ textAlign: "center", padding: 80 }}>
        <Spin />
      </div>
    );
  }

  if (!article) {
    return (
      <div style={{ maxWidth: 860, margin: "0 auto", padding: 40 }}>
        <Empty description="文章不存在" />
        <div style={{ textAlign: "center", marginTop: 16 }}>
          <Link href={`/library/${columnId}`} style={{ color: BRAND }}>
            返回专栏
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 860, margin: "0 auto", padding: "24px 16px" }}>
      {/* 阅读进度条 */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          height: 3,
          width: `${progress}%`,
          background: BRAND,
          zIndex: 1000,
          transition: "width .1s"
        }}
      />
      <style dangerouslySetInnerHTML={{ __html: MD_STYLE }} />

      {/* 面包屑 */}
      <div style={{ fontSize: 13, color: "#86909c", marginBottom: 16 }}>
        <Link href="/library" style={{ color: "#86909c" }}>
          AI知识库
        </Link>
        <span style={{ margin: "0 8px" }}>/</span>
        <Link href={`/library/${columnId}`} style={{ color: "#86909c" }}>
          {col?.title || "专栏"}
        </Link>
        <span style={{ margin: "0 8px" }}>/</span>
        <span style={{ color: "#4e5969" }}>{article.title}</span>
      </div>

      {/* 文章主体 */}
      <div
        style={{
          background: "#fff",
          border: "1px solid #eaecef",
          borderRadius: 12,
          padding: "28px 28px 32px"
        }}
      >
        <h1 style={{ fontSize: 26, fontWeight: 800, margin: "0 0 12px", lineHeight: 1.4 }}>
          {article.title}
        </h1>
        <div style={{ display: "flex", gap: 16, fontSize: 13, color: "#9ca3af", marginBottom: 8, flexWrap: "wrap" }}>
          {col?.categoryName && <Tag color="blue">{col.categoryName}</Tag>}
          <span>
            <EyeOutlined /> {article.viewNum || 0} 阅读
          </span>
          <span>
            <LikeOutlined /> {article.likeNum || 0} 点赞
          </span>
          <span>
            <StarOutlined /> {article.collectNum || 0} 收藏
          </span>
          {article.createTime && (
            <span>{String(article.createTime).slice(0, 10)}</span>
          )}
        </div>

        <Divider style={{ margin: "16px 0 22px" }} />

        {article.content ? (
          <div
            className="ainav-md"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        ) : (
          <Empty description="正文内容建设中" />
        )}

        {/* 底部操作 */}
        <div
          style={{
            display: "flex",
            gap: 12,
            justifyContent: "center",
            marginTop: 36,
            paddingTop: 24,
            borderTop: "1px solid #f0f0f0"
          }}
        >
          <Button
            icon={<LikeOutlined />}
            type={liked ? "primary" : "default"}
            onClick={() => {
              setLiked((v) => !v);
              message.info(liked ? "已取消点赞" : "点赞成功");
            }}
          >
            {liked ? "已点赞" : "点赞"}
          </Button>
          <Button
            icon={<StarOutlined />}
            type={collected ? "primary" : "default"}
            onClick={() => {
              setCollected((v) => !v);
              message.info(collected ? "已取消收藏" : "收藏成功");
            }}
          >
            {collected ? "已收藏" : "收藏"}
          </Button>
          <Button
            icon={<ShareAltOutlined />}
            onClick={() => {
              if (navigator.clipboard) {
                navigator.clipboard.writeText(window.location.href);
                message.success("链接已复制");
              } else {
                message.info("演示站点，暂未接入分享");
              }
            }}
          >
            分享
          </Button>
        </div>
      </div>

      {/* 上下篇 */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: 12,
          marginTop: 16,
          flexWrap: "wrap"
        }}
      >
        <div style={{ flex: 1, minWidth: 200 }}>
          {prev && (
            <Link href={`/library/${columnId}/${prev.id}`}>
              <div
                style={{
                  background: "#fff",
                  border: "1px solid #eaecef",
                  borderRadius: 10,
                  padding: "12px 16px",
                  fontSize: 13
                }}
                className="group hover-brand"
              >
                <div style={{ color: "#9ca3af", marginBottom: 4 }}>上一篇</div>
                <div style={{ color: "#1f2329", fontWeight: 600 }} className="hover-brand-title">
                  {prev.title}
                </div>
              </div>
            </Link>
          )}
        </div>
        <div style={{ flex: 1, minWidth: 200 }}>
          {next && (
            <Link href={`/library/${columnId}/${next.id}`}>
              <div
                style={{
                  background: "#fff",
                  border: "1px solid #eaecef",
                  borderRadius: 10,
                  padding: "12px 16px",
                  fontSize: 13,
                  textAlign: "right"
                }}
                className="group hover-brand"
              >
                <div style={{ color: "#9ca3af", marginBottom: 4 }}>下一篇</div>
                <div style={{ color: "#1f2329", fontWeight: 600 }} className="hover-brand-title">
                  {next.title}
                </div>
              </div>
            </Link>
          )}
        </div>
      </div>

      {/* 评论区 */}
      <div
        style={{
          background: "#fff",
          border: "1px solid #eaecef",
          borderRadius: 12,
          padding: "24px 28px",
          marginTop: 16
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
          <MessageOutlined style={{ color: BRAND }} />
          <span style={{ fontWeight: 700, fontSize: 16 }}>评论</span>
          <span style={{ color: "#9ca3af", fontSize: 13 }}>({comments.length})</span>
        </div>

        {/* 输入框 */}
        <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
          <Avatar
            src={loginUser?.userAvatar}
            icon={!loginUser?.userAvatar ? <UserOutlined /> : undefined}
          >
            {!loginUser?.userAvatar && !loginUser?.userName
              ? ""
              : (loginUser?.userName || "我").slice(0, 1)}
          </Avatar>
          <div style={{ flex: 1 }}>
            <Input.TextArea
              rows={3}
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder={loginUser ? "说点什么吧…" : "登录后参与评论"}
              disabled={!loginUser}
            />
            <div style={{ textAlign: "right", marginTop: 8 }}>
              <Button type="primary" onClick={submitComment} loading={posting} disabled={!loginUser}>
                发布评论
              </Button>
            </div>
          </div>
        </div>

        {/* 列表 */}
        {comments.length === 0 ? (
          <Empty
            description="还没有评论，快来抢沙发"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        ) : (
          <List<AiComment>
            dataSource={comments}
            split
            renderItem={(c) => (
              <List.Item
                style={{ alignItems: "flex-start", borderBottom: "1px solid #f5f5f5" }}
                actions={[
                  loginUser &&
                    (loginUser.id === c.userId || loginUser.userRole === "admin") && (
                      <Popconfirm
                        title="确认删除该评论？"
                        onConfirm={() => removeComment(c.id)}
                        okText="删除"
                        cancelText="取消"
                      >
                        <Button type="link" size="small" danger icon={<DeleteOutlined />}>
                          删除
                        </Button>
                      </Popconfirm>
                    )
                ].filter(Boolean) as any}
              >
                <List.Item.Meta
                  avatar={<Avatar src={c.userAvatar}>{c.userName?.slice(0, 1)}</Avatar>}
                  title={
                    <span style={{ fontSize: 14 }}>
                      {c.userName}
                      <span
                        style={{
                          color: "#bbb",
                          fontWeight: 400,
                          marginLeft: 8,
                          fontSize: 12
                        }}
                      >
                        {c.createTime
                          ? String(c.createTime).slice(0, 19).replace("T", " ")
                          : ""}
                      </span>
                    </span>
                  }
                  description={
                    <span style={{ fontSize: 14, color: "#4e5969" }}>{c.content}</span>
                  }
                />
              </List.Item>
            )}
          />
        )}
      </div>
    </div>
  );
}
