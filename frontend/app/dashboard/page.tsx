"use client";

import React from "react";
import GreetingBanner from "@/components/dashboard/GreetingBanner";
import DailyGoalCard from "@/components/dashboard/DailyGoalCard";
import ContinueLearningHero from "@/components/dashboard/ContinueLearningHero";
import TodaysProgressGrid from "@/components/dashboard/TodaysProgressGrid";
import QuickActionsGrid from "@/components/dashboard/QuickActionsGrid";
import AiRecommendationsSection from "@/components/dashboard/AiRecommendationsSection";
import RecentActivityTimeline from "@/components/dashboard/RecentActivityTimeline";
import UpcomingScheduleSection from "@/components/dashboard/UpcomingScheduleSection";

export default function DashboardPage() {
  return (
    <div className="space-y-8 pb-8 select-none">
      {/* 1. Greeting Banner */}
      <GreetingBanner />

      {/* 2. Daily Goal Section */}
      <DailyGoalCard />

      {/* 3. Continue Learning (Dominant Hero Card) */}
      <ContinueLearningHero />

      {/* 4. Today's Progress Grid */}
      <TodaysProgressGrid />

      {/* 5. Quick Actions Grid */}
      <QuickActionsGrid />

      {/* 6. AI Recommendations Section */}
      <AiRecommendationsSection />

      {/* 7 & 8. Two-Column Grid: Recent Activity & Upcoming Schedule */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentActivityTimeline />
        <UpcomingScheduleSection />
      </div>
    </div>
  );
}
