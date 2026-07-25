import { create } from "zustand";
import { persist } from "zustand/middleware";
import { OwlAnimState } from "../components/owl/MrOwl";

export type OwlSkin = "classic" | "natural" | "midnight" | "emerald" | "sunset" | "sakura";

export interface OwlAccessories {
  glasses: boolean;
  mortarboard: boolean;
  satchel: boolean;
  wand: boolean;
  coffee: boolean;
}

interface OwlStore {
  animState: OwlAnimState;
  message: string;
  enabled: boolean;
  skin: OwlSkin;
  accessories: OwlAccessories;
  glow: boolean;
  eyeTracking: boolean;
  say: (text: string, mood: OwlAnimState) => void;
  clearMessage: () => void;
  setAnimState: (animState: OwlAnimState) => void;
  setEnabled: (enabled: boolean) => void;
  setSkin: (skin: OwlSkin) => void;
  toggleAccessory: (key: keyof OwlAccessories) => void;
  setGlow: (glow: boolean) => void;
  setEyeTracking: (eyeTracking: boolean) => void;
}

let dismissTimer: NodeJS.Timeout | null = null;

export const useOwlStore = create<OwlStore>()(
  persist(
    (set) => ({
      animState: "idle",
      message: "",
      enabled: true,
      skin: "classic",
      accessories: {
        glasses: true,
        mortarboard: false,
        satchel: false,
        wand: false,
        coffee: false,
      },
      glow: true,
      eyeTracking: true,
      say: (text, mood) => {
        if (dismissTimer) {
          clearTimeout(dismissTimer);
          dismissTimer = null;
        }

        set({ message: text, animState: mood });

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
      setSkin: (skin) => set({ skin }),
      toggleAccessory: (key) =>
        set((state) => ({
          accessories: {
            ...state.accessories,
            [key]: !state.accessories[key],
          },
        })),
      setGlow: (glow) => set({ glow }),
      setEyeTracking: (eyeTracking) => set({ eyeTracking }),
    }),
    {
      name: "mr-owl-preferences",
      partialize: (state) => ({
        enabled: state.enabled,
        skin: state.skin,
        accessories: state.accessories,
        glow: state.glow,
        eyeTracking: state.eyeTracking,
      }),
    }
  )
);

export type { OwlAnimState };
