"use client";

import React from "react";
import { Check } from "lucide-react";
import { UserStreak, DayActivityStatus } from "../types/streak.types";

interface TodayProgressProps {
  streak: UserStreak;
  weeklyHistory?: DayActivityStatus[];
}

export default function TodayProgress({ streak, weeklyHistory = [] }: TodayProgressProps) {
  // Find today's activity status item from weekly history
  const todayRecord = weeklyHistory.find((d) => d.isToday);

  const points = todayRecord?.points ?? streak.today_points ?? 0;
  const chatDone = (todayRecord?.chatPoints ?? 0) > 0;
  const sessionDone = (todayRecord?.sessionPoints ?? 0) > 0;
  const uploadDone = (todayRecord?.uploadPoints ?? 0) > 0;
  const previewDone = (todayRecord?.previewPoints ?? 0) > 0;

  // Checklist items mapping directly to specific activity completions
  const tasks = [
    { id: "chat", label: "Chat with Mr Owl", pts: 30, completed: chatDone },
    { id: "session", label: "Stayed 10 Minutes", pts: 20, completed: sessionDone },
    { id: "upload", label: "Upload Note", pts: 30, completed: uploadDone },
    { id: "preview", label: "Open Note", pts: 20, completed: previewDone },
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
