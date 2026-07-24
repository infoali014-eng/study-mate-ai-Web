import React from "react";
import { AppCard } from "./AppCard";

export interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
  className = "",
}) => {
  return (
    <AppCard className={`p-6 sm:p-8 ${className}`}>
      <div className="flex flex-col items-center justify-center text-center max-w-md mx-auto py-6 space-y-3">
        <div className="w-12 h-12 rounded-[12px] bg-slate-100 text-slate-500 flex items-center justify-center shadow-xs">
          {icon}
        </div>

        <div className="space-y-1.5">
          <h3 className="text-sm font-bold text-slate-900">{title}</h3>
          <p className="text-xs text-slate-500 font-medium leading-relaxed">
            {description}
          </p>
        </div>

        {action && <div className="pt-2">{action}</div>}
      </div>
    </AppCard>
  );
};
