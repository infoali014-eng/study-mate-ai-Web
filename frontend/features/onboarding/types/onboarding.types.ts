export interface OnboardingAnswers {
  education: string;
  subjects: string[];
  primaryGoals: string[];
  heardFrom: string;
  interests: string[];
  learningStyles: string[];
  dailyStudyTime: string;
  nextExam: string | null;
  dashboardFocus: string;
}

export interface OnboardingStoreState extends OnboardingAnswers {
  currentStep: number;
  setAnswer: <K extends keyof OnboardingAnswers>(field: K, value: OnboardingAnswers[K]) => void;
  nextStep: () => void;
  prevStep: () => void;
  setStep: (step: number) => void;
  reset: () => void;
}

export interface OnboardingQuestion {
  id: string;
  title: string;
  description?: string;
  type: "welcome" | "single" | "multi" | "date" | "finish";
  field?: keyof OnboardingAnswers;
  options?: { value: string; label: string; icon?: string }[];
  required: boolean;
}
