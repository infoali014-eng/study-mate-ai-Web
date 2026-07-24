"use client";

import { motion, Variants } from "framer-motion";
import { useEffect, useState } from "react";

/**
 * Mr Owl — fully vectorized SVG mascot
 * Each body part (wings, eyes, pupils, ear tufts, beak, feet) is an
 * independent <motion.g>, so it can animate on its own timeline instead
 * of moving as one flat image.
 *
 * Color reference (from the Mr Owl concept art):
 *  - Feathers/body:   #8B5E34 (dark brown) / #A97845 (mid brown)
 *  - Belly:           #F3E3C3 (cream)
 *  - Eyes:            #1F7A73 (teal) with dark pupil
 *  - Beak/feet:       #F0932B (orange)
 */

export type OwlAnimState = "idle" | "fly-in" | "talk" | "celebrate" | "sleep";

interface MrOwlProps {
  animState?: OwlAnimState;
  size?: number;
}

// ---- Whole-character variants (position / entrance) ----
const containerVariants: Variants = {
  idle: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.3 },
  },
  "fly-in": {
    x: [-220, 0],
    opacity: [0, 1],
    transition: { duration: 0.9, ease: "easeOut" },
  },
  talk: { x: 0, opacity: 1 },
  celebrate: { x: 0, opacity: 1 },
  sleep: { x: 0, opacity: 1 },
};

// ---- Body: gentle float + breathing (matches the idle-animation infographic) ----
const bodyVariants: Variants = {
  idle: {
    y: [0, -6, -2, 4, 0],
    rotate: [0, 1, -2, 1, 0],
    scale: [1, 1.02, 1, 0.98, 1],
    transition: { duration: 4, ease: "easeInOut", repeat: Infinity },
  },
  "fly-in": {
    y: [10, 0],
    transition: { duration: 0.9, ease: "easeOut" },
  },
  talk: {
    y: [0, -4, 0],
    transition: { duration: 0.5, repeat: 3, ease: "easeInOut" },
  },
  celebrate: {
    rotate: [0, -10, 10, -8, 0],
    scale: [1, 1.12, 1.05, 1.1, 1],
    transition: { duration: 0.7, ease: "easeInOut" },
  },
  sleep: {
    y: [0, 2, 0],
    transition: { duration: 3, ease: "easeInOut", repeat: Infinity },
  },
};

// ---- Wings: independent flutter ----
const leftWingVariants: Variants = {
  idle: {
    rotate: [0, -4, 0],
    transition: { duration: 3.2, ease: "easeInOut", repeat: Infinity },
  },
  talk: {
    rotate: [0, -14, 0],
    transition: { duration: 0.4, repeat: 2 },
  },
  celebrate: {
    rotate: [0, -35, -10, -35, 0],
    transition: { duration: 0.7 },
  },
  "fly-in": {
    rotate: [-30, 0],
    transition: { duration: 0.9 },
  },
  sleep: { rotate: 0 },
};

const rightWingVariants: Variants = {
  idle: {
    rotate: [0, 4, 0],
    transition: { duration: 3.2, ease: "easeInOut", repeat: Infinity },
  },
  talk: {
    rotate: [0, 14, 0],
    transition: { duration: 0.4, repeat: 2 },
  },
  celebrate: {
    rotate: [0, 35, 10, 35, 0],
    transition: { duration: 0.7 },
  },
  "fly-in": {
    rotate: [30, 0],
    transition: { duration: 0.9 },
  },
  sleep: { rotate: 0 },
};

// ---- Eyebrows: expressive accents ----
const eyebrowVariants: Variants = {
  idle: { y: 0, rotate: 0 },
  talk: {
    y: [0, -2, 0],
    transition: { duration: 0.5, repeat: 3 },
  },
  celebrate: { y: -3, rotate: -6 },
  sleep: { y: 4 },
};

// ---- Beak: talk movement ----
const beakVariants: Variants = {
  idle: { scaleY: 1 },
  talk: {
    scaleY: [1, 0.7, 1, 0.8, 1],
    transition: { duration: 0.5, repeat: 3, ease: "easeInOut" },
  },
  celebrate: { scaleY: 1.15 },
  sleep: { scaleY: 1 },
};

