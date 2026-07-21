import { create } from "zustand";
import { OwlAnimation, OwlPosition, OwlState } from "../types/owl";

interface OwlStore extends OwlState {
  setCurrentAnimation: (animation: OwlAnimation) => void;
  setPosition: (position: OwlPosition) => void;
  setIsVisible: (isVisible: boolean) => void;
  setIsFlying: (isFlying: boolean) => void;
  reset: () => void;
}

const initialState: OwlState = {
  currentAnimation: "none",
  position: { x: 0, y: 0 },
  isVisible: false,
  isFlying: false,
};

export const useOwlStore = create<OwlStore>((set) => ({
  ...initialState,
  setCurrentAnimation: (currentAnimation) => set({ currentAnimation }),
  setPosition: (position) => set({ position }),
  setIsVisible: (isVisible) => set({ isVisible }),
  setIsFlying: (isFlying) => set({ isFlying }),
  reset: () => set(initialState),
}));
