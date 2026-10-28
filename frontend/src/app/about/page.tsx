import type { Metadata } from "next";
import { SITE } from "@/config/site";

export const metadata: Metadata = {
  title: `关于本站｜${SITE.name}`,
  description: SITE.description,
  alternates: { canonical: `/about` }
};

export default function AboutPage() {
  return (
    <div
      className="container-1200"
      style={{ maxWidth: 800, margin: "0 auto", padding: "48px 16px", lineHeight: 1.8 }}
    >
      <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 16 }}>关于 {SITE.name}</h1>
      <p style={{ color: "#374151", marginBottom: 12 }}>{SITE.slogan}</p>
      <p style={{ color: "#374151", marginBottom: 12 }}>{SITE.description}</p>

      <h2 style={{ fontSize: 20, fontWeight: 700, marginTop: 32, marginBottom: 12 }}>商务合作</h2>
      <p style={{ color: "#374151" }}>
        资源互换 / 商务合作请联系：
        <a href="mailto:bd@toolly.cc" style={{ color: "#3874F7" }}>
          bd@toolly.cc
        </a>
      </p>

      <h2 style={{ fontSize: 20, fontWeight: 700, marginTop: 32, marginBottom: 12 }}>资质与备案</h2>
      <p style={{ color: "#374151" }}>
        增值电信业务经营许可证查询：
        <a
          href="https://beian.miit.gov.cn/"
          target="_blank"
          rel="noreferrer"
          style={{ color: "#3874F7" }}
        >
          beian.miit.gov.cn
        </a>
      </p>
    </div>
  );
}
