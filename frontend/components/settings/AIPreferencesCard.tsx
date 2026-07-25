"use client";

import React, { useState, useEffect } from "react";
import { Sparkles, Loader2, CheckCircle2 } from "lucide-react";
import { AIPreferences, PreferredLanguage, ExplanationStyle } from "@/types/settings.types";
import { SettingsService } from "@/services/settingsService";

export default function AIPreferencesCard() {
  const [preferences, setPreferences] = useState<AIPreferences>({
    preferredLanguage: "english",
    explanationStyle: "detailed",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    SettingsService.getAIPreferences().then((res) => {
      setPreferences(res);
      setLoading(false);
    });
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setToast(null);

    const res = await SettingsService.updateAIPreferences(preferences);
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

  return (
    <div className="bg-white rounded-[16px] border border-slate-200 p-6 shadow-xs space-y-6 select-none">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-[#FB8500]" />
          <h2 className="text-base font-extrabold text-slate-900">AI Preferences</h2>
        </div>
        <p className="text-xs text-slate-500 font-medium mt-0.5">
          Configure how Mr Owl AI structures responses and communicates with you.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-5">
        {/* Preferred Language */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700">Preferred Language</label>
          <div className="grid grid-cols-3 gap-2.5">
            {[
              { id: "english", label: "English", desc: "Default AI responses" },
              { id: "urdu", label: "Urdu (اردو)", desc: "Roman & Script Urdu" },
              { id: "both", label: "Bilingual / Both", desc: "English + Urdu mix" },
            ].map((item) => {
              const isSelected = preferences.preferredLanguage === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() =>
                    setPreferences({
                      ...preferences,
                      preferredLanguage: item.id as PreferredLanguage,
                    })
                  }
                  className={`p-3 rounded-[12px] border text-left transition-all cursor-pointer ${
                    isSelected
                      ? "bg-[#219EBC]/10 border-[#219EBC] text-[#023047] font-bold shadow-2xs"
                      : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  <div className="text-xs font-extrabold">{item.label}</div>
                  <div className="text-[10px] text-slate-400 font-medium mt-0.5 truncate">
                    {item.desc}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Explanation Style */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700">Explanation Style</label>
          <div className="grid grid-cols-2 gap-3">
            {[
              {
                id: "simple",
                label: "Simple & Intuitive",
                desc: "Uses analogies, easy vocabulary, and straightforward summaries.",
              },
              {
                id: "detailed",
                label: "Detailed & Rigorous",
                desc: "Provides step-by-step depth, academic terminology, and proofs.",
              },
            ].map((item) => {
              const isSelected = preferences.explanationStyle === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() =>
                    setPreferences({
                      ...preferences,
                      explanationStyle: item.id as ExplanationStyle,
                    })
                  }
                  className={`p-3.5 rounded-[12px] border text-left transition-all cursor-pointer ${
                    isSelected
                      ? "bg-[#FB8500]/10 border-[#FB8500] text-slate-900 font-bold shadow-2xs"
                      : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  <div className="text-xs font-extrabold">{item.label}</div>
                  <div className="text-[11px] text-slate-500 font-medium mt-1 leading-snug">
                    {item.desc}
                  </div>
                </button>
              );
            })}
          </div>
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
            <span>Save AI Preferences</span>
          </button>
        </div>
      </form>
    </div>
  );
}
