"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAdminStore } from "@/store/adminStore";

interface AdminLayoutClientProps {
  children: React.ReactNode;
}

export const AdminLayoutClient: React.FC<AdminLayoutClientProps> = ({ children }) => {
  const { activeTab, setActiveTab } = useAdminStore();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: "📊", comingSoon: false },
    { id: "homepage", label: "Homepage", icon: "🏠", comingSoon: false },
    { id: "courses", label: "Courses", icon: "📚", comingSoon: false },
    { id: "media", label: "Media Library", icon: "📁", comingSoon: false },
    { id: "owl", label: "Mr Owl AI", icon: "🦉", comingSoon: true },
    { id: "community", label: "Join Deep Code", icon: "👥", comingSoon: true },
    { id: "users", label: "Users", icon: "👤", comingSoon: true },
    { id: "settings", label: "Settings", icon: "⚙️", comingSoon: true },
  ] as const;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row text-slate-900 select-text">
      {/* Mobile Header */}
      <header className="md:hidden w-full h-16 border-b border-slate-200 bg-white flex items-center justify-between px-6 shrink-0 z-40 select-none">
        <div className="flex items-center gap-3">
          <img
            src="/branding/deepcode/logo.png"
            alt="Deep Code logo"
            className="h-7 w-auto object-contain"
            draggable={false}
          />
          <span className="font-black text-base tracking-tight">Deep Code</span>
          <span className="bg-rose-100 text-rose-700 text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase">
            Admin
          </span>
        </div>
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="text-slate-600 hover:text-slate-900 focus:outline-hidden"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isMobileOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </header>

      {/* Sidebar Sidebar */}
      <aside
        className={`fixed md:sticky top-16 md:top-0 left-0 bottom-0 w-64 border-r border-slate-200/80 bg-white shadow-xs p-6 flex flex-col justify-between shrink-0 z-30 transition-transform duration-200 md:translate-x-0 ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="space-y-8 select-none">
          {/* Logo Brand Header */}
          <div className="hidden md:flex items-center gap-3">
            <img
              src="/branding/deepcode/logo.png"
              alt="Deep Code logo"
              className="h-8 w-auto object-contain"
              draggable={false}
            />
            <div className="flex flex-col">
              <span className="font-black text-lg tracking-tight leading-none text-slate-900">
                Deep Code
              </span>
              <span className="text-[10px] font-bold text-rose-600 uppercase tracking-widest mt-1">
                CMS Panel
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsMobileOpen(false);
                }}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all duration-150 cursor-pointer ${
                  activeTab === item.id
                    ? "bg-[#219EBC] text-white shadow-xs scale-102"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-base">{item.icon}</span>
                  <span>{item.label}</span>
                </div>
                {item.comingSoon && (
                  <span className={`text-[8px] font-bold uppercase px-1.5 py-0.5 rounded ${
                    activeTab === item.id ? "bg-white/20 text-white" : "bg-slate-100 text-slate-400"
                  }`}>
                    Soon
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Footer Actions */}
        <div className="pt-6 border-t border-slate-100 space-y-4">
          <Link
            href="/"
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-slate-200 text-slate-600 hover:text-slate-900 hover:border-slate-350 text-xs sm:text-sm font-bold transition-colors select-none"
          >
            ← Exit to Site
          </Link>
          <div className="text-center text-[10px] text-slate-400 font-semibold uppercase tracking-wider select-none">
            Security Zone
          </div>
        </div>
      </aside>

      {/* Main Admin Content View Frame */}
      <main className="flex-grow p-6 sm:p-10 lg:p-12 overflow-y-auto max-w-7xl mx-auto w-full">
        {children}
      </main>
    </div>
  );
};
