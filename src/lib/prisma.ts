import { PrismaClient } from "@prisma/client";
import path from "path";

// 将 standalone 部署场景的相对路径（file:./prisma/dev.db）按 cwd 解析为绝对路径，
// 避免 Prisma 以 schema 目录为基准把路径解析到 prisma/prisma/dev.db 而打不开库。
// 仅匹配含 prisma/ 的相对路径；开发期 .env 用 file:./dev.db（Prisma 按 schema 目录解析），不受影响。
let databaseUrl = process.env.DATABASE_URL;
if (databaseUrl && databaseUrl.startsWith("file:./prisma/")) {
  const rel = databaseUrl.slice("file:./prisma/".length);
  const abs = path.resolve(process.cwd(), "prisma", rel);
  databaseUrl = "file:" + abs;
  process.env.DATABASE_URL = databaseUrl;
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient(
    databaseUrl ? { datasources: { db: { url: databaseUrl } } } : undefined
  );

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
