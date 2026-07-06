import { Global, Module } from "@nestjs/common";
import { CassandraService } from "./cassandra.service";
import { SeedService } from "./seed.service";

@Global()
@Module({
  providers: [CassandraService, SeedService],
  exports: [CassandraService],
})
export class CassandraModule {}
