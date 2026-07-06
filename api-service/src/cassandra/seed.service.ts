import { Injectable, Logger, OnApplicationBootstrap } from "@nestjs/common";
import * as bcrypt from "bcryptjs";
import { CassandraService } from "./cassandra.service";

@Injectable()
export class SeedService implements OnApplicationBootstrap {
  private readonly logger = new Logger(SeedService.name);

  constructor(private readonly cassandra: CassandraService) {}

  async onApplicationBootstrap() {
    await this.ensureSchema();
    const seeded = await this.isSeeded();
    if (seeded) {
      this.logger.log("Database already seeded");
      return;
    }
    await this.seed();
    this.logger.log("Database seeded with demo data");
  }

  private async ensureSchema() {
    const queries = [
      `CREATE TABLE IF NOT EXISTS auth_users (
        username text PRIMARY KEY,
        password_hash text,
        name text,
        email text,
        roles set<text>
      )`,
      `CREATE TABLE IF NOT EXISTS refresh_tokens (
        token_id text PRIMARY KEY,
        username text,
        expires_at timestamp
      )`,
      `CREATE TABLE IF NOT EXISTS app_users (
        id text PRIMARY KEY,
        name text,
        email text,
        role text,
        status text,
        last_active text
      )`,
      `CREATE TABLE IF NOT EXISTS orders (
        id text PRIMARY KEY,
        customer text,
        amount double,
        status text,
        date text
      )`,
      `CREATE TABLE IF NOT EXISTS dashboard_stats (
        id text PRIMARY KEY,
        title text,
        value double,
        prefix text,
        suffix text,
        delta double,
        sort_order int
      )`,
      `CREATE TABLE IF NOT EXISTS revenue_points (
        id text PRIMARY KEY,
        month text,
        value int,
        sort_order int
      )`,
    ];

    for (const query of queries) {
      await this.cassandra.execute(query, [], { prepare: false });
    }
  }

  private async isSeeded(): Promise<boolean> {
    const result = await this.cassandra.execute(
      "SELECT username FROM auth_users LIMIT 1",
    );
    return result.rowLength > 0;
  }

  private async seed() {
    const demoHash = await bcrypt.hash("demo", 10);

    await this.cassandra.execute(
      `INSERT INTO auth_users (username, password_hash, name, email, roles)
       VALUES (?, ?, ?, ?, ?)`,
      ["demo", demoHash, "Demo User", "demo@acme.io", ["admin", "user"]],
    );

    const stats = [
      ["stat-1", "Total Revenue", 128430, "$", null, 12.5, 1],
      ["stat-2", "Orders", 3421, null, null, 8.2, 2],
      ["stat-3", "Active Users", 1893, null, null, -2.4, 3],
      ["stat-4", "Conversion Rate", 4.7, null, "%", 1.1, 4],
    ];
    for (const row of stats) {
      await this.cassandra.execute(
        `INSERT INTO dashboard_stats (id, title, value, prefix, suffix, delta, sort_order)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        row,
      );
    }

    const revenue = [
      ["rev-1", "Jan", 42, 1],
      ["rev-2", "Feb", 55, 2],
      ["rev-3", "Mar", 48, 3],
      ["rev-4", "Apr", 71, 4],
      ["rev-5", "May", 63, 5],
      ["rev-6", "Jun", 88, 6],
      ["rev-7", "Jul", 76, 7],
      ["rev-8", "Aug", 95, 8],
      ["rev-9", "Sep", 82, 9],
      ["rev-10", "Oct", 100, 10],
      ["rev-11", "Nov", 91, 11],
      ["rev-12", "Dec", 118, 12],
    ];
    for (const row of revenue) {
      await this.cassandra.execute(
        `INSERT INTO revenue_points (id, month, value, sort_order) VALUES (?, ?, ?, ?)`,
        row,
      );
    }

    const users = [
      ["u-1", "Alice Johnson", "alice@acme.io", "Admin", "active", "2026-07-01"],
      ["u-2", "Bob Smith", "bob@acme.io", "Editor", "active", "2026-06-29"],
      ["u-3", "Carla Diaz", "carla@acme.io", "Viewer", "invited", "2026-06-20"],
      ["u-4", "David Lee", "david@acme.io", "Editor", "suspended", "2026-05-11"],
      ["u-5", "Emma Wilson", "emma@acme.io", "Viewer", "active", "2026-07-02"],
      ["u-6", "Frank Moore", "frank@acme.io", "Admin", "active", "2026-06-30"],
      ["u-7", "Grace Kim", "grace@acme.io", "Editor", "invited", "2026-06-18"],
      ["u-8", "Henry Clark", "henry@acme.io", "Viewer", "active", "2026-06-28"],
    ];
    for (const row of users) {
      await this.cassandra.execute(
        `INSERT INTO app_users (id, name, email, role, status, last_active) VALUES (?, ?, ?, ?, ?, ?)`,
        row,
      );
    }

    const orders = [
      ["#10231", "Alice Johnson", 249.0, "paid", "2026-07-02"],
      ["#10230", "Bob Smith", 89.5, "pending", "2026-07-02"],
      ["#10229", "Carla Diaz", 1200.0, "paid", "2026-07-01"],
      ["#10228", "David Lee", 42.0, "refunded", "2026-07-01"],
      ["#10227", "Emma Wilson", 560.0, "paid", "2026-06-30"],
    ];
    for (const row of orders) {
      await this.cassandra.execute(
        `INSERT INTO orders (id, customer, amount, status, date) VALUES (?, ?, ?, ?, ?)`,
        row,
      );
    }
  }
}
