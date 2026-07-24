import React from "react";

export interface AppCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "flat" | "bordered" | "interactive";
  hoverable?: boolean;
  children: React.ReactNode;
}

export const AppCard = React.forwardRef<HTMLDivElement, AppCardProps>(
  (
    {
      variant = "default",
      hoverable = false,
      children,
      className = "",
      onClick,
      ...props
    },
    ref
  ) => {
    const variantStyles = {
      default: "bg-white border border-slate-200/80 shadow-xs",
      flat: "bg-slate-50 border border-slate-100",
      bordered: "bg-white border-2 border-slate-200",
      interactive:
        "bg-white border border-slate-200/80 hover:border-[#219EBC] shadow-xs hover:shadow-md cursor-pointer transition-all duration-150",
    };

    const hoverStyle = hoverable
      ? "hover:border-[#219EBC] hover:shadow-md transition-all duration-150 cursor-pointer"
      : "";

    return (
      <div
        ref={ref}
        onClick={onClick}
        className={`rounded-[12px] p-6 select-none ${variantStyles[variant]} ${hoverStyle} ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);

AppCard.displayName = "AppCard";
