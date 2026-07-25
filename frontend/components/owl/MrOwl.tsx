"use client";

import { motion, Variants } from "framer-motion";
import { useEffect, useState } from "react";

export type OwlAnimState = "idle" | "fly-in" | "talk" | "celebrate" | "sleep" | "dizzy";

interface MrOwlProps {
  animState?: OwlAnimState;
  size?: number;
}

// Whole-character variants
const containerVariants: Variants = {
  idle: { x: 0, opacity: 1, transition: { duration: 0.3 } },
  "fly-in": { x: [-220, 0], opacity: [0, 1], transition: { duration: 0.9, ease: "easeOut" } },
  talk: { x: 0, opacity: 1 },
  celebrate: { x: 0, opacity: 1 },
  sleep: { x: 0, opacity: 1 },
  dizzy: { x: 0, opacity: 1 },
};

// Body variants
const bodyVariants: Variants = {
  idle: {
    y: [0, -6, -2, 4, 0],
    rotate: [0, 1, -2, 1, 0],
    scale: [1, 1.02, 1, 0.98, 1],
    transition: { duration: 4, ease: "easeInOut", repeat: Infinity },
  },
  "fly-in": { y: [10, 0], transition: { duration: 0.9, ease: "easeOut" } },
  talk: { y: [0, -4, 0], transition: { duration: 0.5, repeat: 3, ease: "easeInOut" } },
  celebrate: {
    rotate: [0, -10, 10, -8, 0],
    scale: [1, 1.12, 1.05, 1.1, 1],
    transition: { duration: 0.7, ease: "easeInOut" },
  },
  sleep: {
    y: [0, 2, 0],
    transition: { duration: 3, ease: "easeInOut", repeat: Infinity },
  },
  dizzy: {
    rotate: [0, -14, 14, -10, 10, -5, 5, 0],
    y: [0, -6, 3, -3, 0],
    transition: { duration: 1.4, ease: "easeInOut" },
  },
};

// Wings variants
const leftWingVariants: Variants = {
  idle: { rotate: [0, -4, 0], transition: { duration: 3.2, ease: "easeInOut", repeat: Infinity } },
  talk: { rotate: [0, -14, 0], transition: { duration: 0.4, repeat: 2 } },
  celebrate: { rotate: [0, -35, -10, -35, 0], transition: { duration: 0.7 } },
  "fly-in": { rotate: [-30, 0], transition: { duration: 0.9 } },
  sleep: { rotate: 0 },
  dizzy: { rotate: [-20, 5, -15], transition: { duration: 1.4 } },
};

const rightWingVariants: Variants = {
  idle: { rotate: [0, 4, 0], transition: { duration: 3.2, ease: "easeInOut", repeat: Infinity } },
  talk: { rotate: [0, 14, 0], transition: { duration: 0.4, repeat: 2 } },
  celebrate: { rotate: [0, 35, 10, 35, 0], transition: { duration: 0.7 } },
  "fly-in": { rotate: [30, 0], transition: { duration: 0.9 } },
  sleep: { rotate: 0 },
  dizzy: { rotate: [20, -5, 15], transition: { duration: 1.4 } },
};

// Eyebrows variants
const eyebrowVariants: Variants = {
  idle: { y: 0, rotate: 0 },
  talk: { y: [0, -2, 0], transition: { duration: 0.5, repeat: 3 } },
  celebrate: { y: -3, rotate: -6 },
  sleep: { y: 4 },
  dizzy: { y: -5, rotate: 12 },
};

// Beak variants
const beakVariants: Variants = {
  idle: { scaleY: 1 },
  talk: { scaleY: [1, 0.7, 1, 0.8, 1], transition: { duration: 0.5, repeat: 3, ease: "easeInOut" } },
  celebrate: { scaleY: 1.15 },
  sleep: { scaleY: 1 },
  dizzy: { scaleY: 0.6 },
};

