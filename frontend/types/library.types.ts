export type AIProcessingStatus =
  | "uploaded"
  | "extracting_text"
  | "embedding"
  | "summarizing"
  | "completed"
  | "failed";

export type FolderType = "personal" | "shared" | "archive";

export interface Note {
  id: string;
  user_id: string;
  folder_id: string | null;
  title: string;
  original_filename: string;
  file_key: string; // Permanent R2 object key path — NO expiring file_url in DB!
  file_hash: string;
  mime_type: string;
  file_size: number;
  page_count: number;
  current_version: number;
  ai_status: AIProcessingStatus;
  is_favorite: boolean;
  summary?: string | null;
  created_at: string;
  updated_at: string;
}

export interface Folder {
  id: string;
  user_id: string;
  name: string;
  folder_type: FolderType;
  color: string;
  icon: string;
  parent_id: string | null;
  created_at: string;
  updated_at: string;
  note_count?: number;
}

export interface NoteVersion {
  id: string;
  note_id: string;
  version_number: number;
  file_key: string;
  file_hash: string;
  file_size: number;
  change_summary?: string | null;
  created_by: string;
  created_at: string;
}

export interface NoteContentChunk {
  id: string;
  note_id: string;
  page_number: number;
  chunk_index: number;
  content_text: string;
  token_count: number;
  embedding_status: "pending" | "embedded" | "failed";
  created_at: string;
}

export interface LibraryActivity {
  id: string;
  user_id: string;
  note_id: string | null;
  action:
    | "uploaded"
    | "renamed"
    | "moved"
    | "deleted"
    | "favorited"
    | "opened"
    | "shared"
    | "version_added";
  details?: Record<string, unknown> | null;
  created_at: string;
}

export interface Tag {
  id: string;
  user_id: string;
  name: string;
  color: string;
}

export type FileCategoryFilter =
  | "all"
  | "favorites"
  | "recent"
  | "pdf"
  | "docs"
  | "slides"
  | "images";

export interface FilterOptions {
  category: FileCategoryFilter;
  folderId?: string | null;
  searchQuery?: string;
  sortBy?: "date" | "name" | "size";
  sortOrder?: "asc" | "desc";
}

export interface StorageUsageStats {
  usedBytes: number;
  totalBytes: number;
  noteCount: number;
  folderCount: number;
  breakdown: {
    pdf: number;
    docs: number;
    slides: number;
    images: number;
    other: number;
  };
}
