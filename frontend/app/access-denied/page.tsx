"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Lock, Sparkles, LogOut, ArrowLeft, ShieldAlert } from "lucide-react";
import { supabase } from "@/lib/supabase/client";

export default function AccessDeniedPage() {
  const router = useRouter();
  const [roleInfo, setRoleInfo] = useState<{ email: string; role: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRole() {
      try {
        const res = await fetch("/api/user/role");
        if (res.ok) {
          const data = await res.json();
          setRoleInfo({ email: data.email || "", role: data.role || "student" });
          if (data.hasBuddyAccess) {
            router.replace("/dashboard");
          }
        }
      } catch (err) {
        console.error("Error fetching user role:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchRole();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace("/login");
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-6 text-center select-none">
      <div className="bg-white border border-slate-200/90 shadow-2xl rounded-[24px] p-8 max-w-lg w-full space-y-6 animate-fade-in relative overflow-hidden">
        {/* Top Decorative Banner */}
        <div className="h-2 bg-gradient-to-r from-amber-500 via-[#219EBC] to-[#023047] absolute top-0 inset-x-0" />

        {/* Lock Icon */}
        <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center mx-auto text-amber-600 shadow-2xs mt-2">
          <Lock className="w-8 h-8" />
        </div>

        {/* Title & Description */}
        <div className="space-y-2">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-extrabold bg-amber-100/70 text-amber-900 border border-amber-300">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-600" /> Private Access Mode
          </span>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            StudyMate AI Access Restricted
          </h1>
          <p className="text-xs text-slate-500 font-medium leading-relaxed max-w-md mx-auto">
            You are currently logged in, but your account has not been assigned the <strong className="text-slate-900">Buddy</strong> role by an administrator.
          </p>
        </div>

        {/* Status Box */}
        <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-[16px] text-left text-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-slate-500 font-medium">Logged in as:</span>
            <span className="font-mono text-slate-900 font-bold truncate max-w-[200px]">
              {roleInfo?.email || "Authenticated User"}
            </span>
          </div>
          <div className="flex items-center justify-between border-t border-slate-200/60 pt-2">
            <span className="text-slate-500 font-medium">Database Role:</span>
            <span className="px-2.5 py-0.5 rounded-md bg-amber-100 text-amber-900 font-extrabold text-[11px] uppercase tracking-wider">
              {loading ? "..." : roleInfo?.role || "STUDENT"}
            </span>
          </div>
        </div>

        {/* Instructions */}
        <div className="p-4 bg-sky-50/70 border border-sky-200/80 rounded-[16px] text-xs text-sky-950 text-left font-medium space-y-1">
          <div className="font-extrabold text-[#023047] flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-[#219EBC]" /> How to unlock access:
          </div>
          <p className="text-slate-600 leading-snug">
            Contact your system administrator and request them to mark your account as a <strong className="text-slate-900">Buddy 🤝</strong> in the Admin Panel Directory.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
          <Link
            href="/"
            className="w-full sm:w-1/2 flex items-center justify-center gap-2 py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-xs rounded-[12px] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="w-full sm:w-1/2 flex items-center justify-center gap-2 py-3 px-4 bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs rounded-[12px] transition-colors shadow-xs cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Log Out</span>
          </button>
        </div>
      </div>
    </div>
  );
}
