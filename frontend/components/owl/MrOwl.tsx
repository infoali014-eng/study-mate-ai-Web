"use client";

import { motion, Variants } from "framer-motion";
import { useEffect, useState } from "react";
import { OwlAccessories, OwlSkin } from "@/store/owlStore";

export type OwlAnimState =
  | "idle"
  | "fly-in"
  | "talk"
  | "celebrate"
  | "sleep"
  | "dizzy"
  | "thinking"
  | "curious"
  | "night_owl";

interface MrOwlProps {
  animState?: OwlAnimState;
  size?: number;
  skin?: OwlSkin;
  accessories?: Partial<OwlAccessories>;
  mousePos?: { x: number; y: number };
}

export const SKIN_PALETTES: Record<
  OwlSkin,
  {
    wings: string;
    body: string;
    belly: string;
    featherLines: string;
    iris: string;
    beakFeet: string;
  }
> = {
  classic: {
    wings: "#0077B6",
    body: "#0096C7",
    belly: "#E0F2FE",
    featherLines: "#38BDF8",
    iris: "#00B4D8",
    beakFeet: "#0B2545",
  },
  natural: {
    wings: "#8B5E34",
    body: "#A97845",
    belly: "#F3E3C3",
    featherLines: "#D4A373",
    iris: "#1F7A73",
    beakFeet: "#4A2E16",
  },
  midnight: {
    wings: "#4C1D95",
    body: "#7C3AED",
    belly: "#F3E8FF",
    featherLines: "#C084FC",
    iris: "#A855F7",
    beakFeet: "#1E1B4B",
  },
  emerald: {
    wings: "#047857",
    body: "#059669",
    belly: "#ECFDF5",
    featherLines: "#34D399",
    iris: "#10B981",
    beakFeet: "#064E3B",
  },
  sunset: {
    wings: "#C2410C",
    body: "#EA580C",
    belly: "#FFFBEB",
    featherLines: "#FBBF24",
    iris: "#F59E0B",
    beakFeet: "#7C2D12",
  },
  sakura: {
    wings: "#BE185D",
    body: "#EC4899",
    belly: "#FDF2F8",
    featherLines: "#F472B6",
    iris: "#F43F5E",
    beakFeet: "#831843",
  },
};

// Container variants
const containerVariants: Variants = {
  idle: { x: 0, opacity: 1, transition: { duration: 0.3 } },
  "fly-in": { x: [-220, 0], opacity: [0, 1], transition: { duration: 0.9, ease: "easeOut" } },
  talk: { x: 0, opacity: 1 },
  celebrate: { x: 0, opacity: 1 },
  sleep: { x: 0, opacity: 1 },
  dizzy: { x: 0, opacity: 1 },
  thinking: { x: 0, opacity: 1 },
  curious: { x: 0, opacity: 1 },
  night_owl: { x: 0, opacity: 1 },
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
  sleep: { y: [0, 2, 0], transition: { duration: 3, ease: "easeInOut", repeat: Infinity } },
  dizzy: {
    rotate: [0, -14, 14, -10, 10, -5, 5, 0],
    y: [0, -6, 3, -3, 0],
    transition: { duration: 1.4, ease: "easeInOut" },
  },
  thinking: {
    rotate: -4,
    y: [0, -3, 0],
    transition: { duration: 2.5, ease: "easeInOut", repeat: Infinity },
  },
  curious: {
    rotate: 15,
    y: -4,
    transition: { duration: 0.4, ease: "easeOut" },
  },
  night_owl: {
    y: [0, -3, 0],
    transition: { duration: 3, ease: "easeInOut", repeat: Infinity },
  },
};

// Wing variants
const leftWingVariants: Variants = {
  idle: { rotate: [0, -4, 0], transition: { duration: 3.2, ease: "easeInOut", repeat: Infinity } },
  talk: { rotate: [0, -14, 0], transition: { duration: 0.4, repeat: 2 } },
  celebrate: { rotate: [0, -35, -10, -35, 0], transition: { duration: 0.7 } },
  "fly-in": { rotate: [-30, 0], transition: { duration: 0.9 } },
  sleep: { rotate: 0 },
  dizzy: { rotate: [-20, 5, -15], transition: { duration: 1.4 } },
  thinking: { rotate: -45, y: -10, x: 10 }, // Chin tapping wing
  curious: { rotate: -10 },
  night_owl: { rotate: 0 },
};

