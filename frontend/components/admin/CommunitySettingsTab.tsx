"use client";

import React, { useState } from "react";

export const CommunitySettingsTab: React.FC = () => {
  const [communityTitle, setCommunityTitle] = useState("Join Deep Code Community");
  const [communitySubtitle, setCommunitySubtitle] = useState(
    "Connect with thousands of student developers, share projects, participate in hackathons, and learn together."
  );

  // Links
  const [discordUrl, setDiscordUrl] = useState("https://discord.gg/deepcode");
  const [telegramUrl, setTelegramUrl] = useState("https://t.me/deepcode_ai");
  const [githubUrl, setGithubUrl] = useState("https://github.com/infoali014-eng");
  const [twitterUrl, setTwitterUrl] = useState("https://x.com/deepcode_ai");
  const [youtubeUrl, setYoutubeUrl] = useState("https://youtube.com/@deepcode_ai");

  // Statistics Display Metrics
  const [memberCount, setMemberCount] = useState("12,450+");
  const [activeCoders, setActiveCoders] = useState("1,820");
  const [projectsBuilt, setProjectsBuilt] = useState("3,400+");

  // Announcement
  const [broadcastMessage, setBroadcastMessage] = useState(
    "🔥 Next Deep Code AI Hackathon starts on Friday! Register your team early."
  );
  const [broadcastBadge, setBroadcastBadge] = useState("ANNOUNCEMENT");
  const [isBroadcastActive, setIsBroadcastActive] = useState(true);

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

  return (
    <div className="space-y-8 animate-fade-in select-text">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <span>👥</span> Join Deep Code Community Management
          </h2>
          <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mt-1">
            Manage social channels, community metrics, developer broadcasts, & join portal settings
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-[#219EBC] hover:bg-[#1a849e] text-white font-bold text-xs sm:text-sm px-5 py-3 rounded-xl shadow-xs cursor-pointer transition-all flex items-center gap-2 justify-center"
        >
          {saving ? "Saving Changes..." : "Save Community Portal"}
        </button>
      </div>

      {savedMessage && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-extrabold px-4 py-3 rounded-xl flex items-center justify-between animate-fade-in">
          <span>✓ Community Portal settings updated successfully! Live portal links synced.</span>
          <button onClick={() => setSavedMessage(false)} className="text-emerald-600 hover:text-emerald-950 font-black">
            ✕
          </button>
        </div>
      )}

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-xs space-y-1.5">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Displayed Members</span>
          <input
            type="text"
            value={memberCount}
            onChange={(e) => setMemberCount(e.target.value)}
            className="w-full text-xl font-black text-slate-900 bg-slate-50 border border-slate-200 p-2 rounded-xl focus:outline-hidden"
          />
        </div>

        <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-xs space-y-1.5">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Active Coders Online</span>
          <input
            type="text"
            value={activeCoders}
            onChange={(e) => setActiveCoders(e.target.value)}
            className="w-full text-xl font-black text-slate-900 bg-slate-50 border border-slate-200 p-2 rounded-xl focus:outline-hidden"
          />
        </div>

        <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-xs space-y-1.5">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Projects Built</span>
          <input
            type="text"
            value={projectsBuilt}
            onChange={(e) => setProjectsBuilt(e.target.value)}
            className="w-full text-xl font-black text-slate-900 bg-slate-50 border border-slate-200 p-2 rounded-xl focus:outline-hidden"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column: Community Links */}
        <div className="bg-white border border-slate-200/80 p-6 rounded-2xl shadow-xs space-y-5">
          <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-3 flex items-center gap-2">
            <span>🔗</span> Official Platform Invite Links
          </h3>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-800 flex items-center gap-2">
                <span>👾</span> Discord Server Invite URL
              </label>
              <input
                type="url"
                value={discordUrl}
                onChange={(e) => setDiscordUrl(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-hidden"
                placeholder="https://discord.gg/..."
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-800 flex items-center gap-2">
                <span>✈️</span> Telegram Channel / Group URL
              </label>
              <input
                type="url"
                value={telegramUrl}
                onChange={(e) => setTelegramUrl(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-hidden"
                placeholder="https://t.me/..."
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-800 flex items-center gap-2">
                <span>🐙</span> GitHub Organization / Repo
              </label>
              <input
                type="url"
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-hidden"
                placeholder="https://github.com/..."
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-800 flex items-center gap-2">
                <span>𝕏</span> Twitter / X Profile URL
              </label>
              <input
                type="url"
                value={twitterUrl}
                onChange={(e) => setTwitterUrl(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-hidden"
                placeholder="https://x.com/..."
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-800 flex items-center gap-2">
                <span>📺</span> YouTube Channel URL
              </label>
              <input
                type="url"
                value={youtubeUrl}
                onChange={(e) => setYoutubeUrl(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-hidden"
                placeholder="https://youtube.com/..."
              />
            </div>
          </div>
        </div>

        {/* Right Column: Portal Content & Broadcast */}
        <div className="space-y-6">
          {/* Header Copy */}
          <div className="bg-white border border-slate-200/80 p-6 rounded-2xl shadow-xs space-y-4">
            <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-3 flex items-center gap-2">
              <span>✍️</span> Portal Header & Copy
            </h3>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-800 block">Main Headline</label>
              <input
                type="text"
                value={communityTitle}
                onChange={(e) => setCommunityTitle(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-hidden"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-800 block">Sub-headline / Description</label>
              <textarea
                rows={3}
                value={communitySubtitle}
                onChange={(e) => setCommunitySubtitle(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-hidden leading-relaxed"
              />
            </div>
          </div>

          {/* Broadcast Banner */}
          <div className="bg-white border border-slate-200/80 p-6 rounded-2xl shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <span>📢</span> Community Sticky Broadcast
              </h3>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={isBroadcastActive}
                  onChange={(e) => setIsBroadcastActive(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-slate-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#219EBC]" />
              </label>
            </div>

            <div className="space-y-3">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-800 block">Badge Tag</label>
                <input
                  type="text"
                  value={broadcastBadge}
                  onChange={(e) => setBroadcastBadge(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-extrabold uppercase text-slate-800 focus:outline-hidden"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-800 block">Broadcast Message</label>
                <textarea
                  rows={2}
                  value={broadcastMessage}
                  onChange={(e) => setBroadcastMessage(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-hidden leading-relaxed"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
