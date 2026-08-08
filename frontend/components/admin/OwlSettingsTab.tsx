"use client";

import React, { useState } from "react";

export const OwlSettingsTab: React.FC = () => {
  const [widgetEnabled, setWidgetEnabled] = useState(true);
  const [widgetPosition, setWidgetPosition] = useState<"bottom-right" | "bottom-left">("bottom-right");
  const [defaultSkin, setDefaultSkin] = useState("woodland");
  const [defaultPersona, setDefaultPersona] = useState("coding-mentor");
  const [aiModel, setAiModel] = useState("deepseek-r1");
  const [temperature, setTemperature] = useState(0.7);
  const [maxTokens, setMaxTokens] = useState(2048);
  const [systemPrompt, setSystemPrompt] = useState(
    "You are Mr Owl AI, a brilliant, friendly, and patient coding tutor. Guide users step-by-step through programming concepts, debug errors with clear explanations, and encourage best practices."
  );
  
  // Interactive Toggles
  const [mouseTracking, setMouseTracking] = useState(true);
  const [soundEffects, setSoundEffects] = useState(false);
  const [idleSleep, setIdleSleep] = useState(true);
  const [showHat, setShowHat] = useState(true);
  const [showMug, setShowMug] = useState(true);
  const [showGlasses, setShowGlasses] = useState(true);

  const [saving, setSaving] = useState(false);
  const [savedMessage, setSavedMessage] = useState(false);

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setSavedMessage(true);
      setTimeout(() => setSavedMessage(false), 3000);
    }, 600);
  };

  const skinColors: Record<string, { bg: string; border: string; name: string }> = {
    classic: { bg: "bg-cyan-500", border: "border-cyan-600", name: "Classic Cyan" },
    woodland: { bg: "bg-amber-800", border: "border-amber-900", name: "Woodland Brown" },
    crimson: { bg: "bg-rose-600", border: "border-rose-700", name: "Crimson Scholar" },
    golden: { bg: "bg-amber-400", border: "border-amber-500", name: "Golden Owl" },
    stealth: { bg: "bg-slate-800", border: "border-slate-900", name: "Midnight Stealth" },
    neon: { bg: "bg-emerald-500", border: "border-emerald-600", name: "Cyber Neon" },
  };

  return (
    <div className="space-y-8 animate-fade-in select-text">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <span>🦉</span> Mr Owl AI Configuration
          </h2>
          <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mt-1">
            Manage mascot behavior, AI prompt engineering, default appearance, & widget controls
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-[#219EBC] hover:bg-[#1a849e] text-white font-bold text-xs sm:text-sm px-5 py-3 rounded-xl shadow-xs cursor-pointer transition-all flex items-center gap-2 justify-center"
        >
          {saving ? "Saving Configurations..." : "Save Mascot Settings"}
        </button>
      </div>

      {savedMessage && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-extrabold px-4 py-3 rounded-xl flex items-center justify-between animate-fade-in">
          <span>✓ Mr Owl AI configuration saved successfully! All live widgets updated.</span>
          <button onClick={() => setSavedMessage(false)} className="text-emerald-600 hover:text-emerald-950 font-black">
            ✕
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Columns: Config Controls */}
        <div className="lg:col-span-2 space-y-6">
          {/* Section 1: Widget Visibility & Placement */}
          <div className="bg-white border border-slate-200/80 p-6 rounded-2xl shadow-xs space-y-5">
            <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-3 flex items-center gap-2">
              <span>📌</span> Floating Widget & Placement
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200/60">
                <div>
                  <div className="text-xs font-bold text-slate-800">Enable Floating Widget</div>
                  <div className="text-[10px] text-slate-500 font-medium">Show mascot widget across public pages</div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={widgetEnabled}
                    onChange={(e) => setWidgetEnabled(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-slate-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#219EBC]" />
                </label>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/60 space-y-2">
                <label className="text-xs font-bold text-slate-800 block">Widget Screen Position</label>
                <select
                  value={widgetPosition}
                  onChange={(e) => setWidgetPosition(e.target.value as "bottom-right" | "bottom-left")}
                  className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 focus:outline-hidden"
                >
                  <option value="bottom-right">Bottom Right (Default)</option>
                  <option value="bottom-left">Bottom Left</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <label className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-200/70 bg-slate-50/50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={mouseTracking}
                  onChange={(e) => setMouseTracking(e.target.checked)}
                  className="rounded text-[#219EBC] focus:ring-0"
                />
                <div>
                  <div className="text-xs font-bold text-slate-800">Eye Tracking</div>
                  <div className="text-[10px] text-slate-400">Follow mouse cursor</div>
                </div>
              </label>

              <label className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-200/70 bg-slate-50/50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={idleSleep}
                  onChange={(e) => setIdleSleep(e.target.checked)}
                  className="rounded text-[#219EBC] focus:ring-0"
                />
                <div>
                  <div className="text-xs font-bold text-slate-800">Idle Sleep</div>
                  <div className="text-[10px] text-slate-400">Drowzy state after 5m</div>
                </div>
              </label>

              <label className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-200/70 bg-slate-50/50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={soundEffects}
                  onChange={(e) => setSoundEffects(e.target.checked)}
                  className="rounded text-[#219EBC] focus:ring-0"
                />
                <div>
                  <div className="text-xs font-bold text-slate-800">Audio Cues</div>
                  <div className="text-[10px] text-slate-400">Hoot audio feedback</div>
                </div>
              </label>
            </div>
          </div>

          {/* Section 2: AI Model & Prompt Engineering */}
          <div className="bg-white border border-slate-200/80 p-6 rounded-2xl shadow-xs space-y-5">
            <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-3 flex items-center gap-2">
              <span>🧠</span> AI Engine & Personality Prompt
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-800 block">AI Reasoning Engine</label>
                <select
                  value={aiModel}
                  onChange={(e) => setAiModel(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-hidden"
                >
                  <option value="deepseek-r1">DeepSeek R1 (Recommended)</option>
                  <option value="gpt-4o">OpenAI GPT-4o</option>
                  <option value="claude-3-5-sonnet">Anthropic Claude 3.5 Sonnet</option>
                  <option value="gemini-1-5-pro">Google Gemini 1.5 Pro</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-800 block">Default Tutor Persona</label>
                <select
                  value={defaultPersona}
                  onChange={(e) => setDefaultPersona(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-hidden"
                >
                  <option value="coding-mentor">Coding Mentor (Detailed & Educational)</option>
                  <option value="code-debugger">Strict Debugger (Direct & Concise)</option>
                  <option value="study-buddy">Encouraging Study Buddy (Casual & Warm)</option>
                  <option value="exam-proctor">Exam Prep Proctor (Question Focus)</option>
                </select>
              </div>
            </div>

            {/* Sliders */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-800">Creativity (Temperature)</span>
                  <span className="text-[#219EBC]">{temperature}</span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="1.0"
                  step="0.05"
                  value={temperature}
                  onChange={(e) => setTemperature(parseFloat(e.target.value))}
                  className="w-full accent-[#219EBC] cursor-pointer"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-800">Max Tokens per Reply</span>
                  <span className="text-[#219EBC]">{maxTokens}</span>
                </div>
                <input
                  type="range"
                  min="512"
                  max="4096"
                  step="256"
                  value={maxTokens}
                  onChange={(e) => setMaxTokens(parseInt(e.target.value))}
                  className="w-full accent-[#219EBC] cursor-pointer"
                />
              </div>
            </div>

            {/* System Prompt Input */}
            <div className="space-y-1.5 pt-2">
              <label className="text-xs font-bold text-slate-800 block">System Prompt / Instructions</label>
              <textarea
                rows={4}
                value={systemPrompt}
                onChange={(e) => setSystemPrompt(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-medium text-slate-800 focus:outline-hidden leading-relaxed"
                placeholder="Enter system prompt for Mr Owl..."
              />
            </div>
          </div>
        </div>

        {/* Right Column: Live Mascot Preview & Customizer */}
        <div className="space-y-6">
          <div className="bg-white border border-slate-200/80 p-6 rounded-2xl shadow-xs space-y-6">
            <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-3 flex items-center gap-2">
              <span>🎨</span> Mascot Appearance & Live Preview
            </h3>

            {/* Preview Box */}
            <div className="bg-slate-900 rounded-2xl p-8 flex flex-col items-center justify-center relative overflow-hidden space-y-4">
              <div className="absolute top-3 left-3 bg-white/10 text-white text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded">
                Live Mascot Preview
              </div>

              <div className="w-28 h-28 relative flex items-center justify-center pt-2">
                {/* SVG Mascot Preview */}
                <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-lg">
                  {/* Feet */}
                  <path d="M 38 82 L 35 90 M 42 82 L 42 90 M 46 82 L 49 90" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round" />
                  <path d="M 54 82 L 51 90 M 58 82 L 58 90 M 62 82 L 65 90" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round" />
                  
                  {/* Body */}
                  <ellipse cx="50" cy="55" rx="28" ry="30" fill={
                    defaultSkin === "woodland" ? "#78350F" :
                    defaultSkin === "crimson" ? "#E11D48" :
                    defaultSkin === "golden" ? "#F59E0B" :
                    defaultSkin === "stealth" ? "#334155" :
                    defaultSkin === "neon" ? "#10B981" : "#06B6D4"
                  } />
                  <ellipse cx="50" cy="58" rx="18" ry="20" fill="#FEF3C7" opacity="0.9" />

                  {/* Eyes */}
                  <circle cx="40" cy="45" r="9" fill="white" />
                  <circle cx="60" cy="45" r="9" fill="white" />
                  <circle cx="41" cy="45" r="4.5" fill="#0F172A" />
                  <circle cx="61" cy="45" r="4.5" fill="#0F172A" />
                  <circle cx="42.5" cy="43.5" r="1.5" fill="white" />
                  <circle cx="62.5" cy="43.5" r="1.5" fill="white" />

                  {/* Beak */}
                  <path d="M 46 51 Q 50 58 54 51 Z" fill="#F59E0B" />

                  {/* Glasses */}
                  {showGlasses && (
                    <g stroke="#0F172A" strokeWidth="2" fill="none">
                      <circle cx="40" cy="45" r="10" />
                      <circle cx="60" cy="45" r="10" />
                      <line x1="50" y1="45" x2="50" y2="45" />
                    </g>
                  )}

                  {/* Graduation Cap */}
                  {showHat && (
                    <g>
                      <polygon points="50,15 20,26 50,34 80,26" fill="#1E293B" />
                      <polygon points="35,28 35,36 65,36 65,28" fill="#0F172A" />
                      <line x1="72" y1="28" x2="76" y2="38" stroke="#F59E0B" strokeWidth="1.5" />
                      <circle cx="76" cy="39" r="1.5" fill="#F59E0B" />
                    </g>
                  )}
                </svg>

                {/* Mug overlay */}
                {showMug && (
                  <div className="absolute bottom-1 right-3 text-lg select-none">☕</div>
                )}
              </div>

              <div className="text-center space-y-0.5">
                <div className="text-xs font-bold text-white tracking-wide">Mr Owl AI</div>
                <div className="text-[10px] font-semibold text-cyan-400 uppercase tracking-widest">
                  {skinColors[defaultSkin]?.name || "Classic"}
                </div>
              </div>
            </div>

            {/* Skins Selection */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-800 block">Default Color Skin</label>
              <div className="grid grid-cols-3 gap-2">
                {Object.entries(skinColors).map(([key, item]) => (
                  <button
                    key={key}
                    onClick={() => setDefaultSkin(key)}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      defaultSkin === key
                        ? "border-[#219EBC] bg-cyan-50/50 ring-2 ring-[#219EBC]/20"
                        : "border-slate-200 bg-white hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div className={`w-3.5 h-3.5 rounded-full ${item.bg} shrink-0`} />
                      <span className="text-[10px] font-bold text-slate-800 truncate">{item.name}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Accessories Toggles */}
            <div className="space-y-2 pt-2">
              <label className="text-xs font-bold text-slate-800 block">Default Accessories</label>
              <div className="space-y-2">
                <label className="flex items-center justify-between p-2.5 rounded-xl border border-slate-200 bg-slate-50/50 cursor-pointer">
                  <span className="text-xs font-semibold text-slate-800">🎓 Graduation Cap</span>
                  <input
                    type="checkbox"
                    checked={showHat}
                    onChange={(e) => setShowHat(e.target.checked)}
                    className="rounded text-[#219EBC]"
                  />
                </label>

                <label className="flex items-center justify-between p-2.5 rounded-xl border border-slate-200 bg-slate-50/50 cursor-pointer">
                  <span className="text-xs font-semibold text-slate-800">👓 Academic Glasses</span>
                  <input
                    type="checkbox"
                    checked={showGlasses}
                    onChange={(e) => setShowGlasses(e.target.checked)}
                    className="rounded text-[#219EBC]"
                  />
                </label>

                <label className="flex items-center justify-between p-2.5 rounded-xl border border-slate-200 bg-slate-50/50 cursor-pointer">
                  <span className="text-xs font-semibold text-slate-800">☕ Coffee Mug</span>
                  <input
                    type="checkbox"
                    checked={showMug}
                    onChange={(e) => setShowMug(e.target.checked)}
                    className="rounded text-[#219EBC]"
                  />
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
