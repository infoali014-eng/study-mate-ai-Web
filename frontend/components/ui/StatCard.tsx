import React from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { AppCard } from "./AppCard";

export interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: React.ReactNode;
  description?: string;
  href?: string;
  variant?: "primary" | "warning" | "success" | "neutral";
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  icon,
  title,
  value,
  description,
  href,
  variant = "primary",
  className = "",
}) => {
  const iconBgStyles = {
    primary: "bg-[#219EBC]/10 text-[#219EBC]",
    warning: "bg-[#FFB703]/20 text-[#FB8500]",
    success: "bg-[#FB8500]/10 text-[#FB8500]",
    neutral: "bg-slate-100 text-slate-600",
  };

  const cardContent = (
    <AppCard
      variant={href ? "interactive" : "default"}
      className={`p-5 flex flex-col justify-between space-y-3 group ${className}`}
    >
      <div className="flex items-center justify-between">
        <div className={`w-10 h-10 rounded-[10px] flex items-center justify-center shrink-0 ${iconBgStyles[variant]}`}>
          {icon}
        </div>
        {href && (
          <ArrowUpRight className="w-4 h-4 text-slate-300 group-hover:text-[#219EBC] transition-colors" />
        )}
      </div>

      <div className="space-y-1">
        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          {title}
        </div>
        <div className="text-sm font-extrabold text-slate-900 group-hover:text-[#219EBC] transition-colors">
          {value}
        </div>
        {description && (
          <div className="text-[11px] text-slate-500 font-medium">
            {description}
          </div>
        )}
      </div>
    </AppCard>
  );

  if (href) {
    return (
      <Link href={href} className="block focus:outline-none">
        {cardContent}
      </Link>
    );
  }

  return cardContent;
};
