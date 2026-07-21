"use client";

import { useOnboardingStore } from "../../store/onboardingStore";
import { ONBOARDING_QUESTIONS } from "../../config/onboarding.config";
import { Calendar } from "lucide-react";

export default function ExamStep() {
  const selection = useOnboardingStore((s) => s.nextExam);
  const setAnswer = useOnboardingStore((s) => s.setAnswer);

  const question = ONBOARDING_QUESTIONS.find((q) => q.id === "next_exam");
  if (!question) return null;

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <div className="flex justify-center items-center gap-2">
          <h2 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
            {question.title}
          </h2>
          <span className="text-xs font-semibold px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400">
            Optional
          </span>
        </div>
        {question.description && (
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            {question.description}
          </p>
        )}
      </div>

      <div className="max-w-md mx-auto relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Calendar className="h-5 w-5 text-neutral-400" />
        </div>
        <input
          type="date"
          value={selection || ""}
          onChange={(e) => setAnswer("nextExam", e.target.value || null)}
          className="flex h-12 w-full rounded-xl border border-neutral-200 dark:border-neutral-800 bg-transparent py-3 pl-10 pr-4 text-sm outline-none transition-all focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/20 text-neutral-900 dark:text-white"
        />
      </div>
    </div>
  );
}
