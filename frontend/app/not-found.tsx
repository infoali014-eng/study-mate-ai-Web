import React from "react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 text-center select-none">
      <div className="space-y-6 max-w-md">
        <div className="text-6xl font-black text-[#219EBC] tracking-tight">404</div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Page Not Found</h1>
        <p className="text-slate-400 text-xs sm:text-sm font-medium leading-relaxed">
          The requested administrative page or resource could not be found or has been moved.
        </p>
        <div className="pt-4">
          <Link
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-[#219EBC] hover:bg-[#1a849e] text-white font-bold text-xs sm:text-sm shadow-lg transition-all"
          >
            ← Return to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
