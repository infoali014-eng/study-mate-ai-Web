import React from "react";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  shortcut?: string;
  containerClassName?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      leftIcon,
      rightIcon,
      shortcut,
      containerClassName = "",
      className = "",
      disabled,
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <div className={`space-y-1.5 w-full ${containerClassName}`}>
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs font-bold text-slate-700 select-none"
          >
            {label}
          </label>
        )}

        <div className="relative flex items-center">
          {leftIcon && (
            <div className="absolute left-3 text-slate-400 pointer-events-none shrink-0 flex items-center">
              {leftIcon}
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            disabled={disabled}
            className={`w-full bg-white text-slate-900 text-xs sm:text-sm font-medium border border-slate-200/80 rounded-[12px] px-3.5 py-2.5 placeholder:text-slate-400 focus:outline-none focus:border-[#219EBC] focus:ring-2 focus:ring-[#219EBC]/20 disabled:opacity-50 disabled:bg-slate-50 transition-all ${
              leftIcon ? "pl-9" : ""
            } ${rightIcon || shortcut ? "pr-10" : ""} ${
              error ? "border-rose-500 focus:border-rose-500 focus:ring-rose-500/20" : ""
            } ${className}`}
            {...props}
          />

          {shortcut && (
            <div className="absolute right-3 pointer-events-none select-none">
              <kbd className="bg-slate-100 border border-slate-200 text-[10px] text-slate-500 font-mono px-1.5 py-0.5 rounded-[4px]">
                {shortcut}
              </kbd>
            </div>
          )}

          {rightIcon && !shortcut && (
            <div className="absolute right-3 text-slate-400 flex items-center">
              {rightIcon}
            </div>
          )}
        </div>

        {error && (
          <p className="text-[11px] font-semibold text-rose-500 animate-in fade-in-50">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
