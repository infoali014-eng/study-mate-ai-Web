import React from "react";

interface MainContentProps {
  children: React.ReactNode;
  className?: string;
}

export default function MainContent({
  children,
  className = "",
}: MainContentProps) {
  return (
    <main
      className={`flex-1 bg-[#F8FAFC] min-h-[calc(100vh-4rem)] p-4 sm:p-6 md:p-8 overflow-y-auto ${className}`}
    >
      <div className="max-w-7xl mx-auto space-y-6">{children}</div>
    </main>
  );
}
