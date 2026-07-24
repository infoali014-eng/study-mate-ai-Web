"use client";

import React, { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, BookOpen, BrainCircuit, Layers, FileText } from "lucide-react";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when opened and handle Escape key
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs"
            onClick={onClose}
          />

          {/* Dialog Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="relative z-10 w-full max-w-xl bg-white border border-slate-200 rounded-[12px] shadow-2xl overflow-hidden select-none"
          >
            {/* Search Input Bar */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-100 bg-[#F8FAFC]">
              <Search className="w-5 h-5 text-[#219EBC] shrink-0" />
              <input
                ref={inputRef}
                type="text"
                placeholder="Search notes, chats, quizzes..."
                className="flex-1 bg-transparent text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none"
              />
              <kbd className="hidden sm:inline-flex items-center gap-0.5 bg-slate-200/70 border border-slate-300 text-slate-500 rounded-[6px] px-1.5 py-0.5 text-[10px] font-mono">
                ESC
              </kbd>
              <button
                type="button"
                onClick={onClose}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-[8px] transition-colors cursor-pointer"
                aria-label="Close search"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Suggestions Canvas */}
            <div className="p-4 space-y-4 max-h-[60vh] overflow-y-auto">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Quick Shortcuts
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between p-2.5 rounded-[10px] hover:bg-slate-50 transition-colors cursor-pointer text-xs font-semibold text-slate-700 group">
                  <div className="flex items-center gap-3">
                    <BookOpen className="w-4 h-4 text-[#219EBC]" />
                    <span>Search in Study Library</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 group-hover:text-[#219EBC]">
                    /library
                  </span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-[10px] hover:bg-slate-50 transition-colors cursor-pointer text-xs font-semibold text-slate-700 group">
                  <div className="flex items-center gap-3">
                    <BrainCircuit className="w-4 h-4 text-[#FFB703]" />
                    <span>Search AI Quizzes</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 group-hover:text-[#219EBC]">
                    /quiz
                  </span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-[10px] hover:bg-slate-50 transition-colors cursor-pointer text-xs font-semibold text-slate-700 group">
                  <div className="flex items-center gap-3">
                    <Layers className="w-4 h-4 text-[#FB8500]" />
                    <span>Search Flashcard Decks</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 group-hover:text-[#219EBC]">
                    /flashcards
                  </span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-[10px] hover:bg-slate-50 transition-colors cursor-pointer text-xs font-semibold text-slate-700 group">
                  <div className="flex items-center gap-3">
                    <FileText className="w-4 h-4 text-slate-500" />
                    <span>Search Study Notes</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 group-hover:text-[#219EBC]">
                    /notes
                  </span>
                </div>
              </div>
            </div>

            {/* Footer info */}
            <div className="px-4 py-2 bg-[#F8FAFC] border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-medium">
              <span>Press ESC to exit search</span>
              <span>Mr Owl AI Global Search</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
