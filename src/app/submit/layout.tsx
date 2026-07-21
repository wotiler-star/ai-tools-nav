import type { Metadata } from "next";

// /submit 及其子页面（含 client 组件页面）统一不索引
export const metadata: Metadata = {
  title: "提交内容",
  robots: { index: false, follow: false },
};

export default function SubmitLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
