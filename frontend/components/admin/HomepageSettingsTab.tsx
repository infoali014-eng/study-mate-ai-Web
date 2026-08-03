"use client";

import React, { useState, useEffect } from "react";
import {
  DBHomepageNavItem,
  DBHomepageHighlight,
  DBHomepageProduct,
  DBHomepageFooterSection,
  DBHomepageAnnouncement,
  ProductStatus,
} from "@/types/admin.types";
import {
  getHomepageSettings,
  updateHomepageSettings,
  getHomepageNavItems,
  upsertNavItems,
  deleteNavItem,
  getHomepageHighlights,
  upsertHighlightItems,
  deleteHighlightItem,
  getHomepageProducts,
  upsertProductItems,
  deleteProductItem,
  getHomepageFooterSections,
  upsertFooterSection,
  deleteFooterSection,
  upsertFooterLink,
  deleteFooterLink,
  getHomepageAnnouncements,
  upsertAnnouncement,
} from "@/lib/api/cms";
import { MediaUploader } from "./MediaUploader";
import { StatusBadge } from "@/components/ui/StatusBadge";

export const HomepageSettingsTab: React.FC = () => {
  const [subTab, setSubTab] = useState<
    "general" | "theme" | "hero" | "announcement" | "navigation" | "highlights" | "products" | "footer"
  >("general");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Settings & Visibility State
  const [visibility, setVisibility] = useState({
    announcement: true,
    hero: true,
    highlights: true,
    products: true,
    footer: true,
  });

  // Theme & SEO State
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] = useState("");
  const [ogImageUrl, setOgImageUrl] = useState("");
  const [keywords, setKeywords] = useState("");
  const [canonicalUrl, setCanonicalUrl] = useState("");
  const [themePrimary, setThemePrimary] = useState("#0F172A");
  const [themeAccent, setThemeAccent] = useState("#219EBC");
  const [themeRadius, setThemeRadius] = useState("1rem");

  // Hero State
  const [heroBadge, setHeroBadge] = useState("");
  const [heroTitle, setHeroTitle] = useState("");
  const [heroSubtitle, setHeroSubtitle] = useState("");
  const [primaryBtnText, setPrimaryBtnText] = useState("");
  const [primaryBtnUrl, setPrimaryBtnUrl] = useState("");
  const [secondaryBtnText, setSecondaryBtnText] = useState("");
  const [secondaryBtnUrl, setSecondaryBtnUrl] = useState("");
  const [heroMediaType, setHeroMediaType] = useState<"logo" | "image" | "video" | "illustration" | "none">("logo");
  const [heroMediaUrl, setHeroMediaUrl] = useState("");

  // Announcement State
  const [announcement, setAnnouncement] = useState<DBHomepageAnnouncement | null>(null);
  const [annTitle, setAnnTitle] = useState("");
  const [annBadge, setAnnBadge] = useState("");
  const [annLinkText, setAnnLinkText] = useState("");
  const [annLinkUrl, setAnnLinkUrl] = useState("");
  const [annIsActive, setAnnIsActive] = useState(true);

  // Builders State
  const [navItems, setNavItems] = useState<DBHomepageNavItem[]>([]);
  const [highlights, setHighlights] = useState<DBHomepageHighlight[]>([]);
  const [products, setProducts] = useState<DBHomepageProduct[]>([]);
  const [footerSections, setFooterSections] = useState<DBHomepageFooterSection[]>([]);
  const [footerDesc, setFooterDesc] = useState("");
  const [copyrightText, setCopyrightText] = useState("");

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [
        settData,
        navData,
        hlData,
        prodData,
        ftData,
        annData,
      ] = await Promise.all([
        getHomepageSettings(),
        getHomepageNavItems(),
        getHomepageHighlights(),
        getHomepageProducts(),
        getHomepageFooterSections(),
        getHomepageAnnouncements(),
      ]);

      if (settData) {
        setHeroTitle(settData.hero_title || "Learn.\nBuild.\nGrow Together.");
        setHeroSubtitle(settData.hero_subtitle || "");
        setHeroBadge(settData.hero_badge || "🚀 Empowering Developers. Building Tomorrow.");
        setPrimaryBtnText(settData.hero_primary_btn_text || "Get Started");
        setPrimaryBtnUrl(settData.hero_primary_btn_url || "/signup");
        setSecondaryBtnText(settData.hero_secondary_btn_text || "Explore Courses");
        setSecondaryBtnUrl(settData.hero_secondary_btn_url || "/courses");
        setHeroMediaType(settData.hero_media_type || "logo");
        setHeroMediaUrl(settData.hero_media_url || "/branding/deepcode/logo.png");
        setSeoTitle(settData.seo_title || "Deep Code - Interactive Developer Platform");
        setSeoDescription(settData.seo_description || "Learn in-depth, build real-world projects, and grow together.");
        setOgImageUrl(settData.og_image_url || "/branding/deepcode/logo.png");
        setKeywords(settData.keywords || "deepcode, programming, c#, compiler engineering");
        setCanonicalUrl(settData.canonical_url || "https://deepcode.ai");
        setThemePrimary(settData.theme_primary || "#0F172A");
        setThemeAccent(settData.theme_accent || "#219EBC");
        setThemeRadius(settData.theme_radius || "1rem");
        setFooterDesc(settData.footer_description || "Pioneering the next dimension of developer tools and interactive learning.");
        setCopyrightText(settData.copyright_text || "© 2026 Deep Code. All rights reserved.");
        if (settData.visibility_flags) {
          setVisibility((prev) => ({ ...prev, ...settData.visibility_flags }));
        }
      }

      setNavItems(navData);
      setHighlights(hlData);
      setProducts(prodData);
      setFooterSections(ftData);

      if (annData) {
        setAnnouncement(annData);
        setAnnTitle(annData.title);
        setAnnBadge(annData.badge_text || "");
        setAnnLinkText(annData.link_text || "");
        setAnnLinkUrl(annData.link_url || "");
        setAnnIsActive(annData.is_active);
      }
    } catch (err) {
      console.error("[HomepageSettingsTab] Load error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  const handleSaveGeneralAndHero = async () => {
    setSaving(true);
    try {
      await updateHomepageSettings({
        hero_title: heroTitle,
        hero_subtitle: heroSubtitle,
        hero_badge: heroBadge,
        hero_primary_btn_text: primaryBtnText,
        hero_primary_btn_url: primaryBtnUrl,
        hero_secondary_btn_text: secondaryBtnText,
        hero_secondary_btn_url: secondaryBtnUrl,
        hero_media_type: heroMediaType,
        hero_media_url: heroMediaUrl,
        seo_title: seoTitle,
        seo_description: seoDescription,
        og_image_url: ogImageUrl,
        keywords,
        canonical_url: canonicalUrl,
        theme_primary: themePrimary,
        theme_accent: themeAccent,
        theme_radius: themeRadius,
        visibility_flags: visibility,
        footer_description: footerDesc,
        copyright_text: copyrightText,
      });

      if (annTitle) {
        await upsertAnnouncement({
          id: announcement?.id,
          title: annTitle,
          badge_text: annBadge,
          link_text: annLinkText,
          link_url: annLinkUrl,
          is_active: annIsActive,
        });
      }

      alert("Homepage Settings saved successfully!");
      await loadAllData();
    } catch (err: unknown) {
      console.error("[HomepageSettingsTab] Save error:", err);
      const msg = err instanceof Error ? err.message : "An unexpected error occurred.";
      alert(`Failed to save settings: ${msg}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-16 text-xs font-bold text-slate-400 uppercase tracking-widest">
        Loading Homepage Builder CMS...
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in select-none">
      {/* Tab Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Homepage Page Builder</h2>
          <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mt-1">
            Fully CMS-driven landing page architecture
          </p>
        </div>

        <button
          onClick={handleSaveGeneralAndHero}
          disabled={saving}
          className="bg-slate-950 hover:bg-slate-800 text-white font-extrabold text-xs sm:text-sm px-6 py-3 rounded-xl transition-all shadow-xs cursor-pointer disabled:opacity-50"
        >
          {saving ? "Saving Changes..." : "✓ Publish Changes"}
        </button>
      </div>

      {/* Sub-tabs Navigation */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200/80 pb-2">
        {[
          { id: "general", label: "⚙️ General & SEO" },
          { id: "theme", label: "🎨 Theme Engine" },
          { id: "hero", label: "🚀 Hero & Media" },
          { id: "announcement", label: "📢 Announcements" },
          { id: "navigation", label: "🧭 Navigation Links" },
          { id: "highlights", label: "✨ Highlight Cards" },
          { id: "products", label: "📦 Ecosystem Products" },
          { id: "footer", label: "🦶 Footer Builder" },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setSubTab(t.id as typeof subTab)}
            className={`px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
              subTab === t.id
                ? "bg-slate-900 text-white shadow-xs"
                : "bg-white text-slate-600 hover:text-slate-950 border border-slate-200/70"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* 1. GENERAL & SEO TAB */}
      {subTab === "general" && (
        <div className="bg-white border border-slate-200 p-6 sm:p-8 rounded-2xl space-y-6 shadow-xs">
          <h3 className="text-base font-extrabold text-slate-900">SEO & Section Visibility Controls</h3>

          {/* Visibility Toggles */}
          <div className="space-y-3 bg-slate-50 p-5 rounded-2xl border border-slate-200/60">
            <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Section Visibility Toggles</h4>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 pt-1 text-xs font-bold text-slate-700">
              {Object.keys(visibility).map((key) => (
                <label key={key} className="flex items-center gap-2 cursor-pointer capitalize">
                  <input
                    type="checkbox"
                    checked={visibility[key as keyof typeof visibility]}
                    onChange={(e) =>
                      setVisibility((prev) => ({
                        ...prev,
                        [key]: e.target.checked,
                      }))
                    }
                    className="w-4 h-4 rounded border-slate-300 text-slate-900 focus:ring-0"
                  />
                  <span>{key}</span>
                </label>
              ))}
            </div>
          </div>

          {/* SEO Input Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">SEO Page Title</label>
              <input
                type="text"
                value={seoTitle}
                onChange={(e) => setSeoTitle(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Canonical URL</label>
              <input
                type="text"
                value={canonicalUrl}
                onChange={(e) => setCanonicalUrl(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold"
              />
            </div>

            <div className="sm:col-span-2 space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Meta Description</label>
              <textarea
                rows={2}
                value={seoDescription}
                onChange={(e) => setSeoDescription(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-200 text-xs sm:text-sm font-medium resize-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Keywords (Comma Separated)</label>
              <input
                type="text"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">OG Image Link</label>
              <input
                type="text"
                value={ogImageUrl}
                onChange={(e) => setOgImageUrl(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold"
              />
            </div>
          </div>
        </div>
      )}

      {/* 2. THEME ENGINE TAB */}
      {subTab === "theme" && (
        <div className="bg-white border border-slate-200 p-6 sm:p-8 rounded-2xl space-y-6 shadow-xs">
          <h3 className="text-base font-extrabold text-slate-900">Design System & Theme Tokens</h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Primary Brand Color</label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={themePrimary}
                  onChange={(e) => setThemePrimary(e.target.value)}
                  className="w-10 h-10 rounded-xl border-none cursor-pointer"
                />
                <input
                  type="text"
                  value={themePrimary}
                  onChange={(e) => setThemePrimary(e.target.value)}
                  className="flex-grow p-3 rounded-xl border border-slate-200 text-xs font-bold uppercase"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Accent Color</label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={themeAccent}
                  onChange={(e) => setThemeAccent(e.target.value)}
                  className="w-10 h-10 rounded-xl border-none cursor-pointer"
                />
                <input
                  type="text"
                  value={themeAccent}
                  onChange={(e) => setThemeAccent(e.target.value)}
                  className="flex-grow p-3 rounded-xl border border-slate-200 text-xs font-bold uppercase"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Default Border Radius</label>
              <input
                type="text"
                value={themeRadius}
                onChange={(e) => setThemeRadius(e.target.value)}
                placeholder="1rem"
                className="w-full p-3 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold"
              />
            </div>
          </div>
        </div>
      )}

      {/* 3. HERO & MEDIA TAB */}
      {subTab === "hero" && (
        <div className="bg-white border border-slate-200 p-6 sm:p-8 rounded-2xl space-y-6 shadow-xs">
          <h3 className="text-base font-extrabold text-slate-900">Hero Section & Media Configuration</h3>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Hero Pill Badge</label>
              <input
                type="text"
                value={heroBadge}
                onChange={(e) => setHeroBadge(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Main Headline</label>
              <textarea
                rows={2}
                value={heroTitle}
                onChange={(e) => setHeroTitle(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-200 text-sm font-bold resize-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Supporting Paragraph</label>
              <textarea
                rows={3}
                value={heroSubtitle}
                onChange={(e) => setHeroSubtitle(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-200 text-xs sm:text-sm font-medium resize-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Primary Button Text</label>
                <input
                  type="text"
                  value={primaryBtnText}
                  onChange={(e) => setPrimaryBtnText(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs font-semibold"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Primary Button URL</label>
                <input
                  type="text"
                  value={primaryBtnUrl}
                  onChange={(e) => setPrimaryBtnUrl(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs font-semibold"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Secondary Button Text</label>
                <input
                  type="text"
                  value={secondaryBtnText}
                  onChange={(e) => setSecondaryBtnText(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs font-semibold"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Secondary Button URL</label>
                <input
                  type="text"
                  value={secondaryBtnUrl}
                  onChange={(e) => setSecondaryBtnUrl(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs font-semibold"
                />
              </div>
            </div>

            {/* Media Type & Upload */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Right Media Type</label>
                <select
                  value={heroMediaType}
                  onChange={(e) => setHeroMediaType(e.target.value as typeof heroMediaType)}
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs font-bold bg-white"
                >
                  <option value="logo">Logo (Centered)</option>
                  <option value="image">Custom Image</option>
                  <option value="video">Embedded Video</option>
                  <option value="illustration">Vector Illustration</option>
                  <option value="none">None</option>
                </select>
              </div>

              <MediaUploader
                label="Hero Graphic / Logo Upload"
                value={heroMediaUrl}
                onChange={setHeroMediaUrl}
                accept="image/*"
              />
            </div>
          </div>
        </div>
      )}

      {/* 4. ANNOUNCEMENTS TAB */}
      {subTab === "announcement" && (
        <div className="bg-white border border-slate-200 p-6 sm:p-8 rounded-2xl space-y-6 shadow-xs">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-extrabold text-slate-900">Top Announcement Banner</h3>
            <label className="flex items-center gap-2 cursor-pointer text-xs font-extrabold text-slate-700">
              <input
                type="checkbox"
                checked={annIsActive}
                onChange={(e) => setAnnIsActive(e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 text-slate-900 focus:ring-0"
              />
              <span>Banner Active</span>
            </label>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Announcement Title *</label>
              <input
                type="text"
                value={annTitle}
                onChange={(e) => setAnnTitle(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Badge Text</label>
                <input
                  type="text"
                  value={annBadge}
                  onChange={(e) => setAnnBadge(e.target.value)}
                  placeholder="NEW"
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs font-semibold"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Link Text</label>
                <input
                  type="text"
                  value={annLinkText}
                  onChange={(e) => setAnnLinkText(e.target.value)}
                  placeholder="Explore Courses"
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs font-semibold"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Link URL</label>
                <input
                  type="text"
                  value={annLinkUrl}
                  onChange={(e) => setAnnLinkUrl(e.target.value)}
                  placeholder="/courses"
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs font-semibold"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. NAVIGATION BUILDER TAB */}
      {subTab === "navigation" && (
        <div className="bg-white border border-slate-200 p-6 sm:p-8 rounded-2xl space-y-6 shadow-xs">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-extrabold text-slate-900">Header Navigation Menu Items</h3>
            <button
              onClick={() => {
                setNavItems([
                  ...navItems,
                  {
                    id: `nav-${Date.now()}`,
                    label: "New Page",
                    url: "/",
                    order: navItems.length + 1,
                    is_hidden: false,
                  },
                ]);
              }}
              className="bg-slate-900 text-white font-bold text-xs px-3.5 py-2 rounded-xl hover:bg-slate-800 transition-colors"
            >
              + Add Nav Item
            </button>
          </div>

          <div className="space-y-3">
            {navItems.map((item, idx) => (
              <div
                key={item.id}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row items-center gap-4"
              >
                <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                  <span>#{idx + 1}</span>
                </div>

                <input
                  type="text"
                  value={item.label}
                  onChange={(e) => {
                    const updated = [...navItems];
                    updated[idx].label = e.target.value;
                    setNavItems(updated);
                  }}
                  className="flex-grow p-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-bold bg-white"
                  placeholder="Label"
                />

                <input
                  type="text"
                  value={item.url}
                  onChange={(e) => {
                    const updated = [...navItems];
                    updated[idx].url = e.target.value;
                    setNavItems(updated);
                  }}
                  className="flex-grow p-2.5 rounded-xl border border-slate-200 text-xs font-semibold bg-white"
                  placeholder="URL (/courses)"
                />

                <label className="flex items-center gap-1.5 text-xs font-bold text-slate-600 shrink-0 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={item.is_hidden}
                    onChange={(e) => {
                      const updated = [...navItems];
                      updated[idx].is_hidden = e.target.checked;
                      setNavItems(updated);
                    }}
                    className="w-4 h-4 rounded border-slate-300 text-slate-900 focus:ring-0"
                  />
                  <span>Hide</span>
                </label>

                <button
                  onClick={async () => {
                    if (confirm("Delete this navigation link?")) {
                      await deleteNavItem(item.id);
                      setNavItems(navItems.filter((n) => n.id !== item.id));
                    }
                  }}
                  className="text-xs font-bold text-rose-600 hover:text-rose-800 cursor-pointer shrink-0"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>

          <div className="pt-2 flex justify-end">
            <button
              onClick={async () => {
                await upsertNavItems(navItems);
                alert("Navigation menu saved successfully!");
              }}
              className="bg-slate-900 text-white font-bold text-xs px-4 py-2.5 rounded-xl hover:bg-slate-800 transition-colors"
            >
              Save Navigation Menu
            </button>
          </div>
        </div>
      )}

      {/* 6. HIGHLIGHTS BUILDER TAB */}
      {subTab === "highlights" && (
        <div className="bg-white border border-slate-200 p-6 sm:p-8 rounded-2xl space-y-6 shadow-xs">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-extrabold text-slate-900">Feature Highlight Cards (Below Hero)</h3>
            <button
              onClick={() => {
                setHighlights([
                  ...highlights,
                  {
                    id: `hl-${Date.now()}`,
                    icon: "Code2",
                    title: "New Highlight",
                    description: "Short description of the feature.",
                    order: highlights.length + 1,
                    is_hidden: false,
                  },
                ]);
              }}
              className="bg-slate-900 text-white font-bold text-xs px-3.5 py-2 rounded-xl hover:bg-slate-800 transition-colors"
            >
              + Add Highlight Card
            </button>
          </div>

          <div className="space-y-4">
            {highlights.map((hl, idx) => (
              <div key={hl.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-xs font-bold text-slate-400">Card #{idx + 1}</span>
                  <button
                    onClick={async () => {
                      if (confirm("Delete this highlight card?")) {
                        await deleteHighlightItem(hl.id);
                        setHighlights(highlights.filter((h) => h.id !== hl.id));
                      }
                    }}
                    className="text-xs font-bold text-rose-600 hover:text-rose-800 cursor-pointer"
                  >
                    Delete Card
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <input
                    type="text"
                    value={hl.title}
                    onChange={(e) => {
                      const updated = [...highlights];
                      updated[idx].title = e.target.value;
                      setHighlights(updated);
                    }}
                    placeholder="Title"
                    className="p-2.5 rounded-xl border border-slate-200 text-xs font-bold bg-white"
                  />
                  <input
                    type="text"
                    value={hl.description}
                    onChange={(e) => {
                      const updated = [...highlights];
                      updated[idx].description = e.target.value;
                      setHighlights(updated);
                    }}
                    placeholder="Short Description"
                    className="sm:col-span-2 p-2.5 rounded-xl border border-slate-200 text-xs font-medium bg-white"
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 flex justify-end">
            <button
              onClick={async () => {
                await upsertHighlightItems(highlights);
                alert("Highlight Cards saved successfully!");
              }}
              className="bg-slate-900 text-white font-bold text-xs px-4 py-2.5 rounded-xl hover:bg-slate-800 transition-colors"
            >
              Save Highlight Cards
            </button>
          </div>
        </div>
      )}

      {/* 7. PRODUCTS BUILDER TAB */}
      {subTab === "products" && (
        <div className="bg-white border border-slate-200 p-6 sm:p-8 rounded-2xl space-y-6 shadow-xs">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-extrabold text-slate-900">Ecosystem Products Cards</h3>
            <button
              onClick={() => {
                setProducts([
                  ...products,
                  {
                    id: `prod-${Date.now()}`,
                    title: "New Product",
                    description: "Product description...",
                    status: "beta",
                    logo_url: "/branding/deepcode/logo.png",
                    button_text: "Learn More",
                    button_url: "/",
                    order: products.length + 1,
                    is_hidden: false,
                  },
                ]);
              }}
              className="bg-slate-900 text-white font-bold text-xs px-3.5 py-2 rounded-xl hover:bg-slate-800 transition-colors"
            >
              + Add Ecosystem Product
            </button>
          </div>

          <div className="space-y-6">
            {products.map((prod, idx) => (
              <div key={prod.id} className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-slate-400">Product #{idx + 1}</span>
                    <StatusBadge status={prod.status} />
                  </div>

                  <button
                    onClick={async () => {
                      if (confirm("Delete this product card?")) {
                        await deleteProductItem(prod.id);
                        setProducts(products.filter((p) => p.id !== prod.id));
                      }
                    }}
                    className="text-xs font-bold text-rose-600 hover:text-rose-800 cursor-pointer"
                  >
                    Delete Product
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Product Title</label>
                    <input
                      type="text"
                      value={prod.title}
                      onChange={(e) => {
                        const updated = [...products];
                        updated[idx].title = e.target.value;
                        setProducts(updated);
                      }}
                      className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-bold bg-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Status Badge</label>
                    <select
                      value={prod.status}
                      onChange={(e) => {
                        const updated = [...products];
                        updated[idx].status = e.target.value as ProductStatus;
                        setProducts(updated);
                      }}
                      className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-bold bg-white"
                    >
                      <option value="active">Active</option>
                      <option value="coming_soon">Coming Soon</option>
                      <option value="beta">Beta</option>
                      <option value="new">New</option>
                      <option value="updated">Updated</option>
                      <option value="maintenance">Maintenance</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2 space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Description</label>
                    <textarea
                      rows={2}
                      value={prod.description}
                      onChange={(e) => {
                        const updated = [...products];
                        updated[idx].description = e.target.value;
                        setProducts(updated);
                      }}
                      className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-medium bg-white resize-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Button Text</label>
                    <input
                      type="text"
                      value={prod.button_text}
                      onChange={(e) => {
                        const updated = [...products];
                        updated[idx].button_text = e.target.value;
                        setProducts(updated);
                      }}
                      className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-semibold bg-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Button Target URL</label>
                    <input
                      type="text"
                      value={prod.button_url}
                      onChange={(e) => {
                        const updated = [...products];
                        updated[idx].button_url = e.target.value;
                        setProducts(updated);
                      }}
                      className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-semibold bg-white"
                    />
                  </div>
                </div>

                <MediaUploader
                  label="Product Logo / Icon Upload"
                  value={prod.logo_url || ""}
                  onChange={(newUrl) => {
                    const updated = [...products];
                    updated[idx].logo_url = newUrl;
                    setProducts(updated);
                  }}
                />
              </div>
            ))}
          </div>

          <div className="pt-2 flex justify-end">
            <button
              onClick={async () => {
                await upsertProductItems(products);
                alert("Ecosystem Products saved successfully!");
              }}
              className="bg-slate-900 text-white font-bold text-xs px-4 py-2.5 rounded-xl hover:bg-slate-800 transition-colors"
            >
              Save Product Cards
            </button>
          </div>
        </div>
      )}

      {/* 8. FOOTER BUILDER TAB */}
      {subTab === "footer" && (
        <div className="bg-white border border-slate-200 p-6 sm:p-8 rounded-2xl space-y-6 shadow-xs">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-extrabold text-slate-900">Dynamic Footer Sections & Links</h3>
            <button
              onClick={async () => {
                const title = prompt("Enter section column title:", "New Section");
                if (title) {
                  const sec = await upsertFooterSection(title, footerSections.length + 1);
                  setFooterSections([...footerSections, { ...sec, links: [] }]);
                }
              }}
              className="bg-slate-900 text-white font-bold text-xs px-3.5 py-2 rounded-xl hover:bg-slate-800 transition-colors"
            >
              + Add Footer Column
            </button>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Footer Brand Description</label>
              <textarea
                rows={2}
                value={footerDesc}
                onChange={(e) => setFooterDesc(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-200 text-xs sm:text-sm font-medium resize-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Copyright Text</label>
              <input
                type="text"
                value={copyrightText}
                onChange={(e) => setCopyrightText(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold"
              />
            </div>

            <div className="space-y-6 pt-4 border-t border-slate-100">
              {footerSections.map((sec, secIdx) => (
                <div key={sec.id} className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-4">
                  <div className="flex items-center justify-between gap-4">
                    <div className="font-extrabold text-sm text-slate-900">{sec.title} Column</div>
                    <button
                      onClick={async () => {
                        if (confirm(`Delete footer column "${sec.title}" and all its links?`)) {
                          await deleteFooterSection(sec.id);
                          setFooterSections(footerSections.filter((s) => s.id !== sec.id));
                        }
                      }}
                      className="text-xs font-bold text-rose-600 hover:text-rose-800 cursor-pointer"
                    >
                      Delete Section
                    </button>
                  </div>

                  <div className="space-y-2">
                    {(sec.links || []).map((link, lIdx) => (
                      <div key={link.id} className="flex items-center gap-3">
                        <input
                          type="text"
                          value={link.label}
                          onChange={(e) => {
                            const updated = [...footerSections];
                            updated[secIdx].links![lIdx].label = e.target.value;
                            setFooterSections(updated);
                          }}
                          placeholder="Link Label"
                          className="flex-grow p-2 rounded-xl border border-slate-200 text-xs font-bold bg-white"
                        />
                        <input
                          type="text"
                          value={link.url}
                          onChange={(e) => {
                            const updated = [...footerSections];
                            updated[secIdx].links![lIdx].url = e.target.value;
                            setFooterSections(updated);
                          }}
                          placeholder="URL"
                          className="flex-grow p-2 rounded-xl border border-slate-200 text-xs font-semibold bg-white"
                        />
                        <button
                          onClick={async () => {
                            await deleteFooterLink(link.id);
                            const updated = [...footerSections];
                            updated[secIdx].links = updated[secIdx].links!.filter((l) => l.id !== link.id);
                            setFooterSections(updated);
                          }}
                          className="text-xs font-bold text-rose-600 hover:text-rose-800 cursor-pointer shrink-0"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={async () => {
                      const label = prompt("Link label:", "New Link");
                      const url = prompt("Link URL:", "/");
                      if (label && url) {
                        const newLnk = await upsertFooterLink(sec.id, label, url, (sec.links?.length || 0) + 1);
                        const updated = [...footerSections];
                        updated[secIdx].links = [...(updated[secIdx].links || []), newLnk];
                        setFooterSections(updated);
                      }
                    }}
                    className="text-xs font-bold text-[#219EBC] hover:underline cursor-pointer"
                  >
                    + Add Link to {sec.title}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
