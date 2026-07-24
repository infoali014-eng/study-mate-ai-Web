import { NextRequest, NextResponse } from "next/server";
import { deleteFileFromR2 } from "@/lib/storage/r2";
import { createServerClient } from "@supabase/ssr";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { noteId } = body;

    if (!noteId) {
      return NextResponse.json({ error: "Missing noteId" }, { status: 400 });
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
            cookiesToSet.forEach(({ name, value }) =>
              req.cookies.set(name, value)
            );
          },
        },
      }
    );

    // 1. Fetch note details
    const { data: note, error: fetchError } = await supabase
      .from("notes")
      .select("*")
      .eq("id", noteId)
      .single();

    if (fetchError || !note) {
      return NextResponse.json({ error: "Note not found" }, { status: 404 });
    }

    // 2. Check if other notes reference the same file_key (deduplication check before deleting R2 file)
    const { data: siblingNotes } = await supabase
      .from("notes")
      .select("id")
      .eq("file_key", note.file_key)
      .neq("id", noteId);

    const isLastReference = !siblingNotes || siblingNotes.length === 0;

    if (isLastReference) {
      // Remove physical file from Cloudflare R2
      await deleteFileFromR2(note.file_key);
    } else {
      console.log(`[R2 Storage] Preserving physical object "${note.file_key}" because ${siblingNotes.length} other notes reference it.`);
    }

    // 3. Log to library_activity feed before deletion
    await supabase.from("library_activity").insert({
      user_id: note.user_id,
      note_id: null, // Note will be deleted
      action: "deleted",
      details: {
        deleted_note_id: noteId,
        title: note.title,
      },
    });

    // 4. Delete note from Supabase (cascades note_versions, note_contents, note_tags)
    const { error: deleteError } = await supabase
      .from("notes")
      .delete()
      .eq("id", noteId);

    if (deleteError) {
      return NextResponse.json({ error: deleteError.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      deletedNoteId: noteId,
      r2ObjectDeleted: isLastReference,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to delete note";
    console.error("[Delete Route] Error:", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
