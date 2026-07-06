import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(search?: string) {
    const rows = await this.prisma.appUser.findMany({
      orderBy: { name: "asc" },
    });

    const q = search?.trim().toLowerCase();
    const filtered = q
      ? rows.filter(
          (u) =>
            u.name.toLowerCase().includes(q) ||
            u.email.toLowerCase().includes(q),
        )
      : rows;

    return filtered.map((u) => ({
      key: u.id,
      name: u.name,
      email: u.email,
      role: u.role as "Admin" | "Editor" | "Viewer",
      status: u.status as "active" | "invited" | "suspended",
      lastActive: u.lastActive.toISOString().slice(0, 10),
    }));
  }
}
