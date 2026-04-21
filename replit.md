# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Contains a full Sprint 1 MVP Protein Tracking web app backed by Supabase.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5 (api-server artifact)
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Artifacts

### protein-tracker (main app, at `/`)
- React + Vite + TypeScript + Tailwind CSS
- Supabase for auth + database (external project)
- OpenFoodFacts API for food search (free, no key needed)
- TanStack React Query for data fetching
- Recharts for insights chart
- wouter for routing

**Pages:**
- `/login` — email/password auth (sign up + login tabs)
- `/onboarding` — first-time protein goal setup
- `/` (Dashboard) — today's progress ring + food log
- `/log` — food search (OpenFoodFacts) + manual entry
- `/history` — past day food logs
- `/insights` — weekly protein chart
- `/profile` — settings + logout

**Supabase Tables:**
- `user_profiles` — stores display_name + protein_goal per user
- `food_entries` — all logged foods with date, protein, serving info

**Schema:** Run `artifacts/protein-tracker/supabase-schema.sql` in Supabase SQL editor.

### api-server (at `/api`)
- Express 5 server (minimal, used for health check)
- Not used by protein-tracker app (Supabase handles data)

## Environment Variables

- `VITE_SUPABASE_URL` — Supabase project URL
- `VITE_SUPABASE_ANON_KEY` — Supabase anon/public key

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/protein-tracker run dev` — run frontend locally
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally

## Setup Instructions

1. Run `supabase-schema.sql` in your Supabase SQL Editor
2. Env vars `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are already set
3. Sign up for a new account in the app to start tracking

See `artifacts/protein-tracker/README.md` for full deployment guidance.
