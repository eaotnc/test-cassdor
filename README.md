# PostgreSQL + Casdoor + Next.js Back Office + NestJS API

A local stack with **[Casdoor](https://casdoor.ai/)** for IAM, **PostgreSQL** for app data, a **Next.js back office** (BFF + UI), and a **NestJS API**.

| Folder / Service     | Stack                             | Role                                  |
| -------------------- | --------------------------------- | ------------------------------------- |
| `docker-compose.yml` | Casdoor + Postgres, app Postgres  | Auth (IAM) + app database             |
| `casdoor/`           | Casdoor config + `init_data.json` | IAM bootstrap (app, roles, demo user) |
| `back-office/`       | Next.js 16, Ant Design            | Admin UI + login/session (BFF)        |
| `api-service/`       | NestJS, Prisma                    | Business API (validates Casdoor JWT)  |

## Quick start

```bash
# 1. Start Casdoor + app PostgreSQL
docker compose up -d

# 2. API
cd api-service
cp ../.env.example .env
npm install
npx prisma migrate deploy
npm run db:seed
npm run start:dev

# 3. Back office (new terminal)
cd back-office
cp .env.local.example .env.local
npm install
npm run dev
```

| URL                                                                  | Purpose                                           |
| -------------------------------------------------------------------- | ------------------------------------------------- |
| [http://localhost:3000](http://localhost:3000)                       | **Back office** — sign in with `demo` / `demo`    |
| [http://localhost:8000](http://localhost:8000)                       | **Casdoor web admin** — manage users, roles, apps |
| [http://localhost:4000/api/health](http://localhost:4000/api/health) | API health check                                  |

### Casdoor web admin

Open **[http://localhost:8000](http://localhost:8000)** to use the Casdoor admin console.

| Account             | Username | Password | Use                           |
| ------------------- | -------- | -------- | ----------------------------- |
| Casdoor super-admin | `admin`  | `123`    | Full IAM admin (built-in org) |
| Back office demo    | `demo`   | `demo`   | BOF login (org: `acme`)       |

In Casdoor admin you can manage **Organizations**, **Applications**, **Users**, **Roles**, and **Permissions** for the back office.

## Architecture

```
Browser → Back Office (Next.js :3000)
            │ password grant (server-side)
            ▼
         Casdoor (:8000)  ← web admin UI
            │ JWT access token
            ▼
         Back Office BFF → NestJS API (:4000) → PostgreSQL
```

- **Auth** is handled entirely by Casdoor (OAuth 2.0 / OIDC, JWT).
- **App data** (orders, dashboard stats, app users) lives in PostgreSQL (Prisma).
- The API verifies Casdoor JWTs via `/.well-known/jwks`.

## Configuration

Root `.env`:

| Variable                | Description               | Default                                      |
| ----------------------- | ------------------------- | -------------------------------------------- |
| `DATABASE_URL`          | App PostgreSQL connection | `postgresql://acme:acme@localhost:5434/acme` |
| `APP_POSTGRES_*`        | Docker Postgres settings  | see `.env.example`                           |
| `CASDOOR_URL`           | Casdoor base URL          | `http://localhost:8000`                      |
| `CASDOOR_CLIENT_ID`     | OAuth app client ID       | `acme-back-office`                           |
| `CASDOOR_CLIENT_SECRET` | OAuth app secret          | _(see init_data.json)_                       |
| `CASDOOR_ORGANIZATION`  | Organization name         | `acme`                                       |

Back office also needs the Casdoor vars in `.env.local` (see `back-office/.env.local.example`).

## Customizing roles & permissions

1. Open **Casdoor admin** at [http://localhost:8000](http://localhost:8000)
2. Go to **Users** / **Roles** / **Permissions** under organization `acme`
3. Assign roles to users (e.g. `admin`, `user`)
4. API routes use `@Roles("admin")` — see `api-service/src/users/users.controller.ts`
5. BOF hides `/users` unless JWT contains `admin` — see `back-office/src/middleware.ts`

To change the OAuth app or seed users, edit `casdoor/conf/init_data.json` and reset Casdoor data:

```bash
docker compose down -v   # removes Casdoor + app Postgres volumes
docker compose up -d
```

## Common commands

```bash
docker compose logs -f casdoor
docker compose down
docker compose down -v    # fresh start (wipes all data)

# API database
cd api-service
npm run db:migrate
npm run db:seed
npm run db:reset        # drop, migrate, seed
```

first command

```
docker compose up -d
cd api-service
npm install
npx prisma migrate deploy
npm run db:seed
npm run start:dev
```
