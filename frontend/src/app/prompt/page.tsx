import { redirect } from "next/navigation";

/** AI 提示词已对齐真站路由 /painting，此处做永久重定向 */
export default function PromptRedirect() {
  redirect("/painting");
}
