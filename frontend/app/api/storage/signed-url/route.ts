import { NextRequest, NextResponse } from "next/server";
import { generateR2SignedUrl } from "@/lib/storage/r2";
import { createServerClient } from "@supabase/ssr";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { fileKey, expiresIn = 3600 } = body;

    if (!fileKey) {
      return NextResponse.json(
        { error: "Missing required parameter: fileKey" },
        { status: 400 }
      );
    }

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || "",
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
      {
        cookies: {
          getAll() {
            return req.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) => req.cookies.set(name, value));
          },
        },
      }
    );

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const signedUrl = await generateR2SignedUrl(fileKey, expiresIn);

    return NextResponse.json({
      success: true,
      signedUrl,
      expiresIn,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to generate signed URL";
    console.error("[API storage/signed-url] Error:", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
