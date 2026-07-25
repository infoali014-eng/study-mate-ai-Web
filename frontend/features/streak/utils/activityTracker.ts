"use client";

import { ACTIVE_SESSION_REQUIRED_SECONDS } from "../constants/streak.constants";

const STORAGE_KEY_PREFIX = "mrowl_active_seconds_";

function getTodayKey(): string {
  const today = new Date().toISOString().split("T")[0];
  return `${STORAGE_KEY_PREFIX}${today}`;
}

export class ActivityTracker {
  private static instance: ActivityTracker | null = null;
  private timer: NodeJS.Timeout | null = null;
  private lastActivityTime: number = Date.now();
  private activeSeconds: number = 0;
  private isListening: boolean = false;
  private hasTriggeredToday: boolean = false;
  private onCompleteCallback: (() => void) | null = null;

  private constructor() {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(getTodayKey());
      this.activeSeconds = stored ? parseInt(stored, 10) || 0 : 0;
      const triggered = localStorage.getItem(`${getTodayKey()}_triggered`);
      this.hasTriggeredToday = triggered === "true";
    }
  }

  public static getInstance(): ActivityTracker {
    if (!ActivityTracker.instance) {
      ActivityTracker.instance = new ActivityTracker();
    }
    return ActivityTracker.instance;
  }

  public startTracking(onComplete: () => void) {
    if (typeof window === "undefined") return;
    this.onCompleteCallback = onComplete;

    // Check if user already reached 10 minutes today
    if (this.activeSeconds >= ACTIVE_SESSION_REQUIRED_SECONDS && !this.hasTriggeredToday) {
      this.hasTriggeredToday = true;
      localStorage.setItem(`${getTodayKey()}_triggered`, "true");
      if (this.onCompleteCallback) {
        this.onCompleteCallback();
      }
    }

    if (this.isListening) return;
    this.isListening = true;

    // Attach user activity listeners
    const handleUserActivity = () => {
      this.lastActivityTime = Date.now();
    };

    window.addEventListener("mousemove", handleUserActivity, { passive: true });
    window.addEventListener("keydown", handleUserActivity, { passive: true });
    window.addEventListener("scroll", handleUserActivity, { passive: true });
    window.addEventListener("click", handleUserActivity, { passive: true });

    // 1-second pulse timer
    this.timer = setInterval(() => {
      this.tick();
    }, 1000);
  }

  private tick() {
    if (typeof document === "undefined") return;

    // Rule: Do NOT count inactive tabs (document.hidden) or idle time (> 60s without input)
    const isTabActive = !document.hidden;
    const isUserActive = Date.now() - this.lastActivityTime < 60 * 1000;

    if (isTabActive && isUserActive) {
      this.activeSeconds += 1;
      localStorage.setItem(getTodayKey(), String(this.activeSeconds));

      if (this.activeSeconds >= ACTIVE_SESSION_REQUIRED_SECONDS && !this.hasTriggeredToday) {
        this.hasTriggeredToday = true;
        localStorage.setItem(`${getTodayKey()}_triggered`, "true");
        if (this.onCompleteCallback) {
          this.onCompleteCallback();
        }
      }
    }
  }

  public getActiveSeconds(): number {
    return this.activeSeconds;
  }

  public stopTracking() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    this.isListening = false;
  }
}
