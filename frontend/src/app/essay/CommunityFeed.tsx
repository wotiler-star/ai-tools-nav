"use client";

// /essay 社区信息流 1:1 复刻自目标站 https://ai.codefather.cn/essay
// 证据：Temp/craft_essay_capture/（craft-anything 2026-11-25 抓取）
// 颗粒度对齐（AX + DOM 实测）：article/aside/tablist/tab/tabpanel、h1×13、ul/li 列表、
//   antd SVG 图标、分级等级图标、VIP 条件渲染、精选角标、右对齐分页、footer。
import { useMemo, useState } from "react";
import Link from "next/link";
import { FEED_POSTS, SIDE_TUTORIALS, SIDE_NEWS, FEED_TABS, type FeedPost } from "@/lib/essayFeedData";
import { ICON_PATHS } from "@/lib/essayIcons";

const BLUE = "#1677ff";
const GREY_BG = "#f5f5f5";

/** 目标站 antd 图标：anticon + svg path（逐 path 提取） */
function Icon({ name, style, color }: { name: string; style?: React.CSSProperties; color?: string }) {
  const d = ICON_PATHS[name];
  if (!d) return null;
  return (
    <span role="img" aria-label={name} className={`anticon anticon-${name}`} style={{ display: "inline-flex", fontSize: 14, color, ...style }}>
      <svg viewBox="64 64 896 896" width="1em" height="1em" fill="currentColor" aria-hidden="true" focusable="false">
        <path d={d} />
      </svg>
    </span>
  );
}

/** 作者头像：目标站用 antd Avatar 圆形，有图片则图片，否则首字 */
function Avatar({ post, size = 40 }: { post: FeedPost; size?: number }) {
  if (post.avatar) {
    return <img src={post.avatar} alt={post.author} style={{ width: size, height: size, borderRadius: "50%", objectFit: "cover", flexShrink: 0 }} />;
  }
  return (
    <span role="img" aria-label={post.author.slice(0, 1)}
      style={{
        width: size, height: size, borderRadius: "50%", flexShrink: 0,
        background: "#e6f0ff", color: BLUE, fontSize: 16,
        display: "inline-flex", alignItems: "center", justifyContent: "center"
      }}>
      {post.author.slice(0, 1)}
    </span>
  );
}

/** 作者行：头像 名字 等级 vip · 职位 · 时间 */
function AuthorRow({ post }: { post: FeedPost }) {
  const levelSrc = post.level ? `/essay-covers/${post.level}` : "";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8, flexWrap: "wrap" }}>
      <a href={`https://ai.codefather.cn/user/${post.id}`} target="_blank" rel="noreferrer" style={{ display: "flex" }}>
        <Avatar post={post} size={40} />
      </a>
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          <a href={`https://ai.codefather.cn/user/${post.id}`} target="_blank" rel="noreferrer" style={{ color: "#000", fontSize: 16, textDecoration: "none" }}>
            {post.author}
          </a>
          <a href="https://ai.codefather.cn/post/1620297481155788801" target="_blank" rel="noreferrer">
            <img src={levelSrc} alt="等级" style={{ width: 32, height: 17 }} />
          </a>
          {post.vip && <a href="https://ai.codefather.cn/vip" target="_blank" rel="noreferrer"><img src="/essay-covers/vip.86643c96.svg" alt="vip" style={{ width: 14, height: 16 }} /></a>}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#999", fontSize: 14, marginTop: 2 }}>
          <span>{post.authorDesc}</span>
        </div>
      </div>
    </div>
  );
}

/** 互动按钮：目标站用 div + anticon + 数字，无 button 标签 */
function Action({ icon, count, active, onClick, label }: {
  icon: string; count?: number; active?: boolean; onClick?: () => void; label: string;
}) {
  return (
    <div onClick={onClick} title={label} style={{
      display: "inline-flex", alignItems: "center", gap: 4, cursor: "pointer",
      fontSize: 14, color: active ? BLUE : "#000000e0"
    }}>
      <Icon name={icon} color={active ? BLUE : "#000000e0"} />
      {count !== undefined && <span>{count}</span>}
    </div>
  );
}

