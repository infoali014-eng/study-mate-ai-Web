import { create } from "zustand";
import { OwlAnimState } from "../components/owl/MrOwl";

interface OwlStore {
  animState: OwlAnimState;
  message: string;
  say: (text: string, mood: OwlAnimState) => void;
  clearMessage: () => void;
  setAnimState: (animState: OwlAnimState) => void;
}

let dismissTimer: NodeJS.Timeout | null = null;

export const useOwlStore = create<OwlStore>((set) => ({
  animState: "idle",
  message: "",
  say: (text, mood) => {
    if (dismissTimer) {
      clearTimeout(dismissTimer);
      dismissTimer = null;
    }

    set({ message: text, animState: mood });

    // Auto-dismiss the bubble after 4 seconds and return owl to idle
    dismissTimer = setTimeout(() => {
      set({ message: "", animState: "idle" });
      dismissTimer = null;
    }, 4000);
  },
  clearMessage: () => {
    if (dismissTimer) {
      clearTimeout(dismissTimer);
      dismissTimer = null;
    }
    set({ message: "", animState: "idle" });
  },
  setAnimState: (animState) => set({ animState }),
}));
export type { OwlAnimState };
