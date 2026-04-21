-- Protein Tracker - Supabase Schema
-- Run this in your Supabase SQL Editor at:
-- https://supabase.com/dashboard/project/gjxsbdviwuxqhctsryce/sql

-- ============================================================
-- USER PROFILES
-- ============================================================
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  protein_goal INTEGER NOT NULL DEFAULT 150,
  created_at  TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at  TIMESTAMPTZ DEFAULT now() NOT NULL,
  UNIQUE(user_id)
);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER user_profiles_updated_at
  BEFORE UPDATE ON public.user_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- RLS
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile"
  ON public.user_profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile"
  ON public.user_profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
  ON public.user_profiles FOR UPDATE
  USING (auth.uid() = user_id);

-- ============================================================
-- FOOD ENTRIES
-- ============================================================
CREATE TABLE IF NOT EXISTS public.food_entries (
  id                  UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id             UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date                DATE NOT NULL,
  food_name           TEXT NOT NULL,
  brand               TEXT,
  serving_size        NUMERIC(10, 2) NOT NULL,
  serving_unit        TEXT NOT NULL DEFAULT 'g',
  protein_per_serving NUMERIC(10, 2) NOT NULL,
  calories_per_serving NUMERIC(10, 2),
  logged_at           TIMESTAMPTZ DEFAULT now() NOT NULL,
  created_at          TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Index for fast date queries
CREATE INDEX IF NOT EXISTS food_entries_user_date_idx
  ON public.food_entries (user_id, date);

-- RLS
ALTER TABLE public.food_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own food entries"
  ON public.food_entries FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own food entries"
  ON public.food_entries FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own food entries"
  ON public.food_entries FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own food entries"
  ON public.food_entries FOR DELETE
  USING (auth.uid() = user_id);
