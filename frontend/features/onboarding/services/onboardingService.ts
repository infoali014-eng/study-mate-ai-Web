import { supabase } from "@/lib/supabase/client";
import { OnboardingAnswers } from "../types/onboarding.types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function submitOnboardingService(
  answers: OnboardingAnswers
): Promise<{ success: boolean; error?: string }> {
  try {
    let session = (await supabase.auth.getSession()).data.session;
    if (!session) {
      const refreshed = await supabase.auth.refreshSession();
      session = refreshed.data.session;
    }

    if (!session) {
      return { success: false, error: "Authentication session expired. Please log in again." };
    }

    // 1. Try Backend FastAPI API endpoint
    try {
      const response = await fetch(`${API_URL}/api/v1/onboarding/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${session.access_token}`,
        },
        body: JSON.stringify(answers),
      });

      if (response.ok) {
        return { success: true };
      }
    } catch {
      // FastAPI backend offline or network error; proceed to direct Supabase fallback
    }

    // 2. Direct Supabase JS Client Fallback
    const userId = session.user.id;

    const studyMap: Record<string, [number, number]> = {
      "30_min": [30, 0.5],
      "1_hour": [60, 1.0],
      "2_hours": [120, 2.0],
      "4_hours": [240, 4.0],
      "6_plus_hours": [360, 6.0],
    };
    const [goalMins, goalHrs] = studyMap[answers.dailyStudyTime] || [30, 0.5];

    // Update user_onboarding
    await (supabase.from("user_onboarding") as any).upsert({
      user_id: userId,
      education: answers.education,
      primary_goal: Array.isArray(answers.primaryGoals) ? answers.primaryGoals.join(", ") : answers.primaryGoals,
      heard_from: answers.heardFrom,
      interests: answers.interests || [],
      subjects: answers.subjects || [],
      next_exam: answers.nextExam || null,
      completed: true,
      completed_at: new Date().toISOString(),
    });

    // Update user_preferences
    await (supabase.from("user_preferences") as any).upsert({
      user_id: userId,
      learning_style: answers.learningStyles?.[0] || "visual",
      daily_study_goal: goalMins,
      daily_study_hours: goalHrs,
      dashboard_focus: answers.dashboardFocus || "dashboard",
    });

    // Update profiles
    await (supabase.from("profiles") as any).upsert({
      id: userId,
      profile_completion: 100,
      last_active_at: new Date().toISOString(),
    });

    return { success: true };
  } catch (err: unknown) {
    const errMsg = err instanceof Error ? err.message : "Network error. Please try again.";
    return {
      success: false,
      error: errMsg,
    };
  }
}
