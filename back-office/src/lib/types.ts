export interface Stat {
  title: string;
  value: number;
  prefix?: string;
  suffix?: string;
  delta: number;
}

export interface RevenuePoint {
  month: string;
  value: number;
}

export interface Goal {
  label: string;
  percent: number;
}

export interface UserRow {
  key: string;
  name: string;
  email: string;
  role: "Admin" | "Editor" | "Viewer";
  status: "active" | "invited" | "suspended";
  lastActive: string;
}

export interface OrderRow {
  key: string;
  id: string;
  customer: string;
  amount: number;
  status: "paid" | "pending" | "refunded";
  date: string;
}
