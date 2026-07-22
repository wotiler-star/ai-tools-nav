"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-helpers";

function parseTags(raw: string): string {
  return JSON.stringify(
    raw
      .split(/[,，]/)
      .map((t) => t.trim())
      .filter(Boolean)
  );
}

function slugify(title: string): string {
  const base = title
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w一-龥-]/g, "")
    .slice(0, 60);
  return base || `news-${Date.now()}`;
}

export async function createNews(formData: FormData) {
  await requireAdmin();
  const title = String(formData.get("title") || "").trim();
  if (!title) throw new Error("标题为必填项");

  const summary = String(formData.get("summary") || "").trim();
  const content = String(formData.get("content") || "").trim();
  const source = String(formData.get("source") || "AI 导航").trim();
  const sourceUrlRaw = String(formData.get("sourceUrl") || "").trim();
  const cover = String(formData.get("cover") || "").trim();
  const slugRaw = String(formData.get("slug") || "").trim();
  const tags = parseTags(String(formData.get("tags") || ""));
  const published = formData.get("published") === "on";

  const slug = slugRaw || slugify(title);

  await prisma.news.create({
    data: {
      title,
      slug,
      summary,
      content,
      source,
      sourceUrl: sourceUrlRaw || null,
      cover: cover || null,
      tags,
      published,
      publishedAt: new Date(),
      authorName: "AI 导航",
    },
  });

  revalidatePath("/admin/news");
  revalidatePath("/news");
  revalidatePath("/");
  redirect("/admin/news");
}

export async function updateNews(id: string, formData: FormData) {
  await requireAdmin();
  const title = String(formData.get("title") || "").trim();
  if (!title) throw new Error("标题为必填项");

  const summary = String(formData.get("summary") || "").trim();
  const content = String(formData.get("content") || "").trim();
  const source = String(formData.get("source") || "AI 导航").trim();
  const sourceUrlRaw = String(formData.get("sourceUrl") || "").trim();
  const cover = String(formData.get("cover") || "").trim();
  const slugRaw = String(formData.get("slug") || "").trim();
  const tags = parseTags(String(formData.get("tags") || ""));
  const published = formData.get("published") === "on";

  const slug = slugRaw || slugify(title);

  await prisma.news.update({
    where: { id },
    data: {
      title,
      slug,
      summary,
      content,
      source,
      sourceUrl: sourceUrlRaw || null,
      cover: cover || null,
      tags,
      published,
    },
  });

  revalidatePath("/admin/news");
  revalidatePath("/news");
  revalidatePath(`/news/${id}`);
  revalidatePath("/");
  redirect("/admin/news");
}

export async function deleteNews(id: string) {
  await requireAdmin();
  await prisma.news.delete({ where: { id } });
  revalidatePath("/admin/news");
  revalidatePath("/news");
  revalidatePath("/");
}

export async function togglePublishNews(id: string) {
  await requireAdmin();
  const n = await prisma.news.findUnique({ where: { id } });
  if (n) {
    await prisma.news.update({
      where: { id },
      data: { published: !n.published },
    });
  }
  revalidatePath("/admin/news");
  revalidatePath("/news");
  revalidatePath("/");
}
