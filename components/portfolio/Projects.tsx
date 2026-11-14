"use client";

import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  UtensilsCrossed,
  MessageSquare,
  Sparkles,
  Laptop,
  Code2,
  CheckCircle2,
  AlertCircle,
  Lightbulb,
} from "lucide-react";
import { FaGithub } from "react-icons/fa";
import Image from "next/image";
import { formatImageUrl, sanitizeUrl } from "@/utils";

interface ProjectsProps {
  projects: any[];
}

/**
 * Modern isometric/SVG fallback graphic when a project image hasn't been uploaded yet.
 */
function ProjectGraphicFallback({ slug, title }: { slug: string; title: string }) {
  const normalized = (slug + " " + title).toLowerCase();

  if (normalized.includes("craving") || normalized.includes("food")) {
    return (
      <div className="relative w-full h-full flex items-center justify-center bg-gradient-to-tr from-emerald-500/10 via-teal-500/10 to-transparent">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 p-0.5 shadow-xl shadow-emerald-500/20 transform -rotate-2 hover:rotate-0 transition-transform duration-300">
          <div className="w-full h-full bg-[#0d121f] rounded-[14px] flex items-center justify-center">
            <UtensilsCrossed className="w-7 h-7 text-emerald-400" />
          </div>
        </div>
      </div>
    );
  }

  if (normalized.includes("chat") || normalized.includes("talk")) {
    return (
      <div className="relative w-full h-full flex items-center justify-center bg-gradient-to-tr from-cyan-500/10 via-blue-500/10 to-transparent">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-500 p-0.5 shadow-xl shadow-cyan-500/20 transform rotate-2 hover:rotate-0 transition-transform duration-300">
          <div className="w-full h-full bg-[#0d121f] rounded-[14px] flex items-center justify-center">
            <MessageSquare className="w-7 h-7 text-cyan-400" />
          </div>
        </div>
      </div>
    );
  }

  if (normalized.includes("career") || normalized.includes("ai") || normalized.includes("resume")) {
    return (
      <div className="relative w-full h-full flex items-center justify-center bg-gradient-to-tr from-indigo-500/10 via-purple-500/10 to-transparent">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 p-0.5 shadow-xl shadow-indigo-500/20 transform rotate-2 hover:rotate-0 transition-transform duration-300">
          <div className="w-full h-full bg-[#0d121f] rounded-[14px] flex items-center justify-center">
            <Sparkles className="w-7 h-7 text-purple-300" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full flex items-center justify-center bg-gradient-to-tr from-slate-500/10 via-cyan-500/10 to-transparent">
      <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-slate-600 to-cyan-500 p-0.5 shadow-xl shadow-cyan-500/20 transform hover:scale-105 transition-transform duration-300">
        <div className="w-full h-full bg-[#0d121f] rounded-[14px] flex items-center justify-center">
          <Laptop className="w-7 h-7 text-cyan-400" />
        </div>
      </div>
    </div>
  );
}

export default function Projects({ projects }: ProjectsProps) {
  const safeProjects = useMemo(() => (projects || []).filter((p) => p.visible !== false), [projects]);
  const total = safeProjects.length;

  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const autoTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Navigation handlers
  const prevSlide = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  const nextSlide = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % total);
  }, [total]);

  // Auto-sliding every 4.2 seconds, pause on hover
  useEffect(() => {
    if (isHovered || total <= 1) return;

    autoTimerRef.current = setInterval(() => {
      if (typeof document !== "undefined" && document.visibilityState === "hidden") return;
      nextSlide();
    }, 4200);

    return () => {
      if (autoTimerRef.current) clearInterval(autoTimerRef.current);
    };
  }, [isHovered, total, nextSlide]);

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const getCardStyle = useCallback(
    (index: number) => {
      let diff = index - activeIndex;
      const half = total / 2;
      if (diff > half) diff -= total;
      if (diff < -half) diff += total;

      const isActive = diff === 0;
      const distance = Math.abs(diff);

      // Exact gap offset matching reference screenshot (165px mobile, 255px desktop)
      const xOffset = diff * (isMobile ? 165 : 255);

      const scale = isActive
        ? isMobile ? 1.05 : 1.15
        : distance === 1
        ? isMobile ? 0.82 : 0.88
        : 0.72;

      const opacity = isActive
        ? 1
        : distance === 1
        ? 0.75
        : distance === 2
        ? 0.35
        : 0;

      const filter = isActive ? "grayscale(0%)" : "grayscale(85%) contrast(95%)";
      const zIndex = 30 - distance * 10;
      const pointerEvents = distance > 2 ? ("none" as const) : ("auto" as const);

      return {
        transform: `translate3d(calc(-50% + ${xOffset}px), -50%, 0) scale(${scale})`,
        opacity,
        filter,
        zIndex,
        pointerEvents,
      };
    },
    [activeIndex, total, isMobile]
  );

  if (!safeProjects || safeProjects.length === 0) return null;

  const activeProject = safeProjects[activeIndex];
  const prevProject = safeProjects[(activeIndex - 1 + total) % total];
  const nextProject = safeProjects[(activeIndex + 1) % total];

  const formattedCounter = `0${activeIndex + 1} / 0${total}`;

  return (
    <section id="projects" className="relative z-10 py-16 sm:py-24 overflow-hidden bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header: Matching Portfolio's Signature Centered Pattern */}
        <div className="text-center space-y-2.5 sm:space-y-3 mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-xs font-semibold text-red-400 uppercase tracking-wider mb-1">
            <Code2 className="w-3.5 h-3.5" />
            <span>Project Showcase</span>
          </div>

          <h2 className="section-title mb-0 text-center">
            Featured{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-rose-500 to-amber-500 drop-shadow-[0_0_30px_rgba(239,68,68,0.35)]">
              Projects
            </span>
          </h2>

          <p className="text-xs sm:text-base text-gray-400 max-w-xl mx-auto px-2">
            3D interactive project showcase. Slides automatically from left to right; hover your mouse
            over the cards to pause.
          </p>
        </div>

        {/* Top Control Bar: Status Indicator + Numeric Counter Controls */}
        <div className="flex items-center justify-between gap-4 mb-8 sm:mb-10 pb-4 border-b border-slate-200/80 dark:border-gray-800/80">
          {/* Status Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 dark:bg-white/[0.04] border border-slate-200 dark:border-gray-800 text-[11px] sm:text-xs font-semibold text-slate-700 dark:text-gray-300 select-none">
            <span className="relative flex h-2 w-2">
              <span
                className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                  isHovered ? "bg-amber-400" : "bg-red-400"
                }`}
              />
              <span
                className={`relative inline-flex rounded-full h-2 w-2 ${
                  isHovered ? "bg-amber-500" : "bg-red-500"
                }`}
              />
            </span>
            <span>{isHovered ? "Paused [Inspecting card]" : "Auto-sliding [Hover mouse on card to inspect]"}</span>
          </div>

          {/* Carousel Arrows & Counter */}
          <div className="flex items-center gap-2 select-none">
            <button
              onClick={prevSlide}
              aria-label="Previous Project"
              className="p-2 sm:p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/[0.04] dark:hover:bg-white/[0.08] border border-slate-300 dark:border-gray-800 text-slate-700 dark:text-gray-200 transition-all hover:scale-105 active:scale-95 shadow-xs cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <span className="px-3 text-xs sm:text-sm font-mono font-bold text-slate-800 dark:text-gray-200">
              {formattedCounter}
            </span>

            <button
              onClick={nextSlide}
              aria-label="Next Project"
              className="p-2 sm:p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/[0.04] dark:hover:bg-white/[0.08] border border-slate-300 dark:border-gray-800 text-slate-700 dark:text-gray-200 transition-all hover:scale-105 active:scale-95 shadow-xs cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 3D Interactive Coverflow Card Stage with requested gap spacing */}
        <div
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="relative mt-4 sm:mt-6 h-[380px] sm:h-[450px] md:h-[490px] w-full max-w-full overflow-hidden flex items-center justify-center select-none"
        >
          {safeProjects.map((project, idx) => {
            const isActive = idx === activeIndex;
            const style = getCardStyle(idx);
            const projectNumber = String(idx + 1).padStart(2, "0");
            const projectYear = project.year || "2024";

            return (
              <div
                key={project._id || project.id || `project-${idx}`}
                onClick={() => setActiveIndex(idx)}
                style={style}
                className="absolute left-1/2 top-1/2 w-[220px] h-[335px] sm:w-[280px] sm:h-[410px] select-none rounded-3xl border transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] cursor-pointer overflow-hidden flex flex-col justify-between shadow-2xl group border-slate-200/90 dark:border-gray-800 bg-white/95 dark:bg-[#0c0e18]/95"
                aria-label={`Project: ${project.title}`}
              >
                {/* Background Grid Pattern & Ambience */}
                <div className="absolute inset-0 size-full pointer-events-none overflow-hidden">
                  {/* Dot Grid */}
                  <div
                    className="absolute inset-0 opacity-15 dark:opacity-20"
                    style={{
                      backgroundImage: "radial-gradient(currentColor 1px, transparent 1px)",
                      backgroundSize: "18px 18px",
                    }}
                  />
                  {/* Top Ambient Gradient Glow */}
                  <div
                    className="absolute top-0 inset-x-0 h-32 opacity-25"
                    style={{
                      background: `linear-gradient(180deg, ${
                        isActive ? "rgba(239, 68, 68, 0.45)" : "rgba(239, 68, 68, 0.15)"
                      }, transparent)`,
                    }}
                  />
                  {/* Watermark Number */}
                  <div className="absolute right-4 top-3 font-serif text-7xl font-bold tracking-tight text-slate-900/[0.06] dark:text-white/[0.05] select-none">
                    {projectNumber}
                  </div>

                  {/* Floating Spec Box / Image Preview */}
                  {project.image ? (
                    <div className="absolute inset-x-4 top-14 h-36 sm:h-44 rounded-xl overflow-hidden border border-slate-200/90 dark:border-gray-800/80 shadow-xs bg-slate-100 dark:bg-black/50">
                      <Image
                        src={formatImageUrl(project.image)}
                        alt={project.title}
                        fill
                        sizes="320px"
                        className="object-cover object-top hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                      <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-white font-mono text-[9px] px-1">
                        <span className="truncate">{project.category || "Full-Stack Web App"}</span>
                        <span>{projectYear}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="absolute inset-x-4 top-14 rounded-xl border border-slate-200/90 dark:border-gray-800/80 bg-slate-50/90 dark:bg-black/40 p-3 shadow-xs backdrop-blur-xs">
                      <div className="flex items-center gap-1.5 border-b border-slate-200/80 dark:border-gray-800/80 pb-2">
                        <span className="w-2 h-2 rounded-full bg-red-500/80" />
                        <span className="w-2 h-2 rounded-full bg-rose-500/60" />
                        <span className="w-2 h-2 rounded-full bg-amber-500/60" />
                        <span className="ml-auto font-mono text-[9px] text-slate-500 dark:text-gray-400">
                          {projectYear}
                        </span>
                      </div>
                      <div className="mt-2 space-y-1 font-mono text-[10px]">
                        <p className="flex items-center gap-1 text-red-500 dark:text-red-400 font-semibold truncate">
                          <Code2 className="w-3 h-3 shrink-0" />
                          <span>{project.category || "Full-Stack Web App"}</span>
                        </p>
                        <p className="truncate text-slate-600 dark:text-gray-300">
                          {project.technologies?.slice(0, 3).join(" · ") || "React · Node.js · Express"}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Top Header Pills */}
                <div className="relative z-10 p-3 sm:p-4 flex items-center justify-between">
                  <span className="rounded-full border border-slate-200 dark:border-gray-800 bg-white/80 dark:bg-black/60 px-2.5 py-0.5 font-mono text-[9px] sm:text-[10px] font-semibold text-slate-800 dark:text-gray-200 backdrop-blur-md">
                    {projectNumber} / {projectYear}
                  </span>

                  {isActive && (
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-red-500/40 bg-red-500/10 px-2.5 py-0.5 font-mono text-[9px] sm:text-[10px] font-semibold text-red-500 dark:text-red-400 backdrop-blur-md">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                      <span>Active</span>
                    </span>
                  )}
                </div>

                {/* Bottom Dark Capsule Pill (Matching screenshot) */}
                <div className="relative z-10 m-3 rounded-2xl border border-white/10 bg-[#141620]/95 dark:bg-[#070913]/95 p-3.5 sm:p-4 text-white shadow-xl backdrop-blur-md space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <h4 className="font-bold text-[13px] sm:text-[15px] text-white truncate leading-snug">
                        {project.title}
                      </h4>
                      <p className="font-mono text-[10px] text-zinc-300 dark:text-gray-400 truncate mt-0.5">
                        {project.subtitle || project.description || "Production Full-Stack Application"}
                      </p>
                    </div>
                    <span className="grid size-6 shrink-0 place-items-center rounded-md bg-white/10 font-mono text-[9px] font-bold text-red-400">
                      AK
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 overflow-hidden pt-1">
                    {(project.technologies || ["React", "Node.js"]).slice(0, 2).map((tech: string) => (
                      <span
                        key={tech}
                        className="rounded-md bg-white/10 px-2 py-0.5 font-mono text-[8px] text-zinc-200"
                      >
                        {tech}
                      </span>
                    ))}
                    <span className="ml-auto font-mono text-[8px] text-zinc-400 truncate">
                      {project.category?.split(" ")[0] || "Web"}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Carousel Indicator Dots */}
        {total > 1 && (
          <div className="flex justify-center items-center gap-2 mt-6 sm:mt-8">
            {safeProjects.map((_, dotIdx) => (
              <button
                key={dotIdx}
                onClick={() => setActiveIndex(dotIdx)}
                aria-label={`Jump to project ${dotIdx + 1}`}
                className="py-2 px-1 cursor-pointer focus:outline-none"
              >
                <span
                  className={`block transition-all duration-300 rounded-full ${
                    activeIndex === dotIdx
                      ? "w-8 h-2 bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 shadow-[0_0_12px_rgba(239,68,68,0.7)]"
                      : "w-2 h-2 bg-slate-300 dark:bg-gray-700 hover:bg-slate-400 dark:hover:bg-gray-500"
                  }`}
                />
              </button>
            ))}
          </div>
        )}

        {/* =========================================================================
            SYNCHRONIZED FEATURED PROJECT DEEP DIVE
            ========================================================================= */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`deep-dive-${activeProject._id || activeProject.title}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="mt-12 sm:mt-16 rounded-3xl bg-white dark:bg-[#0c0e18]/90 border border-slate-200/90 dark:border-gray-800/90 p-6 sm:p-8 md:p-10 shadow-xl backdrop-blur-xl space-y-8"
          >
            {/* Deep Dive Header */}
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 pb-6 border-b border-slate-200 dark:border-gray-800/80">
              <div className="space-y-2 max-w-2xl">
                <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-red-500 dark:text-red-400">
                  <Sparkles className="w-3.5 h-3.5 text-red-500" />
                  <span>FEATURED PROJECT DEEP DIVE</span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                  {activeProject.title}
                </h3>

                <p className="text-xs sm:text-sm text-slate-500 dark:text-gray-400 font-mono">
                  {activeProject.technologies?.slice(0, 3).join(" · ") || "Full-Stack Development"} — Developed 2024
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3">
                {activeProject.githubUrl && (
                  <Link
                    href={sanitizeUrl(activeProject.githubUrl)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/[0.04] dark:hover:bg-white/[0.08] border border-slate-300 dark:border-gray-800 text-xs sm:text-sm font-semibold text-slate-800 dark:text-gray-200 transition-all hover:scale-105 active:scale-95 shadow-xs"
                  >
                    <FaGithub className="w-4 h-4" />
                    <span>View Source Code</span>
                  </Link>
                )}

                {activeProject.liveUrl ? (
                  <Link
                    href={sanitizeUrl(activeProject.liveUrl)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white text-xs sm:text-sm font-semibold transition-all hover:scale-105 active:scale-95 shadow-md shadow-red-600/30"
                  >
                    <span>Launch Live Demo</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                ) : (
                  <span className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-white/[0.02] border border-slate-200 dark:border-gray-800/80 text-xs sm:text-sm text-slate-400 dark:text-gray-500">
                    <span>Source Available on GitHub</span>
                  </span>
                )}
              </div>
            </div>

            {/* Deep Dive Two-Column Grid: Problem/Solution Left, Architecture Right */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column (Overview & Problem/Solution) */}
              <div className="lg:col-span-7 space-y-6">
                <p className="text-sm sm:text-base text-slate-600 dark:text-gray-300/90 leading-relaxed font-normal">
                  {activeProject.content?.overview ||
                    activeProject.description ||
                    "Engineered with modern full-stack best practices, high performance data indexing, and responsive UI micro-interactions."}
                </p>

                {/* Problem vs Solution Comparison Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* The Problem */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-rose-500/[0.04] dark:bg-rose-950/20 border border-rose-200/80 dark:border-rose-900/40 space-y-2">
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">
                      <AlertCircle className="w-4 h-4" />
                      <span>THE PROBLEM:</span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-700 dark:text-gray-300 leading-relaxed">
                      {activeProject.content?.problem ||
                        "Legacy template portfolios fail to reflect deep full-stack engineering competency and lack persistent dynamic content control."}
                    </p>
                  </div>

                  {/* The Solution */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-amber-500/[0.04] dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-900/40 space-y-2">
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                      <Lightbulb className="w-4 h-4" />
                      <span>THE SOLUTION:</span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-700 dark:text-gray-300 leading-relaxed">
                      {activeProject.content?.solution ||
                        "A custom-coded platform powered by Express.js REST APIs, persistent database storage, and fluid micro-animations that make browsing memorable."}
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Column (Key Architecture & Features + Tech Stack Pills) */}
              <div className="lg:col-span-5 p-5 sm:p-6 rounded-2xl bg-slate-50/80 dark:bg-white/[0.02] border border-slate-200/80 dark:border-gray-800/80 space-y-5">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-gray-300 border-b border-slate-200 dark:border-gray-800 pb-3">
                  KEY ARCHITECTURE & FEATURES:
                </div>

                {/* Features Checkmark List */}
                <ul className="space-y-3">
                  {(activeProject.features && activeProject.features.length > 0
                    ? activeProject.features.slice(0, 5)
                    : [
                        "Architectural design system with dual light/dark responsive themes",
                        "High concurrency REST API endpoints with optimized database queries",
                        "Protected JWT authentication with secure session handling",
                        "Fluid GPU-accelerated micro-interactions and touch swipe gestures",
                        "Consistently 95+ Lighthouse performance scores across devices",
                      ]
                  ).map((feature: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-600 dark:text-gray-300">
                      <CheckCircle2 className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                      <span className="leading-snug">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* Technology Pills */}
                {activeProject.technologies && activeProject.technologies.length > 0 && (
                  <div className="pt-3 border-t border-slate-200 dark:border-gray-800 flex flex-wrap gap-1.5">
                    {activeProject.technologies.map((tech: string) => (
                      <span
                        key={tech}
                        className="px-2.5 py-1 rounded-lg bg-white dark:bg-white/5 border border-slate-200 dark:border-gray-800 text-[11px] font-mono font-medium text-slate-700 dark:text-gray-300 shadow-xs"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
