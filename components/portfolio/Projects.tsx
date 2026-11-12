"use client";

import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  ArrowRight,
  Code2,
  UtensilsCrossed,
  MessageSquare,
  Sparkles,
  ShieldCheck,
  Laptop,
} from "lucide-react";
import { FaGithub } from "react-icons/fa";
import Image from "next/image";
import { formatImageUrl, isExternalUrl, sanitizeUrl } from "@/utils";

interface ProjectsProps {
  projects: any[];
}

/**
 * Modern isometric/SVG fallback graphic when a project image hasn't been uploaded yet.
 * Styled with the signature red/rose/amber cyber theme matching the entire portfolio.
 */
function ProjectGraphicFallback({ slug, title }: { slug: string; title: string }) {
  const normalized = (slug + " " + title).toLowerCase();

  if (normalized.includes("craving") || normalized.includes("food")) {
    return (
      <div className="relative w-full h-full flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-tr from-red-500/10 via-rose-500/15 to-transparent rounded-2xl" />
        <div className="relative flex flex-col items-center justify-center p-4">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-red-500 via-rose-500 to-amber-500 p-0.5 shadow-xl shadow-red-500/30 transform -rotate-3 hover:rotate-0 transition-transform duration-300">
            <div className="w-full h-full bg-[#111827] rounded-[14px] flex items-center justify-center">
              <UtensilsCrossed className="w-10 h-10 text-rose-400" />
            </div>
          </div>
          <div className="mt-3 flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-[10px] font-semibold text-rose-400">
            <span>Fast Delivery API</span>
          </div>
        </div>
      </div>
    );
  }

  if (normalized.includes("chat") || normalized.includes("talk")) {
    return (
      <div className="relative w-full h-full flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-tr from-rose-500/10 via-red-500/15 to-transparent rounded-2xl" />
        <div className="relative flex flex-col items-center justify-center p-4">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-rose-500 to-red-500 p-0.5 shadow-xl shadow-rose-500/30 transform rotate-2 hover:rotate-0 transition-transform duration-300">
            <div className="w-full h-full bg-[#111827] rounded-[14px] flex items-center justify-center">
              <MessageSquare className="w-10 h-10 text-red-400" />
            </div>
          </div>
          <div className="mt-3 flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-[10px] font-semibold text-red-400">
            <span>WebRTC &amp; Sockets</span>
          </div>
        </div>
      </div>
    );
  }

  if (normalized.includes("auth") || normalized.includes("security")) {
    return (
      <div className="relative w-full h-full flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/10 via-red-500/15 to-transparent rounded-2xl" />
        <div className="relative flex flex-col items-center justify-center p-4">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-amber-500 via-rose-500 to-red-500 p-0.5 shadow-xl shadow-amber-500/30 transform -rotate-2 hover:rotate-0 transition-transform duration-300">
            <div className="w-full h-full bg-[#111827] rounded-[14px] flex items-center justify-center">
              <ShieldCheck className="w-10 h-10 text-amber-400" />
            </div>
          </div>
          <div className="mt-3 flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-[10px] font-semibold text-amber-400">
            <span>JWT &amp; RBAC Secure</span>
          </div>
        </div>
      </div>
    );
  }

  if (normalized.includes("career") || normalized.includes("ai") || normalized.includes("resume")) {
    return (
      <div className="relative w-full h-full flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-tr from-rose-500/10 via-amber-500/15 to-transparent rounded-2xl" />
        <div className="relative flex flex-col items-center justify-center p-4">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-red-600 via-rose-500 to-amber-400 p-0.5 shadow-xl shadow-red-500/30 transform rotate-3 hover:rotate-0 transition-transform duration-300">
            <div className="w-full h-full bg-[#111827] rounded-[14px] flex items-center justify-center">
              <Sparkles className="w-10 h-10 text-amber-300" />
            </div>
          </div>
          <div className="mt-3 flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-[10px] font-semibold text-amber-300">
            <span>AI LLM Agent</span>
          </div>
        </div>
      </div>
    );
  }

  // Default Laptop / LMS illustration
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <div className="absolute inset-0 bg-gradient-to-tr from-red-500/10 via-rose-500/15 to-transparent rounded-2xl" />
      <div className="relative flex flex-col items-center justify-center p-4">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-red-500 to-rose-400 p-0.5 shadow-xl shadow-red-500/30 transform hover:scale-105 transition-transform duration-300">
          <div className="w-full h-full bg-[#111827] rounded-[14px] flex items-center justify-center">
            <Laptop className="w-10 h-10 text-rose-400" />
          </div>
        </div>
        <div className="mt-3 flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-[10px] font-semibold text-rose-400">
          <span>Full Stack Platform</span>
        </div>
      </div>
    </div>
  );
}

