# API Service

NestJS REST API backed by **Apache Cassandra**, with JWT authentication.

## Endpoints

| Method | Path | Auth | Description |
| ------ | ---- | ---- | ----------- |
| GET | `/api/health` | Public | Health check |
| POST | `/api/auth/login` | Public | Login (`username`, `password`) |
| POST | `/api/auth/refresh` | Public | Refresh tokens |
| POST | `/api/auth/logout` | Public | Revoke refresh token |
| GET | `/api/dashboard/stats` | Bearer | Dashboard stat cards |
| GET | `/api/dashboard/revenue` | Bearer | Revenue chart data |
| GET | `/api/dashboard/goals` | Bearer | Goal progress |
| GET | `/api/users` | Bearer + `admin` | App users list |
| GET | `/api/orders` | Bearer | Orders list |

## Run

```bash
cp ../.env.example .env
npm install
npm run start:dev
```

The service listens on [http://localhost:4000](http://localhost:4000) by default.

On first startup it creates the Cassandra keyspace, tables, and seeds demo data (including `demo` / `demo`).
