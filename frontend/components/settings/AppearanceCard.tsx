"use client";

import React, { useState, useEffect } from "react";
import { Sun, Moon, Monitor, Loader2, CheckCircle2 } from "lucide-react";
import { AppearanceSettings, ThemeOption } from "@/types/settings.types";
import { SettingsService } from "@/services/settingsService";

export default function AppearanceCard() {
  const [appearance, setAppearance] = useState<AppearanceSettings>({
    theme: "system",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    SettingsService.getAppearanceSettings().then((res) => {
      setAppearance(res);
      setLoading(false);
    });
  }, []);

  const handleSelectTheme = async (theme: ThemeOption) => {
    setAppearance({ theme });
    setSaving(true);
    setToast(null);

    const res = await SettingsService.updateAppearanceSettings({ theme });
    setSaving(false);

    if (res.success) {
      setToast({ type: "success", text: res.message });
      setTimeout(() => setToast(null), 3000);
    } else {
      setToast({ type: "error", text: res.message });
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-[16px] border border-slate-200 p-6 shadow-xs animate-pulse space-y-4">
        <div className="h-6 w-32 bg-slate-100 rounded-md" />
        <div className="h-20 w-full bg-slate-100 rounded-md" />
      </div>
    );
  }

  const themes = [
    {
      id: "light" as const,
      label: "Light Theme",
      desc: "Clean white interface",
      icon: Sun,
    },
    {
      id: "dark" as const,
      label: "Dark Theme",
      desc: "Sleek dark background",
      icon: Moon,
    },
    {
      id: "system" as const,
      label: "System Preference",
      desc: "Matches your device setting",
      icon: Monitor,
    },
  ];

  return (
    <div className="bg-white rounded-[16px] border border-slate-200 p-6 shadow-xs space-y-6 select-none">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <Sun className="w-5 h-5 text-[#FB8500]" />
          <h2 className="text-base font-extrabold text-slate-900">Appearance</h2>
        </div>
        <p className="text-xs text-slate-500 font-medium mt-0.5">
          Customize the visual theme and interface mode for DeepCode.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {themes.map((t) => {
          const Icon = t.icon;
          const isSelected = appearance.theme === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => handleSelectTheme(t.id)}
              className={`p-4 rounded-[14px] border text-left transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                isSelected
                  ? "bg-[#023047] border-[#023047] text-white shadow-md scale-[1.02]"
                  : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
              }`}
            >
              <div
                className={`w-9 h-9 rounded-[10px] flex items-center justify-center ${
                  isSelected ? "bg-white/15 text-[#8ECAE6]" : "bg-slate-200/80 text-slate-600"
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>

              <div>
                <div className="text-xs font-extrabold">{t.label}</div>
                <div
                  className={`text-[11px] font-medium mt-0.5 ${
                    isSelected ? "text-slate-300" : "text-slate-400"
                  }`}
                >
                  {t.desc}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Toast message */}
      <div className="flex items-center justify-between pt-1">
        {saving ? (
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            <span>Updating theme...</span>
          </div>
        ) : toast ? (
          <div
            className={`flex items-center gap-1.5 text-xs font-bold ${
              toast.type === "success" ? "text-emerald-600" : "text-rose-600"
            }`}
          >
            {toast.type === "success" && <CheckCircle2 className="w-4 h-4" />}
            <span>{toast.text}</span>
          </div>
        ) : (
          <span />
        )}
      </div>
    </div>
  );
}
