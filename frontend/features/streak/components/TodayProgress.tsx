"use client";

import React from "react";
import { Check } from "lucide-react";
import { UserStreak } from "../types/streak.types";

interface TodayProgressProps {
  streak: UserStreak;
}

export default function TodayProgress({ streak }: TodayProgressProps) {
  // Check completion states based on points accumulated today
  const points = streak.today_points || 0;

  // Checklist items mapping to scoring rules
  const tasks = [
    { id: "chat", label: "Chat with Mr Owl", pts: 30, completed: points >= 30 },
    { id: "session", label: "Stayed 10 Minutes", pts: 20, completed: points >= 50 || (points >= 20 && points % 30 === 20) },
    { id: "upload", label: "Upload Note", pts: 30, completed: points >= 80 || (points >= 30 && points % 20 === 10) },
    { id: "preview", label: "Open Note", pts: 20, completed: points >= 100 || points % 20 === 0 && points > 0 },
  ];

  return (
    <div className="space-y-2 select-none">
      <div className="flex items-center justify-between text-xs font-bold text-slate-700">
        <span>Today&apos;s Progress</span>
        <span className="text-[11px] font-extrabold text-[#FB8500]">{points} / 100 PTS</span>
      </div>

      <div className="space-y-1.5">
        {tasks.map((task) => (
          <div
            key={task.id}
            className={`flex items-center justify-between p-2 rounded-[8px] border transition-colors ${
              task.completed
                ? "bg-[#FB8500]/5 border-[#FB8500]/30 text-slate-900"
                : "bg-slate-50 border-slate-200/70 text-slate-500"
            }`}
          >
            <div className="flex items-center gap-2.5 text-xs font-semibold">
              <div
                className={`w-4 h-4 rounded-[4px] flex items-center justify-center transition-all duration-200 ${
                  task.completed
                    ? "bg-[#FB8500] text-white shadow-xs"
                    : "border-2 border-slate-300 bg-white"
                }`}
              >
                {task.completed && <Check className="w-3 h-3 stroke-[3]" />}
              </div>
              <span className={task.completed ? "font-bold text-slate-900" : ""}>{task.label}</span>
            </div>
            <span
              className={`text-[10px] font-mono font-bold ${
                task.completed ? "text-[#FB8500]" : "text-slate-400"
              }`}
            >
              +{task.pts} PTS
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
