"use client";

import React, { useState, useEffect } from "react";
import {
  KeyRound,
  Eye,
  EyeOff,
  CheckCircle2,
  XCircle,
  Loader2,
  ShieldCheck,
  Trash2,
  Activity,
  RefreshCw,
} from "lucide-react";
import { AIProviderSettings } from "@/types/settings.types";
import { SettingsService } from "@/services/settingsService";

export default function AIProviderCard() {
  const [providerSettings, setProviderSettings] = useState<
    AIProviderSettings & { maskedKey?: string }
  >({
    provider: "gemini",
    apiKey: "",
    hasKey: false,
    maskedKey: "",
  });

  const [inputKey, setInputKey] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [loading, setLoading] = useState(true);
  const [validating, setValidating] = useState(false);
  const [testing, setTesting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [validationBadge, setValidationBadge] = useState<{
    valid: boolean;
    text: string;
  } | null>(null);
  const [toast, setToast] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const loadSettings = async () => {
    setLoading(true);
    const res = await SettingsService.getAIProviderSettings("gemini");
    setProviderSettings(res);
    setLoading(false);
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const handleValidate = async () => {
    const keyToValidate = inputKey.trim();
    if (!keyToValidate) {
      setValidationBadge({ valid: false, text: "Please enter a Gemini API key first." });
      return;
    }

    setValidating(true);
    setValidationBadge(null);

    const res = await SettingsService.validateGeminiKey(keyToValidate);
    setValidating(false);

    if (res.valid) {
      setValidationBadge({ valid: true, text: "Valid Gemini API Key" });
    } else {
      setValidationBadge({ valid: false, text: res.message || "Invalid API Key" });
    }
  };

  const handleTestConnection = async () => {
    setTesting(true);
    setValidationBadge(null);

    const res = await SettingsService.testStoredAIProviderKey();
    setTesting(false);

    if (res.valid) {
      setValidationBadge({ valid: true, text: res.message });
    } else {
      setValidationBadge({ valid: false, text: res.message });
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputKey.trim()) {
      setToast({ type: "error", text: "Please enter an API key" });
      return;
    }

    setSaving(true);
    setToast(null);

    const res = await SettingsService.saveAIProviderKey("gemini", inputKey.trim());
    setSaving(false);

    if (res.success) {
      setProviderSettings({
        provider: "gemini",
        apiKey: "",
        hasKey: true,
        maskedKey: res.maskedKey || "••••••••",
      });
      setInputKey("");
      setIsEditing(false);
      setValidationBadge({ valid: true, text: "Gemini connected and securely encrypted!" });
      setToast({ type: "success", text: res.message });
      setTimeout(() => setToast(null), 3000);
    } else {
      setToast({ type: "error", text: res.message });
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to remove your stored Gemini API key?")) return;

    setDeleting(true);
    const res = await SettingsService.deleteAIProviderKey();
    setDeleting(false);

    if (res.success) {
      setProviderSettings({ provider: "gemini", apiKey: "", hasKey: false, maskedKey: "" });
      setInputKey("");
      setIsEditing(false);
      setValidationBadge(null);
      setToast({ type: "success", text: "API key removed successfully." });
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
            <h2 className="text-base font-extrabold text-slate-900">AI Configuration</h2>
          </div>
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
            <ShieldCheck className="w-3 h-3" /> Secure Server Encryption (AES-256)
          </span>
        </div>
        <p className="text-xs text-slate-500 font-medium mt-0.5">
          Your key is securely encrypted on the server and used only for your Mr Owl AI requests. It is never exposed to client-side code.
        </p>
      </div>

      {/* Provider Selector */}
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

      {/* Connection Status Box if Key Already Saved */}
      {providerSettings.hasKey && !isEditing ? (
        <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-[12px] space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                <div className="text-xs font-extrabold text-emerald-950">✓ Gemini Connected</div>
                <div className="text-[11px] font-mono text-emerald-700 font-medium mt-0.5">
                  Key: {providerSettings.maskedKey || "••••••••"}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleTestConnection}
                disabled={testing}
                className="px-3 py-1.5 bg-white hover:bg-emerald-100 text-emerald-800 border border-emerald-300 font-extrabold text-xs rounded-[8px] transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs"
              >
                {testing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Activity className="w-3.5 h-3.5" />}
                <span>Test Connection</span>
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="px-3 py-1.5 bg-[#023047] hover:bg-[#03405e] text-white font-extrabold text-xs rounded-[8px] transition-colors cursor-pointer flex items-center gap-1 shadow-2xs"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Update Key</span>
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="p-1.5 text-rose-600 hover:bg-rose-100 rounded-[8px] transition-colors cursor-pointer"
                title="Remove API Key"
              >
                {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Gemini API Key Form */
        <form onSubmit={handleSave} className="space-y-4">
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700">
                {providerSettings.hasKey ? "Update Gemini API Key" : "Enter your Gemini API key"}
              </label>
              {isEditing && (
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="text-[10px] font-bold text-slate-500 hover:underline"
                >
                  Cancel
                </button>
              )}
            </div>

            <div className="relative flex items-center">
              <input
                type={showKey ? "text" : "password"}
                value={inputKey}
                onChange={(e) => {
                  setInputKey(e.target.value);
                  setValidationBadge(null);
                }}
                placeholder="AIzaSy..."
                className="w-full pr-10 pl-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-[10px] text-slate-900 focus:bg-white focus:border-[#219EBC] outline-hidden transition-colors font-mono"
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

          <div className="flex items-center justify-between pt-1">
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
                disabled={validating || !inputKey.trim()}
                className="px-3 py-2 bg-slate-100 hover:bg-slate-200 disabled:opacity-50 text-slate-700 font-extrabold text-xs rounded-[10px] transition-colors cursor-pointer flex items-center gap-1.5"
              >
                {validating && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>Validate Key</span>
              </button>

              <button
                type="submit"
                disabled={saving || !inputKey.trim()}
                className="px-4 py-2 bg-[#219EBC] hover:bg-[#023047] disabled:opacity-50 text-white font-extrabold text-xs rounded-[10px] transition-colors shadow-xs cursor-pointer flex items-center gap-1.5"
              >
                {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>Connect Gemini</span>
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Validation Result Badge */}
      {validationBadge && (
        <div
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-[10px] text-xs font-bold ${
            validationBadge.valid
              ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
              : "bg-rose-50 text-rose-800 border border-rose-200"
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
    </div>
  );
}
