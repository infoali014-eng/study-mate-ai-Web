import { createBrowserClient } from "@supabase/ssr";
import { UserStreak, DailyActivity, DayActivityStatus, StreakActivityType } from "../types/streak.types";
import { STREAK_POINTS, MAX_DAILY_POINTS } from "../constants/streak.constants";

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

export class StreakService {
  /**
   * Fetches or initializes user's streak record.
   * Handles daily reset if user missed completing yesterday.
   */
  static async getUserStreak(): Promise<UserStreak> {
    const supabase = getSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const targetUserId = user?.id || "00000000-0000-0000-0000-000000000000";
    const todayStr = getTodayString();

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
        return {
          id: "temp",
          user_id: targetUserId,
          current_streak: 0,
          best_streak: 0,
          today_points: 0,
          today_completed: false,
          last_completed_date: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
      }
      return newStreak;
    }

    // Check if daily reset is required
    let streak = existingStreak as UserStreak;
    const lastDateStr = streak.last_completed_date;

    if (lastDateStr) {
      const lastDate = new Date(lastDateStr);
      const today = new Date(todayStr);
      const diffDays = Math.floor((today.getTime() - lastDate.getTime()) / (1000 * 3600 * 24));

      // If last completed date was before yesterday, streak broke! Reset current_streak = 0
      if (diffDays > 1 && streak.current_streak > 0) {
        console.log("[StreakService] Streak broken! Resetting current_streak to 0.");
        const { data: resetStreak } = await (supabase as any)
          .from("user_streaks")
          .update({
            current_streak: 0,
            today_points: 0,
            today_completed: false,
          })
          .eq("user_id", targetUserId)
          .select()
          .single();

        if (resetStreak) streak = resetStreak;
      }
    }

    return streak;
  }

  /**
   * Fetches current week's (Mon-Sun) daily activity status.
   */
  static async getWeeklyHistory(): Promise<DayActivityStatus[]> {
    const supabase = getSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const targetUserId = user?.id || "00000000-0000-0000-0000-000000000000";
    const today = new Date();
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

    const { data: records } = await (supabase as any)
      .from("daily_activity")
      .select("*")
      .eq("user_id", targetUserId)
      .in("activity_date", weekDates);

    const recordsMap = new Map<string, DailyActivity>();
    (records || []).forEach((rec: DailyActivity) => {
      recordsMap.set(rec.activity_date, rec);
    });

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

    const todayStr = getTodayString();

    return weekDates.map((dateStr, idx) => {
      const rec = recordsMap.get(dateStr);
      const isToday = dateStr === todayStr;
      const isFuture = dateStr > todayStr;
      // Streak completes on ANY activity (points > 0)
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
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const targetUserId = user?.id || "00000000-0000-0000-0000-000000000000";
    const todayStr = getTodayString();

    // 1. Get or create today's daily_activity row
    const { data: existingDaily } = await (supabase as any)
      .from("daily_activity")
      .select("*")
      .eq("user_id", targetUserId)
      .eq("activity_date", todayStr)
      .maybeSingle();

    let daily: DailyActivity;
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

    // 2. Determine point increase based on activity type
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
      // Activity type points already completed today
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
    // Any activity (total points > 0) qualifies today as completed for streak!
    const isNowCompleted = newTotalPoints > 0;

    // 3. Update daily_activity row
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

    // 4. Update user_streaks
    const currentStreakRecord = await StreakService.getUserStreak();
    let newlyCompleted = false;
    let updatedStreakCount = currentStreakRecord.current_streak;

    if (isNowCompleted && !currentStreakRecord.today_completed) {
      newlyCompleted = true;
      updatedStreakCount = currentStreakRecord.current_streak + 1;
      const updatedBestStreak = Math.max(currentStreakRecord.best_streak, updatedStreakCount);

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
      await (supabase as any)
        .from("user_streaks")
        .update({
          today_points: newTotalPoints,
        })
        .eq("user_id", targetUserId);
    }

    return {
      newlyCompleted,
      currentStreak: updatedStreakCount,
      totalPoints: newTotalPoints,
    };
  }
}
