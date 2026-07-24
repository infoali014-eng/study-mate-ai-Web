"use client";

import React from "react";
import Link from "next/link";
import { Flame, LibraryBig, HardDrive, ArrowUpRight, Star } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import DashboardSection from "./DashboardSection";
import { LibraryService } from "@/services/libraryService";
import { useStreak } from "@/features/streak/hooks/useStreak";

export default function TodaysProgressGrid() {
  const { streak } = useStreak();

  const { data: stats = { totalNotes: 0, totalStorageBytes: 0, favoriteCount: 0, recentCount: 0 } } =
    useQuery({
      queryKey: ["dashboardStats"],
      queryFn: () => LibraryService.getDashboardStats(),
    });

  const formatStorageText = (bytes: number): string => {
    if (bytes === 0) return "0 MB / 20 GB";
    const mb = bytes / (1024 * 1024);
    if (mb < 1024) {
      return `${mb.toFixed(1)} MB / 20 GB`;
    }
    const gb = mb / 1024;
    return `${gb.toFixed(2)} GB / 20 GB`;
  };

  const cards = [
    {
      id: "streak",
      title: "Active Streak",
      status: `${streak.current_streak} ${streak.current_streak === 1 ? "Day" : "Days"}`,
      description: streak.today_completed ? "Today's goal completed!" : "Complete today's 100 PTS goal",
      icon: Flame,
      iconBg: "bg-[#FFB703]/20 text-[#FB8500]",
      href: "/dashboard",
      isFlame: true,
    },
    {
      id: "notes",
      title: "Total Study Notes",
      status: `${stats.totalNotes} ${stats.totalNotes === 1 ? "Note" : "Notes"}`,
      description: stats.totalNotes > 0 ? `${stats.recentCount} uploaded recently` : "Upload notes to Study Library",
      icon: LibraryBig,
      iconBg: "bg-[#219EBC]/10 text-[#219EBC]",
      href: "/dashboard/library",
    },
    {
      id: "storage",
      title: "Storage Used",
      status: formatStorageText(stats.totalStorageBytes),
      description: "Calculated live from physical R2 assets",
      icon: HardDrive,
      iconBg: "bg-slate-100 text-slate-700",
      href: "/dashboard/library",
    },
    {
      id: "favorites",
      title: "Favorite Notes",
      status: `${stats.favoriteCount} Starred`,
      description: "Starred study materials",
      icon: Star,
      iconBg: "bg-[#FFB703]/15 text-[#FFB703]",
      href: "/dashboard/library",
    },
  ];

  return (
    <DashboardSection
      title="Today's Progress & Storage"
      description="Real-time overview of your active study milestones and Cloudflare storage"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.id}
              href={card.href}
              className="group p-5 bg-white border border-slate-200/80 hover:border-[#219EBC] rounded-[12px] transition-all shadow-xs flex flex-col justify-between space-y-3 cursor-pointer hover:-translate-y-0.5"
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
