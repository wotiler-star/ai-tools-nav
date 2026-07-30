import { NextRequest, NextResponse } from "next/server";

/**
 * Mock 获取当前登录用户：读取 satoken Cookie 判断登录态。
 * 真实后端由 Sa-Token StpUtil.getLoginIdAsLong() 获取。
 */
export async function GET(req: NextRequest) {
  const token = req.cookies.get("satoken")?.value;
  if (!token) {
    return NextResponse.json({ code: 40100, data: null, message: "未登录" });
  }
  // token 形如 mock-<account>-<ts>
  const account = token.split("-")[1] || "user";
  const isAdmin = account === "admin";
  return NextResponse.json({
    code: 0,
    message: "ok",
    data: {
      id: isAdmin ? 1 : 1001,
      userName: isAdmin ? "管理员" : account,
      userAvatar: "",
      userRole: isAdmin ? "admin" : "user"
    }
  });
}
