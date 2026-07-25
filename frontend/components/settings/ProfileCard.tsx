"use client";

import React, { useState, useEffect } from "react";
import { Camera, Trash2, Loader2, CheckCircle2 } from "lucide-react";
import { ProfileSettings } from "@/types/settings.types";
import { SettingsService } from "@/services/settingsService";

export default function ProfileCard() {
  const [profile, setProfile] = useState<ProfileSettings>({
    displayName: "",
    username: "",
    email: "",
    avatarUrl: null,
    bio: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    SettingsService.getProfileSettings().then((res) => {
      setProfile(res);
      setLoading(false);
    });
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile.displayName.trim()) {
      setToast({ type: "error", text: "Display name is required" });
      return;
    }

    setSaving(true);
    setToast(null);

    const res = await SettingsService.updateProfileSettings(profile);
    setSaving(false);

    if (res.success) {
      setToast({ type: "success", text: res.message });
      setTimeout(() => setToast(null), 3000);
    } else {
      setToast({ type: "error", text: res.message });
    }
  };

  const getInitials = (name: string) => {
    if (!name) return "U";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  if (loading) {
    return (
      <div className="bg-white rounded-[16px] border border-slate-200 p-6 shadow-xs animate-pulse space-y-4">
        <div className="h-6 w-32 bg-slate-100 rounded-md" />
        <div className="h-20 w-full bg-slate-100 rounded-md" />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-[16px] border border-slate-200 p-6 shadow-xs space-y-6 select-none">
      {/* Header */}
      <div>
        <h2 className="text-base font-extrabold text-slate-900">Profile Details</h2>
        <p className="text-xs text-slate-500 font-medium mt-0.5">
          Manage your display name, username, bio, and avatar.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-5">
        {/* Avatar Section */}
        <div className="flex items-center gap-4">
          <div className="relative w-16 h-16 rounded-full bg-[#219EBC]/15 text-[#219EBC] flex items-center justify-center font-black text-xl border-2 border-white shadow-sm overflow-hidden shrink-0">
            {profile.avatarUrl ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={profile.avatarUrl}
                alt={profile.displayName}
                className="w-full h-full object-cover"
              />
            ) : (
              <span>{getInitials(profile.displayName)}</span>
            )}
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <label
                htmlFor="avatar-upload"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-[8px] transition-colors cursor-pointer"
              >
                <Camera className="w-3.5 h-3.5" />
                <span>Upload Picture</span>
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        setProfile((prev) => ({ ...prev, avatarUrl: reader.result as string }));
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                />
              </label>

              {profile.avatarUrl && (
                <button
                  type="button"
                  onClick={() => setProfile((prev) => ({ ...prev, avatarUrl: null }))}
                  className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-[8px] transition-colors cursor-pointer"
                  title="Remove picture"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
            <p className="text-[11px] text-slate-400 font-medium">
              JPG, PNG, WEBP or GIF (Max 2MB)
            </p>
          </div>
        </div>

        {/* Form Fields Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Display Name */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">
              Display Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={profile.displayName}
              onChange={(e) => setProfile({ ...profile, displayName: e.target.value })}
              placeholder="e.g. Ali Raza"
              className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-[10px] text-slate-900 focus:bg-white focus:border-[#219EBC] outline-hidden transition-colors"
            />
          </div>

          {/* Username */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Username (Optional)</label>
            <div className="relative">
              <span className="absolute left-3.5 top-2.5 text-slate-400 text-sm font-medium">@</span>
              <input
                type="text"
                value={profile.username}
                onChange={(e) => setProfile({ ...profile, username: e.target.value.toLowerCase().replace(/\s+/g, "") })}
                placeholder="aliraza"
                className="w-full pl-8 pr-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-[10px] text-slate-900 focus:bg-white focus:border-[#219EBC] outline-hidden transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Email Field (Read Only) */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-700">Email Address (Read Only)</label>
          <input
            type="email"
            disabled
            value={profile.email}
            className="w-full px-3.5 py-2 text-sm bg-slate-100 border border-slate-200/80 rounded-[10px] text-slate-500 cursor-not-allowed"
          />
        </div>

        {/* Bio Field (Optional, Max 150 chars) */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-700">About Me (Optional)</label>
            <span className="text-[11px] text-slate-400 font-mono">
              {(profile.bio || "").length} / 150
            </span>
          </div>
          <textarea
            maxLength={150}
            rows={2}
            value={profile.bio || ""}
            onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
            placeholder="CS Student passionate about AI..."
            className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-[10px] text-slate-900 focus:bg-white focus:border-[#219EBC] outline-hidden transition-colors resize-none"
          />
        </div>

        {/* Action Button & Toast */}
        <div className="flex items-center justify-between pt-2">
          {toast ? (
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

          <button
            type="submit"
            disabled={saving}
            className="px-4 py-2 bg-[#219EBC] hover:bg-[#023047] text-white font-extrabold text-xs rounded-[10px] transition-colors shadow-xs cursor-pointer flex items-center gap-2"
          >
            {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            <span>Save Profile</span>
          </button>
        </div>
      </form>
    </div>
  );
}
