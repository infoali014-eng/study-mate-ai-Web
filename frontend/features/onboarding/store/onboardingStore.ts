import { create } from "zustand";
import { persist } from "zustand/middleware";
import { OnboardingAnswers, OnboardingStoreState } from "../types/onboarding.types";

const INITIAL_ANSWERS: OnboardingAnswers = {
  education: "",
  subjects: [],
  primaryGoals: [],
  heardFrom: "",
  interests: [],
  learningStyles: [],
  dailyStudyTime: "",
  nextExam: null,
  dashboardFocus: "",
};

export const useOnboardingStore = create<OnboardingStoreState>()(
  persist(
    (set) => ({
      ...INITIAL_ANSWERS,
      currentStep: 1,
      setAnswer: (field, value) => set({ [field]: value }),
      nextStep: () => set((state) => ({ currentStep: Math.min(state.currentStep + 1, 11) })),
      prevStep: () => set((state) => ({ currentStep: Math.max(state.currentStep - 1, 1) })),
      setStep: (step) => set({ currentStep: step }),
      reset: () => set({ ...INITIAL_ANSWERS, currentStep: 1 }),
    }),
    {
      name: "studymate-onboarding-draft",
    }
  )
);
