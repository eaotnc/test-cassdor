"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  Layout,
  Menu,
  Avatar,
  Dropdown,
  Button,
  Spin,
  App,
} from "antd";
import {
  DashboardOutlined,
  TeamOutlined,
  ShoppingCartOutlined,
  SettingOutlined,
  LogoutOutlined,
  UserOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  AppstoreOutlined,
} from "@ant-design/icons";
import { useAuth } from "@/providers/AuthProvider";
import { brand } from "@/lib/brand";

const { Header, Sider, Content } = Layout;

const PAGE_LABELS: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/users": "Users",
  "/orders": "Orders",
  "/settings": "Settings",
};

export default function AppShell({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const { initialized, authenticated, user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { message } = App.useApp();

  const isAdmin = Boolean(user?.roles.includes("admin"));
  const pageLabel = PAGE_LABELS[pathname] ?? "Overview";

  const menuItems = useMemo(
    () => [
      { key: "/dashboard", icon: <DashboardOutlined />, label: "Dashboard" },
      ...(isAdmin
        ? [{ key: "/users", icon: <TeamOutlined />, label: "Users" }]
        : []),
      { key: "/orders", icon: <ShoppingCartOutlined />, label: "Orders" },
      { key: "/settings", icon: <SettingOutlined />, label: "Settings" },
    ],
    [isAdmin],
  );

  useEffect(() => {
    if (initialized && !authenticated) {
      router.replace("/login");
    }
  }, [initialized, authenticated, router]);

  useEffect(() => {
    if (searchParams.get("error") === "forbidden") {
      message.error("You don't have permission to access that page.");
      router.replace(pathname);
    }
  }, [searchParams, message, router, pathname]);

  const handleLogout = async () => {
    await logout();
    router.replace("/login");
  };

  if (!initialized || !authenticated) {
    return (
      <div className="page-loading">
        <Spin size="large" />
      </div>
    );
  }

  const initials = (user?.name ?? user?.username ?? "U")
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <Layout className="app-shell">
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        theme="dark"
        width={248}
        collapsedWidth={72}
        className="app-sider"
      >
        <div className="sider-brand">
          <div className="sider-brand-icon">
            <AppstoreOutlined />
          </div>
          {!collapsed && (
            <div className="sider-brand-text">
              <span className="sider-brand-name">{brand.name}</span>
              <span className="sider-brand-product">{brand.product}</span>
            </div>
          )}
        </div>
        <Menu
          mode="inline"
          theme="dark"
          selectedKeys={[pathname]}
          items={menuItems}
          onClick={({ key }) => router.push(key)}
          className="sider-menu"
        />
        {!collapsed && (
          <div className="sider-footer">
            <div className="sider-footer-text">© 2026 {brand.name}</div>
          </div>
        )}
      </Sider>
      <Layout>
        <Header className="app-header">
          <div className="app-header-left">
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed((c) => !c)}
              style={{ color: "#64748b" }}
            />
            <div className="app-breadcrumb">
              {brand.product} / <strong>{pageLabel}</strong>
            </div>
          </div>
          <Dropdown
            menu={{
              items: [
                {
                  key: "profile",
                  icon: <UserOutlined />,
                  label: user?.email ?? user?.username ?? "Profile",
                  disabled: true,
                },
                { type: "divider" },
                {
                  key: "logout",
                  icon: <LogoutOutlined />,
                  label: "Sign out",
                  onClick: handleLogout,
                },
              ],
            }}
          >
            <div className="app-header-user">
              <Avatar
                size={36}
                style={{
                  background: "linear-gradient(135deg, #3b82f6, #2563eb)",
                  fontSize: 13,
                  fontWeight: 600,
                }}
              >
                {initials}
              </Avatar>
              <span className="app-header-user-name">
                {user?.name ?? user?.username ?? "User"}
              </span>
            </div>
          </Dropdown>
        </Header>
        <Content className="app-content">
          <div className="app-content-inner">{children}</div>
        </Content>
      </Layout>
    </Layout>
  );
}
