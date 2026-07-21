"use client";

import { useOnboardingStore } from "../../store/onboardingStore";
import { ONBOARDING_QUESTIONS } from "../../config/onboarding.config";
import * as Icons from "lucide-react";

export default function StudyTimeStep() {
  const selection = useOnboardingStore((s) => s.dailyStudyTime);
  const setAnswer = useOnboardingStore((s) => s.setAnswer);
  const nextStep = useOnboardingStore((s) => s.nextStep);

  const question = ONBOARDING_QUESTIONS.find((q) => q.id === "study_time");
  if (!question || !question.options) return null;

  const handleSelect = (val: string) => {
    setAnswer("dailyStudyTime", val);
    setTimeout(() => {
      nextStep();
    }, 150);
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
          {question.title}
        </h2>
        {question.description && (
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            {question.description}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-xl mx-auto">
        {question.options.map((opt) => {
          const IconComponent = (Icons as any)[opt.icon || "Clock"] || Icons.Clock;
          const isSelected = selection === opt.value;

          return (
            <button
              key={opt.value}
              onClick={() => handleSelect(opt.value)}
              className={`flex items-center gap-4 p-4 rounded-xl border text-left transition-all duration-200 cursor-pointer select-none focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                isSelected
                  ? "border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/20 text-indigo-950 dark:text-indigo-200 shadow-sm"
                  : "border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-900/50 text-neutral-700 dark:text-neutral-300"
              }`}
            >
              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  isSelected
                    ? "bg-indigo-600 text-white"
                    : "bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400"
                }`}
              >
                <IconComponent className="w-5 h-5" />
              </div>
              <span className="font-semibold text-sm">{opt.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
