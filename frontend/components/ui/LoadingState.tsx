import React from "react";
import { Loader2 } from "lucide-react";

export interface LoadingStateProps {
  mode?: "spinner" | "skeleton" | "page" | "card";
  text?: string;
  className?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  mode = "spinner",
  text = "Loading...",
  className = "",
}) => {
  if (mode === "page") {
    return (
      <div className={`min-h-[50vh] flex flex-col items-center justify-center space-y-3 p-8 ${className}`}>
        <Loader2 className="w-8 h-8 text-[#219EBC] animate-spin" />
        {text && (
          <p className="text-xs font-semibold text-slate-500 animate-pulse">
            {text}
          </p>
        )}
      </div>
    );
  }

  if (mode === "card") {
    return (
      <div className={`p-6 bg-white border border-slate-200/80 rounded-[12px] shadow-xs animate-pulse space-y-4 ${className}`}>
        <div className="h-4 bg-slate-200 rounded-md w-1/3" />
        <div className="space-y-2">
          <div className="h-3 bg-slate-100 rounded-md w-full" />
          <div className="h-3 bg-slate-100 rounded-md w-4/5" />
        </div>
      </div>
    );
  }

  if (mode === "skeleton") {
    return (
      <div className={`animate-pulse bg-slate-200/80 rounded-[12px] ${className}`} />
    );
  }

  return (
    <div className={`inline-flex items-center gap-2 text-xs font-semibold text-slate-500 ${className}`}>
      <Loader2 className="w-4 h-4 text-[#219EBC] animate-spin" />
      {text && <span>{text}</span>}
    </div>
  );
};
