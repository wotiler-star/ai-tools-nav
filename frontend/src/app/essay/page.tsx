"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import useSWR from "swr";
import { Avatar, Button, Input, Tag, App, Modal, Spin } from "antd";
import {
  UserOutlined,
  SmileOutlined,
  PictureOutlined,
  TagsOutlined,
  LikeOutlined,
  MessageOutlined,
  ShareAltOutlined
} from "@ant-design/icons";
import { useAppStore } from "@/store/useAppStore";
import { EssayPost, AiPost, BaseResponsePage } from "@/types";
import { api, swrFetcher } from "@/lib/api";
import RichTextEditor from "@/components/RichTextEditor";

const BRAND = "#3874F7";

/** 后端 AiPost → 前端 EssayPost（后端无 topic/tags/summary/featured，做兜底映射） */
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

const TABS = ["推荐", "热门", "最新"] as const;

export default function EssayPage() {
  const [tab, setTab] = useState<(typeof TABS)[number]>("推荐");
  const [kw, setKw] = useState("");
  const { loginUser, openLoginModal } = useAppStore();
  const { message } = App.useApp();

  const [localPosts, setLocalPosts] = useState<EssayPost[]>([]);
  const [quickText, setQuickText] = useState("");

  // 写文章弹窗状态
  const [writeOpen, setWriteOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newTags, setNewTags] = useState("");
  const [editorText, setEditorText] = useState("");

  const { data, isLoading, mutate } = useSWR<BaseResponsePage<AiPost>>(
    "/ai_post/list/page?current=1&pageSize=50",
    swrFetcher
  );
  const realPosts: EssayPost[] = useMemo(
    () => (data?.data?.records || []).map(toEssayPost),
    [data]
  );

  const allPosts = useMemo(
    () => [...localPosts, ...realPosts],
    [localPosts, realPosts]
  );

  const posts = useMemo(() => {
    let list = allPosts;
    if (kw.trim()) {
      const q = kw.trim();
      list = list.filter(
        (p) => p.title.includes(q) || p.authorName.includes(q)
      );
    }
    if (tab === "热门") {
      list = [...list].sort((a, b) => b.likeNum - a.likeNum);
    } else if (tab === "最新") {
      list = [...list].sort((a, b) =>
        (b.createTime || "").localeCompare(a.createTime || "")
      );
    }
    return list;
  }, [allPosts, kw, tab]);

  const [publishing, setPublishing] = useState(false);

  const publish = async (
    title: string,
    summary: string,
    tags: string[],
    content: string
  ) => {
    if (!loginUser) {
      openLoginModal();
      return;
    }
    if (!title.trim()) {
      message.warning("请填写标题");
      return;
    }
    // 乐观更新：先把乐观记录加到列表顶部，体感零延迟
    const tempId = -Date.now();
    const optimistic: EssayPost = {
      id: tempId,
      authorName: loginUser.userName || "我",
      authorAvatar: loginUser.userAvatar || "",
      authorTag: "我",
      topic: "AI编程",
      createTime: new Date().toISOString().slice(0, 10),
      title: title.trim(),
      summary:
        summary.trim() || (content ? content.slice(0, 60) : "（无简介）"),
      tags,
      likeNum: 0,
      commentNum: 0,
      content
    };
    setLocalPosts((prev) => [optimistic, ...prev]);
    setWriteOpen(false);
    setNewTitle("");
    setNewTags("");
    setEditorText("");

    // 真发后端：失败则回滚乐观更新并提示
    setPublishing(true);
    try {
      await api.addPost({
        title: title.trim(),
        content,
        authorName: loginUser.userName || "我",
        authorAvatar: loginUser.userAvatar || ""
      });
      // 重新拉一次列表，把后端真实记录（含真实 id/authorName）覆盖上来
      mutate();
      message.success("发布成功");
    } catch (e: any) {
      setLocalPosts((prev) => prev.filter((p) => p.id !== tempId));
      message.error(e?.message || "发布失败，请稍后再试");
    } finally {
      setPublishing(false);
    }
  };

  return (
    <div style={{ maxWidth: 820, margin: "0 auto", padding: "24px 16px" }}>
      {/* 语义化页面主标题（视觉隐藏，供 SEO/读屏识别，不改变布局） */}
      <h1
        style={{
          position: "absolute",
          width: 1,
          height: 1,
          margin: -1,
          padding: 0,
          overflow: "hidden",
          clip: "rect(0 0 0 0)",
          whiteSpace: "nowrap",
          border: 0
        }}
      >
        AI 社区 · 交流讨论
      </h1>
      {/* 发帖框 */}
      <div
        style={{
          background: "#fff",
          border: "1px solid #eaecef",
          borderRadius: 12,
          padding: 16,
          marginBottom: 16
        }}
      >
        <div style={{ display: "flex", gap: 12 }}>
          <Avatar
            size={40}
            src={loginUser?.userAvatar || undefined}
            icon={<UserOutlined />}
            style={{ background: BRAND, flexShrink: 0 }}
          />
          <Input.TextArea
            value={quickText}
            onChange={(e) => setQuickText(e.target.value)}
            placeholder={
              loginUser ? "随便聊，或点「写文章」发布长内容～" : "点击登录，快来和大家讨论吧～"
            }
            autoSize={{ minRows: 2, maxRows: 5 }}
            onClick={() => !loginUser && openLoginModal()}
            style={{ borderRadius: 8, resize: "none" }}
          />
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: 12,
            paddingLeft: 52
          }}
        >
          <div style={{ display: "flex", gap: 16, color: "#86909c", fontSize: 13 }}>
            <span style={{ cursor: "pointer" }}>
              <SmileOutlined /> 表情
            </span>
            <span style={{ cursor: "pointer" }}>
              <PictureOutlined /> 图片
            </span>
            <span style={{ cursor: "pointer" }}>
              <TagsOutlined /> 关联话题
            </span>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <Button onClick={() => (loginUser ? setWriteOpen(true) : openLoginModal())}>
              写文章
            </Button>
            <Button
              type="primary"
              style={{ background: BRAND }}
              onClick={() => {
                if (!loginUser) {
                  openLoginModal();
                  return;
                }
                publish(`来自 ${loginUser.userName || "我"} 的分享`, quickText, [], "");
                setQuickText("");
              }}
            >
              发布
            </Button>
          </div>
        </div>
      </div>

      {/* 排序 Tab + 搜索 */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          marginBottom: 16,
          flexWrap: "wrap"
        }}
      >
        <div role="tablist" aria-label="帖子排序" style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {TABS.map((t) => (
            <span
              key={t}
              role="tab"
              aria-selected={tab === t}
              tabIndex={0}
              onClick={() => setTab(t)}
              style={{
                padding: "6px 14px",
                borderRadius: 999,
                fontSize: 14,
                cursor: "pointer",
                fontWeight: tab === t ? 700 : 500,
                color: tab === t ? "#fff" : "#4e5969",
                background: tab === t ? BRAND : "#fff",
                border: `1px solid ${tab === t ? BRAND : "#eaecef"}`
              }}
            >
              {t}
            </span>
          ))}
        </div>
        <Input
          allowClear
          value={kw}
          onChange={(e) => setKw(e.target.value)}
          placeholder="搜索帖子"
          style={{ width: 200, borderRadius: 999 }}
        />
      </div>

      {/* 帖子流 */}
      {isLoading ? (
        <div style={{ textAlign: "center", padding: 40 }}>
          <Spin />
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {posts.map((p) => (
            <Link
              key={p.id}
              href={`/essay/${p.id}`}
              className="group hover-brand block bg-white"
              style={{ borderRadius: 12, padding: 16 }}
            >
              <article>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    marginBottom: 10
                  }}
                >
                  <Avatar
                    size={36}
                    src={p.authorAvatar || undefined}
                    icon={<UserOutlined />}
                    style={{ background: "#9ca3af" }}
                  />
                  <div style={{ lineHeight: 1.3 }}>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>
                      {p.authorName}
                      <Tag style={{ marginLeft: 8, fontSize: 11 }} color="default">
                        {p.authorTag}
                      </Tag>
                    </div>
                    <div style={{ fontSize: 12, color: "#9ca3af" }}>{p.createTime}</div>
                  </div>
                </div>

                {/* 语义化标题：对齐目标站帖子卡 heading */}
                <h2
                  style={{ fontSize: 16, fontWeight: 700, margin: "0 0 6px" }}
                  className="hover-brand-title"
                >
                  {p.title}
                </h2>
                <div
                  style={{
                    fontSize: 14,
                    color: "#4e5969",
                    lineHeight: 1.7,
                    marginBottom: 10
                  }}
                >
                  {p.summary}
                </div>

                <div style={{ display: "flex", gap: 24, color: "#86909c", fontSize: 13 }}>
                  <span style={{ cursor: "pointer" }}>
                    <LikeOutlined /> {p.likeNum}
                  </span>
                  <span style={{ cursor: "pointer" }}>
                    <MessageOutlined /> {p.commentNum}
                  </span>
                  <span style={{ cursor: "pointer" }}>
                    <ShareAltOutlined /> 分享
                  </span>
                </div>
              </article>
            </Link>
          ))}

          {posts.length === 0 && (
            <div style={{ textAlign: "center", color: "#9ca3af", padding: 40 }}>
              暂无帖子
            </div>
          )}
        </div>
      )}

      {/* 写文章弹窗（Slate 富文本编辑器） */}
      <Modal
        title="写文章"
        open={writeOpen}
        onCancel={() => !publishing && setWriteOpen(false)}
        onOk={() =>
          publish(
            newTitle,
            editorText.slice(0, 60),
            newTags
              .split(/[,，]/)
              .map((s) => s.trim())
              .filter(Boolean),
            editorText
          )
        }
        okText="发布"
        cancelText="取消"
        confirmLoading={publishing}
        width={680}
        destroyOnClose
      >
        <div
          style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 12 }}
        >
          <Input
            placeholder="标题"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            maxLength={60}
          />
          <Input
            placeholder="标签（逗号分隔，如：AI编程,效率）"
            value={newTags}
            onChange={(e) => setNewTags(e.target.value)}
          />
          <RichTextEditor onChange={(_nodes, plain) => setEditorText(plain)} />
        </div>
      </Modal>
    </div>
  );
}
