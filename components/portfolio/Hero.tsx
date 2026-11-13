"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Mail } from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { sanitizeUrl } from "@/utils";

interface HeroProps {
  settings: {
    hero: {
      name: string;
      role: string;
      headline?: string;
      description: string;
      profileImage?: string;
      resumeUrl?: string;
      showButtons?: boolean;
      showProfileImage?: boolean;
      statusText?: string;
      primaryButtonText?: string;
      secondaryButtonText?: string;
    };
    social: {
      github?: string;
      linkedin?: string;
      email?: string;
      phone?: string;
    };
  };
  skills?: any[];
  experiences?: any[];
  projects?: any[];
}

export default function Hero({ settings }: HeroProps) {
  const { hero, social } = settings;
  const profileImage =
    hero.profileImage && hero.profileImage !== "/profile/profile.jpg"
      ? hero.profileImage
      : "/profile/anit-suit-trimmed.png";

  // Heading dynamically controlled by Admin (custom headline, or role fallback)
  const adminHeading =
    hero.headline?.trim() || hero.role || "FRONTEND | MERN Stack Developer";

  // Helper to render headline in a single line with rich cyber UI highlights
  const renderHeading = (text: string) => {
    const trimmed = text.trim();

    // Custom enhanced layout for FRONTEND | MERN Stack Developer
    if (/frontend\s*\|\s*mern\s+stack\s+developer/i.test(trimmed)) {
      return (
        <span className="inline-flex items-center flex-wrap sm:flex-nowrap">
          <span className="text-transparent bg-clip-text bg-gradient-to-b from-slate-900 via-slate-800 to-slate-700 dark:from-white dark:via-slate-100 dark:to-slate-300 font-black tracking-tight drop-shadow-[0_2px_18px_rgba(255,255,255,0.2)]">
            FRONTEND
          </span>
          <span className="inline-block mx-2.5 sm:mx-3 text-red-500 font-light drop-shadow-[0_0_15px_rgba(239,68,68,0.95)] select-none">
            |
          </span>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-400 font-black tracking-tight drop-shadow-[0_0_25px_rgba(34,211,238,0.55)] mr-2 sm:mr-2.5">
            MERN
          </span>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 via-red-500 to-rose-600 font-black tracking-tight drop-shadow-[0_0_30px_rgba(244,63,94,0.65)] mr-2 sm:mr-2.5">
            Stack
          </span>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-orange-400 to-amber-300 font-black tracking-tight drop-shadow-[0_0_35px_rgba(251,191,36,0.6)]">
            Developer
          </span>
        </span>
      );
    }

    const words = trimmed.split(" ");
    if (
      words.length >= 2 &&
      words[words.length - 1].toLowerCase() === "developer"
    ) {
      const lastWord = words[words.length - 1];
      const line1Words = words.slice(0, words.length - 1);
      const accent = line1Words.pop() || "";
      const main = line1Words.join(" ");

      return (
        <span className="inline">
          <span className="text-transparent bg-clip-text bg-gradient-to-b from-slate-900 via-slate-800 to-slate-700 dark:from-white dark:via-slate-100 dark:to-slate-300 font-black">
            {main ? `${main} ` : ""}
            <span className="text-red-500 drop-shadow-[0_0_30px_rgba(239,68,68,0.7)]">
              {accent}
            </span>
          </span>{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 via-amber-400 to-yellow-300 drop-shadow-[0_0_35px_rgba(251,191,36,0.6)] font-black">
            {lastWord}
          </span>
        </span>
      );
    }

    if (words.length <= 2) {
      return (
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-rose-500 to-amber-400 drop-shadow-[0_0_35px_rgba(239,68,68,0.5)] font-black">
          {text}
        </span>
      );
    }

    const splitIndex = Math.max(1, words.length - 2);
    const start = words.slice(0, splitIndex).join(" ");
    const highlight = words.slice(splitIndex).join(" ");

    return (
      <span className="inline">
        <span className="text-slate-900 dark:text-white font-black">{start} </span>
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-rose-500 to-amber-400 drop-shadow-[0_0_35px_rgba(239,68,68,0.5)] font-black">
          {highlight}
        </span>
      </span>
    );
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen w-full flex items-center justify-center pt-24 sm:pt-28 lg:pt-20 pb-12 overflow-hidden bg-transparent"
    >
      {/* Ambient Radial Backlights */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 w-[600px] h-[600px] bg-red-600/12 rounded-full blur-[170px] pointer-events-none opacity-40 dark:opacity-100" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 w-[600px] h-[600px] bg-indigo-600/12 rounded-full blur-[180px] pointer-events-none opacity-40 dark:opacity-100" />

      {/* Main 2-Column Hero Container: Left Content, Right Image */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center w-full">
          {/* Left Column: Status Badge, Heading, Description, CTA Buttons */}
          <div className="lg:col-span-6 flex flex-col items-center lg:items-start text-center lg:text-left space-y-5 z-20">
            {/* Live Status Badge */}
            {hero.statusText && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-blue-500/10 dark:bg-blue-500/10 border border-blue-300/80 dark:border-blue-500/25 backdrop-blur-md shadow-sm dark:shadow-lg dark:shadow-blue-950/20"
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-500 dark:bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600 dark:bg-blue-500"></span>
                </span>
                <span className="text-xs font-semibold tracking-wider uppercase text-blue-600 dark:text-blue-400">
                  {hero.statusText}
                </span>
              </motion.div>
            )}

            {/* Main Headline (Single Line with Ambient Cyber Glow) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="relative w-full"
            >
              {/* Subtle Atmospheric Text Backlight Glow */}
              <div className="absolute -left-6 -top-6 w-[110%] h-[160%] bg-gradient-to-r from-red-600/10 via-purple-600/10 to-blue-600/10 rounded-full blur-2xl pointer-events-none" />

              <h1 className="relative text-2xl sm:text-3xl md:text-4xl lg:text-[2.15rem] xl:text-[2.75rem] 2xl:text-5xl font-black tracking-tight text-white leading-tight sm:whitespace-nowrap">
                {renderHeading(adminHeading)}
              </h1>
            </motion.div>

            {/* Bio Description Paragraph */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-sm sm:text-base md:text-lg text-slate-600 dark:text-gray-300/90 max-w-xl leading-relaxed font-normal"
            >
              {hero.description}
            </motion.p>

            {/* Action / CTA Buttons */}
            {hero.showButtons !== false && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-1"
              >
                {/* Primary Button */}
                <Link
                  href="#projects"
                  className="group relative inline-flex items-center gap-2 px-6 sm:px-7 py-3 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 text-white font-semibold text-sm sm:text-base shadow-lg shadow-red-600/30 hover:shadow-red-500/50 hover:scale-105 active:scale-95 transition-all overflow-hidden"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    {hero.primaryButtonText || "Explore Projects"}
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-red-500 via-rose-500 to-amber-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>

                {/* Secondary Button */}
                <Link
                  href="#contact"
                  className="inline-flex items-center gap-2 px-6 sm:px-7 py-3 rounded-xl bg-slate-100/90 dark:bg-white/[0.04] hover:bg-slate-200/90 dark:hover:bg-white/[0.08] border border-slate-300 dark:border-gray-800 hover:border-slate-400 dark:hover:border-gray-600 text-slate-800 dark:text-gray-200 font-semibold text-sm sm:text-base backdrop-blur-md shadow-md shadow-slate-900/5 dark:shadow-black/40 hover:scale-105 active:scale-95 transition-all group"
                >
                  <Mail className="w-4 h-4 text-slate-500 dark:text-gray-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors" />
                  <span>{hero.secondaryButtonText || "Contact Me"}</span>
                </Link>

                {/* Social Quick-Links */}
                {social && (social.github || social.linkedin) && (
                  <div className="flex items-center gap-2 pl-1">
                    {social.github && (
                      <a
                        href={sanitizeUrl(social.github)}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="GitHub Profile"
                        className="p-3 rounded-xl bg-slate-100/90 dark:bg-white/[0.03] hover:bg-slate-200/90 dark:hover:bg-white/[0.08] border border-slate-300 dark:border-gray-800 hover:border-red-500/40 text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white transition-all hover:scale-110 active:scale-95"
                      >
                        <FaGithub className="w-4 h-4" />
                      </a>
                    )}
                    {social.linkedin && (
                      <a
                        href={sanitizeUrl(social.linkedin)}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="LinkedIn Profile"
                        className="p-3 rounded-xl bg-slate-100/90 dark:bg-white/[0.03] hover:bg-slate-200/90 dark:hover:bg-white/[0.08] border border-slate-300 dark:border-gray-800 hover:border-rose-500/40 text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white transition-all hover:scale-110 active:scale-95"
                      >
                        <FaLinkedin className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                )}
              </motion.div>
            )}
          </div>

          {/* Right Column: Profile Image with Increased Height and Seamless Feathered Cyber Smoke */}
          {hero.showProfileImage !== false && profileImage && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              className="lg:col-span-6 flex items-center justify-center lg:justify-end"
            >
              {/* Avatar & Atmosphere Canvas — No hard overflow clipping box */}
              <div className="relative h-[50vh] sm:h-[65vh] lg:h-[75vh] xl:h-[80vh] w-full flex items-end justify-center lg:justify-end select-none">
                {/* 1. Underlying Cyan/Teal Atmospheric Aura Glow (Backlight) */}
                <motion.div
                  animate={{
                    scale: [1, 1.1, 0.95, 1.06, 1],
                    opacity: [0.55, 0.8, 0.5, 0.75, 0.55],
                  }}
                  transition={{
                    duration: 7,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  style={{
                    maskImage:
                      "radial-gradient(ellipse 70% 60% at 50% 50%, black 30%, transparent 75%)",
                    WebkitMaskImage:
                      "radial-gradient(ellipse 70% 60% at 50% 50%, black 30%, transparent 75%)",
                  }}
                  className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[75%] max-w-[450px] h-[50%] rounded-full bg-gradient-to-t from-transparent via-cyan-500/25 to-teal-400/15 blur-3xl pointer-events-none z-0"
                />

                {/* 2. Background Volumetric Cyan Smoke Group (Behind Avatar & Shoulders) */}
                <div
                  className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[650px] h-[82%] pointer-events-none select-none z-0"
                  style={{
                    maskImage:
                      "radial-gradient(ellipse 48% 46% at 50% 50%, black 20%, rgba(0,0,0,0.85) 50%, rgba(0,0,0,0.3) 75%, transparent 98%)",
                    WebkitMaskImage:
                      "radial-gradient(ellipse 48% 46% at 50% 50%, black 20%, rgba(0,0,0,0.85) 50%, rgba(0,0,0,0.3) 75%, transparent 98%)",
                  }}
                >
                  {/* Primary Rising Plume */}
                  <motion.div
                    animate={{
                      x: [-6, 6, -4, 5, -6],
                      y: [0, -8, -2, -6, 0],
                      scale: [1, 1.04, 0.98, 1.03, 1],
                      opacity: [0.85, 0.98, 0.8, 0.95, 0.85],
                    }}
                    transition={{
                      duration: 10,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    style={{
                      maskImage:
                        "radial-gradient(ellipse 50% 46% at 50% 50%, black 25%, transparent 80%)",
                      WebkitMaskImage:
                        "radial-gradient(ellipse 50% 46% at 50% 50%, black 25%, transparent 80%)",
                    }}
                    className="absolute inset-0 mix-blend-screen"
                  >
                    <Image
                      src="/hero/cyan-volumetric-smoke.webp"
                      alt="Volumetric cyan background smoke"
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover object-center"
                      priority
                    />
                  </motion.div>

                  {/* Secondary Vapor Drift */}
                  <motion.div
                    animate={{
                      x: [5, -5, 3, -4, 5],
                      y: [-4, 3, -5, 2, -4],
                      scale: [1.02, 0.97, 1.04, 0.99, 1.02],
                      opacity: [0.45, 0.65, 0.4, 0.6, 0.45],
                    }}
                    transition={{
                      duration: 14,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    style={{
                      maskImage:
                        "radial-gradient(ellipse 46% 42% at 50% 50%, black 20%, transparent 75%)",
                      WebkitMaskImage:
                        "radial-gradient(ellipse 46% 42% at 50% 50%, black 20%, transparent 75%)",
                    }}
                    className="absolute inset-0 mix-blend-screen scale-x-[-1] blur-[0.5px]"
                  >
                    <Image
                      src="/hero/cyan-smoke-foreground.webp"
                      alt="Ambient cyan vapor drift"
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover object-bottom"
                    />
                  </motion.div>
                </div>

                {/* 3. Profile Image with Multi-Layer Soft Torso & Silhouette Vignette (Zero Border Lines) */}
                <div
                  className="relative w-full h-full z-10 flex items-end justify-center select-none"
                  style={{
                    maskImage:
                      "linear-gradient(to top, transparent 0%, transparent 6%, rgba(0,0,0,0.3) 18%, black 32%, black 100%)",
                    WebkitMaskImage:
                      "linear-gradient(to top, transparent 0%, transparent 6%, rgba(0,0,0,0.3) 18%, black 32%, black 100%)",
                  }}
                >
                  <div
                    className="relative w-full h-full flex items-end justify-center"
                    style={{
                      maskImage:
                        "radial-gradient(ellipse 47% 50% at 50% 48%, black 45%, rgba(0,0,0,0.85) 68%, rgba(0,0,0,0.2) 88%, transparent 98%)",
                      WebkitMaskImage:
                        "radial-gradient(ellipse 47% 50% at 50% 48%, black 45%, rgba(0,0,0,0.85) 68%, rgba(0,0,0,0.2) 88%, transparent 98%)",
                    }}
                  >
                    <Image
                      src={profileImage}
                      alt={hero.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-contain object-bottom select-none pointer-events-none"
                      priority
                    />
                  </div>
                </div>

                {/* 4. Foreground Volumetric Smoke Group (In Front of Waist, Lower Torso & Arms) */}
                <div
                  className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[580px] h-[55%] pointer-events-none select-none z-20"
                  style={{
                    maskImage:
                      "radial-gradient(ellipse 48% 46% at 50% 50%, black 25%, rgba(0,0,0,0.85) 55%, rgba(0,0,0,0.3) 78%, transparent 98%)",
                    WebkitMaskImage:
                      "radial-gradient(ellipse 48% 46% at 50% 50%, black 25%, rgba(0,0,0,0.85) 55%, rgba(0,0,0,0.3) 78%, transparent 98%)",
                  }}
                >
                  {/* Primary Foreground Rolling Cumulus Cloud */}
                  <motion.div
                    animate={{
                      x: [-5, 5, -3, 4, -5],
                      y: [0, -5, 2, -3, 0],
                      scale: [1, 1.03, 0.98, 1.02, 1],
                      opacity: [0.85, 0.98, 0.8, 0.95, 0.85],
                    }}
                    transition={{
                      duration: 9,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    style={{
                      maskImage:
                        "radial-gradient(ellipse 50% 46% at 50% 50%, black 30%, transparent 82%)",
                      WebkitMaskImage:
                        "radial-gradient(ellipse 50% 46% at 50% 50%, black 30%, transparent 82%)",
                    }}
                    className="absolute inset-0 mix-blend-screen"
                  >
                    <Image
                      src="/hero/cyan-smoke-foreground.webp"
                      alt="Foreground volumetric rolling smoke"
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover object-bottom"
                    />
                  </motion.div>

                  {/* Secondary Foreground Billowing Tendrils */}
                  <motion.div
                    animate={{
                      x: [4, -4, 2, -3, 4],
                      y: [-2, 3, -3, 1, -2],
                      scale: [1.02, 0.98, 1.03, 0.99, 1.02],
                      opacity: [0.65, 0.85, 0.6, 0.8, 0.65],
                    }}
                    transition={{
                      duration: 12,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    style={{
                      maskImage:
                        "radial-gradient(ellipse 46% 42% at 50% 50%, black 25%, transparent 78%)",
                      WebkitMaskImage:
                        "radial-gradient(ellipse 46% 42% at 50% 50%, black 25%, transparent 78%)",
                    }}
                    className="absolute inset-0 mix-blend-screen scale-x-[-1] blur-[0.5px]"
                  >
                    <Image
                      src="/hero/cyan-volumetric-smoke.webp"
                      alt="Foreground billowing smoke tendrils"
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover object-bottom"
                    />
                  </motion.div>
                </div>

                {/* 5. Extra Ground-Level Smoke Pool (above foreground smoke, pooling at base) */}
                <div
                  className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[650px] h-[30%] pointer-events-none select-none z-25"
                  style={{
                    maskImage:
                      "radial-gradient(ellipse 48% 46% at 50% 50%, black 25%, rgba(0,0,0,0.8) 55%, rgba(0,0,0,0.25) 78%, transparent 98%)",
                    WebkitMaskImage:
                      "radial-gradient(ellipse 48% 46% at 50% 50%, black 25%, rgba(0,0,0,0.8) 55%, rgba(0,0,0,0.25) 78%, transparent 98%)",
                  }}
                >
                  {/* Ground Smoke Layer 1 — slow creep */}
                  <motion.div
                    animate={{
                      x: [-8, 8, -4, 6, -8],
                      y: [0, -4, 2, -2, 0],
                      scale: [1, 1.04, 0.97, 1.03, 1],
                      opacity: [0.7, 0.9, 0.65, 0.85, 0.7],
                    }}
                    transition={{
                      duration: 12,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    style={{
                      maskImage:
                        "radial-gradient(ellipse 52% 44% at 50% 50%, black 25%, transparent 75%)",
                      WebkitMaskImage:
                        "radial-gradient(ellipse 52% 44% at 50% 50%, black 25%, transparent 75%)",
                    }}
                    className="absolute inset-0 mix-blend-screen"
                  >
                    <Image
                      src="/hero/cyan-smoke-foreground.webp"
                      alt="Ground-level smoke pool layer 1"
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover object-bottom"
                    />
                  </motion.div>

                  {/* Ground Smoke Layer 2 — slower drift */}
                  <motion.div
                    animate={{
                      x: [6, -6, 3, -5, 6],
                      y: [-2, 4, -3, 2, -2],
                      scale: [1.03, 0.97, 1.05, 0.98, 1.03],
                      opacity: [0.55, 0.75, 0.5, 0.7, 0.55],
                    }}
                    transition={{
                      duration: 16,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    style={{
                      maskImage:
                        "radial-gradient(ellipse 48% 40% at 50% 50%, black 20%, transparent 72%)",
                      WebkitMaskImage:
                        "radial-gradient(ellipse 48% 40% at 50% 50%, black 20%, transparent 72%)",
                    }}
                    className="absolute inset-0 mix-blend-screen scale-x-[-1]"
                  >
                    <Image
                      src="/hero/cyan-volumetric-smoke.webp"
                      alt="Ground-level smoke pool layer 2"
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover object-bottom"
                    />
                  </motion.div>
                </div>

                {/* 6. Pure-CSS Radial Ground Glow */}
                <div
                  className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-[20%] bg-gradient-to-t from-cyan-500/15 via-teal-500/8 to-transparent blur-2xl pointer-events-none z-30"
                />
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
