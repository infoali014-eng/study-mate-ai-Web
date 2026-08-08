import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { encryptApiKey, maskApiKey } from "@/lib/security/encryption";

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

// GET: Check if authenticated user has a key stored
export async function GET(request: NextRequest) {
  try {
    const supabase = getSupabaseServer(request);
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ hasKey: false, message: "Unauthorized" }, { status: 401 });
    }

    const { data: record } = await (supabase as any)
      .from("user_ai_providers")
      .select("encrypted_api_key, updated_at")
      .eq("user_id", user.id)
      .eq("provider", "gemini")
      .maybeSingle();

    if (record && record.encrypted_api_key) {
      return NextResponse.json({
        hasKey: true,
        provider: "gemini",
        maskedKey: maskApiKey(record.encrypted_api_key),
        updatedAt: record.updated_at,
        status: "connected",
      });
    }

    return NextResponse.json({
      hasKey: false,
      provider: "gemini",
      maskedKey: "",
      status: "disconnected",
    });
  } catch (err: any) {
    return NextResponse.json(
      { hasKey: false, message: err.message || "Failed to retrieve AI provider status" },
      { status: 500 }
    );
  }
}

// POST: Validate, encrypt, and save API key
export async function POST(request: NextRequest) {
  try {
    const supabase = getSupabaseServer(request);
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { apiKey } = body;

    if (!apiKey || typeof apiKey !== "string" || apiKey.trim() === "") {
      return NextResponse.json(
        { success: false, message: "API key is required" },
        { status: 400 }
      );
    }

    const cleanKey = apiKey.trim();

    // 1. Validate key with Google Gemini API
    const validateRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${cleanKey}`,
      { method: "GET", headers: { "Content-Type": "application/json" } }
    );

    if (!validateRes.ok) {
      const errData = await validateRes.json().catch(() => ({}));
      const msg = errData.error?.message || "Invalid Gemini API key or unauthorized request.";
      return NextResponse.json({ success: false, message: msg }, { status: 400 });
    }

    // 2. Encrypt API key server-side
    const encryptedKey = encryptApiKey(cleanKey);

    // 3. Upsert into user_ai_providers
    const { error } = await (supabase as any).from("user_ai_providers").upsert(
      {
        user_id: user.id,
        provider: "gemini",
        encrypted_api_key: encryptedKey,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id,provider" }
    );

    if (error) throw error;

    return NextResponse.json({
      success: true,
      hasKey: true,
      maskedKey: maskApiKey(cleanKey),
      message: "Gemini API key validated and securely stored!",
    });
  } catch (err: any) {
    console.error("[SaveAIKey API] Error:", err);
    return NextResponse.json(
      { success: false, message: err.message || "Failed to save API key securely." },
      { status: 500 }
    );
  }
}

// DELETE: Remove API key for user
export async function DELETE(request: NextRequest) {
  try {
    const supabase = getSupabaseServer(request);
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const { error } = await (supabase as any)
      .from("user_ai_providers")
      .delete()
      .eq("user_id", user.id)
      .eq("provider", "gemini");

    if (error) throw error;

    return NextResponse.json({
      success: true,
      hasKey: false,
      maskedKey: "",
      message: "Gemini API key removed successfully.",
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message || "Failed to remove API key." },
      { status: 500 }
    );
  }
}
