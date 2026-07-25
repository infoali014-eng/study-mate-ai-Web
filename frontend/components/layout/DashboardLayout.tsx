"use client";

import React from "react";
import { useLayoutStore } from "@/store/layoutStore";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import MainContent from "./MainContent";
import FloatingOwl from "@/components/owl/FloatingOwl";

interface DashboardLayoutProps {
  children: React.ReactNode;
  title?: string;
}

export default function DashboardLayout({
  children,
  title,
}: DashboardLayoutProps) {
  const {
    sidebarCollapsed,
    mobileDrawerOpen,
    toggleSidebar,
    toggleMobileDrawer,
    setMobileDrawerOpen,
  } = useLayoutStore();

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col antialiased text-slate-900">
      {/* 1. Sidebar (Desktop Permanent + Mobile Drawer) */}
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggleCollapse={toggleSidebar}
        mobileOpen={mobileDrawerOpen}
        onMobileClose={() => setMobileDrawerOpen(false)}
      />

      {/* 2. Main Layout Area (Shifted according to sidebar collapse) */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ease-in-out ${
          sidebarCollapsed ? "md:pl-20" : "md:pl-64"
        }`}
      >
        {/* Topbar Navigation */}
        <Topbar
          onMobileMenuToggle={toggleMobileDrawer}
          isCollapsed={sidebarCollapsed}
          onToggleCollapse={toggleSidebar}
          title={title}
        />

        {/* Main Content Area */}
        <MainContent>{children}</MainContent>
      </div>

      {/* Mr Owl — floating suggestion widget */}
      <FloatingOwl />
    </div>
  );
}
