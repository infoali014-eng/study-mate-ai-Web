import React from "react";

export interface DashboardGridProps {
  cols?: 1 | 2 | 3 | 4 | "2-to-1";
  gap?: "sm" | "md" | "lg";
  children: React.ReactNode;
  className?: string;
}

export const DashboardGrid: React.FC<DashboardGridProps> = ({
  cols = 3,
  gap = "md",
  children,
  className = "",
}) => {
  const colStyles = {
    1: "grid-cols-1",
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
    "2-to-1": "grid-cols-1 lg:grid-cols-3",
  };

  const gapStyles = {
    sm: "gap-3",
    md: "gap-4 sm:gap-6",
    lg: "gap-6 sm:gap-8",
  };

  return (
    <div className={`grid ${colStyles[cols]} ${gapStyles[gap]} ${className}`}>
      {children}
    </div>
  );
};
