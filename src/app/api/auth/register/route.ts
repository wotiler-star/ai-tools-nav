import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

const schema = z.object({
  name: z.string().min(1, "昵称不能为空").max(30, "昵称过长"),
  email: z.string().email("邮箱格式不正确"),
  password: z.string().min(6, "密码至少 6 位").max(64, "密码过长"),
});

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ message: "请求格式错误" }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { message: parsed.error.issues[0]?.message ?? "参数不合法" },
      { status: 400 }
    );
  }

  const { name, email, password } = parsed.data;

  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) {
    return NextResponse.json({ message: "该邮箱已注册，请直接登录" }, { status: 409 });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  await prisma.user.create({
    data: { name, email, passwordHash, role: "member" },
  });

  return NextResponse.json({ ok: true });
}
