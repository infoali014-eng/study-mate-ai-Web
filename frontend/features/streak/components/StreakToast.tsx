"use client";

import React, { useEffect } from "react";
import { useStreakStore } from "../store/streakStore";

export default function StreakToast() {
  const { toastVisible, toastStreakCount, hideToast } = useStreakStore();

  useEffect(() => {
    if (toastVisible) {
      const timer = setTimeout(() => {
        hideToast();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toastVisible, hideToast]);

  if (!toastVisible) return null;

  return (
    <div className="fixed top-5 right-5 z-50 animate-in slide-in-from-top-4 fade-in-50 duration-200 select-none">
      <div className="bg-white border border-slate-200 rounded-[14px] shadow-2xl p-3.5 flex items-center gap-3 max-w-xs overflow-hidden border-l-4 border-l-[#FB8500]">
        <div className="w-10 h-10 rounded-[10px] bg-gradient-to-tr from-[#FB8500] to-[#FFB703] flex items-center justify-center text-white text-lg font-black shadow-xs shrink-0 animate-bounce">
          🔥
        </div>

        <div>
          <div className="text-xs font-black text-slate-900 flex items-center gap-1">
            <span>+1 Day Streak!</span>
          </div>
          <p className="text-[11px] text-[#FB8500] font-extrabold">
            {toastStreakCount} Day Streak Completed 🎉
          </p>
        </div>
      </div>
    </div>
  );
}
