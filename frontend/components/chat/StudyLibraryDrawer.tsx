"use client";

import React, { useState, useEffect } from "react";
import { Search, FileText, Check, X, BookOpen, Layers } from "lucide-react";
import { getSupabaseClient } from "@/lib/supabase/client";

export interface NoteLibraryItem {
  id: string;
  title: string;
  original_filename: string;
  mime_type: string;
  created_at: string;
}

interface StudyLibraryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  selectedNoteIds: string[];
  onToggleNote: (noteId: string) => void;
}

export const StudyLibraryDrawer: React.FC<StudyLibraryDrawerProps> = ({
  isOpen,
  onClose,
  selectedNoteIds,
  onToggleNote,
}) => {
  const [notes, setNotes] = useState<NoteLibraryItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isOpen) return;

    async function loadLibraryNotes() {
      setLoading(true);
      const supabase = getSupabaseClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { data } = await (supabase as any)
          .from("notes")
          .select("id, title, original_filename, mime_type, created_at")
          .eq("user_id", user.id)
          .order("updated_at", { ascending: false });

        setNotes(data || []);
      }
      setLoading(false);
    }

    loadLibraryNotes();
  }, [isOpen]);

  if (!isOpen) return null;

  const filteredNotes = notes.filter(
    (n) =>
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.original_filename.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs select-none">
      <div className="bg-white rounded-[20px] border border-slate-200 shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[85vh] animate-fade-in">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-[#219EBC]/15 rounded-[12px] text-[#219EBC]">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900">Attach Study Material</h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Select notes or PDFs from your Study Library to include as context for Mr Owl
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-4 border-b border-slate-100 bg-white">
          <div className="relative flex items-center">
            <Search className="w-4 h-4 absolute left-3.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search your library notes & PDFs..."
              className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-[12px] text-slate-900 focus:bg-white focus:border-[#219EBC] outline-hidden transition-colors"
            />
          </div>
        </div>

        {/* Note List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
          {loading ? (
            <div className="p-8 text-center text-xs text-slate-400 font-medium">
              Loading Study Library...
            </div>
          ) : filteredNotes.length === 0 ? (
            <div className="p-8 text-center space-y-2">
              <Layers className="w-8 h-8 text-slate-300 mx-auto" />
              <p className="text-xs text-slate-500 font-bold">No notes found in your library</p>
              <p className="text-[11px] text-slate-400">
                Upload PDFs or documents in Study Library to attach them to chat conversations.
              </p>
            </div>
          ) : (
            filteredNotes.map((note) => {
              const isSelected = selectedNoteIds.includes(note.id);
              return (
                <div
                  key={note.id}
                  onClick={() => onToggleNote(note.id)}
                  className={`flex items-center justify-between p-3 rounded.xl border transition-all cursor-pointer ${
                    isSelected
                      ? "bg-sky-50/80 border-[#219EBC] shadow-2xs"
                      : "bg-white border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`p-2 rounded-[10px] ${
                        isSelected ? "bg-[#219EBC] text-white" : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      <FileText className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs font-extrabold text-slate-900 truncate">
                        {note.title}
                      </h4>
                      <p className="text-[10px] text-slate-400 font-medium truncate">
                        {note.original_filename}
                      </p>
                    </div>
                  </div>

                  <div
                    className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors shrink-0 ${
                      isSelected
                        ? "bg-[#219EBC] border-[#219EBC] text-white"
                        : "border-slate-300 bg-white"
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          <span className="text-xs font-bold text-slate-600">
            {selectedNoteIds.length} {selectedNoteIds.length === 1 ? "file" : "files"} selected
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-[#219EBC] hover:bg-[#023047] text-white font-extrabold text-xs rounded-[10px] transition-colors cursor-pointer shadow-2xs"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
