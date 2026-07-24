import React from "react";

export interface IconButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "ghost" | "outline" | "accent" | "danger";
  size?: "sm" | "md" | "lg";
  hasUnreadDot?: boolean;
  children: React.ReactNode;
}

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    {
      variant = "ghost",
      size = "md",
      hasUnreadDot = false,
      children,
      className = "",
      disabled,
      type = "button",
      ...props
    },
    ref
  ) => {
    const variantStyles = {
      default:
        "bg-[#023047] text-white hover:bg-[#03405e] focus-visible:ring-[#219EBC]",
      ghost:
        "bg-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 focus-visible:ring-slate-400",
      outline:
        "bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:border-slate-300 focus-visible:ring-[#219EBC]",
      accent:
        "bg-[#219EBC] text-white hover:bg-[#1a859f] focus-visible:ring-[#219EBC]",
      danger:
        "bg-rose-50 text-rose-600 hover:bg-rose-100 focus-visible:ring-rose-500",
    };

    const sizeStyles = {
      sm: "w-8 h-8 rounded-[10px]",
      md: "w-9 h-9 rounded-[12px]",
      lg: "w-11 h-11 rounded-[12px]",
    };

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled}
        className={`relative inline-flex items-center justify-center select-none transition-colors duration-120 cursor-pointer active:scale-95 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
        {...props}
      >
        {children}
        {hasUnreadDot && (
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#FB8500] rounded-full ring-2 ring-white" />
        )}
      </button>
    );
  }
);

IconButton.displayName = "IconButton";
