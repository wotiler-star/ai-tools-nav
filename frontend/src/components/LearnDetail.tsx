import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LEARN_POSTS } from "@/lib/mockData";
import { SITE } from "@/config/site";

const BRAND = "#1777ff";

type Cat = "tutorial" | "course" | "wiki";

/** 每个分类的路由基路径、栏目名、详情面包屑文案 */
const CAT_META: Record<Cat, { base: string; label: string; crumb: string }> = {
  tutorial: { base: "/resource/learn", label: "AI 学习教程", crumb: "教程详情" },
  course: { base: "/resource/course", label: "AI 项目课程", crumb: "课程详情" },
  wiki: { base: "/resource/encyclopedia", label: "AI 知识百科", crumb: "百科详情" }
};

/** 依据标题生成一段结构化的正文（mock 站无真实正文数据源） */
function buildContent(title: string, source: string) {
  return [
    `本文由${SITE.owner}整理，来源：${source}。`,
    ``,
    `## 为什么值得学`,
    `很多人一开始接触 AI，都会卡在「不知道从哪下手」。这份《${title}》就是按「能立刻照着做」的思路整理的：每一步都给出可直接复用的操作与提示词，跟着走完就能拿到结果。`,
    ``,
    `## 你会学到什么`,
    `1. 如何把模糊需求拆成 AI 能理解的具体任务；`,
    `2. 如何用提示词约束输出格式，让结果稳定可复现；`,
    `3. 如何把一次性 Demo 变成能长期维护的小项目；`,
    `4. 常见坑位与排查思路，少走弯路。`,
    ``,
    `## 开始之前`,
    `准备一个 AI 编程工具（任选其一即可），一个空文件夹，以及 30 分钟不被打断的时间。不需要你预先掌握任何框架。`,
    ``,
    `## 实操步骤`,
    `**第一步：描述目标。** 用一句话说清楚你要什么，例如「做一个能批量重命名图片的小工具」。`,
    ``,
    `**第二步：补约束。** 告诉 AI 语言、运行环境、输入输出格式，约束越具体，返工越少。`,
    ``,
    `**第三步：小步验证。** 每让 AI 改一处就立刻运行一次，不要让改动堆积。`,
    ``,
    `**第四步：固化成果。** 把能跑通的版本提交到版本库，再继续加功能。`,
    ``,
    `## 小结`,
    `AI 编程真正的门槛不是「会不会写代码」，而是「能不能判断 AI 写得对不对」。把上面四步练熟，你会发现自己从「让 AI 帮我写」变成了「我知道该让 AI 写什么」。`
  ].join("\n");
}

/**
 * 工厂：为某一分类生成详情页的 generateStaticParams / generateMetadata / 页面组件。
 * 统一读取 LEARN_POSTS，保证列表与详情标题一致，并依据分类生成正确面包屑与路由。
 */
