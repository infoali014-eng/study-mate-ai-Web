import React from "react";
import { ComingSoonPage } from "@/components/landing/ComingSoonPage";

export const metadata = {
  title: "Coming Soon | Deep Code",
  description: "This experience is currently under development and will be available soon.",
};

export default function GenericComingSoonPage() {
  return (
    <ComingSoonPage
      productName="Deep Code Feature"
      title="Coming Soon"
      subheading="We're building something exciting."
      description="This experience is currently under development and will be available soon."
      badge="UNDER DEVELOPMENT"
    />
  );
}
