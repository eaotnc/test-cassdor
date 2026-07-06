"use client";

import { useEffect, useState } from "react";
import { apiGet } from "@/lib/api";
import type { RevenuePoint } from "@/lib/types";

const CHART_HEIGHT = 220;

export default function RevenueChart() {
  const [data, setData] = useState<RevenuePoint[]>([]);

  useEffect(() => {
    apiGet<RevenuePoint[]>("dashboard/revenue").then(setData).catch(() => {});
  }, []);

  if (!data.length) {
    return <div style={{ height: CHART_HEIGHT + 32 }} />;
  }

  const max = Math.max(...data.map((d) => d.value));
  return (
    <div className="revenue-chart" style={{ height: CHART_HEIGHT + 32 }}>
      {data.map((d) => (
        <div key={d.month} className="revenue-bar-wrap">
          <div
            className="revenue-bar"
            style={{ height: Math.max(8, Math.round((d.value / max) * CHART_HEIGHT)) }}
            title={`${d.month}: $${d.value}k`}
          />
          <span className="revenue-bar-label">{d.month}</span>
        </div>
      ))}
    </div>
  );
}
