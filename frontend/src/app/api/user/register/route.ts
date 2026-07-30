import { NextRequest, NextResponse } from "next/server";

/** Mock 注册：校验后返回新用户 id（演示用）。 */
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const userAccount = (body?.userAccount || "").trim();
  const userPassword = (body?.userPassword || "").trim();
  const checkPassword = (body?.checkPassword || "").trim();

  if (!userAccount || !userPassword || !checkPassword) {
    return NextResponse.json({ code: 40000, data: null, message: "参数为空" });
  }
  if (userAccount.length < 4) {
    return NextResponse.json({ code: 40000, data: null, message: "账号长度不能小于 4 位" });
  }
  if (userPassword.length < 6) {
    return NextResponse.json({ code: 40000, data: null, message: "密码长度不能小于 6 位" });
  }
  if (userPassword !== checkPassword) {
    return NextResponse.json({ code: 40000, data: null, message: "两次输入的密码不一致" });
  }

  return NextResponse.json({ code: 0, message: "ok", data: Math.floor(Math.random() * 100000) + 1002 });
}
