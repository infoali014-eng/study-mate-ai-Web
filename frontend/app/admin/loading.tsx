import React from "react";

export default function AdminLoading() {
  return (
    <div className="min-h-screen bg-slate-950 text-white pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6 animate-pulse">
        <div className="flex items-center justify-between">
          <div className="h-8 bg-slate-800/80 rounded-lg w-48" />
          <div className="h-10 bg-slate-800/80 rounded-xl w-32" />
        </div>
        <div className="h-12 bg-slate-900/80 border border-slate-800/80 rounded-xl w-full" />
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-16 bg-slate-900/60 border border-slate-800/80 rounded-xl w-full" />
          ))}
        </div>
      </div>
    </div>
  );
}
