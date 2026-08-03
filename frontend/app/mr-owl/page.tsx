import React from "react";
import { ComingSoonPage } from "@/components/landing/ComingSoonPage";

export const metadata = {
  title: "Mr Owl AI - Coming Soon | Deep Code",
  description: "We're building an intelligent AI learning assistant designed to transform the way students study.",
};

export default function MrOwlComingSoonPage() {
  return (
    <ComingSoonPage
      productName="Mr Owl AI"
      title="Coming Soon"
      subheading="We're building something exciting."
      description="We're building an intelligent AI learning assistant designed to transform the way students study."
      badge="AI STUDY TUTOR"
      iconUrl="/branding/mrowl/logo.png"
      expectedLaunch="Coming Q3 2026"
    />
  );
}
