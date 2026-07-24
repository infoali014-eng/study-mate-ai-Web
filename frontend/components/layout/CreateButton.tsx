"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, ChevronRight } from "lucide-react";
import { CREATE_MENU_OPTIONS } from "@/config/dashboard-navigation";

interface CreateButtonProps {
  collapsed?: boolean;
}

export default function CreateButton({ collapsed = false }: CreateButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState<{ top: number; left: number; width: number }>({
    top: 0,
    left: 0,
    width: 260,
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  const updateCoords = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      if (collapsed) {
        setCoords({
          top: rect.top,
          left: rect.right + 10,
          width: 280,
        });
      } else {
        setCoords({
          top: rect.bottom + 6,
          left: rect.left,
          width: Math.max(rect.width, 260),
        });
      }
    }
  };

  const handleToggle = () => {
    if (!isOpen) {
      updateCoords();
    }
    setIsOpen(!isOpen);
  };

  // Close on outside click, window resize, scroll, or Escape key
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        buttonRef.current &&
        buttonRef.current.contains(event.target as Node)
      ) {
        return;
      }
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    const handleScrollOrResize = () => {
      if (isOpen) {
        updateCoords();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
      window.addEventListener("resize", handleScrollOrResize);
      window.addEventListener("scroll", handleScrollOrResize, true);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("resize", handleScrollOrResize);
      window.removeEventListener("scroll", handleScrollOrResize, true);
    };
  }, [isOpen]);

  const dropdownContent = (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={dropdownRef}
          initial={{ opacity: 0, scale: 0.95, y: -6 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -6 }}
          transition={{ duration: 0.15, ease: "easeOut" }}
          style={{
            position: "fixed",
            top: coords.top,
            left: coords.left,
            width: coords.width,
            zIndex: 9999,
          }}
          className="bg-white text-slate-900 border border-slate-200 rounded-[12px] shadow-2xl p-2 select-none"
        >
          {/* Header label */}
          <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 mb-1">
            Create New
          </div>

          {/* Menu options */}
          <div className="space-y-0.5">
            {CREATE_MENU_OPTIONS.map((option) => {
              const Icon = option.icon;
              return (
                <Link
                  key={option.id}
                  href={option.href}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 p-2.5 rounded-[10px] hover:bg-slate-50 transition-colors duration-120 group cursor-pointer"
                >
                  {/* Option Icon */}
                  <div className="w-9 h-9 rounded-[8px] bg-slate-100 text-[#023047] group-hover:bg-[#219EBC] group-hover:text-white flex items-center justify-center shrink-0 transition-colors duration-120">
                    <Icon className="w-4 h-4" />
                  </div>

                  {/* Option Title & Subtitle */}
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold text-slate-900 group-hover:text-[#219EBC] transition-colors duration-120 truncate">
                      {option.title}
                    </div>
                    <div className="text-[11px] text-slate-400 truncate">
                      {option.description}
                    </div>
                  </div>

                  <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-[#219EBC] transition-colors duration-120 shrink-0" />
                </Link>
              );
            })}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <div className="w-full">
      {/* 1. Main "+ Create" Button */}
      <button
        ref={buttonRef}
        type="button"
        onClick={handleToggle}
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label="Create new item"
        className={`w-full flex items-center justify-center gap-2.5 px-4 py-2.5 bg-[#FB8500] hover:bg-[#e07700] active:scale-[0.98] text-white font-bold text-sm rounded-[12px] shadow-sm transition-all duration-120 cursor-pointer ${
          collapsed ? "px-0 w-11 h-11 mx-auto" : ""
        }`}
        title={collapsed ? "Create new study item" : undefined}
      >
        <Plus className={`w-5 h-5 shrink-0 transition-transform duration-180 ${isOpen ? "rotate-45" : ""}`} />
        {!collapsed && <span>Create</span>}
      </button>

      {/* 2. Portal-rendered Dropdown floating at fixed Z-INDEX above everything */}
      {mounted ? createPortal(dropdownContent, document.body) : null}
    </div>
  );
}
