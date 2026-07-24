export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          username: string;
          full_name: string | null;
          avatar_url: string | null;
          bio: string | null;
          profile_completion: number;
          last_active_at: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          username: string;
          full_name?: string | null;
          avatar_url?: string | null;
          bio?: string | null;
          profile_completion?: number;
          last_active_at?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          username?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          bio?: string | null;
          profile_completion?: number;
          last_active_at?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      user_preferences: {
        Row: {
          user_id: string;
          theme: "light" | "dark" | "system";
          language: string;
          learning_style: "visual" | "auditory" | "reading" | "kinesthetic";
          daily_study_goal: number;
          daily_study_hours: number;
          dashboard_focus: "library" | "chat" | "quiz" | "flashcards" | "planner";
          updated_at: string;
        };
        Insert: {
          user_id: string;
          theme?: "light" | "dark" | "system";
          language?: string;
          learning_style?: "visual" | "auditory" | "reading" | "kinesthetic";
          daily_study_goal?: number;
          daily_study_hours?: number;
          dashboard_focus?: "library" | "chat" | "quiz" | "flashcards" | "planner";
          updated_at?: string;
        };
        Update: {
          user_id?: string;
          theme?: "light" | "dark" | "system";
          language?: string;
          learning_style?: "visual" | "auditory" | "reading" | "kinesthetic";
          daily_study_goal?: number;
          daily_study_hours?: number;
          dashboard_focus?: "library" | "chat" | "quiz" | "flashcards" | "planner";
          updated_at?: string;
        };
      };
      user_onboarding: {
        Row: {
          user_id: string;
          education: string;
          primary_goal: string;
          heard_from: string;
          interests: string[];
          subjects: string[];
          next_exam: string | null;
          onboarding_version: number;
          completed: boolean;
          completed_at: string | null;
        };
        Insert: {
          user_id: string;
          education?: string;
          primary_goal?: string;
          heard_from?: string;
          interests?: string[];
          subjects?: string[];
          next_exam?: string | null;
          onboarding_version?: number;
          completed?: boolean;
          completed_at?: string | null;
        };
        Update: {
          user_id?: string;
          education?: string;
          primary_goal?: string;
          heard_from?: string;
          interests?: string[];
          subjects?: string[];
          next_exam?: string | null;
          onboarding_version?: number;
          completed?: boolean;
          completed_at?: string | null;
        };
      };
      folders: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          folder_type: "personal" | "shared" | "archive";
          color: string;
          icon: string;
          parent_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          folder_type?: "personal" | "shared" | "archive";
          color?: string;
          icon?: string;
          parent_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          folder_type?: "personal" | "shared" | "archive";
          color?: string;
          icon?: string;
          parent_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      notes: {
        Row: {
          id: string;
          user_id: string;
          folder_id: string | null;
          title: string;
          original_filename: string;
          file_key: string;
          file_hash: string;
          mime_type: string;
          file_size: number;
          page_count: number;
          current_version: number;
          ai_status: "uploaded" | "extracting_text" | "embedding" | "summarizing" | "completed" | "failed";
          is_favorite: boolean;
          summary: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          folder_id?: string | null;
          title: string;
          original_filename: string;
          file_key: string;
          file_hash: string;
          mime_type: string;
          file_size: number;
          page_count?: number;
          current_version?: number;
          ai_status?: "uploaded" | "extracting_text" | "embedding" | "summarizing" | "completed" | "failed";
          is_favorite?: boolean;
          summary?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          folder_id?: string | null;
          title?: string;
          original_filename?: string;
          file_key?: string;
          file_hash?: string;
          mime_type?: string;
          file_size?: number;
          page_count?: number;
          current_version?: number;
          ai_status?: "uploaded" | "extracting_text" | "embedding" | "summarizing" | "completed" | "failed";
          is_favorite?: boolean;
          summary?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      note_versions: {
        Row: {
          id: string;
          note_id: string;
          version_number: number;
          file_key: string;
          file_hash: string;
          file_size: number;
          change_summary: string | null;
          created_by: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          note_id: string;
          version_number: number;
          file_key: string;
          file_hash: string;
          file_size: number;
          change_summary?: string | null;
          created_by: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          note_id?: string;
          version_number?: number;
          file_key?: string;
          file_hash?: string;
          file_size?: number;
          change_summary?: string | null;
          created_by?: string;
          created_at?: string;
        };
      };
      note_contents: {
        Row: {
          id: string;
          note_id: string;
          page_number: number;
          chunk_index: number;
          content_text: string;
          token_count: number;
          embedding_status: "pending" | "embedded" | "failed";
          created_at: string;
        };
        Insert: {
          id?: string;
          note_id: string;
          page_number?: number;
          chunk_index?: number;
          content_text: string;
          token_count?: number;
          embedding_status?: "pending" | "embedded" | "failed";
          created_at?: string;
        };
        Update: {
          id?: string;
          note_id?: string;
          page_number?: number;
          chunk_index?: number;
          content_text?: string;
          token_count?: number;
          embedding_status?: "pending" | "embedded" | "failed";
          created_at?: string;
        };
      };
      library_activity: {
        Row: {
          id: string;
          user_id: string;
          note_id: string | null;
          action: "uploaded" | "renamed" | "moved" | "deleted" | "favorited" | "opened" | "shared" | "version_added";
          details: Record<string, unknown> | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          note_id?: string | null;
          action: "uploaded" | "renamed" | "moved" | "deleted" | "favorited" | "opened" | "shared" | "version_added";
          details?: Record<string, unknown> | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          note_id?: string | null;
          action?: "uploaded" | "renamed" | "moved" | "deleted" | "favorited" | "opened" | "shared" | "version_added";
          details?: Record<string, unknown> | null;
          created_at?: string;
        };
      };
      tags: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          color: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          color?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          color?: string;
          created_at?: string;
        };
      };
      note_tags: {
        Row: {
          note_id: string;
          tag_id: string;
        };
        Insert: {
          note_id: string;
          tag_id: string;
        };
        Update: {
          note_id?: string;
          tag_id?: string;
        };
      };
      note_shares: {
        Row: {
          id: string;
          note_id: string;
          shared_by: string;
          shared_with_user_id: string | null;
          shared_with_group_id: string | null;
          permission: "view" | "comment" | "edit";
          created_at: string;
        };
        Insert: {
          id?: string;
          note_id: string;
          shared_by: string;
          shared_with_user_id?: string | null;
          shared_with_group_id?: string | null;
          permission?: "view" | "comment" | "edit";
          created_at?: string;
        };
        Update: {
          id?: string;
          note_id?: string;
          shared_by?: string;
          shared_with_user_id?: string | null;
          shared_with_group_id?: string | null;
          permission?: "view" | "comment" | "edit";
          created_at?: string;
        };
      };
    };
  };
}
