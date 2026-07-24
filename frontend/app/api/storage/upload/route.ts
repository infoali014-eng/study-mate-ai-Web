import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { uploadFileToR2 } from "@/lib/storage/r2";
import { createServerClient } from "@supabase/ssr";

const ALLOWED_MIME_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "application/vnd.ms-powerpoint",
  "application/powerpoint",
  "text/plain",
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/webp",
  "image/gif",
  "image/svg+xml",
  "image/bmp",
  "image/avif",
];

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50 MB

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const folderId = (formData.get("folderId") as string) || null;
    const customTitle = (formData.get("title") as string) || null;
    const userId = (formData.get("userId") as string) || null;

    if (!file) {
      return NextResponse.json({ error: "No file provided for upload" }, { status: 400 });
    }

    const mimeType = file.type || "application/octet-stream";
    const fileSize = file.size;

    // Step 1: Validate file format & max size
    const isMimeAllowed =
      ALLOWED_MIME_TYPES.includes(mimeType) ||
      /\.(pdf|docx|doc|pptx|ppt|txt|png|jpg|jpeg|webp|gif|svg|bmp|avif)$/i.test(file.name);

    if (!isMimeAllowed) {
      return NextResponse.json(
        {
          error:
            "Unsupported file type. Only PDF, DOCX, PPT, PPTX, TXT, and Images (PNG, JPG, WEBP, GIF, SVG, BMP, AVIF) are supported.",
        },
        { status: 400 }
      );
    }

    if (fileSize > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: `File exceeds maximum allowed size of 50 MB.` },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Step 2: Compute SHA-256 hash
    const hashSum = crypto.createHash("sha256");
    hashSum.update(buffer);
    const fileHash = hashSum.digest("hex");

    const originalFilename = file.name;
    const title = customTitle || originalFilename.replace(/\.[^/.]+$/, "");

    // Supabase SSR Client setup
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

    // Authenticate user
    let targetUserId = userId;
    if (!targetUserId) {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      targetUserId = user?.id || "00000000-0000-0000-0000-000000000000";
    }

    // Step 3: Check Supabase for existing file_hash for deduplication
    const { data: existingHashNote } = await (supabase as unknown as {
      from: (t: string) => { select: (cols: string) => { eq: (k: string, v: string) => { limit: (n: number) => { maybeSingle: () => Promise<{ data: { file_key: string } | null }> } } } };
    })
      .from("notes")
      .select("file_key")
      .eq("file_hash", fileHash)
      .limit(1)
      .maybeSingle();

    let fileKey: string;
    const noteId = crypto.randomUUID();
    const fileExt = originalFilename.split(".").pop() || "bin";

    if (existingHashNote && existingHashNote.file_key) {
      // Reuse existing physical object in Cloudflare R2
      fileKey = existingHashNote.file_key;
      console.log(`[R2 Deduplication] Reusing physical R2 object "${fileKey}" for hash ${fileHash.slice(0, 8)}...`);
    } else {
      // Step 4: Upload new physical file to R2 structure: users/{userId}/notes/{noteId}/original.{ext}
      fileKey = `users/${targetUserId}/notes/${noteId}/original.${fileExt}`;
      await uploadFileToR2(fileKey, buffer, mimeType);
    }

    // Page count estimate
    let estimatedPageCount = 1;
    if (mimeType.includes("pdf")) {
      estimatedPageCount = Math.max(1, Math.round(fileSize / 45000));
    } else if (mimeType.includes("word") || mimeType.includes("officedocument")) {
      estimatedPageCount = Math.max(1, Math.round(fileSize / 25000));
    } else if (mimeType.includes("presentation") || mimeType.includes("powerpoint") || /\.(ppt|pptx)$/i.test(originalFilename)) {
      estimatedPageCount = Math.max(1, Math.round(fileSize / 65000));
    }

    // Step 5: Save metadata inside Supabase (file_key ONLY, NO permanent URLs)
    const { data: newNote, error: noteError } = await (supabase as unknown as {
      from: (t: string) => {
        insert: (data: Record<string, unknown>) => {
          select: () => { single: () => Promise<{ data: Record<string, unknown>; error: { message: string } | null }> };
        };
      };
    })
      .from("notes")
      .insert({
        id: noteId,
        user_id: targetUserId,
        folder_id: folderId || null,
        title,
        original_filename: originalFilename,
        file_key: fileKey, // Permanent R2 key path ONLY — no expiring file_url
        file_hash: fileHash,
        mime_type: mimeType,
        file_size: fileSize,
        page_count: estimatedPageCount,
        current_version: 1,
        ai_status: "completed", // Immediately set to Ready status
        is_favorite: false,
        summary: `Document "${title}" uploaded. Ready for study tools.`,
      })
      .select()
      .single();

    if (noteError) {
      console.error("[Upload Route] Supabase error:", noteError);
      return NextResponse.json({ error: noteError.message }, { status: 500 });
    }

    // Record version history
    await (supabase as unknown as { from: (t: string) => { insert: (d: Record<string, unknown>) => Promise<unknown> } })
      .from("note_versions")
      .insert({
        note_id: noteId,
        version_number: 1,
        file_key: fileKey,
        file_hash: fileHash,
        file_size: fileSize,
        change_summary: "Initial upload",
        created_by: targetUserId,
      });

    // Record activity
    await (supabase as unknown as { from: (t: string) => { insert: (d: Record<string, unknown>) => Promise<unknown> } })
      .from("library_activity")
      .insert({
        user_id: targetUserId,
        note_id: noteId,
        action: "uploaded",
        details: { title, original_filename: originalFilename, file_size: fileSize },
      });

    return NextResponse.json({
      success: true,
      note: newNote,
      fileKey,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Upload processing failed";
    console.error("[Upload Route] Error:", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
