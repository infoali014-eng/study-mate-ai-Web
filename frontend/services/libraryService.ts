import { getSupabaseClient } from "@/lib/supabase/client";
import {
  Note,
  Folder,
  NoteVersion,
  NoteContentChunk,
  LibraryActivity,
  FilterOptions,
  StorageUsageStats,
  FolderType,
} from "@/types/library.types";

export class LibraryService {
  /**
   * Fetches notes list matching search, category filter, folder selection, and sorting options.
   */
  static async fetchNotes(filters: FilterOptions): Promise<Note[]> {
    const supabase = getSupabaseClient();
    let query = (supabase as any).from("notes").select("*");

    // Folder Filter
    if (filters.folderId !== undefined && filters.folderId !== null) {
      query = query.eq("folder_id", filters.folderId);
    }

    // Category Filter
    if (filters.category === "favorites") {
      query = query.eq("is_favorite", true);
    } else if (filters.category === "pdf") {
      query = query.ilike("mime_type", "%pdf%");
    } else if (filters.category === "docs") {
      query = query.or("mime_type.ilike.%word%,mime_type.ilike.%document%,mime_type.ilike.%text%");
    } else if (filters.category === "slides") {
      query = query.or("mime_type.ilike.%presentation%,mime_type.ilike.%powerpoint%");
    } else if (filters.category === "images") {
      query = query.ilike("mime_type", "%image%");
    }

    // Search Query
    if (filters.searchQuery && filters.searchQuery.trim() !== "") {
      const q = filters.searchQuery.trim();
      query = query.or(`title.ilike.%${q}%,original_filename.ilike.%${q}%`);
    }

    // Sorting
    const sortBy = filters.sortBy || "date";
    const sortAsc = filters.sortOrder === "asc";

    if (sortBy === "name") {
      query = query.order("title", { ascending: sortAsc });
    } else if (sortBy === "size") {
      query = query.order("file_size", { ascending: sortAsc });
    } else {
      query = query.order("created_at", { ascending: sortAsc });
    }

    const { data, error } = await query;
    if (error) {
      console.error("[LibraryService] Error fetching notes:", error);
      return [];
    }
    return data || [];
  }

  /**
   * Fetches all user folders with note counts.
   */
  static async fetchFolders(): Promise<Folder[]> {
    const supabase = getSupabaseClient();
    const { data, error } = await (supabase as any)
      .from("folders")
      .select("*, notes(id)")
      .order("name", { ascending: true });

    if (error) {
      console.error("[LibraryService] Error fetching folders:", error);
      return [];
    }

    return (data || []).map((item: any) => ({
      id: item.id,
      user_id: item.user_id,
      name: item.name,
      folder_type: item.folder_type || "personal",
      color: item.color || "#219EBC",
      icon: item.icon || "Folder",
      parent_id: item.parent_id || null,
      created_at: item.created_at,
      updated_at: item.updated_at,
      note_count: Array.isArray(item.notes) ? item.notes.length : 0,
    }));
  }

  /**
   * Creates a new folder.
   */
  static async createFolder(payload: {
    name: string;
    folder_type?: FolderType;
    color?: string;
    icon?: string;
    parent_id?: string | null;
  }): Promise<Folder | null> {
    const supabase = getSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return null;

    const { data, error } = await (supabase as any)
      .from("folders")
      .insert({
        user_id: user.id,
        name: payload.name,
        folder_type: payload.folder_type || "personal",
        color: payload.color || "#219EBC",
        icon: payload.icon || "Folder",
        parent_id: payload.parent_id || null,
      })
      .select()
      .single();

    if (error) {
      console.error("[LibraryService] Error creating folder:", error);
      throw new Error(error.message);
    }

    return data;
  }

  /**
   * Toggles favorite status of a note.
   */
  static async toggleFavorite(noteId: string, currentStatus: boolean): Promise<boolean> {
    const supabase = getSupabaseClient();
    const newStatus = !currentStatus;

    const { error } = await (supabase as any)
      .from("notes")
      .update({ is_favorite: newStatus })
      .eq("id", noteId);

    if (error) {
      console.error("[LibraryService] Error toggling favorite:", error);
      return currentStatus;
    }

    // Log activity
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      await (supabase as any).from("library_activity").insert({
        user_id: user.id,
        note_id: noteId,
        action: "favorited",
        details: { favorite: newStatus },
      });
    }

