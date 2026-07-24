import React from "react";
import Link from "next/link";
import { BookOpen, Upload } from "lucide-react";
import { DashboardSection, FeatureCard, Button } from "@/components/ui";

export default function ContinueLearningHero() {
  return (
    <DashboardSection
      title="Continue Learning"
      description="Pick up right where you left off in your latest course or subject"
    >
      <FeatureCard
        icon={<BookOpen className="w-7 h-7 text-[#219EBC]" />}
        title="You haven't started learning yet"
        description="Upload your first note or document to begin building your personal AI study workspace. Your active materials will appear here."
        action={
          <Link href="/library?action=upload">
            <Button variant="primary" size="md" leftIcon={<Upload className="w-4 h-4" />}>
              Upload Notes
            </Button>
          </Link>
        }
      />
    </DashboardSection>
  );
}
