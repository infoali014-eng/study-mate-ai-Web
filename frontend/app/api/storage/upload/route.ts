import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { uploadFileToR2 } from "@/lib/storage/r2";
import { createServerClient } from "@supabase/ssr";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const folderId = (formData.get("folderId") as string) || null;
    const customTitle = (formData.get("title") as string) || null;
    const userId = (formData.get("userId") as string) || null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 1. Calculate SHA-256 hash for byte deduplication
    const hashSum = crypto.createHash("sha256");
    hashSum.update(buffer);
    const fileHash = hashSum.digest("hex");

    const mimeType = file.type || "application/octet-stream";
    const fileSize = file.size;
    const originalFilename = file.name;
    const title = customTitle || originalFilename.replace(/\.[^/.]+$/, "");

    // Establish Supabase SSR server client
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

    // Get current auth user ID if not provided explicitly
    let targetUserId = userId;
    if (!targetUserId) {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      targetUserId = user?.id || "00000000-0000-0000-0000-000000000000";
    }

    // 2. Check for byte deduplication in DB
    const { data: existingHashNote } = await supabase
      .from("notes")
      .select("file_key")
      .eq("file_hash", fileHash)
      .limit(1)
      .maybeSingle();

    let fileKey: string;

    if (existingHashNote && existingHashNote.file_key) {
      // Reuse existing R2 fileKey — NO byte duplication in Cloudflare R2!
      fileKey = existingHashNote.file_key;
      console.log(`[R2 Deduplication] Reusing physical key "${fileKey}" for hash ${fileHash.slice(0, 8)}...`);
    } else {
      // Generate clean permanent file_key (NO file_url hardcoded!)
      const sanitizedFilename = originalFilename.replace(/[^a-zA-Z0-9.-]/g, "_");
      fileKey = `users/${targetUserId}/notes/${Date.now()}_${sanitizedFilename}`;

      // Upload physical binary to R2
      await uploadFileToR2(fileKey, buffer, mimeType);
    }

    // Rough page count estimator based on file size and mime type
    let estimatedPageCount = 1;
    if (mimeType.includes("pdf")) {
      estimatedPageCount = Math.max(1, Math.round(fileSize / 45000));
    } else if (mimeType.includes("word") || mimeType.includes("officedocument")) {
      estimatedPageCount = Math.max(1, Math.round(fileSize / 25000));
    }

    // 3. Create Note record in Supabase
    const { data: newNote, error: noteError } = await supabase
      .from("notes")
      .insert({
        user_id: targetUserId,
        folder_id: folderId || null,
        title,
        original_filename: originalFilename,
        file_key: fileKey, // Permanent key path ONLY — no expiring file_url!
        file_hash: fileHash,
        mime_type: mimeType,
        file_size: fileSize,
        page_count: estimatedPageCount,
        current_version: 1,
        ai_status: "extracting_text", // 6-stage AI pipeline start state
        is_favorite: false,
        summary: `Document "${title}" uploaded. Ready for AI extraction and flashcard processing.`,
      })
      .select()
      .single();

    if (noteError) {
      console.error("[Upload Route] Supabase note insert error:", noteError);
      return NextResponse.json({ error: noteError.message }, { status: 500 });
    }

    // 4. Create Version 1 record in note_versions table
    await supabase.from("note_versions").insert({
      note_id: newNote.id,
      version_number: 1,
      file_key: fileKey,
      file_hash: fileHash,
      file_size: fileSize,
      change_summary: "Initial file upload",
      created_by: targetUserId,
    });

    // 5. Seed note_contents text chunks table for Ask Owl RAG semantic search
    await supabase.from("note_contents").insert([
      {
        note_id: newNote.id,
        page_number: 1,
        chunk_index: 0,
        content_text: `Overview of ${title}. Main concepts and study summary placeholder for RAG extraction.`,
        token_count: 32,
        embedding_status: "pending",
      },
    ]);

    // 6. Log to library_activity feed
    await supabase.from("library_activity").insert({
      user_id: targetUserId,
      note_id: newNote.id,
      action: "uploaded",
      details: {
        title,
        original_filename: originalFilename,
        file_size: fileSize,
      },
    });

    return NextResponse.json({
      success: true,
      note: newNote,
      fileKey,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Upload processing failed";
    console.error("[Upload Route] Critical Error:", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
