import React from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Container } from "@/components/landing/Container";
import { Hero } from "@/components/landing/Hero";
import { Section } from "@/components/landing/Section";
import { HighlightCards } from "@/components/landing/HighlightCards";
import { FeatureCard } from "@/components/landing/FeatureCard";
import { Footer } from "@/components/landing/Footer";
import { HeaderAuth } from "@/components/landing/HeaderAuth";
import { AnnouncementBar } from "@/components/landing/AnnouncementBar";
import { ThemeInjector } from "@/components/landing/ThemeInjector";
import {
  getHomepageSettings,
  getHomepageNavItems,
  getHomepageHighlights,
  getHomepageProducts,
  getHomepageFooterSections,
  getHomepageAnnouncements,
} from "@/lib/api/cms";

export const dynamic = "force-dynamic";

export default async function PublicHomepage() {
  // Server-side auth check
  let userEmail: string | null = null;
  let isAdmin = false;
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      userEmail = user.email || null;
      const userRole = user.user_metadata?.role || user.app_metadata?.role;
      isAdmin = userRole === "admin";
    }
  } catch (error) {
    console.error("[Homepage] Auth check error:", error);
  }

  // Fetch CMS Normalized Entities from Supabase
  const [
    settings,
    navItems,
    highlights,
    products,
    footerSections,
    announcement,
  ] = await Promise.all([
    getHomepageSettings(),
    getHomepageNavItems(),
    getHomepageHighlights(),
    getHomepageProducts(),
    getHomepageFooterSections(),
    getHomepageAnnouncements(),
  ]);

  const visibility = settings?.visibility_flags || {
    announcement: true,
    hero: true,
    highlights: true,
    products: true,
    footer: true,
  };

  const activeProducts = products
    .filter((p) => !p.is_hidden)
    .sort((a, b) => a.order - b.order);

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col justify-between relative overflow-x-hidden animate-fade-in">
      {/* Theme Injector for CSS variables */}
      <ThemeInjector
        primaryColor={settings?.theme_primary}
        accentColor={settings?.theme_accent}
        borderRadius={settings?.theme_radius}
      />

      {/* Background Subtle Gradient Glow */}
      <div className="absolute top-0 inset-x-0 h-[600px] bg-[radial-gradient(ellipse_60%_40%_at_50%_0%,rgba(33,158,188,0.05),transparent)] pointer-events-none" />

      {/* 1. Announcement Banner */}
      {visibility.announcement !== false && (
        <AnnouncementBar announcement={announcement} />
      )}

      {/* 2. Navigation Header */}
      <header className="sticky top-0 w-full border-b border-slate-100/80 bg-white/95 backdrop-blur-md z-30 select-none">
        <Container className="h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <img
              src="/branding/deepcode/logo.png"
              alt="Deep Code logo"
              className="h-8 w-auto object-contain"
              draggable={false}
            />
            <span className="font-extrabold text-lg tracking-tight">
              <span className="text-black">Deep</span>
              <span className="text-[#219EBC]">Code</span>
            </span>
          </Link>

          <HeaderAuth userEmail={userEmail} isAdmin={isAdmin} navItems={navItems} />
        </Container>
      </header>

      {/* Main Page Builder Body */}
      <main className="flex-grow flex flex-col space-y-12 sm:space-y-16 pb-12 sm:pb-16">
        {/* 3. Hero Section */}
        {visibility.hero !== false && (
          <Section className="pt-8 sm:pt-12 pb-4 sm:pb-6 relative z-20">
            <Container>
              <Hero
                badge={settings?.hero_badge || "🚀 Empowering Developers. Building Tomorrow."}
                title={settings?.hero_title || "Learn.\nBuild.\nGrow Together."}
                subtitle={
                  settings?.hero_subtitle ||
                  "Deep Code is your all-in-one platform to learn in-depth, build real-world projects, and connect with a global community of developers."
                }
                primaryBtnText={settings?.hero_primary_btn_text || (userEmail ? "Workspace" : "Get Started")}
                primaryBtnUrl={settings?.hero_primary_btn_url || (userEmail ? (isAdmin ? "/admin" : "/dashboard") : "/signup")}
                secondaryBtnText={settings?.hero_secondary_btn_text || "Explore Courses"}
                secondaryBtnUrl={settings?.hero_secondary_btn_url || "/courses"}
                mediaType={settings?.hero_media_type || "logo"}
                mediaUrl={settings?.hero_media_url || "/branding/deepcode/logo.png"}
              />
            </Container>
          </Section>
        )}

        {/* 4. Highlight Cards Section */}
        {visibility.highlights !== false && (
          <Section className="py-2 sm:py-4 relative z-20">
            <Container maxW="5xl">
              <HighlightCards highlights={highlights} />
            </Container>
          </Section>
        )}

        {/* 5. Our Ecosystem Products Section */}
        {visibility.products !== false && (
          <Section className="py-2 sm:py-4 relative z-20">
            <Container>
              <div className="space-y-12 select-none">
                {/* Section Header */}
                <div className="text-center max-w-2xl mx-auto space-y-3">
                  <div className="inline-flex items-center gap-2 text-xs font-bold text-[#219EBC] uppercase tracking-widest">
                    <span>• OUR ECOSYSTEM</span>
                  </div>
                  <h2 className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight">
                    Explore Our Ecosystem
                  </h2>
                  <p className="text-sm sm:text-base text-slate-500 font-medium leading-relaxed">
                    Discover the tools and platforms built to help you learn, create, and grow.
                  </p>
                </div>

                {/* Equal Width Product Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 items-stretch">
                  {activeProducts.map((prod) => (
                    <FeatureCard
                      key={prod.id}
                      title={prod.title}
                      description={prod.description}
                      status={prod.status}
                      icon={prod.logo_url || undefined}
                      href={prod.button_url}
                      buttonText={prod.button_text}
                    />
                  ))}
                </div>
              </div>
            </Container>
          </Section>
        )}
      </main>

      {/* 6. Premium Dark Footer */}
      {visibility.footer !== false && (
        <Footer
          brandName="Deep Code"
          brandLogo="/branding/deepcode/logo.png"
          description={settings?.footer_description || "Pioneering the next dimension of developer tools and interactive learning."}
          sections={footerSections}
          socialLinks={
            settings?.social_links || [
              { platform: "GitHub", url: "https://github.com" },
              { platform: "Instagram", url: "https://instagram.com" },
              { platform: "LinkedIn", url: "https://linkedin.com" },
              { platform: "YouTube", url: "https://youtube.com" },
            ]
          }
          copyrightText={settings?.copyright_text || "© 2026 Deep Code. All rights reserved."}
        />
      )}
    </div>
  );
}
