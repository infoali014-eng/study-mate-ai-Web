-- ============================================================================
-- STUDYMATE AI - INITIAL DATABASE SCHEMA MIGRATION
-- Milestone: Database Foundation
-- Provider: Supabase PostgreSQL
-- ============================================================================

-- Reserved Naming Conventions for Future Tables:
--   - notes
--   - subjects
--   - folders
--   - note_chunks
--   - embeddings
--   - conversations
--   - messages
--   - flashcards
--   - quizzes
--   - quiz_attempts
--   - revision_tasks
--   - study_sessions
--   - analytics_events
--   - notifications

-- ============================================================================
-- 1. TRIGGER PROCEDURES
-- ============================================================================

-- Generic trigger function to auto-update 'updated_at' timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger function to handle automatic user profile, preference, and onboarding row creation upon signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    default_username TEXT;
BEGIN
    -- Extract username prefix from email if metadata doesn't supply it
    default_username := COALESCE(
        NEW.raw_user_meta_data->>'username',
        split_part(NEW.email, '@', 1) || '_' || substr(NEW.id::text, 1, 8)
    );

    -- 1. Insert Profile
    INSERT INTO public.profiles (id, username, full_name, avatar_url, bio, profile_completion, last_active_at)
    VALUES (
        NEW.id,
        default_username,
        COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
        NEW.raw_user_meta_data->>'avatar_url',
        NULL,
        0,
        NOW()
    );

    -- 2. Insert Preferences
    INSERT INTO public.user_preferences (user_id, theme, language, learning_style, daily_study_goal, daily_study_hours, dashboard_focus)
    VALUES (
        NEW.id,
        'system',
        'en',
        'visual',
        30,
        0.5,
        'library'
    );

    -- 3. Insert Onboarding State
    INSERT INTO public.user_onboarding (user_id, education, primary_goal, heard_from, interests, subjects, next_exam, onboarding_version, completed, completed_at)
    VALUES (
        NEW.id,
        '',
        '',
        '',
        ARRAY[]::TEXT[],
        ARRAY[]::TEXT[],
        NULL,
        1,
        FALSE,
        NULL
    );

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- 2. SCHEMAS AND TABLES
-- ============================================================================

-- Table 1: Profiles
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username TEXT UNIQUE NOT NULL,
    full_name TEXT,
    avatar_url TEXT NULL,
    bio TEXT NULL,
    profile_completion INTEGER DEFAULT 0 CONSTRAINT check_profile_completion CHECK (profile_completion BETWEEN 0 AND 100),
    last_active_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table 2: User Preferences
CREATE TABLE public.user_preferences (
    user_id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
    theme TEXT DEFAULT 'system' CONSTRAINT check_theme CHECK (theme IN ('light', 'dark', 'system')),
    language TEXT DEFAULT 'en' CONSTRAINT check_language CHECK (length(language) IN (2, 3)),
    learning_style TEXT DEFAULT 'visual' CONSTRAINT check_learning_style CHECK (learning_style IN ('visual', 'auditory', 'reading', 'kinesthetic')),
    daily_study_goal INTEGER DEFAULT 30 CONSTRAINT check_daily_study_goal CHECK (daily_study_goal >= 0), -- expressed in minutes
    daily_study_hours NUMERIC DEFAULT 0.5 CONSTRAINT check_daily_study_hours CHECK (daily_study_hours >= 0.0),
    dashboard_focus TEXT DEFAULT 'library' CONSTRAINT check_dashboard_focus CHECK (dashboard_focus IN ('library', 'chat', 'quiz', 'flashcards', 'planner')),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table 3: User Onboarding
CREATE TABLE public.user_onboarding (
    user_id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
    education TEXT,
    primary_goal TEXT,
    heard_from TEXT,
    interests TEXT[] DEFAULT ARRAY[]::TEXT[],
    subjects TEXT[] DEFAULT ARRAY[]::TEXT[],
    next_exam DATE NULL,
    onboarding_version INTEGER DEFAULT 1 CONSTRAINT check_onboarding_version CHECK (onboarding_version > 0),
    completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMPTZ NULL
);

-- ============================================================================
-- 3. TRIGGERS BINDING
-- ============================================================================

-- Bind updated_at trigger to profiles table
CREATE TRIGGER trigger_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Bind updated_at trigger to user_preferences table
CREATE TRIGGER trigger_user_preferences_updated_at
    BEFORE UPDATE ON public.user_preferences
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Bind auth signup trigger to automatically initialize rows
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================================
-- 4. INDEXES
-- ============================================================================

-- Query lookup index for unique username searches
CREATE INDEX idx_profiles_username ON public.profiles (username);

-- ============================================================================
-- 5. ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_onboarding ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
CREATE POLICY "Users can view their own profile."
    ON public.profiles FOR SELECT
    TO authenticated
    USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile."
    ON public.profiles FOR UPDATE
    TO authenticated
    USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile."
    ON public.profiles FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = id);

