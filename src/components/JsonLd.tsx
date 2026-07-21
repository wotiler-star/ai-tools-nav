// 通用 JSON-LD 注入组件（服务端渲染，零客户端 JS）
// 用法：<JsonLd data={{ "@context": "https://schema.org", ... }} />

export default function JsonLd({
  data,
}: {
  data: Record<string, unknown> | Record<string, unknown>[];
}) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
