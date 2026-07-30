import { redirect } from "next/navigation";

/** 社区已对齐真站路由 /essay，此处做永久重定向 */
export default function CommunityRedirect() {
  redirect("/essay");
}
