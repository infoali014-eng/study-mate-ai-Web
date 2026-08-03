import React from "react";
import Link from "next/link";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { ProductStatus } from "@/types/admin.types";

interface FeatureCardProps {
  title: string;
  description: string;
  status: ProductStatus | string;
  icon?: string | React.ReactNode;
  href?: string;
  buttonText?: string;
  className?: string;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({
  title,
  description,
  status,
  icon,
  href = "#",
  buttonText,
  className = "",
}) => {
  const isLink = Boolean(href && href !== "#" && href !== "javascript:void(0)");

  const CardContent = (
    <div
      className={`relative h-full flex flex-col justify-between p-7 sm:p-8 rounded-2xl border border-slate-200/80 bg-white transition-all duration-300 ${
        isLink
          ? "hover:border-[#219EBC]/60 hover:shadow-md hover:-translate-y-1 group cursor-pointer"
          : "select-none hover:border-slate-300"
      } ${className}`}
    >
      <div className="space-y-5">
        {/* Header Row: Logo & Status Badge */}
        <div className="flex items-center justify-between gap-4">
          <div className="h-12 flex items-center">
            {icon && typeof icon === "string" ? (
              <img
                src={icon}
                alt={`${title} logo`}
                className="h-10 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
                draggable={false}
              />
            ) : (
              <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700 font-extrabold text-sm">
                {title.charAt(0)}
              </div>
            )}
          </div>

          <StatusBadge status={status} />
        </div>

        {/* Title & Description */}
        <div className="space-y-2">
          <h3 className="text-xl font-extrabold text-slate-950 tracking-tight transition-colors group-hover:text-black">
            {title}
          </h3>
          <p className="text-sm text-slate-600 font-medium leading-relaxed">
            {description}
          </p>
        </div>
      </div>

      {/* Footer Action Button / Link */}
      <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between text-xs sm:text-sm font-extrabold">
        <span
          className={
            isLink
              ? "text-[#219EBC] group-hover:underline flex items-center gap-1.5"
              : "text-slate-400"
          }
        >
          {buttonText || (isLink ? "Explore Products" : "Coming Soon")}
        </span>
        {isLink && <span className="text-xs text-[#219EBC]">→</span>}
      </div>
    </div>
  );

  if (isLink) {
    return <Link href={href}>{CardContent}</Link>;
  }

  return CardContent;
};
