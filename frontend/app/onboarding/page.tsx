"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import OnboardingWizard from "@/features/onboarding/components/OnboardingWizard";
import { Loader2 } from "lucide-react";

export default function OnboardingPage() {
  const router = useRouter();
  const [verifying, setVerifying] = useState(true);
  const [debugMsg, setDebugMsg] = useState("Initializing verification...");

  useEffect(() => {
    const checkStatus = async () => {
      try {
        console.log("[Onboarding] Starting verification check...");
        setDebugMsg("Checking auth session...");
        
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError) {
          console.error("[Onboarding] User auth error:", userError);
          setDebugMsg("Auth error: " + userError.message);
        }

        if (!user) {
          console.log("[Onboarding] No active user session found, redirecting to login...");
          router.push("/login");
          return;
        }

        console.log("[Onboarding] Session active for user:", user.id);
        setDebugMsg("Verifying onboarding status...");

        const { data: onboarding, error: obError } = (await supabase
          .from("user_onboarding")
          .select("completed")
          .eq("user_id", user.id)
          .maybeSingle()) as { data: { completed: boolean } | null; error: unknown };

        if (obError) {
          console.warn("[Onboarding Guard] Onboarding lookup error (treating as incomplete):", obError);
        }

        const isCompleted = onboarding?.completed ?? false;
        console.log("[Onboarding Guard] Onboarding completed state:", isCompleted);

        if (isCompleted) {
          console.log("[Onboarding Guard] Onboarding completed -> Redirecting to /dashboard");
          router.push("/dashboard");
        } else {
          console.log("[Onboarding Guard] Onboarding incomplete -> Rendering onboarding wizard");
          setVerifying(false);
        }
      } catch (err: unknown) {
        const errMsg = err instanceof Error ? err.message : String(err);
        console.error("[Onboarding Guard] Unexpected error during verification:", errMsg);
        setDebugMsg("Unexpected error: " + errMsg);
        // Fallback: allow user to complete onboarding wizard instead of sticking in verifying state
        setVerifying(false);
      }
    };

    checkStatus();
  }, [router]);

  if (verifying) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-neutral-50 dark:bg-neutral-950 p-6">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
          <span className="text-sm font-semibold text-neutral-500 dark:text-neutral-400">
            Verifying account status...
          </span>
          <span className="text-xs text-neutral-400 dark:text-neutral-500 italic mt-2">
            {debugMsg}
          </span>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-neutral-50 dark:bg-neutral-950 p-4 sm:p-6 transition-colors duration-300">
      <OnboardingWizard />
    </main>
  );
}
