"use client";

import React, { useState } from "react";
import { X, Folder, Palette } from "lucide-react";
import { FolderType } from "@/types/library.types";
import { LibraryService } from "@/services/libraryService";

interface CreateFolderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFolderCreated: () => void;
}

export default function CreateFolderModal({
  isOpen,
  onClose,
  onFolderCreated,
}: CreateFolderModalProps) {
  const [name, setName] = useState("");
  const [folderType, setFolderType] = useState<FolderType>("personal");
  const [color, setColor] = useState("#219EBC");
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const colorSwatches = [
    "#219EBC",
    "#FB8500",
    "#FFB703",
    "#023047",
    "#8ECAE6",
    "#10B981",
    "#8B5CF6",
    "#EC4899",
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setSubmitting(true);
    try {
      await LibraryService.createFolder({
        name: name.trim(),
        folder_type: folderType,
        color,
        icon: "Folder",
      });
      setName("");
      onFolderCreated();
      onClose();
    } catch (err) {
      console.error("[CreateFolderModal] Error creating folder:", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs select-none animate-in fade-in-50">
      <div className="bg-white rounded-[20px] border border-slate-200 shadow-2xl w-full max-w-sm overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-[#F8FAFC]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-[8px] bg-[#219EBC]/10 text-[#219EBC] flex items-center justify-center">
              <Folder className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-extrabold text-slate-900">Create New Folder</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-[8px] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          <div className="space-y-1.5">
            <label className="font-bold text-slate-700">Folder Name</label>
            <input
              type="text"
              required
              placeholder="e.g. Mathematics, C# Programming"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-[10px] px-3 py-2 text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#219EBC] focus:ring-2 focus:ring-[#219EBC]/20"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-slate-700">Folder Category Type</label>
            <select
              value={folderType}
              onChange={(e) => setFolderType(e.target.value as FolderType)}
              className="w-full bg-white border border-slate-200 rounded-[10px] px-3 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:border-[#219EBC]"
            >
              <option value="personal">Personal Folder</option>
              <option value="shared">Study Group Shared Folder</option>
              <option value="archive">Archive Folder</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-slate-700 flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5 text-slate-400" /> Color Accent
            </label>
            <div className="flex items-center gap-2 pt-1">
              {colorSwatches.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  style={{ backgroundColor: c }}
                  className={`w-6 h-6 rounded-full transition-transform cursor-pointer ${
                    color === c ? "scale-125 ring-2 ring-slate-900 ring-offset-1" : "hover:scale-110"
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="pt-2 flex items-center gap-2 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 text-slate-700 text-xs font-bold rounded-[10px] hover:bg-slate-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || !name.trim()}
              className="px-4 py-2 bg-[#219EBC] hover:bg-[#1a839c] text-white text-xs font-bold rounded-[10px] transition-colors disabled:opacity-50"
            >
              {submitting ? "Creating..." : "Create Folder"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