/** 帖子卡片：目标站 div.relative > img(精选角标) + div.ant-card(post-card) */
function PostCard({ post }: { post: FeedPost }) {
  const [liked, setLiked] = useState(false);
  const [starred, setStarred] = useState(false);
  return (
    <li style={{ position: "relative", listStyle: "none" }}>
      {post.featured && (
        <img src="/essay-covers/priority_good.8c95f213.png" alt="精选"
          style={{ position: "absolute", right: 0, top: 0, width: 48, height: 48, opacity: 0.4, zIndex: 10 }} />
      )}
      <div style={{ background: "#fff", borderRadius: 8, padding: 12, boxShadow: "rgba(0,0,0,0.05) 0px 1px 3px 0px" }}>
        <AuthorRow post={post} />
        <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <Link href={`/essay/${post.id}`} style={{ textDecoration: "none" }}>
              <h1 style={{ fontSize: 18, fontWeight: 600, color: "#000000e0", margin: "4px 0 5px", lineHeight: 1.3 }}>
                {post.title}
              </h1>
            </Link>
            <Link href={`/essay/${post.id}`} style={{ textDecoration: "none" }}>
              <div style={{
                fontSize: 14, color: "#898989", lineHeight: 1.6, margin: 0,
                display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden"
              }}>
                {post.preview}
              </div>
              <div style={{ fontSize: 14, color: BLUE, marginTop: 4 }}>查看全文</div>
            </Link>
          </div>
          {post.cover && (
            <Link href={`/essay/${post.id}`} style={{ flexShrink: 0 }}>
              <img src={post.cover} alt={post.title}
                style={{ width: 213, height: 128, objectFit: "cover", borderRadius: 4, display: "block" }} />
            </Link>
          )}
        </div>

        {post.bestComment && (
          <div style={{
            background: GREY_BG, borderRadius: 4, padding: "6px 10px", marginTop: 8,
            display: "flex", alignItems: "center", gap: 6, overflow: "hidden", fontSize: 14
          }}>
            <Icon name="message" color="gray" style={{ flexShrink: 0 }} />
            <span style={{ flexShrink: 0, color: "#000000e0" }}>{post.bestCommentUser}</span>
            <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: "#000000e0" }}>
              {post.bestComment}
            </span>
          </div>
        )}

        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 8 }}>
          {post.tags.map((t) => (
            <a key={t} href={`https://ai.codefather.cn/tag/${encodeURIComponent(t)}`} target="_blank" rel="noreferrer"
              style={{ fontSize: 14, color: "#898989", background: GREY_BG, borderRadius: 4, padding: "3px 8px", textDecoration: "none", lineHeight: 1.5 }}>
              {t}
            </a>
          ))}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 32, marginTop: 12 }}>
          <Action label="点赞" icon="like" count={post.likes + (liked ? 1 : 0)} active={liked} onClick={() => setLiked(v => !v)} />
          <Action label="评论" icon="message" count={post.comments} />
          <Action label="收藏" icon="star" count={post.favorites + (starred ? 1 : 0)} active={starred} onClick={() => setStarred(v => !v)} />
          <Action label="分享" icon="export" />
        </div>
      </div>
    </li>
  );
}

