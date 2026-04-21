# Protein Tracker — Sprint 1 MVP

A production-ready protein tracking web application built with React + Vite + TypeScript + Tailwind CSS, backed by Supabase.

## Features

- **Authentication** — Email/password sign up, login, and logout via Supabase Auth
- **User Profile** — Set and update your daily protein goal
- **Dashboard** — Visual progress ring showing today's intake vs goal
- **Food Logging** — Search foods via OpenFoodFacts API or add manually
- **History** — View past days' food logs
- **Insights** — Weekly protein intake chart powered by Recharts

## Setup

### 1. Supabase Database Schema

Run the SQL in `supabase-schema.sql` in your Supabase SQL Editor:

1. Go to [Supabase Dashboard](https://supabase.com/dashboard/project/gjxsbdviwuxqhctsryce/sql)
2. Open the SQL Editor
3. Paste and run the contents of `supabase-schema.sql`

### 2. Environment Variables

Create a `.env` file (or set in your deployment platform):

```env
VITE_SUPABASE_URL=https://gjxsbdviwuxqhctsryce.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

### 3. Run Locally

```bash
pnpm install
pnpm --filter @workspace/protein-tracker run dev
```

### 4. Build

```bash
pnpm --filter @workspace/protein-tracker run build
```

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19 + Vite + TypeScript |
| Styling | Tailwind CSS v4 |
| Auth + DB | Supabase |
| State | TanStack React Query |
| Routing | Wouter |
| Forms | React Hook Form + Zod |
| Charts | Recharts |
| Food Search | OpenFoodFacts API (free, no key needed) |
| Icons | Lucide React |
| Date utils | date-fns |

## Deployment (Azure)

### Option A: Azure Static Web Apps

1. Build the app: `pnpm --filter @workspace/protein-tracker run build`
2. Output is in `artifacts/protein-tracker/dist/public/`
3. Deploy to Azure Static Web Apps pointing to that output folder
4. Set environment variables in Azure Portal under **Configuration → Application settings**

### Option B: Azure App Service

1. Use the same build output
2. Serve via nginx or any static file server
3. Configure environment variables in App Service settings

## .env.example

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Architecture Notes

- All data access goes directly through the Supabase JS client — no custom backend required
- Row Level Security (RLS) is enforced in Supabase so users can only access their own data
- Food search uses the free OpenFoodFacts API (no API key needed)
- The app is a pure static frontend — Azure Static Web Apps is the recommended deployment target
