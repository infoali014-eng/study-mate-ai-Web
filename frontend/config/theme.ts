export const THEME_COLORS = {
  primary: "#219EBC", // Primary Accent (Light Blue)
  secondary: "#8ECAE6", // Secondary Accent (Soft Blue)
  highlight: "#FFB703", // Highlight / Warning (Yellow Accent)
  success: "#FB8500", // Success / CTA Action (Orange Accent)
  background: "#F8FAFC", // Main Viewport Background
  cardBackground: "#ffffff", // Card Background
  sidebar: "#023047", // Dark Navy Sidebar Background
  sidebarHover: "#03405e", // Sidebar Hover Fill
} as const;

export const THEME_SHADOWS = {
  xs: "shadow-xs",
  sm: "shadow-sm",
  md: "shadow-md",
  lg: "shadow-lg",
  xl: "shadow-xl",
  xxl: "shadow-2xl",
} as const;

export const THEME_RADIUS = {
  default: "rounded-[12px]",
  sm: "rounded-[8px]",
  lg: "rounded-[16px]",
  full: "rounded-full",
} as const;
