"use client";

import React from "react";
import { useStreak } from "../hooks/useStreak";
import StreakPopover from "./StreakPopover";
import StreakToast from "./StreakToast";

export default function StreakButton() {
  const { streak, weeklyHistory, isOpen, toggleOpen, setIsOpen } = useStreak();

  return (
    <div className="relative inline-block select-none">
      <button
        type="button"
        onClick={toggleOpen}
        className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50/80 hover:bg-amber-100/80 border border-amber-200/80 rounded-[12px] transition-all cursor-pointer shadow-2xs group"
        title="View Study Streak"
      >
        <span className="text-sm transition-transform group-hover:scale-110">🔥</span>
        <span className="text-xs font-black text-[#FB8500]">
          {streak.current_streak}
        </span>
      </button>

      {/* Popover */}
      <StreakPopover
        streak={streak}
        weeklyHistory={weeklyHistory}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />

      {/* Top-Right Toast Notification */}
      <StreakToast />
    </div>
  );
}
