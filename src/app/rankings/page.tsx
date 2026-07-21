import ToolGrid from "@/components/ToolGrid";
import Rankings from "@/components/Rankings";
import { tools } from "@/lib/mock-data";

export default function RankingsPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="text-2xl font-bold mb-5">📊 排行榜</h1>
      <Rankings tools={tools} />
    </main>
  );
}
