"use client";

import React from "react";
import { DayActivityStatus } from "../types/streak.types";

interface WeeklyCalendarProps {
  history: DayActivityStatus[];
}

export default function WeeklyCalendar({ history }: WeeklyCalendarProps) {
  return (
    <div className="w-full flex items-center justify-between px-2 py-1 select-none">
      {history.map((day) => {
        return (
          <div key={day.date} className="group relative flex flex-col items-center gap-1.5 cursor-pointer">
            {/* Day Header Label */}
            <span
              className={`text-[11px] font-extrabold ${
                day.isToday ? "text-[#FB8500]" : "text-slate-400"
              }`}
            >
              {day.dayLabel}
            </span>

            {/* Circle Indicator */}
            <div
              className={`flex items-center justify-center transition-all duration-200 ${
                day.isToday ? "w-7 h-7 ring-2 ring-[#FB8500]/30" : "w-6 h-6"
              } rounded-full`}
            >
              {day.isCompleted ? (
                <div className="w-full h-full rounded-full bg-gradient-to-tr from-[#FB8500] to-[#FFB703] shadow-xs flex items-center justify-center text-white text-[10px] font-extrabold">
                  ✓
                </div>
              ) : day.isMissed ? (
                <div className="w-full h-full rounded-full bg-slate-200 flex items-center justify-center text-slate-400 text-[10px] font-bold">
                  •
                </div>
              ) : day.isToday ? (
                <div className="w-full h-full rounded-full border-2 border-dashed border-[#FB8500] bg-[#FB8500]/10 flex items-center justify-center text-[#FB8500] text-[10px] font-bold">
                  •
                </div>
              ) : (
                <div className="w-full h-full rounded-full border-2 border-slate-200 bg-white" />
              )}
            </div>

            {/* Clean Hover Tooltip (Day Name + Status Only) */}
            <div className="absolute bottom-full mb-2 hidden group-hover:block z-30 px-2.5 py-1 bg-slate-900 text-white text-[10px] font-bold rounded-[6px] shadow-lg whitespace-nowrap pointer-events-none">
              <span>{day.fullDayName}</span>
              <span className="mx-1">•</span>
              <span className={day.isCompleted ? "text-[#FFB703]" : "text-slate-300"}>
                {day.isCompleted ? "Completed" : day.isMissed ? "Missed" : day.isToday ? "Today" : "Future"}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
