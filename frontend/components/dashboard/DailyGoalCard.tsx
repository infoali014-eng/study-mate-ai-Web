import React from "react";
import Link from "next/link";
import { Target, Play } from "lucide-react";
import DashboardSection from "./DashboardSection";

export default function DailyGoalCard() {
  return (
    <DashboardSection
      title="Daily Goal"
      description="Track your daily study target and build consistent habits"
    >
      <div className="p-5 sm:p-6 bg-white border border-slate-200/80 rounded-[12px] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        {/* Goal Summary */}
        <div className="flex items-start gap-4 flex-1">
          <div className="w-11 h-11 rounded-[12px] bg-[#FFB703]/20 text-[#023047] flex items-center justify-center shrink-0">
            <Target className="w-6 h-6 text-[#FB8500]" />
          </div>
          <div className="space-y-2 flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Today&apos;s Target: Study 60 minutes
              </span>
              <span className="text-xs font-extrabold text-[#023047]">
                0 / 60 min
              </span>
            </div>

            {/* Empty Progress Bar */}
            <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
              <div className="bg-[#219EBC] h-full w-0 transition-all duration-300" />
            </div>

            <p className="text-xs text-slate-500 font-medium">
              No study session started today. Launch a session to start tracking your daily goal.
            </p>
          </div>
        </div>

        {/* Action Button */}
        <div className="shrink-0">
          <Link
            href="/planner"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#023047] hover:bg-[#03405e] text-white text-xs font-semibold rounded-[12px] transition-all shadow-xs cursor-pointer active:scale-[0.98]"
          >
            <Play className="w-3.5 h-3.5 fill-white" />
            <span>Start Session</span>
          </Link>
        </div>
      </div>
    </DashboardSection>
  );
}
