"use client";

import { useMemo } from "react";

interface SparklineProps {
  data?: number[];
  positive?: boolean;
  width?: number;
  height?: number;
}

export default function Sparkline({
  data,
  positive = true,
  width = 80,
  height = 30,
}: SparklineProps) {
  const points = useMemo(() => {
    if (!data || data.length === 0) {
      // Generate random sparkline data
      const generated = [];
      for (let i = 0; i < 20; i++) {
        generated.push(Math.random() * 100);
      }
      return generated;
    }
    return data;
  }, [data]);

  const max = Math.max(...points);
  const min = Math.min(...points);
  const range = max - min;

  const pathData = points
    .map((value, index) => {
      const x = (index / (points.length - 1)) * width;
      const y = height - ((value - min) / range) * height;
      return `${index === 0 ? "M" : "L"} ${x} ${y}`;
    })
    .join(" ");

  const color = positive ? "#10b981" : "#ef4444";

  return (
    <svg width={width} height={height} className="inline-block">
      <defs>
        <linearGradient id={`sparkline-gradient-${positive ? "pos" : "neg"}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path
        d={`${pathData} L ${width} ${height} L 0 ${height} Z`}
        fill={`url(#sparkline-gradient-${positive ? "pos" : "neg"})`}
      />
      <path
        d={pathData}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