function SideCard({ title, extra, children }: { title: React.ReactNode; extra?: React.ReactNode; children: React.ReactNode }) {
  return (
    <section style={{ background: "#fff", borderRadius: 8, padding: 16, marginBottom: 8 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <h3 style={{ fontSize: 16, fontWeight: 600, margin: 0, color: "#000000e0" }}>{title}</h3>
        {extra}
      </div>
      {children}
    </section>
  );
}

function Sidebar() {
  return (
    <aside style={{ width: "25%", minWidth: 260, flexShrink: 0 }}>
      <SideCard title="推荐教程"
        extra={<a href="https://ai.codefather.cn/resource/learn" target="_blank" rel="noreferrer" style={{ fontSize: 14, color: BLUE, textDecoration: "none" }}>更多</a>}>
        {SIDE_TUTORIALS.map((t) => (
          <a key={t} href="https://ai.codefather.cn/resource/learn" target="_blank" rel="noreferrer"
            style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, fontSize: 14, color: "#000000e0", textDecoration: "none", padding: "8px 0", borderBottom: "1px solid #f5f5f5" }}>
            <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{t}</span>
            <Icon name="right" color="#999" />
          </a>
        ))}
      </SideCard>
      <SideCard title={<span>🌟 AI 资讯</span>}
        extra={<Link href="/news" style={{ fontSize: 14, color: BLUE, textDecoration: "none" }}>更多</Link>}>
        {SIDE_NEWS.map((n, i) => (
          <Link key={i} href="/news" style={{ display: "flex", gap: 8, alignItems: "flex-start", fontSize: 14, color: "#000000e0", textDecoration: "none", padding: "6px 0", lineHeight: 1.5 }}>
            <span style={{ color: BLUE, flexShrink: 0 }}>{i + 1}</span>
            <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{n}</span>
          </Link>
        ))}
      </SideCard>
      <section style={{ background: "#fff", borderRadius: 8, padding: 16, display: "flex", gap: 12, alignItems: "center" }}>
        <img src="/essay-covers/qrcode.webp" alt="程序员鱼皮公众号" style={{ width: 108, height: 108, objectFit: "cover", flexShrink: 0 }} />
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: "#000000e0", marginBottom: 6 }}>程序员鱼皮公众号</div>
          <div style={{ fontSize: 12, color: "#898989", lineHeight: 1.6 }}>扫码关注程序员鱼皮公众号，回复【编程资料】领取热门编程路线！</div>
        </div>
      </section>
    </aside>
  );
}

/** 分页：目标站 ul.ant-pagination-mini，右对齐，带上一页/下一页按钮 */
function Pagination() {
  const [page, setPage] = useState(1);
  return (
    <ul className="ant-pagination" aria-label="分页"
      style={{ marginTop: 14, textAlign: "right", display: "flex", justifyContent: "flex-end", gap: 6, listStyle: "none", padding: 0 }}>
      <li title="上一页" aria-disabled={page === 1} style={{ opacity: page === 1 ? 0.4 : 1 }}>
        <button type="button" disabled={page === 1} onClick={() => setPage(p => Math.max(1, p - 1))}
          style={{ background: "none", border: 0, cursor: "pointer", padding: 4 }}><Icon name="left" /></button>
      </li>
      {[1, 2, 3, 4, 5].map(n => (
        <li key={n} title={String(n)} style={{ minWidth: 32, height: 32, textAlign: "center", lineHeight: "32px" }}>
          <a href={`/essay?current=${n}`} onClick={(e) => { e.preventDefault(); setPage(n); }}
            style={{ display: "block", color: page === n ? BLUE : "#000000e0", fontWeight: page === n ? 500 : 400, textDecoration: "none", border: page === n ? `1px solid ${BLUE}` : "1px solid transparent", borderRadius: 6 }}>{n}</a>
        </li>
      ))}
      <li title="向后 5 页" style={{ minWidth: 32, height: 32, textAlign: "center", lineHeight: "32px" }}><a href="/essay?current=6" style={{ color: "#000000e0", textDecoration: "none" }}><Icon name="double-right" /></a></li>
      <li title="92" style={{ minWidth: 32, height: 32, textAlign: "center", lineHeight: "32px" }}><a href="/essay?current=92" style={{ color: "#000000e0", textDecoration: "none" }}>92</a></li>
      <li title="下一页">
        <button type="button" onClick={() => setPage(p => Math.min(92, p + 1))} style={{ background: "none", border: 0, cursor: "pointer", padding: 4 }}><Icon name="right" /></button>
      </li>
    </ul>
  );
}

