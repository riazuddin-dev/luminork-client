# Deploy Luminork Client to Vercel

The client is a standalone Next.js app (`luminork-client` GitHub repo).  
Deploy the **API first** (Render or Railway), then point this app at it.

## Prerequisites

- GitHub repo: `https://github.com/riazuddin-dev/luminork-client`
- Live API URL, e.g. `https://your-api.onrender.com`
- Health check works: `GET https://your-api.onrender.com/api/health`

## Option A — Vercel Dashboard (recommended)

1. Sign in at [vercel.com](https://vercel.com) with GitHub.
2. **Add New… → Project** → import `luminork-client`.
3. Leave defaults:
   - **Framework Preset:** Next.js
   - **Root Directory:** `.` (repo root)
   - **Build Command:** `npm run build`
   - **Install Command:** `npm install`
4. **Environment Variables** → add:

   | Name | Value | Environments |
   |------|--------|--------------|
   | `NEXT_PUBLIC_API_URL` | `https://YOUR-API-HOST/api` | Production (and Preview if desired) |

   Include the `/api` suffix. Example:  
   `https://luminork-server.onrender.com/api`

5. Click **Deploy**.
6. Copy your production URL, e.g. `https://luminork-client.vercel.app`.
7. On the **server** host, set:

   ```env
   CLIENT_URL=https://luminork-client.vercel.app
   ```

   Redeploy the server so CORS allows the Vercel origin.

## Option B — Vercel CLI

```bash
cd luminork-client
npm i -g vercel   # if needed
npx vercel login
npx vercel        # preview
npx vercel --prod # production
```

Add env via dashboard or:

```bash
npx vercel env add NEXT_PUBLIC_API_URL
```

## After deploy checklist

- [ ] Open the Vercel URL — home page loads
- [ ] Jobs list loads data from the API
- [ ] Login / register works (CORS + JWT)
- [ ] Server `CLIENT_URL` matches the Vercel domain exactly (no trailing slash issues)

## Local env

```bash
cp .env.example .env.local
# edit NEXT_PUBLIC_API_URL if needed
npm run dev
```

## Notes

- `NEXT_PUBLIC_*` vars are baked in at **build time**. Change the API URL → **redeploy** the client.
- Do not put secrets in the client; only public API base URL is required.
- Optional config: `vercel.json` in this repo (framework + build commands).