export default function Projects({ projects }: ProjectsProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const animatingRef = useRef<boolean>(false);
  const autoTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const [isHovered, setIsHovered] = useState(false);
  // extendedIndex tracks position inside the triple-cloned array.
  // Middle copy starts at safeProjects.length (index offset).
  const [extendedIndex, setExtendedIndex] = useState(0); // set properly after mount
  const [animating, setAnimating] = useState(false);
  const [mounted, setMounted] = useState(false);
  // cardWidth stored in state so reads during render are safe and trigger re-renders
  const [cardWidth, setCardWidth] = useState(0);

  const safeProjects = useMemo(() => projects || [], [projects]);
  const hasProjects = safeProjects.length > 0;

  // Build triple-cloned list: [copy0, copy1 (active), copy2]
  // copy1 starts at index N, copy2 starts at 2N.
  const extendedProjects = useMemo(() => {
    if (!hasProjects) return [];
    return [...safeProjects, ...safeProjects, ...safeProjects];
  }, [safeProjects, hasProjects]);

  const N = safeProjects.length;

  // activeIndex: which dot is highlighted (0..N-1)
  const activeIndex = N > 0 ? ((extendedIndex % N) + N) % N : 0;

  // Measure card width via ResizeObserver — stored in state (safe to read during render)
  useEffect(() => {
    if (!hasProjects) return;
    const track = trackRef.current;
    if (!track) return;

    const measure = () => {
      const firstCard = track.firstElementChild as HTMLElement | null;
      if (firstCard) {
        // gap-4 = 16px on mobile, gap-6 = 24px on sm+. Use computed gap.
        const computedGap = parseFloat(getComputedStyle(track).gap) || 16;
        setCardWidth(firstCard.offsetWidth + computedGap);
      }
    };

    // Initial measure after layout
    const raf = requestAnimationFrame(() => {
      measure();
      // Start at middle copy (index N) so we can scroll left or right seamlessly
      setExtendedIndex(N);
      setMounted(true);
    });

    const ro = new ResizeObserver(measure);
    ro.observe(track);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [hasProjects, N]);

  // Advance one step in given direction
  const advance = useCallback(
    (direction: "left" | "right") => {
      if (animatingRef.current) return;

      setExtendedIndex((prev) => {
        const next = direction === "right" ? prev + 1 : prev - 1;
        return next;
      });
      setAnimating(true);
      animatingRef.current = true;
    },
    [],
  );

  // After CSS transition ends, check if we need to silently snap back to middle copy
  const handleTransitionEnd = useCallback(() => {
    setAnimating(false);
    animatingRef.current = false;

    setExtendedIndex((prev) => {
      // If we've drifted into the first copy (< N) or beyond the last (>= 2N), snap to middle
      if (prev < N) return prev + N;
      if (prev >= 2 * N) return prev - N;
      return prev;
    });
  }, [N]);

  // Auto-advance every 3.8s; pause when hovered or tab hidden
  useEffect(() => {
    if (isHovered || !hasProjects || !mounted) return;

    autoTimerRef.current = setInterval(() => {
      if (typeof document !== "undefined" && document.visibilityState === "hidden") return;
      advance("right");
    }, 3800);

    return () => {
      if (autoTimerRef.current) clearInterval(autoTimerRef.current);
    };
  }, [isHovered, hasProjects, mounted, advance]);

  // Jump to a specific dot index
  const scrollToSlide = useCallback(
    (dotIndex: number) => {
      if (animatingRef.current) return;
      // Map dot index into the middle copy
      const target = N + dotIndex;
      setExtendedIndex(target);
      setAnimating(true);
      animatingRef.current = true;
    },
    [N],
  );

  // Compute translateX offset — cardWidth is state so this read is safe during render
  // Before mounted, offset is 0 (no flash of wrong position)
  const translateX = mounted && cardWidth > 0 ? -(extendedIndex * cardWidth) : 0;

  if (!hasProjects) return null;

  return (
    <section id="projects" className="section-container relative overflow-hidden py-20">
      {/* Ambient background glows matching signature palette */}
      <div className="absolute top-1/3 left-1/4 -translate-x-1/2 w-[520px] h-[520px] bg-red-600/10 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 w-[520px] h-[520px] bg-amber-600/10 rounded-full blur-[160px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="relative z-10"
      >
        {/* Section Header: Centered with Signature Red/Rose/Amber Gradient */}
        <div className="text-center space-y-3 mb-12">
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
          <p className="text-sm sm:text-base text-gray-400 max-w-xl mx-auto">
            A selection of production-ready full-stack applications, interactive web tools, and real-time systems.
          </p>
        </div>

        {/* Carousel Outer Wrapper with Left and Right Flanking Buttons */}
        <div
          className="relative w-full px-7 sm:px-12 lg:px-14 flex items-center group/carousel"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onTouchStart={() => setIsHovered(true)}
          onTouchEnd={() => setIsHovered(false)}
        >
          {/* Left Navigation Button (Flanking Left Side) */}
          <button
            onClick={() => advance("left")}
            aria-label="Previous Project"
            className="absolute left-0 sm:left-1 lg:left-2 top-1/2 -translate-y-1/2 z-30 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-[#0d121f]/95 border border-gray-700/80 text-gray-200 hover:text-white hover:border-red-500/80 hover:bg-red-500/20 hover:scale-110 active:scale-95 transition-all duration-300 shadow-2xl shadow-black/90 backdrop-blur-md cursor-pointer flex items-center justify-center group"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 group-hover:-translate-x-0.5 transition-transform" />
          </button>

          {/* Carousel viewport: overflow-hidden clips the sliding track */}
          <div className="w-full overflow-hidden">
            {/* Carousel Infinite Loop Track — GPU-accelerated via translateX */}
            <div
              ref={trackRef}
              className="flex gap-4 sm:gap-6 py-4 select-none"
              style={{
                transform: `translateX(${translateX}px)`,
                transition: animating
                  ? "transform 350ms cubic-bezier(0.25, 0.46, 0.45, 0.94)"
                  : "none",
                willChange: "transform",
                contain: "layout style",
                touchAction: "pan-y",
                // Prevent text selection & user drag
                userSelect: "none",
              }}
              onTransitionEnd={handleTransitionEnd}
            >
              {extendedProjects.map((project, index) => {
                const formattedSrc = formatImageUrl(project.image);
                const isExternal = isExternalUrl(formattedSrc);

                // Pattern in sequence: Alternating Guided Project and Independent Project
                const isGuided = index % 2 === 0;
                const badgeLabel =
                  project.category || (isGuided ? "Guided Project" : "Independent Project");

                return (
                  <div
                    key={`${project._id || project.slug || "proj"}-${index}`}
                    className="flex-shrink-0 w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] snap-start group relative"
                  >
                    {/* RICR-Style Card with Signature Accent */}
                    <div className="relative h-full bg-[#0d121f]/90 border border-gray-800/90 rounded-3xl p-5 sm:p-6 flex flex-col justify-between overflow-hidden shadow-2xl transition-all duration-300 group-hover:border-red-500/50 group-hover:shadow-[0_0_35px_rgba(239,68,68,0.18)]">
                      {/* Top Badge: Consistent Sequence & Harmonized Palette with Live Indicator */}
                      <div className="flex justify-center mb-3 sm:mb-4">
                        <span className="px-3.5 py-1 text-xs font-semibold rounded-full border bg-red-500/10 text-red-400 border-red-500/30 transition-colors flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                          <span>{badgeLabel}</span>
                        </span>
                      </div>

                      {/* Center Graphic / Illustration Area */}
                      <div className="relative h-40 sm:h-52 w-full flex items-center justify-center overflow-hidden my-2 rounded-2xl bg-gradient-to-b from-white/[0.03] to-transparent border border-white/[0.03]">
                        {formattedSrc ? (
                          <Image
                            src={formattedSrc}
                            alt={project.title}
                            fill
                            unoptimized={isExternal}
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            className="object-contain p-3 group-hover:scale-105 transition-transform duration-500 pointer-events-none"
                          />
                        ) : (
                          <ProjectGraphicFallback slug={project.slug} title={project.title} />
                        )}
                      </div>

                      {/* Title & Short Description */}
                      <div className="text-center mt-2 sm:mt-3">
                        <h3 className="text-base sm:text-lg lg:text-xl font-bold text-gray-100 group-hover:text-red-400 transition-colors line-clamp-1">
                          {project.title}
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-400 mt-1.5 sm:mt-2 line-clamp-2 leading-relaxed">
                          {project.description}
                        </p>
                      </div>

                      {/* Tech Stack Pills (RICR 2x2 Grid Style) */}
                      <div className="grid grid-cols-2 gap-2 mt-4 sm:mt-5 pt-1">
                        {(project.technologies || []).slice(0, 4).map((tech: string) => (
                          <span
                            key={tech}
                            className="py-1 sm:py-1.5 px-2.5 sm:px-3 text-center text-[11px] sm:text-xs font-medium text-gray-300 bg-white/[0.03] border border-gray-800 rounded-full hover:border-gray-700 transition-colors truncate"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>

                      {/* Mobile Action Bar: Accessible directly on mobile screens without needing hover */}
                      <div className="flex sm:hidden items-center justify-between mt-4 pt-3 border-t border-gray-800/70">
                        <Link
                          href={`/projects/${project.slug}`}
                          className="text-xs font-semibold text-red-400 hover:text-red-300 flex items-center gap-1.5 transition-colors"
                        >
                          <span>View Details</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                        <div className="flex items-center gap-2">
                          {project.githubUrl && (
                            <Link
                              href={sanitizeUrl(project.githubUrl)}
                              target="_blank"
                              rel="noopener noreferrer"
                              aria-label="GitHub Repository"
                              className="p-1.5 rounded-full bg-white/5 border border-white/10 text-gray-300 hover:text-white"
                            >
                              <FaGithub className="w-3.5 h-3.5" />
                            </Link>
                          )}
                          {project.liveUrl && (
                            <Link
                              href={sanitizeUrl(project.liveUrl)}
                              target="_blank"
                              rel="noopener noreferrer"
                              aria-label="Live Demo"
                              className="p-1.5 rounded-full bg-white/5 border border-white/10 text-gray-300 hover:text-white"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </Link>
                          )}
                        </div>
                      </div>

                      {/* Desktop Interactive Hover Blur Overlay with Signature Red Button */}
                      <div className="hidden sm:flex absolute inset-0 bg-black/70 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all duration-300 flex-col items-center justify-center gap-4 z-20 p-6 pointer-events-none group-hover:pointer-events-auto">
                        <Link
                          href={`/projects/${project.slug}`}
                          className="px-7 py-3 rounded-full bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 hover:opacity-95 text-white text-sm font-semibold shadow-xl shadow-red-600/30 hover:scale-105 active:scale-95 transition-all duration-200 inline-flex items-center gap-2"
                        >
                          <span>View Details</span>
                          <ArrowRight className="w-4 h-4" />
                        </Link>

                        {/* Quick Action Links: GitHub & Live Demo */}
                        <div className="flex items-center gap-3 mt-1">
                          {project.githubUrl && (
                            <Link
                              href={sanitizeUrl(project.githubUrl)}
                              target="_blank"
                              rel="noopener noreferrer"
                              aria-label="GitHub Repository"
                              className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white transition-all hover:scale-110 active:scale-95"
                            >
                              <FaGithub className="w-4 h-4" />
                            </Link>
                          )}
                          {project.liveUrl && (
                            <Link
                              href={sanitizeUrl(project.liveUrl)}
                              target="_blank"
                              rel="noopener noreferrer"
                              aria-label="Live Project Demo"
                              className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white transition-all hover:scale-110 active:scale-95"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Navigation Button (Flanking Right Side) */}
          <button
            onClick={() => advance("right")}
            aria-label="Next Project"
            className="absolute right-0 sm:right-1 lg:right-2 top-1/2 -translate-y-1/2 z-30 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-[#0d121f]/95 border border-gray-700/80 text-gray-200 hover:text-white hover:border-red-500/80 hover:bg-red-500/20 hover:scale-110 active:scale-95 transition-all duration-300 shadow-2xl shadow-black/90 backdrop-blur-md cursor-pointer flex items-center justify-center group"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        {/* Carousel Indicator Dots with Signature Red Gradient */}
        {safeProjects.length > 1 && (
          <div className="flex justify-center items-center gap-2 mt-8">
            {safeProjects.map((_, dotIndex) => (
              <button
                key={dotIndex}
                onClick={() => scrollToSlide(dotIndex)}
                aria-label={`Go to slide ${dotIndex + 1}`}
                className={`transition-all duration-300 rounded-full cursor-pointer ${
                  activeIndex === dotIndex
                    ? "w-8 h-2 bg-gradient-to-r from-red-500 to-amber-500 shadow-[0_0_12px_rgba(239,68,68,0.8)]"
                    : "w-2 h-2 bg-gray-700 hover:bg-gray-500"
                }`}
              />
            ))}
          </div>
        )}
      </motion.div>
    </section>
  );
}
