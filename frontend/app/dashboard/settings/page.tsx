"use client";

import React, { useState } from "react";
import ProfileCard from "@/components/settings/ProfileCard";
import AcademicCard from "@/components/settings/AcademicCard";
import AIPreferencesCard from "@/components/settings/AIPreferencesCard";
import AIProviderCard from "@/components/settings/AIProviderCard";
import NotificationCard from "@/components/settings/NotificationCard";
import AppearanceCard from "@/components/settings/AppearanceCard";
import PrivacySecurityCard from "@/components/settings/PrivacySecurityCard";
import { PageHeader } from "@/components/ui";
import { Settings, User, GraduationCap, Sparkles, KeyRound, Bell, Sun, ShieldAlert } from "lucide-react";

export default function AccountSettingsPage() {
  const [activeTab, setActiveTab] = useState<string>("all");

  const tabs = [
    { id: "all", label: "All Settings", icon: Settings },
    { id: "profile", label: "Profile", icon: User },
    { id: "academic", label: "Academic", icon: GraduationCap },
    { id: "ai_prefs", label: "AI Preferences", icon: Sparkles },
    { id: "provider", label: "AI Provider", icon: KeyRound },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "appearance", label: "Appearance", icon: Sun },
    { id: "privacy", label: "Privacy & Security", icon: ShieldAlert },
  ];

  return (
    <div className="space-y-6 pb-12 select-none">
      {/* 1. Header */}
      <PageHeader
        title="Account Settings"
        description="Single source of truth for user personalization, AI preferences, and API providers."
      />

      {/* 2. Quick Navigation Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 custom-scrollbar border-b border-slate-200/80">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-[10px] text-xs font-extrabold transition-all cursor-pointer shrink-0 ${
                isActive
                  ? "bg-[#023047] text-white shadow-2xs"
                  : "bg-slate-100/80 text-slate-600 hover:bg-slate-200/80"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 3. Settings Cards Stack */}
      <div className="space-y-6 max-w-4xl">
        {(activeTab === "all" || activeTab === "profile") && (
          <div id="section-profile">
            <ProfileCard />
          </div>
        )}

        {(activeTab === "all" || activeTab === "academic") && (
          <div id="section-academic">
            <AcademicCard />
          </div>
        )}

        {(activeTab === "all" || activeTab === "ai_prefs") && (
          <div id="section-ai_prefs">
            <AIPreferencesCard />
          </div>
        )}

        {(activeTab === "all" || activeTab === "provider") && (
          <div id="section-provider">
            <AIProviderCard />
          </div>
        )}

        {(activeTab === "all" || activeTab === "notifications") && (
          <div id="section-notifications">
            <NotificationCard />
          </div>
        )}

        {(activeTab === "all" || activeTab === "appearance") && (
          <div id="section-appearance">
            <AppearanceCard />
          </div>
        )}

        {(activeTab === "all" || activeTab === "privacy") && (
          <div id="section-privacy">
            <PrivacySecurityCard />
          </div>
        )}
      </div>
    </div>
  );
}
