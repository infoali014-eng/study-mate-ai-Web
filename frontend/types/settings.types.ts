export type EducationLevel = "school" | "college" | "university" | "self_learner";
export type PreferredLanguage = "english" | "urdu" | "both";
export type ExplanationStyle = "simple" | "detailed";
export type ThemeOption = "light" | "dark" | "system";
export type AIProvider = "gemini" | "openai" | "claude" | "grok";

export interface ProfileSettings {
  displayName: string;
  username: string;
  email: string;
  avatarUrl: string | null;
  bio: string | null;
}

export interface AcademicSettings {
  institution: string | null;
  fieldOfStudy: string | null;
  educationLevel: EducationLevel;
}

export interface AIPreferences {
  preferredLanguage: PreferredLanguage;
  explanationStyle: ExplanationStyle;
}

export interface AIProviderSettings {
  provider: AIProvider;
  apiKey: string;
  hasKey?: boolean;
}

export interface NotificationSettings {
  studyReminders: boolean;
  streakReminder: boolean;
  productUpdates: boolean;
}

export interface AppearanceSettings {
  theme: ThemeOption;
}
