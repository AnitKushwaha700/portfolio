"use client";

import React, { useState } from "react";

interface ToggleSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void | Promise<void>;
  disabled?: boolean;
  activeLabel?: string;
  inactiveLabel?: string;
  size?: "sm" | "md";
  className?: string;
  title?: string;
}

export default function ToggleSwitch({
  checked,
  onChange,
  disabled = false,
  activeLabel,
  inactiveLabel,
  size = "md",
  className = "",
  title,
}: ToggleSwitchProps) {
  const [isUpdating, setIsUpdating] = useState(false);

  const handleToggle = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (disabled || isUpdating) return;

    try {
      setIsUpdating(true);
      await onChange(!checked);
    } finally {
      setIsUpdating(false);
    }
  };

  const isSmall = size === "sm";

  return (
    <div
      className={`inline-flex items-center gap-2 ${className}`}
      title={
        title ||
        (checked ? "Active (Click to hide)" : "Hidden (Click to activate)")
      }
    >
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled || isUpdating}
        onClick={handleToggle}
        className={`relative inline-flex shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900 ${
          isSmall ? "h-5 w-9 p-0.5" : "h-6 w-11 p-1"
        } ${
          checked
            ? "bg-emerald-500 hover:bg-emerald-600 shadow-sm shadow-emerald-500/20"
            : "bg-gray-700 hover:bg-gray-600"
        } ${disabled || isUpdating ? "opacity-60 cursor-not-allowed" : ""}`}
      >
        <span
          className={`pointer-events-none inline-block rounded-full bg-white shadow-md transform transition-transform duration-200 ease-in-out ${
            isSmall ? "h-4 w-4" : "h-4 w-4"
          } ${
            checked
              ? isSmall
                ? "translate-x-4"
                : "translate-x-5"
              : "translate-x-0"
          } ${isUpdating ? "animate-pulse" : ""}`}
        />
      </button>

      {(activeLabel || inactiveLabel) && (
        <span
          className={`text-xs font-medium cursor-pointer select-none transition-colors ${
            checked ? "text-emerald-400" : "text-gray-400"
          }`}
          onClick={handleToggle}
        >
          {checked ? activeLabel || "Active" : inactiveLabel || "Hidden"}
        </span>
      )}
    </div>
  );
}
