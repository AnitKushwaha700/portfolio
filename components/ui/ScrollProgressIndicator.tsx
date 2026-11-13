"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";

export default function ScrollProgressIndicator() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    let ticking = false;

    const updateScroll = () => {
      const scrollHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      if (scrollHeight <= 0) {
        setScrollProgress(0);
        return;
      }
      const progress = Math.min(
        100,
        Math.max(0, (window.scrollY / scrollHeight) * 100),
      );
      setScrollProgress(progress);
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateScroll);
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    updateScroll();

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (scrollProgress <= 0.5) return null;

  return (
    <div
      aria-hidden="true"
      className="fixed top-0 left-0 right-0 h-[2.5px] z-[9999] pointer-events-none overflow-visible"
    >
      {/* 3D Cyber Gradient Progress Beam */}
      <div
        className="h-full bg-gradient-to-r from-cyan-400 via-rose-500 to-amber-400 transition-[width] duration-75 ease-out relative"
        style={{
          width: `${scrollProgress}%`,
          boxShadow: prefersReducedMotion
            ? "none"
            : "0 0 14px rgba(244, 63, 94, 0.7), 0 0 28px rgba(34, 211, 238, 0.4)",
        }}
      >
        {/* Leading-Edge Glowing 3D Particle Head */}
        {!prefersReducedMotion && (
          <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-2 h-2 rounded-full bg-white shadow-[0_0_10px_#fff,0_0_20px_#f43f5e,0_0_30px_#22d3ee] animate-pulse" />
        )}
      </div>
    </div>
  );
}

