import React from "react";

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  maxW?: string;
}

export const Container: React.FC<ContainerProps> = ({ children, className = "", maxW = "max-w-6xl" }) => {
  const resolvedMaxW = maxW.startsWith("max-w-") ? maxW : `max-w-${maxW}`;
  return (
    <div className={`${resolvedMaxW} mx-auto px-6 sm:px-8 lg:px-12 w-full ${className}`}>
      {children}
    </div>
  );
};
