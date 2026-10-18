"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

export default function InitialPageLoader() {
  const prefersReducedMotion = useReducedMotion();
  const [loading, setLoading] = useState(() => !prefersReducedMotion);
  const [progress, setProgress] = useState(15);

  useEffect(() => {
    // If reduced motion is requested, do not run intro animation
    if (prefersReducedMotion) {
      return;
    }

    // Check if session has already seen initial intro to keep subsequent navigations instantaneous
    const hasLoadedBefore =
      typeof window !== "undefined" &&
      sessionStorage.getItem("portfolio_loaded");

    const targetTime = hasLoadedBefore ? 600 : 1200;
    const intervalTime = 30;
    const step = 100 / (targetTime / intervalTime);

    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = prev + step;
        if (next >= 100) {
          clearInterval(timer);
          return 100;
        }
        return next;
      });
    }, intervalTime);

    // Guaranteed failsafe: Never leave the loader running indefinitely
    const completionTimer = setTimeout(() => {
      setProgress(100);
      setTimeout(() => {
        setLoading(false);
        try {
          sessionStorage.setItem("portfolio_loaded", "true");
        } catch {
          // Ignore storage errors in restricted iframe/browser modes
        }
      }, 200);
    }, targetTime);

    return () => {
      clearInterval(timer);
      clearTimeout(completionTimer);
    };
  }, [prefersReducedMotion]);

  return (
    <AnimatePresence mode="wait">
      {loading && (
        <motion.div
          key="initial-loader"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            scale: 0.98,
            transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
          }}
          className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-[#0B0F19] text-white selection:bg-none"
        >
          {/* Ambient background glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[420px] h-[420px] bg-indigo-600/15 rounded-full blur-[110px] pointer-events-none" />

          <div className="relative z-10 flex flex-col items-center max-w-xs w-full px-6 text-center">
            {/* Branded Logo Monogram */}
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="relative mb-6"
            >
              <div className="absolute -inset-2 bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-2xl opacity-60 blur-md animate-pulse" />
              <div className="relative w-16 h-16 rounded-2xl bg-[#111827] border border-gray-800 flex items-center justify-center shadow-2xl">
                <span className="text-xl font-black tracking-wider bg-linear-to-r from-indigo-400 via-purple-300 to-pink-400 bg-clip-text text-transparent">
                  AK
                </span>
              </div>
            </motion.div>

            {/* Title & Role */}
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="text-lg font-bold tracking-widest uppercase text-gray-100 mb-1"
            >
              Anit Kushwaha
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.15 }}
              className="text-xs font-medium text-indigo-400/90 tracking-wide uppercase mb-8"
            >
              Software Developer
            </motion.p>

            {/* Modern Slim Progress Bar */}
            <div className="w-full bg-gray-900/80 border border-gray-800/80 rounded-full h-1.5 overflow-hidden p-px shadow-inner">
              <motion.div
                className="h-full bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full"
                style={{ width: `${progress}%` }}
                transition={{ ease: "easeOut" }}
              />
            </div>

            {/* Subtle percentage and status indicator */}
            <div className="flex justify-between items-center w-full mt-2.5 px-0.5 text-[10px] text-gray-500 font-mono">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-ping" />
                loading experience
              </span>
              <span>{Math.round(progress)}%</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
