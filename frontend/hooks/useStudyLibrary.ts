"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Note,
  Folder,
  FilterOptions,
  StorageUsageStats,
  FileCategoryFilter,
} from "@/types/library.types";
import { LibraryService } from "@/services/libraryService";

export function useStudyLibrary() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [storageStats, setStorageStats] = useState<StorageUsageStats>({
    usedBytes: 0,
    totalBytes: 20 * 1024 * 1024 * 1024,
    noteCount: 0,
    folderCount: 0,
    breakdown: { pdf: 0, docs: 0, slides: 0, images: 0, other: 0 },
  });

  const [loading, setLoading] = useState<boolean>(true);
  const [uploading, setUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Filters State
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

  // Load Notes & Stats
  const refreshLibrary = useCallback(async () => {
    setLoading(true);
    try {
      const [fetchedNotes, fetchedFolders, fetchedStats] = await Promise.all([
        LibraryService.fetchNotes(filters),
        LibraryService.fetchFolders(),
        LibraryService.fetchStorageStats(),
      ]);

      setNotes(fetchedNotes);
      setFolders(fetchedFolders);
      setStorageStats(fetchedStats);
    } catch (err) {
      console.error("[useStudyLibrary] Refresh error:", err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    refreshLibrary();
  }, [refreshLibrary]);

  // File Upload Handler
  const handleFileUpload = async (files: FileList | File[]) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    setUploadProgress(15);

    try {
      const fileList = Array.from(files);
      for (let i = 0; i < fileList.length; i++) {
        const file = fileList[i];
        const formData = new FormData();
        formData.append("file", file);
        if (filters.folderId) {
          formData.append("folderId", filters.folderId);
        }

        setUploadProgress(35 + Math.round(((i + 0.5) / fileList.length) * 45));

        const res = await fetch("/api/storage/upload", {
          method: "POST",
          body: formData,
        });

        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.error || "Upload failed");
        }
      }

      setUploadProgress(100);
      await refreshLibrary();
    } catch (err: unknown) {
      console.error("[useStudyLibrary] Upload error:", err);
      alert(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setTimeout(() => {
        setUploading(false);
        setUploadProgress(0);
      }, 400);
    }
  };

  // Toggle Favorite
  const toggleFavorite = async (noteId: string) => {
    const targetNote = notes.find((n) => n.id === noteId);
    if (!targetNote) return;

    // Optimistic UI update
    setNotes((prev) =>
      prev.map((n) => (n.id === noteId ? { ...n, is_favorite: !n.is_favorite } : n))
    );

    await LibraryService.toggleFavorite(noteId, targetNote.is_favorite);
  };

  // Rename Note
  const renameNote = async (noteId: string, newTitle: string) => {
    setNotes((prev) =>
      prev.map((n) => (n.id === noteId ? { ...n, title: newTitle } : n))
    );
    await LibraryService.renameNote(noteId, newTitle);
  };

  // Move Note
  const moveNote = async (noteId: string, targetFolderId: string | null) => {
    setNotes((prev) =>
      prev.map((n) => (n.id === noteId ? { ...n, folder_id: targetFolderId } : n))
    );
    await LibraryService.moveNote(noteId, targetFolderId);
    await refreshLibrary();
  };

  // Delete Note
  const deleteNote = async (noteId: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== noteId));
    await LibraryService.deleteNote(noteId);
    await refreshLibrary();
  };

  // Change Category Filter
  const setCategoryFilter = (cat: FileCategoryFilter) => {
    setFilters((prev) => ({ ...prev, category: cat, folderId: null }));
  };

  // Select Folder
  const setSelectFolder = (folderId: string | null) => {
    setFilters((prev) => ({ ...prev, folderId, category: "all" }));
  };

  // Update Search Query
  const setSearchQuery = (query: string) => {
    setFilters((prev) => ({ ...prev, searchQuery: query }));
  };

  return {
    notes,
    folders,
    storageStats,
    loading,
    uploading,
    uploadProgress,
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
    refreshLibrary,
    // Modals
    previewNote,
    setPreviewNote,
    versionNote,
    setVersionNote,
    moveNoteItem,
    setMoveNoteItem,
    shareNoteItem,
    setShareNoteItem,
    createFolderModalOpen,
    setCreateFolderModalOpen,
  };
}
