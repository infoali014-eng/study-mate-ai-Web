"use client";

import React, { useState } from "react";
import {
  FileText,
  FileCode,
  Presentation,
  Image as ImageIcon,
  Star,
  MoreVertical,
  Eye,
  Download,
  Edit2,
  FolderInput,
  History,
  MessageSquareCode,
  HelpCircle,
  Layers,
  Calendar,
  Share2,
  Trash2,
} from "lucide-react";
import { Note } from "@/types/library.types";
import { DropdownMenuWrapper } from "@/components/ui/DropdownMenuWrapper";

interface NoteListItemProps {
  note: Note;
  onPreview: (note: Note) => void;
  onFavoriteToggle: (noteId: string) => void;
  onRename: (note: Note) => void;
  onMove: (note: Note) => void;
  onVersions: (note: Note) => void;
  onShare: (note: Note) => void;
  onDelete: (noteId: string) => void;
}

export default function NoteListItem({
  note,
  onPreview,
  onFavoriteToggle,
  onRename,
  onMove,
  onVersions,
  onShare,
  onDelete,
}: NoteListItemProps) {
  const [downloading, setDownloading] = useState(false);

  const getFileIcon = (mimeType: string) => {
    const m = (mimeType || "").toLowerCase();
    if (m.includes("pdf")) return <FileText className="w-4 h-4 text-[#219EBC]" />;
    if (m.includes("word") || m.includes("document") || m.includes("text"))
      return <FileCode className="w-4 h-4 text-[#FB8500]" />;
    if (m.includes("presentation") || m.includes("powerpoint"))
      return <Presentation className="w-4 h-4 text-[#FFB703]" />;
    if (m.includes("image")) return <ImageIcon className="w-4 h-4 text-[#38BDF8]" />;
    return <FileText className="w-4 h-4 text-slate-500" />;
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 KB";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const res = await fetch("/api/storage/signed-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileKey: note.file_key, expiresIn: 60 }),
      });
      const data = await res.json();
      if (data.signedUrl) {
        window.open(data.signedUrl, "_blank");
      }
    } catch (err) {
      console.error("[NoteListItem] Download error:", err);
    } finally {
      setDownloading(false);
    }
  };

  const menuItems = [
    { id: "preview", label: "Preview Note", icon: <Eye className="w-4 h-4" />, onClick: () => onPreview(note) },
    {
      id: "download",
      label: downloading ? "Generating Download..." : "Download File",
      icon: <Download className="w-4 h-4" />,
      onClick: handleDownload,
    },
    { id: "rename", label: "Rename Title", icon: <Edit2 className="w-4 h-4" />, onClick: () => onRename(note) },
    { id: "move", label: "Move to Folder", icon: <FolderInput className="w-4 h-4" />, onClick: () => onMove(note) },
    {
      id: "version",
      label: `Version History (v${note.current_version || 1})`,
      icon: <History className="w-4 h-4" />,
      onClick: () => onVersions(note),
    },
    {
      id: "chat_owl",
      label: "🦉 Chat with Owl",
      icon: <MessageSquareCode className="w-4 h-4 text-[#219EBC]" />,
      onClick: () => (window.location.href = `/dashboard/chat?noteId=${note.id}`),
    },
    {
      id: "quiz",
      label: "📝 Generate Quiz",
      icon: <HelpCircle className="w-4 h-4 text-[#FB8500]" />,
      onClick: () => (window.location.href = `/dashboard/quiz?noteId=${note.id}`),
    },
    {
      id: "flashcards",
      label: "🎴 Generate Flashcards",
      icon: <Layers className="w-4 h-4 text-[#219EBC]" />,
      onClick: () => (window.location.href = `/dashboard/flashcards?noteId=${note.id}`),
    },
    {
      id: "planner",
      label: "📅 Create Revision Plan",
      icon: <Calendar className="w-4 h-4 text-[#FFB703]" />,
      onClick: () => (window.location.href = `/dashboard/planner?noteId=${note.id}`),
    },
    { id: "share", label: "👥 Share to Study Group", icon: <Share2 className="w-4 h-4" />, onClick: () => onShare(note) },
    { id: "delete", label: "Delete Note", icon: <Trash2 className="w-4 h-4" />, destructive: true, onClick: () => onDelete(note.id) },
  ];

  return (
    <div className="group bg-white rounded-[12px] border border-slate-200/80 hover:border-[#219EBC]/60 px-4 py-2.5 shadow-xs flex items-center justify-between gap-4 transition-all duration-120 select-none">
      {/* File Title & Icon */}
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <button
          type="button"
          onClick={() => onFavoriteToggle(note.id)}
          className={`p-1 rounded-[6px] transition-colors cursor-pointer shrink-0 ${
            note.is_favorite ? "text-[#FFB703]" : "text-slate-300 hover:text-[#FFB703]"
          }`}
        >
          <Star className="w-4 h-4" />
        </button>

        <div className="w-8 h-8 rounded-[8px] bg-slate-100 flex items-center justify-center shrink-0">
          {getFileIcon(note.mime_type)}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span
              onClick={() => onPreview(note)}
              className="text-xs font-extrabold text-slate-900 group-hover:text-[#219EBC] transition-colors truncate cursor-pointer"
            >
              {note.title}
            </span>
            {note.current_version > 1 && (
              <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-slate-100 text-slate-600 font-mono shrink-0">
                v{note.current_version}
              </span>
            )}
          </div>
          <p className="text-[11px] text-slate-400 truncate">{note.original_filename}</p>
        </div>
      </div>

      {/* Meta details (Size, Date, AI Status) */}
      <div className="hidden sm:flex items-center gap-4 text-xs text-slate-500 font-medium shrink-0">
        <span>{formatFileSize(note.file_size)}</span>
        <span>{new Date(note.created_at).toLocaleDateString()}</span>
        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200">
          Ready
        </span>
      </div>

      {/* Context Menu */}
      <div className="shrink-0">
        <DropdownMenuWrapper
          trigger={
            <button
              type="button"
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-[8px] transition-colors cursor-pointer"
            >
              <MoreVertical className="w-4 h-4" />
            </button>
          }
          items={menuItems}
        />
      </div>
    </div>
  );
}
