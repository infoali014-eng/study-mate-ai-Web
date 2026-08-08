-- ============================================================================
-- STUDYMATE AI / MR OWL AI - CHAT & CONVERSATIONS SCHEMA MIGRATION
-- Provider: Supabase PostgreSQL
-- ============================================================================

-- Enable UUID extension if not enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Conversations Table
CREATE TABLE IF NOT EXISTS public.conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL DEFAULT 'New Chat',
    subject TEXT NULL,
    mode TEXT NOT NULL DEFAULT 'explain' CONSTRAINT check_conversation_mode CHECK (
        mode IN ('explain', 'quiz', 'practice', 'revise', 'teach_me')
    ),
    selected_note_ids UUID[] DEFAULT ARRAY[]::UUID[],
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Messages Table
CREATE TABLE IF NOT EXISTS public.messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT NOT NULL CONSTRAINT check_message_role CHECK (role IN ('user', 'assistant', 'system')),
    content TEXT NOT NULL,
    context_used JSONB DEFAULT '{}'::jsonb,
    tokens_used INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Ensure user_ai_providers Table Exists
CREATE TABLE IF NOT EXISTS public.user_ai_providers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    provider TEXT NOT NULL CONSTRAINT check_provider CHECK (provider IN ('gemini', 'openai', 'claude', 'grok')),
    encrypted_api_key TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_user_provider UNIQUE (user_id, provider)
);

-- 4. Triggers for updated_at
DROP TRIGGER IF EXISTS trigger_conversations_updated_at ON public.conversations;
CREATE TRIGGER trigger_conversations_updated_at
    BEFORE UPDATE ON public.conversations
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS trigger_user_ai_providers_updated_at ON public.user_ai_providers;
CREATE TRIGGER trigger_user_ai_providers_updated_at
    BEFORE UPDATE ON public.user_ai_providers
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 5. Indexes for Performance
CREATE INDEX IF NOT EXISTS idx_conversations_user_id ON public.conversations (user_id);
CREATE INDEX IF NOT EXISTS idx_conversations_updated_at ON public.conversations (updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON public.messages (conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_user_id ON public.messages (user_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON public.messages (created_at ASC);

-- 6. Row Level Security (RLS)
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_ai_providers ENABLE ROW LEVEL SECURITY;

-- Conversations RLS
DROP POLICY IF EXISTS "Users can manage their own conversations." ON public.conversations;
CREATE POLICY "Users can manage their own conversations."
    ON public.conversations FOR ALL
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Messages RLS
DROP POLICY IF EXISTS "Users can manage their own messages." ON public.messages;
CREATE POLICY "Users can manage their own messages."
    ON public.messages FOR ALL
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- User AI Providers RLS
DROP POLICY IF EXISTS "Users can view their own AI provider keys." ON public.user_ai_providers;
CREATE POLICY "Users can view their own AI provider keys."
    ON public.user_ai_providers FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own AI provider keys." ON public.user_ai_providers;
CREATE POLICY "Users can insert their own AI provider keys."
    ON public.user_ai_providers FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own AI provider keys." ON public.user_ai_providers;
CREATE POLICY "Users can update their own AI provider keys."
    ON public.user_ai_providers FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own AI provider keys." ON public.user_ai_providers;
CREATE POLICY "Users can delete their own AI provider keys."
    ON public.user_ai_providers FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);
