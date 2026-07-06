"use client";

import { useEffect, useState } from "react";
import { Card, Table, Tag, Space, Alert } from "antd";
import type { ColumnsType } from "antd/es/table";
import { apiGet } from "@/lib/api";
import type { OrderRow } from "@/lib/types";
import PageHeader from "@/components/PageHeader";
import PageLoading from "@/components/PageLoading";

const statusColor: Record<OrderRow["status"], string> = {
  paid: "success",
  pending: "warning",
  refunded: "error",
};

const columns: ColumnsType<OrderRow> = [
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
    sorter: (a, b) => a.amount - b.amount,
    render: (v: number) => (
      <span style={{ fontWeight: 500 }}>${v.toFixed(2)}</span>
    ),
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    filters: [
      { text: "Paid", value: "paid" },
      { text: "Pending", value: "pending" },
      { text: "Refunded", value: "refunded" },
    ],
    onFilter: (value, row) => row.status === value,
    render: (s: OrderRow["status"]) => (
      <Tag color={statusColor[s]} style={{ fontWeight: 500 }}>
        {s.charAt(0).toUpperCase() + s.slice(1)}
      </Tag>
    ),
  },
  {
    title: "Date",
    dataIndex: "date",
    key: "date",
    sorter: (a, b) => a.date.localeCompare(b.date),
  },
];

export default function OrdersPage() {
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    apiGet<OrderRow[]>("orders")
      .then(setOrders)
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <PageLoading />;

  if (error) {
    return (
      <Alert
        type="error"
        message="Failed to load orders"
        description={error}
        showIcon
      />
    );
  }

  return (
    <Space orientation="vertical" size={24} style={{ display: "flex" }}>
      <PageHeader
        title="Orders"
        subtitle="Track, filter, and manage customer orders."
      />
      <Card className="panel-card data-table-card">
        <Table
          columns={columns}
          dataSource={orders}
          pagination={{ pageSize: 10, showSizeChanger: false }}
        />
      </Card>
    </Space>
  );
}
