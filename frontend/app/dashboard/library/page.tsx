"use client";

import React, { useState } from "react";
import {
  Search,
  Grid,
  List,
  FolderPlus,
  ArrowUpDown,
  FileText,
  Sparkles,
} from "lucide-react";
import { useStudyLibrary } from "@/hooks/useStudyLibrary";
import LibrarySidebar from "@/components/library/LibrarySidebar";
import DropZoneUpload from "@/components/library/DropZoneUpload";
import NoteCard from "@/components/library/NoteCard";
import NoteListItem from "@/components/library/NoteListItem";
import NotePreviewModal from "@/components/library/NotePreviewModal";
import VersionHistoryModal from "@/components/library/VersionHistoryModal";
import ShareNoteModal from "@/components/library/ShareNoteModal";
import CreateFolderModal from "@/components/library/CreateFolderModal";
import MoveNoteModal from "@/components/library/MoveNoteModal";

export default function StudyLibraryPage() {
  const {
    notes,
    folders,
    storageStats,
    loading,
    uploading,
    uploadProgress,
    uploadError,
    uploadSuccess,
    viewMode,
    setViewMode,
    filters,
    setCategoryFilter,
    setSelectFolder,
    setSearchQuery,
    setFilters,
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
  } = useStudyLibrary();

  const [renameTarget, setRenameTarget] = useState<{ id: string; title: string } | null>(null);

  const activeFolder = folders.find((f) => f.id === filters.folderId);

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto min-h-screen">
      {/* 1. SaaS Main Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 select-none">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#219EBC] uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Central AI Knowledge Hub</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
            Study Library
          </h1>
          <p className="text-sm text-slate-500 font-medium">
            Physical assets in Cloudflare R2 • Zero duplicate files • Powers Ask Mr Owl, Quizzes & Flashcards
          </p>
        </div>

        {/* Top Control Buttons */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setCreateFolderModalOpen(true)}
            className="flex items-center gap-2 px-3.5 py-2.5 bg-white border border-slate-200 hover:border-slate-300 text-slate-700 font-bold text-xs rounded-[12px] shadow-xs transition-colors cursor-pointer"
          >
            <FolderPlus className="w-4 h-4 text-[#219EBC]" />
            <span>New Folder</span>
          </button>
        </div>
      </div>

      {/* 2. Drag & Drop Upload Zone */}
      <DropZoneUpload
        onUpload={handleFileUpload}
        uploading={uploading}
        progress={uploadProgress}
        error={uploadError}
        success={uploadSuccess}
      />

      {/* 3. Main Split View Layout (Sidebar + Content Canvas) */}
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        {/* Left Sidebar */}
        <LibrarySidebar
          folders={folders}
          activeCategory={filters.category}
          activeFolderId={filters.folderId || null}
          onSelectCategory={setCategoryFilter}
          onSelectFolder={setSelectFolder}
          onCreateFolderClick={() => setCreateFolderModalOpen(true)}
          storageStats={storageStats}
        />

        {/* Right Main Content Area */}
        <div className="flex-1 w-full space-y-4">
          {/* Controls Bar: Search Input, Sorting, View Switcher */}
          <div className="bg-white rounded-[16px] border border-slate-200/80 p-3 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3 select-none">
            {/* Search Bar Input */}
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search notes by title or original filename..."
                value={filters.searchQuery || ""}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200/80 rounded-[12px] pl-10 pr-4 py-2 text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#219EBC] focus:ring-2 focus:ring-[#219EBC]/20 transition-all"
              />
            </div>

            {/* Controls: Active Folder Indicator, Sort & Grid/List View Switcher */}
            <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-between sm:justify-end">
              {/* Sort Order Selector */}
              <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-[12px] px-2.5 py-1.5 text-xs text-slate-600 font-medium">
                <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                <select
                  value={`${filters.sortBy || "date"}-${filters.sortOrder || "desc"}`}
                  onChange={(e) => {
                    const [b, o] = e.target.value.split("-");
                    setFilters((prev) => ({
                      ...prev,
                      sortBy: b as "date" | "name" | "size",
                      sortOrder: o as "asc" | "desc",
                    }));
                  }}
                  className="bg-transparent focus:outline-none cursor-pointer text-xs font-bold"
                >
                  <option value="date-desc">Newest First</option>
                  <option value="date-asc">Oldest First</option>
                  <option value="name-asc">Name (A-Z)</option>
                  <option value="size-desc">Largest Size</option>
                </select>
              </div>

              {/* View Switcher (Grid vs List) */}
              <div className="flex items-center bg-slate-100 p-0.5 rounded-[10px] border border-slate-200">
                <button
                  type="button"
                  onClick={() => setViewMode("grid")}
                  className={`p-1.5 rounded-[8px] transition-colors cursor-pointer ${
                    viewMode === "grid"
                      ? "bg-white text-[#219EBC] shadow-xs"
                      : "text-slate-400 hover:text-slate-700"
                  }`}
                  title="Grid View"
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("list")}
                  className={`p-1.5 rounded-[8px] transition-colors cursor-pointer ${
                    viewMode === "list"
                      ? "bg-white text-[#219EBC] shadow-xs"
                      : "text-slate-400 hover:text-slate-700"
                  }`}
                  title="List View"
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Active Folder Banner if folder selected */}
          {activeFolder && (
            <div className="bg-[#219EBC]/10 border border-[#219EBC]/30 rounded-[12px] px-4 py-2.5 flex items-center justify-between text-xs text-[#023047]">
              <div className="flex items-center gap-2 font-bold">
                <span>Folder: {activeFolder.name}</span>
                <span className="text-[10px] bg-[#219EBC] text-white px-2 py-0.2 rounded-full uppercase">
                  {activeFolder.folder_type}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSelectFolder(null)}
                className="text-[#219EBC] hover:underline font-extrabold cursor-pointer"
              >
                Clear Folder Filter
              </button>
            </div>
          )}

          {/* Note List / Grid Content */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="h-44 bg-slate-100 rounded-[16px] animate-pulse border border-slate-200"
                />
              ))}
            </div>
          ) : notes.length === 0 ? (
            <div className="bg-white rounded-[20px] border border-slate-200/80 p-12 text-center space-y-4 select-none">
              <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <FileText className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-extrabold text-slate-900">No Study Notes Found</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  {filters.searchQuery
                    ? `No notes match "${filters.searchQuery}". Try adjusting your search query.`
                    : "Upload your first study note to populate your AI Knowledge Library."}
                </p>
              </div>
            </div>
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {notes.map((note) => (
                <NoteCard
                  key={note.id}
                  note={note}
                  onPreview={setPreviewNote}
                  onFavoriteToggle={toggleFavorite}
                  onRename={(n) => setRenameTarget({ id: n.id, title: n.title })}
                  onMove={setMoveNoteItem}
                  onVersions={setVersionNote}
                  onShare={setShareNoteItem}
                  onDelete={deleteNote}
                />
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {notes.map((note) => (
                <NoteListItem
                  key={note.id}
                  note={note}
                  onPreview={setPreviewNote}
                  onFavoriteToggle={toggleFavorite}
                  onRename={(n) => setRenameTarget({ id: n.id, title: n.title })}
                  onMove={setMoveNoteItem}
                  onVersions={setVersionNote}
                  onShare={setShareNoteItem}
                  onDelete={deleteNote}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Rename Dialog Prompt */}
      {renameTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs select-none">
          <div className="bg-white rounded-[20px] p-5 w-full max-w-sm border border-slate-200 shadow-2xl space-y-4">
            <h3 className="text-sm font-extrabold text-slate-900">Rename Note</h3>
            <input
              type="text"
              value={renameTarget.title}
              onChange={(e) => setRenameTarget({ ...renameTarget, title: e.target.value })}
              className="w-full bg-white border border-slate-200 rounded-[10px] px-3 py-2 text-xs font-medium focus:outline-none focus:border-[#219EBC]"
            />
            <div className="flex justify-end gap-2 text-xs">
              <button
                type="button"
                onClick={() => setRenameTarget(null)}
                className="px-3 py-1.5 bg-slate-100 rounded-[8px] font-bold text-slate-600"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={async () => {
                  await renameNote(renameTarget.id, renameTarget.title);
                  setRenameTarget(null);
                }}
                className="px-3 py-1.5 bg-[#219EBC] text-white rounded-[8px] font-bold"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Active Modals */}
      <NotePreviewModal note={previewNote} onClose={() => setPreviewNote(null)} />
      <VersionHistoryModal
        note={versionNote}
        onClose={() => setVersionNote(null)}
        onVersionUploaded={refreshLibrary}
      />
      <ShareNoteModal note={shareNoteItem} onClose={() => setShareNoteItem(null)} />
      <CreateFolderModal
        isOpen={createFolderModalOpen}
        onClose={() => setCreateFolderModalOpen(false)}
        onFolderCreated={refreshLibrary}
      />
      <MoveNoteModal
        note={moveNoteItem}
        folders={folders}
        onClose={() => setMoveNoteItem(null)}
        onMoveConfirm={moveNote}
      />
    </div>
  );
}
