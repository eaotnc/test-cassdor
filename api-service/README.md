# API Service

NestJS REST API backed by **PostgreSQL** (Prisma), with **Casdoor JWT** authentication.

## Endpoints

| Method | Path | Auth | Description |
| ------ | ---- | ---- | ----------- |
| GET | `/api/health` | Public | Health check |
| GET | `/api/dashboard/stats` | Bearer (Casdoor) | Dashboard stat cards |
| GET | `/api/dashboard/revenue` | Bearer (Casdoor) | Revenue chart data |
| GET | `/api/dashboard/goals` | Bearer (Casdoor) | Goal progress |
| GET | `/api/users` | Bearer + `admin` role | App users list |
| GET | `/api/orders` | Bearer (Casdoor) | Orders list |

Login is handled by Casdoor — the back office obtains tokens and forwards them as `Authorization: Bearer`.

## Run

```bash
cp ../.env.example .env
npm install
npx prisma migrate deploy
npm run db:seed
npm run start:dev
```

Requires Casdoor running at `CASDOOR_URL` (default `http://localhost:8000`).