export default function CommunityFeed() {
  const [tab, setTab] = useState("推荐");
  const [draft, setDraft] = useState("");
  const list = useMemo(() => {
    let arr = [...FEED_POSTS];
    if (tab === "精选") arr = arr.filter(p => p.favorites >= 4);
    else if (tab === "AI编程") arr = arr.filter(p => p.tags.includes("AI编程"));
    else if (tab === "AI智能体") arr = arr.filter(p => p.title.includes("Agent") || p.tags.includes("AI智能体"));
    else if (tab === "资源教程") arr = arr.filter(p => p.tags.includes("编程") && p.tags.includes("程序员"));
    else if (tab === "创意玩法") arr = arr.filter(p => p.tags.includes("AI工具"));
    else if (tab === "AI工具") arr = arr.filter(p => p.title.includes("工具") || p.tags.includes("AI工具"));
    return arr;
  }, [tab]);

  return (
    <main style={{ background: GREY_BG, minHeight: "100vh" }}>
      <article style={{ maxWidth: 1400, margin: "0 auto", padding: "16px 16px 32px", display: "flex", gap: 16, alignItems: "flex-start" }}>
        <div style={{ flex: 1, minWidth: 0, width: "75%" }}>
          {/* 顶部操作 + 发帖框 */}
          <div style={{ display: "flex", gap: 10, marginBottom: 12 }}>
            <button type="button" style={{ background: BLUE, color: "#fff", border: 0, borderRadius: 6, width: 74, height: 32, fontSize: 14, cursor: "pointer" }}>随便聊</button>
            <Link href="/essay/add" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", background: "#fff", color: "#000000e0", border: "1px solid #d9d9d9", borderRadius: 6, width: 74, height: 32, fontSize: 14, textDecoration: "none" }}>写文章</Link>
          </div>
          <div style={{ background: "#fff", borderRadius: 8, padding: "16px 16px 12px", marginBottom: 16 }}>
            <textarea value={draft} onChange={e => setDraft(e.target.value)}
              placeholder="点击这里，快来和大家讨论吧~"
              style={{ width: "100%", minHeight: 64, border: 0, outline: "none", resize: "none", fontSize: 14, color: "#000000e0", fontFamily: "inherit", background: "transparent" }} />
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 8 }}>
              <div style={{ display: "flex", gap: 16, color: "#000000e0", fontSize: 14 }}>
                <button type="button" style={{ background: "none", border: 0, cursor: "pointer", color: "inherit", fontSize: 14, display: "inline-flex", alignItems: "center", gap: 4 }}><Icon name="smile" /> 表情</button>
                <button type="button" style={{ background: "none", border: 0, cursor: "pointer", color: "inherit", fontSize: 14, display: "inline-flex", alignItems: "center", gap: 4 }}><Icon name="picture" /> 图片</button>
                <button type="button" style={{ background: "none", border: 0, cursor: "pointer", color: "inherit", fontSize: 14, display: "inline-flex", alignItems: "center", gap: 4 }}><Icon name="number" /> 关联话题</button>
              </div>
              <button type="button" style={{ background: BLUE, color: "#fff", border: 0, borderRadius: 9999, padding: "4px 20px", height: 29, fontSize: 14, cursor: "pointer" }}>发布</button>
            </div>
          </div>

          {/* tablist（ARIA 语义，目标站 role=tablist/tab） */}
          <div role="tablist" aria-orientation="horizontal"
            style={{ background: "#fff", borderRadius: "8px 8px 0 0", borderBottom: "1px solid #f0f0f0", display: "flex", gap: 24, padding: "14px 16px 0", marginBottom: 8 }}>
            {FEED_TABS.map((t, idx) => (
              <div key={t} role="tab" id={`rc-tabs-0-tab-${t}`} aria-selected={tab === t} aria-controls="rc-tabs-0-panel-1"
                tabIndex={0} onClick={() => setTab(t)}
                style={{ fontSize: 16, color: tab === t ? BLUE : "#000000e0", fontWeight: tab === t ? 500 : 400, cursor: "pointer", padding: "0 0 12px", borderBottom: tab === t ? `2px solid ${BLUE}` : "2px solid transparent" }}>
                {t}
              </div>
            ))}
          </div>

          {/* tabpanel > ul.ant-list-items > li */}
          <div role="tabpanel" id="rc-tabs-0-panel-1" aria-labelledby="rc-tabs-0-tab-推荐">
            <ul className="ant-list-items" style={{ margin: 0, padding: 0 }}>
              {list.map(p => <PostCard key={p.id} post={p} />)}
            </ul>
          </div>

          <Pagination />
        </div>
        <Sidebar />
      </article>
    </main>
  );
}
