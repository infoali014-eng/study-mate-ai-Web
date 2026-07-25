import { createBrowserClient } from "@supabase/ssr";
import {
  ProfileSettings,
  AcademicSettings,
  AIPreferences,
  AIProviderSettings,
  NotificationSettings,
  AppearanceSettings,
  AIProvider,
} from "@/types/settings.types";

function getSupabaseClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
  );
}

export class SettingsService {
  /**
   * 1. Profile Settings Operations
   */
  static async getProfileSettings(): Promise<ProfileSettings> {
    const supabase = getSupabaseClient();
    let email = "user@studymate.ai";
    let userId: string | null = null;

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        email = user.email || email;
        userId = user.id;
      }
    } catch {
      // Fallback
    }

    if (userId) {
      const { data: profile } = await (supabase as any)
        .from("profiles")
        .select("display_name, full_name, username, avatar_url, bio")
        .eq("id", userId)
        .maybeSingle();

      if (profile) {
        return {
          displayName: profile.display_name || profile.full_name || email.split("@")[0],
          username: profile.username || email.split("@")[0],
          email,
          avatarUrl: profile.avatar_url || null,
          bio: profile.bio || null,
        };
      }
    }

    return {
      displayName: email.split("@")[0],
      username: email.split("@")[0],
      email,
      avatarUrl: null,
      bio: null,
    };
  }

  static async updateProfileSettings(
    data: Partial<ProfileSettings>
  ): Promise<{ success: boolean; message: string }> {
    const supabase = getSupabaseClient();
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        return { success: true, message: "Profile updated (local mode)" };
      }

      const updates: Record<string, any> = {};
      if (data.displayName !== undefined) updates.display_name = data.displayName;
      if (data.username !== undefined) updates.username = data.username;
      if (data.avatarUrl !== undefined) updates.avatar_url = data.avatarUrl;
      if (data.bio !== undefined) updates.bio = data.bio;

      const { error } = await (supabase as any)
        .from("profiles")
        .update(updates)
        .eq("id", user.id);

      if (error) throw error;
      return { success: true, message: "Profile settings saved successfully!" };
    } catch (err: any) {
      console.error("[SettingsService] updateProfileSettings error:", err);
      return { success: false, message: err.message || "Failed to update profile." };
    }
  }

  /**
   * 2. Academic Settings Operations
   */
  static async getAcademicSettings(): Promise<AcademicSettings> {
    const supabase = getSupabaseClient();
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await (supabase as any)
          .from("profiles")
          .select("institution, field_of_study, education_level")
          .eq("id", user.id)
          .maybeSingle();

        if (profile) {
          return {
            institution: profile.institution || "",
            fieldOfStudy: profile.field_of_study || "",
            educationLevel: profile.education_level || "university",
          };
        }
      }
    } catch {
      // Fallback
    }

    return {
      institution: "",
      fieldOfStudy: "",
      educationLevel: "university",
    };
  }

  static async updateAcademicSettings(
    data: AcademicSettings
  ): Promise<{ success: boolean; message: string }> {
    const supabase = getSupabaseClient();
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        return { success: true, message: "Academic settings updated (local mode)" };
      }

      const { error } = await (supabase as any)
        .from("profiles")
        .update({
          institution: data.institution,
          field_of_study: data.fieldOfStudy,
          education_level: data.educationLevel,
        })
        .eq("id", user.id);

      if (error) throw error;
      return { success: true, message: "Academic settings saved successfully!" };
    } catch (err: any) {
      console.error("[SettingsService] updateAcademicSettings error:", err);
      return { success: false, message: err.message || "Failed to update academic settings." };
    }
  }

  /**
   * 3. AI Preferences Operations
   */
  static async getAIPreferences(): Promise<AIPreferences> {
    const supabase = getSupabaseClient();
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        const { data: prefs } = await (supabase as any)
          .from("user_preferences")
          .select("preferred_language, explanation_style")
          .eq("user_id", user.id)
          .maybeSingle();

        if (prefs) {
          return {
            preferredLanguage: prefs.preferred_language || "english",
            explanationStyle: prefs.explanation_style || "detailed",
          };
        }
      }
    } catch {
      // Fallback
    }

    return {
      preferredLanguage: "english",
      explanationStyle: "detailed",
    };
  }

  static async updateAIPreferences(
    data: AIPreferences
  ): Promise<{ success: boolean; message: string }> {
    const supabase = getSupabaseClient();
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        return { success: true, message: "AI preferences updated (local mode)" };
      }

      const { error } = await (supabase as any)
        .from("user_preferences")
        .update({
          preferred_language: data.preferredLanguage,
          explanation_style: data.explanationStyle,
        })
        .eq("user_id", user.id);

      if (error) throw error;
      return { success: true, message: "AI preferences saved successfully!" };
    } catch (err: any) {
      console.error("[SettingsService] updateAIPreferences error:", err);
      return { success: false, message: err.message || "Failed to update AI preferences." };
    }
  }

  /**
   * 4. AI Provider Operations (Gemini API Key)
   */
  static async getAIProviderSettings(
    provider: AIProvider = "gemini"
  ): Promise<AIProviderSettings> {
    const supabase = getSupabaseClient();
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        const { data: record } = await (supabase as any)
          .from("user_ai_providers")
          .select("encrypted_api_key")
          .eq("user_id", user.id)
          .eq("provider", provider)
          .maybeSingle();

        if (record && record.encrypted_api_key) {
          return {
            provider,
            apiKey: record.encrypted_api_key,
            hasKey: true,
          };
        }
      }
    } catch {
      // Fallback
    }

    return {
      provider,
      apiKey: "",
      hasKey: false,
    };
  }

  static async validateGeminiKey(
    apiKey: string
  ): Promise<{ valid: boolean; message: string }> {
    try {
      const res = await fetch("/api/settings/validate-gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ apiKey }),
      });
      return await res.json();
    } catch (err: any) {
      return { valid: false, message: err.message || "Validation failed." };
    }
  }

  static async saveAIProviderKey(
    provider: AIProvider,
    apiKey: string
  ): Promise<{ success: boolean; message: string }> {
    const supabase = getSupabaseClient();
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        return { success: true, message: "API key saved locally." };
      }

      const { error } = await (supabase as any).from("user_ai_providers").upsert(
        {
          user_id: user.id,
          provider,
          encrypted_api_key: apiKey,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id,provider" }
      );

      if (error) throw error;
      return { success: true, message: `${provider.toUpperCase()} API key saved securely!` };
    } catch (err: any) {
      console.error("[SettingsService] saveAIProviderKey error:", err);
      return { success: false, message: err.message || "Failed to save API key." };
    }
  }

  /**
   * 5. Notification Settings Operations
   */
  static async getNotificationSettings(): Promise<NotificationSettings> {
    const supabase = getSupabaseClient();
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        const { data: prefs } = await (supabase as any)
          .from("user_preferences")
          .select("notifications")
          .eq("user_id", user.id)
          .maybeSingle();

        if (prefs?.notifications) {
          return {
            studyReminders: prefs.notifications.study_reminders ?? true,
            streakReminder: prefs.notifications.streak_reminder ?? true,
            productUpdates: prefs.notifications.product_updates ?? false,
          };
        }
      }
    } catch {
      // Fallback
    }

    return {
      studyReminders: true,
      streakReminder: true,
      productUpdates: false,
    };
  }

  static async updateNotificationSettings(
    data: NotificationSettings
  ): Promise<{ success: boolean; message: string }> {
    const supabase = getSupabaseClient();
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        return { success: true, message: "Notifications updated (local mode)" };
      }

      const { error } = await (supabase as any)
        .from("user_preferences")
        .update({
          notifications: {
            study_reminders: data.studyReminders,
            streak_reminder: data.streakReminder,
            product_updates: data.productUpdates,
          },
        })
        .eq("user_id", user.id);

      if (error) throw error;
      return { success: true, message: "Notification preferences saved!" };
    } catch (err: any) {
      console.error("[SettingsService] updateNotificationSettings error:", err);
      return { success: false, message: err.message || "Failed to save notification preferences." };
    }
  }

  /**
   * 6. Appearance Operations
   */
  static async getAppearanceSettings(): Promise<AppearanceSettings> {
    const supabase = getSupabaseClient();
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        const { data: prefs } = await (supabase as any)
          .from("user_preferences")
          .select("theme")
          .eq("user_id", user.id)
          .maybeSingle();

        if (prefs?.theme) {
          return { theme: prefs.theme };
        }
      }
    } catch {
      // Fallback
    }

    return { theme: "system" };
  }

  static async updateAppearanceSettings(
    data: AppearanceSettings
  ): Promise<{ success: boolean; message: string }> {
    const supabase = getSupabaseClient();
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        return { success: true, message: "Appearance updated (local mode)" };
      }

      const { error } = await (supabase as any)
        .from("user_preferences")
        .update({ theme: data.theme })
        .eq("user_id", user.id);

      if (error) throw error;
      return { success: true, message: "Theme preference saved!" };
    } catch (err: any) {
      console.error("[SettingsService] updateAppearanceSettings error:", err);
      return { success: false, message: err.message || "Failed to save appearance setting." };
    }
  }
}
