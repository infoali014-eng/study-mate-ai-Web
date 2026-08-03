import React from "react";
import { ComingSoonPage } from "@/components/landing/ComingSoonPage";

export const metadata = {
  title: "Join Deep Code - Coming Soon | Deep Code",
  description: "A community where developers, students and creators can learn, collaborate and build together.",
};

export default function JoinDeepCodeComingSoonPage() {
  return (
    <ComingSoonPage
      productName="Join Deep Code"
      title="Coming Soon"
      subheading="We're building something exciting."
      description="A community where developers, students and creators can learn, collaborate and build together."
      badge="GLOBAL DEVELOPER COMMUNITY"
      iconUrl="/branding/deepcode/logo.png"
      expectedLaunch="Coming Q4 2026"
    />
  );
}