export default function MrOwl({ animState = "idle", size = 140 }: MrOwlProps) {
  // Independent blink timer — fires regardless of animState, like a real idle tic
  const [blinking, setBlinking] = useState(false);

  useEffect(() => {
    if (animState === "sleep") return;
    const interval = setInterval(() => {
      setBlinking(true);
      setTimeout(() => setBlinking(false), 160);
    }, 3200 + Math.random() * 2000);
    return () => clearInterval(interval);
  }, [animState]);

  const eyesClosed = blinking || animState === "sleep";

  return (
    <motion.div
      variants={containerVariants}
      animate={animState}
      style={{ width: size, height: size }}
    >
      <svg viewBox="0 0 200 200" width={size} height={size}>
        <motion.g variants={bodyVariants} animate={animState} style={{ originX: "100px", originY: "160px" }}>
          {/* Left wing (behind body) */}
          <motion.g
            variants={leftWingVariants}
            animate={animState}
            style={{ originX: "70px", originY: "115px" }}
          >
            <ellipse cx="55" cy="130" rx="22" ry="38" fill="#0077B6" />
          </motion.g>

          {/* Right wing (behind body) */}
          <motion.g
            variants={rightWingVariants}
            animate={animState}
            style={{ originX: "130px", originY: "115px" }}
          >
            <ellipse cx="145" cy="130" rx="22" ry="38" fill="#0077B6" />
          </motion.g>

          {/* Feet */}
          <rect x="82" y="182" width="8" height="10" rx="3" fill="#0077B6" />
          <rect x="110" y="182" width="8" height="10" rx="3" fill="#0077B6" />

          {/* Body */}
          <ellipse cx="100" cy="130" rx="55" ry="60" fill="#0096C7" />
          {/* Belly / Open Book motif */}
          <ellipse cx="100" cy="140" rx="38" ry="42" fill="#E0F2FE" />
          {/* Belly feather lines */}
          <path d="M80 120 Q100 128 120 120" stroke="#38BDF8" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <path d="M78 138 Q100 146 122 138" stroke="#38BDF8" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <path d="M80 156 Q100 164 120 156" stroke="#38BDF8" strokeWidth="2.5" fill="none" strokeLinecap="round" />

          {/* Ear tufts */}
          <path d="M60 65 Q65 40 78 58 Z" fill="#0077B6" />
          <path d="M140 65 Q135 40 122 58 Z" fill="#0077B6" />

          {/* Head */}
          <circle cx="100" cy="85" r="52" fill="#0096C7" />

          {/* Eyebrows */}
          <motion.path
            variants={eyebrowVariants}
            animate={animState}
            d="M62 55 Q75 46 88 54"
            stroke="#0B2545"
            strokeWidth="4"
            fill="none"
            strokeLinecap="round"
          />
          <motion.path
            variants={eyebrowVariants}
            animate={animState}
            d="M112 54 Q125 46 138 55"
            stroke="#0B2545"
            strokeWidth="4"
            fill="none"
            strokeLinecap="round"
          />

          {/* Eye whites */}
          <circle cx="78" cy="82" r="26" fill="#FFFFFF" />
          <circle cx="122" cy="82" r="26" fill="#FFFFFF" />

          {/* Eyes: deep navy iris + pupil with 2 shine spots each */}
          {eyesClosed ? (
            <>
              <path d="M64 82 Q78 88 92 82" stroke="#0B2545" strokeWidth="4" fill="none" strokeLinecap="round" />
              <path d="M108 82 Q122 88 136 82" stroke="#0B2545" strokeWidth="4" fill="none" strokeLinecap="round" />
            </>
          ) : (
            <>
              <circle cx="78" cy="82" r="16" fill="#00B4D8" />
              <circle cx="122" cy="82" r="16" fill="#00B4D8" />
              <circle cx="78" cy="82" r="10" fill="#0B2545" />
              <circle cx="122" cy="82" r="10" fill="#0B2545" />
              <circle cx="74" cy="77" r="3.5" fill="#FFFFFF" />
              <circle cx="81" cy="85" r="1.5" fill="#FFFFFF" />
              <circle cx="118" cy="77" r="3.5" fill="#FFFFFF" />
              <circle cx="125" cy="85" r="1.5" fill="#FFFFFF" />
            </>
          )}

          {/* Beak */}
          <motion.path
            variants={beakVariants}
            animate={animState}
            d="M92 100 L108 100 L100 116 Z"
            fill="#0B2545"
            style={{ originX: "100px", originY: "100px" }}
          />
        </motion.g>
      </svg>
    </motion.div>
  );
}
