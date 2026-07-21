"use client";

import React, { useEffect, useState } from "react";
import MrOwl from "../owl/MrOwl";
import SpeechBubble from "../owl/SpeechBubble";
import { useOwlStore } from "../../store/owlStore";

interface AuthCardProps {
  children: React.ReactNode;
}

export default function AuthCard({ children }: AuthCardProps) {
  const animState = useOwlStore((s) => s.animState);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const listener = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };
    mediaQuery.addEventListener("change", listener);
    return () => mediaQuery.removeEventListener("change", listener);
  }, []);

  // Determine active owl animation state, overriding with 'idle' if user prefers reduced motion
  const activeAnimState = prefersReducedMotion
    ? "idle"
    : animState;

  return (
    <div className="relative w-full max-w-[420px] mx-auto mt-20 lg:mt-0">
      {/* Speech Bubble sits directly above Mr. Owl */}
      <SpeechBubble />

      {/* Absolutely positioned Mr. Owl sitting on the top-right corner of the Card */}
      <div className="absolute -top-[95px] right-[12px] z-50 pointer-events-none select-none">
        <MrOwl animState={activeAnimState} size={110} />
      </div>

      {/* Shadcn UI Card Container styling */}
      <div className="bg-card text-card-foreground border border-border rounded-xl shadow-md p-6 lg:p-8 relative">
        {children}
      </div>
    </div>
  );
}
