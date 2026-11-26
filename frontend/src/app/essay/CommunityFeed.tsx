"use client";

// /essay 社区信息流 1:1 复刻自目标站 https://ai.codefather.cn/essay
// 证据：Temp/craft_essay_capture/（craft-anything 2026-11-25 抓取）
// 颗粒度对齐（AX + DOM 实测）：article/aside/tablist/tab/tabpanel、h1×13、ul/li 列表、
//   antd SVG 图标、分级等级图标、VIP 条件渲染、精选角标、右对齐分页、footer。
import { useState } from "react";
import Link from "next/link";
import { SIDE_TUTORIALS, SIDE_NEWS, FEED_TABS, type FeedPost } from "@/lib/essayFeedData";
import { ICON_PATHS } from "@/lib/essayIcons";

// 2026-11-26 改造：数据与分页由服务端提供（page.tsx 读 data/essay-feed.json 真分页），
// tab / 分页均为真实链接（/essay?tab=X、/essay?current=N），与目标站 URL 形态一致。

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
      <a href="/essay" aria-label={post.author} style={{ display: "flex" }}>
        <Avatar post={post} size={40} />
      </a>
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          <a href="/essay" style={{ color: "#000", fontSize: 16, textDecoration: "none" }}>
            {post.author}
          </a>
          <span title="等级">
            <img src={levelSrc} alt="等级" style={{ width: 32, height: 17 }} />
          </span>
          {post.vip && <span title="VIP"><img src="/essay-covers/vip.86643c96.svg" alt="vip" style={{ width: 14, height: 16 }} /></span>}
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
      <div className="ant-list-item ant-list-item-no-flex post-card-item post-item" style={{ background: "#fff", borderRadius: 8, padding: 12, boxShadow: "rgba(0,0,0,0.05) 0px 1px 3px 0px" }}>
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
          <div className="best-comment" style={{
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
            <a key={t} href={`/essay?tag=${encodeURIComponent(t)}`}
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
        extra={<Link href="/resource/learn" style={{ fontSize: 14, color: BLUE, textDecoration: "none" }}>更多</Link>}>
        {SIDE_TUTORIALS.map((t) => (
          <Link key={t} href="/resource/learn"
            style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, fontSize: 14, color: "#000000e0", textDecoration: "none", padding: "8px 0", borderBottom: "1px solid #f5f5f5" }}>
            <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{t}</span>
            <Icon name="right" color="#999" />
          </Link>
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

/** 分页：目标站 ul.ant-pagination-mini，右对齐，带上一页/下一页按钮；真实链接 /essay?current=N */
function Pagination({ page, totalPages, activeTab }: { page: number; totalPages: number; activeTab: string }) {
  const tabQ = activeTab !== "推荐" ? `&tab=${encodeURIComponent(activeTab)}` : "";
  const href = (n: number) => `/essay?current=${n}${tabQ}`;
  // 目标站页 1 显示 1..5 + 向后 5 页 + 末页；翻到后面时显示当前页附近窗口
  const windowStart = page <= 5 ? 1 : Math.min(Math.max(1, page - 2), Math.max(1, totalPages - 4));
  const windowPages = Array.from({ length: Math.min(5, totalPages) }, (_, i) => windowStart + i).filter(n => n <= totalPages);
  return (
    <ul className="ant-pagination" aria-label="分页"
      style={{ marginTop: 14, textAlign: "right", display: "flex", justifyContent: "flex-end", gap: 6, listStyle: "none", padding: 0 }}>
      <li title="上一页" aria-disabled={page === 1} style={{ opacity: page === 1 ? 0.4 : 1 }}>
        {page === 1 ? (
          <span style={{ display: "inline-block", padding: 4 }}><Icon name="left" /></span>
        ) : (
          <Link href={href(page - 1)} style={{ display: "inline-block", padding: 4 }}><Icon name="left" /></Link>
        )}
      </li>
      {windowPages.map(n => (
        <li key={n} title={String(n)} style={{ minWidth: 32, height: 32, textAlign: "center", lineHeight: "32px" }}>
          <Link href={href(n)}
            style={{ display: "block", color: page === n ? BLUE : "#000000e0", fontWeight: page === n ? 500 : 400, textDecoration: "none", border: page === n ? `1px solid ${BLUE}` : "1px solid transparent", borderRadius: 6 }}>{n}</Link>
        </li>
      ))}
      <li title="向后 5 页" style={{ minWidth: 32, height: 32, textAlign: "center", lineHeight: "32px" }}>
        <Link href={href(Math.min(totalPages, page + 5))} style={{ color: "#000000e0", textDecoration: "none" }}><Icon name="double-right" /></Link>
      </li>
      <li title={String(totalPages)} style={{ minWidth: 32, height: 32, textAlign: "center", lineHeight: "32px" }}>
        <Link href={href(totalPages)} style={{ color: "#000000e0", textDecoration: "none" }}>{totalPages}</Link>
      </li>
      <li title="下一页">
        {page >= totalPages ? (
          <span style={{ display: "inline-block", padding: 4 }}><Icon name="right" /></span>
        ) : (
          <Link href={href(page + 1)} style={{ display: "inline-block", padding: 4 }}><Icon name="right" /></Link>
        )}
      </li>
    </ul>
  );
}

export default function CommunityFeed({
  posts, page, totalPages, activeTab
}: {
  posts: FeedPost[]; page: number; totalPages: number; activeTab: string;
}) {
  const [draft, setDraft] = useState("");

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

          {/* tablist（ARIA 语义，目标站 role=tablist/tab）；真实链接 /essay?tab=X */}
          <div role="tablist" aria-orientation="horizontal"
            style={{ background: "#fff", borderRadius: "8px 8px 0 0", borderBottom: "1px solid #f0f0f0", display: "flex", gap: 24, padding: "14px 16px 0", marginBottom: 8 }}>
            {FEED_TABS.map((t) => (
              <Link key={t} role="tab" id={`rc-tabs-0-tab-${t}`} aria-selected={activeTab === t} aria-controls="rc-tabs-0-panel-1"
                href={t === "推荐" ? "/essay" : `/essay?tab=${encodeURIComponent(t)}`}
                style={{ fontSize: 16, color: activeTab === t ? BLUE : "#000000e0", fontWeight: activeTab === t ? 500 : 400, cursor: "pointer", padding: "0 0 12px", borderBottom: activeTab === t ? `2px solid ${BLUE}` : "2px solid transparent", textDecoration: "none" }}>
                {t}
              </Link>
            ))}
          </div>

          {/* tabpanel > ul.ant-list-items > li */}
          <div role="tabpanel" id="rc-tabs-0-panel-1" aria-labelledby="rc-tabs-0-tab-推荐">
            <ul className="ant-list-items" style={{ margin: 0, padding: 0 }}>
              {posts.map(p => <PostCard key={p.id} post={p} />)}
            </ul>
          </div>

          <Pagination page={page} totalPages={totalPages} activeTab={activeTab} />
        </div>
        <Sidebar />
      </article>
    </main>
  );
}
