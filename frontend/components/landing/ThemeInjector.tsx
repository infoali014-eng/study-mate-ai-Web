"use client";

import React, { useEffect } from "react";

interface ThemeInjectorProps {
  primaryColor?: string | null;
  accentColor?: string | null;
  borderRadius?: string | null;
}

export const ThemeInjector: React.FC<ThemeInjectorProps> = ({
  primaryColor,
  accentColor,
  borderRadius,
}) => {
  useEffect(() => {
    const root = document.documentElement;
    if (primaryColor) {
      root.style.setProperty("--primary-brand", primaryColor);
    }
    if (accentColor) {
      root.style.setProperty("--accent-brand", accentColor);
    }
    if (borderRadius) {
      root.style.setProperty("--brand-radius", borderRadius);
    }
  }, [primaryColor, accentColor, borderRadius]);

  return null;
};
