import Link from "next/link";
import type { Metadata } from "next";
import { PROMPT_TEMPLATES } from "@/lib/mockData";
import { PAINTING_GALLERY } from "@/lib/paintingGallery";
import { SITE } from "@/config/site";
import CopyButton from "@/components/CopyButton";
import SafeCover from "@/components/SafeCover";

const BRAND = "#1777ff";

/** 依据模板标题/标签生成结构化英文提示词（对齐对标站的模板结构） */
function buildPrompt(title: string, tags: string[], kind: "draw" | "text") {
  if (kind === "text") {
    return [
      `You are an expert assistant specialized in ${tags.join(" / ")}.`,
      ``,
      `=== ROLE ===`,
      `${title}：请用专业、清晰、可执行的方式完成下面的任务。`,
      ``,
      `=== INPUT ===`,
      `[YOUR_INPUT]`,
      ``,
      `=== STEPS ===`,
      `1. Confirm the goal and constraints of [YOUR_INPUT].`,
      `2. Produce a structured result following the OUTPUT FORMAT below.`,
      `3. Self-check the result and fix any inconsistency before replying.`,
      ``,
      `=== OUTPUT FORMAT ===`,
      `- Summary: one sentence`,
      `- Details: bullet points, no more than 8 items`,
      `- Next actions: concrete and doable`,
      ``,
      `=== STYLE ===`,
      `${tags.map((t) => t).join(", ")}; concise, no filler words.`
    ].join("\n");
  }
  return [
    `${title} — ${tags.join(", ")} style visual, [ASPECT_RATIO], featuring [SUBJECT].`,
    ``,
    `=== TITLE ===`,
    `"[MAIN_TITLE]" in clean readable typography`,
    ``,
    `=== SCENE & LAYOUT ===`,
    `Layout: [LAYOUT_TYPE] (e.g., centered hero / split comparison / vertical step flow / circular lifecycle, based on the content logic)`,
    `Background: soft gradient from [COLOR_A] to [COLOR_B], minimal [DECORATIVE_ELEMENTS]`,
    ``,
    `=== MAIN CONTENT ===`,
    `[CONTENT_SECTION_1]`,
    `- [KEY_ELEMENT]`,
    `- [ACTION_OR_EXPRESSION]`,
    `Label: "[LABEL_TEXT]"`,
    ``,
    `=== KEY CONCEPTS ===`,
    `[NUMBER] floating info boxes with soft borders:`,
    `Box 1: "[CONCEPT_1]"`,
    `Box 2: "[CONCEPT_2]"`,
    ``,
    `=== STYLE ===`,
    `${tags.join(", ")}; consistent line art, clear visual hierarchy`,
    ``,
    `=== MOOD ===`,
    `[EMOTIONAL_TONE], [GOAL], polished and informative`,
    `Quality: high detail, well-balanced composition, [PURPOSE]`
  ].join("\n");
}

export function generateStaticParams() {
  return [...PROMPT_TEMPLATES, ...PAINTING_GALLERY].map((p) => ({ id: String(p.id) }));
}

export async function generateMetadata({
  params
}: {
  params: { id: string };
}): Promise<Metadata> {
  const gMeta = PAINTING_GALLERY.find((x) => x.id === params.id);
  if (gMeta) {
    return {
      title: { absolute: `${gMeta.title}｜AI 提示词模板｜${SITE.name}` },
      description: `${gMeta.title}——${gMeta.tags.map((x) => "#" + x).join(" ")}，${gMeta.viewNum} 浏览。`,
      alternates: { canonical: `/painting/template/${gMeta.id}` },
      openGraph: {
        title: `${gMeta.title}｜AI 提示词模板`,
        description: `${gMeta.title}——${gMeta.tags.map((x) => "#" + x).join(" ")}`,
        url: `/painting/template/${gMeta.id}`,
        type: "article"
      }
    };
  }
  const t = PROMPT_TEMPLATES.find((x) => String(x.id) === params.id);
  if (!t) return { title: { absolute: `AI 提示词模板｜${SITE.name}` } };
  return {
    title: { absolute: `${t.title}｜AI 提示词模板｜${SITE.name}` },
    description: `${t.title}——${t.tags.map((x) => "#" + x).join(" ")}，${t.useCount} 人已使用。`,
    alternates: { canonical: `/painting/template/${t.id}` },
    openGraph: {
      title: `${t.title}｜AI 提示词模板`,
      description: `${t.title}——${t.tags.map((x) => "#" + x).join(" ")}`,
      url: `/painting/template/${t.id}`,
      type: "article"
    }
  };
}

