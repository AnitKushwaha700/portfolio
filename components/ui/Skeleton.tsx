"use client";

import React from "react";
import { useReducedMotion } from "framer-motion";

interface SkeletonProps {
  className?: string;
  rounded?: "none" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "full";
}

const roundedMap = {
  none: "rounded-none",
  sm: "rounded-sm",
  md: "rounded-md",
  lg: "rounded-lg",
  xl: "rounded-xl",
  "2xl": "rounded-2xl",
  "3xl": "rounded-3xl",
  full: "rounded-full",
};

export function Skeleton({ className = "", rounded = "lg" }: SkeletonProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div
      aria-hidden="true"
      className={`bg-gray-800/40 border border-gray-800/60 relative overflow-hidden ${
        roundedMap[rounded]
      } ${className} ${prefersReducedMotion ? "opacity-60" : "animate-pulse"}`}
    >
      {!prefersReducedMotion && (
        <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-linear-to-r from-transparent via-white/5 to-transparent" />
      )}
    </div>
  );
}

export function SkeletonText({
  lines = 3,
  className = "",
}: {
  lines?: number;
  className?: string;
}) {
  return (
    <div className={`space-y-2.5 ${className}`}>
      {Array.from({ length: lines }).map((_, idx) => (
        <Skeleton
          key={idx}
          className={`h-4 ${
            idx === lines - 1 ? "w-3/5" : idx === 0 ? "w-full" : "w-4/5"
          }`}
          rounded="md"
        />
      ))}
    </div>
  );
}

export function ProjectCardSkeleton() {
  return (
    <div className="card group overflow-hidden flex flex-col h-full border border-gray-800/80 bg-card">
      <Skeleton className="w-full h-48 sm:h-64" rounded="none" />
      <div className="p-6 flex flex-col flex-1 space-y-4">
        <div className="flex justify-between items-center">
          <Skeleton className="h-6 w-1/2" rounded="md" />
          <div className="flex gap-2">
            <Skeleton className="w-8 h-8" rounded="full" />
            <Skeleton className="w-8 h-8" rounded="full" />
          </div>
        </div>
        <SkeletonText lines={3} />
        <div className="flex flex-wrap gap-2 pt-2">
          <Skeleton className="h-6 w-16" rounded="md" />
          <Skeleton className="h-6 w-20" rounded="md" />
          <Skeleton className="h-6 w-14" rounded="md" />
        </div>
        <div className="mt-auto pt-4 border-t border-gray-800 flex justify-between items-center">
          <Skeleton className="h-4 w-24" rounded="md" />
        </div>
      </div>
    </div>
  );
}

export function HackathonCardSkeleton() {
  return (
    <div className="card group overflow-hidden flex flex-col h-full border border-gray-800/80 bg-card">
      <Skeleton className="w-full h-48 sm:h-64" rounded="none" />
      <div className="p-6 flex flex-col flex-1 space-y-4">
        <div className="space-y-2">
          <Skeleton className="h-6 w-3/4" rounded="md" />
          <Skeleton className="h-4 w-1/3" rounded="md" />
        </div>
        <SkeletonText lines={2} />
        <div className="flex gap-2">
          <Skeleton className="h-6 w-24" rounded="md" />
          <Skeleton className="h-6 w-28" rounded="md" />
        </div>
        <div className="mt-auto pt-4 border-t border-gray-800 flex justify-between items-center">
          <Skeleton className="h-4 w-24" rounded="md" />
          <Skeleton className="h-4 w-24" rounded="md" />
        </div>
      </div>
    </div>
  );
}

export function DetailPageSkeleton() {
  return (
    <div className="min-h-screen bg-background pt-24 pb-16 relative overflow-hidden font-sans">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-8">
        <Skeleton className="w-32 h-6" rounded="md" />
        <div className="space-y-4">
          <Skeleton className="w-3/4 h-12" rounded="lg" />
          <Skeleton className="w-full h-6" rounded="md" />
          <Skeleton className="w-4/5 h-6" rounded="md" />
          <div className="flex gap-4 pt-2">
            <Skeleton className="w-36 h-11" rounded="full" />
            <Skeleton className="w-36 h-11" rounded="full" />
          </div>
        </div>
        <Skeleton className="w-full h-[320px] md:h-110" rounded="3xl" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 pt-6">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="w-40 h-8" rounded="md" />
            <SkeletonText lines={5} />
            <Skeleton className="w-40 h-8" rounded="md" />
            <SkeletonText lines={4} />
          </div>
          <div className="lg:col-span-1">
            <div className="bg-card border border-gray-800 rounded-2xl p-6 space-y-4">
              <Skeleton className="w-32 h-5" rounded="md" />
              <div className="flex flex-wrap gap-2">
                <Skeleton className="w-16 h-7" rounded="lg" />
                <Skeleton className="w-20 h-7" rounded="lg" />
                <Skeleton className="w-24 h-7" rounded="lg" />
                <Skeleton className="w-14 h-7" rounded="lg" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
