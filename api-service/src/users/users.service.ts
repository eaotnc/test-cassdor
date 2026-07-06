import { Injectable } from "@nestjs/common";
import { CassandraService } from "../cassandra/cassandra.service";

@Injectable()
export class UsersService {
  constructor(private readonly cassandra: CassandraService) {}

  async findAll(search?: string) {
    const result = await this.cassandra.execute(
      "SELECT id, name, email, role, status, last_active FROM app_users",
    );

    const rows = result.rows.map((u) => ({
      key: u.id as string,
      name: u.name as string,
      email: u.email as string,
      role: u.role as "Admin" | "Editor" | "Viewer",
      status: u.status as "active" | "invited" | "suspended",
      lastActive: u.last_active as string,
    }));

    const q = search?.trim().toLowerCase();
    if (!q) return rows.sort((a, b) => a.name.localeCompare(b.name));

    return rows
      .filter(
        (u) =>
          u.name.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q),
      )
      .sort((a, b) => a.name.localeCompare(b.name));
  }
}
