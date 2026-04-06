import React from "react";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

const SIZES = {
  sm: "h-8",
  md: "h-12",
  lg: "h-20",
};

export function Logo({ size = "md", className = "" }: LogoProps) {
  const h = SIZES[size];

  return (
    <img
      src="/clawchi_logo.png"
      alt="Clawchi!"
      className={`${h} w-auto ${className}`}
    />
  );
}
