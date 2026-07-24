import React from "react";
import { Loader2 } from "lucide-react";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | "primary"
    | "secondary"
    | "outline"
    | "ghost"
    | "danger"
    | "success";
  size?: "xs" | "sm" | "md" | "lg";
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      isLoading = false,
      leftIcon,
      rightIcon,
      children,
      className = "",
      disabled,
      type = "button",
      ...props
    },
    ref
  ) => {
    // 1. Variant Styles
    const variantStyles = {
      primary:
        "bg-[#FB8500] hover:bg-[#e07700] text-white shadow-xs focus-visible:ring-[#FB8500]",
      secondary:
        "bg-[#219EBC] hover:bg-[#1a859f] text-white shadow-xs focus-visible:ring-[#219EBC]",
      outline:
        "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900 shadow-xs focus-visible:ring-[#219EBC]",
      ghost:
        "bg-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus-visible:ring-slate-400",
      danger:
        "bg-rose-600 hover:bg-rose-700 text-white shadow-xs focus-visible:ring-rose-500",
      success:
        "bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs focus-visible:ring-emerald-500",
    };

    // 2. Size Styles
    const sizeStyles = {
      xs: "px-2.5 py-1 text-[11px] rounded-[8px] gap-1.5 font-bold",
      sm: "px-3.5 py-1.5 text-xs rounded-[10px] gap-2 font-bold",
      md: "px-4 py-2.5 text-xs sm:text-sm rounded-[12px] gap-2 font-semibold",
      lg: "px-6 py-3 text-sm sm:text-base rounded-[12px] gap-2.5 font-bold",
    };

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || isLoading}
        className={`inline-flex items-center justify-center select-none transition-all duration-120 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 cursor-pointer ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin shrink-0" />
        ) : (
          leftIcon && <span className="shrink-0">{leftIcon}</span>
        )}
        <span>{children}</span>
        {!isLoading && rightIcon && (
          <span className="shrink-0">{rightIcon}</span>
        )}
      </button>
    );
  }
);

Button.displayName = "Button";
