import { NextRequest, NextResponse } from "next/server";
import { generateR2SignedUrl } from "@/lib/storage/r2";

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