export default function MrOwl({ animState = "idle", size = 140 }: MrOwlProps) {
  const [blinking, setBlinking] = useState(false);

  useEffect(() => {
    if (animState === "sleep" || animState === "dizzy") return;
    const interval = setInterval(() => {
      setBlinking(true);
      setTimeout(() => setBlinking(false), 160);
    }, 3200 + Math.random() * 2000);
    return () => clearInterval(interval);
  }, [animState]);

  const eyesClosed = blinking || animState === "sleep";
  const isDizzy = animState === "dizzy";

  return (
    <motion.div
      variants={containerVariants}
      animate={animState}
      style={{ width: size, height: size }}
    >
      <svg viewBox="0 0 200 200" width={size} height={size}>
        <motion.g variants={bodyVariants} animate={animState} style={{ originX: "100px", originY: "160px" }}>
          {/* Dizzy Sparkles above head */}
          {isDizzy && (
            <motion.g
              initial={{ opacity: 0, rotate: 0 }}
              animate={{ opacity: [0, 1, 1, 0], rotate: 360 }}
              transition={{ duration: 1.4, ease: "easeInOut" }}
              style={{ originX: "100px", originY: "30px" }}
            >
              <polygon points="100,18 102,24 108,24 103,28 105,34 100,30 95,34 97,28 92,24 98,24" fill="#FFB703" />
              <polygon points="65,30 66,34 70,34 67,37 68,41 65,38 62,41 63,37 60,34 64,34" fill="#FFB703" />
              <polygon points="135,30 136,34 140,34 137,37 138,41 135,38 132,41 133,37 130,34 134,34" fill="#FFB703" />
            </motion.g>
          )}

          {/* Floating Zzz for Sleep state */}
          {animState === "sleep" && (
            <g>
              <motion.text
                x="140"
                y="50"
                fill="#FFB703"
                fontSize="18"
                fontWeight="900"
                initial={{ opacity: 0, y: 55, x: 135 }}
                animate={{ opacity: [0, 1, 0], y: [55, 30], x: [135, 145] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: "easeOut" }}
              >
                Z
              </motion.text>
              <motion.text
                x="155"
                y="40"
                fill="#38BDF8"
                fontSize="14"
                fontWeight="800"
                initial={{ opacity: 0, y: 45, x: 150 }}
                animate={{ opacity: [0, 1, 0], y: [45, 20], x: [150, 162] }}
                transition={{ duration: 2.2, delay: 0.7, repeat: Infinity, ease: "easeOut" }}
              >
                z
              </motion.text>
              <motion.text
                x="168"
                y="30"
                fill="#FFB703"
                fontSize="11"
                fontWeight="700"
                initial={{ opacity: 0, y: 35, x: 165 }}
                animate={{ opacity: [0, 1, 0], y: [35, 12], x: [165, 175] }}
                transition={{ duration: 2.2, delay: 1.4, repeat: Infinity, ease: "easeOut" }}
              >
                z
              </motion.text>
            </g>
          )}

          {/* Left wing */}
          <motion.g
            variants={leftWingVariants}
            animate={animState}
            style={{ originX: "70px", originY: "115px" }}
          >
            <ellipse cx="55" cy="130" rx="22" ry="38" fill="#0077B6" />
          </motion.g>

          {/* Right wing */}
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
          <ellipse cx="100" cy="140" rx="38" ry="42" fill="#E0F2FE" />
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

          {/* Eyes rendering depending on state */}
          {eyesClosed ? (
            <>
              <path d="M64 82 Q78 88 92 82" stroke="#0B2545" strokeWidth="4" fill="none" strokeLinecap="round" />
              <path d="M108 82 Q122 88 136 82" stroke="#0B2545" strokeWidth="4" fill="none" strokeLinecap="round" />
            </>
          ) : isDizzy ? (
            <>
              {/* Spiral eyes for Dizzy state */}
              <motion.path
                d="M78 82 m-10,0 a10,10 0 1,0 20,0 a10,10 0 1,0 -20,0 m4,0 a6,6 0 1,0 12,0"
                stroke="#0B2545"
                strokeWidth="3"
                fill="none"
                animate={{ rotate: 360 }}
                transition={{ duration: 1.4, repeat: Infinity, ease: "linear" }}
                style={{ originX: "78px", originY: "82px" }}
              />
              <motion.path
                d="M122 82 m-10,0 a10,10 0 1,0 20,0 a10,10 0 1,0 -20,0 m4,0 a6,6 0 1,0 12,0"
                stroke="#0B2545"
                strokeWidth="3"
                fill="none"
                animate={{ rotate: -360 }}
                transition={{ duration: 1.4, repeat: Infinity, ease: "linear" }}
                style={{ originX: "122px", originY: "82px" }}
              />
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
