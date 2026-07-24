"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Sparkles } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import { PageHeader, Button, Badge } from "@/components/ui";

export default function GreetingBanner() {
  const [firstName, setFirstName] = useState<string | null>(null);
  const [greetingTime, setGreetingTime] = useState<string>("Good Morning");

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) {
      setGreetingTime("Good Morning");
    } else if (hour < 17) {
      setGreetingTime("Good Afternoon");
    } else {
      setGreetingTime("Good Evening");
    }

    const fetchUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const fullName =
            user.user_metadata?.display_name ||
            user.user_metadata?.full_name ||
            user.email?.split("@")[0] ||
            "";
          const first = fullName.trim().split(" ")[0];
          if (first) {
            setFirstName(first);
          }
        }
      } catch {
        // Fallback silently if user call encounters error
      }
    };

    fetchUser();
  }, []);

  return (
    <PageHeader
      badge={
        <Badge variant="primary" size="sm" icon={<Sparkles className="w-3.5 h-3.5" />}>
          AI Workspace Active
        </Badge>
      }
      title={`${greetingTime}${firstName ? `, ${firstName}` : ""} 👋`}
      description="Ready to continue learning? Your workspace is clean and ready."
      action={
        <Link href="/library?action=upload">
          <Button variant="primary" size="md" leftIcon={<Plus className="w-4 h-4" />}>
            Upload Notes
          </Button>
        </Link>
      }
    />
  );
}
