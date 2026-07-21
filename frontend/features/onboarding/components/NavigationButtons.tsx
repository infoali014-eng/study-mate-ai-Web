"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";

interface NavigationButtonsProps {
  currentStep: number;
  totalSteps: number;
  isStepValid: boolean;
  isSkippable: boolean;
  onBack: () => void;
  onContinue: () => void;
  onSkip: () => void;
}

export default function NavigationButtons({
  currentStep,
  totalSteps,
  isStepValid,
  isSkippable,
  onBack,
  onContinue,
  onSkip,
}: NavigationButtonsProps) {
  // Hide controls on step 11 (finish handles its own action)
  if (currentStep === totalSteps) return null;

  return (
    <div className="flex items-center justify-between mt-8 border-t border-neutral-100 dark:border-neutral-800 pt-6 select-none">
      {/* Back Button */}
      {currentStep > 1 ? (
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>
      ) : (
        <div /> // spacing placeholder
      )}

      {/* Action Group */}
      <div className="flex items-center gap-3">
        {/* Skip Option */}
        {isSkippable && (
          <button
            onClick={onSkip}
            className="px-4 py-2 text-sm font-semibold text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors cursor-pointer"
          >
            Skip for now
          </button>
        )}

        {/* Continue Button */}
        <button
          onClick={onContinue}
          disabled={!isStepValid}
          className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white font-semibold rounded-xl transition-all shadow-md shadow-indigo-500/10 hover:shadow-indigo-500/20 disabled:cursor-not-allowed cursor-pointer text-sm"
        >
          <span>{currentStep === 1 ? "Get Started" : "Continue"}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
