import fs from "fs";
import path from "path";
import Link from "next/link";
import type { Metadata } from "next";
import { PAINTING_CASES, type PaintingCase } from "@/lib/paintingCases";
import { SITE } from "@/config/site";
import SafeCover from "@/components/SafeCover";
import TemplateDetailClient, { type PaintingDetail } from "./TemplateDetailClient";

const BRAND = "#1777ff";

// 详情正文在服务端 JSON（不进客户端 bundle、不参与静态生成）
type DetailMap = Record<string, PaintingDetail>;
let detailCache: DetailMap | null = null;
function getDetail(id: string): PaintingDetail {
  if (!detailCache) {
    try {
      const file = path.join(process.cwd(), "data", "painting-details.json");
      detailCache = JSON.parse(fs.readFileSync(file, "utf-8")) as DetailMap;
    } catch { detailCache = {}; }
  }
  return detailCache[id] || {};
}

function findCase(id: string): PaintingCase | undefined {
  return PAINTING_CASES.find((c) => c.id === id);
}

function relatedCases(item: PaintingCase, n = 8): PaintingCase[] {
  return PAINTING_CASES.filter((c) => c.id !== item.id)
    .map((c) => ({ c, score: c.tags.filter((t) => item.tags.includes(t)).length }))
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, n)
    .map((x) => x.c);
}

export function generateStaticParams() {
  return PAINTING_CASES.slice(0, 60).map((c) => ({ id: c.id }));
}
export const dynamicParams = true;

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const item = findCase(params.id);
  if (!item) return { title: { absolute: `模板未找到｜${SITE.name}` } };
  const desc = `${item.title}——${item.tags.map((t) => "#" + t).join(" ")}，适用 ${item.models.join(" / ") || "通用大模型"}。${item.description}`;
  return {
    title: { absolute: `${item.title} - AI绘图提示词模板｜${SITE.name}` },
    description: desc.slice(0, 160),
    keywords: [...item.tags, "AI绘图提示词", "AI绘图模板"].join(","),
    alternates: { canonical: `/painting/template/${item.id}` },
    openGraph: {
      title: `${item.title} - AI绘图提示词模板`,
      description: desc.slice(0, 160),
      url: `/painting/template/${item.id}`,
      type: "article"
    }
  };
}

export default function Page({ params }: { params: { id: string } }) {
  const item = findCase(params.id);
  if (!item) {
    return (
      <div className="container-1200 py-8" style={{ textAlign: "center", color: "#9ca3af", padding: 80 }}>
        模板不存在或已下线
        <div style={{ marginTop: 16 }}><Link href="/painting" style={{ color: BRAND }}>返回绘图提示词列表</Link></div>
      </div>
    );
  }
  const detail = getDetail(item.id);
  const related = relatedCases(item);

  return (
    <div className="container-1200 py-8">
      <nav aria-label="面包屑" className="mb-4 flex flex-wrap items-center gap-1 text-[13px] text-slate-400">
        <Link href="/" className="hover:text-blue-600">首页</Link>
        <span>/</span>
        <Link href="/painting" className="hover:text-blue-600">AI 绘图提示词</Link>
        <span>/</span>
        <span>{item.title}</span>
      </nav>

      <div className="mb-3 overflow-hidden rounded-2xl" style={{ background: "#f0f2f5", padding: 12, display: "flex", justifyContent: "center" }}>
        <div style={{ maxWidth: 240, maxHeight: 340 }}>
          <SafeCover src={item.cover} alt={item.title} className="w-full object-cover" style={{ maxHeight: 340 }} />
        </div>
      </div>
      <div style={{ fontSize: 12, color: "#94a3b8", marginBottom: 16, textAlign: "center" }}>模板效果示例 · 预览</div>

      <TemplateDetailClient item={item} detail={detail} />

      {related.length > 0 && (
        <div className="mt-6 rounded-2xl bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <div className="font-semibold text-slate-900">模板案例</div>
            <Link href="/painting" className="text-sm text-slate-400 hover:text-blue-600">查看全部 →</Link>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 14 }}>
            {related.map((r) => (
              <Link key={r.id} href={`/painting/template/${r.id}`} style={{ textDecoration: "none", background: "#fff", borderRadius: 12, overflow: "hidden", border: "1px solid #eaecef" }} className="hover-brand-lift">
                <div style={{ height: 120, overflow: "hidden", background: "#f5f6f8" }}>
                  <SafeCover src={r.cover} alt={r.title} className="h-full w-full object-cover" />
                </div>
                <div style={{ padding: 10 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#1f2937", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.title}</div>
                  <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 4 }}>{r.tags.slice(0, 3).map((t) => "#" + t).join(" · ")}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
