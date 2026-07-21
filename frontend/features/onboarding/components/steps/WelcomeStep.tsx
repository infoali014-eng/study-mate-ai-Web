"use client";

import { motion } from "framer-motion";
import { GraduationCap } from "lucide-react";

export default function WelcomeStep() {
  return (
    <div className="flex flex-col items-center text-center space-y-6 max-w-lg mx-auto py-6">
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 100, delay: 0.1 }}
        className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center shadow-xl shadow-indigo-500/20 border border-indigo-400/20"
      >
        <GraduationCap className="w-10 h-10 text-white" />
      </motion.div>

      <div className="space-y-3">
        <h1 className="text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-white">
          Welcome to StudyMate AI
        </h1>
        <p className="text-base text-neutral-500 dark:text-neutral-400 leading-relaxed">
          Let's personalize your workspace to fit your studying needs. It only takes a minute to configure your dashboard.
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-xs font-semibold text-neutral-400 dark:text-neutral-500 bg-neutral-100 dark:bg-neutral-800/50 px-3 py-1.5 rounded-full"
      >
        Press Enter or click Continue to start
      </motion.div>
    </div>
  );
}
