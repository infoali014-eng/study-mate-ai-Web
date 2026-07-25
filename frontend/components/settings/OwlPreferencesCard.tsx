"use client";

import React from "react";
import { Bot } from "lucide-react";
import { useOwlStore } from "@/store/owlStore";

export default function OwlPreferencesCard() {
  const { enabled, setEnabled } = useOwlStore();

  return (
    <div className="bg-white rounded-[16px] border border-slate-200 p-6 shadow-xs space-y-6 select-none">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <Bot className="w-5 h-5 text-[#219EBC]" />
          <h2 className="text-base font-extrabold text-slate-900">Mr Owl Assistant</h2>
        </div>
        <p className="text-xs text-slate-500 font-medium mt-0.5">
          Toggle Mr Owl floating study mascot on your dashboard.
        </p>
      </div>

      <div className="flex items-center justify-between p-4 bg-slate-50 rounded-[12px] border border-slate-200/80">
        <div className="space-y-0.5 min-w-0 pr-4">
          <h3 className="text-xs font-extrabold text-slate-900">Show Mr Owl on Dashboard</h3>
          <p className="text-[11px] text-slate-500 font-medium">
            Display the floating Mr Owl mascot with rotating study tips and suggestions.
          </p>
        </div>

        {/* Toggle Switch */}
        <button
          type="button"
          onClick={() => setEnabled(!enabled)}
          className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
            enabled ? "bg-[#219EBC]" : "bg-slate-300"
          }`}
          role="switch"
          aria-checked={enabled}
        >
          <span
            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
              enabled ? "translate-x-5" : "translate-x-0"
            }`}
          />
        </button>
      </div>
    </div>
  );
}