-- Preferences Policies
CREATE POLICY "Users can view their own preferences."
    ON public.user_preferences FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own preferences."
    ON public.user_preferences FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own preferences."
    ON public.user_preferences FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

-- Onboarding Policies
CREATE POLICY "Users can view their own onboarding answers."
    ON public.user_onboarding FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own onboarding answers."
    ON public.user_onboarding FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own onboarding answers."
    ON public.user_onboarding FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

-- ============================================================================
-- 6. TRANSACTIONAL RPC PROCEDURES
-- ============================================================================

CREATE OR REPLACE FUNCTION public.submit_onboarding(
    p_user_id UUID,
    p_education TEXT,
    p_subjects TEXT[],
    p_primary_goals TEXT[],
    p_heard_from TEXT,
    p_interests TEXT[],
    p_learning_styles TEXT[],
    p_daily_study_time TEXT,
    p_next_exam DATE,
    p_dashboard_focus TEXT
)
RETURNS BOOLEAN AS $$
DECLARE
    v_daily_study_goal INTEGER;
    v_daily_study_hours NUMERIC;
BEGIN
    -- Map daily study time options to goals
    CASE p_daily_study_time
        WHEN '30_min' THEN
            v_daily_study_goal := 30;
            v_daily_study_hours := 0.5;
        WHEN '1_hour' THEN
            v_daily_study_goal := 60;
            v_daily_study_hours := 1.0;
        WHEN '2_hours' THEN
            v_daily_study_goal := 120;
            v_daily_study_hours := 2.0;
        WHEN '4_hours' THEN
            v_daily_study_goal := 240;
            v_daily_study_hours := 4.0;
        WHEN '6_plus_hours' THEN
            v_daily_study_goal := 360;
            v_daily_study_hours := 6.0;
        ELSE
            v_daily_study_goal := 30;
            v_daily_study_hours := 0.5;
    END CASE;

    -- 1. Update Profiles Table
    UPDATE public.profiles
    SET profile_completion = 100,
        last_active_at = NOW(),
        updated_at = NOW()
    WHERE id = p_user_id;

    -- 2. Update User Preferences Table
    UPDATE public.user_preferences
    SET learning_style = p_learning_styles[1], -- Map first style as primary learning style
        daily_study_goal = v_daily_study_goal,
        daily_study_hours = v_daily_study_hours,
        dashboard_focus = p_dashboard_focus,
        updated_at = NOW()
    WHERE user_id = p_user_id;

    -- 3. Update User Onboarding Table
    UPDATE public.user_onboarding
    SET education = p_education,
        primary_goal = array_to_string(p_primary_goals, ', '),
        heard_from = p_heard_from,
        interests = p_interests,
        subjects = p_subjects,
        next_exam = p_next_exam,
        completed = TRUE,
        completed_at = NOW()
    WHERE user_id = p_user_id;

    RETURN TRUE;
EXCEPTION
    WHEN OTHERS THEN
        RAISE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

