"use client";

import React, { useState } from "react";
import Link from "next/link";
import { NavItem } from "@/config/dashboard-navigation";
import { motion } from "framer-motion";

interface SidebarItemProps {
  item: NavItem;
  active: boolean;
  collapsed: boolean;
  onClick?: () => void;
}

export default function SidebarItem({
  item,
  active,
  collapsed,
  onClick,
}: SidebarItemProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const Icon = item.icon;

  if (item.hidden) return null;

  const itemContent = (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.12 }}
      onMouseEnter={() => collapsed && setShowTooltip(true)}
      onMouseLeave={() => collapsed && setShowTooltip(false)}
      className={`relative flex items-center gap-3 px-3.5 py-2.5 rounded-[12px] text-xs font-semibold transition-colors duration-150 group select-none cursor-pointer ${
        active
          ? "bg-[#219EBC] text-white shadow-xs"
          : "text-[#8ECAE6] hover:bg-[#03405e] hover:text-white"
      } ${collapsed ? "justify-center px-0 w-11 h-11 mx-auto" : "w-full"}`}
    >
      {/* 1. Left Accent Bar when Active */}
      {active && (
        <span
          className={`absolute bg-[#FFB703] rounded-r-full transition-all duration-150 ${
            collapsed ? "left-0 top-2 bottom-2 w-1" : "left-0 top-2 bottom-2 w-1"
          }`}
        />
      )}

      {/* 2. Lucide Icon */}
      <Icon
        className={`w-4 h-4 shrink-0 transition-transform duration-120 group-hover:scale-110 ${
          active ? "text-white" : "text-[#8ECAE6] group-hover:text-white"
        }`}
      />

      {/* 3. Title Label */}
      {!collapsed && <span className="truncate flex-1">{item.title}</span>}

      {/* 4. Badges (e.g. "Soon") */}
      {!collapsed && item.badge && (
        <span className="ml-auto bg-[#FFB703] text-[#023047] text-[10px] font-extrabold px-1.5 py-0.5 rounded-full">
          {item.badge}
        </span>
      )}

      {/* 5. Floating Tooltip in Collapsed Mode */}
      {collapsed && showTooltip && (
        <div className="absolute left-14 bg-[#09090b] text-white text-xs font-semibold px-2.5 py-1 rounded-[6px] shadow-lg whitespace-nowrap z-50 pointer-events-none animate-in fade-in zoom-in-95 duration-120">
          {item.title}
          {item.badge && (
            <span className="ml-1.5 text-[9px] bg-[#FFB703] text-[#023047] px-1 rounded-full font-bold">
              {item.badge}
            </span>
          )}
        </div>
      )}
    </motion.div>
  );

  if (item.isComingSoon || item.href === "#") {
    return (
      <div
        onClick={onClick}
        tabIndex={0}
        role="button"
        aria-label={`${item.title} (Coming Soon)`}
        className="block"
      >
        {itemContent}
      </div>
    );
  }

  return (
    <Link
      href={item.href}
      onClick={onClick}
      aria-label={item.title}
      className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-[#219EBC] rounded-[12px]"
    >
      {itemContent}
    </Link>
  );
}