const rightWingVariants: Variants = {
  idle: { rotate: [0, 4, 0], transition: { duration: 3.2, ease: "easeInOut", repeat: Infinity } },
  talk: { rotate: [0, 14, 0], transition: { duration: 0.4, repeat: 2 } },
  celebrate: { rotate: [0, 35, 10, 35, 0], transition: { duration: 0.7 } },
  "fly-in": { rotate: [30, 0], transition: { duration: 0.9 } },
  sleep: { rotate: 0 },
  dizzy: { rotate: [20, -5, 15], transition: { duration: 1.4 } },
  thinking: { rotate: 5 },
  curious: { rotate: 10 },
  night_owl: { rotate: -15, y: -5 }, // Holding coffee
};

// Eyebrows
const eyebrowVariants: Variants = {
  idle: { y: 0, rotate: 0 },
  talk: { y: [0, -2, 0], transition: { duration: 0.5, repeat: 3 } },
  celebrate: { y: -3, rotate: -6 },
  sleep: { y: 4 },
  dizzy: { y: -5, rotate: 12 },
  thinking: { y: -4, rotate: -8 },
  curious: { y: -6, rotate: -10 },
  night_owl: { y: 2, rotate: 0 },
};

// Beak
const beakVariants: Variants = {
  idle: { scaleY: 1 },
  talk: { scaleY: [1, 0.7, 1, 0.8, 1], transition: { duration: 0.5, repeat: 3, ease: "easeInOut" } },
  celebrate: { scaleY: 1.15 },
  sleep: { scaleY: 1 },
  dizzy: { scaleY: 0.6 },
  thinking: { scaleY: 0.85 },
  curious: { scaleY: 1.05 },
  night_owl: { scaleY: 1 },
};

