import { create } from "zustand";
import { persist } from "zustand/middleware";
import { OwlAnimState } from "../components/owl/MrOwl";

interface OwlStore {
  animState: OwlAnimState;
  message: string;
  enabled: boolean;
  say: (text: string, mood: OwlAnimState) => void;
  clearMessage: () => void;
  setAnimState: (animState: OwlAnimState) => void;
  setEnabled: (enabled: boolean) => void;
}

let dismissTimer: NodeJS.Timeout | null = null;

export const useOwlStore = create<OwlStore>()(
  persist(
    (set) => ({
      animState: "idle",
      message: "",
      enabled: true,
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
      setEnabled: (enabled) => set({ enabled }),
    }),
    {
      name: "mr-owl-preferences",
      partialize: (state) => ({ enabled: state.enabled }),
    }
  )
);

export type { OwlAnimState };
