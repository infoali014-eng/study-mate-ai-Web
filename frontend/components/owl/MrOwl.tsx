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
    y: [0, -5, -2, 3, 0],
    rotate: [0, 1, -1.5, 1, 0],
    scale: [1, 1.015, 1, 0.985, 1],
    transition: { duration: 4, ease: "easeInOut", repeat: Infinity },
  },
  "fly-in": { y: [10, 0], transition: { duration: 0.9, ease: "easeOut" } },
  talk: { y: [0, -4, 0], transition: { duration: 0.5, repeat: 3, ease: "easeInOut" } },
  celebrate: {
    rotate: [0, -8, 8, -6, 0],
    scale: [1, 1.1, 1.04, 1.08, 1],
    transition: { duration: 0.7, ease: "easeInOut" },
  },
  sleep: { y: [0, 2, 0], transition: { duration: 3, ease: "easeInOut", repeat: Infinity } },
  dizzy: {
    rotate: [0, -12, 12, -8, 8, -4, 4, 0],
    y: [0, -5, 3, -3, 0],
    transition: { duration: 1.4, ease: "easeInOut" },
  },
  thinking: {
    rotate: -4,
    y: [0, -3, 0],
    transition: { duration: 2.5, ease: "easeInOut", repeat: Infinity },
  },
  curious: {
    rotate: 14,
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
  thinking: { rotate: -42, y: -8, x: 8 },
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
  night_owl: { rotate: -12, y: -4 },
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

  // Mouse pupil tracking offset (clamped to [-3.5, 3.5] px)
  let eyeDx = 0;
  let eyeDy = 0;
  if (mousePos && (animState === "idle" || animState === "curious")) {
    const center = typeof window !== "undefined" ? window.innerWidth / 2 : 500;
    const dx = (mousePos.x - center) / (center || 1);
    const dy = (mousePos.y - (typeof window !== "undefined" ? window.innerHeight / 2 : 500)) / 500;
    eyeDx = Math.max(-3.5, Math.min(3.5, dx * 4));
    eyeDy = Math.max(-3.5, Math.min(3.5, dy * 3));
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
              style={{ originX: "100px", originY: "25px" }}
            >
              <polygon points="100,10 102,16 108,16 103,20 105,26 100,22 95,26 97,20 92,16 98,16" fill="#FFB703" />
              <polygon points="65,22 66,26 70,26 67,29 68,33 65,30 62,33 63,29 60,26 64,26" fill="#FFB703" />
              <polygon points="135,22 136,26 140,26 137,29 138,33 135,30 132,33 133,29 130,26 134,26" fill="#FFB703" />
            </motion.g>
          )}

          {/* Thinking Dots */}
          {animState === "thinking" && (
            <g>
              <motion.circle
                cx="142"
                cy="40"
                r="3.5"
                fill={palette.iris}
                animate={{ opacity: [0.2, 1, 0.2], y: [0, -4, 0] }}
                transition={{ duration: 1.2, repeat: Infinity, delay: 0 }}
              />
              <motion.circle
                cx="156"
                cy="28"
                r="5.5"
                fill={palette.iris}
                animate={{ opacity: [0.2, 1, 0.2], y: [0, -4, 0] }}
                transition={{ duration: 1.2, repeat: Infinity, delay: 0.3 }}
              />
              <motion.circle
                cx="172"
                cy="14"
                r="7.5"
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
                x="142"
                y="45"
                fill="#FFB703"
                fontSize="18"
                fontWeight="900"
                initial={{ opacity: 0, y: 50, x: 137 }}
                animate={{ opacity: [0, 1, 0], y: [50, 25], x: [137, 147] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: "easeOut" }}
              >
                Z
              </motion.text>
              <motion.text
                x="156"
                y="35"
                fill={palette.featherLines}
                fontSize="14"
                fontWeight="800"
                initial={{ opacity: 0, y: 40, x: 151 }}
                animate={{ opacity: [0, 1, 0], y: [40, 15], x: [151, 163] }}
                transition={{ duration: 2.2, delay: 0.7, repeat: Infinity, ease: "easeOut" }}
              >
                z
              </motion.text>
              <motion.text
                x="169"
                y="25"
                fill="#FFB703"
                fontSize="11"
                fontWeight="700"
                initial={{ opacity: 0, y: 30, x: 166 }}
                animate={{ opacity: [0, 1, 0], y: [30, 8], x: [166, 176] }}
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

            {/* Stylus / Wand Accessory (Held in Left Wing) */}
            {accessories.wand && (
              <g transform="translate(28, 115) rotate(-35)">
                <rect x="0" y="0" width="7" height="42" rx="3.5" fill="#0F172A" />
                <circle cx="3.5" cy="0" r="7" fill="#38BDF8" />
                <circle cx="3.5" cy="0" r="3.5" fill="#FFFFFF" />
                <circle cx="3.5" cy="0" r="10" fill="#38BDF8" opacity="0.35" />
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
          </motion.g>

          {/* CUTE 3-CLAWED OWL FEET */}
          <g>
            {/* Left Foot Claws */}
            <path d="M74 176 Q77 187 74 191" stroke={palette.wings} strokeWidth="5" strokeLinecap="round" />
            <path d="M82 176 Q82 189 82 193" stroke={palette.wings} strokeWidth="5.5" strokeLinecap="round" />
            <path d="M90 176 Q87 187 90 191" stroke={palette.wings} strokeWidth="5" strokeLinecap="round" />

            {/* Right Foot Claws */}
            <path d="M110 176 Q113 187 110 191" stroke={palette.wings} strokeWidth="5" strokeLinecap="round" />
            <path d="M118 176 Q118 189 118 193" stroke={palette.wings} strokeWidth="5.5" strokeLinecap="round" />
            <path d="M126 176 Q123 187 126 191" stroke={palette.wings} strokeWidth="5" strokeLinecap="round" />
          </g>

          {/* Body */}
          <ellipse cx="100" cy="130" rx="55" ry="58" fill={palette.body} />

          {/* Belly */}
          <ellipse cx="100" cy="140" rx="38" ry="40" fill={palette.belly} />
          <path d="M80 120 Q100 128 120 120" stroke={palette.featherLines} strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <path d="M78 138 Q100 146 122 138" stroke={palette.featherLines} strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <path d="M80 156 Q100 164 120 156" stroke={palette.featherLines} strokeWidth="2.5" fill="none" strokeLinecap="round" />

          {/* Satchel Strap Accessory */}
          {accessories.satchel && (
            <g>
              <path d="M66 104 L134 172" stroke="#78350F" strokeWidth="7" strokeLinecap="round" />
              <path d="M66 104 L134 172" stroke="#B45309" strokeWidth="3.5" strokeLinecap="round" />
              <rect x="96" y="134" width="12" height="14" rx="3" fill="#F59E0B" stroke="#78350F" strokeWidth="2" />
            </g>
          )}

          {/* Coffee Mug Accessory (Rendered IN FRONT of Right Wing & Body) */}
          {(accessories.coffee || animState === "night_owl") && (
            <g transform="translate(136, 122)">
              <motion.path
                d="M6 -4 Q10 -10 6 -16"
                stroke="#94A3B8"
                strokeWidth="2.5"
                fill="none"
                animate={{ opacity: [0, 0.9, 0], y: [-2, -8] }}
                transition={{ duration: 1.8, repeat: Infinity }}
              />
              <motion.path
                d="M14 -4 Q18 -10 14 -16"
                stroke="#94A3B8"
                strokeWidth="2.5"
                fill="none"
                animate={{ opacity: [0, 0.9, 0], y: [-2, -8] }}
                transition={{ duration: 1.8, repeat: Infinity, delay: 0.6 }}
              />
              {/* Mug Body */}
              <rect x="0" y="0" width="20" height="22" rx="5" fill="#FFFFFF" stroke="#0F172A" strokeWidth="2.5" />
              {/* Coffee line */}
              <rect x="3" y="3" width="14" height="4" rx="1" fill="#78350F" />
              {/* Cute Heart Badge */}
              <path d="M10 10 Q8 8 6 10 Q6 13 10 15 Q14 13 14 10 Q12 8 10 10 Z" fill="#EF4444" />
              {/* Mug Handle */}
              <path d="M20 5 C26 5, 26 17, 20 17" fill="none" stroke="#0F172A" strokeWidth="2.5" strokeLinecap="round" />
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
            d="M62 52 Q75 43 88 51"
            stroke={palette.beakFeet}
            strokeWidth="4"
            fill="none"
            strokeLinecap="round"
          />
          <motion.path
            variants={eyebrowVariants}
            animate={animState}
            d="M112 51 Q125 43 138 52"
            stroke={palette.beakFeet}
            strokeWidth="4"
            fill="none"
            strokeLinecap="round"
          />

          {/* Eye whites */}
          <circle cx="76" cy="80" r="25" fill="#FFFFFF" />
          <circle cx="124" cy="80" r="25" fill="#FFFFFF" />

          {/* Eyes rendering */}
          {eyesClosed ? (
            <>
              <path d="M62 80 Q76 86 90 80" stroke={palette.beakFeet} strokeWidth="4" fill="none" strokeLinecap="round" />
              <path d="M110 80 Q124 86 138 80" stroke={palette.beakFeet} strokeWidth="4" fill="none" strokeLinecap="round" />
            </>
          ) : isDizzy ? (
            <>
              <motion.path
                d="M76 80 m-10,0 a10,10 0 1,0 20,0 a10,10 0 1,0 -20,0 m4,0 a6,6 0 1,0 12,0"
                stroke={palette.beakFeet}
                strokeWidth="3"
                fill="none"
                animate={{ rotate: 360 }}
                transition={{ duration: 1.4, repeat: Infinity, ease: "linear" }}
                style={{ originX: "76px", originY: "80px" }}
              />
              <motion.path
                d="M124 80 m-10,0 a10,10 0 1,0 20,0 a10,10 0 1,0 -20,0 m4,0 a6,6 0 1,0 12,0"
                stroke={palette.beakFeet}
                strokeWidth="3"
                fill="none"
                animate={{ rotate: -360 }}
                transition={{ duration: 1.4, repeat: Infinity, ease: "linear" }}
                style={{ originX: "124px", originY: "80px" }}
              />
            </>
          ) : (
            <>
              <circle cx={76 + eyeDx} cy={80 + eyeDy} r="15" fill={palette.iris} />
              <circle cx={124 + eyeDx} cy={80 + eyeDy} r="15" fill={palette.iris} />
              <circle cx={76 + eyeDx} cy={80 + eyeDy} r="9.5" fill={palette.beakFeet} />
              <circle cx={124 + eyeDx} cy={80 + eyeDy} r="9.5" fill={palette.beakFeet} />
              <circle cx={72 + eyeDx} cy={75 + eyeDy} r="3.5" fill="#FFFFFF" />
              <circle cx={79 + eyeDx} cy={83 + eyeDy} r="1.5" fill="#FFFFFF" />
              <circle cx={120 + eyeDx} cy={75 + eyeDy} r="3.5" fill="#FFFFFF" />
              <circle cx={127 + eyeDx} cy={83 + eyeDy} r="1.5" fill="#FFFFFF" />
            </>
          )}

          {/* REALISTIC NON-OVERLAPPING SMART GLASSES */}
          {accessories.glasses && !eyesClosed && (
            <g>
              {/* Left Lens Frame */}
              <circle cx="74" cy="80" r="21" fill="none" stroke="#0F172A" strokeWidth="3.5" />
              {/* Right Lens Frame */}
              <circle cx="126" cy="80" r="21" fill="none" stroke="#0F172A" strokeWidth="3.5" />
              {/* Elegant Arched Nose Bridge over Beak */}
              <path d="M95 78 Q100 73 105 78" fill="none" stroke="#0F172A" strokeWidth="3.5" strokeLinecap="round" />
              {/* Side Temple Arms going to ears */}
              <path d="M53 79 L36 74" fill="none" stroke="#0F172A" strokeWidth="3" strokeLinecap="round" />
              <path d="M147 79 L164 74" fill="none" stroke="#0F172A" strokeWidth="3" strokeLinecap="round" />
              {/* Glass Lens Reflection Glint Lines */}
              <path d="M64 68 L78 68" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
              <path d="M116 68 L130 68" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
            </g>
          )}

          {/* SOFTENED FRIENDLY CURVED BEAK */}
          <motion.path
            variants={beakVariants}
            animate={animState}
            d="M91 96 Q100 94 109 96 Q109 105 100 114 Q91 105 91 96 Z"
            fill={palette.beakFeet}
            style={{ originX: "100px", originY: "96px" }}
          />

          {/* PROPERLY FITTED GRADUATION MORTARBOARD CAP (PROUDLY ON TOP OF HEAD) */}
          {accessories.mortarboard && (
            <g transform="translate(0, 0)">
              {/* Fitted Skullcap Base sitting on top of head */}
              <path d="M72 32 Q100 28 128 32 L124 43 Q100 47 76 43 Z" fill="#0B2545" />
              <path d="M74 42 Q100 46 126 42" stroke="#1E293B" strokeWidth="1.5" fill="none" />
              {/* Diamond Top Board */}
              <polygon points="100,10 152,24 100,38 48,24" fill="#0B2545" stroke="#1E293B" strokeWidth="1" />
              {/* Gold Tassel Button */}
              <circle cx="100" cy="24" r="3.5" fill="#FFB703" />
              {/* Tassel Draping Gracefully down the LEFT side of head */}
              <path d="M100 24 Q68 28 60 48" stroke="#FFB703" strokeWidth="2.5" fill="none" strokeLinecap="round" />
              {/* Golden Fringe Block */}
              <rect x="56" y="47" width="8" height="9" rx="2" fill="#FFB703" />
            </g>
          )}
        </motion.g>
      </svg>
    </motion.div>
  );
}
