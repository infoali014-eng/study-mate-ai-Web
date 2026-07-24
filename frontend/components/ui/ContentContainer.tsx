import React from "react";

export interface ContentContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "full";
  children: React.ReactNode;
}

export const ContentContainer: React.FC<ContentContainerProps> = ({
  maxWidth = "full",
  children,
  className = "",
  ...props
}) => {
  const maxWidthStyles = {
    sm: "max-w-2xl",
    md: "max-w-4xl",
    lg: "max-w-6xl",
    xl: "max-w-7xl",
    "2xl": "max-w-screen-2xl",
    full: "w-full",
  };

  return (
    <div
      className={`mx-auto w-full space-y-6 ${maxWidthStyles[maxWidth]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
