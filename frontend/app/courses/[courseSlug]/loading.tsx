import React from "react";

export default function CourseDetailLoading() {
  return (
    <div className="min-h-screen bg-slate-950 text-white pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8 animate-pulse">
        {/* Banner Skeleton */}
        <div className="h-64 bg-slate-900/80 border border-slate-800/80 rounded-3xl p-8 flex flex-col justify-end space-y-4 shadow-xl">
          <div className="h-4 bg-cyan-500/20 rounded-full w-28" />
          <div className="h-8 bg-slate-800 rounded-lg w-2/3" />
          <div className="h-4 bg-slate-800/60 rounded-md w-1/2" />
        </div>

        {/* Course Curriculum & Sidebar Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <div className="h-6 bg-slate-800/80 rounded-md w-40 mb-4" />
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-16 bg-slate-900/60 border border-slate-800/80 rounded-xl p-4 flex items-center justify-between"
              >
                <div className="h-4 bg-slate-800/60 rounded-md w-1/2" />
                <div className="h-8 bg-slate-800/80 rounded-lg w-20" />
              </div>
            ))}
          </div>

          <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 h-fit space-y-4">
            <div className="h-5 bg-slate-800/80 rounded-md w-32" />
            <div className="h-10 bg-cyan-500/20 rounded-xl w-full" />
            <div className="space-y-2 pt-2">
              <div className="h-3 bg-slate-800/50 rounded w-full" />
              <div className="h-3 bg-slate-800/50 rounded w-4/5" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
