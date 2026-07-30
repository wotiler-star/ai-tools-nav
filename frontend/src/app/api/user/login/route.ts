import { NextRequest, NextResponse } from "next/server";

/**
 * Mock 登录：任意账号密码即可登录（演示用）。
 * 真实后端由 Sa-Token 校验并下发 SESSION Cookie。
 * 账号为 "admin" 时返回管理员角色。
 */
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const userAccount = (body?.userAccount || "").trim();
  const userPassword = (body?.userPassword || "").trim();

  if (!userAccount || !userPassword) {
    return NextResponse.json({ code: 40000, data: null, message: "账号或密码为空" });
  }
  if (userPassword.length < 6) {
    return NextResponse.json({ code: 40000, data: null, message: "密码长度不能小于 6 位" });
  }

  const isAdmin = userAccount === "admin";
  const res = NextResponse.json({
    code: 0,
    message: "ok",
    data: {
      id: isAdmin ? 1 : 1001,
      userName: isAdmin ? "管理员" : userAccount,
      userAvatar: "",
      userRole: isAdmin ? "admin" : "user"
    }
  });
  // 模拟 Sa-Token 会话 Cookie
  res.cookies.set("satoken", `mock-${userAccount}-${Date.now()}`, {
    httpOnly: true,
    path: "/",
    maxAge: 60 * 60 * 24 * 7
  });
  return res;
}
