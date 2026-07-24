import React from "react";
import Link from "next/link";
import { Sparkles, ArrowRight } from "lucide-react";
import DashboardSection from "./DashboardSection";

export default function AiRecommendationsSection() {
  return (
    <DashboardSection
      title="AI Recommendations"
      description="Personalized study suggestions driven by your learning pace"
    >
      <div className="bg-white border border-slate-200/80 rounded-[12px] p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col items-center justify-center text-center max-w-md mx-auto py-6 space-y-3">
          <div className="w-12 h-12 rounded-[12px] bg-[#219EBC]/10 text-[#219EBC] flex items-center justify-center shadow-xs">
            <Sparkles className="w-6 h-6" />
          </div>

          <div className="space-y-1.5">
            <h3 className="text-sm font-bold text-slate-900">
              No recommendations yet
            </h3>
            <p className="text-xs text-slate-500 font-medium leading-relaxed">
              We&apos;ll start recommending quizzes, revision sessions and flashcards after you&apos;ve uploaded study material.
            </p>
          </div>

          <div className="pt-2">
            <Link
              href="/library"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#219EBC] hover:text-[#023047] transition-colors cursor-pointer"
            >
              <span>Explore Study Library</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </DashboardSection>
  );
}
