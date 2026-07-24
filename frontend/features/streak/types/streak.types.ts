export interface UserStreak {
  id: string;
  user_id: string;
  current_streak: number;
  best_streak: number;
  today_points: number;
  today_completed: boolean;
  last_completed_date: string | null;
  created_at: string;
  updated_at: string;
}

export interface DailyActivity {
  id: string;
  user_id: string;
  activity_date: string; // YYYY-MM-DD
  chat_points: number;     // Max 30
  session_points: number;  // Max 20
  upload_points: number;   // Max 30
  preview_points: number;  // Max 20
  total_points: number;    // Max 100
  completed: boolean;
  created_at: string;
}

export interface DayActivityStatus {
  date: string;         // YYYY-MM-DD
  dayLabel: string;     // M, T, W, T, F, S, S
  fullDayName: string;  // Monday, Tuesday...
  isCompleted: boolean;
  isToday: boolean;
  isFuture: boolean;
  isMissed: boolean;
  points: number;
  chatPoints?: number;
  sessionPoints?: number;
  uploadPoints?: number;
  previewPoints?: number;
}

export type StreakActivityType = "chat" | "session" | "upload" | "preview";
