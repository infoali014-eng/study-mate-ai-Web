import React from "react";
import { Task } from "@/types/course.types";

interface TaskSectionProps {
  task: Task;
}

export const TaskSection: React.FC<TaskSectionProps> = ({ task }) => {
  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="border-b border-slate-100 pb-4">
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
          Hands-on Task
        </h2>
        <p className="text-slate-500 text-xs sm:text-sm font-medium">
          Apply what you&apos;ve learned through structured practical exercises.
        </p>
      </div>

      {/* Task Content Card */}
      <div className="bg-white border border-slate-200/60 rounded-2xl p-6 sm:p-8 space-y-6">
        <div className="space-y-2">
          <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-100/50">
            Practice Task
          </span>
          <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 pt-1">
            {task.title}
          </h3>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            {task.description}
          </p>
        </div>

        {/* Detailed Instructions */}
        <div className="bg-slate-50 border border-slate-200/40 rounded-xl p-5 sm:p-6 space-y-4">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Instructions
          </h4>
          <div className="space-y-3">
            {task.instructions.split("\n").map((line, idx) => {
              const trimmed = line.trim();
              if (trimmed === "") return null;

              // Parse list item format (e.g. "1. Instruction")
              const match = trimmed.match(/^(\d+)\.\s(.*)$/);
              if (match) {
                return (
                  <div key={idx} className="flex gap-3 text-slate-600 text-sm sm:text-base leading-relaxed pl-1">
                    <span className="font-bold text-slate-800 shrink-0">{match[1]}.</span>
                    <span>{match[2]}</span>
                  </div>
                );
              }
              return (
                <p key={idx} className="text-slate-600 text-sm sm:text-base leading-relaxed">
                  {trimmed}
                </p>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
