"use client";

import React from "react";
import * as RadixAvatar from "@radix-ui/react-avatar";
import { User } from "lucide-react";

export interface AvatarProps {
  src?: string;
  alt?: string;
  name?: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  statusDot?: boolean;
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  alt = "User Avatar",
  name,
  size = "md",
  className = "",
  statusDot = false,
}) => {
  const sizeStyles = {
    sm: "w-7 h-7 text-xs rounded-[8px]",
    md: "w-9 h-9 text-sm rounded-[12px]",
    lg: "w-11 h-11 text-base rounded-[12px]",
    xl: "w-14 h-14 text-lg rounded-[16px]",
  };

  const getInitials = (nameStr?: string) => {
    if (!nameStr) return "";
    const parts = nameStr.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
  };

  const initials = getInitials(name);

  return (
    <div className="relative inline-block shrink-0">
      <RadixAvatar.Root
        className={`relative inline-flex items-center justify-center overflow-hidden bg-[#023047] text-white font-bold select-none shadow-xs ${sizeStyles[size]} ${className}`}
      >
        <RadixAvatar.Image
          src={src}
          alt={alt}
          className="w-full h-full object-cover"
        />
        <RadixAvatar.Fallback
          delayMs={100}
          className="w-full h-full flex items-center justify-center bg-[#023047] text-[#8ECAE6] font-bold"
        >
          {initials || <User className="w-1/2 h-1/2 text-[#8ECAE6]" />}
        </RadixAvatar.Fallback>
      </RadixAvatar.Root>

      {statusDot && (
        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#FFB703] border-2 border-white rounded-full" />
      )}
    </div>
  );
};
