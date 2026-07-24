"use client";

import React, { useState, useEffect } from "react";
import {
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
  Sparkles,
  AlertTriangle,
} from "lucide-react";
import { Note } from "@/types/library.types";
import { DropdownMenuWrapper } from "@/components/ui/DropdownMenuWrapper";
import { isImageFile, getFileIcon } from "@/utils/filePreview";
import { LibraryService } from "@/services/libraryService";

interface NoteCardProps {
  note: Note;
  onPreview: (note: Note) => void;
  onFavoriteToggle: (noteId: string) => void;
  onRename: (note: Note) => void;
  onMove: (note: Note) => void;
  onVersions: (note: Note) => void;
  onShare: (note: Note) => void;
  onDelete: (noteId: string) => void;
}

export default function NoteCard({
  note,
  onPreview,
  onFavoriteToggle,
  onRename,
  onMove,
  onVersions,
  onShare,
  onDelete,
}: NoteCardProps) {
  const [downloading, setDownloading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);

  const isImg = isImageFile(note.mime_type, note.original_filename);

  useEffect(() => {
    if (isImg) {
      LibraryService.getSignedUrl(note.file_key, 3600).then((url) => {
        if (url) setImageUrl(url);
      });
    }
  }, [note.file_key, note.mime_type, note.original_filename, isImg]);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 KB";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  const formatDate = (dateStr: string): string => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  // AI Status Badge rules: ONLY show when actively running an AI job!
  const renderAIBadge = (status: string) => {
    switch (status) {
      case "processing":
      case "extracting_text":
      case "embedding":
      case "summarizing":
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-cyan-50 text-[#219EBC] border border-cyan-200 animate-pulse">
            <Sparkles className="w-3 h-3 animate-spin" /> Processing
          </span>
        );
      case "failed":
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-rose-50 text-rose-600 border border-rose-200">
            <AlertTriangle className="w-3 h-3" /> Failed
          </span>
        );
      // "completed", "ready", "uploaded" -> DO NOT render any badge!
      default:
        return null;
    }
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
      console.error("[NoteCard] Download error:", err);
    } finally {
      setDownloading(false);
    }
  };

  const menuItems = [
    {
      id: "preview",
      label: "Preview Note",
      icon: <Eye className="w-4 h-4" />,
      onClick: () => onPreview(note),
    },
    {
      id: "download",
      label: downloading ? "Generating Download..." : "Download File",
      icon: <Download className="w-4 h-4" />,
      onClick: handleDownload,
    },
    {
      id: "rename",
      label: "Rename Title",
      icon: <Edit2 className="w-4 h-4" />,
      onClick: () => onRename(note),
    },
    {
      id: "move",
      label: "Move to Folder",
      icon: <FolderInput className="w-4 h-4" />,
      onClick: () => onMove(note),
    },
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
      onClick: () => {
        window.location.href = `/dashboard/chat?noteId=${note.id}`;
      },
    },
    {
      id: "quiz",
      label: "📝 Generate Quiz",
      icon: <HelpCircle className="w-4 h-4 text-[#FB8500]" />,
      onClick: () => {
        window.location.href = `/dashboard/quiz?noteId=${note.id}`;
      },
    },
    {
      id: "flashcards",
      label: "🎴 Generate Flashcards",
      icon: <Layers className="w-4 h-4 text-[#219EBC]" />,
      onClick: () => {
        window.location.href = `/dashboard/flashcards?noteId=${note.id}`;
      },
    },
    {
      id: "planner",
      label: "📅 Create Revision Plan",
      icon: <Calendar className="w-4 h-4 text-[#FFB703]" />,
      onClick: () => {
        window.location.href = `/dashboard/planner?noteId=${note.id}`;
      },
    },
    {
      id: "share",
      label: "👥 Share to Study Group",
      icon: <Share2 className="w-4 h-4" />,
      onClick: () => onShare(note),
    },
    {
      id: "delete",
      label: "Delete Note",
      icon: <Trash2 className="w-4 h-4" />,
      destructive: true,
      onClick: () => onDelete(note.id),
    },
  ];

  const aiBadge = renderAIBadge(note.ai_status);

  return (
    <div className="group bg-white rounded-[16px] border border-slate-200/90 hover:border-[#219EBC]/60 p-4 shadow-xs hover:shadow-lg transition-all duration-200 hover:-translate-y-1 flex flex-col justify-between select-none">
      {/* 1. Header Preview Container */}
      <div>
        {isImg && imageUrl && !imageError ? (
          <div
            onClick={() => onPreview(note)}
            className="relative w-full h-36 mb-3 rounded-[12px] overflow-hidden bg-slate-100 border border-slate-200/60 flex items-center justify-center cursor-pointer"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageUrl}
              alt={note.title}
              onError={() => setImageError(true)}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
            />
          </div>
        ) : (
          <div
            onClick={() => onPreview(note)}
            className="relative w-full h-24 mb-3 rounded-[12px] bg-slate-50 border border-slate-200/60 flex items-center justify-center cursor-pointer transition-colors group-hover:bg-slate-100/80"
          >
            <div className="transition-transform duration-200 group-hover:scale-110">
              {getFileIcon(note.mime_type, note.original_filename, "w-8 h-8")}
            </div>
          </div>
        )}

        {/* 2. Title & Date */}
        <div className="space-y-1 mb-3">
          <div className="flex items-start justify-between gap-2">
            <h3
              onClick={() => onPreview(note)}
              className="text-xs sm:text-sm font-extrabold text-slate-900 group-hover:text-[#219EBC] transition-colors line-clamp-2 cursor-pointer leading-snug"
              title={note.title}
            >
              {note.title}
            </h3>
            {note.current_version > 1 && (
              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-slate-100 text-slate-600 font-mono shrink-0">
                v{note.current_version}
              </span>
            )}
          </div>

          <div className="flex items-center justify-between">
            <span className="text-[11px] text-slate-400 font-medium">
              {formatDate(note.created_at)}
            </span>
            {aiBadge}
          </div>
        </div>
      </div>

      {/* 3. Bottom Row: Size • Page Count • Favorite • Context Menu */}
      <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] font-semibold text-slate-400">
        <div className="flex items-center gap-1.5">
          <span>{formatFileSize(note.file_size)}</span>
          {note.page_count > 0 && (
            <>
              <span>•</span>
              <span>{note.page_count} {note.page_count === 1 ? "Page" : "Pages"}</span>
            </>
          )}
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onFavoriteToggle(note.id)}
            className={`p-1.5 rounded-[8px] transition-all duration-200 cursor-pointer ${
              note.is_favorite
                ? "text-[#FFB703] fill-[#FFB703] scale-110"
                : "text-slate-300 hover:text-[#FFB703]"
            }`}
            title={note.is_favorite ? "Remove favorite" : "Favorite note"}
          >
            <Star className="w-4 h-4" />
          </button>

          <DropdownMenuWrapper
            trigger={
              <button
                type="button"
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-[8px] transition-colors cursor-pointer opacity-80 group-hover:opacity-100"
                aria-label="More note actions"
              >
                <MoreVertical className="w-4 h-4" />
              </button>
            }
            items={menuItems}
          />
        </div>
      </div>
    </div>
  );
}
