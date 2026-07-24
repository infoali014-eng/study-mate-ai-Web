"use client";

import React, { useState } from "react";
import { CircleUserRound, LogOut, Settings2, ChevronUp } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

interface SidebarProfileProps {
  collapsed?: boolean;
}

export default function SidebarProfile({ collapsed = false }: SidebarProfileProps) {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <div className="relative w-full">
      {/* Profile Card Trigger */}
      <button
        type="button"
        onClick={() => setMenuOpen(!menuOpen)}
        className={`w-full flex items-center gap-3 p-2.5 rounded-[12px] hover:bg-[#03405e] transition-colors duration-120 text-left select-none cursor-pointer group ${
          collapsed ? "justify-center px-0" : ""
        }`}
        title={collapsed ? "Ali Shair (CS Student)" : undefined}
      >
        {/* User Avatar */}
        <div className="relative w-9 h-9 rounded-[10px] bg-[#219EBC] text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-xs">
          <CircleUserRound className="w-5 h-5 text-white" />
          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#FFB703] border-2 border-[#023047] rounded-full" />
        </div>

        {/* User Name & Subtitle */}
        {!collapsed && (
          <div className="flex-1 min-w-0">
            <div className="text-xs font-bold text-white truncate">Ali Shair</div>
            <div className="text-[11px] text-[#8ECAE6] truncate">CS Student</div>
          </div>
        )}

        {!collapsed && (
          <ChevronUp
            className={`w-4 h-4 text-[#8ECAE6] group-hover:text-white transition-transform duration-150 ${
              menuOpen ? "rotate-180" : ""
            }`}
          />
        )}
      </button>

      {/* Quick Profile Actions Popover */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.95 }}
            animate={{ opacity: 1, y: -8, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className={`absolute z-50 bg-[#023047] text-white border border-[#03405e] rounded-[12px] shadow-2xl p-1.5 min-w-[200px] ${
              collapsed ? "left-14 bottom-0" : "bottom-full left-0 w-full"
            }`}
          >
            <Link
              href="/settings"
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-[8px] text-xs font-semibold text-[#8ECAE6] hover:text-white hover:bg-[#03405e] transition-colors"
            >
              <Settings2 className="w-4 h-4" />
              <span>Account Settings</span>
            </Link>

            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-2.5 w-full px-3 py-2 rounded-[8px] text-xs font-semibold text-rose-300 hover:text-white hover:bg-rose-900/40 transition-colors text-left cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
