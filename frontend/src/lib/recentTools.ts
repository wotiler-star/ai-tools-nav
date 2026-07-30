// 本地偏好存储：最近浏览 / 收藏（localStorage，无后端依赖）

const RECENT_KEY = "recent_tools";
const FAV_KEY = "fav_tools";
const MAX = 8;

function read(key: string): number[] {
  try {
    const v = localStorage.getItem(key);
    return v ? (JSON.parse(v) as number[]) : [];
  } catch {
    return [];
  }
}

function write(key: string, val: number[]) {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch {
    /* 忽略写入失败（隐私模式等） */
  }
}

/** 最近浏览：返回工具 id 列表（最近在前） */
export function getRecent(): number[] {
  return read(RECENT_KEY);
}

/** 记录一个最近浏览的工具 id（去重 + 置顶 + 截断） */
export function addRecent(id: number) {
  const cur = read(RECENT_KEY).filter((x) => x !== id);
  cur.unshift(id);
  write(RECENT_KEY, cur.slice(0, MAX));
}

/** 收藏集合 */
export function getFavorites(): number[] {
  return read(FAV_KEY);
}

/** 切换收藏，返回切换后的状态（true=已收藏） */
export function toggleFavorite(id: number): boolean {
  const cur = read(FAV_KEY);
  const i = cur.indexOf(id);
  let on: boolean;
  if (i >= 0) {
    cur.splice(i, 1);
    on = false;
  } else {
    cur.unshift(id);
    on = true;
  }
  write(FAV_KEY, cur);
  return on;
}
