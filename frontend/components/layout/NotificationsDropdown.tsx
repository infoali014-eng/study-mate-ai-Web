"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, CheckCheck, Sparkles, Flame, BookOpen } from "lucide-react";

export default function NotificationsDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasUnread, setHasUnread] = useState(true);
  const popoverRef = useRef<HTMLDivElement>(null);

  // Close on click outside or Escape
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const handleMarkAllRead = () => {
    setHasUnread(false);
  };

  return (
    <div className="relative" ref={popoverRef}>
      {/* Notifications Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-label="Notifications"
        title="Notifications"
        className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 rounded-[12px] transition-colors cursor-pointer"
      >
        <Bell className="w-5 h-5" />
        {hasUnread && (
          <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-[#FB8500] rounded-full ring-2 ring-[#F8FAFC]" />
        )}
      </button>

      {/* Notifications Popover */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -6 }}
            animate={{ opacity: 1, scale: 1, y: 4 }}
            exit={{ opacity: 0, scale: 0.95, y: -6 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="absolute right-0 top-full mt-1 w-80 sm:w-96 bg-white border border-slate-200 rounded-[12px] shadow-xl p-3 z-50 select-none"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-2 pb-2 border-b border-slate-100 mb-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-900">Notifications</span>
                {hasUnread && (
                  <span className="bg-[#FB8500]/10 text-[#FB8500] text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                    New
                  </span>
                )}
              </div>
              {hasUnread && (
                <button
                  type="button"
                  onClick={handleMarkAllRead}
                  className="flex items-center gap-1 text-[11px] font-semibold text-[#219EBC] hover:text-[#023047] transition-colors cursor-pointer"
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  <span>Mark all read</span>
                </button>
              )}
            </div>

            {/* Notification Items */}
            <div className="space-y-1.5 max-h-72 overflow-y-auto">
              <div className="flex items-start gap-3 p-2.5 rounded-[10px] bg-slate-50 border border-slate-100">
                <div className="w-8 h-8 rounded-[8px] bg-[#219EBC]/10 text-[#219EBC] flex items-center justify-center shrink-0 mt-0.5">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0 space-y-0.5">
                  <div className="text-xs font-bold text-slate-900">
                    Welcome to Mr Owl AI!
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Start by adding your study notes or generating AI quizzes.
                  </div>
                  <div className="text-[10px] text-slate-400 font-medium pt-1">Just now</div>
                </div>
              </div>

              <div className="flex items-start gap-3 p-2.5 rounded-[10px] hover:bg-slate-50 transition-colors">
                <div className="w-8 h-8 rounded-[8px] bg-[#FFB703]/20 text-[#FB8500] flex items-center justify-center shrink-0 mt-0.5">
                  <Flame className="w-4 h-4 fill-[#FB8500]" />
                </div>
                <div className="flex-1 min-w-0 space-y-0.5">
                  <div className="text-xs font-bold text-slate-900">
                    Streak Active 🔥 12 Days
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Great job! You&apos;ve maintained a 12-day study streak.
                  </div>
                  <div className="text-[10px] text-slate-400 font-medium pt-1">Today</div>
                </div>
              </div>

              <div className="flex items-start gap-3 p-2.5 rounded-[10px] hover:bg-slate-50 transition-colors">
                <div className="w-8 h-8 rounded-[8px] bg-slate-100 text-slate-600 flex items-center justify-center shrink-0 mt-0.5">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0 space-y-0.5">
                  <div className="text-xs font-bold text-slate-900">
                    Study Library Ready
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Organize your subjects and courses into custom folders.
                  </div>
                  <div className="text-[10px] text-slate-400 font-medium pt-1">Yesterday</div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="pt-2 mt-2 border-t border-slate-100 text-center">
              <span className="text-[11px] text-slate-400 font-medium">
                You&apos;re all caught up!
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
