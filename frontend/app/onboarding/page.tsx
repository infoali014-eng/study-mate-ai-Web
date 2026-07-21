"use client";

import OnboardingWizard from "@/features/onboarding/components/OnboardingWizard";

export default function OnboardingPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-neutral-50 dark:bg-neutral-950 p-4 sm:p-6 transition-colors duration-300">
      <OnboardingWizard />
    </main>
  );
}
