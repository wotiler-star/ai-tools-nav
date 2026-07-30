import { NextRequest, NextResponse } from "next/server";
import { updateToolMock } from "@/lib/mockData";

// PUT /api/admin/tool/update
export async function PUT(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  if (!body?.id) {
    return NextResponse.json({ code: 40000, data: null, message: "缺少工具 id" });
  }
  const ok = updateToolMock(body);
  return NextResponse.json({ code: 0, data: ok, message: "ok" });
}
