import { SupabaseClient } from "@supabase/supabase-js";
import { SystemPromptParams } from "./prompts";

export interface BuildContextParams {
  subject?: string;
  tutorMode?: "explain" | "quiz" | "practice" | "revise" | "teach_me";
  selectedNoteIds?: string[];
}

export async function buildStudentContext(
  supabase: SupabaseClient,
  userId: string,
  params: BuildContextParams
): Promise<SystemPromptParams> {
  const { subject, tutorMode = "explain", selectedNoteIds = [] } = params;

  // 1. Fetch Profile
  const { data: profile } = await (supabase as any)
    .from("profiles")
    .select("full_name, display_name, institution, field_of_study, education_level")
    .eq("id", userId)
    .maybeSingle();

  // 2. Fetch User Preferences
  const { data: prefs } = await (supabase as any)
    .from("user_preferences")
    .select("preferred_language, explanation_style, learning_style")
    .eq("user_id", userId)
    .maybeSingle();

  // 3. Fetch Selected Notes & Material Content if any
  let studyMaterialContext = "";

  if (selectedNoteIds && selectedNoteIds.length > 0) {
    try {
      // Fetch Note Metadata
      const { data: notes } = await (supabase as any)
        .from("notes")
        .select("id, title, original_filename, summary")
        .in("id", selectedNoteIds)
        .eq("user_id", userId);

      // Fetch Note Content Chunks
      const { data: contents } = await (supabase as any)
        .from("note_contents")
        .select("note_id, page_number, content_text")
        .in("note_id", selectedNoteIds)
        .order("page_number", { ascending: true })
        .order("chunk_index", { ascending: true })
        .limit(100);

      if (notes && notes.length > 0) {
        const materialParts: string[] = [];

        for (const note of notes) {
          const noteTextChunks = (contents || [])
            .filter((c: any) => c.note_id === note.id)
            .map((c: any) => `[Page ${c.page_number}]: ${c.content_text}`)
            .join("\n\n");

          const textBlock =
            noteTextChunks.trim() || note.summary || "No extracted plain text available.";

          materialParts.push(`DOCUMENT: "${note.title}" (${note.original_filename})\n${textBlock}`);
        }

        // Limit total study material context to ~12,000 characters to respect token limits
        studyMaterialContext = materialParts.join("\n\n---\n\n").slice(0, 12000);
      }
    } catch (err) {
      console.error("[ContextBuilder] Error loading study material:", err);
    }
  }

  return {
    studentName: profile?.display_name || profile?.full_name || "Student",
    educationLevel: profile?.education_level || "university",
    fieldOfStudy: profile?.field_of_study || "General Studies",
    institution: profile?.institution || "",
    preferredLanguage: prefs?.preferred_language || "english",
    explanationStyle: prefs?.explanation_style || "detailed",
    subject: subject || "",
    tutorMode: tutorMode || "explain",
    studyMaterialContext,
  };
}
