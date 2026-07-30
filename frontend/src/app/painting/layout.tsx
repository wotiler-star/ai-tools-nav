import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI 提示词",
  description:
    "精选 AI 绘画与文字提示词模板，涵盖 Midjourney、Stable Diffusion、ChatGPT 等，一键复制高质量 Prompt。",
  alternates: { canonical: "/painting" }
};

export default function PaintingLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
