import React from "react";
import { AppCard } from "./AppCard";

export interface PageHeaderProps {
  badge?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  badge,
  title,
  description,
  action,
  className = "",
}) => {
  return (
    <AppCard className={`p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 select-none ${className}`}>
      <div className="space-y-1.5">
        {badge && <div className="mb-1">{badge}</div>}
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
          {title}
        </h1>
        {description && (
          <p className="text-sm text-slate-500 font-medium">{description}</p>
        )}
      </div>

      {action && <div className="shrink-0">{action}</div>}
    </AppCard>
  );
};
