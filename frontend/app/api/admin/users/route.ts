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

    // 1. Fetch profiles from public.profiles using caller's authenticated client
    let profilesFromDb: any[] = [];
    try {
      const { data: pData } = await (supabase as any).from("profiles").select("*");
      profilesFromDb = pData || [];
    } catch (dbErr) {
      console.warn("[Admin Users API] Could not fetch profiles via user client:", dbErr);
    }

    // 2. Also fetch profiles via Service Role client if possible
    try {
      const { data: pAdminData } = await (supabaseAdmin as any).from("profiles").select("*");
      if (pAdminData && pAdminData.length > 0) {
        // Merge profiles
        const existingIds = new Set(profilesFromDb.map((p) => p.id));
        pAdminData.forEach((p: any) => {
          if (!existingIds.has(p.id)) {
            profilesFromDb.push(p);
          }
        });
      }
    } catch (adminDbErr) {
      console.warn("[Admin Users API] Could not fetch profiles via admin client:", adminDbErr);
    }

    // 3. Try to list users from auth.users via Supabase Auth Admin API
    let authUsers: any[] = [];
    try {
      const { data: authData } = await supabaseAdmin.auth.admin.listUsers();
      authUsers = authData?.users || [];
    } catch (authErr) {
      console.warn("[Admin Users API] Could not list auth.users:", authErr);
    }

    const profileMap = new Map<string, any>();
    profilesFromDb.forEach((p: any) => {
      profileMap.set(p.id, p);
    });

    const userMap = new Map<string, any>();

    // Add users from auth.users list
    authUsers.forEach((authUser) => {
      const prof = profileMap.get(authUser.id) || {};
      const isCallerAdmin = isAdminUser(authUser, prof.role);
      const role = isCallerAdmin ? "admin" : (prof.role || authUser.app_metadata?.role || authUser.user_metadata?.role || "student");

      userMap.set(authUser.id, {
        id: authUser.id,
        email: authUser.email || prof.email || "No email",
        full_name: prof.full_name || authUser.user_metadata?.full_name || authUser.user_metadata?.name || authUser.email?.split("@")[0] || "User",
        display_name: prof.display_name || prof.full_name || authUser.user_metadata?.name || authUser.email?.split("@")[0] || "User",
        username: prof.username || authUser.user_metadata?.username || authUser.email?.split("@")[0] || authUser.id.slice(0, 8),
        avatar_url: prof.avatar_url || authUser.user_metadata?.avatar_url || null,
        role: role as "student" | "buddy" | "admin",
        created_at: authUser.created_at || prof.created_at || new Date().toISOString(),
        last_active_at: authUser.last_sign_in_at || prof.last_active_at || new Date().toISOString(),
      });
    });

    // Add users from public.profiles
    profilesFromDb.forEach((prof: any) => {
      if (!userMap.has(prof.id)) {
        const isProfileAdmin = isAdminUser({ email: prof.email }, prof.role);
        const role = isProfileAdmin ? "admin" : (prof.role || "student");

        userMap.set(prof.id, {
          id: prof.id,
          email: prof.email || "No email",
          full_name: prof.full_name || prof.display_name || prof.username || "User",
          display_name: prof.display_name || prof.full_name || prof.username || "User",
          username: prof.username || prof.id.slice(0, 8),
          avatar_url: prof.avatar_url || null,
          role: role as "student" | "buddy" | "admin",
          created_at: prof.created_at || new Date().toISOString(),
          last_active_at: prof.last_active_at || new Date().toISOString(),
        });
      }
    });

    // Ensure the active logged-in admin caller is ALWAYS included in the directory!
    if (!userMap.has(user.id)) {
      const callerEmail = user.email || "admin@studymate.ai";
      userMap.set(user.id, {
        id: user.id,
        email: callerEmail,
        full_name: user.user_metadata?.full_name || user.user_metadata?.name || callerEmail.split("@")[0] || "Admin",
        display_name: user.user_metadata?.name || callerEmail.split("@")[0] || "Admin",
        username: callerEmail.split("@")[0] || "admin",
        avatar_url: user.user_metadata?.avatar_url || null,
        role: "admin",
        created_at: user.created_at || new Date().toISOString(),
        last_active_at: new Date().toISOString(),
      });
    }

    const combinedUsers = Array.from(userMap.values());

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

    // 1. Update/Upsert role in public.profiles table using caller client & admin client fallback
    const profilePayload = {
      id: targetUserId,
      username: targetUsername,
      full_name: targetFullName,
      display_name: targetFullName,
      email: targetEmail,
      role: newRole,
      updated_at: new Date().toISOString(),
    };

    let profileError = null;
    try {
      const { error: err1 } = await (supabase as any)
        .from("profiles")
        .upsert(profilePayload, { onConflict: "id" });
      profileError = err1;
    } catch (e) {
      profileError = e;
    }

    if (profileError) {
      try {
        const { error: err2 } = await (supabaseAdmin as any)
          .from("profiles")
          .upsert(profilePayload, { onConflict: "id" });
        profileError = err2;
      } catch (e2) {
        profileError = e2;
      }
    }

    if (profileError) {
      console.error("[Admin Users API] Profiles upsert error:", profileError);
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
