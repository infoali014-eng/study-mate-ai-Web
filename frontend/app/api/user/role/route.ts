import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

function getSupabaseServer(request: NextRequest) {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        },
      },
    }
  );
}

export async function GET(request: NextRequest) {
  try {
    const supabase = getSupabaseServer(request);
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ role: null, hasBuddyAccess: false }, { status: 401 });
    }

    // Query role from public.profiles table
    const { data: profile } = await (supabase as any)
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();

    const role = profile?.role || user.user_metadata?.role || user.app_metadata?.role || "student";
    const hasBuddyAccess = role === "buddy" || role === "admin";

    return NextResponse.json({
      userId: user.id,
      email: user.email,
      role,
      hasBuddyAccess,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to verify user role" },
      { status: 500 }
    );
  }
}
