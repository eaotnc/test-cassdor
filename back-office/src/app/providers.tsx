"use client";

import { ConfigProvider, App as AntApp, theme } from "antd";
import { AuthProvider } from "@/providers/AuthProvider";
import type { ReactNode } from "react";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <ConfigProvider
      theme={{
        algorithm: theme.defaultAlgorithm,
        token: {
          colorPrimary: "#2563eb",
          colorSuccess: "#059669",
          colorWarning: "#d97706",
          colorError: "#dc2626",
          colorText: "#0f172a",
          colorTextSecondary: "#64748b",
          colorBorder: "#e2e8f0",
          colorBgContainer: "#ffffff",
          colorBgLayout: "#f8fafc",
          borderRadius: 10,
          borderRadiusLG: 12,
          fontFamily: "var(--font-geist-sans), system-ui, sans-serif",
          fontSize: 14,
          controlHeight: 40,
          boxShadowTertiary:
            "0 1px 3px rgba(15, 23, 42, 0.06), 0 1px 2px rgba(15, 23, 42, 0.04)",
        },
        components: {
          Button: {
            primaryShadow: "0 2px 6px rgba(37, 99, 235, 0.25)",
            fontWeight: 500,
          },
          Card: {
            paddingLG: 20,
          },
          Table: {
            headerBg: "#f8fafc",
            headerColor: "#64748b",
            rowHoverBg: "#f8fafc",
            borderColor: "#f1f5f9",
          },
          Menu: {
            darkItemBg: "transparent",
            darkSubMenuItemBg: "transparent",
            darkItemSelectedBg: "rgba(59, 130, 246, 0.15)",
            darkItemHoverBg: "rgba(255, 255, 255, 0.06)",
            darkItemColor: "#94a3b8",
            darkItemSelectedColor: "#f8fafc",
            itemBorderRadius: 8,
            itemMarginInline: 8,
            iconSize: 16,
          },
          Input: {
            activeBorderColor: "#2563eb",
            hoverBorderColor: "#cbd5e1",
          },
          Tabs: {
            inkBarColor: "#2563eb",
            itemSelectedColor: "#2563eb",
            itemHoverColor: "#334155",
          },
          Tag: {
            defaultBg: "#f1f5f9",
            defaultColor: "#475569",
          },
        },
      }}
    >
      <AntApp>
        <AuthProvider>{children}</AuthProvider>
      </AntApp>
    </ConfigProvider>
  );
}
