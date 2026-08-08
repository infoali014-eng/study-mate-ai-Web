import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  const isDashboardRoute =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/library") ||
    pathname.startsWith("/quiz") ||
    pathname.startsWith("/flashcards") ||
    pathname.startsWith("/planner");
  const isOnboardingRoute = pathname === "/onboarding";
  const isAuthRoute = pathname === "/login" || pathname === "/signup";
  const isAdminRoute = pathname.startsWith("/admin");

  // Skip middleware execution if route is not protected, login/signup, or admin
  if (!isDashboardRoute && !isOnboardingRoute && !isAuthRoute && !isAdminRoute) {
    return NextResponse.next();
  }

  const { response, user, supabase } = await updateSession(request);

  console.log(`[Middleware] Path: ${pathname} | Auth User: ${user?.id ?? "None"}`);

  // 1. Unauthenticated User Flow
  if (!user) {
    if (isDashboardRoute || isOnboardingRoute || isAdminRoute) {
      console.log(`[Middleware] Unauthenticated access to ${pathname} -> Redirecting to /login`);
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = "/login";
      return NextResponse.redirect(redirectUrl);
    }
    return response;
  }

  // 2. Authenticated User Flow
  if (supabase) {
    try {
      const queryTimeout = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Timeout")), 2500)
      );

      // Verify admin privileges if accessing a protected route (admin or dashboard routes)
      const userRole = user.user_metadata?.role || user.app_metadata?.role;
      const isAdmin = userRole === "admin";

      if (isAdminRoute && !isAdmin) {
        console.log(`[Middleware] Non-admin user ${user.id} (role: ${userRole}) tried to access admin route ${pathname} -> Redirecting to homepage`);
        const redirectUrl = request.nextUrl.clone();
        redirectUrl.pathname = "/";
        return NextResponse.redirect(redirectUrl);
      }

      const { data: onboarding } = (await Promise.race([
        supabase
          .from("user_onboarding")
          .select("completed")
          .eq("user_id", user.id)
          .maybeSingle(),
        queryTimeout,
      ])) as any;

      const isCompleted = onboarding?.completed ?? false;
      console.log(`[Middleware] User: ${user.id} | Onboarding completed: ${isCompleted}`);

      // Redirect logged-in users away from /login and /signup
      if (isAuthRoute) {
        const redirectUrl = request.nextUrl.clone();
        redirectUrl.pathname = isAdmin ? "/admin" : (isCompleted ? "/dashboard" : "/");
        console.log(`[Middleware] Auth route access while logged in -> Redirecting to ${redirectUrl.pathname}`);
        return NextResponse.redirect(redirectUrl);
      }

      // Force incomplete onboarding users to complete it
      if (isDashboardRoute && !isCompleted) {
        console.log(`[Middleware] Dashboard access with incomplete onboarding -> Redirecting to /onboarding`);
        const redirectUrl = request.nextUrl.clone();
        redirectUrl.pathname = "/onboarding";
        return NextResponse.redirect(redirectUrl);
      }

      // Prevent completed onboarding users from returning to /onboarding
      if (isOnboardingRoute && isCompleted) {
        console.log(`[Middleware] Onboarding access while already completed -> Redirecting to /dashboard`);
        const redirectUrl = request.nextUrl.clone();
        redirectUrl.pathname = "/dashboard";
        return NextResponse.redirect(redirectUrl);
      }
    } catch (err) {
      console.error("[Middleware] Database query error or timeout:", err);
    }
  }

  // Enforce production security headers on all responses
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
    "/onboarding",
    "/login",
    "/signup",
    "/admin/:path*",
    "/admin",
  ],
};
