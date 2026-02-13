# SaaS Starter: Next.js + Prisma + Neon + Vercel

## 1) Prerequis
- Node.js 22+
- Un projet Neon PostgreSQL
- Un projet Vercel lie a ce repo

## 2) Variables d'environnement
Copie `.env.example` vers `.env` puis remplace:
- `DATABASE_URL`
- `DIRECT_URL`
- `SEED_TOKEN`

## 3) Initialisation locale
```bash
npm install
npx prisma migrate dev --name init
npm run prisma:seed
npm run dev
```

## 4) Deploy Vercel
Dans Vercel, ajoute `DATABASE_URL` et `DIRECT_URL` dans Project Settings > Environment Variables.

Le build command est deja configure:
- `npm run vercel-build`

Ce script execute:
1. `prisma generate`
2. `prisma migrate deploy`
3. `next build`

## 5) GitHub Actions
Configure ces secrets dans GitHub:
- `DATABASE_URL`
- `DIRECT_URL`
- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`

A chaque push sur `main`:
1. CI: lint + typecheck + build
2. Migrations prod
3. Deploy Vercel

## 6) Smoke check
- `GET /api/health` doit retourner `{"status":"ok","database":"up"}`