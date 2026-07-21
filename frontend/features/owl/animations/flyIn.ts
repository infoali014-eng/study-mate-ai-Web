import { Variants } from "framer-motion";
import { OWL_FLIGHT_PATH } from "../constants/owl.constants";

export const flyInVariants: Variants = {
  hidden: {
    x: OWL_FLIGHT_PATH.START.x,
    y: OWL_FLIGHT_PATH.START.y,
    opacity: 0,
    scale: 0.8,
    rotate: -15,
  },
  fly: {
    x: [
      OWL_FLIGHT_PATH.START.x,
      OWL_FLIGHT_PATH.MID.x,
      OWL_FLIGHT_PATH.LAND.x,
      OWL_FLIGHT_PATH.BOUNCE.x,
      OWL_FLIGHT_PATH.LAND.x,
    ],
    y: [
      OWL_FLIGHT_PATH.START.y,
      OWL_FLIGHT_PATH.MID.y,
      OWL_FLIGHT_PATH.LAND.y,
      OWL_FLIGHT_PATH.BOUNCE.y,
      OWL_FLIGHT_PATH.LAND.y,
    ],
    opacity: [0, 1, 1, 1, 1],
    scale: [0.8, 1, 1, 1.05, 1],
    rotate: [-15, -5, 0, 3, 0],
    transition: {
      duration: OWL_FLIGHT_PATH.DURATION,
      times: [0, 0.45, 0.85, 0.93, 1],
      ease: ["easeOut", "easeInOut", "easeOut", "easeInOut"],
    },
  },
};
