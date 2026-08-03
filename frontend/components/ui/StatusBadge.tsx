import React from "react";
import { ProductStatus } from "@/types/admin.types";

interface StatusBadgeProps {
  status: ProductStatus | string;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className = "" }) => {
  const normalizedStatus = status.toLowerCase().replace(/[\s-]/g, "_");

  switch (normalizedStatus) {
    case "active":
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200/60 select-none ${className}`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Active
        </span>
      );

    case "coming_soon":
    case "comingsoon":
      return (
        <span
          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider bg-purple-50 text-purple-700 border border-purple-200/60 select-none ${className}`}
        >
          Coming Soon
        </span>
      );

    case "beta":
      return (
        <span
          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider bg-cyan-50 text-cyan-700 border border-cyan-200/60 select-none ${className}`}
        >
          Beta
        </span>
      );

    case "new":
      return (
        <span
          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider bg-rose-50 text-rose-700 border border-rose-200/60 select-none ${className}`}
        >
          New
        </span>
      );

    case "updated":
      return (
        <span
          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200/60 select-none ${className}`}
        >
          Updated
        </span>
      );

    case "maintenance":
      return (
        <span
          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider bg-amber-50 text-amber-700 border border-amber-200/60 select-none ${className}`}
        >
          Maintenance
        </span>
      );

    default:
      return (
        <span
          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider bg-slate-100 text-slate-700 border border-slate-200 select-none ${className}`}
        >
          {status}
        </span>
      );
  }
};
