import React from "react";
import Link from "next/link";
import { CalendarClock, ArrowRight } from "lucide-react";
import DashboardSection from "./DashboardSection";

export default function UpcomingScheduleSection() {
  return (
    <DashboardSection
      title="Upcoming Schedule"
      description="Exam countdowns, revision reminders, and scheduled tasks"
    >
      <div className="bg-white border border-slate-200/80 rounded-[12px] p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col items-center justify-center text-center max-w-md mx-auto py-6 space-y-3">
          <div className="w-12 h-12 rounded-[12px] bg-[#FFB703]/20 text-[#FB8500] flex items-center justify-center shadow-xs">
            <CalendarClock className="w-6 h-6" />
          </div>

          <div className="space-y-1.5">
            <h3 className="text-sm font-bold text-slate-900">
              No upcoming exams or reminders
            </h3>
            <p className="text-xs text-slate-500 font-medium leading-relaxed">
              Schedule your exam dates and weekly study goals in the Revision Planner to see automatic countdowns here.
            </p>
          </div>

          <div className="pt-2">
            <Link
              href="/planner"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#219EBC] hover:text-[#023047] transition-colors cursor-pointer"
            >
              <span>Open Revision Planner</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </DashboardSection>
  );
}
