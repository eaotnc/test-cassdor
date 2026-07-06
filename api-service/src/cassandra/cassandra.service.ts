import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Client, types } from "cassandra-driver";

@Injectable()
export class CassandraService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(CassandraService.name);
  private client!: Client;
  private keyspace!: string;

  constructor(private readonly config: ConfigService) {}

  async onModuleInit() {
    const contactPoints = (
      this.config.get<string>("CASSANDRA_CONTACT_POINTS") ?? "127.0.0.1"
    ).split(",");
    const port = Number(this.config.get<string>("CASSANDRA_PORT") ?? 9042);
    this.keyspace = this.config.get<string>("CASSANDRA_KEYSPACE") ?? "acme";
    const localDataCenter =
      this.config.get<string>("CASSANDRA_LOCAL_DC") ?? "datacenter1";

    this.client = new Client({
      contactPoints,
      localDataCenter,
      protocolOptions: { port },
    });

    await this.connectWithRetry();
    await this.ensureKeyspace();
    await this.client.shutdown();
    this.client = new Client({
      contactPoints,
      localDataCenter,
      keyspace: this.keyspace,
      protocolOptions: { port },
    });
    await this.client.connect();
    this.logger.log(`Connected to Cassandra keyspace "${this.keyspace}"`);
  }

  async onModuleDestroy() {
    await this.client?.shutdown();
  }

  getClient(): Client {
    return this.client;
  }

  async execute(
    query: string,
    params: unknown[] = [],
    options?: { prepare?: boolean },
  ): Promise<types.ResultSet> {
    return this.client.execute(query, params, { prepare: options?.prepare ?? true });
  }

  private async connectWithRetry(maxAttempts = 30, delayMs = 2000) {
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        await this.client.connect();
        return;
      } catch (err) {
        if (attempt === maxAttempts) throw err;
        this.logger.warn(
          `Cassandra not ready (attempt ${attempt}/${maxAttempts}), retrying…`,
        );
        await sleep(delayMs);
      }
    }
  }

  private async ensureKeyspace() {
    await this.client.execute(
      `CREATE KEYSPACE IF NOT EXISTS ${this.keyspace}
       WITH replication = {'class': 'SimpleStrategy', 'replication_factor': 1}`,
    );
  }
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
