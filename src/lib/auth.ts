import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import GitHub from "next-auth/providers/github";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const CredentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

const providers: any[] = [
  Credentials({
    name: "密码登录",
    credentials: {
      email: { label: "邮箱", type: "email" },
      password: { label: "密码", type: "password" },
    },
    async authorize(raw) {
      const parsed = CredentialsSchema.safeParse(raw);
      if (!parsed.success) return null;

      const user = await prisma.user.findUnique({
        where: { email: parsed.data.email },
      });
      if (!user?.passwordHash) return null;

      const ok = await bcrypt.compare(parsed.data.password, user.passwordHash);
      if (!ok) return null;

      return {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        image: user.avatar ?? user.image ?? undefined,
      };
    },
  }),
];

// GitHub OAuth：仅在配置了 AUTH_GITHUB_ID / AUTH_GITHUB_SECRET 时启用
if (process.env.AUTH_GITHUB_ID && process.env.AUTH_GITHUB_SECRET) {
  providers.push(
    GitHub({
      // 允许将 GitHub 账号与同邮箱的已有账号关联
      allowDangerousEmailAccountLinking: true,
    })
  );
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  // 自托管（1Panel / Coolify / 反代）下从请求头推导可信 host，避免回调地址错误
  trustHost: true,
  session: { strategy: "jwt" },
  secret: process.env.AUTH_SECRET,
  pages: { signIn: "/login" },
  providers,
  callbacks: {
    async jwt({ token, user, account, profile }) {
      // 凭据登录：直接取 DB 用户 id / role
      if (user) {
        token.id = (user as { id: string }).id;
        token.role = (user as { role?: string }).role;
      }
      // GitHub OAuth：按邮箱 find-or-create 关联 DB 用户，写入 id / role
      if (account?.provider === "github" && token.email) {
        const dbUser = await prisma.user.upsert({
          where: { email: token.email as string },
          update: {},
          create: {
            name: (profile as { name?: string })?.name ?? (token.email as string),
            email: token.email as string,
            image: (profile as { avatar_url?: string })?.avatar_url,
            role: "member",
          },
        });
        token.id = dbUser.id;
        token.role = dbUser.role;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
});
