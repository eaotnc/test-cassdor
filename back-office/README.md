# Acme Back Office

A mockup admin back office built with **Next.js 16 (App Router)**, **Ant Design v6**, and **Tailwind CSS v4**, secured with **JWT auth** via the NestJS API using a **Backend-for-Frontend (BFF)** login flow.

## Features

- Custom in-app login page
- Server-side auth proxied through Next.js API routes to the NestJS API
- Tokens kept in **httpOnly cookies** — never exposed to browser JavaScript
- Automatic access-token refresh using the refresh token
- Protected app shell with collapsible sidebar and user menu
- Dashboard with stat cards, a revenue chart, goals, and recent orders
- Users and Orders tables (search, filter, sort, pagination)
- Settings page showing live profile + roles decoded from the token

## Prerequisites

Cassandra and the API must be running. From the repository root:

```bash
docker compose up -d
cd api-service && npm install && npm run start:dev
```

## Run the app

```bash
cp .env.local.example .env.local
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and sign in with the custom login form.

**Demo user:** `demo` / `demo`

## Configuration

| Variable | Default |
| -------- | ------- |
| `API_SERVICE_URL` | `http://localhost:4000` |

## How auth is wired

- `src/lib/authServer.ts` — server-only helpers: login, refresh, logout, and JWT decoding.
- `src/lib/authCookies.ts` — sets/clears the httpOnly access and refresh token cookies.
- `src/app/api/auth/login/route.ts` — exchanges username/password for tokens via the API, sets cookies.
- `src/app/api/auth/session/route.ts` — returns the current user; auto-refreshes an expired access token.
- `src/app/api/auth/logout/route.ts` — revokes the refresh token at the API and clears cookies.
- `src/providers/AuthProvider.tsx` — client `useAuth()` hook.
- `src/app/api/data/[...path]/route.ts` — proxies authenticated API calls with the bearer token.
