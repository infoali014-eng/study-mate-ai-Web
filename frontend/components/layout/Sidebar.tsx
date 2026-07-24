"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X } from "lucide-react";
import { DASHBOARD_NAVIGATION } from "@/config/dashboard-navigation";
import Logo from "./Logo";
import CreateButton from "./CreateButton";
import SidebarSection from "./SidebarSection";
import SidebarItem from "./SidebarItem";
import SidebarProfile from "./SidebarProfile";
import SidebarFooter from "./SidebarFooter";

interface SidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
}

export default function Sidebar({
  collapsed,
  onToggleCollapse,
  mobileOpen,
  onMobileClose,
}: SidebarProps) {
  const pathname = usePathname();

  const renderNavContent = (isMobile: boolean = false) => {
    const isCollapsed = isMobile ? false : collapsed;

    return (
      <div className="flex flex-col h-full bg-[#023047] text-white select-none overflow-x-hidden">
        {/* 1. Logo Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-[#03405e] shrink-0">
          <Logo collapsed={isCollapsed} variant="sidebar" />
          {isMobile && (
            <button
              type="button"
              onClick={onMobileClose}
              className="p-1.5 text-[#8ECAE6] hover:text-white hover:bg-[#03405e] rounded-[10px] transition-colors cursor-pointer"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* 2. Top Action Controls: Search Hint & + Create Button */}
        <div className="p-3 space-y-2.5 border-b border-[#03405e]/50">
          {/* Search Shortcut Hint Button */}
          <button
            type="button"
            className={`w-full flex items-center justify-between gap-2 px-3 py-2 bg-[#03405e]/60 hover:bg-[#03405e] border border-[#03405e] rounded-[12px] text-xs text-[#8ECAE6] hover:text-white transition-colors cursor-pointer ${
              isCollapsed ? "justify-center px-0 w-11 h-10 mx-auto" : ""
            }`}
            title={isCollapsed ? "Search workspace" : undefined}
          >
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4 text-[#8ECAE6] shrink-0" />
              {!isCollapsed && <span>Search...</span>}
            </div>
          </button>

          {/* Canva-Style + Create Button */}
          <CreateButton collapsed={isCollapsed} />
        </div>

        {/* 3. Navigation Sections (Main, Tools, System) */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-4 custom-scrollbar">
          {DASHBOARD_NAVIGATION.map((section, idx) => (
            <React.Fragment key={section.id}>
              {idx > 0 && <div className="h-px bg-[#03405e]/40 my-2 mx-1" />}
              <SidebarSection title={section.title} collapsed={isCollapsed}>
                {section.items.map((item) => {
                  const isActive =
                    pathname === item.href ||
                    (item.href !== "/dashboard" && pathname.startsWith(item.href));

                  return (
                    <SidebarItem
                      key={item.id}
                      item={item}
                      active={isActive}
                      collapsed={isCollapsed}
                      onClick={isMobile ? onMobileClose : undefined}
                    />
                  );
                })}
              </SidebarSection>
            </React.Fragment>
          ))}
        </div>

        {/* 4. Bottom Section: Profile Summary & Collapse Control */}
        <div className="border-t border-[#03405e] p-2 space-y-1">
          <SidebarProfile collapsed={isCollapsed} />
          <SidebarFooter
            collapsed={isCollapsed}
            onToggleCollapse={onToggleCollapse}
          />
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Permanent Desktop Sidebar with 250ms Framer Motion Width Transition */}
      <motion.aside
        initial={false}
        animate={{ width: collapsed ? 80 : 256 }}
        transition={{ duration: 0.25, ease: "easeInOut" }}
        className="hidden md:block fixed top-0 left-0 z-30 h-screen border-r border-[#03405e] overflow-hidden"
      >
        {renderNavContent(false)}
      </motion.aside>

      {/* Mobile Drawer Overlay Sheet */}
      <AnimatePresence>
        {mobileOpen && (
          <div className="md:hidden fixed inset-0 z-50 flex">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs"
              onClick={onMobileClose}
            />

            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.22, ease: "easeInOut" }}
              className="relative z-10 w-72 max-w-[85vw] h-full shadow-2xl"
            >
              {renderNavContent(true)}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
