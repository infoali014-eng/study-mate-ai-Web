import React from "react";
import Link from "next/link";

interface LogoProps {
  collapsed?: boolean;
  variant?: "sidebar" | "light" | "dark";
  className?: string;
}

export function MrOwlLogoIcon({ className = "w-8 h-8", size = 32 }: { className?: string; size?: number }) {
  return (
    <img
      src="/logo.png"
      alt="Mr Owl AI Logo"
      width={size}
      height={size}
      className={`object-contain shrink-0 ${className}`}
    />
  );
}

export default function Logo({
  collapsed = false,
  variant = "sidebar",
  className = "",
}: LogoProps) {
  const isSidebar = variant === "sidebar";
  const textColor = isSidebar
    ? "text-white"
    : variant === "dark"
    ? "text-white"
    : "text-slate-900";

  return (
    <Link
      href="/dashboard"
      className={`inline-flex items-center gap-3 group focus:outline-none ${className}`}
      aria-label="Mr Owl AI Home"
    >
      {/* Exact Brand Logo PNG Image - No Box, No Background Color Changes */}
      <img
        src="/logo.png"
        alt="Mr Owl AI Logo"
        className="w-9 h-9 object-contain shrink-0 transition-transform group-hover:scale-105"
      />

      {/* Brand Text (Hidden when sidebar is collapsed) */}
      {!collapsed && (
        <div className="flex items-center gap-1.5 overflow-hidden whitespace-nowrap">
          <span className={`font-extrabold text-lg tracking-tight ${textColor}`}>
            Mr Owl
          </span>
          <span className="bg-[#00B4D8] text-white text-[10px] font-extrabold px-1.5 py-0.5 rounded-[6px] tracking-wider uppercase">
            AI
          </span>
        </div>
      )}
    </Link>
  );
}