    return newStatus;
  }

  /**
   * Renames a note.
   */
  static async renameNote(noteId: string, newTitle: string): Promise<boolean> {
    const supabase = getSupabaseClient();
    const { error } = await (supabase as any)
      .from("notes")
      .update({ title: newTitle })
      .eq("id", noteId);

    if (error) {
      console.error("[LibraryService] Error renaming note:", error);
      return false;
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      await (supabase as any).from("library_activity").insert({
        user_id: user.id,
        note_id: noteId,
        action: "renamed",
        details: { new_title: newTitle },
      });
    }

    return true;
  }

  /**
   * Moves a note to a different folder.
   */
  static async moveNote(noteId: string, targetFolderId: string | null): Promise<boolean> {
    const supabase = getSupabaseClient();
    const { error } = await (supabase as any)
      .from("notes")
      .update({ folder_id: targetFolderId })
      .eq("id", noteId);

    if (error) {
      console.error("[LibraryService] Error moving note:", error);
      return false;
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      await (supabase as any).from("library_activity").insert({
        user_id: user.id,
        note_id: noteId,
        action: "moved",
        details: { target_folder_id: targetFolderId },
      });
    }

    return true;
  }

  /**
   * Deletes a note via API endpoint (which handles safe R2 removal and activity logging).
   */
  static async deleteNote(noteId: string): Promise<boolean> {
    try {
      const response = await fetch("/api/storage/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ noteId }),
      });
      const data = await response.json();
      return data.success === true;
    } catch (err) {
      console.error("[LibraryService] Error calling delete API:", err);
      return false;
    }
  }

  /**
   * Generates short-lived signed URL for file_key on demand.
   */
  static async getSignedUrl(fileKey: string, expiresIn: number = 3600): Promise<string> {
    try {
      const response = await fetch("/api/storage/signed-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileKey, expiresIn }),
      });
      const data = await response.json();
      return data.signedUrl || "";
    } catch (err) {
      console.error("[LibraryService] Error getting signed URL:", err);
      return "";
    }
  }

  /**
   * Fetches note version history.
   */
  static async fetchNoteVersions(noteId: string): Promise<NoteVersion[]> {
    const supabase = getSupabaseClient();
    const { data, error } = await (supabase as any)
      .from("note_versions")
      .select("*")
      .eq("note_id", noteId)
      .order("version_number", { ascending: false });

    if (error) {
      console.error("[LibraryService] Error fetching versions:", error);
      return [];
    }
    return data || [];
  }

  /**
   * Fetches extracted text content chunks for a note.
   */
  static async fetchNoteContents(noteId: string): Promise<NoteContentChunk[]> {
    const supabase = getSupabaseClient();
    const { data, error } = await (supabase as any)
      .from("note_contents")
      .select("*")
      .eq("note_id", noteId)
      .order("page_number", { ascending: true })
      .order("chunk_index", { ascending: true });

    if (error) {
      console.error("[LibraryService] Error fetching note contents:", error);
      return [];
    }
    return data || [];
  }

  /**
   * Fetches library activity feed.
   */
  static async fetchActivity(): Promise<LibraryActivity[]> {
    const supabase = getSupabaseClient();
    const { data, error } = await (supabase as any)
      .from("library_activity")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(20);

    if (error) {
      console.error("[LibraryService] Error fetching activity feed:", error);
      return [];
    }
    return data || [];
  }

  /**
   * Calculates storage usage statistics.
   */
  static async fetchStorageStats(): Promise<StorageUsageStats> {
    const supabase = getSupabaseClient();
    const { data: notes } = await (supabase as any).from("notes").select("mime_type, file_size");
    const { count: folderCount } = await (supabase as any)
      .from("folders")
      .select("id", { count: "exact", head: true });

    let usedBytes = 0;
    const breakdown = { pdf: 0, docs: 0, slides: 0, images: 0, other: 0 };

    (notes || []).forEach((n: { file_size?: number; mime_type?: string }) => {
      const sz = Number(n.file_size || 0);
      usedBytes += sz;
      const m = (n.mime_type || "").toLowerCase();
      if (m.includes("pdf")) breakdown.pdf += sz;
      else if (m.includes("word") || m.includes("document") || m.includes("text")) breakdown.docs += sz;
      else if (m.includes("presentation") || m.includes("powerpoint")) breakdown.slides += sz;
      else if (m.includes("image")) breakdown.images += sz;
      else breakdown.other += sz;
    });

    const totalBytes = 20 * 1024 * 1024 * 1024; // 20 GB default limit tier

    return {
      usedBytes,
      totalBytes,
      noteCount: notes?.length || 0,
      folderCount: folderCount || 0,
      breakdown,
    };
  }
}
