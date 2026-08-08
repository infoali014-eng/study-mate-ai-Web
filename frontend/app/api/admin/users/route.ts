import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";

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

// GET: Fetch all users with search & role filter
export async function GET(request: NextRequest) {
  try {
    const supabase = getSupabaseServer(request);
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify Admin Status from public.profiles
    const { data: callerProfile } = await (supabase as any)
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();

    const callerRole = callerProfile?.role || user.user_metadata?.role || user.app_metadata?.role;

    if (callerRole !== "admin") {
      return NextResponse.json({ error: "Forbidden: Admin privileges required." }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search")?.trim().toLowerCase() || "";
    const filterRole = searchParams.get("role")?.trim().toLowerCase() || "all";

    // Query public.profiles
    let query = (supabase as any)
      .from("profiles")
      .select("id, username, full_name, display_name, email, avatar_url, role, last_active_at, created_at")
      .order("created_at", { ascending: false });

    if (filterRole && filterRole !== "all") {
      query = query.eq("role", filterRole);
    }

    const { data: profiles, error } = await query;

    if (error) throw error;

    let userList = profiles || [];

    // Apply live search filter if provided
    if (search) {
      userList = userList.filter(
        (u: any) =>
          (u.full_name && u.full_name.toLowerCase().includes(search)) ||
          (u.display_name && u.display_name.toLowerCase().includes(search)) ||
          (u.username && u.username.toLowerCase().includes(search)) ||
          (u.email && u.email.toLowerCase().includes(search)) ||
          (u.role && u.role.toLowerCase().includes(search))
      );
    }

    const totalCount = profiles?.length || 0;
    const buddyCount = profiles?.filter((u: any) => u.role === "buddy").length || 0;
    const adminCount = profiles?.filter((u: any) => u.role === "admin").length || 0;
    const studentCount = profiles?.filter((u: any) => u.role === "student" || !u.role).length || 0;

    return NextResponse.json({
      users: userList,
      totalCount,
      buddyCount,
      adminCount,
      studentCount,
    });
  } catch (err: any) {
    console.error("[Admin Users API] GET Error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to fetch users directory." },
      { status: 500 }
    );
  }
}

// PATCH: Update user role in database
export async function PATCH(request: NextRequest) {
  try {
    const supabase = getSupabaseServer(request);
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify Admin Status
    const { data: callerProfile } = await (supabase as any)
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();

    const callerRole = callerProfile?.role || user.user_metadata?.role || user.app_metadata?.role;

    if (callerRole !== "admin") {
      return NextResponse.json({ error: "Forbidden: Admin privileges required." }, { status: 403 });
    }

    const body = await request.json();
    const { targetUserId, newRole } = body;

    if (!targetUserId || !newRole) {
      return NextResponse.json({ error: "targetUserId and newRole are required." }, { status: 400 });
    }

    if (!["student", "buddy", "admin"].includes(newRole)) {
      return NextResponse.json({ error: "Invalid role value. Must be 'student', 'buddy', or 'admin'." }, { status: 400 });
    }

    // 1. Update role in public.profiles table (Primary database source of truth)
    const { error: profileError } = await (supabase as any)
      .from("profiles")
      .update({
        role: newRole,
        updated_at: new Date().toISOString(),
      })
      .eq("id", targetUserId);

    if (profileError) throw profileError;

    // 2. Sync to Supabase Auth Admin if Service Role Key is present
    if (process.env.SUPABASE_SERVICE_ROLE_KEY && process.env.NEXT_PUBLIC_SUPABASE_URL) {
      try {
        const supabaseAdmin = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL,
          process.env.SUPABASE_SERVICE_ROLE_KEY
        );
        await supabaseAdmin.auth.admin.updateUserById(targetUserId, {
          user_metadata: { role: newRole },
          app_metadata: { role: newRole },
        });
      } catch (authErr) {
        console.warn("[Admin Users API] Auth metadata sync warning:", authErr);
      }
    }

    return NextResponse.json({
      success: true,
      message: `User role successfully updated to "${newRole}" in the database!`,
      targetUserId,
      newRole,
    });
  } catch (err: any) {
    console.error("[Admin Users API] PATCH Error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to update user role." },
      { status: 500 }
    );
  }
}
