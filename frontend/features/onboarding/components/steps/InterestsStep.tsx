"use client";

import { useOnboardingStore } from "../../store/onboardingStore";
import { ONBOARDING_QUESTIONS } from "../../config/onboarding.config";
import * as Icons from "lucide-react";

export default function InterestsStep() {
  const selection = useOnboardingStore((s) => s.interests) || [];
  const setAnswer = useOnboardingStore((s) => s.setAnswer);

  const question = ONBOARDING_QUESTIONS.find((q) => q.id === "interests");
  if (!question || !question.options) return null;

  const handleToggle = (val: string) => {
    if (selection.includes(val)) {
      setAnswer(
        "interests",
        selection.filter((x) => x !== val)
      );
    } else {
      setAnswer("interests", [...selection, val]);
    }
  };

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

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-xl mx-auto">
        {question.options.map((opt) => {
          const IconComponent = (Icons as any)[opt.icon || "Gamepad2"] || Icons.Gamepad2;
          const isSelected = selection.includes(opt.value);

          return (
            <button
              key={opt.value}
              onClick={() => handleToggle(opt.value)}
              className={`flex flex-col items-center text-center gap-3 p-4 rounded-xl border transition-all duration-200 cursor-pointer select-none focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                isSelected
                  ? "border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/20 text-indigo-950 dark:text-indigo-200 shadow-sm"
                  : "border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-900/50 text-neutral-700 dark:text-neutral-300"
              }`}
            >
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  isSelected
                    ? "bg-indigo-600 text-white"
                    : "bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400"
                }`}
              >
                <IconComponent className="w-5 h-5" />
              </div>
              <span className="font-semibold text-xs">{opt.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
