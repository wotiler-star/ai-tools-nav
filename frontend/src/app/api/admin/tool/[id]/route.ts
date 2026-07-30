import { NextRequest, NextResponse } from "next/server";
import { removeToolMock } from "@/lib/mockData";

// DELETE /api/admin/tool/{id}
export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const ok = removeToolMock(Number(params.id));
  return NextResponse.json({ code: 0, data: ok, message: "ok" });
}
