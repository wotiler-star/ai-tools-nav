"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Avatar, Button, Input, Tag, App, Modal } from "antd";
import {
  UserOutlined,
  SmileOutlined,
  PictureOutlined,
  TagsOutlined,
  LikeOutlined,
  MessageOutlined,
  ShareAltOutlined
} from "@ant-design/icons";
import { ESSAY_POSTS, ESSAY_TOPICS } from "@/lib/mockData";
import { useAppStore } from "@/store/useAppStore";
import { EssayPost } from "@/types";
import RichTextEditor from "@/components/RichTextEditor";

const BRAND = "#3874F7";

export default function EssayPage() {
  const [topic, setTopic] = useState("推荐");
  const { loginUser, openLoginModal } = useAppStore();
  const { message } = App.useApp();

  const [localPosts, setLocalPosts] = useState<EssayPost[]>(ESSAY_POSTS);
  const [quickText, setQuickText] = useState("");

  // 写文章弹窗状态
  const [writeOpen, setWriteOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newTags, setNewTags] = useState("");
  const [editorText, setEditorText] = useState("");

  const posts = useMemo(() => {
    if (topic === "推荐") return localPosts;
    if (topic === "精选") return localPosts.filter((p) => p.featured);
    return localPosts.filter((p) => p.topic === topic);
  }, [topic, localPosts]);

  const publish = (title: string, summary: string, tags: string[], content: string) => {
    if (!loginUser) {
      openLoginModal();
      return;
    }
    if (!title.trim()) {
      message.warning("请填写标题");
      return;
    }
    const post: EssayPost = {
      id: -Date.now(),
      authorName: loginUser.userName || "我",
      authorAvatar: loginUser.userAvatar || "",
      authorTag: "我",
      topic: topic === "推荐" || topic === "精选" ? "AI编程" : topic,
      createTime: new Date().toISOString().slice(0, 10),
      title: title.trim(),
      summary: summary.trim() || (content ? content.slice(0, 60) : "（无简介）"),
      tags,
      likeNum: 0,
      commentNum: 0,
      content
    };
    setLocalPosts((prev) => [post, ...prev]);
    setWriteOpen(false);
    setNewTitle("");
    setNewTags("");
    setEditorText("");
    message.success("已发布（演示）");
  };

  return (
    <div style={{ maxWidth: 820, margin: "0 auto", padding: "24px 16px" }}>
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
            placeholder={loginUser ? "随便聊，或点「写文章」发布长内容～" : "点击登录，快来和大家讨论吧～"}
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
            <Button
              onClick={() => (loginUser ? setWriteOpen(true) : openLoginModal())}
            >
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

      {/* 话题 Tab */}
      <div
        style={{
          display: "flex",
          gap: 8,
          flexWrap: "wrap",
          marginBottom: 16
        }}
      >
        {ESSAY_TOPICS.map((t) => (
          <span
            key={t}
            onClick={() => setTopic(t)}
            style={{
              padding: "6px 14px",
              borderRadius: 999,
              fontSize: 14,
              cursor: "pointer",
              fontWeight: topic === t ? 700 : 500,
              color: topic === t ? "#fff" : "#4e5969",
              background: topic === t ? BRAND : "#fff",
              border: `1px solid ${topic === t ? BRAND : "#eaecef"}`
            }}
          >
            {t}
          </span>
        ))}
      </div>

      {/* 帖子流 */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {posts.map((p) => (
          <Link
            key={p.id}
            href={`/essay/${p.id}`}
            className="group hover-brand block bg-white"
            style={{
              borderRadius: 12,
              padding: 16
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
              <Avatar size={36} icon={<UserOutlined />} style={{ background: "#9ca3af" }} />
              <div style={{ lineHeight: 1.3 }}>
                <div style={{ fontWeight: 600, fontSize: 14 }}>
                  {p.authorName}
                  <Tag style={{ marginLeft: 8, fontSize: 11 }} color="default">
                    {p.authorTag}
                  </Tag>
                </div>
                <div style={{ fontSize: 12, color: "#9ca3af" }}>{p.createTime}</div>
              </div>
              {p.featured && (
                <Tag color="gold" style={{ marginLeft: "auto" }}>
                  精选
                </Tag>
              )}
            </div>

            <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 6 }} className="hover-brand-title">{p.title}</div>
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

            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 12 }}>
              {p.tags.map((tag) => (
                <Tag key={tag} color="blue" style={{ margin: 0 }}>
                  #{tag}
                </Tag>
              ))}
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
          </Link>
        ))}
      </div>

      {/* 写文章弹窗（Slate 富文本编辑器） */}
      <Modal
        title="写文章"
        open={writeOpen}
        onCancel={() => setWriteOpen(false)}
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
        width={680}
        destroyOnClose
      >
        <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 12 }}>
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
