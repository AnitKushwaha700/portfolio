"use client";

import React from "react";
import { useReducedMotion } from "framer-motion";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg" | "xl";
  variant?: "primary" | "accent" | "white" | "muted";
  className?: string;
  label?: string;
  labelPosition?: "right" | "bottom";
}

const sizeMap = {
  sm: "w-4 h-4 border-2",
  md: "w-6 h-6 border-2",
  lg: "w-8 h-8 border-3",
  xl: "w-12 h-12 border-3",
};

const variantMap = {
  primary: "border-indigo-500/20 border-t-indigo-500 text-indigo-400",
  accent: "border-purple-500/20 border-t-purple-500 text-purple-400",
  white: "border-white/20 border-t-white text-white",
  muted: "border-gray-700 border-t-gray-400 text-gray-400",
};

export default function LoadingSpinner({
  size = "md",
  variant = "primary",
  className = "",
  label,
  labelPosition = "right",
}: LoadingSpinnerProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div
      role="status"
      aria-live="polite"
      className={`inline-flex items-center justify-center ${
        labelPosition === "bottom" ? "flex-col gap-2" : "flex-row gap-2.5"
      } ${className}`}
    >
      <div
        className={`rounded-full ${sizeMap[size]} ${variantMap[variant]} ${
          prefersReducedMotion ? "opacity-75" : "animate-spin"
        }`}
        style={{
          animationDuration: prefersReducedMotion ? "0s" : "0.75s",
        }}
      />
      {label && (
        <span
          className={`text-xs font-medium tracking-wide ${
            variant === "white" ? "text-gray-200" : "text-gray-400"
          }`}
        >
          {label}
        </span>
      )}
      <span className="sr-only">{label || "Loading..."}</span>
    </div>
  );
}
