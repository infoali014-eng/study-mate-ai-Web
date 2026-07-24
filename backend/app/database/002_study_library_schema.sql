-- ============================================================================
-- STUDYMATE AI / MR OWL AI - STUDY LIBRARY ENTERPRISE DATABASE SCHEMA MIGRATION
-- Provider: Supabase PostgreSQL
-- ============================================================================

-- Enable UUID extension if not enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- 1. SCHEMAS AND TABLES
-- ============================================================================

-- Table 1: Folders
CREATE TABLE IF NOT EXISTS public.folders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    folder_type TEXT DEFAULT 'personal' CONSTRAINT check_folder_type CHECK (folder_type IN ('personal', 'shared', 'archive')),
    color TEXT DEFAULT '#219EBC',
    icon TEXT DEFAULT 'Folder',
    parent_id UUID NULL REFERENCES public.folders(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table 2: Notes (Metadata & File References only — NO hardcoded file_url)
CREATE TABLE IF NOT EXISTS public.notes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    folder_id UUID NULL REFERENCES public.folders(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    original_filename TEXT NOT NULL,
    file_key TEXT NOT NULL, -- Permanent R2 object key path (e.g. users/user_id/notes/note_id/file.pdf)
    file_hash TEXT NOT NULL, -- SHA-256 hash for byte deduplication
    mime_type TEXT NOT NULL,
    file_size BIGINT NOT NULL, -- In bytes
    page_count INTEGER DEFAULT 0,
    current_version INTEGER DEFAULT 1,
    ai_status TEXT DEFAULT 'uploaded' CONSTRAINT check_ai_status CHECK (
        ai_status IN ('uploaded', 'extracting_text', 'embedding', 'summarizing', 'completed', 'failed')
    ),
    is_favorite BOOLEAN DEFAULT FALSE,
    summary TEXT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table 3: Note Versions (History of uploaded note revisions)
CREATE TABLE IF NOT EXISTS public.note_versions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    note_id UUID NOT NULL REFERENCES public.notes(id) ON DELETE CASCADE,
    version_number INTEGER NOT NULL,
    file_key TEXT NOT NULL,
    file_hash TEXT NOT NULL,
    file_size BIGINT NOT NULL,
    change_summary TEXT NULL,
    created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_note_version UNIQUE (note_id, version_number)
);

-- Table 4: Note Contents (Extracted text chunks for RAG & vector embedding)
CREATE TABLE IF NOT EXISTS public.note_contents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    note_id UUID NOT NULL REFERENCES public.notes(id) ON DELETE CASCADE,
    page_number INTEGER DEFAULT 1,
    chunk_index INTEGER DEFAULT 0,
    content_text TEXT NOT NULL,
    token_count INTEGER DEFAULT 0,
    embedding_status TEXT DEFAULT 'pending' CONSTRAINT check_embedding_status CHECK (embedding_status IN ('pending', 'embedded', 'failed')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table 5: Library Activity Audit Feed
CREATE TABLE IF NOT EXISTS public.library_activity (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    note_id UUID NULL REFERENCES public.notes(id) ON DELETE CASCADE,
    action TEXT NOT NULL CONSTRAINT check_library_action CHECK (
        action IN ('uploaded', 'renamed', 'moved', 'deleted', 'favorited', 'opened', 'shared', 'version_added')
    ),
    details JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table 6: Tags
CREATE TABLE IF NOT EXISTS public.tags (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    color TEXT DEFAULT '#FB8500',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_user_tag UNIQUE (user_id, name)
);

-- Table 7: Note Tags Junction
CREATE TABLE IF NOT EXISTS public.note_tags (
    note_id UUID NOT NULL REFERENCES public.notes(id) ON DELETE CASCADE,
    tag_id UUID NOT NULL REFERENCES public.tags(id) ON DELETE CASCADE,
    PRIMARY KEY (note_id, tag_id)
);

-- Table 8: Note Shares (Zero-duplication references to Study Groups / Users)
CREATE TABLE IF NOT EXISTS public.note_shares (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    note_id UUID NOT NULL REFERENCES public.notes(id) ON DELETE CASCADE,
    shared_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    shared_with_user_id UUID NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    shared_with_group_id UUID NULL, -- References future study_groups table
    permission TEXT DEFAULT 'view' CONSTRAINT check_share_permission CHECK (permission IN ('view', 'comment', 'edit')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 2. TRIGGERS BINDING
-- ============================================================================

CREATE TRIGGER trigger_folders_updated_at
    BEFORE UPDATE ON public.folders
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER trigger_notes_updated_at
    BEFORE UPDATE ON public.notes
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================================
-- 3. INDEXES
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_folders_user_id ON public.folders (user_id);
CREATE INDEX IF NOT EXISTS idx_folders_parent_id ON public.folders (parent_id);
CREATE INDEX IF NOT EXISTS idx_notes_user_id ON public.notes (user_id);
CREATE INDEX IF NOT EXISTS idx_notes_folder_id ON public.notes (folder_id);
CREATE INDEX IF NOT EXISTS idx_notes_file_hash ON public.notes (file_hash);
CREATE INDEX IF NOT EXISTS idx_notes_ai_status ON public.notes (ai_status);
CREATE INDEX IF NOT EXISTS idx_note_versions_note_id ON public.note_versions (note_id);
CREATE INDEX IF NOT EXISTS idx_note_contents_note_id ON public.note_contents (note_id);
CREATE INDEX IF NOT EXISTS idx_library_activity_user_id ON public.library_activity (user_id);
CREATE INDEX IF NOT EXISTS idx_library_activity_created_at ON public.library_activity (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_note_shares_note_id ON public.note_shares (note_id);

-- ============================================================================
-- 4. ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

ALTER TABLE public.folders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.note_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.note_contents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.library_activity ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.note_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.note_shares ENABLE ROW LEVEL SECURITY;

-- Folders RLS
CREATE POLICY "Users can manage their own folders."
    ON public.folders FOR ALL
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Notes RLS (Users can manage owned notes or view shared notes)
CREATE POLICY "Users can manage their owned notes."
    ON public.notes FOR ALL
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view notes shared with them."
    ON public.notes FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.note_shares ns
            WHERE ns.note_id = public.notes.id
            AND ns.shared_with_user_id = auth.uid()
        )
    );

-- Note Versions RLS
CREATE POLICY "Users can access versions of notes they own or have shared access."
    ON public.note_versions FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.notes n
            WHERE n.id = public.note_versions.note_id
            AND (n.user_id = auth.uid() OR EXISTS (
                SELECT 1 FROM public.note_shares ns
                WHERE ns.note_id = n.id AND ns.shared_with_user_id = auth.uid()
            ))
        )
    );

-- Note Contents RLS
CREATE POLICY "Users can access text chunks of notes they own or have shared access."
    ON public.note_contents FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.notes n
            WHERE n.id = public.note_contents.note_id
            AND (n.user_id = auth.uid() OR EXISTS (
                SELECT 1 FROM public.note_shares ns
                WHERE ns.note_id = n.id AND ns.shared_with_user_id = auth.uid()
            ))
        )
    );

-- Library Activity RLS
CREATE POLICY "Users can view their own activity feed."
    ON public.library_activity FOR ALL
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Tags RLS
CREATE POLICY "Users can manage their own tags."
    ON public.tags FOR ALL
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Note Tags RLS
CREATE POLICY "Users can manage note tag relations."
    ON public.note_tags FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.notes n
            WHERE n.id = public.note_tags.note_id
            AND n.user_id = auth.uid()
        )
    );

-- Note Shares RLS
CREATE POLICY "Users can manage note shares they created or received."
    ON public.note_shares FOR ALL
    TO authenticated
    USING (auth.uid() = shared_by OR auth.uid() = shared_with_user_id)
    WITH CHECK (auth.uid() = shared_by);
