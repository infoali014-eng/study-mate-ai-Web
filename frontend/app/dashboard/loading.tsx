import React from "react";

export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-slate-950 text-white pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8 animate-pulse">
        <div className="h-8 bg-slate-800/80 rounded-lg w-56" />

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 space-y-3"
            >
              <div className="h-4 bg-slate-800/60 rounded-md w-24" />
              <div className="h-8 bg-slate-800/90 rounded-lg w-16" />
            </div>
          ))}
        </div>

        {/* Content Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-64 bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6" />
          <div className="h-64 bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6" />
        </div>
      </div>
    </div>
  );
}
