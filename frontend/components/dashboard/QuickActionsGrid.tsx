import React from "react";
import Link from "next/link";
import {
  Upload,
  BrainCircuit,
  Layers3,
  Bot,
  CalendarClock,
  ArrowRight,
} from "lucide-react";
import DashboardSection from "./DashboardSection";

export default function QuickActionsGrid() {
  const actions = [
    {
      id: "upload",
      title: "Upload Notes",
      description: "Add PDFs, DOCX or PPTX to your Study Library.",
      href: "/library?action=upload",
      icon: Upload,
      iconBg: "bg-[#219EBC]/10 text-[#219EBC] group-hover:bg-[#219EBC] group-hover:text-white",
    },
    {
      id: "quiz",
      title: "Create Quiz",
      description: "Generate AI practice questions from your material.",
      href: "/quiz?action=create",
      icon: BrainCircuit,
      iconBg: "bg-[#FFB703]/20 text-[#023047] group-hover:bg-[#FFB703]",
    },
    {
      id: "flashcards",
      title: "Generate Flashcards",
      description: "Build interactive spaced repetition decks.",
      href: "/flashcards?action=create",
      icon: Layers3,
      iconBg: "bg-[#8ECAE6]/30 text-[#023047] group-hover:bg-[#219EBC] group-hover:text-white",
    },
    {
      id: "ai",
      title: "Ask Owl AI",
      description: "Chat with your personal AI study assistant.",
      href: "/chat",
      icon: Bot,
      iconBg: "bg-[#023047]/10 text-[#023047] group-hover:bg-[#023047] group-hover:text-white",
    },
    {
      id: "planner",
      title: "Create Revision Plan",
      description: "Schedule automated study and review goals.",
      href: "/planner?action=create",
      icon: CalendarClock,
      iconBg: "bg-slate-100 text-slate-700 group-hover:bg-slate-800 group-hover:text-white",
    },
  ];

  return (
    <DashboardSection
      title="Quick Actions"
      description="Launch key tools and create study materials instantly"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <Link
              key={action.id}
              href={action.href}
              className="group flex items-start gap-4 p-4.5 bg-white border border-slate-200/80 hover:border-[#219EBC] rounded-[12px] transition-all shadow-xs cursor-pointer select-none"
            >
              <div className={`w-11 h-11 rounded-[12px] flex items-center justify-center shrink-0 transition-colors duration-150 ${action.iconBg}`}>
                <Icon className="w-5 h-5" />
              </div>

              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-slate-900 group-hover:text-[#219EBC] transition-colors">
                    {action.title}
                  </span>
                  <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-[#219EBC] transition-colors shrink-0" />
                </div>
                <p className="text-xs text-slate-500 font-medium leading-relaxed">
                  {action.description}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </DashboardSection>
  );
}
