"use client";

import React, { useState } from "react";
import { X, Trash2, AlertTriangle } from "lucide-react";
import { Folder as FolderItem } from "@/types/library.types";

interface DeleteFolderModalProps {
  folder: FolderItem | null;
  folders: FolderItem[];
  onClose: () => void;
  onConfirmDelete: (
    folderId: string,
    action: "move_root" | "move_target" | "delete_notes",
    targetFolderId?: string | null
  ) => void;
}

export default function DeleteFolderModal({
  folder,
  folders,
  onClose,
  onConfirmDelete,
}: DeleteFolderModalProps) {
  const [action, setAction] = useState<"move_root" | "move_target" | "delete_notes">("move_root");
  const [targetFolderId, setTargetFolderId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (!folder) return null;

  const noteCount = folder.note_count || 0;
  const otherFolders = folders.filter((f) => f.id !== folder.id);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onConfirmDelete(folder.id, action, targetFolderId);
      onClose();
    } catch (err) {
      console.error("[DeleteFolderModal] Error:", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs select-none animate-in fade-in-50">
      <div className="bg-white rounded-[20px] border border-slate-200 shadow-2xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-rose-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-[8px] bg-rose-100 text-rose-600 flex items-center justify-center">
              <Trash2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-slate-900">Delete Folder</h3>
              <p className="text-[11px] text-slate-400 font-medium truncate max-w-[220px]">{folder.name}</p>
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
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          {noteCount > 0 ? (
            <>
              <div className="p-3 bg-amber-50 border border-amber-200 text-amber-800 rounded-[12px] flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div className="leading-relaxed">
                  <span className="font-bold">This folder contains {noteCount} {noteCount === 1 ? "note" : "notes"}.</span> Choose what to do with the files inside before deleting:
                </div>
              </div>

              <div className="space-y-2 pt-1">
                <label className="flex items-start gap-2.5 p-3 rounded-[12px] border border-slate-200 hover:bg-slate-50 cursor-pointer transition-colors">
                  <input
                    type="radio"
                    name="folder_action"
                    value="move_root"
                    checked={action === "move_root"}
                    onChange={() => setAction("move_root")}
                    className="mt-0.5 text-[#219EBC] focus:ring-[#219EBC]"
                  />
                  <div>
                    <div className="font-extrabold text-slate-900">Move notes to Personal (Root Library)</div>
                    <div className="text-[11px] text-slate-400">Keep all notes in your main unsorted library.</div>
                  </div>
                </label>

                {otherFolders.length > 0 && (
                  <label className="flex items-start gap-2.5 p-3 rounded-[12px] border border-slate-200 hover:bg-slate-50 cursor-pointer transition-colors">
                    <input
                      type="radio"
                      name="folder_action"
                      value="move_target"
                      checked={action === "move_target"}
                      onChange={() => setAction("move_target")}
                      className="mt-0.5 text-[#219EBC] focus:ring-[#219EBC]"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="font-extrabold text-slate-900">Move notes to another folder</div>
                      {action === "move_target" && (
                        <select
                          value={targetFolderId || ""}
                          onChange={(e) => setTargetFolderId(e.target.value || null)}
                          className="mt-2 w-full bg-white border border-slate-200 rounded-[8px] p-2 text-xs font-semibold text-slate-800"
                        >
                          <option value="">Select Target Folder...</option>
                          {otherFolders.map((f) => (
                            <option key={f.id} value={f.id}>
                              {f.name}
                            </option>
                          ))}
                        </select>
                      )}
                    </div>
                  </label>
                )}

                <label className="flex items-start gap-2.5 p-3 rounded-[12px] border border-rose-200 bg-rose-50/30 hover:bg-rose-50 cursor-pointer transition-colors">
                  <input
                    type="radio"
                    name="folder_action"
                    value="delete_notes"
                    checked={action === "delete_notes"}
                    onChange={() => setAction("delete_notes")}
                    className="mt-0.5 text-rose-600 focus:ring-rose-500"
                  />
                  <div>
                    <div className="font-extrabold text-rose-700">Delete notes permanently</div>
                    <div className="text-[11px] text-rose-500">Remove all {noteCount} notes and physical R2 objects.</div>
                  </div>
                </label>
              </div>
            </>
          ) : (
            <div className="py-3 text-center space-y-1">
              <p className="font-extrabold text-slate-900">Are you sure you want to delete this folder?</p>
              <p className="text-slate-400 text-[11px]">This folder is empty and will be removed immediately.</p>
            </div>
          )}

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-[10px] hover:bg-slate-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-[10px] transition-colors shadow-xs"
            >
              {submitting ? "Deleting..." : "Delete Folder"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
