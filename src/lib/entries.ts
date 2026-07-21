import { prisma } from "@/lib/prisma";
import { mcpServers, skills, mcpCategories, skillCategories } from "@/lib/mock-data";
import type { McpServer, Skill } from "@/lib/types";

type McpRow = {
  id: string;
  name: string;
  slug: string;
  summary: string;
  logo: string;
  category: string;
  tags: string;
  url: string;
  stars: number;
  installs: number;
  featured: boolean;
};

type SkillRow = {
  id: string;
  name: string;
  slug: string;
  summary: string;
  logo: string;
  category: string;
  tags: string;
  installCmd: string;
  author: string;
  uses: number;
  featured: boolean;
};

function parseTags(raw: string): string[] {
  try {
    const v = JSON.parse(raw);
    return Array.isArray(v) ? v.map(String) : [];
  } catch {
    return [];
  }
}

function mapMcp(r: McpRow): McpServer {
  return {
    id: r.id,
    name: r.name,
    slug: r.slug,
    summary: r.summary,
    logo: r.logo,
    category: r.category,
    tags: parseTags(r.tags),
    url: r.url,
    stars: r.stars,
    installs: r.installs,
    featured: r.featured,
  };
}

function mapSkill(r: SkillRow): Skill {
  return {
    id: r.id,
    name: r.name,
    slug: r.slug,
    summary: r.summary,
    logo: r.logo,
    category: r.category,
    tags: parseTags(r.tags),
    installCmd: r.installCmd,
    author: r.author,
    uses: r.uses,
    featured: r.featured,
  };
}

// 已发布 MCP 服务（首页/列表页数据源，数据库优先，失败降级 Mock）
export async function listMcpServers(): Promise<McpServer[]> {
  try {
    const rows = await prisma.mcpServer.findMany({
      where: { status: "PUBLISHED" },
      orderBy: [{ featured: "desc" }, { installs: "desc" }],
    });
    return rows.map(mapMcp);
  } catch {
    return mcpServers;
  }
}

export async function featuredMcpServers(limit = 6): Promise<McpServer[]> {
  try {
    const rows = await prisma.mcpServer.findMany({
      where: { status: "PUBLISHED", featured: true },
      orderBy: { installs: "desc" },
      take: limit,
    });
    if (rows.length > 0) return rows.map(mapMcp);
  } catch {
    /* 降级 */
  }
  return mcpServers.filter((m) => m.featured).slice(0, limit);
}

export async function getMcpCategories(): Promise<string[]> {
  try {
    const rows = await prisma.mcpServer.findMany({
      where: { status: "PUBLISHED" },
      select: { category: true },
      distinct: ["category"],
    });
    const cats = rows.map((r) => r.category);
    if (cats.length > 0) return cats;
  } catch {
    /* 降级 */
  }
  return mcpCategories.filter((c) => c !== "全部");
}

// 已发布 Skills（数据库优先，失败降级 Mock）
export async function listSkills(): Promise<Skill[]> {
  try {
    const rows = await prisma.skill.findMany({
      where: { status: "PUBLISHED" },
      orderBy: [{ featured: "desc" }, { uses: "desc" }],
    });
    return rows.map(mapSkill);
  } catch {
    return skills;
  }
}

export async function featuredSkills(limit = 6): Promise<Skill[]> {
  try {
    const rows = await prisma.skill.findMany({
      where: { status: "PUBLISHED", featured: true },
      orderBy: { uses: "desc" },
      take: limit,
    });
    if (rows.length > 0) return rows.map(mapSkill);
  } catch {
    /* 降级 */
  }
  return skills.filter((s) => s.featured).slice(0, limit);
}

export async function getSkillCategories(): Promise<string[]> {
  try {
    const rows = await prisma.skill.findMany({
      where: { status: "PUBLISHED" },
      select: { category: true },
      distinct: ["category"],
    });
    const cats = rows.map((r) => r.category);
    if (cats.length > 0) return cats;
  } catch {
    /* 降级 */
  }
  return skillCategories.filter((c) => c !== "全部");
}
