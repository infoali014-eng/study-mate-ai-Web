export const STREAK_POINTS = {
  CHAT: 30,
  SESSION: 20,
  UPLOAD: 30,
  PREVIEW: 20,
} as const;

export const MAX_DAILY_POINTS = 100;
export const ACTIVE_SESSION_REQUIRED_SECONDS = 10 * 60; // 10 minutes (600 seconds)
