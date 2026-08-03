import React from "react";
import Link from "next/link";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface CourseHeaderProps {
  breadcrumbs: BreadcrumbItem[];
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export const CourseHeader: React.FC<CourseHeaderProps> = ({
  breadcrumbs,
  title,
  description,
  action,
}) => {
  return (
    <div className="border-b border-slate-100 bg-white/50 backdrop-blur-xs py-8 sm:py-10 select-none">
      <div className="max-w-5xl mx-auto px-6">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-xs font-semibold text-slate-400 tracking-wide mb-4">
          <Link href="/" className="hover:text-slate-600 transition-colors">
            Home
          </Link>
          {breadcrumbs.map((item, idx) => (
            <React.Fragment key={idx}>
              <span className="text-slate-300 font-normal">/</span>
              {item.href ? (
                <Link
                  href={item.href}
                  className="hover:text-slate-600 transition-colors"
                >
                  {item.label}
                </Link>
              ) : (
                <span className="text-slate-500 font-bold">{item.label}</span>
              )}
            </React.Fragment>
          ))}
        </nav>

        {/* Title Block */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-slate-900 leading-none">
              {title}
            </h1>
            {description && (
              <p className="text-slate-500 text-base sm:text-lg font-medium leading-relaxed max-w-2xl pt-1">
                {description}
              </p>
            )}
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </div>
      </div>
    </div>
  );
};
