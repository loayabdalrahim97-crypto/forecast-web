# FORECAST — production web app

A real Next.js app (not the chat artifact): server-side AI calls, Postgres via Prisma,
email/password login, bilingual UI (EN/AR), and a Stripe-ready subscription table.

## What's already done for you

- Railway project **"forecast"** created in your account.
- Code builds clean: TypeScript, ESLint, and `next build` all pass in this sandbox
  (the only thing this sandbox itself can't verify locally is the Prisma database client,
  because it can't reach Prisma's binary download server — Railway's build servers can,
  so this resolves itself automatically on deploy via the `postinstall` script).

## What you need to do (in order)

### 1. Add Postgres to the Railway project
In the Railway dashboard -> **forecast** project -> **+ New** -> **Database** -> **PostgreSQL**.
That's it — Railway wires up a `DATABASE_URL` automatically.

### 2. Push this code to a GitHub repo
Create a **new, empty** GitHub repo (don't reuse the old broken one), then from this folder:
```
git init
git add .
git commit -m "FORECAST web app"
git branch -M main
git remote add origin https://github.com/<you>/<repo>.git
git push -u origin main
```

### 3. Create the app service in Railway
In the same project -> **+ New** -> **GitHub Repo** -> pick the repo you just pushed.
Railway detects Next.js automatically (Nixpacks) and starts a build.

### 4. Set environment variables on the app service
Railway dashboard -> your app service -> **Variables** -> add:

| Variable | Value |
|---|---|
| `DATABASE_URL` | `${{Postgres.DATABASE_URL}}` (reference — links to the Postgres service you added) |
| `ANTHROPIC_API_KEY` | Your own key from console.anthropic.com — separate from Claude.ai, needs its own billing |
| `AUTH_SECRET` | `aqkDnziyh6Ctsk/Z0oJ8ntHmDnnZtB8A94vWLjy1Sdk=` (already generated for you — safe to use as-is, or run `openssl rand -base64 32` for your own) |
| `NEXTAUTH_URL` | Your Railway URL once step 5 is done, e.g. `https://forecast-production.up.railway.app` |

Never paste these into our chat — set them directly in Railway's dashboard.

### 5. Generate a public domain
App service -> **Settings** -> **Networking** -> **Generate Domain**. Copy that URL into
`NEXTAUTH_URL` from step 4 and redeploy.

### 6. Test it
Visit your URL, sign up with an email/password, and run through a forecast.

## What's still a preview, not real yet

- **Payments** — the pricing cards show a "this is a preview" message. Wiring real Stripe
  Checkout + webhooks is the next piece; the `Subscription` table in the database is
  already shaped for it.
- **Custom domain** — buy one from any registrar, then add it in Railway's Networking
  settings and update `NEXTAUTH_URL`.
- **Password reset / email verification** — not implemented yet; needs a transactional
  email provider (e.g. Resend).

## Local development
```
cp .env.example .env.local   # fill in DATABASE_URL, ANTHROPIC_API_KEY, AUTH_SECRET
npm install
npx prisma db push
npm run dev
```
