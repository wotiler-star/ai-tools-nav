import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

// 后台访问守卫：未登录或非管理员一律跳登录页
export async function requireAdmin() {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") {
    redirect("/login");
  }
  return session;
}
