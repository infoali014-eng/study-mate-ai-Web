import { Variants } from "framer-motion";

export const idleVariants: Variants = {
  idle: {
    y: [0, -4, 0],
    rotate: [0, 1, -1, 0],
    scale: [1, 1.02, 1],
    transition: {
      y: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut",
      },
      rotate: {
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut",
      },
      scale: {
        duration: 5,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  },
};
