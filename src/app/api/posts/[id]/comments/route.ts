import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { CommentSchema } from "@/lib/validation";
import { moderate } from "@/lib/moderation";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "无效的请求体" }, { status: 400 });
  }

  const parsed = CommentSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "校验失败", issues: parsed.error.flatten() },
      { status: 422 }
    );
  }

  const m = moderate(parsed.data.content);
  if (!m.ok) {
    return NextResponse.json({ error: "评论含违规词", hit: m.hit }, { status: 403 });
  }

  const authed = !!req.headers.get("authorization");
  const status = !authed ? "PENDING" : "PUBLISHED";

  try {
    const created = await prisma.comment.create({
      data: {
        postId: id,
        content: m.clean,
        authorName: parsed.data.author,
        parentId: parsed.data.parentId ?? null,
        status,
      },
    });
    // 计数同步
    await prisma.post.update({
      where: { id },
      data: { comments: { increment: 1 } },
    });
    return NextResponse.json({ comment: created, status }, { status: 201 });
  } catch {
    const fallback = {
      id: `c-${Date.now()}`,
      postId: id,
      author: parsed.data.author,
      content: m.clean,
      createdAt: new Date().toISOString(),
      parentId: parsed.data.parentId ?? null,
      likes: 0,
      status,
    };
    return NextResponse.json({ comment: fallback, status, mock: true });
  }
}
