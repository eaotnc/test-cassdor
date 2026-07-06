"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Card,
  Table,
  Tag,
  Input,
  Button,
  Space,
  Avatar,
  Dropdown,
  Alert,
} from "antd";
import {
  SearchOutlined,
  PlusOutlined,
  UserOutlined,
  MoreOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { apiGet } from "@/lib/api";
import type { UserRow } from "@/lib/types";
import PageHeader from "@/components/PageHeader";
import PageLoading from "@/components/PageLoading";

const roleColor: Record<UserRow["role"], string> = {
  Admin: "purple",
  Editor: "blue",
  Viewer: "default",
};

const statusColor: Record<UserRow["status"], string> = {
  active: "success",
  invited: "warning",
  suspended: "error",
};

export default function UsersPage() {
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    apiGet<UserRow[]>("users")
      .then(setUsers)
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return users.filter(
      (u) =>
        u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q),
    );
  }, [query, users]);

  const columns: ColumnsType<UserRow> = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (name: string, row) => (
        <div className="flex items-center gap-3">
          <Avatar
            size={40}
            icon={<UserOutlined />}
            style={{
              background: "linear-gradient(135deg, #e0e7ff, #dbeafe)",
              color: "#2563eb",
            }}
          />
          <div className="flex flex-col">
            <span className="font-medium text-slate-800">{name}</span>
            <span className="text-xs text-slate-400">{row.email}</span>
          </div>
        </div>
      ),
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      filters: [
        { text: "Admin", value: "Admin" },
        { text: "Editor", value: "Editor" },
        { text: "Viewer", value: "Viewer" },
      ],
      onFilter: (value, row) => row.role === value,
      render: (role: UserRow["role"]) => (
        <Tag color={roleColor[role]} style={{ fontWeight: 500 }}>
          {role}
        </Tag>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (s: UserRow["status"]) => (
        <Tag color={statusColor[s]} style={{ fontWeight: 500 }}>
          {s.charAt(0).toUpperCase() + s.slice(1)}
        </Tag>
      ),
    },
    {
      title: "Last active",
      dataIndex: "lastActive",
      key: "lastActive",
      sorter: (a, b) => a.lastActive.localeCompare(b.lastActive),
    },
    {
      title: "",
      key: "actions",
      width: 56,
      render: () => (
        <Dropdown
          menu={{
            items: [
              { key: "edit", label: "Edit" },
              { key: "reset", label: "Reset password" },
              { key: "remove", label: "Remove", danger: true },
            ],
          }}
        >
          <Button type="text" icon={<MoreOutlined />} />
        </Dropdown>
      ),
    },
  ];

  if (loading) return <PageLoading />;

  if (error) {
    return (
      <Alert
        type="error"
        message="Failed to load users"
        description={error}
        showIcon
      />
    );
  }

  return (
    <Space orientation="vertical" size={24} style={{ display: "flex" }}>
      <PageHeader
        title="Users"
        subtitle="Manage team members, roles, and access permissions."
        actions={
          <Space>
            <Input
              allowClear
              placeholder="Search users…"
              prefix={<SearchOutlined style={{ color: "#94a3b8" }} />}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              style={{ width: 260 }}
            />
            <Button type="primary" icon={<PlusOutlined />}>
              Add user
            </Button>
          </Space>
        }
      />

      <Card className="panel-card data-table-card">
        <Table
          columns={columns}
          dataSource={filtered}
          pagination={{ pageSize: 8, showSizeChanger: false }}
        />
      </Card>
    </Space>
  );
}
