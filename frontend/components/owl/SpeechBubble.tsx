"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useOwlStore } from "../../store/owlStore";

export default function SpeechBubble() {
  const message = useOwlStore((s) => s.message);
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    if (!message) {
      setDisplayedText("");
      return;
    }

    setDisplayedText("");
    let currentText = "";
    let index = 0;

    const interval = setInterval(() => {
      if (index < message.length) {
        currentText += message[index];
        setDisplayedText(currentText);
        index++;
      } else {
        clearInterval(interval);
      }
    }, 25); // ~25ms per character for typewriter effect

    return () => clearInterval(interval);
  }, [message]);

  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9, x: -10 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          exit={{ opacity: 0, scale: 0.9, x: -10 }}
          className="absolute z-50 -top-[70px] right-[125px] w-[240px] sm:w-[260px] p-4 bg-card text-card-foreground border border-border rounded-2xl shadow-xl select-none"
        >
          {/* Bubble tail pointing rightwards to Mr. Owl's beak */}
          <div className="absolute right-[-6px] top-[30px] w-3 h-3 bg-card border-t border-r border-border rotate-45" />
          
          <p className="text-xs font-semibold leading-relaxed">
            {displayedText}
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
