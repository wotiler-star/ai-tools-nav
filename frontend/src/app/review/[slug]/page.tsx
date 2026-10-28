import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Markdown from "@/components/Markdown";
import { REVIEWS, getAllReviewSlugs, getReviewBySlug } from "@/lib/reviews";
import { SITE } from "@/config/site";

/** 预渲染全部原创文章 */
export function generateStaticParams() {
  return getAllReviewSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const r = getReviewBySlug(params.slug);
  if (!r) return { title: { absolute: `原创评测｜${SITE.name}` } };
  return {
    title: { absolute: `${r.title}｜${SITE.name}` },
    description: r.summary,
    alternates: { canonical: `/review/${r.slug}` },
    openGraph: {
      type: "article",
      title: `${r.title}｜${SITE.name}`,
      description: r.summary,
      url: `https://${SITE.domain}/review/${r.slug}`
    }
  };
}

export default function ReviewDetailPage({ params }: { params: { slug: string } }) {
  const r = getReviewBySlug(params.slug);
  if (!r) notFound();

  const related = REVIEWS.filter((x) => x.slug !== r.slug).slice(0, 3);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: r.title,
    description: r.summary,
    author: { "@type": "Person", name: r.author },
    datePublished: r.date,
    publisher: {
      "@type": "Organization",
      name: SITE.name,
      logo: { "@type": "ImageObject", url: `https://${SITE.domain}/logo.png` }
    },
    mainEntityOfPage: `https://${SITE.domain}/review/${r.slug}`
  };

  return (
    <div style={{ maxWidth: 820, margin: "0 auto", padding: "24px 20px" }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <nav
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          fontSize: 13,
          color: "var(--text-3)",
          marginBottom: 14
        }}
      >
        <Link href="/" style={{ color: "var(--text-3)" }}>
          首页
        </Link>
        <span>/</span>
        <Link href="/review" style={{ color: "var(--text-3)" }}>
          原创评测
        </Link>
        <span>/</span>
        <span style={{ color: "var(--text-2)" }}>{r.type}</span>
      </nav>

      <article className="detail-card">
        <h1
          style={{
            margin: 0,
            fontSize: 26,
            lineHeight: 1.4,
            color: "var(--text-1)"
          }}
        >
          {r.title}
        </h1>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginTop: 12,
            color: "var(--text-3)",
            fontSize: 13,
            flexWrap: "wrap"
          }}
        >
          <span className="chip chip-brand">{r.type}</span>
          <span>{r.author}</span>
          <span>{r.date}</span>
        </div>

        <div style={{ height: 1, background: "var(--border)", margin: "16px 0" }} />

        <div className="article-body">
          <Markdown source={r.content} />
        </div>

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 20 }}>
          {r.tags.map((t) => (
            <span key={t} className="chip">
              #{t}
            </span>
          ))}
        </div>
      </article>

      <p
        style={{
          marginTop: 20,
          fontSize: 12,
          lineHeight: 1.8,
          color: "var(--text-3)"
        }}
      >
        免责声明：本文基于作者实际使用体验撰写，工具能力、价格与配额可能随版本变化，
        具体请以各工具官网最新说明为准。
      </p>

      {related.length > 0 && (
        <div style={{ marginTop: 28 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 14, color: "var(--text-1)" }}>
            更多原创内容
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {related.map((x) => (
              <Link key={x.slug} href={`/review/${x.slug}`} className="group hover-brand">
                <div
                  style={{
                    background: "var(--surface)",
                    border: "1px solid var(--border)",
                    borderRadius: 12,
                    padding: 16
                  }}
                >
                  <div
                    className="hover-brand-title"
                    style={{
                      fontSize: 16,
                      fontWeight: 700,
                      marginBottom: 6,
                      color: "var(--text-1)"
                    }}
                  >
                    {x.title}
                  </div>
                  <div style={{ fontSize: 14, color: "var(--text-2)", lineHeight: 1.7 }}>
                    {x.summary}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
