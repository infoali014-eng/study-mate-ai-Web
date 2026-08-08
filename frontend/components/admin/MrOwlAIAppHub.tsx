"use client";

import React from "react";
import Link from "next/link";
import MrOwl from "@/components/owl/MrOwl";

export const MrOwlAIAppHub: React.FC = () => {
  const appModules = [
    {
      id: "dashboard",
      title: "Main Study Dashboard",
      description: "Overview of user study stats, quick notes upload, upcoming reviews, and mascot interaction.",
      href: "/dashboard",
      icon: "📊",
      badge: "Core App",
      color: "from-cyan-500 to-[#219EBC]",
    },
    {
      id: "library",
      title: "Study Knowledge Library",
      description: "PDF/DOCX/PPTX upload manager, Cloudflare R2 storage index, document search & AI indexing.",
      href: "/dashboard/library",
      icon: "📚",
      badge: "Knowledge Hub",
      color: "from-blue-600 to-indigo-600",
    },
    {
      id: "chat",
      title: "Chat with Notes & Owl AI",
      description: "Interactive AI study assistant. Ask questions directly against uploaded notes & documents.",
      href: "/chat",
      icon: "🤖",
      badge: "AI Assistant",
      color: "from-purple-600 to-pink-600",
    },
    {
      id: "quiz",
      title: "AI Quiz Practice Mode",
      description: "Generate auto-graded quizzes from study materials with instant explanations & passing scores.",
      href: "/quiz",
      icon: "🧠",
      badge: "Assessment",
      color: "from-[#219EBC] to-emerald-600",
    },
    {
      id: "flashcards",
      title: "Flashcards Deck Studio",
      description: "Spaced repetition flashcard decks for quick memory recall and exam preparation.",
      href: "/flashcards",
      icon: "🎴",
      badge: "Spaced Repetition",
      color: "from-amber-500 to-orange-600",
    },
    {
      id: "planner",
      title: "Automated Revision Planner",
      description: "AI calendar schedule generator to organize daily study sessions and review milestones.",
      href: "/planner",
      icon: "📅",
      badge: "Schedule",
      color: "from-emerald-500 to-teal-700",
    },
    {
      id: "pomodoro",
      title: "Focus Pomodoro Timer",
      description: "Pomodoro study timer with ambient background focus states and productivity metrics.",
      href: "/tools/pomodoro",
      icon: "⏱️",
      badge: "Focus Tool",
      color: "from-rose-500 to-red-600",
    },
    {
      id: "settings",
      title: "Mascot & AI Preferences",
      description: "Configure Mr Owl mascot appearance, skins (Woodland Brown, etc.), accessories, and AI settings.",
      href: "/dashboard/settings",
      icon: "⚙️",
      badge: "Customization",
      color: "from-slate-700 to-slate-900",
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in select-text">
      {/* Hero Banner Header */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-cyan-950 p-8 rounded-3xl text-white shadow-xl border border-white/10 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-3 z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-400/30 text-cyan-300 text-xs font-black uppercase tracking-wider">
            <span>🦉</span> Formerly StudyMate AI
          </div>
          <h2 className="text-3xl font-black tracking-tight text-white">
            Mr Owl AI Application Suite
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm font-medium leading-relaxed">
            As an Administrator, you have unrestricted access to all features built inside the Mr Owl AI application workspace, including the Study Library, AI Assistant, Quizzes, Flashcards, & Revision Planner.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4">
            <Link
              href="/dashboard"
              className="bg-[#219EBC] hover:bg-[#1a849e] text-white font-black text-xs sm:text-sm px-6 py-3.5 rounded-xl shadow-lg transition-all flex items-center gap-2 hover:scale-102"
            >
              <span>🚀 Launch Main Dashboard</span>
            </Link>

            <Link
              href="/dashboard/library"
              className="bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm px-5 py-3.5 rounded-xl border border-white/20 transition-all flex items-center gap-2"
            >
              <span>📚 Open Study Library</span>
            </Link>
          </div>
        </div>

        {/* Animated Mascot Graphic */}
        <div className="w-32 h-32 relative shrink-0 flex items-center justify-center bg-white/5 rounded-3xl border border-white/10 p-4">
          <MrOwl animState="idle" size={110} />
        </div>
      </div>

      {/* Modules Grid */}
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-black text-slate-900 tracking-tight">Access Built Application Modules</h3>
          <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Direct 1-click administrative access to all tools</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {appModules.map((module) => (
            <Link
              key={module.id}
              href={module.href}
              className="group bg-white border border-slate-200/80 p-5 rounded-2xl shadow-xs hover:shadow-md transition-all duration-200 hover:-translate-y-1 flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${module.color} text-white flex items-center justify-center text-xl shadow-xs`}>
                    {module.icon}
                  </div>
                  <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 group-hover:bg-cyan-50 group-hover:text-[#219EBC] transition-colors">
                    {module.badge}
                  </span>
                </div>

                <div className="space-y-1">
                  <h4 className="text-sm font-black text-slate-900 group-hover:text-[#219EBC] transition-colors">
                    {module.title}
                  </h4>
                  <p className="text-slate-500 text-xs font-medium leading-relaxed">
                    {module.description}
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-extrabold text-[#219EBC]">
                <span>Open Module</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};
