"use client";

import React, { useState } from "react";

export const PlatformSettingsTab: React.FC = () => {
  const [platformName, setPlatformName] = useState("Deep Code");
  const [supportEmail, setSupportEmail] = useState("support@deepcode.ai");
  const [baseUrl, setBaseUrl] = useState("https://deepcode.vercel.app");

  // Maintenance & System Controls
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [maintenanceBanner, setMaintenanceBanner] = useState(
    "⚠️ Deep Code is currently undergoing scheduled platform upgrades. Standard services remain operational."
  );

  // Security Policies
  const [requireEmailVerification, setRequireEmailVerification] = useState(true);
  const [allowGoogleOAuth, setAllowGoogleOAuth] = useState(true);
  const [maxLoginAttempts, setMaxLoginAttempts] = useState(5);
  const [sessionTimeoutMinutes, setSessionTimeoutMinutes] = useState(120);

  // API Key Placeholders (Masked by default)
  const [showDeepseekKey, setShowDeepseekKey] = useState(false);
  const [deepseekApiKey, setDeepseekApiKey] = useState("sk-ds-98f34a12b7e569c0d12345");
  
  const [showSupabaseKey, setShowSupabaseKey] = useState(false);
  const [supabaseAnonKey, setSupabaseAnonKey] = useState("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyZWZlcmVuY2VfaWQiOiJkZWVwY29kZSJ9");

  const [saving, setSaving] = useState(false);
  const [savedMessage, setSavedMessage] = useState(false);

  // Maintenance actions
  const [flushingCache, setFlushingCache] = useState(false);
  const [cacheMessage, setCacheMessage] = useState(false);

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setSavedMessage(true);
      setTimeout(() => setSavedMessage(false), 3000);
    }, 600);
  };

  const handleFlushCache = () => {
    setFlushingCache(true);
    setTimeout(() => {
      setFlushingCache(false);
      setCacheMessage(true);
      setTimeout(() => setCacheMessage(false), 3000);
    }, 800);
  };

  return (
    <div className="space-y-8 animate-fade-in select-text">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <span>⚙️</span> Platform Configurations & Security Vault
          </h2>
          <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mt-1">
            Global system parameters, security policies, API integrations, & maintenance controls
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-[#219EBC] hover:bg-[#1a849e] text-white font-bold text-xs sm:text-sm px-5 py-3 rounded-xl shadow-xs cursor-pointer transition-all flex items-center gap-2 justify-center"
        >
          {saving ? "Saving Settings..." : "Save System Configs"}
        </button>
      </div>

      {savedMessage && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-extrabold px-4 py-3 rounded-xl flex items-center justify-between animate-fade-in">
          <span>✓ System settings and security configurations saved successfully!</span>
          <button onClick={() => setSavedMessage(false)} className="text-emerald-600 hover:text-emerald-950 font-black">
            ✕
          </button>
        </div>
      )}

      {cacheMessage && (
        <div className="bg-cyan-50 border border-cyan-200 text-cyan-800 text-xs font-extrabold px-4 py-3 rounded-xl flex items-center justify-between animate-fade-in">
          <span>⚡ Platform cache purged & search engine index refreshed.</span>
          <button onClick={() => setCacheMessage(false)} className="text-cyan-600 hover:text-cyan-950 font-black">
            ✕
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column: General & Maintenance */}
        <div className="space-y-6">
          {/* General Site Config */}
          <div className="bg-white border border-slate-200/80 p-6 rounded-2xl shadow-xs space-y-5">
            <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-3 flex items-center gap-2">
              <span>🌐</span> General App Properties
            </h3>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-800 block">Platform Title / Brand Name</label>
                <input
                  type="text"
                  value={platformName}
                  onChange={(e) => setPlatformName(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-800 block">Support Email</label>
                  <input
                    type="email"
                    value={supportEmail}
                    onChange={(e) => setSupportEmail(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-hidden"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-800 block">Canonical Base URL</label>
                  <input
                    type="url"
                    value={baseUrl}
                    onChange={(e) => setBaseUrl(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-hidden"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Maintenance Mode Controls */}
          <div className="bg-white border border-slate-200/80 p-6 rounded-2xl shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <span>🚧</span> Maintenance Mode Master Switch
              </h3>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={maintenanceMode}
                  onChange={(e) => setMaintenanceMode(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-slate-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-500" />
              </label>
            </div>

            <div className="space-y-3">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-800 block">Maintenance Banner Message</label>
                <textarea
                  rows={3}
                  value={maintenanceBanner}
                  onChange={(e) => setMaintenanceBanner(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-hidden leading-relaxed"
                />
              </div>

              <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                <div>
                  <div className="text-xs font-bold text-slate-800">Platform Cache Flush</div>
                  <div className="text-[10px] text-slate-400">Purge stale SSR & CMS database cache</div>
                </div>
                <button
                  type="button"
                  onClick={handleFlushCache}
                  disabled={flushingCache}
                  className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-xs rounded-xl cursor-pointer"
                >
                  {flushingCache ? "Flushing..." : "Purge Cache"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Security Policies & API Keys */}
        <div className="space-y-6">
          {/* Security & Access Policies */}
          <div className="bg-white border border-slate-200/80 p-6 rounded-2xl shadow-xs space-y-5">
            <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-3 flex items-center gap-2">
              <span>🛡️</span> Security & Authentication Policies
            </h3>

            <div className="space-y-3">
              <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200/80 bg-slate-50/50 cursor-pointer">
                <div>
                  <div className="text-xs font-bold text-slate-800">Email Verification Required</div>
                  <div className="text-[10px] text-slate-500">Require confirmed email before student login</div>
                </div>
                <input
                  type="checkbox"
                  checked={requireEmailVerification}
                  onChange={(e) => setRequireEmailVerification(e.target.checked)}
                  className="rounded text-[#219EBC]"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200/80 bg-slate-50/50 cursor-pointer">
                <div>
                  <div className="text-xs font-bold text-slate-800">Google OAuth Sign-In</div>
                  <div className="text-[10px] text-slate-500">Allow single click Google authentication</div>
                </div>
                <input
                  type="checkbox"
                  checked={allowGoogleOAuth}
                  onChange={(e) => setAllowGoogleOAuth(e.target.checked)}
                  className="rounded text-[#219EBC]"
                />
              </label>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-800 block">Max Login Attempts</label>
                  <input
                    type="number"
                    value={maxLoginAttempts}
                    onChange={(e) => setMaxLoginAttempts(parseInt(e.target.value) || 5)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-hidden"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-800 block">Session Timeout (Mins)</label>
                  <input
                    type="number"
                    value={sessionTimeoutMinutes}
                    onChange={(e) => setSessionTimeoutMinutes(parseInt(e.target.value) || 120)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-hidden"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* API Key Integration Vault */}
          <div className="bg-white border border-slate-200/80 p-6 rounded-2xl shadow-xs space-y-5">
            <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-3 flex items-center gap-2">
              <span>🔑</span> API Key Vault & Services
            </h3>

            <div className="space-y-4">
              {/* DeepSeek Key */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-800 flex items-center justify-between">
                  <span>DeepSeek / AI Provider API Key</span>
                  <button
                    type="button"
                    onClick={() => setShowDeepseekKey(!showDeepseekKey)}
                    className="text-[10px] text-[#219EBC] font-extrabold hover:underline"
                  >
                    {showDeepseekKey ? "Hide Key" : "Reveal Key"}
                  </button>
                </label>
                <input
                  type={showDeepseekKey ? "text" : "password"}
                  value={deepseekApiKey}
                  onChange={(e) => setDeepseekApiKey(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-medium text-slate-800 focus:outline-hidden"
                />
              </div>

              {/* Supabase Anon Key */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-800 flex items-center justify-between">
                  <span>Supabase Public Anon Key</span>
                  <button
                    type="button"
                    onClick={() => setShowSupabaseKey(!showSupabaseKey)}
                    className="text-[10px] text-[#219EBC] font-extrabold hover:underline"
                  >
                    {showSupabaseKey ? "Hide Key" : "Reveal Key"}
                  </button>
                </label>
                <input
                  type={showSupabaseKey ? "text" : "password"}
                  value={supabaseAnonKey}
                  onChange={(e) => setSupabaseAnonKey(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-medium text-slate-800 focus:outline-hidden"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
