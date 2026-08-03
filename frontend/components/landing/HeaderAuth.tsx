"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { DBHomepageNavItem } from "@/types/admin.types";

interface HeaderAuthProps {
  userEmail: string | null;
  isAdmin: boolean;
  navItems?: DBHomepageNavItem[];
}

export const HeaderAuth: React.FC<HeaderAuthProps> = ({ userEmail, isAdmin, navItems = [] }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const activeNavItems = navItems
    .filter((item) => !item.is_hidden)
    .sort((a, b) => a.order - b.order);

  const handleLogout = async () => {
    setLoading(true);
    try {
      await supabase.auth.signOut();
      router.refresh();
    } catch (err) {
      console.error("Error logging out:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Center Navigation Links (Desktop) */}
      <nav className="hidden md:flex items-center gap-8">
        {activeNavItems.map((item) => (
          <Link
            key={item.id}
            href={item.url}
            className="text-sm font-semibold text-slate-600 hover:text-slate-950 transition-colors duration-200"
          >
            {item.label}
          </Link>
        ))}
      </nav>

      {/* Right Controls (Desktop) */}
      <div className="hidden md:flex items-center gap-4">
        {userEmail ? (
          <>
            <span className="text-xs text-slate-500 font-medium truncate max-w-[150px]">
              {isAdmin ? "Admin" : userEmail}
            </span>
            <Link
              href={isAdmin ? "/admin" : "/dashboard"}
              className="bg-slate-900 text-white text-xs sm:text-sm font-bold px-4.5 py-2.5 rounded-xl hover:bg-slate-800 transition-all duration-200 shadow-xs"
            >
              Workspace
            </Link>
            <button
              onClick={handleLogout}
              disabled={loading}
              className="text-slate-500 hover:text-slate-900 text-xs sm:text-sm font-bold transition-colors cursor-pointer disabled:opacity-50"
            >
              {loading ? "..." : "Log Out"}
            </button>
          </>
        ) : (
          <>
            <Link
              href="/login"
              className="text-slate-600 hover:text-slate-950 text-sm font-semibold px-3 py-2 transition-colors"
            >
              Log In
            </Link>
            <Link
              href="/signup"
              className="bg-slate-900 text-white text-sm font-bold px-5 py-2.5 rounded-xl hover:bg-slate-800 transition-all duration-200 shadow-xs"
            >
              Get Started
            </Link>
          </>
        )}
      </div>

      {/* Mobile Hamburger Button */}
      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="md:hidden p-2 text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
        aria-label="Toggle Navigation Menu"
      >
        {mobileMenuOpen ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        )}
      </button>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-x-0 top-16 bg-white/95 backdrop-blur-md border-b border-slate-200/80 p-6 space-y-5 z-40 md:hidden animate-fade-in shadow-lg">
          <div className="flex flex-col space-y-4">
            {activeNavItems.map((item) => (
              <Link
                key={item.id}
                href={item.url}
                onClick={() => setMobileMenuOpen(false)}
                className="text-base font-bold text-slate-800 hover:text-[#219EBC] transition-colors py-1"
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="pt-4 border-t border-slate-100 flex flex-col gap-3">
            {userEmail ? (
              <>
                <Link
                  href={isAdmin ? "/admin" : "/dashboard"}
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full bg-slate-900 text-white text-center font-bold py-3 rounded-xl hover:bg-slate-800 transition-colors"
                >
                  Workspace
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-center text-slate-600 font-bold py-2 hover:text-slate-900 transition-colors"
                >
                  Log Out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center border border-slate-200 text-slate-800 font-bold py-2.5 rounded-xl hover:bg-slate-50 transition-colors"
                >
                  Log In
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center bg-slate-900 text-white font-bold py-2.5 rounded-xl hover:bg-slate-800 transition-colors shadow-xs"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};
