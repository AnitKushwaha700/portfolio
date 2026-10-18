"use client";

import React, { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { useReducedMotion } from "framer-motion";

export default function TopProgressBar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const prefersReducedMotion = useReducedMotion();

  const [isNavigating, setIsNavigating] = useState(false);
  const [progress, setProgress] = useState(0);

  // When pathname or searchParams change, the route transition has finished
  useEffect(() => {
    if (!isNavigating) return;

    const completeTimer = setTimeout(() => {
      setProgress(100);
      const resetTimer = setTimeout(() => {
        setIsNavigating(false);
        setProgress(0);
      }, 300);
      return () => clearTimeout(resetTimer);
    }, 0);

    return () => clearTimeout(completeTimer);
  }, [pathname, searchParams, isNavigating]);

  // Intercept clicks on internal links to give instant loading feedback
  useEffect(() => {
    if (prefersReducedMotion) return;

    const handleAnchorClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest("a");
      if (!target) return;

      const href = target.getAttribute("href");
      if (!href) return;

      // Ignore external links, hash-only anchors, target="_blank", or download links
      if (
        href.startsWith("http") ||
        href.startsWith("#") ||
        href.startsWith("mailto:") ||
        href.startsWith("tel:") ||
        target.target === "_blank" ||
        e.ctrlKey ||
        e.metaKey ||
        e.shiftKey
      ) {
        return;
      }

      try {
        const targetUrl = new URL(href, window.location.origin);
        // Only trigger if navigating to a different pathname
        if (
          targetUrl.origin === window.location.origin &&
          targetUrl.pathname !== window.location.pathname
        ) {
          setIsNavigating(true);
          setProgress(25);
        }
      } catch {
        // Ignore invalid URLs
      }
    };

    document.addEventListener("click", handleAnchorClick, { capture: true });
    return () => {
      document.removeEventListener("click", handleAnchorClick, {
        capture: true,
      });
    };
  }, [prefersReducedMotion]);

  // Simulate progress while waiting for Next.js to stream the new route
  useEffect(() => {
    if (!isNavigating) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev < 60) return prev + 15;
        if (prev < 85) return prev + 5;
        if (prev < 95) return prev + 1;
        return prev;
      });
    }, 150);

    // Guaranteed failsafe: timeout after 6 seconds to never leave bar stuck
    const safetyTimer = setTimeout(() => {
      setProgress(100);
      setTimeout(() => {
        setIsNavigating(false);
        setProgress(0);
      }, 300);
    }, 6000);

    return () => {
      clearInterval(interval);
      clearTimeout(safetyTimer);
    };
  }, [isNavigating]);

  if (prefersReducedMotion || !isNavigating) return null;

  return (
    <div
      aria-hidden="true"
      className="fixed top-0 left-0 right-0 z-[99998] pointer-events-none h-[2.5px] bg-transparent"
    >
      <div
        className="h-full bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500 shadow-[0_0_12px_rgba(99,102,241,0.8)] transition-all duration-200 ease-out"
        style={{
          width: `${progress}%`,
          opacity: progress === 100 ? 0 : 1,
        }}
      />
    </div>
  );
}
