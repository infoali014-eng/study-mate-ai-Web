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
        
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("[Onboarding] Session error:", sessionError);
          setDebugMsg("Session error: " + sessionError.message);
        }

        if (!session) {
          console.log("[Onboarding] No active session found, redirecting to login...");
          router.push("/login");
          return;
        }

        console.log("[Onboarding] Session active for user:", session.user.id);
        setDebugMsg("Verifying onboarding status...");

        const response = (await supabase
          .from("user_onboarding")
          .select("completed")
          .eq("user_id", session.user.id)
          .single()) as unknown as { data: { completed: boolean } | null; error: unknown };

        if (response.error) {
          console.warn("[Onboarding] Onboarding table check returned error:", response.error);
        }

        const onboarding = response.data;
        console.log("[Onboarding] Onboarding completion state:", onboarding);

        if (onboarding?.completed) {
          console.log("[Onboarding] Already completed, redirecting to dashboard...");
          router.push("/dashboard");
        } else {
          console.log("[Onboarding] Incomplete onboarding, rendering wizard...");
          setVerifying(false);
        }
      } catch (err: unknown) {
        const errMsg = err instanceof Error ? err.message : String(err);
        console.error("[Onboarding] Unexpected error during verification:", errMsg);
        setDebugMsg("Unexpected error: " + errMsg);
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
