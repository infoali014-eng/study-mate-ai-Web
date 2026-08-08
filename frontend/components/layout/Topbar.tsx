"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Menu,
  Search,
  PanelLeftOpen,
  PanelLeftClose,
  ShieldCheck,
} from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import Breadcrumb from "./Breadcrumb";
import SearchModal from "./SearchModal";
import NotificationsDropdown from "./NotificationsDropdown";
import UserAvatarDropdown from "./UserAvatarDropdown";
import StreakButton from "@/features/streak/components/StreakButton";

interface TopbarProps {
  onMobileMenuToggle: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  title?: string;
}

export default function Topbar({
  onMobileMenuToggle,
  isCollapsed,
  onToggleCollapse,
  title,
}: TopbarProps) {
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        const role = user.user_metadata?.role || user.app_metadata?.role;
        if (role === "admin") {
          setIsAdmin(true);
        }
      }
    });
  }, []);

  // Listen for global Cmd+K or Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchModalOpen((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      <header className="sticky top-0 z-20 h-16 bg-[#F8FAFC] border-b border-slate-200/80 shadow-xs flex items-center justify-between px-4 sm:px-6 select-none">
        {/* Left Area: Mobile/Collapse Toggles & Breadcrumbs */}
        <div className="flex items-center gap-3">
          {/* Mobile Drawer Trigger */}
          <button
            type="button"
            onClick={onMobileMenuToggle}
            className="md:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 rounded-[12px] transition-colors cursor-pointer"
            aria-label="Open navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Desktop Sidebar Collapse Toggle */}
          <button
            type="button"
            onClick={onToggleCollapse}
            className="hidden md:flex p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-200/60 rounded-[12px] transition-colors cursor-pointer"
            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? (
              <PanelLeftOpen className="w-5 h-5" />
            ) : (
              <PanelLeftClose className="w-5 h-5" />
            )}
          </button>

          {/* Breadcrumbs Navigation */}
          <div className="hidden sm:block">
            <Breadcrumb items={title ? [{ label: title }] : []} />
          </div>
        </div>

        {/* Right Area: Search, Duolingo Streak, Notifications & Avatar Dropdown */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* 1. Global Search Button Trigger */}
          <button
            type="button"
            onClick={() => setSearchModalOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 hover:border-slate-300 text-slate-400 hover:text-slate-600 rounded-[12px] text-xs font-medium transition-all shadow-xs cursor-pointer"
            title="Search notes, chats, quizzes..."
          >
            <Search className="w-4 h-4 text-slate-400" />
            <span className="hidden md:inline text-slate-400 font-normal">
              Search notes, chats, quizzes...
            </span>
          </button>

          {/* 2. Production Duolingo-Inspired Streak Button & Popover */}
          <StreakButton />

          {/* 3. Notifications Button & Dropdown */}
          <NotificationsDropdown />

          {/* 4. Admin Panel Switcher (Only visible to admin users) */}
          {isAdmin && (
            <Link
              href="/admin"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#023047] hover:bg-[#03405e] text-[#38BDF8] border border-[#38BDF8]/40 rounded-[12px] text-xs font-black transition-all shadow-xs shrink-0"
              title="Return to Deep Code Admin CMS"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#38BDF8]" />
              <span className="hidden sm:inline">Admin Panel</span>
            </Link>
          )}

          {/* 5. User Avatar & Menu Dropdown */}
          <div className="pl-1 border-l border-slate-200 ml-1">
            <UserAvatarDropdown />
          </div>
        </div>
      </header>

      {/* Global Search Overlay Modal */}
      <SearchModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
      />
    </>
  );
}
