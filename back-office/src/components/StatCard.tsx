import { Card, Statistic } from "antd";
import { ArrowDownOutlined, ArrowUpOutlined } from "@ant-design/icons";
import type { ReactNode } from "react";

interface StatCardProps {
  title: string;
  value: number;
  prefix?: string;
  suffix?: string;
  delta: number;
  icon: ReactNode;
  accent?: string;
}

export default function StatCard({
  title,
  value,
  prefix,
  suffix,
  delta,
  icon,
  accent = "#2563eb",
}: StatCardProps) {
  const positive = delta >= 0;

  return (
    <Card className="stat-card" variant="borderless">
      <div className="stat-card-inner">
        <div
          className="stat-card-icon"
          style={{ background: `${accent}14`, color: accent }}
        >
          {icon}
        </div>
        <Statistic
          title={title}
          value={value}
          precision={suffix === "%" ? 1 : 0}
          prefix={prefix}
          suffix={suffix}
          styles={{
            title: { fontSize: 13, fontWeight: 500, color: "#64748b" },
            content: { fontSize: 28, fontWeight: 600, color: "#0f172a" },
          }}
        />
      </div>
      <div className={`stat-card-trend ${positive ? "up" : "down"}`}>
        {positive ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
        <span>{Math.abs(delta)}%</span>
        <span className="stat-card-trend-label">vs last month</span>
      </div>
    </Card>
  );
}
