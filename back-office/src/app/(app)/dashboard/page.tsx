"use client";

import { useEffect, useState } from "react";
import {
  Card,
  Col,
  Row,
  Table,
  Tag,
  Typography,
  Progress,
  Space,
  Alert,
} from "antd";
import {
  DollarOutlined,
  ShoppingOutlined,
  TeamOutlined,
  RiseOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { apiGet } from "@/lib/api";
import type { Goal, OrderRow, Stat } from "@/lib/types";
import RevenueChart from "@/components/RevenueChart";
import PageHeader from "@/components/PageHeader";
import StatCard from "@/components/StatCard";
import PageLoading from "@/components/PageLoading";

const STAT_ICONS = [
  <DollarOutlined key="rev" />,
  <ShoppingOutlined key="ord" />,
  <TeamOutlined key="usr" />,
  <RiseOutlined key="cvt" />,
];

const STAT_ACCENTS = ["#2563eb", "#7c3aed", "#059669", "#d97706"];

const orderStatusColor: Record<OrderRow["status"], string> = {
  paid: "success",
  pending: "warning",
  refunded: "error",
};

const orderColumns: ColumnsType<OrderRow> = [
  {
    title: "Order",
    dataIndex: "id",
    key: "id",
    render: (id: string) => (
      <span style={{ fontWeight: 500, color: "#0f172a" }}>{id}</span>
    ),
  },
  { title: "Customer", dataIndex: "customer", key: "customer" },
  {
    title: "Amount",
    dataIndex: "amount",
    key: "amount",
    render: (v: number) => (
      <span style={{ fontWeight: 500 }}>${v.toFixed(2)}</span>
    ),
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    render: (s: OrderRow["status"]) => (
      <Tag color={orderStatusColor[s]} style={{ fontWeight: 500 }}>
        {s.charAt(0).toUpperCase() + s.slice(1)}
      </Tag>
    ),
  },
  { title: "Date", dataIndex: "date", key: "date" },
];

export default function DashboardPage() {
  const [stats, setStats] = useState<Stat[]>([]);
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      apiGet<Stat[]>("dashboard/stats"),
      apiGet<OrderRow[]>("orders"),
      apiGet<Goal[]>("dashboard/goals"),
    ])
      .then(([statsData, ordersData, goalsData]) => {
        setStats(statsData);
        setOrders(ordersData);
        setGoals(goalsData);
      })
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <PageLoading />;

  if (error) {
    return (
      <Alert
        type="error"
        message="Failed to load dashboard"
        description={error}
        showIcon
      />
    );
  }

  return (
    <Space orientation="vertical" size={24} style={{ display: "flex" }}>
      <PageHeader
        title="Dashboard"
        subtitle="Overview of your business performance and recent activity."
      />

      <Row gutter={[20, 20]}>
        {stats.map((s, i) => (
          <Col xs={24} sm={12} xl={6} key={s.title}>
            <StatCard
              title={s.title}
              value={s.value}
              prefix={s.prefix}
              suffix={s.suffix}
              delta={s.delta}
              icon={STAT_ICONS[i % STAT_ICONS.length]}
              accent={STAT_ACCENTS[i % STAT_ACCENTS.length]}
            />
          </Col>
        ))}
      </Row>

      <Row gutter={[20, 20]}>
        <Col xs={24} lg={16}>
          <Card
            className="panel-card"
            title="Revenue Overview"
            extra={
              <Typography.Text type="secondary" style={{ fontSize: 13 }}>
                Last 12 months
              </Typography.Text>
            }
          >
            <RevenueChart />
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card className="panel-card" title="Performance Goals">
            <Space orientation="vertical" size={20} style={{ display: "flex" }}>
              {goals.map((g) => (
                <div key={g.label}>
                  <div className="flex items-center justify-between mb-2">
                    <Typography.Text style={{ fontWeight: 500 }}>
                      {g.label}
                    </Typography.Text>
                    <Typography.Text type="secondary" style={{ fontSize: 13 }}>
                      {g.percent}%
                    </Typography.Text>
                  </div>
                  <Progress
                    percent={g.percent}
                    showInfo={false}
                    strokeColor={{ from: "#3b82f6", to: "#2563eb" }}
                    trailColor="#f1f5f9"
                    size={{ height: 8 }}
                  />
                </div>
              ))}
            </Space>
          </Card>
        </Col>
      </Row>

      <Card className="panel-card data-table-card" title="Recent Orders">
        <Table
          columns={orderColumns}
          dataSource={orders}
          pagination={false}
          size="middle"
        />
      </Card>
    </Space>
  );
}
