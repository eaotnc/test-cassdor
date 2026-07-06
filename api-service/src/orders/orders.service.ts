import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    const rows = await this.prisma.order.findMany({
      orderBy: { date: "desc" },
    });
    return rows.map((o) => ({
      key: o.id,
      id: o.id,
      customer: o.customer,
      amount: o.amount,
      status: o.status as "paid" | "pending" | "refunded",
      date: o.date.toISOString().slice(0, 10),
    }));
  }
}
