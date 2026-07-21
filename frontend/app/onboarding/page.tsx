"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import OnboardingWizard from "@/features/onboarding/components/OnboardingWizard";
import { Loader2 } from "lucide-react";

export default function OnboardingPage() {
  const router = useRouter();
  const [verifying, setVerifying] = useState(true);

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          router.push("/login");
          return;
        }

        const response = (await supabase
          .from("user_onboarding")
          .select("completed")
          .eq("user_id", session.user.id)
          .single()) as unknown as { data: { completed: boolean } | null };

        const onboarding = response.data;

        if (onboarding?.completed) {
          router.push("/dashboard");
        } else {
          setVerifying(false);
        }
      } catch {
        setVerifying(false); // safe fallback on errors
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
