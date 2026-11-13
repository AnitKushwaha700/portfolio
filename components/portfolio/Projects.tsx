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
import ProjectCard3D from "./ProjectCard3D";

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
        <div className="absolute inset-0 bg-gradient-to-tr from-red-500/10 via-rose-500/15 to-transparent rounded-xl" />
        <div className="relative flex items-center justify-center">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-tr from-red-500 via-rose-500 to-amber-500 p-0.5 shadow-lg shadow-red-500/30 transform -rotate-2 hover:rotate-0 transition-transform duration-300">
            <div className="w-full h-full bg-[#111827] rounded-[14px] flex items-center justify-center">
              <UtensilsCrossed className="w-6 h-6 sm:w-7 sm:h-7 text-rose-400" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (normalized.includes("chat") || normalized.includes("talk")) {
    return (
      <div className="relative w-full h-full flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-tr from-rose-500/10 via-red-500/15 to-transparent rounded-xl" />
        <div className="relative flex items-center justify-center">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-tr from-rose-500 to-red-500 p-0.5 shadow-lg shadow-rose-500/30 transform rotate-2 hover:rotate-0 transition-transform duration-300">
            <div className="w-full h-full bg-[#111827] rounded-[14px] flex items-center justify-center">
              <MessageSquare className="w-6 h-6 sm:w-7 sm:h-7 text-red-400" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (normalized.includes("auth") || normalized.includes("security")) {
    return (
      <div className="relative w-full h-full flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/10 via-red-500/15 to-transparent rounded-xl" />
        <div className="relative flex items-center justify-center">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-tr from-amber-500 via-rose-500 to-red-500 p-0.5 shadow-lg shadow-amber-500/30 transform -rotate-2 hover:rotate-0 transition-transform duration-300">
            <div className="w-full h-full bg-[#111827] rounded-[14px] flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 sm:w-7 sm:h-7 text-amber-400" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (normalized.includes("career") || normalized.includes("ai") || normalized.includes("resume")) {
    return (
      <div className="relative w-full h-full flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-tr from-rose-500/10 via-amber-500/15 to-transparent rounded-xl" />
        <div className="relative flex items-center justify-center">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-tr from-red-600 via-rose-500 to-amber-400 p-0.5 shadow-lg shadow-red-500/30 transform rotate-2 hover:rotate-0 transition-transform duration-300">
            <div className="w-full h-full bg-[#111827] rounded-[14px] flex items-center justify-center">
              <Sparkles className="w-6 h-6 sm:w-7 sm:h-7 text-amber-300" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Default Laptop / Platform illustration
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <div className="absolute inset-0 bg-gradient-to-tr from-red-500/10 via-rose-500/15 to-transparent rounded-xl" />
      <div className="relative flex items-center justify-center">
        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-tr from-red-500 to-rose-400 p-0.5 shadow-lg shadow-red-500/30 transform hover:scale-105 transition-transform duration-300">
          <div className="w-full h-full bg-[#111827] rounded-[14px] flex items-center justify-center">
            <Laptop className="w-6 h-6 sm:w-7 sm:h-7 text-rose-400" />
          </div>
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

  // Touch gesture tracking for mobile swipe navigation
  const touchStartX = useRef<number>(0);
  const touchStartY = useRef<number>(0);
  const touchDeltaX = useRef<number>(0);

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

  // Mobile Touch handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsHovered(true);
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    touchDeltaX.current = 0;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const currentX = e.touches[0].clientX;
    const currentY = e.touches[0].clientY;
    const diffX = currentX - touchStartX.current;
    const diffY = currentY - touchStartY.current;

    // Track horizontal swipe only when user is not vertically scrolling
    if (Math.abs(diffX) > Math.abs(diffY)) {
      touchDeltaX.current = diffX;
    }
  };

  const handleTouchEnd = () => {
    setIsHovered(false);
    const threshold = 35; // minimum swipe distance
    if (touchDeltaX.current < -threshold) {
      advance("right");
    } else if (touchDeltaX.current > threshold) {
      advance("left");
    }
    touchDeltaX.current = 0;
  };

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
    <section id="projects" className="section-container relative w-full max-w-full overflow-hidden scroll-mt-20 pt-20 sm:pt-28 pb-12 sm:pb-16">
      {/* Ambient background glows matching signature palette */}
      <div className="absolute top-1/3 left-1/4 -translate-x-1/2 w-[300px] sm:w-[450px] h-[300px] sm:h-[450px] bg-red-600/10 rounded-full blur-[100px] sm:blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 w-[300px] sm:w-[450px] h-[300px] sm:h-[450px] bg-amber-600/10 rounded-full blur-[100px] sm:blur-[140px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-6xl mx-auto"
      >
        {/* Section Header: Centered with Signature Red/Rose/Amber Gradient */}
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
            A selection of production-ready full-stack applications, interactive web tools, and real-time systems.
          </p>
        </div>

        {/* Mobile Swipe Hint */}
        <div className="flex sm:hidden items-center justify-center gap-1.5 text-[11px] text-gray-400 mb-3 select-none">
          <span className="animate-pulse">‹ Swipe left/right or use side arrows ›</span>
        </div>

        {/* Carousel Outer Wrapper with Left and Right Flanking Buttons */}
        <div
          className="relative w-full max-w-full px-7 sm:px-11 lg:px-12 flex items-center group/carousel"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Left Navigation Button (Flanking Left Side) */}
          <button
            onClick={() => advance("left")}
            aria-label="Previous Project"
            className="absolute left-0 sm:left-0.5 lg:left-1 top-1/2 -translate-y-1/2 z-30 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/95 dark:bg-[#0d121f]/95 border border-slate-300 dark:border-gray-700/80 text-slate-700 dark:text-gray-200 hover:text-red-600 dark:hover:text-white hover:border-red-500/80 hover:bg-red-50 dark:hover:bg-red-500/20 hover:scale-110 active:scale-95 transition-all duration-300 shadow-md dark:shadow-2xl dark:shadow-black/90 backdrop-blur-md cursor-pointer flex items-center justify-center group"
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 group-hover:-translate-x-0.5 transition-transform" />
          </button>

          {/* Carousel viewport: overflow-hidden clips the sliding track. min-w-0 prevents flex container blowout */}
          <div className="w-full min-w-0 overflow-hidden">
            {/* Carousel Infinite Loop Track — GPU-accelerated via translateX */}
            <div
              ref={trackRef}
              className="flex gap-3.5 sm:gap-5 py-3 select-none"
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
                    className="flex-shrink-0 w-full sm:w-[calc(50%-10px)] lg:w-[calc(33.333%-14px)] snap-start group relative min-w-0 max-w-full"
                  >
                    {/* Compact, Sleek 3D Tilt Project Card with Layered Depth */}
                    <ProjectCard3D>
                      <div className="relative h-full bg-white/95 dark:bg-[#0d121f]/90 border border-slate-200 dark:border-gray-800/90 rounded-2xl p-4 sm:p-5 flex flex-col justify-between overflow-hidden shadow-md dark:shadow-xl transition-all duration-300 group-hover:border-red-500/50 group-hover:shadow-[0_15px_30px_rgba(239,68,68,0.12)] dark:group-hover:shadow-[0_0_25px_rgba(239,68,68,0.15)] [transform-style:preserve-3d]">
                        {/* Top Badge: Floating Layer at translateZ(30px) */}
                        <div className="flex justify-center mb-2 [transform:translateZ(30px)]">
                          <span className="px-2.5 py-0.5 text-[10px] sm:text-[11px] font-semibold rounded-full border bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border-red-200/80 dark:border-red-500/30 transition-colors flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                            <span>{badgeLabel}</span>
                          </span>
                        </div>

                        {/* Project Preview Image Container: Floating Layer at translateZ(22px) */}
                        <div className="relative h-36 sm:h-44 w-full flex items-center justify-center overflow-hidden my-1.5 sm:my-2 rounded-xl bg-slate-100 dark:bg-[#0b0f19] [transform:translateZ(22px)] shadow-md">
                          {formattedSrc ? (
                            <Image
                              src={formattedSrc}
                              alt={project.title}
                              fill
                              unoptimized={isExternal}
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                              className="object-cover object-top group-hover:scale-105 transition-transform duration-500 pointer-events-none"
                            />
                          ) : (
                            <ProjectGraphicFallback slug={project.slug} title={project.title} />
                          )}
                        </div>

                        {/* Title & Short Description: Floating Layer at translateZ(14px) */}
                        <div className="text-center mt-1.5 sm:mt-2 [transform:translateZ(14px)]">
                          <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-gray-100 group-hover:text-red-500 dark:group-hover:text-red-400 transition-colors line-clamp-1">
                            {project.title}
                          </h3>
                          <p className="text-xs text-slate-600 dark:text-gray-400 mt-1 line-clamp-2 leading-relaxed">
                            {project.description}
                          </p>
                        </div>

                        {/* Tech Stack Pills (RICR 2x2 Grid Style) */}
                        <div className="grid grid-cols-2 gap-1.5 mt-2.5 pt-1 [transform:translateZ(16px)]">
                          {(project.technologies || []).slice(0, 4).map((tech: string) => (
                            <span
                              key={tech}
                              className="py-1 px-2 text-center text-[10px] sm:text-[11px] font-medium text-slate-700 dark:text-gray-300 bg-slate-100/90 dark:bg-white/[0.03] border border-slate-200 dark:border-gray-800 rounded-full hover:border-slate-300 dark:hover:border-gray-700 transition-colors truncate"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>

                        {/* Mobile Action Bar */}
                        <div className="flex sm:hidden items-center justify-between mt-3 pt-2.5 border-t border-slate-200/80 dark:border-gray-800/70 [transform:translateZ(20px)]">
                          <Link
                            href={`/projects/${project.slug}`}
                            className="px-2.5 py-1 rounded-lg bg-red-500/10 border border-red-500/20 text-xs font-semibold text-red-400 hover:text-red-300 flex items-center gap-1 transition-colors active:scale-95"
                          >
                            <span>View</span>
                            <ArrowRight className="w-3 h-3" />
                          </Link>
                          <div className="flex items-center gap-1.5">
                            {project.githubUrl && (
                              <Link
                                href={sanitizeUrl(project.githubUrl)}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="GitHub Repository"
                                className="p-1.5 rounded-full bg-white/5 border border-white/10 text-gray-300 hover:text-white active:scale-95 transition-all"
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
                                className="p-1.5 rounded-full bg-white/5 border border-white/10 text-gray-300 hover:text-white active:scale-95 transition-all"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                              </Link>
                            )}
                          </div>
                        </div>

                        {/* Desktop Interactive Hover Blur Overlay with Signature Red Button */}
                        <div className="hidden sm:flex absolute inset-0 bg-black/75 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all duration-300 flex-col items-center justify-center gap-3 z-20 p-5 pointer-events-none group-hover:pointer-events-auto [transform:translateZ(32px)]">
                          <Link
                            href={`/projects/${project.slug}`}
                            className="px-6 py-2.5 rounded-full bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 hover:opacity-95 text-white text-xs font-semibold shadow-xl shadow-red-600/30 hover:scale-105 active:scale-95 transition-all duration-200 inline-flex items-center gap-2"
                          >
                            <span>View Details</span>
                            <ArrowRight className="w-3.5 h-3.5" />
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
                  </ProjectCard3D>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Navigation Button (Flanking Right Side) */}
          <button
            onClick={() => advance("right")}
            aria-label="Next Project"
            className="absolute right-0.5 sm:right-1 lg:right-2 top-1/2 -translate-y-1/2 z-30 w-8 h-8 sm:w-11 sm:h-11 rounded-full bg-white/95 dark:bg-[#0d121f]/95 border border-slate-300 dark:border-gray-700/80 text-slate-700 dark:text-gray-200 hover:text-red-600 dark:hover:text-white hover:border-red-500/80 hover:bg-red-50 dark:hover:bg-red-500/20 hover:scale-110 active:scale-95 transition-all duration-300 shadow-md dark:shadow-2xl dark:shadow-black/90 backdrop-blur-md cursor-pointer flex items-center justify-center group"
          >
            <ChevronRight className="w-4 h-4 sm:w-6 sm:h-6 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        {/* Carousel Indicator Dots with Signature Red Gradient */}
        {safeProjects.length > 1 && (
          <div className="flex justify-center items-center gap-2 mt-6 sm:mt-8">
            {safeProjects.map((_, dotIndex) => (
              <button
                key={dotIndex}
                onClick={() => scrollToSlide(dotIndex)}
                aria-label={`Go to slide ${dotIndex + 1}`}
                className="py-2 px-0.5 group cursor-pointer focus:outline-none"
              >
                <span
                  className={`block transition-all duration-300 rounded-full ${
                    activeIndex === dotIndex
                      ? "w-7 sm:w-8 h-2 bg-gradient-to-r from-red-500 to-amber-500 shadow-[0_0_12px_rgba(239,68,68,0.8)]"
                      : "w-2 h-2 bg-gray-700 group-hover:bg-gray-500"
                  }`}
                />
              </button>
            ))}
          </div>
        )}
      </motion.div>
    </section>
  );
}
