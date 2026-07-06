"use client";

import {
  Card,
  Tabs,
  Form,
  Input,
  Button,
  Switch,
  Space,
  Descriptions,
  Tag,
  App,
  Divider,
} from "antd";
import { useAuth } from "@/providers/AuthProvider";
import PageHeader from "@/components/PageHeader";

export default function SettingsPage() {
  const { user } = useAuth();
  const { message } = App.useApp();

  return (
    <Space orientation="vertical" size={24} style={{ display: "flex" }}>
      <PageHeader
        title="Settings"
        subtitle="Manage your account profile and application preferences."
      />

      <Card className="panel-card">
        <Tabs
          items={[
            {
              key: "profile",
              label: "Profile",
              children: (
                <div className="max-w-2xl">
                  <Descriptions
                    column={{ xs: 1, sm: 2 }}
                    bordered
                    size="middle"
                    title="Account details"
                    styles={{
                      label: { fontWeight: 500, background: "#f8fafc" },
                    }}
                  >
                    <Descriptions.Item label="Username">
                      {user?.username ?? "—"}
                    </Descriptions.Item>
                    <Descriptions.Item label="Name">
                      {user?.name ?? "—"}
                    </Descriptions.Item>
                    <Descriptions.Item label="Email" span={2}>
                      {user?.email ?? "—"}
                    </Descriptions.Item>
                    <Descriptions.Item label="Roles" span={2}>
                      <Space size={[0, 6]} wrap>
                        {(user?.roles ?? []).length
                          ? user!.roles.map((r) => (
                              <Tag
                                key={r}
                                color="blue"
                                style={{ fontWeight: 500 }}
                              >
                                {r}
                              </Tag>
                            ))
                          : "—"}
                      </Space>
                    </Descriptions.Item>
                  </Descriptions>

                  <Divider />

                  <Form
                    layout="vertical"
                    initialValues={{
                      displayName: user?.name,
                      email: user?.email,
                    }}
                    onFinish={() => message.success("Profile saved (mock)")}
                  >
                    <Form.Item label="Display name" name="displayName">
                      <Input placeholder="Your display name" />
                    </Form.Item>
                    <Form.Item label="Email" name="email">
                      <Input placeholder="you@company.com" />
                    </Form.Item>
                    <Button type="primary" htmlType="submit">
                      Save changes
                    </Button>
                  </Form>
                </div>
              ),
            },
            {
              key: "preferences",
              label: "Preferences",
              children: (
                <Form layout="vertical" className="max-w-xl">
                  <Form.Item
                    label="Email notifications"
                    extra="Receive alerts for important account activity"
                  >
                    <Switch defaultChecked />
                  </Form.Item>
                  <Form.Item
                    label="Weekly summary"
                    extra="A digest of key metrics every Monday"
                  >
                    <Switch />
                  </Form.Item>
                  <Form.Item
                    label="Compact tables"
                    extra="Reduce row height in data tables"
                  >
                    <Switch defaultChecked />
                  </Form.Item>
                </Form>
              ),
            },
          ]}
        />
      </Card>
    </Space>
  );
}
