"use client";

/**
 * 服务端组件可安全使用的封面图：加载失败时自动隐藏，避免破图。
 * 事件处理器（onError）不能定义在 Server Component 里再传给 Client Component，
 * 否则 RSC 序列化会抛 "Event handlers cannot be passed to Client Component props"，
 * 导致 next build 的静态生成阶段卡死。故把 onError 封装进这个 client 小组件。
 */
export default function SafeCover({
  src,
  alt,
  className,
  style
}: {
  src: string;
  alt: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      loading="lazy"
      className={className}
      style={style}
      onError={(e) => {
        (e.currentTarget as HTMLImageElement).style.display = "none";
      }}
    />
  );
}
