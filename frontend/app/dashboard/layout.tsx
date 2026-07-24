import React from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";

export const metadata = {
  title: "Dashboard - Mr Owl AI",
  description: "Your personalized AI study workspace",
};

export default function AppDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
