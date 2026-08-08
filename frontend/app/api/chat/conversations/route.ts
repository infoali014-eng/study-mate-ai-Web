import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

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

// GET: List user conversations
export async function GET(request: NextRequest) {
  try {
    const supabase = getSupabaseServer(request);
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: conversations, error } = await (supabase as any)
      .from("conversations")
      .select("id, title, subject, mode, selected_note_ids, created_at, updated_at")
      .eq("user_id", user.id)
      .order("updated_at", { ascending: false });

    if (error) throw error;

    return NextResponse.json({ conversations: conversations || [] });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to fetch conversations" }, { status: 500 });
  }
}

// POST: Create new conversation
export async function POST(request: NextRequest) {
  try {
    const supabase = getSupabaseServer(request);
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    const { title = "New Chat", subject = null, mode = "explain", selectedNoteIds = [] } = body;

    const { data: conv, error } = await (supabase as any)
      .from("conversations")
      .insert({
        user_id: user.id,
        title,
        subject,
        mode,
        selected_note_ids: selectedNoteIds,
      })
      .select("id, title, subject, mode, selected_note_ids, created_at, updated_at")
      .single();

    if (error) throw error;

    return NextResponse.json({ conversation: conv });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to create conversation" }, { status: 500 });
  }
}

// DELETE: Delete conversation by ID
export async function DELETE(request: NextRequest) {
  try {
    const supabase = getSupabaseServer(request);
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const conversationId = searchParams.get("id");

    if (!conversationId) {
      return NextResponse.json({ error: "Conversation ID is required" }, { status: 400 });
    }

    const { error } = await (supabase as any)
      .from("conversations")
      .delete()
      .eq("id", conversationId)
      .eq("user_id", user.id);

    if (error) throw error;

    return NextResponse.json({ success: true, id: conversationId });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to delete conversation" }, { status: 500 });
  }
}
