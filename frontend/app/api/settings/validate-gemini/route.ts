import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { apiKey } = body;

    if (!apiKey || typeof apiKey !== "string" || apiKey.trim() === "") {
      return NextResponse.json(
        { valid: false, message: "API key is required" },
        { status: 400 }
      );
    }

    const cleanKey = apiKey.trim();

    // Call Google Generative Language API models list to validate key
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${cleanKey}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }
    );

    if (response.ok) {
      return NextResponse.json({
        valid: true,
        message: "Gemini API Key validated successfully!",
      });
    }

    const errorData = await response.json().catch(() => ({}));
    const errorMessage =
      errorData.error?.message || "Invalid API key or unauthorized request.";

    return NextResponse.json(
      { valid: false, message: errorMessage },
      { status: 400 }
    );
  } catch (error) {
    console.error("[ValidateGeminiKey API] Error:", error);
    return NextResponse.json(
      { valid: false, message: "Failed to connect to Google API service." },
      { status: 500 }
    );
  }
}
