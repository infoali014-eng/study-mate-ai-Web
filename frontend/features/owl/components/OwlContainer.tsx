"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { useOwlStore } from "../store/owlStore";
import { flyInVariants } from "../animations/flyIn";
import { idleVariants } from "../animations/idle";
import OwlCharacter from "./OwlCharacter";

export default function OwlContainer() {
  const currentAnimation = useOwlStore((s) => s.currentAnimation);
  const setCurrentAnimation = useOwlStore((s) => s.setCurrentAnimation);
  const isVisible = useOwlStore((s) => s.isVisible);
  const setIsVisible = useOwlStore((s) => s.setIsVisible);

  useEffect(() => {
    setIsVisible(true);
    setCurrentAnimation("fly-in");
  }, [setIsVisible, setCurrentAnimation]);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 pointer-events-none select-none">
      {/* Outer wrapper for diagonal curved entry flight */}
      <motion.div
        variants={flyInVariants}
        initial="hidden"
        animate={currentAnimation === "fly-in" ? "fly" : "visible"}
        onAnimationComplete={(definition) => {
          if (definition === "fly") {
            setCurrentAnimation("idle");
          }
        }}
      >
        {/* Inner wrapper for subtle idle floating, rotation, and breathing */}
        <motion.div
          variants={idleVariants}
          animate={currentAnimation === "idle" ? "idle" : undefined}
        >
          <OwlCharacter />
        </motion.div>
      </motion.div>
    </div>
  );
}
