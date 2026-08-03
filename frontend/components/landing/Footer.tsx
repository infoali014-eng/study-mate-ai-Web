import React from "react";
import Link from "next/link";
import { DBHomepageFooterSection } from "@/types/admin.types";

interface FooterProps {
  brandName?: string;
  brandLogo?: string;
  description?: string | null;
  sections?: DBHomepageFooterSection[];
  socialLinks?: Array<{ platform: string; url: string }>;
  copyrightText?: string | null;
  connectHref?: string;
  contactHref?: string;
  privacyHref?: string;
  termsHref?: string;
  className?: string;
}

export const Footer: React.FC<FooterProps> = ({
  brandName = "Deep Code",
  brandLogo = "/branding/deepcode/logo.png",
  description = "Pioneering the next dimension of developer tools and interactive learning.",
  sections = [],
  socialLinks = [
    { platform: "GitHub", url: "https://github.com" },
    { platform: "Instagram", url: "https://instagram.com" },
    { platform: "LinkedIn", url: "https://linkedin.com" },
    { platform: "YouTube", url: "https://youtube.com" },
  ],
  copyrightText = "© 2026 Deep Code. All rights reserved.",
  className = "",
}) => {
  return (
    <footer className={`bg-[#0A0D14] text-slate-400 text-xs sm:text-sm select-none border-t border-slate-900 ${className}`}>
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-16 sm:py-20 space-y-16">
        {/* Main Grid: Brand + CMS Columns */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start">
          {/* Brand Info (Left) */}
          <div className="md:col-span-4 space-y-5">
            <div className="flex items-center gap-3">
              {brandLogo && (
                <img
                  src={brandLogo}
                  alt={`${brandName} logo`}
                  className="h-8 w-auto object-contain brightness-125"
                  draggable={false}
                />
              )}
              <span className="text-xl font-extrabold text-white tracking-tight">
                <span className="text-white">Deep</span>
                <span className="text-[#219EBC]">Code</span>
              </span>
            </div>

            <p className="text-slate-400 text-xs sm:text-sm font-medium leading-relaxed max-w-sm">
              {description}
            </p>

            {/* Social Media Links */}
            {socialLinks && socialLinks.length > 0 && (
              <div className="flex items-center gap-3 pt-2">
                {socialLinks.map((soc, idx) => (
                  <a
                    key={idx}
                    href={soc.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center transition-all border border-slate-800 text-xs font-bold"
                    title={soc.platform}
                  >
                    {soc.platform.charAt(0)}
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* CMS Dynamic Footer Sections (Right) */}
          <div className="md:col-span-8 grid grid-cols-2 sm:grid-cols-3 gap-8">
            {sections.map((sec) => (
              <div key={sec.id} className="space-y-4">
                <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                  {sec.title}
                </h4>
                {sec.links && sec.links.length > 0 && (
                  <ul className="space-y-2.5 text-xs sm:text-sm font-medium">
                    {sec.links.map((link) => (
                      <li key={link.id}>
                        {link.url.startsWith("http") || link.url.startsWith("mailto") ? (
                          <a
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-white transition-colors"
                          >
                            {link.label}
                          </a>
                        ) : (
                          <Link href={link.url} className="hover:text-white transition-colors">
                            {link.label}
                          </Link>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Bar: Copyright */}
        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-medium text-slate-500">
          <div>{copyrightText}</div>
          <div className="flex items-center gap-6">
            <Link href="/courses" className="hover:text-slate-300 transition-colors">
              Courses
            </Link>
            <Link href="/dashboard" className="hover:text-slate-300 transition-colors">
              Mr Owl AI
            </Link>
            <Link href="/login" className="hover:text-slate-300 transition-colors">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
