"use client";

import { useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { StreakService } from "../services/streakService";
import { useStreakStore } from "../store/streakStore";
import { StreakActivityType } from "../types/streak.types";
import { ActivityTracker } from "../utils/activityTracker";

export function useStreak() {
  const queryClient = useQueryClient();
  const { isOpen, toggleOpen, setIsOpen, toastVisible, toastStreakCount, showToast, hideToast } =
    useStreakStore();

  // 1. Fetch User Streak Record
  const {
    data: streak = {
      id: "default",
      user_id: "",
      current_streak: 0,
      best_streak: 0,
      today_points: 0,
      today_completed: false,
      last_completed_date: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    isLoading: loadingStreak,
    refetch: refetchStreak,
  } = useQuery({
    queryKey: ["userStreak"],
    queryFn: () => StreakService.getUserStreak(),
    staleTime: 1000 * 60 * 5,
  });

  // 2. Fetch Weekly History (M T W T F S S)
  const {
    data: weeklyHistory = [],
    isLoading: loadingHistory,
    refetch: refetchHistory,
  } = useQuery({
    queryKey: ["weeklyHistory"],
    queryFn: () => StreakService.getWeeklyHistory(),
    staleTime: 1000 * 60 * 5,
  });

  // 3. Activity Recording Mutation
  const recordMutation = useMutation({
    mutationFn: (type: StreakActivityType) => StreakService.recordActivity(type),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["userStreak"] });
      queryClient.invalidateQueries({ queryKey: ["weeklyHistory"] });

      if (res.newlyCompleted) {
        showToast(res.currentStreak);
      }
    },
  });

  // Start Active Session Tracker automatically in browser
  useEffect(() => {
    const tracker = ActivityTracker.getInstance();
    tracker.startTracking(() => {
      recordMutation.mutate("session");
    });

    return () => {
      tracker.stopTracking();
    };
  }, []);

  return {
    streak,
    weeklyHistory,
    loading: loadingStreak || loadingHistory,
    isOpen,
    toggleOpen,
    setIsOpen,
    toastVisible,
    toastStreakCount,
    hideToast,
    // Integration Methods exposed to app modules
    recordChatActivity: () => recordMutation.mutate("chat"),
    recordSessionActivity: () => recordMutation.mutate("session"),
    recordUploadActivity: () => recordMutation.mutate("upload"),
    recordPreviewActivity: () => recordMutation.mutate("preview"),
    refetchAll: () => {
      refetchStreak();
      refetchHistory();
    },
  };
}
