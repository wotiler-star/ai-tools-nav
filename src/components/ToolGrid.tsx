import Link from "next/link";
import ToolCard from "./ToolCard";
import type { Tool } from "@/lib/types";

export default function ToolGrid({
  title,
  items,
  moreHref,
}: {
  title: string;
  items: Tool[];
  moreHref?: string;
}) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-8">
      <div className="flex items-end justify-between mb-5">
        <h2 className="text-xl font-bold">{title}</h2>
        {moreHref && (
          <Link href={moreHref} className="text-sm hover:underline" style={{ color: "var(--primary)" }}>
            查看全部 →
          </Link>
        )}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {items.map((t) => (
          <ToolCard key={t.id} tool={t} />
        ))}
      </div>
    </section>
  );
}
