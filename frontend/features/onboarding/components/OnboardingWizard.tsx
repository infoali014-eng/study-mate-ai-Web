"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useOnboardingStore } from "../store/onboardingStore";
import { ONBOARDING_QUESTIONS, ONBOARDING_STEPS_COUNT } from "../config/onboarding.config";
import { submitOnboardingService } from "../services/onboardingService";
import { onboardingValidationSchema } from "../validation/onboardingSchema";
import ProgressBar from "./ProgressBar";
import NavigationButtons from "./NavigationButtons";

// Import step components
import WelcomeStep from "./steps/WelcomeStep";
import EducationStep from "./steps/EducationStep";
import SubjectsStep from "./steps/SubjectsStep";
import GoalStep from "./steps/GoalStep";
import HeardFromStep from "./steps/HeardFromStep";
import InterestsStep from "./steps/InterestsStep";
import LearningStyleStep from "./steps/LearningStyleStep";
import StudyTimeStep from "./steps/StudyTimeStep";
import ExamStep from "./steps/ExamStep";
import DashboardStep from "./steps/DashboardStep";
import FinishStep from "./steps/FinishStep";

import { Loader2 } from "lucide-react";

export default function OnboardingWizard() {
  const router = useRouter();
  const store = useOnboardingStore();
  const [mounted, setMounted] = useState(false);
  const [direction, setDirection] = useState(1); // 1 = forward, -1 = back
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // 1. Keyboard accessibility
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore key events if user is typing in a text field/date picker
      if (e.target instanceof HTMLInputElement) {
        if (e.key === "Enter" && store.currentStep === 9) {
          // Allow enter key to advance on date picker
          handleContinue();
        }
        return;
      }

      if (e.key === "Enter") {
        if (store.currentStep === ONBOARDING_STEPS_COUNT) {
          handleSubmit();
        } else if (isStepValid()) {
          handleContinue();
        }
      } else if (e.key === "Backspace" && store.currentStep > 1) {
        handleBack();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [store.currentStep, store.education, store.subjects, store.primaryGoals, store.heardFrom, store.learningStyles, store.dailyStudyTime, store.dashboardFocus]);

  const isStepValid = (): boolean => {
    switch (store.currentStep) {
      case 1: return true; // Welcome
      case 2: return !!store.education;
      case 3: return store.subjects.length > 0;
      case 4: return store.primaryGoals.length > 0;
      case 5: return !!store.heardFrom;
      case 6: return true; // Interests (Optional)
      case 7: return store.learningStyles.length > 0;
      case 8: return !!store.dailyStudyTime;
      case 9: return true; // Next Exam (Optional)
      case 10: return !!store.dashboardFocus;
      case 11: return true; // Finish
      default: return false;
    }
  };

  const isSkippable = (): boolean => {
    // Interests (step 6) and Next Exam (step 9) are skippable
    return store.currentStep === 6 || store.currentStep === 9;
  };

  const handleContinue = () => {
    if (isStepValid()) {
      setDirection(1);
      store.nextStep();
    }
  };

  const handleBack = () => {
    setDirection(-1);
    store.prevStep();
  };

  const handleSkip = () => {
    if (isSkippable()) {
      if (store.currentStep === 6) {
        store.setAnswer("interests", []);
      } else if (store.currentStep === 9) {
        store.setAnswer("nextExam", null);
      }
      setDirection(1);
      store.nextStep();
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmitError(null);

    // Validate inputs with Zod
    const validationResult = onboardingValidationSchema.safeParse({
      education: store.education,
      subjects: store.subjects,
      primaryGoals: store.primaryGoals,
      heardFrom: store.heardFrom,
      interests: store.interests,
      learningStyles: store.learningStyles,
      dailyStudyTime: store.dailyStudyTime,
      nextExam: store.nextExam,
      dashboardFocus: store.dashboardFocus,
    });

    if (!validationResult.success) {
      setSubmitError(
        validationResult.error.errors[0]?.message || "Invalid onboarding responses"
      );
      setIsSubmitting(false);
      return;
    }

    // Call service to save in ONE transactional API call
    const result = await submitOnboardingService(validationResult.data);

    if (result.success) {
      // Clear Zustand storage draft
      store.reset();
      
      // Map selection to route path
      const preferredDashboard = validationResult.data.dashboardFocus;
      const targetRoute = preferredDashboard === "library" ? "/library" : `/${preferredDashboard}`;
      
      router.push(targetRoute);
    } else {
      setSubmitError(result.error || "Failed to submit. Please try again.");
      setIsSubmitting(false);
    }
  };

  // 2. Dynamic step component resolver
  const renderStepContent = () => {
    switch (store.currentStep) {
      case 1: return <WelcomeStep />;
      case 2: return <EducationStep />;
      case 3: return <SubjectsStep />;
      case 4: return <GoalStep />;
      case 5: return <HeardFromStep />;
      case 6: return <InterestsStep />;
      case 7: return <LearningStyleStep />;
      case 8: return <StudyTimeStep />;
      case 9: return <ExamStep />;
      case 10: return <DashboardStep />;
      case 11:
        return (
          <FinishStep
            isSubmitting={isSubmitting}
            submitError={submitError}
            onSubmit={handleSubmit}
          />
        );
      default:
        return null;
    }
  };

  // Slide/Fade variants
  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 80 : -80,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      x: dir < 0 ? 80 : -80,
      opacity: 0,
    }),
  };

  if (!mounted) {
    return (
      <div className="w-full max-w-xl mx-auto min-h-[380px] flex flex-col items-center justify-center p-6 bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 rounded-3xl shadow-xl">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="w-full max-w-xl mx-auto space-y-8 p-6 bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 rounded-3xl shadow-xl dark:shadow-black/20 select-none">
      
      {/* 3. Progress Tracker */}
      <ProgressBar currentStep={store.currentStep} totalSteps={ONBOARDING_STEPS_COUNT} />

      {/* 4. Animated Screen Slider */}
      <div className="relative overflow-hidden min-h-[380px] flex flex-col justify-center">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={store.currentStep}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="w-full"
          >
            {renderStepContent()}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* 5. Stepper Navigation buttons */}
      <NavigationButtons
        currentStep={store.currentStep}
        totalSteps={ONBOARDING_STEPS_COUNT}
        isStepValid={isStepValid()}
        isSkippable={isSkippable()}
        onBack={handleBack}
        onContinue={handleContinue}
        onSkip={handleSkip}
      />

    </div>
  );
}
