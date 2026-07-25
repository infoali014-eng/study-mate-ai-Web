"use client";

import React, { useState, useEffect } from "react";
import { Bell, Loader2, CheckCircle2 } from "lucide-react";
import { NotificationSettings } from "@/types/settings.types";
import { SettingsService } from "@/services/settingsService";

export default function NotificationCard() {
  const [notifications, setNotifications] = useState<NotificationSettings>({
    studyReminders: true,
    streakReminder: true,
    productUpdates: false,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    SettingsService.getNotificationSettings().then((res) => {
      setNotifications(res);
      setLoading(false);
    });
  }, []);

  const handleToggle = async (key: keyof NotificationSettings) => {
    const updated = { ...notifications, [key]: !notifications[key] };
    setNotifications(updated);
    setSaving(true);
    setToast(null);

    const res = await SettingsService.updateNotificationSettings(updated);
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

  const items = [
    {
      key: "studyReminders" as const,
      title: "Study Reminders",
      desc: "Receive daily nudges to stay on track with your study goals.",
    },
    {
      key: "streakReminder" as const,
      title: "Streak Reminder",
      desc: "Alerts before your daily streak expires so you don't lose progress.",
    },
    {
      key: "productUpdates" as const,
      title: "Product Updates",
      desc: "Occasional news about new features, updates, and Owl AI tools.",
    },
  ];

  return (
    <div className="bg-white rounded-[16px] border border-slate-200 p-6 shadow-xs space-y-6 select-none">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <Bell className="w-5 h-5 text-[#219EBC]" />
          <h2 className="text-base font-extrabold text-slate-900">Notifications</h2>
        </div>
        <p className="text-xs text-slate-500 font-medium mt-0.5">
          Control which reminders and alerts you receive from StudyMate AI.
        </p>
      </div>

      <div className="space-y-4">
        {items.map((item) => {
          const isChecked = notifications[item.key];
          return (
            <div
              key={item.key}
              className="flex items-center justify-between p-3.5 bg-slate-50 rounded-[12px] border border-slate-200/80"
            >
              <div className="space-y-0.5 min-w-0 pr-4">
                <h3 className="text-xs font-extrabold text-slate-900">{item.title}</h3>
                <p className="text-[11px] text-slate-500 font-medium">{item.desc}</p>
              </div>

              {/* Toggle Switch */}
              <button
                type="button"
                onClick={() => handleToggle(item.key)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                  isChecked ? "bg-[#219EBC]" : "bg-slate-300"
                }`}
                role="switch"
                aria-checked={isChecked}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                    isChecked ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          );
        })}
      </div>

      {/* Toast message */}
      <div className="flex items-center justify-between pt-1">
        {saving ? (
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            <span>Saving notification preferences...</span>
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
