# Cassandra (Docker) + Next.js Back Office + NestJS API

A local [Apache Cassandra](https://cassandra.apache.org/) setup with Docker Compose, a **Next.js back office** (BFF + UI), and a **NestJS API** backed by Cassandra.

| Folder | Stack | Role |
|--------|-------|------|
| `docker-compose.yml` | Cassandra 5 | Application database |
| `back-office/` | Next.js 16, Ant Design | Admin UI + login/session (BFF) |
| `api-service/` | NestJS, cassandra-driver | Business API + JWT auth |

Demo user: **`demo` / `demo`** (admin role).

## Quick start (full stack)

```bash
# 1. Start Cassandra
docker compose up -d

# 2. Set up and run the API (first time only)
cd api-service
cp ../.env.example .env
npm install
npm run start:dev

# 3. Run the back office (new terminal)
cd back-office
cp .env.local.example .env.local
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and sign in with **`demo` / `demo`**.

- API health: [http://localhost:4000/api/health](http://localhost:4000/api/health)

See [`back-office/README.md`](./back-office/README.md) and [`api-service/README.md`](./api-service/README.md) for details.

## Common commands

```bash
# Follow logs
docker compose logs -f cassandra

# Stop the stack (keeps data)
docker compose down

# Stop and delete all data (fresh start)
docker compose down -v

# Restart after config changes
docker compose up -d
```

## Configuration

Root `.env` (used by Docker Compose and copied into `api-service/.env`):

| Variable | Description | Default |
| -------- | ----------- | ------- |
| `CASSANDRA_CONTACT_POINTS` | Cassandra host(s) | `127.0.0.1` |
| `CASSANDRA_PORT` | CQL port | `9042` |
| `CASSANDRA_KEYSPACE` | Keyspace name | `acme` |
| `CASSANDRA_LOCAL_DC` | Local datacenter | `datacenter1` |
| `JWT_SECRET` | Signing secret for access/refresh tokens | *(required)* |
| `JWT_ACCESS_TTL` | Access token lifetime (seconds) | `900` |
| `JWT_REFRESH_TTL` | Refresh token lifetime (seconds) | `604800` |

The API creates the keyspace, tables, and seed data automatically on first startup.

## Notes

- Cassandra in Docker needs ~60s to become ready on first boot. The API retries the connection until Cassandra is available.
- This setup is intended for local development and testing only.
- Data persists in the `cassandra_data` Docker volume across restarts.
# test-cassdor
