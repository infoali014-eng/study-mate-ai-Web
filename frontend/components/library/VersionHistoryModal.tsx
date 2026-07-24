"use client";

import React, { useState, useEffect } from "react";
import { X, History, Upload, FileText } from "lucide-react";
import { Note, NoteVersion } from "@/types/library.types";
import { LibraryService } from "@/services/libraryService";

interface VersionHistoryModalProps {
  note: Note | null;
  onClose: () => void;
  onVersionUploaded: () => void;
}

export default function VersionHistoryModal({
  note,
  onClose,
  onVersionUploaded,
}: VersionHistoryModalProps) {
  const [versions, setVersions] = useState<NoteVersion[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploadingVersion, setUploadingVersion] = useState(false);

  useEffect(() => {
    if (!note) return;
    const currentNote = note;
    async function loadVersions() {
      setLoading(true);
      const data = await LibraryService.fetchNoteVersions(currentNote.id);
      setVersions(data);
      setLoading(false);
    }
    loadVersions();
  }, [note]);

  if (!note) return null;

  const handleUploadNewVersion = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    setUploadingVersion(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("title", note.title);
      if (note.folder_id) formData.append("folderId", note.folder_id);

      const res = await fetch("/api/storage/upload", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        onVersionUploaded();
        onClose();
      }
    } catch (err) {
      console.error("[VersionHistoryModal] Error uploading revision:", err);
    } finally {
      setUploadingVersion(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs select-none animate-in fade-in-50">
      <div className="bg-white rounded-[20px] border border-slate-200 shadow-2xl w-full max-w-lg overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-[#F8FAFC]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-[8px] bg-[#219EBC]/10 text-[#219EBC] flex items-center justify-center">
              <History className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-slate-900">Version History</h3>
              <p className="text-[11px] text-slate-400 font-medium truncate max-w-xs">{note.title}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-[8px] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 max-h-[60vh] overflow-y-auto">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700">Uploaded Revisions</span>
            <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#219EBC] hover:bg-[#1a839c] text-white text-xs font-bold rounded-[10px] cursor-pointer transition-colors">
              <Upload className="w-3.5 h-3.5" />
              <span>{uploadingVersion ? "Uploading..." : "Upload New Version"}</span>
              <input
                type="file"
                className="hidden"
                accept=".pdf,.docx,.pptx,.doc,.txt,.png,.jpg"
                onChange={handleUploadNewVersion}
                disabled={uploadingVersion}
              />
            </label>
          </div>

          {loading ? (
            <div className="py-8 text-center text-xs text-slate-400 font-medium">
              Loading revision history...
            </div>
          ) : versions.length === 0 ? (
            <div className="p-4 bg-slate-50 rounded-[12px] border border-slate-200/80 text-center text-xs text-slate-500">
              <FileText className="w-6 h-6 text-[#219EBC] mx-auto mb-1.5" />
              <span>Version 1 (Initial Release)</span>
            </div>
          ) : (
            <div className="space-y-2.5">
              {versions.map((ver) => {
                const isCurrent = ver.version_number === note.current_version;
                return (
                  <div
                    key={ver.id}
                    className={`p-3.5 rounded-[12px] border transition-all flex items-center justify-between text-xs ${
                      isCurrent
                        ? "bg-[#219EBC]/5 border-[#219EBC]"
                        : "bg-white border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs font-mono ${
                          isCurrent ? "bg-[#219EBC] text-white" : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        v{ver.version_number}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900">
                          {ver.change_summary || `Version ${ver.version_number}`}
                          {isCurrent && (
                            <span className="ml-2 text-[10px] bg-emerald-100 text-emerald-700 px-1.5 py-0.2 rounded-full font-bold">
                              Current Active
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {(ver.file_size / 1024).toFixed(1)} KB •{" "}
                          {new Date(ver.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={async () => {
                        const url = await LibraryService.getSignedUrl(ver.file_key);
                        if (url) window.open(url, "_blank");
                      }}
                      className="text-xs font-bold text-[#219EBC] hover:underline cursor-pointer"
                    >
                      Inspect
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="px-5 py-3 border-t border-slate-100 bg-[#F8FAFC] flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 text-slate-700 text-xs font-bold rounded-[10px] hover:bg-slate-300 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
