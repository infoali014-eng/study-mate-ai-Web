"use client";

import { motion } from "framer-motion";
import { MrOwlLogoIcon } from "@/components/layout/Logo";

export default function WelcomeStep() {
  return (
    <div className="flex flex-col items-center text-center space-y-6 max-w-lg mx-auto py-6">
      <motion.img
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 100, delay: 0.1 }}
        src="/logo.png"
        alt="Mr Owl AI Logo"
        className="w-20 h-20 object-contain"
      />

      <div className="space-y-3">
        <h1 className="text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-white">
          Welcome to Mr Owl AI
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
