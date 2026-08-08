import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { isAdminUser } from "@/lib/security/roles";

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

function getSupabaseAdmin() {
  const serviceKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL || "", serviceKey);
}

// GET: Fetch all registered users from auth.users & public.profiles
export async function GET(request: NextRequest) {
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

    if (!isAdminUser(user, callerProfile?.role)) {
      return NextResponse.json({ error: "Forbidden: Admin privileges required." }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search")?.trim().toLowerCase() || "";
    const filterRole = searchParams.get("role")?.trim().toLowerCase() || "all";

    const supabaseAdmin = getSupabaseAdmin();

    // 1. Fetch all registered users from auth.users
    let authUsers: any[] = [];
    try {
      const { data: authData } = await supabaseAdmin.auth.admin.listUsers();
      authUsers = authData?.users || [];
    } catch (authErr) {
      console.warn("[Admin Users API] Could not list auth.users:", authErr);
    }

    // 2. Fetch all profiles from public.profiles
    const { data: profiles } = await (supabaseAdmin as any).from("profiles").select("*");

    const profileMap = new Map<string, any>();
    (profiles || []).forEach((p: any) => {
      profileMap.set(p.id, p);
    });

    // 3. Merge auth.users with public.profiles
    const combinedUsers = authUsers.map((authUser) => {
      const prof = profileMap.get(authUser.id) || {};
      const role = prof.role || authUser.app_metadata?.role || authUser.user_metadata?.role || "student";

      return {
        id: authUser.id,
        email: authUser.email || prof.email || "No email",
        full_name: prof.full_name || authUser.user_metadata?.full_name || authUser.user_metadata?.name || authUser.email?.split("@")[0] || "User",
        display_name: prof.display_name || prof.full_name || authUser.user_metadata?.name || authUser.email?.split("@")[0] || "User",
        username: prof.username || authUser.user_metadata?.username || authUser.email?.split("@")[0] || authUser.id.slice(0, 8),
        avatar_url: prof.avatar_url || authUser.user_metadata?.avatar_url || null,
        role: role as "student" | "buddy" | "admin",
        created_at: authUser.created_at || prof.created_at,
        last_active_at: authUser.last_sign_in_at || prof.last_active_at,
      };
    });

    // Also include profiles that might not be in authUsers list if any
    (profiles || []).forEach((p: any) => {
      if (!combinedUsers.some((u) => u.id === p.id)) {
        combinedUsers.push({
          id: p.id,
          email: p.email || "No email",
          full_name: p.full_name || p.display_name || p.username || "User",
          display_name: p.display_name || p.full_name || p.username || "User",
          username: p.username || p.id.slice(0, 8),
          avatar_url: p.avatar_url || null,
          role: (p.role || "student") as "student" | "buddy" | "admin",
          created_at: p.created_at,
          last_active_at: p.last_active_at,
        });
      }
    });

    // Sort by created_at DESC
    combinedUsers.sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime());

    // Filter by Role
    let filteredList = combinedUsers;
    if (filterRole && filterRole !== "all") {
      filteredList = filteredList.filter((u) => u.role === filterRole);
    }

    // Filter by Search Query
    if (search) {
      filteredList = filteredList.filter(
        (u) =>
          u.full_name.toLowerCase().includes(search) ||
          u.display_name.toLowerCase().includes(search) ||
          u.username.toLowerCase().includes(search) ||
          u.email.toLowerCase().includes(search) ||
          u.role.toLowerCase().includes(search)
      );
    }

    const totalCount = combinedUsers.length;
    const buddyCount = combinedUsers.filter((u) => u.role === "buddy").length;
    const adminCount = combinedUsers.filter((u) => u.role === "admin").length;
    const studentCount = combinedUsers.filter((u) => u.role === "student" || !u.role).length;

    return NextResponse.json({
      users: filteredList,
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

// PATCH: Update user role in database (public.profiles & auth metadata)
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

    if (!isAdminUser(user, callerProfile?.role)) {
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

    const supabaseAdmin = getSupabaseAdmin();

    // Fetch Target User Info from Auth Admin to satisfy NOT NULL constraints on profiles
    let targetEmail = "";
    let targetFullName = "User";
    let targetUsername = targetUserId.slice(0, 8);

    try {
      const { data: targetAuthUser } = await supabaseAdmin.auth.admin.getUserById(targetUserId);
      if (targetAuthUser?.user) {
        targetEmail = targetAuthUser.user.email || "";
        targetFullName =
          targetAuthUser.user.user_metadata?.full_name ||
          targetAuthUser.user.user_metadata?.name ||
          targetEmail.split("@")[0] ||
          "User";
        targetUsername =
          targetAuthUser.user.user_metadata?.username ||
          targetEmail.split("@")[0] ||
          targetUserId.slice(0, 8);
      }
    } catch (fetchErr) {
      console.warn("[Admin Users API] Error getting user by id:", fetchErr);
    }

    // 1. Upsert role into public.profiles table via Service Role client (satisfies NOT NULL constraints)
    const { error: profileError } = await (supabaseAdmin as any)
      .from("profiles")
      .upsert(
        {
          id: targetUserId,
          username: targetUsername,
          full_name: targetFullName,
          display_name: targetFullName,
          email: targetEmail,
          role: newRole,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "id" }
      );

    if (profileError) {
      console.error("[Admin Users API] Profiles upsert error:", profileError);
      throw new Error(`Database update failed: ${profileError.message}`);
    }

    // 2. Also update raw_user_meta_data and raw_app_meta_data in auth.users
    try {
      await supabaseAdmin.auth.admin.updateUserById(targetUserId, {
        user_metadata: { role: newRole },
        app_metadata: { role: newRole },
      });
    } catch (authErr) {
      console.warn("[Admin Users API] Auth metadata update warning:", authErr);
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
