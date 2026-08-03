"use client";

import React, { useState, useEffect } from "react";
import { KeyRound, Eye, EyeOff, CheckCircle2, XCircle, Loader2, ShieldCheck } from "lucide-react";
import { AIProviderSettings } from "@/types/settings.types";
import { SettingsService } from "@/services/settingsService";

export default function AIProviderCard() {
  const [providerSettings, setProviderSettings] = useState<AIProviderSettings>({
    provider: "gemini",
    apiKey: "",
    hasKey: false,
  });
  const [showKey, setShowKey] = useState(false);
  const [loading, setLoading] = useState(true);
  const [validating, setValidating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [validationBadge, setValidationBadge] = useState<{
    valid: boolean;
    text: string;
  } | null>(null);
  const [toast, setToast] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    SettingsService.getAIProviderSettings("gemini").then((res) => {
      setProviderSettings(res);
      setLoading(false);
    });
  }, []);

  const handleValidate = async () => {
    if (!providerSettings.apiKey.trim()) {
      setValidationBadge({ valid: false, text: "Please enter an API key first." });
      return;
    }

    setValidating(true);
    setValidationBadge(null);

    const res = await SettingsService.validateGeminiKey(providerSettings.apiKey);
    setValidating(false);

    if (res.valid) {
      setValidationBadge({ valid: true, text: "Valid Gemini API Key" });
    } else {
      setValidationBadge({ valid: false, text: res.message || "Invalid API Key" });
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!providerSettings.apiKey.trim()) {
      setToast({ type: "error", text: "Please enter an API key" });
      return;
    }

    setSaving(true);
    setToast(null);

    const res = await SettingsService.saveAIProviderKey("gemini", providerSettings.apiKey);
    setSaving(false);

    if (res.success) {
      setProviderSettings((prev) => ({ ...prev, hasKey: true }));
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
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <KeyRound className="w-5 h-5 text-[#219EBC]" />
            <h2 className="text-base font-extrabold text-slate-900">AI Provider Keys</h2>
          </div>
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
            <ShieldCheck className="w-3 h-3" /> Secure Storage
          </span>
        </div>
        <p className="text-xs text-slate-500 font-medium mt-0.5">
          Connect your Google Gemini API key to power DeepCode AI features.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-4">
        {/* Provider Switch Tabs (Extensible for OpenAI, Claude, Grok) */}
        <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-[10px] w-fit">
          <button
            type="button"
            className="px-3 py-1.5 bg-white text-[#023047] font-extrabold text-xs rounded-[8px] shadow-xs cursor-pointer"
          >
            Google Gemini
          </button>
          <button
            type="button"
            disabled
            className="px-3 py-1.5 text-slate-400 font-bold text-xs rounded-[8px] cursor-not-allowed opacity-60"
            title="OpenAI support coming soon"
          >
            OpenAI (Soon)
          </button>
          <button
            type="button"
            disabled
            className="px-3 py-1.5 text-slate-400 font-bold text-xs rounded-[8px] cursor-not-allowed opacity-60"
            title="Claude support coming soon"
          >
            Claude (Soon)
          </button>
        </div>

        {/* Gemini API Key Field */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-700">Gemini API Key</label>
            {providerSettings.hasKey && (
              <span className="text-[10px] font-bold text-emerald-600">Key Saved</span>
            )}
          </div>

          <div className="relative flex items-center">
            <input
              type={showKey ? "text" : "password"}
              value={providerSettings.apiKey}
              onChange={(e) => {
                setProviderSettings({ ...providerSettings, apiKey: e.target.value });
                setValidationBadge(null);
              }}
              placeholder="AIzaSy..."
              className="w-full pr-10 pl-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-[10px] text-slate-900 focus:bg-white focus:border-[#219EBC] outline-hidden transition-colors font-mono"
            />
            <button
              type="button"
              onClick={() => setShowKey(!showKey)}
              className="absolute right-3 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Validation Result Badge */}
        {validationBadge && (
          <div
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] text-xs font-bold ${
              validationBadge.valid
                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                : "bg-rose-50 text-rose-700 border border-rose-200"
            }`}
          >
            {validationBadge.valid ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
            )}
            <span>{validationBadge.text}</span>
          </div>
        )}

        {/* Buttons & Toast */}
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

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleValidate}
              disabled={validating || !providerSettings.apiKey.trim()}
              className="px-3 py-2 bg-slate-100 hover:bg-slate-200 disabled:opacity-50 text-slate-700 font-extrabold text-xs rounded-[10px] transition-colors cursor-pointer flex items-center gap-1.5"
            >
              {validating && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <span>Validate Key</span>
            </button>

            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 bg-[#219EBC] hover:bg-[#023047] text-white font-extrabold text-xs rounded-[10px] transition-colors shadow-xs cursor-pointer flex items-center gap-1.5"
            >
              {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <span>Save API Key</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
