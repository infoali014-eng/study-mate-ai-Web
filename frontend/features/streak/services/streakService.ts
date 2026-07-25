import { createBrowserClient } from "@supabase/ssr";
import { UserStreak, DailyActivity, DayActivityStatus, StreakActivityType } from "../types/streak.types";
import { STREAK_POINTS, MAX_DAILY_POINTS } from "../constants/streak.constants";

const LOCAL_STREAK_KEY = "mrowl_guest_user_streak";

function getSupabaseClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
  );
}

function getTodayString(): string {
  const today = new Date();
  return today.toISOString().split("T")[0];
}

function getLocalStreak(todayStr: string): UserStreak {
  if (typeof window === "undefined") {
    return {
      id: "local",
      user_id: "guest",
      current_streak: 0,
      best_streak: 0,
      today_points: 0,
      today_completed: false,
      last_completed_date: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
  }

  const raw = localStorage.getItem(LOCAL_STREAK_KEY);
  if (raw) {
    try {
      const parsed: UserStreak = JSON.parse(raw);
      if (parsed.last_completed_date !== todayStr) {
        if (parsed.last_completed_date) {
          const last = new Date(parsed.last_completed_date);
          const current = new Date(todayStr);
          const diffDays = Math.round((current.getTime() - last.getTime()) / (1000 * 3600 * 24));
          if (diffDays > 1) {
            parsed.current_streak = 0;
          }
        }
        parsed.today_points = 0;
        parsed.today_completed = false;
        localStorage.setItem(LOCAL_STREAK_KEY, JSON.stringify(parsed));
      }
      return parsed;
    } catch {
      // Fallback
    }
  }

  const initial: UserStreak = {
    id: "local",
    user_id: "guest",
    current_streak: 0,
    best_streak: 0,
    today_points: 0,
    today_completed: false,
    last_completed_date: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  localStorage.setItem(LOCAL_STREAK_KEY, JSON.stringify(initial));
  return initial;
}

function saveLocalStreak(streak: UserStreak) {
  if (typeof window !== "undefined") {
    localStorage.setItem(LOCAL_STREAK_KEY, JSON.stringify(streak));
  }
}

export class StreakService {
  /**
   * Fetches or initializes user's streak record.
   * Handles daily reset if starting a new calendar day.
   */
  static async getUserStreak(): Promise<UserStreak> {
    const todayStr = getTodayString();
    const supabase = getSupabaseClient();

    let targetUserId = "guest";
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) targetUserId = user.id;
    } catch {
      targetUserId = "guest";
    }

    if (targetUserId === "guest") {
      return getLocalStreak(todayStr);
    }

    // Authenticated user query
    const { data: existingStreak } = await (supabase as any)
      .from("user_streaks")
      .select("*")
      .eq("user_id", targetUserId)
      .maybeSingle();

    if (!existingStreak) {
      const { data: newStreak, error } = await (supabase as any)
        .from("user_streaks")
        .insert({
          user_id: targetUserId,
          current_streak: 0,
          best_streak: 0,
          today_points: 0,
          today_completed: false,
          last_completed_date: null,
        })
        .select()
        .single();

      if (error) {
        console.error("[StreakService] Error creating user streak:", error);
        return getLocalStreak(todayStr);
      }
      return newStreak;
    }

    let streak = existingStreak as UserStreak;

    // Daily reset check: If today is a new calendar day compared to last_completed_date
    if (streak.last_completed_date !== todayStr) {
      let streakBroken = false;
      if (streak.last_completed_date) {
        const lastDate = new Date(streak.last_completed_date);
        const today = new Date(todayStr);
        const diffDays = Math.round((today.getTime() - lastDate.getTime()) / (1000 * 3600 * 24));
        if (diffDays > 1) {
          streakBroken = true;
        }
      }

      const newCurrentStreak = streakBroken ? 0 : streak.current_streak;

      // Reset today_completed to false and today_points to 0 for the new day
      const { data: resetStreak } = await (supabase as any)
        .from("user_streaks")
        .update({
          current_streak: newCurrentStreak,
          today_points: 0,
          today_completed: false,
        })
        .eq("user_id", targetUserId)
        .select()
        .single();

      if (resetStreak) {
        streak = resetStreak;
      } else {
        streak = {
          ...streak,
          current_streak: newCurrentStreak,
          today_points: 0,
          today_completed: false,
        };
      }
    }

    return streak;
  }

  /**
   * Fetches current week's (Mon-Sun) daily activity status.
   */
  static async getWeeklyHistory(): Promise<DayActivityStatus[]> {
    const supabase = getSupabaseClient();
    const today = new Date();
    const todayStr = getTodayString();

    let targetUserId = "guest";
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) targetUserId = user.id;
    } catch {
      targetUserId = "guest";
    }

    const currentDayOfWeek = today.getDay(); // 0 = Sun, 1 = Mon...
    const distanceToMonday = (currentDayOfWeek + 6) % 7;

    const monday = new Date(today);
    monday.setDate(today.getDate() - distanceToMonday);

    const weekDates: string[] = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      weekDates.push(d.toISOString().split("T")[0]);
    }

    let recordsMap = new Map<string, DailyActivity>();

    if (targetUserId !== "guest") {
      const { data: records } = await (supabase as any)
        .from("daily_activity")
        .select("*")
        .eq("user_id", targetUserId)
        .in("activity_date", weekDates);

      (records || []).forEach((rec: DailyActivity) => {
        recordsMap.set(rec.activity_date, rec);
      });
    } else if (typeof window !== "undefined") {
      const localDailyRaw = localStorage.getItem(`mrowl_daily_${todayStr}`);
      if (localDailyRaw) {
        try {
          const rec: DailyActivity = JSON.parse(localDailyRaw);
          recordsMap.set(rec.activity_date, rec);
        } catch {
          // Fallback
        }
      }
    }

    const dayLabels = ["M", "T", "W", "T", "F", "S", "S"];
    const fullDayNames = [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ];

    return weekDates.map((dateStr, idx) => {
      const rec = recordsMap.get(dateStr);
      const isToday = dateStr === todayStr;
      const isFuture = dateStr > todayStr;
      const isCompleted = rec ? rec.completed || rec.total_points > 0 : false;
      const isMissed = !isFuture && !isToday && !isCompleted;

      return {
        date: dateStr,
        dayLabel: dayLabels[idx],
        fullDayName: fullDayNames[idx],
        isCompleted,
        isToday,
        isFuture,
        isMissed,
        points: rec ? rec.total_points : 0,
        chatPoints: rec ? rec.chat_points : 0,
        sessionPoints: rec ? rec.session_points : 0,
        uploadPoints: rec ? rec.upload_points : 0,
        previewPoints: rec ? rec.preview_points : 0,
      };
    });
  }

  /**
   * Records an activity action and updates daily score & streak.
   * Streak updates if ANY activity is completed!
   */
  static async recordActivity(
    type: StreakActivityType
  ): Promise<{ newlyCompleted: boolean; currentStreak: number; totalPoints: number }> {
    const supabase = getSupabaseClient();
    const todayStr = getTodayString();

    let targetUserId = "guest";
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) targetUserId = user.id;
    } catch {
      targetUserId = "guest";
    }

    let daily: DailyActivity;

    if (targetUserId !== "guest") {
      const { data: existingDaily } = await (supabase as any)
        .from("daily_activity")
        .select("*")
        .eq("user_id", targetUserId)
        .eq("activity_date", todayStr)
        .maybeSingle();

      if (!existingDaily) {
        const { data: newDaily } = await (supabase as any)
          .from("daily_activity")
          .insert({
            user_id: targetUserId,
            activity_date: todayStr,
            chat_points: 0,
            session_points: 0,
            upload_points: 0,
            preview_points: 0,
            total_points: 0,
            completed: false,
          })
          .select()
          .single();
        daily = newDaily;
      } else {
        daily = existingDaily;
      }
    } else {
      // Guest local storage daily activity
      const localKey = `mrowl_daily_${todayStr}`;
      const raw = typeof window !== "undefined" ? localStorage.getItem(localKey) : null;
      if (raw) {
        daily = JSON.parse(raw);
      } else {
        daily = {
          id: "local_daily",
          user_id: "guest",
          activity_date: todayStr,
          chat_points: 0,
          session_points: 0,
          upload_points: 0,
          preview_points: 0,
          total_points: 0,
          completed: false,
          created_at: new Date().toISOString(),
        };
      }
    }

    // Determine point increase based on activity type
    let chatPts = daily.chat_points;
    let sessionPts = daily.session_points;
    let uploadPts = daily.upload_points;
    let previewPts = daily.preview_points;

    let pointsAwarded = 0;
    if (type === "chat" && chatPts < STREAK_POINTS.CHAT) {
      pointsAwarded = STREAK_POINTS.CHAT - chatPts;
      chatPts = STREAK_POINTS.CHAT;
    } else if (type === "session" && sessionPts < STREAK_POINTS.SESSION) {
      pointsAwarded = STREAK_POINTS.SESSION - sessionPts;
      sessionPts = STREAK_POINTS.SESSION;
    } else if (type === "upload" && uploadPts < STREAK_POINTS.UPLOAD) {
      pointsAwarded = STREAK_POINTS.UPLOAD - uploadPts;
      uploadPts = STREAK_POINTS.UPLOAD;
    } else if (type === "preview" && previewPts < STREAK_POINTS.PREVIEW) {
      pointsAwarded = STREAK_POINTS.PREVIEW - previewPts;
      previewPts = STREAK_POINTS.PREVIEW;
    }

    if (pointsAwarded === 0) {
      // Activity type points already awarded today
      const currentStreakRecord = await StreakService.getUserStreak();
      return {
        newlyCompleted: false,
        currentStreak: currentStreakRecord.current_streak,
        totalPoints: daily.total_points,
      };
    }

    const newTotalPoints = Math.min(
      MAX_DAILY_POINTS,
      chatPts + sessionPts + uploadPts + previewPts
    );
    const isNowCompleted = newTotalPoints > 0;

    daily.chat_points = chatPts;
    daily.session_points = sessionPts;
    daily.upload_points = uploadPts;
    daily.preview_points = previewPts;
    daily.total_points = newTotalPoints;
    daily.completed = isNowCompleted;

    if (targetUserId !== "guest") {
      await (supabase as any)
        .from("daily_activity")
        .update({
          chat_points: chatPts,
          session_points: sessionPts,
          upload_points: uploadPts,
          preview_points: previewPts,
          total_points: newTotalPoints,
          completed: isNowCompleted,
        })
        .eq("id", daily.id);
    } else if (typeof window !== "undefined") {
      localStorage.setItem(`mrowl_daily_${todayStr}`, JSON.stringify(daily));
    }

    // Update user_streaks
    const currentStreakRecord = await StreakService.getUserStreak();
    let newlyCompleted = false;
    let updatedStreakCount = currentStreakRecord.current_streak;

    if (isNowCompleted && !currentStreakRecord.today_completed) {
      newlyCompleted = true;
      updatedStreakCount = currentStreakRecord.current_streak + 1;
      const updatedBestStreak = Math.max(currentStreakRecord.best_streak, updatedStreakCount);

      if (targetUserId !== "guest") {
        await (supabase as any)
          .from("user_streaks")
          .update({
            current_streak: updatedStreakCount,
            best_streak: updatedBestStreak,
            today_points: newTotalPoints,
            today_completed: true,
            last_completed_date: todayStr,
          })
          .eq("user_id", targetUserId);
      } else {
        saveLocalStreak({
          ...currentStreakRecord,
          current_streak: updatedStreakCount,
          best_streak: updatedBestStreak,
          today_points: newTotalPoints,
          today_completed: true,
          last_completed_date: todayStr,
        });
      }
    } else {
      if (targetUserId !== "guest") {
        await (supabase as any)
          .from("user_streaks")
          .update({
            today_points: newTotalPoints,
          })
          .eq("user_id", targetUserId);
      } else {
        saveLocalStreak({
          ...currentStreakRecord,
          today_points: newTotalPoints,
        });
      }
    }

    return {
      newlyCompleted,
      currentStreak: updatedStreakCount,
      totalPoints: newTotalPoints,
    };
  }
}
