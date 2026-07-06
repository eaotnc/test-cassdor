import type { ReactNode } from "react";
import { Typography } from "antd";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}

export default function PageHeader({
  title,
  subtitle,
  actions,
}: PageHeaderProps) {
  return (
    <div className="page-header">
      <div className="page-header-text">
        <Typography.Title level={3} className="page-title">
          {title}
        </Typography.Title>
        {subtitle && (
          <Typography.Text type="secondary" className="page-subtitle">
            {subtitle}
          </Typography.Text>
        )}
      </div>
      {actions && <div className="page-header-actions">{actions}</div>}
    </div>
  );
}
