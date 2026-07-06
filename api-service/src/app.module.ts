import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AuthModule } from "./auth/auth.module";
import { CassandraModule } from "./cassandra/cassandra.module";
import { HealthModule } from "./health/health.module";
import { DashboardModule } from "./dashboard/dashboard.module";
import { UsersModule } from "./users/users.module";
import { OrdersModule } from "./orders/orders.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    CassandraModule,
    AuthModule,
    HealthModule,
    DashboardModule,
    UsersModule,
    OrdersModule,
  ],
})
export class AppModule {}
