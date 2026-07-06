# Acme Back Office

Admin UI built with **Next.js 16**, **Ant Design v6**, and **Tailwind CSS v4**, secured with **[Casdoor](https://casdoor.ai/)** using a **Backend-for-Frontend (BFF)** login flow.

## Features

- Custom in-app login form (password grant proxied to Casdoor server-side)
- Tokens in **httpOnly cookies**
- Automatic access-token refresh
- Dashboard, Users, Orders, Settings
- Role-based UI (`admin` sees Users page)

## Prerequisites

```bash
# From repository root
docker compose up -d
```

Casdoor admin: [http://localhost:8000](http://localhost:8000) (`admin` / `123`)

## Run

```bash
cp .env.local.example .env.local
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — sign in with **`demo` / `demo`**.

## Configuration

| Variable | Default |
| -------- | ------- |
| `API_SERVICE_URL` | `http://localhost:4000` |
| `CASDOOR_URL` | `http://localhost:8000` |
| `CASDOOR_CLIENT_ID` | `acme-back-office` |
| `CASDOOR_CLIENT_SECRET` | `back-office-secret-change-me` |
| `CASDOOR_ORGANIZATION` | `built-in` |

## Auth wiring

- `src/lib/casdoorServer.ts` — password grant, refresh, JWT decode
- `src/lib/authCookies.ts` — httpOnly cookie helpers
- `src/app/api/auth/*` — BFF login / session / logout
- `src/app/api/data/[...path]/route.ts` — proxies API calls with bearer token

## Manage users & roles

Use the **Casdoor web admin** at [http://localhost:8000](http://localhost:8000) — not the back office Settings page.
