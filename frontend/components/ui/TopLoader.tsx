"use client";

import React, { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export const TopLoader: React.FC = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // When route changes complete, finalize progress bar
    setProgress(100);
    const timer = setTimeout(() => {
      setLoading(false);
      setProgress(0);
    }, 300);
    return () => clearTimeout(timer);
  }, [pathname, searchParams]);

  useEffect(() => {
    // Intercept clicks on links and cards to trigger progress bar immediately (< 10ms)
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest("a");
      if (anchor && anchor.href && anchor.href.startsWith(window.location.origin)) {
        const url = new URL(anchor.href);
        if (url.pathname !== window.location.pathname || url.search !== window.location.search) {
          setLoading(true);
          setProgress(30);
          const interval = setInterval(() => {
            setProgress((prev) => (prev >= 90 ? 90 : prev + 15));
          }, 150);
          setTimeout(() => clearInterval(interval), 3000);
        }
      }
    };

    window.addEventListener("click", handleAnchorClick);
    return () => window.removeEventListener("click", handleAnchorClick);
  }, []);

  if (!loading && progress === 0) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[99999] pointer-events-none h-1 bg-transparent">
      <div
        className="h-full bg-gradient-to-r from-cyan-500 via-[#219EBC] to-cyan-400 shadow-[0_0_12px_rgba(33,158,188,0.8)] transition-all duration-200 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};
