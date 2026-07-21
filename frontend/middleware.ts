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

  if (!isDashboardRoute && !isOnboardingRoute) {
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

  if (!user) {
    // If not authenticated, redirect to /login
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/login";
    return NextResponse.redirect(redirectUrl);
  }

  try {
    // Check if user completed the onboarding wizard
    const { data: onboarding } = (await supabase
      .from("user_onboarding")
      .select("completed")
      .eq("user_id", user.id)
      .single()) as any;

    const isCompleted = onboarding?.completed || false;

    if (isDashboardRoute && !isCompleted) {
      // Incomplete onboarding redirect to /onboarding
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = "/onboarding";
      return NextResponse.redirect(redirectUrl);
    }

    if (isOnboardingRoute && isCompleted) {
      // Completed onboarding redirect to main /dashboard
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = "/dashboard";
      return NextResponse.redirect(redirectUrl);
    }
  } catch (err) {
    // Safe fallback if database tables don't exist yet
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
  ],
};
