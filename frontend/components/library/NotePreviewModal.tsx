"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  MessageSquareCode,
  HelpCircle,
  Layers,
  Calendar,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import { Note, NoteContentChunk } from "@/types/library.types";
import { LibraryService } from "@/services/libraryService";
import { isImageFile, getFileIcon } from "@/utils/filePreview";

interface NotePreviewModalProps {
  note: Note | null;
  onClose: () => void;
}

export default function NotePreviewModal({ note, onClose }: NotePreviewModalProps) {
  const [signedUrl, setSignedUrl] = useState<string>("");
  const [chunks, setChunks] = useState<NoteContentChunk[]>([]);
  const [activeTab, setActiveTab] = useState<"preview" | "chunks" | "info">("preview");
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!note) return;
    const currentNote = note;

    let isMounted = true;
    setLoading(true);

    async function loadData() {
      try {
        const [url, extractedChunks] = await Promise.all([
          LibraryService.getSignedUrl(currentNote.file_key),
          LibraryService.fetchNoteContents(currentNote.id),
        ]);

        if (isMounted) {
          setSignedUrl(url);
          setChunks(extractedChunks);
        }
      } catch (err) {
        console.error("[NotePreviewModal] Error loading preview data:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadData();

    return () => {
      isMounted = false;
    };
  }, [note]);

  if (!note) return null;

  const isImage = isImageFile(note.mime_type, note.original_filename);
  const isPdf = note.mime_type.includes("pdf") || note.original_filename.toLowerCase().endsWith(".pdf");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-xs select-none animate-in fade-in-50">
      <div className="bg-white rounded-[20px] border border-slate-200 shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-[#F8FAFC]">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-[12px] bg-[#219EBC]/10 flex items-center justify-center shrink-0">
              {getFileIcon(note.mime_type, note.original_filename, "w-5 h-5")}
            </div>
            <div className="min-w-0">
              <h2 className="text-base font-extrabold text-slate-900 truncate">{note.title}</h2>
              <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
                <span>{note.original_filename}</span>
                <span>•</span>
                <span>Version {note.current_version}</span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-[10px] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs Bar */}
        <div className="px-6 border-b border-slate-100 bg-white flex items-center gap-6 text-xs font-bold">
          <button
            type="button"
            onClick={() => setActiveTab("preview")}
            className={`py-3 border-b-2 transition-colors cursor-pointer ${
              activeTab === "preview"
                ? "border-[#219EBC] text-[#219EBC]"
                : "border-transparent text-slate-500 hover:text-slate-900"
            }`}
          >
            Document Preview
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("chunks")}
            className={`py-3 border-b-2 transition-colors cursor-pointer ${
              activeTab === "chunks"
                ? "border-[#219EBC] text-[#219EBC]"
                : "border-transparent text-slate-500 hover:text-slate-900"
            }`}
          >
            AI Extracted Chunks ({chunks.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("info")}
            className={`py-3 border-b-2 transition-colors cursor-pointer ${
              activeTab === "info"
                ? "border-[#219EBC] text-[#219EBC]"
                : "border-transparent text-slate-500 hover:text-slate-900"
            }`}
          >
            File Metadata & Hash
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50 min-h-[360px]">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 space-y-3">
              <Sparkles className="w-8 h-8 text-[#219EBC] animate-spin" />
              <p className="text-xs font-bold text-slate-500">Generating short-lived signed R2 URL...</p>
            </div>
          ) : activeTab === "preview" ? (
            <div className="w-full h-full flex flex-col items-center justify-center min-h-[380px]">
              {isPdf && signedUrl ? (
                <iframe
                  src={`${signedUrl}#toolbar=0`}
                  className="w-full h-[450px] rounded-[12px] border border-slate-200 shadow-xs bg-white"
                  title="PDF Note Preview"
                />
              ) : isImage && signedUrl ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={signedUrl}
                  alt={note.title}
                  className="max-h-[450px] max-w-full rounded-[12px] shadow-sm object-contain"
                />
              ) : (
                <div className="text-center space-y-4 py-12">
                  <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto">
                    {getFileIcon(note.mime_type, note.original_filename, "w-8 h-8")}
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold text-slate-900">Document Ready</h3>
                    <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
                      Direct browser preview for this file type is handled via Signed R2 Download or text chunk inspection.
                    </p>
                  </div>
                  {signedUrl && (
                    <a
                      href={signedUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-[#219EBC] text-white text-xs font-bold rounded-[10px] hover:bg-[#1a839c] transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" /> Open Signed File URL
                    </a>
                  )}
                </div>
              )}
            </div>
          ) : activeTab === "chunks" ? (
            <div className="space-y-3">
              {chunks.length === 0 ? (
                <div className="text-center py-12 text-slate-400 text-xs font-medium">
                  No text chunks extracted yet. The AI processing pipeline will generate vector chunks automatically.
                </div>
              ) : (
                chunks.map((chunk, idx) => (
                  <div
                    key={chunk.id || idx}
                    className="p-4 bg-white rounded-[12px] border border-slate-200/80 shadow-xs space-y-1.5"
                  >
                    <div className="flex items-center justify-between text-[11px] font-bold text-slate-400">
                      <span>Chunk #{idx + 1} (Page {chunk.page_number})</span>
                      <span className="text-[#219EBC] bg-cyan-50 px-2 py-0.5 rounded-full border border-cyan-200">
                        {chunk.token_count} Tokens
                      </span>
                    </div>
                    <p className="text-xs text-slate-700 font-mono leading-relaxed">
                      {chunk.content_text}
                    </p>
                  </div>
                ))
              )}
            </div>
          ) : (
            <div className="bg-white rounded-[12px] border border-slate-200/80 p-5 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-slate-400 font-medium">Permanent R2 File Key:</span>
                  <div className="font-mono text-slate-800 break-all bg-slate-50 p-2 rounded-[8px] border border-slate-100 mt-1">
                    {note.file_key}
                  </div>
                </div>
                <div>
                  <span className="text-slate-400 font-medium">SHA-256 Content Hash:</span>
                  <div className="font-mono text-slate-800 break-all bg-slate-50 p-2 rounded-[8px] border border-slate-100 mt-1">
                    {note.file_hash}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 pt-2">
                <div>
                  <span className="text-slate-400 font-medium">File Size:</span>
                  <div className="font-bold text-slate-800 mt-0.5">
                    {(note.file_size / 1024).toFixed(1)} KB
                  </div>
                </div>
                <div>
                  <span className="text-slate-400 font-medium">MIME Type:</span>
                  <div className="font-bold text-slate-800 mt-0.5">{note.mime_type}</div>
                </div>
                <div>
                  <span className="text-slate-400 font-medium">AI Pipeline Status:</span>
                  <div className="font-bold text-[#219EBC] mt-0.5 capitalize">{note.ai_status}</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Quick AI Action Bar */}
        <div className="px-6 py-3.5 border-t border-slate-100 bg-[#F8FAFC] flex items-center justify-between">
          <div className="text-xs font-bold text-slate-600 hidden sm:block">
            Smart AI Module Triggers:
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => (window.location.href = `/dashboard/chat?noteId=${note.id}`)}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-2 bg-[#023047] text-white rounded-[10px] text-xs font-bold hover:bg-[#03405e] transition-colors cursor-pointer"
            >
              <MessageSquareCode className="w-3.5 h-3.5 text-[#219EBC]" />
              <span>Ask Owl</span>
            </button>
            <button
              type="button"
              onClick={() => (window.location.href = `/dashboard/quiz?noteId=${note.id}`)}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-2 bg-[#FB8500] text-white rounded-[10px] text-xs font-bold hover:bg-[#e07700] transition-colors cursor-pointer"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Quiz</span>
            </button>
            <button
              type="button"
              onClick={() => (window.location.href = `/dashboard/flashcards?noteId=${note.id}`)}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-2 bg-[#219EBC] text-white rounded-[10px] text-xs font-bold hover:bg-[#1a839c] transition-colors cursor-pointer"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Flashcards</span>
            </button>
            <button
              type="button"
              onClick={() => (window.location.href = `/dashboard/planner?noteId=${note.id}`)}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-2 bg-[#FFB703] text-[#023047] rounded-[10px] text-xs font-bold hover:bg-[#e0a300] transition-colors cursor-pointer"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Planner</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
