import { supabase } from "@/lib/supabase/client";
import { OnboardingAnswers } from "../types/onboarding.types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function submitOnboardingService(
  answers: OnboardingAnswers
): Promise<{ success: boolean; error?: string }> {
  try {
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError || !session) {
      return { success: false, error: "Authentication session expired. Please log in again." };
    }

    const response = await fetch(`${API_URL}/api/v1/onboarding/submit`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${session.access_token}`,
      },
      body: JSON.stringify(answers),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        error: errorData.detail || `Server responded with status code ${response.status}`,
      };
    }

    return { success: true };
  } catch (err: unknown) {
    const errMsg = err instanceof Error ? err.message : "Network error. Please try again.";
    return {
      success: false,
      error: errMsg,
    };
  }
}
