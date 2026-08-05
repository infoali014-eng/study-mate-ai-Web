import React from "react";

export default function Loading() {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center space-y-6 relative overflow-hidden select-none">
      {/* Background Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none animate-pulse" />

      {/* DeepCode Logo Glow Container */}
      <div className="relative flex items-center justify-center">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-500/20 to-blue-600/20 border border-cyan-500/30 flex items-center justify-center shadow-[0_0_30px_rgba(33,158,188,0.3)] animate-pulse">
          <img
            src="/branding/deepcode/logo.png"
            alt="DeepCode"
            className="w-10 h-10 object-contain drop-shadow-[0_0_12px_rgba(33,158,188,0.8)]"
          />
        </div>
      </div>

      {/* Shimmering Loading Text */}
      <div className="flex flex-col items-center space-y-2">
        <span className="text-sm font-extrabold tracking-widest uppercase bg-gradient-to-r from-cyan-400 via-sky-200 to-cyan-400 bg-clip-text text-transparent animate-pulse">
          DeepCode Loading...
        </span>
        <div className="w-48 h-1 bg-slate-800 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 w-1/2 animate-shimmer rounded-full" />
        </div>
      </div>
    </div>
  );
}
