import { create } from "zustand";

interface StreakUIState {
  isOpen: boolean;
  toastVisible: boolean;
  toastStreakCount: number;
  setIsOpen: (open: boolean) => void;
  toggleOpen: () => void;
  showToast: (streakCount: number) => void;
  hideToast: () => void;
}

export const useStreakStore = create<StreakUIState>((set) => ({
  isOpen: false,
  toastVisible: false,
  toastStreakCount: 0,

  setIsOpen: (open: boolean) => set({ isOpen: open }),
  toggleOpen: () => set((state) => ({ isOpen: !state.isOpen })),

  showToast: (streakCount: number) => set({ toastVisible: true, toastStreakCount: streakCount }),
  hideToast: () => set({ toastVisible: false }),
}));
