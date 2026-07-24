"use client";

import React from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";

export interface DropdownMenuItemConfig {
  id: string;
  label: string;
  icon?: React.ReactNode;
  shortcut?: string;
  destructive?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}

export interface DropdownMenuWrapperProps {
  trigger: React.ReactNode;
  items: DropdownMenuItemConfig[];
  align?: "start" | "center" | "end";
  header?: React.ReactNode;
  className?: string;
}

export const DropdownMenuWrapper: React.FC<DropdownMenuWrapperProps> = ({
  trigger,
  items,
  align = "end",
  header,
  className = "",
}) => {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>{trigger}</DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align={align}
          sideOffset={6}
          className={`z-50 min-w-[200px] bg-white border border-slate-200 rounded-[12px] shadow-xl p-1.5 select-none focus:outline-none animate-in fade-in-0 zoom-in-95 duration-150 ${className}`}
        >
          {header && (
            <div className="px-3 py-2 border-b border-slate-100 mb-1 text-xs font-semibold text-slate-500">
              {header}
            </div>
          )}

          {items.map((item) => (
            <DropdownMenu.Item
              key={item.id}
              disabled={item.disabled}
              onClick={item.onClick}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-[8px] text-xs font-semibold cursor-pointer outline-none transition-colors ${
                item.destructive
                  ? "text-rose-600 focus:bg-rose-50 hover:bg-rose-50"
                  : "text-slate-700 focus:bg-slate-50 hover:bg-slate-50 focus:text-slate-900"
              } ${item.disabled ? "opacity-50 pointer-events-none" : ""}`}
            >
              {item.icon && <span className="shrink-0">{item.icon}</span>}
              <span className="flex-1 truncate">{item.label}</span>
              {item.shortcut && (
                <span className="text-[10px] font-mono text-slate-400">
                  {item.shortcut}
                </span>
              )}
            </DropdownMenu.Item>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};
