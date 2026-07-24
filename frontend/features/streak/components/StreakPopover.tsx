"use client";

import React, { useEffect, useRef } from "react";
import { UserStreak, DayActivityStatus } from "../types/streak.types";
import WeeklyCalendar from "./WeeklyCalendar";
import StreakStats from "./StreakStats";
import TodayProgress from "./TodayProgress";

interface StreakPopoverProps {
  streak: UserStreak;
  weeklyHistory: DayActivityStatus[];
  isOpen: boolean;
  onClose: () => void;
}

export default function StreakPopover({
  streak,
  weeklyHistory,
  isOpen,
  onClose,
}: StreakPopoverProps) {
  const popoverRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        onClose();
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={popoverRef}
      className="absolute top-full right-0 mt-2 z-50 w-[340px] bg-white border border-slate-200 rounded-[12px] shadow-xl p-4 space-y-4 select-none animate-in fade-in-50 zoom-in-95 duration-180"
    >
      {/* Section 1: Large Flame Icon & Current Streak */}
      <div className="flex items-center gap-3 pb-2 border-b border-slate-100">
        <div className="w-12 h-12 rounded-[14px] bg-gradient-to-tr from-[#FB8500]/15 to-[#FFB703]/20 flex items-center justify-center text-2xl shadow-2xs">
          🔥
        </div>
        <div>
          <h2 className="text-xl font-black text-slate-900 leading-tight">
            {streak.current_streak} {streak.current_streak === 1 ? "Day" : "Days"}
          </h2>
        </div>
      </div>

      {/* Section 2: Horizontal Weekly Calendar */}
      <WeeklyCalendar history={weeklyHistory} />

      {/* Section 3: Statistics (Current & Best) */}
      <StreakStats streak={streak} />

      {/* Section 4: Today's Progress Checklist */}
      <TodayProgress streak={streak} />
    </div>
  );
}
