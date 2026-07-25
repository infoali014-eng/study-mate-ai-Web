"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import MrOwl from "./MrOwl";
import { useOwlStore } from "../../store/owlStore";
import { DASHBOARD_SUGGESTIONS } from "./dashboardSuggestions";

const SUGGESTION_INTERVAL = 18000; // ms between auto-suggestions while idle
const INACTIVITY_TIMEOUT = 60000; // ms before becoming dizzy & sleeping
const AUTO_WAKE_TIMEOUT = 10000; // ms to sleep before auto-waking

export default function FloatingOwl() {
  const { animState, message, enabled, say, setAnimState, setEnabled, clearMessage } =
    useOwlStore();

  const [hasEntered, setHasEntered] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [showHidePopover, setShowHidePopover] = useState(false);

  const suggestionIndexRef = useRef(0);
  const rotationTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const inactivityTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const autoWakeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const singleClickDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Watch OS reduced motion preference
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mq.matches);
    const listener = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mq.addEventListener("change", listener);
    return () => mq.removeEventListener("change", listener);
  }, []);

  const clearAllTimers = () => {
    if (rotationTimerRef.current) clearInterval(rotationTimerRef.current);
    if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
    if (autoWakeTimerRef.current) clearTimeout(autoWakeTimerRef.current);
  };

  const showNextSuggestion = () => {
    const s = DASHBOARD_SUGGESTIONS[suggestionIndexRef.current % DASHBOARD_SUGGESTIONS.length];
    suggestionIndexRef.current += 1;
    say(s.text, s.mood);
  };

  const startSuggestionRotation = () => {
    if (rotationTimerRef.current) clearInterval(rotationTimerRef.current);
    rotationTimerRef.current = setInterval(showNextSuggestion, SUGGESTION_INTERVAL);
  };

  const resetInactivityTimer = () => {
    if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
    inactivityTimerRef.current = setTimeout(triggerDizzyAndSleep, INACTIVITY_TIMEOUT);
  };

  const triggerDizzyAndSleep = () => {
    clearAllTimers();
    clearMessage();

    if (prefersReducedMotion) {
      setAnimState("sleep");
      scheduleAutoWake();
    } else {
      setAnimState("dizzy");
      setTimeout(() => {
        setAnimState("sleep");
        scheduleAutoWake();
      }, 1400);
    }
  };

  const scheduleAutoWake = () => {
    if (autoWakeTimerRef.current) clearTimeout(autoWakeTimerRef.current);
    autoWakeTimerRef.current = setTimeout(() => {
      wakeUp();
    }, AUTO_WAKE_TIMEOUT);
  };

  const wakeUp = () => {
    if (autoWakeTimerRef.current) clearTimeout(autoWakeTimerRef.current);
    setAnimState("idle");
    showNextSuggestion();
    startSuggestionRotation();
    resetInactivityTimer();
  };

  // Fly in once on mount when enabled
  useEffect(() => {
    if (!enabled) return;

    setAnimState(prefersReducedMotion ? "idle" : "fly-in");

    const settleTimer = setTimeout(
      () => {
        setAnimState("idle");
        setHasEntered(true);
      },
      prefersReducedMotion ? 0 : 900
    );

    return () => {
      clearTimeout(settleTimer);
      clearAllTimers();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled]);

  // Start suggestions & inactivity timer once entered
  useEffect(() => {
    if (!hasEntered || !enabled) return;

    const firstTip = setTimeout(showNextSuggestion, 1000);
    startSuggestionRotation();
    resetInactivityTimer();

    return () => {
      clearTimeout(firstTip);
      clearAllTimers();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasEntered, enabled]);

  // Handle single click (debounced by 250ms to distinguish from double click)
  const handleSingleClick = () => {
    if (singleClickDebounceRef.current) clearTimeout(singleClickDebounceRef.current);

    singleClickDebounceRef.current = setTimeout(() => {
      if (animState === "sleep" || animState === "dizzy") {
        wakeUp();
      } else {
        showNextSuggestion();
        startSuggestionRotation();
        resetInactivityTimer();
      }
    }, 250);
  };

  // Handle double click (opens "Hide Mr Owl?" popover)
  const handleDoubleClick = () => {
    if (singleClickDebounceRef.current) {
      clearTimeout(singleClickDebounceRef.current);
      singleClickDebounceRef.current = null;
    }

    if (animState === "sleep" || animState === "dizzy") {
      wakeUp();
    } else {
      resetInactivityTimer();
    }

    setShowHidePopover(true);
  };

  if (!enabled) return null;

  const activeAnimState = prefersReducedMotion ? (animState === "dizzy" ? "sleep" : animState) : animState;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end select-none">
      {/* Hide Confirmation Popover (Double Click) */}
      <AnimatePresence>
        {showHidePopover && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            transition={{ duration: 0.2 }}
            className="relative mb-3 mr-2 w-60 rounded-2xl border border-slate-200 bg-white p-4 shadow-2xl space-y-3"
          >
            <h4 className="text-xs font-black text-slate-900">Hide Mr Owl?</h4>
            <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
              You can turn Mr Owl back on anytime in Account Settings → AI Preferences.
            </p>
            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setShowHidePopover(false)}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-[11px] rounded-[8px] transition-colors cursor-pointer"
              >
                Keep Him
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowHidePopover(false);
                  setEnabled(false);
                }}
                className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-[11px] rounded-[8px] transition-colors shadow-2xs cursor-pointer"
              >
                Hide
              </button>
            </div>
            <div className="absolute -bottom-[6px] right-8 h-3 w-3 rotate-45 border-b border-r border-slate-200 bg-white" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Suggestion Speech Bubble */}
      <AnimatePresence>
        {!showHidePopover && message && animState !== "sleep" && animState !== "dizzy" && (
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

      {/* Mr Owl Mascot Button */}
      <button
        type="button"
        aria-label="Ask Mr Owl for a suggestion. Double click to hide."
        onClick={handleSingleClick}
        onDoubleClick={handleDoubleClick}
        className="cursor-pointer rounded-full outline-hidden transition-transform hover:scale-105 focus-visible:ring-2 focus-visible:ring-sky-400"
      >
        <MrOwl animState={activeAnimState} size={92} />
      </button>
    </div>
  );
}
