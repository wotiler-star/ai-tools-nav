import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { PostSchema } from "@/lib/validation";
import { moderate, isNewUser } from "@/lib/moderation";
import { posts as mockPosts } from "@/lib/mock-data";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const tab = searchParams.get("tab") ?? "latest";
  const q = searchParams.get("q")?.trim();

  try {
    const where = q ? { title: { contains: q } } : {};
    const dbPosts = await prisma.post.findMany({
      where,
      orderBy:
        tab === "hot" ? { likes: "desc" } : { createdAt: "desc" },
      take: 50,
    });
    return NextResponse.json({ posts: dbPosts });
  } catch {
    // 数据库未连接时降级到 Mock 数据
    let list = [...mockPosts];
    if (q) list = list.filter((p) => p.title.includes(q) || p.content.includes(q));
    if (tab === "hot") list.sort((a, b) => b.likes - a.likes);
    return NextResponse.json({ posts: list, mock: true });
  }
}

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "无效的请求体" }, { status: 400 });
  }

  const parsed = PostSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "校验失败", issues: parsed.error.flatten() },
      { status: 422 }
    );
  }

  // 内容审核
  const text = `${parsed.data.title}\n${parsed.data.content}`;
  const m = moderate(text);
  if (!m.ok) {
    return NextResponse.json(
      { error: "内容包含违规词，请修改后重试", hit: m.hit },
      { status: 403 }
    );
  }

  // 真实会话：登录用户可发帖；新注册用户首帖进入待审核
  const session = await auth();
  const authed = !!session?.user;
  const status = isNewUser(authed) ? "PENDING" : "PUBLISHED";

  const title = parsed.data.title;
  const content = m.clean;
  const type = parsed.data.type;
  const tags = parsed.data.tags;
  const authorName = session?.user?.name ?? "游客";
  const authorId = session?.user?.id;

  try {
    const created = await prisma.post.create({
      data: { title, content, type, tags: JSON.stringify(tags), status, authorName, authorId },
    });
    return NextResponse.json({ post: created, status }, { status: 201 });
  } catch {
    // 降级：返回构造的帖子，保证前端交互可用
    const fallback = {
      id: `local-${Date.now()}`,
      title,
      content,
      author: authorName,
      authorAvatar: "🙂",
      createdAt: new Date().toISOString(),
      type,
      tags,
      likes: 0,
      comments: 0,
      views: 0,
      status,
    };
    return NextResponse.json({ post: fallback, status, mock: true });
  }
}