export function makeLearnDetail(category: Cat) {
  const meta = CAT_META[category];

  function generateStaticParams() {
    return LEARN_POSTS.filter((p) => p.category === category).map((p) => ({
      id: String(p.id)
    }));
  }

  async function generateMetadata({
    params
  }: {
    params: { id: string };
  }): Promise<Metadata> {
    const p = LEARN_POSTS.find(
      (x) => String(x.id) === params.id && x.category === category
    );
    if (!p) return { title: { absolute: `${meta.label}｜${SITE.name}` } };
    return {
      title: { absolute: `${p.title}｜${SITE.name}` },
      description: `${p.title}——${p.authorName}出品，${SITE.name} AI 学习资源。`,
      alternates: { canonical: `${meta.base}/${p.id}` },
      openGraph: {
        title: `${p.title}｜${SITE.name}`,
        description: `${p.title}——${p.authorName}出品。`,
        url: `${meta.base}/${p.id}`,
        type: "article"
      }
    };
  }

  function Page({ params }: { params: { id: string } }) {
    const p = LEARN_POSTS.find(
      (x) => String(x.id) === params.id && x.category === category
    );
    if (!p) notFound();

    const related = LEARN_POSTS.filter(
      (x) => x.category === category && x.id !== p.id
    ).slice(0, 6);
    // 优先用真实正文（wiki 的 desc / learn 的 content，数据已带）；无真实正文时回退通用模板
    const content =
      p.content && p.content.trim()
        ? p.content
        : buildContent(p.title, p.authorName);
    const words = content.replace(/\s/g, "").length;
    const readMin = Math.max(1, Math.round(words / 400));

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
          <Link href={meta.base} className="hover:text-[#1777ff]">
            {meta.label}
          </Link>
          <span>/</span>
          <span className="text-gray-600">{meta.crumb}</span>
        </nav>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* 正文 */}
          <article className="lg:col-span-2">
            <div className="rounded-2xl bg-white p-6 shadow-sm md:p-8">
              <h1 className="m-0 text-2xl font-bold leading-snug text-gray-900 md:text-3xl">
                {p.title}
              </h1>

              <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-gray-400">
                <span
                  className="rounded-full px-2.5 py-1 text-xs"
                  style={{ background: "var(--chip-bg)", color: BRAND }}
                >
                  {p.authorName}
                </span>
                <span>{(p.createTime || "").slice(0, 10)}</span>
                <span>·</span>
                <span>约 {readMin} 分钟读完</span>
              </div>

              {/* 封面（对标站文章详情带封面头图） */}
              {p.cover ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={p.cover}
                  alt={p.title}
                  className="mt-6 w-full rounded-xl object-cover"
                  style={{ maxHeight: 360 }}
                />
              ) : null}

              <div className="mt-6 space-y-4 text-[15px] leading-8 text-gray-700">
                {content.split("\n").map((line, i) => {
                  if (!line.trim()) return <div key={i} className="h-2" />;
                  if (line.startsWith("## ")) {
                    return (
                      <h2
                        key={i}
                        className="m-0 mt-6 text-lg font-bold text-gray-900"
                      >
                        {line.replace("## ", "")}
                      </h2>
                    );
                  }
                  if (line.startsWith("**") && line.endsWith("**")) {
                    return (
                      <p key={i} className="m-0 font-semibold text-gray-900">
                        {line.replace(/\*\*/g, "")}
                      </p>
                    );
                  }
                  if (/^\d+\.\s/.test(line)) {
                    return (
                      <p key={i} className="m-0 pl-1">
                        {line}
                      </p>
                    );
                  }
                  return (
                    <p key={i} className="m-0">
                      {line}
                    </p>
                  );
                })}
              </div>

              <div className="mt-8 flex flex-wrap gap-3 border-t border-gray-100 pt-6">
                <Link href={meta.base} className="brand-btn-ghost">
                  返回列表
                </Link>
                <Link href="/tool" className="brand-btn">
                  去找 AI 工具
                </Link>
              </div>
            </div>
          </article>

          {/* 右侧：相关 */}
          <aside className="lg:col-span-1">
            <div className="rounded-2xl bg-white p-5 shadow-sm">
              <div className="mb-3 flex items-center justify-between">
                <div className="font-semibold text-gray-900">相关推荐</div>
                <Link
                  href={meta.base}
                  className="text-xs text-gray-400 hover:text-[#1777ff]"
                >
                  查看全部
                </Link>
              </div>
              <ul className="m-0 list-none space-y-3 p-0">
                {related.map((r) => (
                  <li key={r.id}>
                    <Link
                      href={`${meta.base}/${r.id}`}
                      className="group flex gap-3 rounded-lg p-1 transition hover:bg-[var(--list-row-hover)]"
                    >
                      <span
                        className="flex h-12 w-16 flex-shrink-0 items-center justify-center overflow-hidden rounded-lg"
                        style={{ background: "var(--tint-blue)" }}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        {r.cover ? (
                          <img
                            src={r.cover}
                            alt={r.title}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <span className="text-lg">📘</span>
                        )}
                      </span>
                      <span className="line-clamp-2 text-sm text-gray-700 hover-brand-title">
                        {r.title}
                      </span>
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

  return { generateStaticParams, generateMetadata, Page };
}
