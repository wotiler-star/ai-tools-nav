import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Skills",
  description:
    "发现让 AI 更好用的 Skills 技能包，按分类浏览可复用的 AI 工作流与能力扩展。",
  alternates: { canonical: "/skills" }
};

export default function SkillsLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
