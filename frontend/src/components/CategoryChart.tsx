"use client";

import { useMemo } from "react";
import * as d3 from "d3";

export interface CategoryDatum {
  name: string;
  count: number;
}

/**
 * 工具分类分布柱状图（d3 scale 驱动，React 渲染 SVG，SSR 安全）。
 * - d3.scaleLinear：数值 → 像素宽度
 * - d3.scaleBand：分类 → 像素高度
 * - d3.max / d3.ticks：坐标轴自适应
 */
export default function CategoryChart({
  data,
  height = 300
}: {
  data: CategoryDatum[];
  height?: number;
}) {
  const width = 520;
  const margin = { top: 10, right: 16, bottom: 24, left: 96 };
  const innerW = width - margin.left - margin.right;
  const innerH = height - margin.top - margin.bottom;

  const { bars, ticks, x } = useMemo(() => {
    const max = d3.max(data, (d) => d.count) || 1;
    const xScale = d3.scaleLinear().domain([0, max]).range([0, innerW]);
    const yScale = d3
      .scaleBand<string>()
      .domain(data.map((d) => d.name))
      .range([0, innerH])
      .padding(0.28);
    const computed = data.map((d) => ({
      ...d,
      y: yScale(d.name) || 0,
      w: xScale(d.count),
      h: yScale.bandwidth()
    }));
    return { bars: computed, ticks: xScale.ticks(5), x: xScale };
  }, [data, innerW, innerH]);

  if (data.length === 0) return null;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width="100%"
      role="img"
      aria-label="AI 工具分类分布"
    >
      <g transform={`translate(${margin.left},${margin.top})`}>
        {bars.map((d) => (
          <g key={d.name}>
            <text
              x={-8}
              y={d.y + d.h / 2}
              textAnchor="end"
              dominantBaseline="middle"
              fontSize={12}
              fill="var(--text-2, #4e5969)"
            >
              {d.name}
            </text>
            <rect x={0} y={d.y} width={Math.max(d.w, 2)} height={d.h} rx={4} fill="#3874f7" />
            <text
              x={d.w + 6}
              y={d.y + d.h / 2}
              dominantBaseline="middle"
              fontSize={12}
              fill="var(--text-1, #1d2129)"
            >
              {d.count}
            </text>
          </g>
        ))}
        {ticks.map((t) => (
          <g key={t} transform={`translate(${x(t)},0)`}>
            <line y2={innerH} stroke="var(--border, #eaecef)" />
            <text y={innerH + 16} textAnchor="middle" fontSize={10} fill="var(--text-3, #86909c)">
              {t}
            </text>
          </g>
        ))}
      </g>
    </svg>
  );
}