export default function MrOwl({
  animState = "idle",
  size = 140,
  skin = "classic",
  accessories = {},
  mousePos,
}: MrOwlProps) {
  const [blinking, setBlinking] = useState(false);

  useEffect(() => {
    if (animState === "sleep" || animState === "dizzy") return;
    const interval = setInterval(() => {
      setBlinking(true);
      setTimeout(() => setBlinking(false), 160);
    }, 3200 + Math.random() * 2000);
    return () => clearInterval(interval);
  }, [animState]);

  const palette = SKIN_PALETTES[skin] || SKIN_PALETTES.classic;
  const eyesClosed = blinking || animState === "sleep";
  const isDizzy = animState === "dizzy";

  // Calculate mouse pupil tracking offset (clamped to [-4, 4] px)
  let eyeDx = 0;
  let eyeDy = 0;
  if (mousePos && (animState === "idle" || animState === "curious")) {
    const center = typeof window !== "undefined" ? window.innerWidth / 2 : 500;
    const dx = (mousePos.x - center) / (center || 1);
    const dy = (mousePos.y - (typeof window !== "undefined" ? window.innerHeight / 2 : 500)) / 500;
    eyeDx = Math.max(-4, Math.min(4, dx * 5));
    eyeDy = Math.max(-4, Math.min(4, dy * 4));
  }

  return (
    <motion.div
      variants={containerVariants}
      animate={animState}
      style={{ width: size, height: size }}
    >
      <svg viewBox="0 0 200 200" width={size} height={size}>
        <motion.g variants={bodyVariants} animate={animState} style={{ originX: "100px", originY: "160px" }}>
          {/* Dizzy Sparkles */}
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

          {/* Thinking Dots */}
          {animState === "thinking" && (
            <g>
              <motion.circle
                cx="140"
                cy="45"
                r="4"
                fill={palette.iris}
                animate={{ opacity: [0.2, 1, 0.2], y: [0, -4, 0] }}
                transition={{ duration: 1.2, repeat: Infinity, delay: 0 }}
              />
              <motion.circle
                cx="155"
                cy="32"
                r="6"
                fill={palette.iris}
                animate={{ opacity: [0.2, 1, 0.2], y: [0, -4, 0] }}
                transition={{ duration: 1.2, repeat: Infinity, delay: 0.3 }}
              />
              <motion.circle
                cx="172"
                cy="18"
                r="8"
                fill={palette.iris}
                animate={{ opacity: [0.2, 1, 0.2], y: [0, -4, 0] }}
                transition={{ duration: 1.2, repeat: Infinity, delay: 0.6 }}
              />
            </g>
          )}

          {/* Floating Zzz */}
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
                fill={palette.featherLines}
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

          {/* Left Wing */}
          <motion.g
            variants={leftWingVariants}
            animate={animState}
            style={{ originX: "70px", originY: "115px" }}
          >
            <ellipse cx="55" cy="130" rx="22" ry="38" fill={palette.wings} />

            {/* Glowing Stylus / Wand Accessory */}
            {accessories.wand && (
              <g transform="translate(30, 130) rotate(-35)">
                <rect x="0" y="0" width="6" height="36" rx="2" fill="#0B2545" />
                <circle cx="3" cy="0" r="6" fill="#38BDF8" />
                <circle cx="3" cy="0" r="3" fill="#FFFFFF" />
              </g>
            )}
          </motion.g>

          {/* Right Wing */}
          <motion.g
            variants={rightWingVariants}
            animate={animState}
            style={{ originX: "130px", originY: "115px" }}
          >
            <ellipse cx="145" cy="130" rx="22" ry="38" fill={palette.wings} />

            {/* Coffee Mug Accessory / Night Owl */}
            {(accessories.coffee || animState === "night_owl") && (
              <g transform="translate(142, 135)">
                <rect x="0" y="0" width="18" height="20" rx="4" fill="#E2E8F0" stroke="#0B2545" strokeWidth="2" />
                <path d="M18 5 C23 5, 23 15, 18 15" fill="none" stroke="#0B2545" strokeWidth="2.5" strokeLinecap="round" />
                <motion.path
                  d="M5 -4 Q9 -10 5 -16"
                  stroke="#94A3B8"
                  strokeWidth="2"
                  fill="none"
                  animate={{ opacity: [0, 0.8, 0], y: [-2, -8] }}
                  transition={{ duration: 1.8, repeat: Infinity }}
                />
                <motion.path
                  d="M13 -4 Q17 -10 13 -16"
                  stroke="#94A3B8"
                  strokeWidth="2"
                  fill="none"
                  animate={{ opacity: [0, 0.8, 0], y: [-2, -8] }}
                  transition={{ duration: 1.8, repeat: Infinity, delay: 0.6 }}
                />
              </g>
            )}
          </motion.g>

          {/* Feet */}
          <rect x="82" y="182" width="8" height="10" rx="3" fill={palette.wings} />
          <rect x="110" y="182" width="8" height="10" rx="3" fill={palette.wings} />

          {/* Body */}
          <ellipse cx="100" cy="130" rx="55" ry="60" fill={palette.body} />

          {/* Belly */}
          <ellipse cx="100" cy="140" rx="38" ry="42" fill={palette.belly} />
          <path d="M80 120 Q100 128 120 120" stroke={palette.featherLines} strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <path d="M78 138 Q100 146 122 138" stroke={palette.featherLines} strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <path d="M80 156 Q100 164 120 156" stroke={palette.featherLines} strokeWidth="2.5" fill="none" strokeLinecap="round" />

          {/* Satchel Strap Accessory */}
          {accessories.satchel && (
            <g>
              <path d="M68 105 L128 175" stroke="#78350F" strokeWidth="6" strokeLinecap="round" />
              <path d="M68 105 L128 175" stroke="#B45309" strokeWidth="3" strokeLinecap="round" />
              <rect x="100" y="140" width="10" height="12" rx="2" fill="#F59E0B" stroke="#78350F" strokeWidth="1.5" />
            </g>
          )}

          {/* Ear tufts */}
          <path d="M60 65 Q65 40 78 58 Z" fill={palette.wings} />
          <path d="M140 65 Q135 40 122 58 Z" fill={palette.wings} />

          {/* Head */}
          <circle cx="100" cy="85" r="52" fill={palette.body} />

          {/* Eyebrows */}
          <motion.path
            variants={eyebrowVariants}
            animate={animState}
            d="M62 55 Q75 46 88 54"
            stroke={palette.beakFeet}
            strokeWidth="4"
            fill="none"
            strokeLinecap="round"
          />
          <motion.path
            variants={eyebrowVariants}
            animate={animState}
            d="M112 54 Q125 46 138 55"
            stroke={palette.beakFeet}
            strokeWidth="4"
            fill="none"
            strokeLinecap="round"
          />

          {/* Eye whites */}
          <circle cx="78" cy="82" r="26" fill="#FFFFFF" />
          <circle cx="122" cy="82" r="26" fill="#FFFFFF" />

          {/* Eyes rendering */}
          {eyesClosed ? (
            <>
              <path d="M64 82 Q78 88 92 82" stroke={palette.beakFeet} strokeWidth="4" fill="none" strokeLinecap="round" />
              <path d="M108 82 Q122 88 136 82" stroke={palette.beakFeet} strokeWidth="4" fill="none" strokeLinecap="round" />
            </>
          ) : isDizzy ? (
            <>
              <motion.path
                d="M78 82 m-10,0 a10,10 0 1,0 20,0 a10,10 0 1,0 -20,0 m4,0 a6,6 0 1,0 12,0"
                stroke={palette.beakFeet}
                strokeWidth="3"
                fill="none"
                animate={{ rotate: 360 }}
                transition={{ duration: 1.4, repeat: Infinity, ease: "linear" }}
                style={{ originX: "78px", originY: "82px" }}
              />
              <motion.path
                d="M122 82 m-10,0 a10,10 0 1,0 20,0 a10,10 0 1,0 -20,0 m4,0 a6,6 0 1,0 12,0"
                stroke={palette.beakFeet}
                strokeWidth="3"
                fill="none"
                animate={{ rotate: -360 }}
                transition={{ duration: 1.4, repeat: Infinity, ease: "linear" }}
                style={{ originX: "122px", originY: "82px" }}
              />
            </>
          ) : (
            <>
              <circle cx={78 + eyeDx} cy={82 + eyeDy} r="16" fill={palette.iris} />
              <circle cx={122 + eyeDx} cy={82 + eyeDy} r="16" fill={palette.iris} />
              <circle cx={78 + eyeDx} cy={82 + eyeDy} r="10" fill={palette.beakFeet} />
              <circle cx={122 + eyeDx} cy={82 + eyeDy} r="10" fill={palette.beakFeet} />
              <circle cx={74 + eyeDx} cy={77 + eyeDy} r="3.5" fill="#FFFFFF" />
              <circle cx={81 + eyeDx} cy={85 + eyeDy} r="1.5" fill="#FFFFFF" />
              <circle cx={118 + eyeDx} cy={77 + eyeDy} r="3.5" fill="#FFFFFF" />
              <circle cx={125 + eyeDx} cy={85 + eyeDy} r="1.5" fill="#FFFFFF" />
            </>
          )}

          {/* Reading Glasses Accessory */}
          {accessories.glasses && !eyesClosed && (
            <g>
              <circle cx="78" cy="82" r="23" fill="none" stroke="#0B2545" strokeWidth="3" />
              <circle cx="122" cy="82" r="23" fill="none" stroke="#0B2545" strokeWidth="3" />
              <path d="M101 82 L99 82" stroke="#0B2545" strokeWidth="3" strokeLinecap="round" />
              <circle cx="78" cy="82" r="23" fill="none" stroke="#FFB703" strokeWidth="1" opacity="0.6" />
              <circle cx="122" cy="82" r="23" fill="none" stroke="#FFB703" strokeWidth="1" opacity="0.6" />
            </g>
          )}

          {/* Beak */}
          <motion.path
            variants={beakVariants}
            animate={animState}
            d="M92 100 L108 100 L100 116 Z"
            fill={palette.beakFeet}
            style={{ originX: "100px", originY: "100px" }}
          />

          {/* Mortarboard / Graduate Cap Accessory */}
          {accessories.mortarboard && (
            <g transform="translate(50, 22)">
              <polygon points="50,0 98,16 50,32 2,16" fill="#0B2545" />
              <rect x="30" y="24" width="40" height="14" rx="2" fill="#1E293B" />
              <circle cx="50" cy="16" r="3" fill="#FFB703" />
              <path d="M50 16 Q65 24 68 40" stroke="#FFB703" strokeWidth="2.5" fill="none" strokeLinecap="round" />
              <circle cx="68" cy="42" r="3.5" fill="#FFB703" />
            </g>
          )}
        </motion.g>
      </svg>
    </motion.div>
  );
}
