"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";

export interface ComingSoonPageProps {
  productName?: string;
  title?: string;
  subheading?: string;
  description?: string;
  badge?: string;
  primaryButtonText?: string;
  primaryButtonLink?: string;
  secondaryButtonText?: string;
  secondaryButtonLink?: string;
  showExploreCourses?: boolean;
  expectedLaunch?: string | null;
  iconUrl?: string | null;
}

export const ComingSoonPage: React.FC<ComingSoonPageProps> = ({
  productName = "Deep Code Feature",
  title = "Coming Soon",
  subheading = "We're building something exciting.",
  description = "This experience is currently under active development and will be available soon.",
  badge,
  primaryButtonText = "Return Home",
  primaryButtonLink = "/",
  secondaryButtonText = "Explore Courses",
  secondaryButtonLink = "/courses",
  showExploreCourses = true,
  expectedLaunch,
  iconUrl,
}) => {
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-950 flex flex-col justify-between relative overflow-hidden select-none">
      {/* 1. BACKGROUND ORGANIC shapes & SOFT RADIAL GRADIENTS */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {/* Soft Radial Center Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[radial-gradient(circle_at_center,rgba(33,158,188,0.12),transparent_70%)] rounded-full blur-3xl" />

        {/* Floating Organic Blob Left */}
        <motion.div
          animate={{
            y: [0, -30, 0],
            x: [0, 20, 0],
            scale: [1, 1.08, 1],
            rotate: [0, 5, 0],
          }}
          transition={{
            duration: 16,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -top-20 -left-20 w-[480px] h-[480px] rounded-[40%_60%_70%_30%/40%_50%_60%_50%] bg-gradient-to-tr from-sky-200/40 via-cyan-100/30 to-blue-200/20 blur-2xl"
        />

        {/* Floating Organic Blob Right */}
        <motion.div
          animate={{
            y: [0, 35, 0],
            x: [0, -25, 0],
            scale: [1, 1.05, 1],
            rotate: [0, -8, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-1/3 -right-24 w-[520px] h-[520px] rounded-[60%_40%_30%_70%/50%_60%_40%_50%] bg-gradient-to-bl from-slate-200/50 via-sky-100/40 to-cyan-200/30 blur-2xl"
        />

        {/* Floating Organic Blob Bottom Left */}
        <motion.div
          animate={{
            y: [0, -25, 0],
            x: [0, -15, 0],
            scale: [1, 1.06, 1],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -bottom-32 left-1/4 w-[420px] h-[420px] rounded-[50%_50%_40%_60%/60%_40%_60%_40%] bg-gradient-to-tr from-sky-100/50 via-cyan-50/40 to-slate-100/60 blur-3xl"
        />

        {/* Subtle Binary Grid Pattern */}
        <div className="absolute inset-0 opacity-[0.035] bg-[linear-gradient(to_right,#0F172A_1px,transparent_1px),linear-gradient(to_bottom,#0F172A_1px,transparent_1px)] bg-[size:32px_32px]" />

        {/* Tiny Floating Particles */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            initial={{
              x: Math.random() * 800 - 400,
              y: Math.random() * 600 - 300,
              opacity: 0.2,
            }}
            animate={{
              y: [0, -40, 0],
              opacity: [0.2, 0.6, 0.2],
            }}
            transition={{
              duration: 8 + i * 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute top-1/2 left-1/2 w-1.5 h-1.5 rounded-full bg-[#219EBC]"
          />
        ))}
      </div>

      {/* 2. TOP BRANDING BAR */}
      <header className="relative z-20 w-full max-w-7xl mx-auto px-6 sm:px-8 py-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <img
            src="/branding/deepcode/logo.png"
            alt="Deep Code Logo"
            className="h-8 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
            draggable={false}
          />
          <span className="font-extrabold text-lg tracking-tight">
            <span className="text-slate-950">Deep</span>
            <span className="text-[#219EBC]">Code</span>
          </span>
        </Link>

        {expectedLaunch && (
          <span className="text-xs font-extrabold text-slate-500 bg-white/80 border border-slate-200/80 backdrop-blur-xs px-3.5 py-1.5 rounded-full shadow-xs">
            🚀 {expectedLaunch}
          </span>
        )}
      </header>

      {/* 3. CENTER CONTENT CONTAINER */}
      <main className="relative z-20 flex-grow flex items-center justify-center px-6 py-12 sm:py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-2xl mx-auto text-center space-y-8"
        >
          {/* Feature Icon / Logo */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="flex justify-center"
          >
            <div className="relative group">
              <div className="absolute inset-0 bg-[#219EBC]/20 rounded-3xl blur-xl group-hover:bg-[#219EBC]/30 transition-all duration-500" />
              <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-white/90 border border-slate-200/80 backdrop-blur-md p-4 flex items-center justify-center shadow-md">
                <img
                  src={iconUrl || "/branding/deepcode/logo.png"}
                  alt={productName}
                  className="w-full h-full object-contain drop-shadow-xs transition-transform duration-500 group-hover:scale-105"
                  draggable={false}
                />
              </div>
            </div>
          </motion.div>

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-white/80 border border-slate-200/80 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-extrabold text-[#1B7991] shadow-xs"
          >
            <span className="w-2 h-2 rounded-full bg-[#219EBC] animate-pulse" />
            <span>{badge || `${productName.toUpperCase()} • IN DEVELOPMENT`}</span>
          </motion.div>

          {/* Headings */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="space-y-3"
          >
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-950 leading-tight">
              {productName} <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-950 via-[#1B7991] to-[#219EBC]">
                {title}
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-800 font-bold max-w-lg mx-auto">
              {subheading}
            </p>

            <p className="text-sm sm:text-base text-slate-500 font-medium leading-relaxed max-w-md mx-auto">
              {description}
            </p>
          </motion.div>

          {/* Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="flex flex-wrap items-center justify-center gap-4 pt-4"
          >
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link
                href={primaryButtonLink}
                className="inline-flex items-center justify-center gap-2 bg-slate-950 text-white font-extrabold text-sm px-7 py-3.5 rounded-xl hover:bg-slate-800 transition-colors shadow-sm"
              >
                <span>{primaryButtonText}</span>
              </Link>
            </motion.div>

            {showExploreCourses && (
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Link
                  href={secondaryButtonLink}
                  className="inline-flex items-center justify-center gap-2 bg-white text-slate-800 border border-slate-200/90 font-extrabold text-sm px-7 py-3.5 rounded-xl hover:bg-slate-50 transition-colors shadow-xs"
                >
                  <span>{secondaryButtonText}</span>
                  <span className="text-xs text-[#219EBC]">→</span>
                </Link>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      </main>

      {/* 4. FOOTER BAR */}
      <footer className="relative z-20 w-full max-w-7xl mx-auto px-6 sm:px-8 py-6 text-center text-xs font-medium text-slate-400">
        © 2026 Deep Code Platform Inc. All rights reserved.
      </footer>
    </div>
  );
};
