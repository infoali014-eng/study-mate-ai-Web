import React from "react";
import Link from "next/link";
import { Clock, Flame, LibraryBig, Layers3, ArrowUpRight } from "lucide-react";
import DashboardSection from "./DashboardSection";

export default function TodaysProgressGrid() {
  const cards = [
    {
      id: "time",
      title: "Study Time",
      status: "No sessions yet",
      description: "Start a Pomodoro session to log time",
      icon: Clock,
      iconBg: "bg-slate-100 text-slate-600",
      href: "/planner",
    },
    {
      id: "streak",
      title: "Active Streak",
      status: "12 Days",
      description: "Keep your daily streak alive",
      icon: Flame,
      iconBg: "bg-[#FFB703]/20 text-[#FB8500]",
      href: "/dashboard",
      isFlame: true,
    },
    {
      id: "notes",
      title: "Notes Uploaded",
      status: "No notes uploaded",
      description: "Upload your first note to Library",
      icon: LibraryBig,
      iconBg: "bg-[#219EBC]/10 text-[#219EBC]",
      href: "/library?action=upload",
    },
    {
      id: "flashcards",
      title: "Flashcards Reviewed",
      status: "No decks reviewed",
      description: "Create a flashcard deck to study",
      icon: Layers3,
      iconBg: "bg-[#8ECAE6]/30 text-[#023047]",
      href: "/flashcards?action=create",
    },
  ];

  return (
    <DashboardSection
      title="Today's Progress"
      description="Overview of your active study milestones and daily habits"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.id}
              href={card.href}
              className="group p-5 bg-white border border-slate-200/80 hover:border-[#219EBC] rounded-[12px] transition-all shadow-xs flex flex-col justify-between space-y-3 cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <div className={`w-10 h-10 rounded-[10px] flex items-center justify-center shrink-0 ${card.iconBg}`}>
                  <Icon className={`w-5 h-5 ${card.isFlame ? "fill-[#FB8500]" : ""}`} />
                </div>
                <ArrowUpRight className="w-4 h-4 text-slate-300 group-hover:text-[#219EBC] transition-colors" />
              </div>

              <div className="space-y-1">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  {card.title}
                </div>
                <div className="text-sm font-extrabold text-slate-900 group-hover:text-[#219EBC] transition-colors">
                  {card.status}
                </div>
                <div className="text-[11px] text-slate-500 font-medium">
                  {card.description}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </DashboardSection>
  );
}
