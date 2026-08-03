import React from "react";

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
  hasBackground?: boolean;
}

export const Section: React.FC<SectionProps> = ({
  children,
  className = "",
  id,
  hasBackground = false,
}) => {
  return (
    <section
      id={id}
      className={`py-20 sm:py-28 relative overflow-hidden ${
        hasBackground
          ? "bg-radial from-neutral-900 via-zinc-950 to-black text-white border-y border-neutral-800"
          : "bg-white text-foreground"
      } ${className}`}
    >
      {children}
    </section>
  );
};
