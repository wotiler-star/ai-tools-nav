import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const updated = await prisma.post.update({
      where: { id },
      data: { likes: { increment: 1 } },
    });
    return NextResponse.json({ likes: updated.likes });
  } catch {
    return NextResponse.json({ likes: 1, mock: true });
  }
}
