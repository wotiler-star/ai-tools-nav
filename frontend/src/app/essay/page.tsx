"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Avatar, Button, Input, Tag, message } from "antd";
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

const BRAND = "#3874F7";

export default function EssayPage() {
  const [topic, setTopic] = useState("推荐");
  const { loginUser, openLoginModal } = useAppStore();

  const posts = useMemo(() => {
    if (topic === "推荐") return ESSAY_POSTS;
    if (topic === "精选") return ESSAY_POSTS.filter((p) => p.featured);
    return ESSAY_POSTS.filter((p) => p.topic === topic);
  }, [topic]);

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
              onClick={() => (loginUser ? message.info("写文章功能开发中") : openLoginModal())}
            >
              写文章
            </Button>
            <Button
              type="primary"
              style={{ background: BRAND }}
              onClick={() => (loginUser ? message.success("已发布（演示）") : openLoginModal())}
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
    </div>
  );
}
