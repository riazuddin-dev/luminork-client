# Luminork Client

Premium Next.js + TypeScript frontend for the Luminork career platform.

## Stack

- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS 4
- Framer Motion
- Recharts
- JWT auth against Express API

## Setup

From monorepo root:

```bash
cd Luminork
npm install
npm run dev
```

Or client only:

```bash
cd luminork-client
npm run dev
```

Create `.env.local` from the example:

```bash
cp .env.example .env.local
```

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

Open [http://localhost:3000](http://localhost:3000).

## Deploy (Vercel)

**Live site:** https://luminork-client.vercel.app

See **[DEPLOY.md](./DEPLOY.md)** for full Vercel steps.

### Production env (required after API is deployed)

In Vercel → Settings → Environment Variables:

```env
NEXT_PUBLIC_API_URL=https://YOUR-API-HOST/api
```

Then **Redeploy**. All client API calls go through `src/lib/api.ts` → `API_BASE_URL` from `src/lib/config.ts`.

## Demo credentials

| Role  | Email              | Password    |
|-------|--------------------|-------------|
| User  | user@luminork.com  | User@12345  |
| Admin | admin@luminork.com | Admin@12345 |

## Routes

### Public
- `/` — Home
- `/jobs`, `/jobs/[id]` — Explore & detail
- `/login`, `/register` — Auth
- `/about`, `/contact`

### Dashboard (all app tools — sidebar)
- `/dashboard` — Overview
- `/dashboard/post` — Post Job (admin)
- `/dashboard/manage` — Manage Jobs (admin)
- `/dashboard/applications` — My Applications / All Applications
- `/dashboard/profile` — Profile
- `/dashboard/saved` — Saved jobs (user)
- `/dashboard/analytics`, `/dashboard/users` — Admin tools

### Legacy redirects (do not use in new links)
- `/items/add` → `/dashboard/post`
- `/items/manage` → `/dashboard/manage`
- `/applications` → `/dashboard/applications`
- `/profile` → `/dashboard/profile`

API paths like `POST /api/applications` are backend endpoints, not frontend pages.

Make sure the Luminork server is running on port 5000.