export default function Page({ params }: { params: { id: string } }) {
  // 后端提示词的 id 与静态模板 id 不一定一致，未命中时按 id 稳定兜底到某个模板，
  // 保证任意 /painting/template/{id} 都能正常渲染，不出现 404。
  const galleryItem = PAINTING_GALLERY.find((x) => x.id === params.id);
  const t =
    galleryItem
      ? { ...galleryItem, kind: "draw" as const, useCount: galleryItem.viewNum }
      : PROMPT_TEMPLATES.find((x) => String(x.id) === params.id) ||
        (() => {
          let h = 0;
          for (const ch of String(params.id)) h = (h * 31 + ch.charCodeAt(0)) % 360;
          return PROMPT_TEMPLATES[h % PROMPT_TEMPLATES.length];
        })();

  const prompt = buildPrompt(t.title, t.tags, t.kind);
  const source: (typeof PROMPT_TEMPLATES[number] | typeof PAINTING_GALLERY[number])[] =
    galleryItem ? PAINTING_GALLERY : PROMPT_TEMPLATES;
  const related = source.filter((x) => String(x.id) !== String(t.id)).slice(0, 6);

  return (
    <div className="container-1200 py-8">
      {/* 面包屑 */}
      <nav
        aria-label="面包屑"
        className="mb-5 flex flex-wrap items-center gap-1 text-sm text-gray-400"
      >
        <Link href="/" className="hover:text-[#1777ff]">
          首页
        </Link>
        <span>/</span>
        <Link href="/painting" className="hover:text-[#1777ff]">
          AI 提示词
        </Link>
        <span>/</span>
        <span className="text-gray-600">模板详情</span>
      </nav>

      {/* 封面横幅：模板含 cover 时展示，加载失败则隐藏（不破图） */}
      {t.cover && (
        <div className="mb-6 overflow-hidden rounded-2xl" style={{ height: 220 }}>
          <SafeCover
            src={t.cover}
            alt={t.title}
            className="h-full w-full object-cover"
          />
        </div>
      )}

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          {/* 标题 + 标签 */}
          <div className="rounded-2xl bg-white p-6 shadow-sm md:p-8">
            <div className="mb-3 flex items-center justify-between gap-3">
              <h1 className="m-0 text-2xl font-bold leading-snug text-gray-900 md:text-3xl">
                {t.title}
              </h1>
              <span className="flex-shrink-0 text-sm text-gray-400">分享</span>
            </div>

            <div className="mb-4 flex flex-wrap items-center gap-2 text-sm text-gray-500">
              <span>作者：</span>
              <span className="text-gray-800">{SITE.name}</span>
            </div>

            <div className="mb-6 flex flex-wrap gap-2">
              {t.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full px-2.5 py-1 text-xs"
                  style={{ background: "var(--chip-bg)", color: BRAND }}
                >
                  #{tag}
                </span>
              ))}
              <span
                className="rounded-full px-2.5 py-1 text-xs"
                style={{ background: "var(--chip-bg)", color: "#6b7280" }}
              >
                {t.kind === "draw" ? "绘图提示词" : "文字提示词"}
              </span>
            </div>

            {/* 提示词内容块 */}
            <div className="rounded-xl border border-gray-100 bg-gray-50/60">
              <div className="flex items-center justify-between border-b border-gray-100 px-4 py-2.5">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-gray-900">
                    提示词
                  </span>
                  <span className="text-xs text-gray-400">English</span>
                </div>
                <CopyButton text={prompt} />
              </div>
              <pre className="m-0 max-h-[420px] overflow-auto whitespace-pre-wrap break-words px-4 py-4 text-[13px] leading-6 text-gray-700">
                {prompt}
              </pre>
            </div>

            {/* 推荐模型 + 操作 */}
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <span className="text-sm text-gray-500">推荐模型</span>
              <span
                className="rounded-lg px-3 py-1.5 text-sm"
                style={{ background: "var(--chip-bg)", color: BRAND }}
              >
                {t.kind === "draw" ? "Nano Banana" : "通用大模型"}
              </span>
              <CopyButton text={prompt} label="生成我的提示词" primary />
            </div>
            <p className="mt-3 text-xs leading-relaxed text-gray-400">
              <span style={{ color: "#ff4d4f" }}>*</span>{" "}
              模板提示词中所有［］内的信息需要填写后，才是完整的提示词
            </p>

            {/* 模板案例 */}
            <div className="mt-8">
              <div className="mb-3 font-semibold text-gray-900">模板案例</div>
              {t.cover ? (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {[0, 1, 2, 3].map((n) => (
                    <div
                      key={n}
                      className="overflow-hidden rounded-xl"
                      style={{ aspectRatio: "1 / 1", background: "#f0f2f5" }}
                    >
                      <img
                        src={t.cover}
                        alt={t.title}
                        loading="lazy"
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          display: "block"
                        }}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {[4, 3, 2, 1].map((n) => (
                    <div
                      key={n}
                      className="flex aspect-square items-center justify-center rounded-xl text-2xl"
                      style={{
                        background:
                          t.kind === "draw" ? "var(--tint-pink)" : "var(--tint-blue)"
                      }}
                    >
                      {t.kind === "draw" ? "🎨" : "✍️"}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* 模板推荐 */}
          <div className="mt-6 rounded-2xl bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <div className="font-semibold text-gray-900">模板推荐</div>
              <Link
                href="/painting"
                className="text-sm text-gray-400 hover:text-[#1777ff]"
              >
                查看全部
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {related.map((r) => (
                <Link
                  key={r.id}
                  href={`/painting/template/${r.id}`}
                  className="group hover-brand-lift flex items-center gap-3 rounded-xl bg-white p-3 shadow-sm"
                >
                  <span
                    className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-lg text-xl"
                    style={{
                      background:
                        r.kind === "draw" ? "var(--tint-pink)" : "var(--tint-blue)"
                    }}
                  >
                    {r.kind === "draw" ? "🎨" : "✍️"}
                  </span>
                  <span className="min-w-0">
                    <span className="line-clamp-1 block text-sm font-medium text-gray-900 hover-brand-title">
                      {r.title}
                    </span>
                    <span className="mt-1 block text-xs text-gray-400">
                      {r.useCount} 人使用
                    </span>
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* 右侧：热门模板 */}
        <aside className="lg:col-span-1">
          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <div className="mb-3 font-semibold text-gray-900">热门模板</div>
            <ul className="m-0 list-none space-y-3 p-0">
              {[...source]
                .sort((a, b) => b.useCount - a.useCount)
                .slice(0, 8)
                .map((r, i) => (
                  <li key={r.id}>
                    <Link
                      href={`/painting/template/${r.id}`}
                      className="flex items-center gap-2 text-sm text-gray-700 hover:text-[#1777ff]"
                    >
                      <span
                        className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded text-xs font-bold text-white"
                        style={{ background: i < 3 ? "#ff4d4f" : "#c9cdd4" }}
                      >
                        {i + 1}
                      </span>
                      <span className="line-clamp-1">{r.title}</span>
                    </Link>
                  </li>
                ))}
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}
