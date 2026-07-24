import React from "react";
import { PanelLeftClose, PanelLeftOpen, LogOut } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

interface SidebarFooterProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export default function SidebarFooter({
  collapsed,
  onToggleCollapse,
}: SidebarFooterProps) {
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <div className="mt-auto border-t border-[#03405e] pt-3 pb-2 px-3 space-y-2">
      {/* Collapse / Expand Toggle Button (Hidden on Mobile) */}
      <button
        type="button"
        onClick={onToggleCollapse}
        className={`hidden md:flex items-center gap-3 w-full px-3 py-2 text-xs font-semibold text-[#8ECAE6] hover:text-white hover:bg-[#03405e] rounded-[12px] transition-colors cursor-pointer ${
          collapsed ? "justify-center px-0" : ""
        }`}
        title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {collapsed ? (
          <PanelLeftOpen className="w-5 h-5 shrink-0" />
        ) : (
          <>
            <PanelLeftClose className="w-5 h-5 shrink-0" />
            <span>Collapse Sidebar</span>
          </>
        )}
      </button>

      {/* Quick Logout Button */}
      <button
        type="button"
        onClick={handleLogout}
        className={`flex items-center gap-3 w-full px-3 py-2 text-xs font-semibold text-rose-300 hover:text-white hover:bg-rose-900/30 rounded-[12px] transition-colors cursor-pointer ${
          collapsed ? "justify-center px-0" : ""
        }`}
        title="Sign Out"
      >
        <LogOut className="w-4 h-4 shrink-0" />
        {!collapsed && <span>Sign Out</span>}
      </button>
    </div>
  );
}
