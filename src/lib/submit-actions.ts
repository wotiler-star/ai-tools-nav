"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { McpSchema, SkillSchema } from "@/lib/validation";
import { moderate } from "@/lib/moderation";

export type SubmitState = { error?: string };

function slugify(input: string): string {
  const base = input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
  const rand = Math.random().toString(36).slice(2, 6);
  return `${base || "item"}-${rand}`;
}

function parseTags(raw: string | undefined): string {
  if (!raw) return "[]";
  const arr = raw
    .split(/[,，]/)
    .map((t) => t.trim())
    .filter(Boolean)
    .slice(0, 8);
  return JSON.stringify(arr);
}

export async function submitMcp(_prev: SubmitState, formData: FormData): Promise<SubmitState> {
  const parsed = McpSchema.safeParse({
    name: String(formData.get("name") || "").trim(),
    summary: String(formData.get("summary") || "").trim(),
    url: String(formData.get("url") || "").trim(),
    category: String(formData.get("category") || "").trim(),
    logo: String(formData.get("logo") || "").trim() || undefined,
    tags: String(formData.get("tags") || "").trim() || undefined,
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "表单校验失败" };
  }

  const m = moderate(`${parsed.data.name}\n${parsed.data.summary}`);
  if (!m.ok) {
    return { error: "内容包含违规词，请修改后重试" };
  }

  await prisma.mcpServer.create({
    data: {
      name: parsed.data.name,
      slug: slugify(parsed.data.name),
      summary: m.clean,
      url: parsed.data.url,
      category: parsed.data.category,
      logo: parsed.data.logo ?? "🔌",
      tags: parseTags(parsed.data.tags),
      stars: 0,
      installs: 0,
      featured: false,
      status: "PENDING",
    },
  });

  revalidatePath("/mcp");
  redirect("/mcp?submitted=1");
}

export async function submitSkill(_prev: SubmitState, formData: FormData): Promise<SubmitState> {
  const parsed = SkillSchema.safeParse({
    name: String(formData.get("name") || "").trim(),
    summary: String(formData.get("summary") || "").trim(),
    category: String(formData.get("category") || "").trim(),
    installCmd: String(formData.get("installCmd") || "").trim(),
    author: String(formData.get("author") || "").trim() || undefined,
    logo: String(formData.get("logo") || "").trim() || undefined,
    tags: String(formData.get("tags") || "").trim() || undefined,
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "表单校验失败" };
  }

  const m = moderate(`${parsed.data.name}\n${parsed.data.summary}`);
  if (!m.ok) {
    return { error: "内容包含违规词，请修改后重试" };
  }

  await prisma.skill.create({
    data: {
      name: parsed.data.name,
      slug: slugify(parsed.data.name),
      summary: m.clean,
      category: parsed.data.category,
      installCmd: parsed.data.installCmd,
      author: parsed.data.author ?? "AI 导航",
      logo: parsed.data.logo ?? "🧩",
      tags: parseTags(parsed.data.tags),
      uses: 0,
      featured: false,
      status: "PENDING",
    },
  });

  revalidatePath("/skills");
  redirect("/skills?submitted=1");
}
