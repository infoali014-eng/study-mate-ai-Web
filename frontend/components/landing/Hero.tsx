import React from "react";
import Link from "next/link";

interface HeroProps {
  badge?: string | null;
  title: string;
  subtitle: string;
  primaryBtnText?: string | null;
  primaryBtnUrl?: string | null;
  secondaryBtnText?: string | null;
  secondaryBtnUrl?: string | null;
  mediaType?: "logo" | "image" | "video" | "illustration" | "none";
  mediaUrl?: string | null;
  className?: string;
}

export const Hero: React.FC<HeroProps> = ({
  badge = "🚀 Empowering Developers. Building Tomorrow.",
  title,
  subtitle,
  primaryBtnText = "Get Started",
  primaryBtnUrl = "/signup",
  secondaryBtnText = "Explore Courses",
  secondaryBtnUrl = "/courses",
  mediaType = "logo",
  mediaUrl = "/branding/deepcode/logo.png",
  className = "",
}) => {
  return (
    <div className={`grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center select-none ${className}`}>
      {/* Left Column: Text & CTAs */}
      <div className="lg:col-span-7 space-y-6 text-left">
        {/* Pill Badge */}
        {badge && (
          <div className="inline-flex items-center gap-2 bg-[#219EBC]/10 border border-[#219EBC]/20 px-3.5 py-1.5 rounded-full text-xs font-extrabold text-[#1B7991]">
            <span>{badge}</span>
          </div>
        )}

        {/* Headline */}
        <div className="space-y-2">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-950 tracking-tight leading-[1.1] whitespace-pre-line">
            {title.includes("Grow Together") ? (
              <>
                Learn. <br />
                Build. <br />
                <span className="text-[#219EBC]">Grow Together.</span>
              </>
            ) : (
              title
            )}
          </h1>
        </div>

        {/* Paragraph */}
        <p className="text-base sm:text-lg text-slate-600 font-medium leading-relaxed max-w-xl">
          {subtitle}
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-4 pt-2">
          {primaryBtnText && (
            <Link
              href={primaryBtnUrl || "/signup"}
              className="inline-flex items-center justify-center gap-2 bg-slate-950 text-white font-extrabold text-sm px-6 py-3.5 rounded-xl hover:bg-slate-800 transition-all duration-200 shadow-sm hover:scale-[1.01] active:scale-[0.99]"
            >
              <span>{primaryBtnText}</span>
              <span className="text-xs">→</span>
            </Link>
          )}

          {secondaryBtnText && (
            <Link
              href={secondaryBtnUrl || "/courses"}
              className="inline-flex items-center justify-center gap-2 bg-white text-slate-800 border border-slate-200 font-bold text-sm px-6 py-3.5 rounded-xl hover:bg-slate-50 transition-all duration-200 hover:border-slate-300"
            >
              <span>{secondaryBtnText}</span>
            </Link>
          )}
        </div>
      </div>

      {/* Right Column: Hero Media Canvas */}
      <div className="lg:col-span-5 flex items-center justify-center relative">
        <div className="relative w-full max-w-lg flex items-center justify-center p-2 group">
          {/* Ambient Vibrant Glow Background */}
          <div className="absolute inset-0 bg-gradient-to-tr from-[#219EBC]/25 via-sky-400/20 to-indigo-500/20 rounded-full blur-3xl opacity-75 group-hover:opacity-95 transition-opacity duration-700 pointer-events-none" />

          {/* Media Element */}
          {mediaType === "video" && mediaUrl ? (
            <div className="w-full aspect-square rounded-3xl overflow-hidden relative border border-slate-200/80 shadow-md bg-white">
              <iframe src={mediaUrl} className="w-full h-full" title="Hero Video" />
            </div>
          ) : (
            <div className="relative z-10 p-2 flex items-center justify-center">
              <img
                src={mediaUrl || "/branding/deepcode/logo.png"}
                alt="Deep Code graphic"
                className="max-h-80 sm:max-h-96 md:max-h-[420px] w-auto object-contain transition-all duration-500 group-hover:scale-105 drop-shadow-[0_15px_30px_rgba(33,158,188,0.2)]"
                draggable={false}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
