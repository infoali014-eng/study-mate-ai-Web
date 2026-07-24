"use client";

import React, { useState } from "react";
import { X, FolderInput, Folder } from "lucide-react";
import { Note, Folder as FolderItem } from "@/types/library.types";

interface MoveNoteModalProps {
  note: Note | null;
  folders: FolderItem[];
  onClose: () => void;
  onMoveConfirm: (noteId: string, folderId: string | null) => void;
}

export default function MoveNoteModal({
  note,
  folders,
  onClose,
  onMoveConfirm,
}: MoveNoteModalProps) {
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(
    note?.folder_id || null
  );

  if (!note) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs select-none animate-in fade-in-50">
      <div className="bg-white rounded-[20px] border border-slate-200 shadow-2xl w-full max-w-sm overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-[#F8FAFC]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-[8px] bg-[#219EBC]/10 text-[#219EBC] flex items-center justify-center">
              <FolderInput className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-slate-900">Move Note to Folder</h3>
              <p className="text-[11px] text-slate-400 font-medium truncate max-w-[200px]">{note.title}</p>
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

        {/* Folder Picker List */}
        <div className="p-5 space-y-3 text-xs">
          <div className="space-y-1 max-h-60 overflow-y-auto">
            {/* Root / Unsorted Option */}
            <button
              type="button"
              onClick={() => setSelectedFolderId(null)}
              className={`w-full flex items-center gap-2.5 p-2.5 rounded-[10px] text-left transition-colors cursor-pointer ${
                selectedFolderId === null
                  ? "bg-[#219EBC] text-white font-bold"
                  : "bg-slate-50 text-slate-700 hover:bg-slate-100"
              }`}
            >
              <Folder className="w-4 h-4" />
              <span>(Unsorted / Root Library)</span>
            </button>

            {folders.map((f) => {
              const isSelected = selectedFolderId === f.id;
              return (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setSelectedFolderId(f.id)}
                  className={`w-full flex items-center justify-between p-2.5 rounded-[10px] text-left transition-colors cursor-pointer ${
                    isSelected
                      ? "bg-[#219EBC] text-white font-bold"
                      : "bg-slate-50 text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <Folder className="w-4 h-4 shrink-0" style={{ color: isSelected ? "#FFFFFF" : f.color }} />
                    <span className="truncate">{f.name}</span>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="pt-2 flex items-center gap-2 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-[10px] hover:bg-slate-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => {
                onMoveConfirm(note.id, selectedFolderId);
                onClose();
              }}
              className="px-4 py-2 bg-[#219EBC] hover:bg-[#1a839c] text-white font-bold rounded-[10px] transition-colors"
            >
              Confirm Move
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
