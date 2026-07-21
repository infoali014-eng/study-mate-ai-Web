import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Database } from "@/lib/supabase/types";

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

  // Skip middleware execution if route is not protected or login/signup
  if (!isDashboardRoute && !isOnboardingRoute && !isAuthRoute) {
    return NextResponse.next();
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return NextResponse.next();
  }

  const cookieHeader = request.headers.get("cookie") || "";
  const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
    },
    global: {
      headers: {
        Cookie: cookieHeader,
      },
    },
  });

  const { data: { user } } = await supabase.auth.getUser();

  // 1. Unauthenticated User Flow
  if (!user) {
    if (isDashboardRoute || isOnboardingRoute) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = "/login";
      return NextResponse.redirect(redirectUrl);
    }
    return NextResponse.next();
  }

  // 2. Authenticated User Flow
  try {
    const queryTimeout = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Timeout")), 2500)
    );

    const { data: onboarding } = (await Promise.race([
      supabase.from("user_onboarding").select("completed").eq("user_id", user.id).single(),
      queryTimeout
    ])) as any;

    const isCompleted = onboarding?.completed || false;

    // Redirect logged-in users away from /login and /signup
    if (isAuthRoute) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = isCompleted ? "/dashboard" : "/onboarding";
      return NextResponse.redirect(redirectUrl);
    }

    // Force incomplete onboarding users to complete it
    if (isDashboardRoute && !isCompleted) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = "/onboarding";
      return NextResponse.redirect(redirectUrl);
    }

    // Prevent completed onboarding users from returning to /onboarding
    if (isOnboardingRoute && isCompleted) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = "/dashboard";
      return NextResponse.redirect(redirectUrl);
    }
  } catch (err) {
    // Safe fallback if database queries error out
  }

  return NextResponse.next();
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
  ],
};
