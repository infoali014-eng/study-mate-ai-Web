-- =========================================================
-- StudyMate AI - Streak & Daily Activity Schema Migration (003)
-- =========================================================

-- 1. Table: user_streaks
CREATE TABLE IF NOT EXISTS public.user_streaks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
    current_streak INTEGER NOT NULL DEFAULT 0,
    best_streak INTEGER NOT NULL DEFAULT 0,
    today_points INTEGER NOT NULL DEFAULT 0,
    today_completed BOOLEAN NOT NULL DEFAULT FALSE,
    last_completed_date DATE DEFAULT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index on user_id for quick streak lookups
CREATE INDEX IF NOT EXISTS idx_user_streaks_user_id ON public.user_streaks(user_id);

-- 2. Table: daily_activity
CREATE TABLE IF NOT EXISTS public.daily_activity (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    activity_date DATE NOT NULL DEFAULT CURRENT_DATE,
    chat_points INTEGER NOT NULL DEFAULT 0,      -- Max 30
    session_points INTEGER NOT NULL DEFAULT 0,   -- Max 20
    upload_points INTEGER NOT NULL DEFAULT 0,    -- Max 30
    preview_points INTEGER NOT NULL DEFAULT 0,   -- Max 20
    total_points INTEGER NOT NULL DEFAULT 0,     -- Max 100
    completed BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT unique_user_daily_activity UNIQUE(user_id, activity_date)
);

-- Index on user_id and activity_date for weekly calendar lookups
CREATE INDEX IF NOT EXISTS idx_daily_activity_user_date ON public.daily_activity(user_id, activity_date);

-- 3. Row Level Security (RLS) Policies
ALTER TABLE public.user_streaks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_activity ENABLE ROW LEVEL SECURITY;

-- User Streaks RLS Policies
CREATE POLICY "Users can view their own streak record"
    ON public.user_streaks FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own streak record"
    ON public.user_streaks FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own streak record"
    ON public.user_streaks FOR UPDATE
    USING (auth.uid() = user_id);

-- Daily Activity RLS Policies
CREATE POLICY "Users can view their own daily activity records"
    ON public.daily_activity FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own daily activity records"
    ON public.daily_activity FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own daily activity records"
    ON public.daily_activity FOR UPDATE
    USING (auth.uid() = user_id);

-- Trigger to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_streak_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_user_streaks_updated_at
    BEFORE UPDATE ON public.user_streaks
    FOR EACH ROW
    EXECUTE FUNCTION public.update_streak_updated_at_column();
