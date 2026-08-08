import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { isAdminUser, hasBuddyOrAdminAccess } from "@/lib/security/roles";

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
      .select("*")
      .eq("id", user.id)
      .maybeSingle();

    const isAdmin = isAdminUser(user, profile?.role);
    const hasBuddyAccess = hasBuddyOrAdminAccess(user, profile?.role);
    const role = isAdmin
      ? "admin"
      : profile?.role || user.user_metadata?.role || user.app_metadata?.role || "student";

    // Auto-sync profile to public.profiles if missing or email/role unpopulated
    if (!profile || !profile.email) {
      const email = user.email || "";
      const name =
        user.user_metadata?.full_name ||
        user.user_metadata?.name ||
        email.split("@")[0] ||
        "User";

      try {
        await (supabase as any).from("profiles").upsert(
          {
            id: user.id,
            username: user.user_metadata?.username || email.split("@")[0] || user.id.slice(0, 8),
            full_name: name,
            display_name: name,
            email: email,
            role: role,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "id" }
        );
      } catch (syncErr) {
        console.warn("[Role API] Error auto-syncing profile:", syncErr);
      }
    }

    return NextResponse.json({
      userId: user.id,
      email: user.email,
      role,
      isAdmin,
      hasBuddyAccess,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to verify user role" },
      { status: 500 }
    );
  }
}
