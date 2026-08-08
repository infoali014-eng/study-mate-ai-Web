import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { decryptApiKey } from "@/lib/security/encryption";

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerClient(
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

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ valid: false, message: "Unauthorized" }, { status: 401 });
    }

    const { data: record } = await (supabase as any)
      .from("user_ai_providers")
      .select("encrypted_api_key")
      .eq("user_id", user.id)
      .eq("provider", "gemini")
      .maybeSingle();

    if (!record || !record.encrypted_api_key) {
      return NextResponse.json(
        { valid: false, message: "No Gemini API key stored. Please enter your API key first." },
        { status: 400 }
      );
    }

    const apiKey = decryptApiKey(record.encrypted_api_key);

    const testRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`,
      { method: "GET", headers: { "Content-Type": "application/json" } }
    );

    if (testRes.ok) {
      return NextResponse.json({
        valid: true,
        message: "Connection test successful! Gemini is ready for Mr Owl AI.",
      });
    }

    const errData = await testRes.json().catch(() => ({}));
    return NextResponse.json(
      {
        valid: false,
        message: errData.error?.message || "Saved API key failed validation. Please update your key.",
      },
      { status: 400 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { valid: false, message: err.message || "Failed to test Gemini API connection." },
      { status: 500 }
    );
  }
}
