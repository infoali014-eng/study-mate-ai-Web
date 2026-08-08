"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { CircleUserRound, Settings2, LogOut, ShieldCheck } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useUserProfile } from "@/hooks/useUserProfile";

export default function UserAvatarDropdown() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);
  const { profile, academic, getInitials } = useUserProfile();

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

  // Close on outside click or Escape
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const handleLogout = async () => {
    setIsOpen(false);
    await supabase.auth.signOut();
    router.push("/login");
  };

  const subtitle =
    academic.fieldOfStudy || academic.institution || (profile.username ? `@${profile.username}` : profile.email);

  return (
    <div className="relative" ref={popoverRef}>
      {/* Avatar Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-label="User profile menu"
        title={profile.displayName}
        className="w-9 h-9 rounded-[12px] bg-[#023047] text-white flex items-center justify-center font-extrabold text-xs hover:ring-2 hover:ring-[#219EBC] transition-all shadow-xs cursor-pointer select-none overflow-hidden"
      >
        {profile.avatarUrl ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={profile.avatarUrl}
            alt={profile.displayName}
            className="w-full h-full object-cover"
          />
        ) : (
          <span>{getInitials(profile.displayName)}</span>
        )}
      </button>

      {/* User Menu Popover */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -6 }}
            animate={{ opacity: 1, scale: 1, y: 4 }}
            exit={{ opacity: 0, scale: 0.95, y: -6 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="absolute right-0 top-full mt-1 w-56 bg-white border border-slate-200 rounded-[12px] shadow-xl p-2 z-50 select-none"
          >
            {/* User Info Header */}
            <div className="px-3 py-2 border-b border-slate-100 mb-1">
              <div className="text-xs font-extrabold text-slate-900 truncate">
                {profile.displayName}
              </div>
              <div className="text-[11px] font-semibold text-[#219EBC] truncate">
                {subtitle}
              </div>
            </div>

            {/* Menu Items */}
            <div className="space-y-0.5">
              {isAdmin && (
                <Link
                  href="/admin"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-[8px] text-xs font-black text-rose-700 bg-rose-50 hover:bg-rose-100 transition-colors mb-1"
                >
                  <ShieldCheck className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>Admin CMS Panel</span>
                </Link>
              )}

              <Link
                href="/dashboard/settings"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-[8px] text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-50 transition-colors"
              >
                <CircleUserRound className="w-4 h-4 text-slate-400" />
                <span>Profile</span>
              </Link>

              <Link
                href="/dashboard/settings"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-[8px] text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-50 transition-colors"
              >
                <Settings2 className="w-4 h-4 text-slate-400" />
                <span>Account Settings</span>
              </Link>

              <div className="h-px bg-slate-100 my-1" />

              <button
                type="button"
                onClick={handleLogout}
                className="flex items-center gap-2.5 w-full px-3 py-2 rounded-[8px] text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors text-left cursor-pointer"
              >
                <LogOut className="w-4 h-4 text-rose-500" />
                <span>Logout</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
