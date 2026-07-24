import React from "react";
import { AppCard } from "./AppCard";

export interface FeatureCardProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({
  icon,
  title,
  description,
  action,
  children,
  className = "",
}) => {
  return (
    <AppCard className={`p-8 sm:p-10 ${className}`}>
      <div className="flex flex-col items-center justify-center text-center max-w-lg mx-auto py-4 space-y-4">
        {icon && (
          <div className="w-14 h-14 rounded-[14px] bg-[#219EBC]/10 text-[#219EBC] flex items-center justify-center shadow-xs">
            {icon}
          </div>
        )}

        <div className="space-y-1.5">
          <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">
            {title}
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed">
            {description}
          </p>
        </div>

        {children}

        {action && <div className="pt-2">{action}</div>}
      </div>
    </AppCard>
  );
};
