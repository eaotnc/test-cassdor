import { Controller, Get, Query } from "@nestjs/common";
import { Roles } from "../auth/roles.decorator";
import { UsersService } from "./users.service";

@Controller("users")
export class UsersController {
  constructor(private readonly users: UsersService) {}

  @Roles("admin")
  @Get()
  findAll(@Query("search") search?: string) {
    return this.users.findAll(search);
  }
}
