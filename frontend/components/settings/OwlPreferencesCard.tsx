"use client";

import React, { useState } from "react";
import { Bot, Sparkles, Glasses, GraduationCap, Briefcase, Wand2, Coffee, Eye, Sun } from "lucide-react";
import { useOwlStore, OwlSkin, OwlAccessories } from "@/store/owlStore";
import MrOwl, { OwlAnimState } from "@/components/owl/MrOwl";

export default function OwlPreferencesCard() {
  const {
    enabled,
    skin,
    accessories,
    glow,
    eyeTracking,
    setEnabled,
    setSkin,
    toggleAccessory,
    setGlow,
    setEyeTracking,
  } = useOwlStore();

  const [previewMood, setPreviewMood] = useState<OwlAnimState>("idle");

  const skinsList: { id: OwlSkin; label: string; colors: string[] }[] = [
    { id: "classic", label: "Classic Blue", colors: ["#0077B6", "#0096C7", "#00B4D8"] },
    { id: "natural", label: "Woodland Brown", colors: ["#8B5E34", "#A97845", "#1F7A73"] },
    { id: "midnight", label: "Midnight Purple", colors: ["#4C1D95", "#7C3AED", "#C084FC"] },
    { id: "emerald", label: "Academic Green", colors: ["#047857", "#059669", "#34D399"] },
    { id: "sunset", label: "Sunset Gold", colors: ["#C2410C", "#EA580C", "#FBBF24"] },
    { id: "sakura", label: "Sakura Pink", colors: ["#BE185D", "#EC4899", "#F472B6"] },
  ];

  const moodsList: { id: OwlAnimState; label: string }[] = [
    { id: "idle", label: "Idle" },
    { id: "talk", label: "Talk" },
    { id: "celebrate", label: "Celebrate" },
    { id: "dizzy", label: "Dizzy" },
    { id: "sleep", label: "Sleep" },
    { id: "thinking", label: "Thinking" },
    { id: "curious", label: "Curious" },
    { id: "night_owl", label: "Night Owl" },
  ];

  const accessoryItems: { key: keyof OwlAccessories; label: string; icon: React.ElementType }[] = [
    { key: "glasses", label: "Smart Glasses", icon: Glasses },
    { key: "mortarboard", label: "Mortarboard Cap", icon: GraduationCap },
    { key: "satchel", label: "Satchel Strap", icon: Briefcase },
    { key: "wand", label: "Glowing Stylus Wand", icon: Wand2 },
    { key: "coffee", label: "Steaming Coffee Mug", icon: Coffee },
  ];

  return (
    <div className="bg-white rounded-[16px] border border-slate-200 p-6 shadow-xs space-y-6 select-none">
      {/* 1. Card Header & Master Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <Bot className="w-5 h-5 text-[#219EBC]" />
            <h2 className="text-base font-extrabold text-slate-900">Mr Owl Assistant Studio</h2>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Customize Mr Owl’s appearance, outfit accessories, color skins, and dashboard visibility.
          </p>
        </div>

        {/* Master Toggle */}
        <div className="flex items-center gap-3 bg-slate-50 px-4 py-2 rounded-[12px] border border-slate-200/80 shrink-0">
          <span className="text-xs font-extrabold text-slate-900">Show on Dashboard</span>
          <button
            type="button"
            onClick={() => setEnabled(!enabled)}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
              enabled ? "bg-[#219EBC]" : "bg-slate-300"
            }`}
            role="switch"
            aria-checked={enabled}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                enabled ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
        </div>
      </div>

      {/* 2. Interactive Live Studio Stage */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-[#023047] rounded-[16px] p-6 text-white shadow-inner flex flex-col items-center justify-center relative overflow-hidden">
        {/* Background Decorative Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(#38BDF8_1px,transparent_1px)] [background-size:16px_16px] opacity-10 pointer-events-none" />

        {/* Live Owl Stage */}
        <div className="relative z-10 my-4 flex items-center justify-center">
          {glow && (
            <div className="absolute inset-0 bg-[#38BDF8] rounded-full blur-2xl opacity-30 animate-pulse" />
          )}
          <MrOwl
            animState={previewMood}
            size={160}
            skin={skin}
            accessories={accessories}
          />
        </div>

        {/* Live Stage Animation Tester Pills */}
        <div className="relative z-10 w-full mt-2 pt-4 border-t border-slate-700/60">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider text-center mb-2.5">
            Test Animation State
          </div>
          <div className="flex items-center justify-center flex-wrap gap-1.5">
            {moodsList.map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => setPreviewMood(m.id)}
                className={`px-3 py-1 rounded-[8px] text-xs font-bold transition-all cursor-pointer ${
                  previewMood === m.id
                    ? "bg-[#219EBC] text-white shadow-xs"
                    : "bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700"
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Skin Palette Selector */}
      <div className="space-y-3">
        <h3 className="text-xs font-extrabold text-slate-900 flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-[#219EBC]" />
          <span>Color Skins</span>
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5">
          {skinsList.map((s) => {
            const isSelected = skin === s.id;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => setSkin(s.id)}
                className={`flex flex-col items-center gap-2 p-3 rounded-[12px] border text-center transition-all cursor-pointer ${
                  isSelected
                    ? "border-[#219EBC] bg-sky-50/50 ring-2 ring-[#219EBC]/20"
                    : "border-slate-200 hover:border-slate-300 bg-white"
                }`}
              >
                <div className="flex items-center gap-1">
                  {s.colors.map((c, idx) => (
                    <span
                      key={idx}
                      className="w-3.5 h-3.5 rounded-full border border-black/10"
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
                <span className="text-xs font-bold text-slate-800">{s.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Accessories & Visual Effects Grid */}
      <div className="space-y-3 pt-2 border-t border-slate-100">
        <h3 className="text-xs font-extrabold text-slate-900">Academic Accessories & Visual Features</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Accessories Switches */}
          {accessoryItems.map((item) => {
            const Icon = item.icon;
            const isChecked = !!accessories[item.key];
            return (
              <div
                key={item.key}
                className="flex items-center justify-between p-3 bg-slate-50 rounded-[12px] border border-slate-200/80"
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4 text-[#219EBC]" />
                  <span className="text-xs font-extrabold text-slate-800">{item.label}</span>
                </div>
                <button
                  type="button"
                  onClick={() => toggleAccessory(item.key)}
                  className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                    isChecked ? "bg-[#219EBC]" : "bg-slate-300"
                  }`}
                  role="switch"
                  aria-checked={isChecked}
                >
                  <span
                    className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-xs transition duration-200 ease-in-out ${
                      isChecked ? "translate-x-4" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
            );
          })}

          {/* Ambient Glow */}
          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-[12px] border border-slate-200/80">
            <div className="flex items-center gap-2.5">
              <Sun className="w-4 h-4 text-[#219EBC]" />
              <span className="text-xs font-extrabold text-slate-800">Ambient Aura Glow</span>
            </div>
            <button
              type="button"
              onClick={() => setGlow(!glow)}
              className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                glow ? "bg-[#219EBC]" : "bg-slate-300"
              }`}
              role="switch"
              aria-checked={glow}
            >
              <span
                className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-xs transition duration-200 ease-in-out ${
                  glow ? "translate-x-4" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          {/* Eye Cursor Tracking */}
          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-[12px] border border-slate-200/80">
            <div className="flex items-center gap-2.5">
              <Eye className="w-4 h-4 text-[#219EBC]" />
              <span className="text-xs font-extrabold text-slate-800">Mouse Pupil Tracking</span>
            </div>
            <button
              type="button"
              onClick={() => setEyeTracking(!eyeTracking)}
              className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                eyeTracking ? "bg-[#219EBC]" : "bg-slate-300"
              }`}
              role="switch"
              aria-checked={eyeTracking}
            >
              <span
                className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-xs transition duration-200 ease-in-out ${
                  eyeTracking ? "translate-x-4" : "translate-x-0"
                }`}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
