import React from "react";

interface SidebarSectionProps {
  title?: string;
  collapsed: boolean;
  children: React.ReactNode;
}

export default function SidebarSection({
  title,
  collapsed,
  children,
}: SidebarSectionProps) {
  return (
    <div className="space-y-1 py-1">
      {title && !collapsed && (
        <div className="px-3.5 pt-2 pb-1 text-[11px] font-bold tracking-wider uppercase text-[#8ECAE6]/60 select-none">
          {title}
        </div>
      )}
      {title && collapsed && (
        <div className="w-6 h-px bg-[#8ECAE6]/20 mx-auto my-2" />
      )}
      <div className="space-y-1">{children}</div>
    </div>
  );
}
