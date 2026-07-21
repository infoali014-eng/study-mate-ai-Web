"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Loader2, AlertCircle } from "lucide-react";

interface FinishStepProps {
  isSubmitting: boolean;
  submitError: string | null;
  onSubmit: () => void;
}

export default function FinishStep({ isSubmitting, submitError, onSubmit }: FinishStepProps) {
  return (
    <div className="flex flex-col items-center text-center space-y-6 max-w-lg mx-auto py-6">
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 100, delay: 0.1 }}
        className="w-20 h-20 rounded-full bg-emerald-500/10 dark:bg-emerald-500/20 flex items-center justify-center border border-emerald-500/20 text-emerald-600 dark:text-emerald-400"
      >
        <CheckCircle2 className="w-10 h-10" />
      </motion.div>

      <div className="space-y-3">
        <h1 className="text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-white">
          You're all set!
        </h1>
        <p className="text-base text-neutral-500 dark:text-neutral-400 leading-relaxed">
          We've personalized your workspace based on your profile details. Ready to learn smarter?
        </p>
      </div>

      {submitError && (
        <div className="flex items-center gap-2 p-4 rounded-xl border border-destructive bg-destructive/5 text-destructive text-sm font-semibold max-w-md">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{submitError}</span>
        </div>
      )}

      <button
        onClick={onSubmit}
        disabled={isSubmitting}
        className="flex items-center gap-2 px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-all shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/35 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer text-sm"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Customizing workspace...</span>
          </>
        ) : (
          <span>Go to Dashboard</span>
        )}
      </button>
    </div>
  );
}
