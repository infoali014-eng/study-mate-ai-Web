import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { decryptApiKey } from "@/lib/security/encryption";
import { buildStudentContext } from "@/lib/ai/contextBuilder";
import { generateMrOwlResponse } from "@/lib/ai/geminiProvider";

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

export async function POST(request: NextRequest) {
  try {
    const supabase = getSupabaseServer(request);
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      conversationId: inputConversationId,
      message,
      subject,
      selectedNoteIds = [],
      mode = "explain",
    } = body;

    if (!message || typeof message !== "string" || message.trim() === "") {
      return NextResponse.json({ error: "Message content is required" }, { status: 400 });
    }

    // 1. Retrieve & Decrypt User's Gemini API Key
    const { data: aiProviderRecord } = await (supabase as any)
      .from("user_ai_providers")
      .select("encrypted_api_key")
      .eq("user_id", user.id)
      .eq("provider", "gemini")
      .maybeSingle();

    if (!aiProviderRecord || !aiProviderRecord.encrypted_api_key) {
      return NextResponse.json(
        {
          error: "Gemini isn't connected yet. Please connect your Gemini API key in Settings -> AI Configuration to chat with Mr Owl AI.",
          code: "MISSING_GEMINI_KEY",
        },
        { status: 400 }
      );
    }

    const apiKey = decryptApiKey(aiProviderRecord.encrypted_api_key);

    // 2. Load or Create Conversation
    let conversationId = inputConversationId;
    let conversationTitle = message.trim().slice(0, 40);

    if (!conversationId) {
      const { data: newConv, error: convErr } = await (supabase as any)
        .from("conversations")
        .insert({
          user_id: user.id,
          title: conversationTitle,
          subject: subject || null,
          mode: mode || "explain",
          selected_note_ids: selectedNoteIds,
        })
        .select("id")
        .single();

      if (convErr) throw convErr;
      conversationId = newConv.id;
    } else {
      // Update selected notes / subject / mode if provided
      await (supabase as any)
        .from("conversations")
        .update({
          subject: subject || null,
          mode: mode || "explain",
          selected_note_ids: selectedNoteIds,
          updated_at: new Date().toISOString(),
        })
        .eq("id", conversationId)
        .eq("user_id", user.id);
    }

    // 3. Save User Message
    const { error: userMsgErr } = await (supabase as any).from("messages").insert({
      conversation_id: conversationId,
      user_id: user.id,
      role: "user",
      content: message.trim(),
    });

    if (userMsgErr) throw userMsgErr;

    // 4. Fetch Previous Messages History for Conversation Context (Up to 10 recent messages)
    const { data: pastMessages } = await (supabase as any)
      .from("messages")
      .select("role, content")
      .eq("conversation_id", conversationId)
      .eq("user_id", user.id)
      .order("created_at", { ascending: true })
      .limit(10);

    const historyMessages = (pastMessages || []).map((m: any) => ({
      role: m.role as "user" | "assistant" | "system",
      content: m.content,
    }));

    // 5. Build Server-Side Student Context
    const systemPromptParams = await buildStudentContext(supabase, user.id, {
      subject,
      tutorMode: mode,
      selectedNoteIds,
    });

    // 6. Generate AI Response from Gemini API
    const aiResult = await generateMrOwlResponse({
      apiKey,
      systemPromptParams,
      messages: historyMessages,
    });

    // 7. Save Assistant Message
    const { data: assistantMsg, error: astErr } = await (supabase as any)
      .from("messages")
      .insert({
        conversation_id: conversationId,
        user_id: user.id,
        role: "assistant",
        content: aiResult.content,
        context_used: {
          model: aiResult.modelUsed,
          subject,
          selectedNoteIds,
          mode,
        },
        tokens_used: aiResult.tokensUsed || 0,
      })
      .select("id, created_at")
      .single();

    if (astErr) throw astErr;

    return NextResponse.json({
      success: true,
      conversationId,
      messageId: assistantMsg.id,
      content: aiResult.content,
      role: "assistant",
      modelUsed: aiResult.modelUsed,
      createdAt: assistantMsg.created_at,
    });
  } catch (err: any) {
    console.error("[Chat API Route] Error:", err);
    return NextResponse.json(
      { error: err.message || "An unexpected error occurred while processing your chat request." },
      { status: 500 }
    );
  }
}
