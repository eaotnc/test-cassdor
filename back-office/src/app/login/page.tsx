"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Form, Input, Typography, Alert } from "antd";
import {
  AppstoreOutlined,
  LockOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useAuth } from "@/providers/AuthProvider";
import { brand } from "@/lib/brand";

export default function LoginPage() {
  const { initialized, authenticated, login } = useAuth();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialized && authenticated) {
      router.replace("/dashboard");
    }
  }, [initialized, authenticated, router]);

  const onFinish = async (values: { username: string; password: string }) => {
    setSubmitting(true);
    setError(null);
    const result = await login(values.username, values.password);
    setSubmitting(false);
    if (result.ok) {
      router.replace("/dashboard");
    } else {
      setError(result.error ?? "Login failed");
    }
  };

  return (
    <div className="login-page">
      <div className="login-brand-panel">
        <div className="login-brand-logo">
          <div className="login-brand-icon">
            <AppstoreOutlined />
          </div>
          <div>
            <div className="login-brand-title">{brand.name}</div>
            <div className="login-brand-tagline">{brand.tagline}</div>
          </div>
        </div>
        <div className="login-brand-quote">
          <p>Manage operations with clarity and control.</p>
          <span>
            Secure access to dashboards, users, and orders — all in one place.
          </span>
        </div>
        <div className="sider-footer-text">© 2026 {brand.name}</div>
      </div>

      <div className="login-form-panel">
        <div className="login-form-wrap">
          <div className="login-mobile-brand">
            <div className="login-brand-icon">
              <AppstoreOutlined />
            </div>
            <div>
              <div className="login-brand-title">{brand.name}</div>
              <div className="login-brand-tagline">{brand.product}</div>
            </div>
          </div>

          <Typography.Title level={3} className="login-form-title">
            Welcome back
          </Typography.Title>
          <Typography.Text type="secondary">
            Sign in to your {brand.product} account
          </Typography.Text>

          {error && (
            <Alert
              type="error"
              message={error}
              showIcon
              className="mt-6 mb-4"
              closable
              onClose={() => setError(null)}
            />
          )}

          <Form
            layout="vertical"
            onFinish={onFinish}
            requiredMark={false}
            size="large"
            className="mt-8"
          >
            <Form.Item
              name="username"
              label="Username"
              rules={[
                { required: true, message: "Please enter your username" },
              ]}
            >
              <Input
                prefix={<UserOutlined style={{ color: "#94a3b8" }} />}
                placeholder="Enter username"
                autoComplete="username"
              />
            </Form.Item>
            <Form.Item
              name="password"
              label="Password"
              rules={[
                { required: true, message: "Please enter your password" },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined style={{ color: "#94a3b8" }} />}
                placeholder="Enter password"
                autoComplete="current-password"
              />
            </Form.Item>
            <Form.Item className="mb-0 mt-2">
              <Button
                type="primary"
                htmlType="submit"
                block
                loading={submitting}
                size="large"
              >
                Sign in
              </Button>
            </Form.Item>
          </Form>

          <div className="login-demo-hint">
            Demo credentials: <code>demo</code> / <code>demo</code>
          </div>
        </div>
      </div>
    </div>
  );
}
