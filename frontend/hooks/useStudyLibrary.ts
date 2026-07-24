"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Note,
  Folder,
  FilterOptions,
  FileCategoryFilter,
} from "@/types/library.types";
import { LibraryService } from "@/services/libraryService";
import { StreakService } from "@/features/streak/services/streakService";

export function useStudyLibrary() {
  const queryClient = useQueryClient();

  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [uploading, setUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<boolean>(false);

  // Filter state
  const [filters, setFilters] = useState<FilterOptions>({
    category: "all",
    folderId: null,
    searchQuery: "",
    sortBy: "date",
    sortOrder: "desc",
  });

  // Active Modals state
  const [previewNote, setPreviewNote] = useState<Note | null>(null);
  const [versionNote, setVersionNote] = useState<Note | null>(null);
  const [moveNoteItem, setMoveNoteItem] = useState<Note | null>(null);
  const [shareNoteItem, setShareNoteItem] = useState<Note | null>(null);
  const [createFolderModalOpen, setCreateFolderModalOpen] = useState<boolean>(false);

  // 1. TanStack Query: Fetch Notes
  const {
    data: notes = [],
    isLoading: loadingNotes,
    refetch: refetchNotes,
  } = useQuery({
    queryKey: ["notes", filters],
    queryFn: () => LibraryService.fetchNotes(filters),
  });

  // 2. TanStack Query: Fetch Folders
  const { data: folders = [], refetch: refetchFolders } = useQuery({
    queryKey: ["folders"],
    queryFn: () => LibraryService.fetchFolders(),
  });

  // 3. TanStack Query: Fetch Storage Usage Stats
  const { data: storageStats = {
    usedBytes: 0,
    totalBytes: 20 * 1024 * 1024 * 1024,
    noteCount: 0,
    folderCount: 0,
    breakdown: { pdf: 0, docs: 0, slides: 0, images: 0, other: 0 },
  } } = useQuery({
    queryKey: ["storageStats"],
    queryFn: () => LibraryService.fetchStorageStats(),
  });

  // Reusable Query Invalidation Helper
  const invalidateAll = () => {
    queryClient.invalidateQueries({ queryKey: ["notes"] });
    queryClient.invalidateQueries({ queryKey: ["folders"] });
    queryClient.invalidateQueries({ queryKey: ["storageStats"] });
  };

  // 4. File Upload Mutation
  const uploadMutation = useMutation({
    mutationFn: async (files: File[]) => {
      setUploading(true);
      setUploadError(null);
      setUploadSuccess(false);
      setUploadProgress(20);

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const formData = new FormData();
        formData.append("file", file);
        if (filters.folderId) {
          formData.append("folderId", filters.folderId);
        }

        setUploadProgress(40 + Math.round(((i + 0.5) / files.length) * 45));

        const res = await fetch("/api/storage/upload", {
          method: "POST",
          body: formData,
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Upload failed");
        }
      }
      setUploadProgress(100);
      return true;
    },
    onSuccess: () => {
      setUploadSuccess(true);
      invalidateAll();
      StreakService.recordActivity("upload").then((res) => {
        if (res.newlyCompleted) {
          queryClient.invalidateQueries({ queryKey: ["userStreak"] });
        }
      });
      setTimeout(() => {
        setUploading(false);
        setUploadProgress(0);
        setUploadSuccess(false);
      }, 1200);
    },
    onError: (err: Error) => {
      setUploadError(err.message || "Upload failed");
      setUploading(false);
      setUploadProgress(0);
    },
  });

  // 5. Toggle Favorite Mutation
  const favoriteMutation = useMutation({
    mutationFn: async (noteId: string) => {
      const target = notes.find((n) => n.id === noteId);
      if (!target) return;
      await LibraryService.toggleFavorite(noteId, target.is_favorite);
    },
    onSuccess: () => {
      invalidateAll();
    },
  });

  // 6. Rename Note Mutation
  const renameMutation = useMutation({
    mutationFn: async ({ noteId, newTitle }: { noteId: string; newTitle: string }) => {
      await LibraryService.renameNote(noteId, newTitle);
    },
    onSuccess: () => {
      invalidateAll();
    },
  });

  // 7. Move Note Mutation
  const moveMutation = useMutation({
    mutationFn: async ({ noteId, targetFolderId }: { noteId: string; targetFolderId: string | null }) => {
      await LibraryService.moveNote(noteId, targetFolderId);
    },
    onSuccess: () => {
      invalidateAll();
    },
  });

  // 8. Delete Note Mutation
  const deleteMutation = useMutation({
    mutationFn: async (noteId: string) => {
      await LibraryService.deleteNote(noteId);
    },
    onSuccess: () => {
      invalidateAll();
    },
  });

  const [deleteFolderTarget, setDeleteFolderTarget] = useState<Folder | null>(null);

  // 9. Delete Folder Mutation
  const deleteFolderMutation = useMutation({
    mutationFn: async ({
      folderId,
      action,
      targetFolderId,
    }: {
      folderId: string;
      action: "move_root" | "move_target" | "delete_notes";
      targetFolderId?: string | null;
    }) => {
      if (action === "move_target" && targetFolderId) {
        await LibraryService.moveFolderContents(folderId, targetFolderId);
        await LibraryService.deleteFolder(folderId, false);
      } else if (action === "delete_notes") {
        await LibraryService.deleteFolder(folderId, true);
      } else {
        await LibraryService.deleteFolder(folderId, false);
      }
    },
    onSuccess: () => {
      invalidateAll();
    },
  });

  // Handlers
  const handleFileUpload = (files: FileList | File[]) => {
    const list = Array.from(files);
    if (list.length > 0) {
      uploadMutation.mutate(list);
    }
  };

  const toggleFavorite = (noteId: string) => {
    favoriteMutation.mutate(noteId);
  };

  const renameNote = (noteId: string, newTitle: string) => {
    renameMutation.mutate({ noteId, newTitle });
  };

  const moveNote = (noteId: string, targetFolderId: string | null) => {
    moveMutation.mutate({ noteId, targetFolderId });
  };

  const deleteNote = (noteId: string) => {
    deleteMutation.mutate(noteId);
  };

  const setCategoryFilter = (cat: FileCategoryFilter) => {
    setFilters((prev) => ({ ...prev, category: cat, folderId: null }));
  };

  const setSelectFolder = (folderId: string | null) => {
    setFilters((prev) => ({ ...prev, folderId, category: "all" }));
  };

  const setSearchQuery = (query: string) => {
    setFilters((prev) => ({ ...prev, searchQuery: query }));
  };

  return {
    notes,
    folders,
    storageStats,
    loading: loadingNotes,
    uploading,
    uploadProgress,
    uploadError,
    uploadSuccess,
    viewMode,
    setViewMode,
    filters,
    setFilters,
    setCategoryFilter,
    setSelectFolder,
    setSearchQuery,
    handleFileUpload,
    toggleFavorite,
    renameNote,
    moveNote,
    deleteNote,
    refreshLibrary: () => {
      refetchNotes();
      refetchFolders();
    },
    // Modals
    previewNote,
    setPreviewNote: (note: Note | null) => {
      setPreviewNote(note);
      if (note) {
        StreakService.recordActivity("preview").then((res) => {
          if (res.newlyCompleted) {
            queryClient.invalidateQueries({ queryKey: ["userStreak"] });
          }
        });
      }
    },
    versionNote,
    setVersionNote,
    moveNoteItem,
    setMoveNoteItem,
    shareNoteItem,
    setShareNoteItem,
    createFolderModalOpen,
    setCreateFolderModalOpen,
    deleteFolderTarget,
    setDeleteFolderTarget,
    confirmDeleteFolder: (
      folderId: string,
      action: "move_root" | "move_target" | "delete_notes",
      targetFolderId?: string | null
    ) => deleteFolderMutation.mutateAsync({ folderId, action, targetFolderId }),
  };
}
