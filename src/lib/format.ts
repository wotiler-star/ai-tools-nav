// 通用格式化工具

export function parseJsonTags(tags?: string | null): string[] {
  if (!tags) return [];
  try {
    const a = JSON.parse(tags);
    return Array.isArray(a) ? a.map(String) : [];
  } catch {
    return [];
  }
}

export function formatDate(d?: Date | string | null): string {
  if (!d) return "";
  const dt = typeof d === "string" ? new Date(d) : d;
  if (isNaN(dt.getTime())) return "";
  return dt.toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

export function formatDateTime(d?: Date | string | null): string {
  if (!d) return "";
  const dt = typeof d === "string" ? new Date(d) : d;
  if (isNaN(dt.getTime())) return "";
  return dt.toLocaleString("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}
