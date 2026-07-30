import { NextResponse } from "next/server";
import { CATEGORIES } from "@/lib/mockData";

// GET /api/category/list
export async function GET() {
  return NextResponse.json({ code: 0, data: CATEGORIES, message: "ok" });
}
