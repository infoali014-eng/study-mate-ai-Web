export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
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
        Relationships: [];
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
        Relationships: [];
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
        Relationships: [];
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
        Relationships: [];
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
        Relationships: [];
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
        Relationships: [];
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
        Relationships: [];
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
        Relationships: [];
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
        Relationships: [];
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
        Relationships: [];
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
        Relationships: [];
      };
      courses: {
        Row: {
          id: string;
          title: string;
          slug: string;
          short_description: string;
          full_description: string;
          thumbnail_url: string | null;
          difficulty: "beginner" | "intermediate" | "advanced";
          category: string;
          tags: string[];
          status: "draft" | "published" | "archived";
          published_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          slug: string;
          short_description: string;
          full_description?: string;
          thumbnail_url?: string | null;
          difficulty?: "beginner" | "intermediate" | "advanced";
          category: string;
          tags?: string[];
          status?: "draft" | "published" | "archived";
          published_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          slug?: string;
          short_description?: string;
          full_description?: string;
          thumbnail_url?: string | null;
          difficulty?: "beginner" | "intermediate" | "advanced";
          category?: string;
          tags?: string[];
          status?: "draft" | "published" | "archived";
          published_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      course_sections: {
        Row: {
          id: string;
          course_id: string;
          title: string;
          description: string | null;
          order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          course_id: string;
          title: string;
          description?: string | null;
          order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          course_id?: string;
          title?: string;
          description?: string | null;
          order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      lectures: {
        Row: {
          id: string;
          section_id: string;
          title: string;
          slug: string;
          description: string | null;
          video_url: string | null;
          notes_pdf_url: string | null;
          order: number;
          status: "draft" | "published";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          section_id: string;
          title: string;
          slug: string;
          description?: string | null;
          video_url?: string | null;
          notes_pdf_url?: string | null;
          order?: number;
          status?: "draft" | "published";
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          section_id?: string;
          title?: string;
          slug?: string;
          description?: string | null;
          video_url?: string | null;
          notes_pdf_url?: string | null;
          order?: number;
          status?: "draft" | "published";
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      quizzes: {
        Row: {
          id: string;
          lecture_id: string;
          title: string;
          passing_percentage: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          lecture_id: string;
          title: string;
          passing_percentage?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          lecture_id?: string;
          title?: string;
          passing_percentage?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      quiz_questions: {
        Row: {
          id: string;
          quiz_id: string;
          question: string;
          option_a: string;
          option_b: string;
          option_c: string;
          option_d: string;
          correct_option: "A" | "B" | "C" | "D";
          explanation: string | null;
          order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          quiz_id: string;
          question: string;
          option_a: string;
          option_b: string;
          option_c: string;
          option_d: string;
          correct_option: "A" | "B" | "C" | "D";
          explanation?: string | null;
          order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          quiz_id?: string;
          question?: string;
          option_a?: string;
          option_b?: string;
          option_c?: string;
          option_d?: string;
          correct_option?: "A" | "B" | "C" | "D";
          explanation?: string | null;
          order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      tasks: {
        Row: {
          id: string;
          lecture_id: string;
          title: string;
          description: string;
          difficulty: "easy" | "medium" | "hard";
          order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          lecture_id: string;
          title: string;
          description: string;
          difficulty?: "easy" | "medium" | "hard";
          order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          lecture_id?: string;
          title?: string;
          description?: string;
          difficulty?: "easy" | "medium" | "hard";
          order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      homepage_settings: {
        Row: {
          id: string;
          hero_title: string;
          hero_subtitle: string;
          hero_badge: string | null;
          hero_primary_btn_text: string | null;
          hero_primary_btn_url: string | null;
          hero_secondary_btn_text: string | null;
          hero_secondary_btn_url: string | null;
          hero_media_type: "logo" | "image" | "video" | "illustration" | "none";
          hero_media_url: string | null;
          seo_title: string | null;
          seo_description: string | null;
          og_image_url: string | null;
          keywords: string | null;
          canonical_url: string | null;
          favicon_url: string | null;
          theme_primary: string | null;
          theme_accent: string | null;
          theme_radius: string | null;
          visibility_flags: Json;
          footer_description: string | null;
          copyright_text: string | null;
          footer_links: Json;
          social_links: Json;
          feature_cards: Json;
          updated_at: string;
        };
        Insert: {
          id?: string;
          hero_title: string;
          hero_subtitle?: string;
          hero_badge?: string | null;
          hero_primary_btn_text?: string | null;
          hero_primary_btn_url?: string | null;
          hero_secondary_btn_text?: string | null;
          hero_secondary_btn_url?: string | null;
          hero_media_type?: "logo" | "image" | "video" | "illustration" | "none";
          hero_media_url?: string | null;
          seo_title?: string | null;
          seo_description?: string | null;
          og_image_url?: string | null;
          keywords?: string | null;
          canonical_url?: string | null;
          favicon_url?: string | null;
          theme_primary?: string | null;
          theme_accent?: string | null;
          theme_radius?: string | null;
          visibility_flags?: Json;
          footer_description?: string | null;
          copyright_text?: string | null;
          footer_links?: Json;
          social_links?: Json;
          feature_cards?: Json;
          updated_at?: string;
        };
        Update: {
          id?: string;
          hero_title?: string;
          hero_subtitle?: string;
          hero_badge?: string | null;
          hero_primary_btn_text?: string | null;
          hero_primary_btn_url?: string | null;
          hero_secondary_btn_text?: string | null;
          hero_secondary_btn_url?: string | null;
          hero_media_type?: "logo" | "image" | "video" | "illustration" | "none";
          hero_media_url?: string | null;
          seo_title?: string | null;
          seo_description?: string | null;
          og_image_url?: string | null;
          keywords?: string | null;
          canonical_url?: string | null;
          favicon_url?: string | null;
          theme_primary?: string | null;
          theme_accent?: string | null;
          theme_radius?: string | null;
          visibility_flags?: Json;
          footer_description?: string | null;
          copyright_text?: string | null;
          footer_links?: Json;
          social_links?: Json;
          feature_cards?: Json;
          updated_at?: string;
        };
        Relationships: [];
      };
      homepage_navigation: {
        Row: {
          id: string;
          label: string;
          url: string;
          order: number;
          is_hidden: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          label: string;
          url: string;
          order?: number;
          is_hidden?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          label?: string;
          url?: string;
          order?: number;
          is_hidden?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      homepage_highlights: {
        Row: {
          id: string;
          icon: string;
          title: string;
          description: string;
          order: number;
          is_hidden: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          icon: string;
          title: string;
          description: string;
          order?: number;
          is_hidden?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          icon?: string;
          title?: string;
          description?: string;
          order?: number;
          is_hidden?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      homepage_products: {
        Row: {
          id: string;
          title: string;
          description: string;
          status: "active" | "coming_soon" | "beta" | "new" | "updated" | "maintenance";
          logo_url: string | null;
          button_text: string;
          button_url: string;
          order: number;
          is_hidden: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description: string;
          status?: "active" | "coming_soon" | "beta" | "new" | "updated" | "maintenance";
          logo_url?: string | null;
          button_text?: string;
          button_url?: string;
          order?: number;
          is_hidden?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string;
          status?: "active" | "coming_soon" | "beta" | "new" | "updated" | "maintenance";
          logo_url?: string | null;
          button_text?: string;
          button_url?: string;
          order?: number;
          is_hidden?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      homepage_footer_sections: {
        Row: {
          id: string;
          title: string;
          order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      homepage_footer_links: {
        Row: {
          id: string;
          section_id: string;
          label: string;
          url: string;
          order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          section_id: string;
          label: string;
          url: string;
          order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          section_id?: string;
          label?: string;
          url?: string;
          order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      homepage_announcements: {
        Row: {
          id: string;
          title: string;
          badge_text: string | null;
          link_text: string | null;
          link_url: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          badge_text?: string | null;
          link_text?: string | null;
          link_url?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          badge_text?: string | null;
          link_text?: string | null;
          link_url?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never
    };
    Functions: {
      [_ in never]: never
    };
    Enums: {
      [_ in never]: never
    };
    CompositeTypes: {
      [_ in never]: never
    };
  };
};
