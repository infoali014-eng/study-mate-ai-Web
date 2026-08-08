/**
 * Role & Permission helper for StudyMate AI / Deep Code
 */

const KNOWN_ADMIN_EMAILS = [
  "syedalishair51@gmail.com",
  "infoali014@gmail.com",
  "admin@studymate.ai",
  "admin@deepcode.com",
];

export function isAdminUser(user: { email?: string | null; user_metadata?: any; app_metadata?: any } | null, profileRole?: string | null): boolean {
  if (!user) return false;

  // 1. Check explicit profile role or auth metadata role
  const role = profileRole || user.app_metadata?.role || user.user_metadata?.role;
  if (role === "admin") return true;

  // 2. Check if user's email matches known admin emails or env configuration
  const email = (user.email || "").trim().toLowerCase();
  if (email && (KNOWN_ADMIN_EMAILS.includes(email) || (process.env.ADMIN_EMAIL && process.env.ADMIN_EMAIL.toLowerCase() === email))) {
    return true;
  }

  return false;
}

export function hasBuddyOrAdminAccess(user: { email?: string | null; user_metadata?: any; app_metadata?: any } | null, profileRole?: string | null): boolean {
  if (!user) return false;
  if (isAdminUser(user, profileRole)) return true;

  const role = profileRole || user.app_metadata?.role || user.user_metadata?.role;
  return role === "buddy" || role === "admin";
}
