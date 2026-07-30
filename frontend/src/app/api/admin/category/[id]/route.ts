import { NextRequest, NextResponse } from "next/server";
import { removeCategoryMock } from "@/lib/mockData";

// DELETE /api/admin/category/{id}
export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const ok = removeCategoryMock(Number(params.id));
  return NextResponse.json({ code: 0, data: ok, message: "ok" });
}
