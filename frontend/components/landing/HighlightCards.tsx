import React from "react";
import { DBHomepageHighlight } from "@/types/admin.types";

interface HighlightCardsProps {
  highlights: DBHomepageHighlight[];
}

export const HighlightCards: React.FC<HighlightCardsProps> = ({ highlights }) => {
  const activeHighlights = highlights
    .filter((h) => !h.is_hidden)
    .sort((a, b) => a.order - b.order);

  if (activeHighlights.length === 0) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 select-none">
      {activeHighlights.map((hl) => (
        <div
          key={hl.id}
          className="p-6 rounded-2xl bg-white border border-slate-200/60 shadow-xs hover:border-[#219EBC]/40 hover:-translate-y-0.5 transition-all duration-200 flex items-start gap-4"
        >
          <div className="w-10 h-10 rounded-xl bg-[#219EBC]/10 text-[#219EBC] flex items-center justify-center shrink-0 font-extrabold text-lg">
            {hl.icon === "GraduationCap" ? (
              <span>🎓</span>
            ) : hl.icon === "Code2" ? (
              <span>💻</span>
            ) : hl.icon === "Users" ? (
              <span>👥</span>
            ) : (
              <span>✨</span>
            )}
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-extrabold text-slate-900 leading-snug">{hl.title}</h3>
            <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed">
              {hl.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};
