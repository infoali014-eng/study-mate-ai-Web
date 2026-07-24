import React from "react";
import { Clock } from "lucide-react";
import DashboardSection from "./DashboardSection";

export default function RecentActivityTimeline() {
  return (
    <DashboardSection
      title="Recent Activity"
      description="Automated log of your study milestones and quiz sessions"
    >
      <div className="bg-white border border-slate-200/80 rounded-[12px] p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col items-center justify-center text-center max-w-md mx-auto py-6 space-y-3">
          <div className="w-12 h-12 rounded-[12px] bg-slate-100 text-slate-500 flex items-center justify-center shadow-xs">
            <Clock className="w-6 h-6" />
          </div>

          <div className="space-y-1.5">
            <h3 className="text-sm font-bold text-slate-900">
              Your study timeline will appear here
            </h3>
            <p className="text-xs text-slate-500 font-medium leading-relaxed">
              Every upload, quiz, AI conversation and revision session will be recorded automatically as you study.
            </p>
          </div>
        </div>
      </div>
    </DashboardSection>
  );
}
