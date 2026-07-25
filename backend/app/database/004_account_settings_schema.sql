-- ============================================================================
-- STUDYMATE AI - ACCOUNT SETTINGS & USER AI PROVIDERS SCHEMA MIGRATION
-- Milestone: Account Settings & Personalization
-- Provider: Supabase PostgreSQL
-- ============================================================================

-- 1. Extend Profiles Table
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS display_name TEXT,
  ADD COLUMN IF NOT EXISTS avatar_url TEXT,
  ADD COLUMN IF NOT EXISTS bio TEXT,
  ADD COLUMN IF NOT EXISTS institution TEXT,
  ADD COLUMN IF NOT EXISTS field_of_study TEXT,
  ADD COLUMN IF NOT EXISTS education_level TEXT DEFAULT 'university';

-- Update display_name fallback to full_name if NULL
UPDATE public.profiles
SET display_name = full_name
WHERE display_name IS NULL AND full_name IS NOT NULL;

-- 2. Extend User Preferences Table
ALTER TABLE public.user_preferences
  ADD COLUMN IF NOT EXISTS preferred_language TEXT DEFAULT 'english',
  ADD COLUMN IF NOT EXISTS explanation_style TEXT DEFAULT 'detailed',
  ADD COLUMN IF NOT EXISTS notifications JSONB DEFAULT '{"study_reminders": true, "streak_reminder": true, "product_updates": false}'::jsonb;

-- 3. Dedicated User AI Providers Table
CREATE TABLE IF NOT EXISTS public.user_ai_providers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    provider TEXT NOT NULL CONSTRAINT check_provider CHECK (provider IN ('gemini', 'openai', 'claude', 'grok')),
    encrypted_api_key TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_user_provider UNIQUE (user_id, provider)
);

-- Trigger for auto updating updated_at on user_ai_providers
CREATE TRIGGER trigger_user_ai_providers_updated_at
    BEFORE UPDATE ON public.user_ai_providers
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Enable RLS on user_ai_providers
ALTER TABLE public.user_ai_providers ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_ai_providers
CREATE POLICY "Users can view their own AI provider keys."
    ON public.user_ai_providers FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own AI provider keys."
    ON public.user_ai_providers FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own AI provider keys."
    ON public.user_ai_providers FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own AI provider keys."
    ON public.user_ai_providers FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);
