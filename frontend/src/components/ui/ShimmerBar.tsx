import React from "react";

interface ShimmerBarProps {
  accentColor?: string;
  variant?: "default" | "light" | "paper";
  className?: string;
  style?: React.CSSProperties;
  animationDelay?: string;
}

export const ShimmerBar: React.FC<ShimmerBarProps> = ({
  accentColor = "#6b7280",
  variant = "default",
  className = "",
  style = {},
  animationDelay,
}) => {
  const gradient =
    variant === "light"
      ? `linear-gradient(90deg,
          rgba(255,255,255,0.08) 0%,
          rgba(255,255,255,0.15) 15%,
          rgba(255,255,255,0.30) 30%,
          rgba(255,255,255,0.40) 40%,
          rgba(255,255,255,0.30) 50%,
          rgba(255,255,255,0.15) 65%,
          rgba(255,255,255,0.08) 80%,
          rgba(255,255,255,0.08) 100%)`
      : variant === "paper"
      ? `linear-gradient(90deg,
          #f1f5f9 0%,
          ${accentColor}25 15%,
          ${accentColor}50 30%,
          ${accentColor}70 40%,
          ${accentColor}50 50%,
          ${accentColor}25 65%,
          #f1f5f9 80%,
          #f1f5f9 100%)`
      : `linear-gradient(90deg,
          ${accentColor}15 0%,
          ${accentColor}30 15%,
          ${accentColor}70 30%,
          ${accentColor}99 40%,
          ${accentColor}70 50%,
          ${accentColor}30 65%,
          ${accentColor}15 80%,
          ${accentColor}15 100%)`;

  return (
    <div
      className={`rounded-md ${className}`}
      style={{
        background: gradient,
        backgroundSize: "200% 100%",
        animation: "shimmer 1.4s linear infinite",
        animationDelay: animationDelay || "0s",
        ...style,
      }}
    />
  );
};
