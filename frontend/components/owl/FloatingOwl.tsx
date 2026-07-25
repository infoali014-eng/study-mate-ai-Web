"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import MrOwl from "./MrOwl";
import { useOwlStore } from "@/store/owlStore";
import { DASHBOARD_SUGGESTIONS } from "./dashboardSuggestions";

const SUGGESTION_INTERVAL = 18000; // ms between auto-suggestions while idle

export default function FloatingOwl() {
  const { animState, message, say, setAnimState } = useOwlStore();
  const [hasEntered, setHasEntered] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const suggestionIndexRef = useRef(0);
  const rotationTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mq.matches);
    const listener = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mq.addEventListener("change", listener);
    return () => mq.removeEventListener("change", listener);
  }, []);

  const showNextSuggestion = () => {
    const s = DASHBOARD_SUGGESTIONS[suggestionIndexRef.current % DASHBOARD_SUGGESTIONS.length];
    suggestionIndexRef.current += 1;
    say(s.text, s.mood);
  };

  // Fly in once on mount, then settle idle and start the tip rotation
  useEffect(() => {
    setAnimState(prefersReducedMotion ? "idle" : "fly-in");

    const settleTimer = setTimeout(
      () => {
        setAnimState("idle");
        setHasEntered(true);
      },
      prefersReducedMotion ? 0 : 900
    );

    return () => clearTimeout(settleTimer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!hasEntered) return;
    const firstTip = setTimeout(showNextSuggestion, 1000);
    rotationTimerRef.current = setInterval(showNextSuggestion, SUGGESTION_INTERVAL);
    return () => {
      clearTimeout(firstTip);
      if (rotationTimerRef.current) clearInterval(rotationTimerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasEntered]);

  const handleOwlClick = () => {
    if (rotationTimerRef.current) clearInterval(rotationTimerRef.current);
    showNextSuggestion();
    rotationTimerRef.current = setInterval(showNextSuggestion, SUGGESTION_INTERVAL);
  };

  const activeAnimState = prefersReducedMotion ? "idle" : animState;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end select-none">
      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="relative mb-3 mr-2 max-w-[240px] rounded-2xl border border-slate-200 bg-white p-4 text-xs font-semibold leading-relaxed text-slate-800 shadow-xl"
          >
            {message}
            <div className="absolute -bottom-[6px] right-8 h-3 w-3 rotate-45 border-b border-r border-slate-200 bg-white" />
          </motion.div>
        )}
      </AnimatePresence>

      <button
        type="button"
        aria-label="Ask Mr Owl for a suggestion"
        onClick={handleOwlClick}
        className="cursor-pointer rounded-full outline-hidden transition-transform hover:scale-105 focus-visible:ring-2 focus-visible:ring-sky-400"
      >
        <MrOwl animState={activeAnimState} size={92} />
      </button>
    </div>
  );
}
