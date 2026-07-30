import { NextResponse } from "next/server";

/** Mock 注销：清除 satoken Cookie。真实后端由 StpUtil.logout()。 */
export async function POST() {
  const res = NextResponse.json({ code: 0, message: "ok", data: true });
  res.cookies.set("satoken", "", { httpOnly: true, path: "/", maxAge: 0 });
  return res;
}
