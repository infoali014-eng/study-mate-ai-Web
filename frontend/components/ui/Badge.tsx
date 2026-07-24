import React from "react";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "primary" | "secondary" | "warning" | "success" | "neutral";
  size?: "sm" | "md";
  icon?: React.ReactNode;
  children: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = "primary",
  size = "md",
  icon,
  children,
  className = "",
  ...props
}) => {
  const variantStyles = {
    primary: "bg-[#219EBC]/10 text-[#219EBC] border border-[#219EBC]/20",
    secondary: "bg-[#8ECAE6]/20 text-[#023047] border border-[#8ECAE6]/40",
    warning: "bg-[#FFB703]/20 text-[#023047] border border-[#FFB703]/40",
    success: "bg-[#FB8500]/10 text-[#FB8500] border border-[#FB8500]/20",
    neutral: "bg-slate-100 text-slate-600 border border-slate-200",
  };

  const sizeStyles = {
    sm: "px-2 py-0.5 text-[10px] rounded-full font-extrabold gap-1",
    md: "px-2.5 py-1 text-xs rounded-full font-bold gap-1.5",
  };

  return (
    <span
      className={`inline-flex items-center justify-center select-none ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
    </span>
  );
};
