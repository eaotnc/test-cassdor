import { Injectable } from "@nestjs/common";
import { CassandraService } from "../cassandra/cassandra.service";

@Injectable()
export class DashboardService {
  constructor(private readonly cassandra: CassandraService) {}

  async getStats() {
    const result = await this.cassandra.execute(
      "SELECT title, value, prefix, suffix, delta, sort_order FROM dashboard_stats",
    );

    return result.rows
      .map((s) => ({
        title: s.title as string,
        value: s.value as number,
        prefix: (s.prefix as string | null) ?? undefined,
        suffix: (s.suffix as string | null) ?? undefined,
        delta: s.delta as number,
        sortOrder: s.sort_order as number,
      }))
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map(({ sortOrder: _, ...rest }) => rest);
  }

  async getRevenue() {
    const result = await this.cassandra.execute(
      "SELECT month, value, sort_order FROM revenue_points",
    );

    return result.rows
      .map((r) => ({
        month: r.month as string,
        value: r.value as number,
        sortOrder: r.sort_order as number,
      }))
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map(({ sortOrder: _, ...rest }) => rest);
  }

  getGoals() {
    return [
      { label: "Monthly target", percent: 78 },
      { label: "New signups", percent: 64 },
      { label: "Support SLA", percent: 92 },
    ];
  }
}
