import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getStats() {
    const rows = await this.prisma.dashboardStat.findMany({
      orderBy: { sortOrder: "asc" },
    });
    return rows.map((s) => ({
      title: s.title,
      value: s.value,
      prefix: s.prefix ?? undefined,
      suffix: s.suffix ?? undefined,
      delta: s.delta,
    }));
  }

  async getRevenue() {
    const rows = await this.prisma.revenuePoint.findMany({
      orderBy: { sortOrder: "asc" },
    });
    return rows.map((r) => ({ month: r.month, value: r.value }));
  }

  getGoals() {
    return [
      { label: "Monthly target", percent: 78 },
      { label: "New signups", percent: 64 },
      { label: "Support SLA", percent: 92 },
    ];
  }
}
