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
    };
  };
}
