import { NextRequest, NextResponse } from "next/server";
import { addToolMock } from "@/lib/mockData";

// POST /api/admin/tool/add
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  if (!body?.name) {
    return NextResponse.json({ code: 40000, data: null, message: "工具名称不能为空" });
  }
  const id = addToolMock(body);
  return NextResponse.json({ code: 0, data: id, message: "ok" });
}
