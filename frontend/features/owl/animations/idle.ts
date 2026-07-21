import { Variants } from "framer-motion";

export const idleVariants: Variants = {
  idle: {
    y: [0, -6, -3, 6, 0],
    rotate: [0, 0.5, 2, -2, 0],
    scale: [1, 1.01, 0.99, 0.98, 1],
    transition: {
      duration: 6, // Very calm, slow pace
      repeat: Infinity,
      ease: "easeInOut",
      times: [0, 0.25, 0.5, 0.75, 1],
    },
  },
};
