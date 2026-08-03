"use client";

import React, { useState } from "react";
import Link from "next/link";
import { DBHomepageAnnouncement } from "@/types/admin.types";

interface AnnouncementBarProps {
  announcement: DBHomepageAnnouncement | null;
}

export const AnnouncementBar: React.FC<AnnouncementBarProps> = ({ announcement }) => {
  const [dismissed, setDismissed] = useState(false);

  if (!announcement || !announcement.is_active || dismissed) {
    return null;
  }

  return (
    <div className="bg-slate-900 text-white text-xs sm:text-sm font-medium py-2 px-4 relative z-40 select-none border-b border-slate-800 shadow-xs">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-2.5 truncate mx-auto sm:mx-0">
          {announcement.badge_text && (
            <span className="bg-[#219EBC] text-white font-extrabold text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full shrink-0">
              {announcement.badge_text}
            </span>
          )}
          <span className="truncate text-slate-200">{announcement.title}</span>
          {announcement.link_url && (
            <Link
              href={announcement.link_url}
              className="text-[#219EBC] hover:underline font-bold shrink-0 flex items-center gap-1 ml-1"
            >
              <span>{announcement.link_text || "Learn More"}</span>
              <span className="text-[10px]">→</span>
            </Link>
          )}
        </div>

        <button
          onClick={() => setDismissed(true)}
          className="text-slate-400 hover:text-white text-sm transition-colors p-1 shrink-0 cursor-pointer hidden sm:block"
          title="Dismiss"
          aria-label="Dismiss banner"
        >
          ✕
        </button>
      </div>
    </div>
  );
};
