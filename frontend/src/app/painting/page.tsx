// /painting 1:1 对齐目标站 ai.codefather.cn/painting（craft-anything Study 2026-11-20）：
// 目标站是「AI 绘图案例/模板」库（精选/最新 + 类型 + 模型 + 场景 多级筛选），
// 旧实现用后端文字提示词（小说文案），与目标站不符。改用采集到的真实绘图案例组件。
import PaintingCasesGallery from "./PaintingCasesGallery";

export const metadata = {
  title: "AI绘图提示词模板大全 - NanoBanana/SD/Midjourney提示词库 | toolly",
  description: "精选 AI 绘图提示词模板和案例，复制即可使用"
};

export default function PaintingPage() {
  return <PaintingCasesGallery />;
}
