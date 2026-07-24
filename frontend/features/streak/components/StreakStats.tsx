"use client";

import React from "react";
import { UserStreak } from "../types/streak.types";

interface StreakStatsProps {
  streak: UserStreak;
}

export default function StreakStats({ streak }: StreakStatsProps) {
  return (
    <div className="space-y-2 select-none border-y border-slate-100 py-3 text-xs">
      <div className="flex items-center justify-between font-semibold">
        <span className="text-slate-500 font-medium">Current Streak</span>
        <span className="font-extrabold text-slate-900">{streak.current_streak} {streak.current_streak === 1 ? "Day" : "Days"}</span>
      </div>

      <div className="flex items-center justify-between font-semibold">
        <span className="text-slate-500 font-medium">Best Streak</span>
        <span className="font-extrabold text-[#FB8500]">{streak.best_streak} {streak.best_streak === 1 ? "Day" : "Days"}</span>
      </div>
    </div>
  );
}
