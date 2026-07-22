"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { signOut } from "@/lib/auth";
import { requireAdmin } from "@/lib/auth-helpers";

function parseTags(raw: string): string {
  return JSON.stringify(
    raw
      .split(/[,，]/)
      .map((t) => t.trim())
      .filter(Boolean)
  );
}

export async function createTool(formData: FormData) {
  await requireAdmin();
  const name = String(formData.get("name") || "").trim();
  const slug = String(formData.get("slug") || "").trim();
  const summary = String(formData.get("summary") || "").trim();
  const url = String(formData.get("url") || "").trim();
  const categoryId = String(formData.get("categoryId") || "").trim();
  const tags = parseTags(String(formData.get("tags") || ""));
  const featured = formData.get("featured") === "on";
  const description = String(formData.get("description") || "").trim() || null;

  if (!name || !slug || !url || !categoryId) {
    throw new Error("名称、slug、链接、分类为必填项");
  }

  await prisma.tool.create({
    data: { name, slug, summary, url, categoryId, tags, featured, description },
  });
  revalidatePath("/admin/tools");
  revalidatePath("/");
}

export async function updateTool(id: string, formData: FormData) {
  await requireAdmin();
  const name = String(formData.get("name") || "").trim();
  const summary = String(formData.get("summary") || "").trim();
  const url = String(formData.get("url") || "").trim();
  const categoryId = String(formData.get("categoryId") || "").trim();
  const tags = parseTags(String(formData.get("tags") || ""));
  const featured = formData.get("featured") === "on";
  const description = String(formData.get("description") || "").trim() || null;

  await prisma.tool.update({
    where: { id },
    data: { name, summary, url, categoryId, tags, featured, description },
  });
  revalidatePath("/admin/tools");
  revalidatePath("/");
}

export async function deleteTool(id: string) {
  await requireAdmin();
  await prisma.tool.delete({ where: { id } });
  revalidatePath("/admin/tools");
  revalidatePath("/");
}

export async function toggleFeatured(id: string) {
  await requireAdmin();
  const tool = await prisma.tool.findUnique({ where: { id } });
  if (tool) {
    await prisma.tool.update({
      where: { id },
      data: { featured: !tool.featured },
    });
  }
  revalidatePath("/admin/tools");
  revalidatePath("/");
}

// ===== 工具审核（用户提交） =====
export async function approveTool(id: string) {
  await requireAdmin();
  await prisma.tool.update({ where: { id }, data: { status: "PUBLISHED" } });
  revalidatePath("/admin/tools");
  revalidatePath("/tools");
  revalidatePath("/");
}

export async function rejectTool(id: string) {
  await requireAdmin();
  await prisma.tool.update({ where: { id }, data: { status: "REJECTED" } });
  revalidatePath("/admin/tools");
}

export async function approvePost(id: string) {
  await requireAdmin();
  await prisma.post.update({ where: { id }, data: { status: "PUBLISHED" } });
  revalidatePath("/admin/posts");
  revalidatePath("/community");
}

export async function rejectPost(id: string) {
  await requireAdmin();
  await prisma.post.update({ where: { id }, data: { status: "REJECTED" } });
  revalidatePath("/admin/posts");
  revalidatePath("/community");
}

export async function deletePrompt(id: string) {
  await requireAdmin();
  await prisma.prompt.delete({ where: { id } });
  revalidatePath("/admin/prompts");
  revalidatePath("/community");
}

// ===== MCP 服务管理 =====
export async function approveMcp(id: string) {
  await requireAdmin();
  await prisma.mcpServer.update({ where: { id }, data: { status: "PUBLISHED" } });
  revalidatePath("/admin/mcp");
  revalidatePath("/mcp");
}

export async function rejectMcp(id: string) {
  await requireAdmin();
  await prisma.mcpServer.update({ where: { id }, data: { status: "REJECTED" } });
  revalidatePath("/admin/mcp");
  revalidatePath("/mcp");
}

export async function deleteMcp(id: string) {
  await requireAdmin();
  await prisma.mcpServer.delete({ where: { id } });
  revalidatePath("/admin/mcp");
  revalidatePath("/mcp");
}

export async function toggleMcpFeatured(id: string) {
  await requireAdmin();
  const s = await prisma.mcpServer.findUnique({ where: { id } });
  if (s) {
    await prisma.mcpServer.update({ where: { id }, data: { featured: !s.featured } });
  }
  revalidatePath("/admin/mcp");
  revalidatePath("/mcp");
}

// ===== Skills 技能管理 =====
export async function approveSkill(id: string) {
  await requireAdmin();
  await prisma.skill.update({ where: { id }, data: { status: "PUBLISHED" } });
  revalidatePath("/admin/skills");
  revalidatePath("/skills");
}

export async function rejectSkill(id: string) {
  await requireAdmin();
  await prisma.skill.update({ where: { id }, data: { status: "REJECTED" } });
  revalidatePath("/admin/skills");
  revalidatePath("/skills");
}

export async function deleteSkill(id: string) {
  await requireAdmin();
  await prisma.skill.delete({ where: { id } });
  revalidatePath("/admin/skills");
  revalidatePath("/skills");
}

export async function toggleSkillFeatured(id: string) {
  await requireAdmin();
  const s = await prisma.skill.findUnique({ where: { id } });
  if (s) {
    await prisma.skill.update({ where: { id }, data: { featured: !s.featured } });
  }
  revalidatePath("/admin/skills");
  revalidatePath("/skills");
}

export async function adminSignOut() {
  await signOut({ redirectTo: "/" });
}
