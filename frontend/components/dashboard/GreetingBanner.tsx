"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Sparkles } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { PageHeader, Button, Badge } from "@/components/ui";
import { LibraryService } from "@/services/libraryService";
import { useUserProfile } from "@/hooks/useUserProfile";

export default function GreetingBanner() {
  const [greetingTime, setGreetingTime] = useState<string>("Good Morning");
  const { profile } = useUserProfile();

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) {
      setGreetingTime("Good Morning");
    } else if (hour < 17) {
      setGreetingTime("Good Afternoon");
    } else {
      setGreetingTime("Good Evening");
    }
  }, []);

  // TanStack Query for live reactive stats
  const { data: stats } = useQuery({
    queryKey: ["dashboardStats"],
    queryFn: () => LibraryService.getDashboardStats(),
  });

  const firstName = profile.displayName ? profile.displayName.trim().split(" ")[0] : null;

  const totalNotes = stats?.totalNotes || 0;
  const descriptionText =
    totalNotes > 0
      ? `You have ${totalNotes} ${totalNotes === 1 ? "study note" : "study notes"} ready in your AI workspace.`
      : "Upload your first note to start learning and build your personal AI study workspace.";

  return (
    <PageHeader
      badge={
        <Badge variant="primary" size="sm" icon={<Sparkles className="w-3.5 h-3.5" />}>
          AI Workspace Active
        </Badge>
      }
      title={`${greetingTime}${firstName ? `, ${firstName}` : ""} 👋`}
      description={descriptionText}
      action={
        <Link href="/dashboard/library">
          <Button variant="primary" size="md" leftIcon={<Plus className="w-4 h-4" />}>
            Upload Notes
          </Button>
        </Link>
      }
    />
  );
}
