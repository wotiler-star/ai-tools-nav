"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(1, "昵称不能为空").max(30, "昵称过长"),
  bio: z.string().max(200, "简介过长").optional().default(""),
  avatar: z
    .string()
    .url("头像地址不合法")
    .optional()
    .or(z.literal(""))
    .default(""),
});

export async function updateProfile(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) {
    return { ok: false, message: "请先登录" };
  }

  const parsed = schema.safeParse({
    name: formData.get("name"),
    bio: formData.get("bio") ?? "",
    avatar: formData.get("avatar") ?? "",
  });
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? "参数不合法" };
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      name: parsed.data.name,
      bio: parsed.data.bio,
      avatar: parsed.data.avatar || null,
    },
  });

  return { ok: true as const };
}
