"use client";

import React, { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useOwlStore } from "@/store/owlStore";
import { OWL_MESSAGES } from "@/components/owl/owlMessages";
import AuthCard from "@/components/auth/AuthCard";

import { MrOwlLogoIcon } from "@/components/layout/Logo";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  const pathname = usePathname();
  const say = useOwlStore((s) => s.say);
  const setAnimState = useOwlStore((s) => s.setAnimState);

  // Entrance and routing greeting sequence
  useEffect(() => {
    setAnimState("fly-in");
    
    const timer = setTimeout(() => {
      const greeting = pathname.includes("/signup")
        ? OWL_MESSAGES.signupGreet
        : OWL_MESSAGES.loginGreet;
      
      say(greeting.text, greeting.mood);
    }, 900);

    return () => clearTimeout(timer);
  }, [pathname, say, setAnimState]);

  // 45-second user idle timer
  useEffect(() => {
    let idleTimer: NodeJS.Timeout;

    const resetIdleTimer = () => {
      if (idleTimer) clearTimeout(idleTimer);
      idleTimer = setTimeout(() => {
        say(OWL_MESSAGES.idleTimeout.text, OWL_MESSAGES.idleTimeout.mood);
      }, 45000);
    };

    const events = ["mousemove", "keydown", "click", "scroll", "focus", "touchstart"];
    
    events.forEach((event) => {
      window.addEventListener(event, resetIdleTimer);
    });

    resetIdleTimer();

    return () => {
      if (idleTimer) clearTimeout(idleTimer);
      events.forEach((event) => {
        window.removeEventListener(event, resetIdleTimer);
      });
    };
  }, [say]);

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-12 bg-background transition-colors duration-300">
      
      {/* Left Column: Premium Branded Panel (Desktop Only) */}
      <div className="hidden lg:flex lg:col-span-5 relative flex-col justify-between p-12 overflow-hidden bg-radial from-neutral-900 via-zinc-950 to-black border-r border-neutral-800">
        {/* Glow Mesh Gradient Effects */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_800px_at_50px_200px,rgba(79,70,229,0.15),transparent)] pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_600px_at_bottom_right,rgba(139,92,246,0.1),transparent)] pointer-events-none" />

        {/* Logo and Wordmark */}
        <div className="relative flex items-center gap-3 z-10 select-none">
          <img src="/logo.png" alt="Mr Owl AI Logo" className="w-10 h-10 object-contain shrink-0" />
          <span className="text-xl font-bold tracking-tight text-white">Mr Owl AI</span>
        </div>

        {/* Branding Value Prop */}
        <div className="relative my-auto z-10 max-w-md">
          <h1 className="text-4xl font-extrabold tracking-tight text-white leading-tight">
            Turn your notes into a study roadmap.
          </h1>
          <p className="mt-4 text-base text-neutral-400 font-medium">
            Learn Smarter. Revise Faster. Prepare Better.
          </p>
        </div>

        {/* Footer info */}
        <div className="relative z-10 text-xs text-neutral-500 font-medium">
          &copy; {new Date().getFullYear()} Mr Owl AI. All rights reserved.
        </div>
      </div>

      {/* Right Column: Centered Auth Zone */}
      <div className="col-span-1 lg:col-span-7 flex flex-col items-center justify-center p-6 lg:p-12 relative overflow-y-auto">
        {/* Condensed Logo for Mobile/Tablet */}
        <div className="lg:hidden flex items-center gap-2 mb-8 select-none">
          <img src="/logo.png" alt="Mr Owl AI Logo" className="w-8 h-8 object-contain shrink-0" />
          <span className="text-lg font-bold tracking-tight text-foreground">Mr Owl AI</span>
        </div>

        {/* Wrap form card with Mr. Owl and speech bubble rendering */}
        <AuthCard>{children}</AuthCard>
      </div>

    </div>
  );
}
