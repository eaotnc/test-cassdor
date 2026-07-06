import { Controller, Get } from "@nestjs/common";
import { DashboardService } from "./dashboard.service";

@Controller("dashboard")
export class DashboardController {
  constructor(private readonly dashboard: DashboardService) {}

  @Get("stats")
  getStats() {
    return this.dashboard.getStats();
  }

  @Get("revenue")
  getRevenue() {
    return this.dashboard.getRevenue();
  }

  @Get("goals")
  getGoals() {
    return this.dashboard.getGoals();
  }
}
