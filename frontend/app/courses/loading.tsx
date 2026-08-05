import React from "react";

export default function CoursesLoading() {
  return (
    <div className="min-h-screen bg-slate-950 text-white pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8 animate-pulse">
        {/* Header Skeleton */}
        <div className="space-y-3">
          <div className="h-8 bg-slate-800/80 rounded-lg w-48" />
          <div className="h-4 bg-slate-800/50 rounded-md w-96 max-w-full" />
        </div>

        {/* Filter Pills Skeleton */}
        <div className="flex gap-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-9 w-24 bg-slate-800/60 rounded-full" />
          ))}
        </div>

        {/* Course Cards Skeleton Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 space-y-4 shadow-lg"
            >
              <div className="h-44 bg-slate-800/70 rounded-xl w-full" />
              <div className="space-y-2">
                <div className="h-5 bg-slate-800/80 rounded-md w-3/4" />
                <div className="h-4 bg-slate-800/50 rounded-md w-full" />
                <div className="h-4 bg-slate-800/50 rounded-md w-2/3" />
              </div>
              <div className="pt-4 border-t border-slate-800/60 flex items-center justify-between">
                <div className="h-4 bg-slate-800/60 rounded-md w-20" />
                <div className="h-8 bg-slate-800/80 rounded-lg w-24" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
