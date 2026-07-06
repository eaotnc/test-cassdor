import { Module } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";
import { CasdoorAuthGuard } from "./casdoor-auth.guard";
import { RolesGuard } from "./roles.guard";

@Module({
  providers: [
    CasdoorAuthGuard,
    RolesGuard,
    { provide: APP_GUARD, useClass: CasdoorAuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
  ],
})
export class AuthModule {}
