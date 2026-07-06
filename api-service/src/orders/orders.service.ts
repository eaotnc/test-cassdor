import { Injectable } from "@nestjs/common";
import { CassandraService } from "../cassandra/cassandra.service";

@Injectable()
export class OrdersService {
  constructor(private readonly cassandra: CassandraService) {}

  async findAll() {
    const result = await this.cassandra.execute(
      "SELECT id, customer, amount, status, date FROM orders",
    );

    return result.rows
      .map((o) => ({
        key: o.id as string,
        id: o.id as string,
        customer: o.customer as string,
        amount: o.amount as number,
        status: o.status as "paid" | "pending" | "refunded",
        date: o.date as string,
      }))
      .sort((a, b) => b.date.localeCompare(a.date));
  }
}
