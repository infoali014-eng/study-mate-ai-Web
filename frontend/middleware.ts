import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  const isProtectedAppRoute =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/library") ||
    pathname.startsWith("/quiz") ||
    pathname.startsWith("/flashcards") ||
    pathname.startsWith("/planner") ||
    pathname.startsWith("/chat") ||
    pathname.startsWith("/mr-owl");

  const isOnboardingRoute = pathname === "/onboarding";
  const isAuthRoute = pathname === "/login" || pathname === "/signup";
  const isAdminRoute = pathname.startsWith("/admin");
  const isAccessDeniedRoute = pathname === "/access-denied";

  // Skip middleware execution if not a protected route, onboarding, login/signup, or admin
  if (!isProtectedAppRoute && !isOnboardingRoute && !isAuthRoute && !isAdminRoute && !isAccessDeniedRoute) {
    return NextResponse.next();
  }

  const { response, user, supabase } = await updateSession(request);

  console.log(`[Middleware] Path: ${pathname} | Auth User: ${user?.id ?? "None"}`);

  // 1. Unauthenticated User Flow
  if (!user) {
    if (isProtectedAppRoute || isOnboardingRoute || isAdminRoute) {
      console.log(`[Middleware] Unauthenticated access to ${pathname} -> Redirecting to /login`);
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = "/login";
      return NextResponse.redirect(redirectUrl);
    }
    return response;
  }

  // 2. Authenticated User Flow — Strict Database Role Checking
  if (supabase) {
    try {
      const queryTimeout = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Timeout")), 2500)
      );

      // Query database role from public.profiles
      const { data: profile } = (await Promise.race([
        supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .maybeSingle(),
        queryTimeout,
      ])) as any;

      const userRole = profile?.role || user.user_metadata?.role || user.app_metadata?.role || "student";
      const isAdmin = userRole === "admin";
      const hasBuddyAccess = userRole === "buddy" || userRole === "admin";

      console.log(`[Middleware] User: ${user.id} | Database Role: ${userRole} | BuddyAccess: ${hasBuddyAccess}`);

      // 2a. Admin Route Protection — Only Admin can access /admin
      if (isAdminRoute && !isAdmin) {
        console.log(`[Middleware] Non-admin user ${user.id} (role: ${userRole}) tried to access admin route ${pathname} -> Redirecting to /`);
        const redirectUrl = request.nextUrl.clone();
        redirectUrl.pathname = "/";
        return NextResponse.redirect(redirectUrl);
      }

      // 2b. StudyMate AI App Access Protection — Only Buddy or Admin can access StudyMate AI!
      if ((isProtectedAppRoute || isOnboardingRoute) && !hasBuddyAccess) {
        console.log(`[Middleware] User ${user.id} without Buddy role (role: ${userRole}) tried to access ${pathname} -> Redirecting to /access-denied`);
        const redirectUrl = request.nextUrl.clone();
        redirectUrl.pathname = "/access-denied";
        return NextResponse.redirect(redirectUrl);
      }

      // If user has Buddy access and is on /access-denied, redirect to /dashboard
      if (isAccessDeniedRoute && hasBuddyAccess) {
        const redirectUrl = request.nextUrl.clone();
        redirectUrl.pathname = isAdmin ? "/admin" : "/dashboard";
        return NextResponse.redirect(redirectUrl);
      }

      // Check Onboarding Completion
      const { data: onboarding } = (await Promise.race([
        supabase
          .from("user_onboarding")
          .select("completed")
          .eq("user_id", user.id)
          .maybeSingle(),
        queryTimeout,
      ])) as any;

      const isCompleted = onboarding?.completed ?? false;

      // Redirect logged-in users away from /login and /signup
      if (isAuthRoute) {
        const redirectUrl = request.nextUrl.clone();
        if (!hasBuddyAccess) {
          redirectUrl.pathname = "/access-denied";
        } else {
          redirectUrl.pathname = isAdmin ? "/admin" : (isCompleted ? "/dashboard" : "/onboarding");
        }
        return NextResponse.redirect(redirectUrl);
      }

      // Force incomplete onboarding users to complete it if they have Buddy access
      if (isProtectedAppRoute && !isCompleted && hasBuddyAccess) {
        const redirectUrl = request.nextUrl.clone();
        redirectUrl.pathname = "/onboarding";
        return NextResponse.redirect(redirectUrl);
      }

      // Prevent completed onboarding users from returning to /onboarding
      if (isOnboardingRoute && isCompleted && hasBuddyAccess) {
        const redirectUrl = request.nextUrl.clone();
        redirectUrl.pathname = "/dashboard";
        return NextResponse.redirect(redirectUrl);
      }
    } catch (err) {
      console.error("[Middleware] Role verification query error:", err);
    }
  }

  // Enforce security headers
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");

  return response;
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/library/:path*",
    "/quiz/:path*",
    "/flashcards/:path*",
    "/planner/:path*",
    "/chat/:path*",
    "/mr-owl/:path*",
    "/onboarding",
    "/access-denied",
    "/login",
    "/signup",
    "/admin/:path*",
    "/admin",
  ],
};
