"use client";

import Link from "next/link";
import { FaGithub, FaLinkedin, FaEnvelope } from "react-icons/fa";
import { FileText, Sun, Moon } from "lucide-react";
import { sanitizeUrl } from "@/utils";
import { useTheme } from "@/components/theme/ThemeProvider";

interface TopBarProps {
  name?: string;
  resumeUrl?: string;
  social?: {
    github?: string;
    linkedin?: string;
    email?: string;
  };
}

export default function TopBar({ name, resumeUrl, social }: TopBarProps) {
  const { theme, toggleTheme } = useTheme();
  const brandName = name || "ANIT KUSHWAHA";
  const github = sanitizeUrl(
    social?.github || "https://github.com/AnitKushwaha700",
  );
  const linkedin = sanitizeUrl(
    social?.linkedin ||
      "https://www.linkedin.com/in/l-anit-kushwaha-l-7651462bb",
  );
  const email = social?.email || "kushwahaanitak@gmail.com";
  const rawResumeUrl = resumeUrl && resumeUrl !== "#" ? resumeUrl : "#contact";
  const effectiveResumeUrl = sanitizeUrl(rawResumeUrl);

  const handleResumeClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (effectiveResumeUrl.startsWith("#")) {
      e.preventDefault();
      const id = effectiveResumeUrl.slice(1);
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-40 px-4 sm:px-10 lg:px-14 py-3 sm:py-4 flex items-center justify-between w-full max-w-full bg-white/85 dark:bg-[#07070d]/85 backdrop-blur-md border-b border-slate-200/80 dark:border-gray-800/80 transition-colors duration-300">
      {/* Brand Name on top-left, dynamically controlled by Admin */}
      <div className="pointer-events-auto shrink-0">
        <Link
          href="/"
          className="text-xs sm:text-base font-bold tracking-wider text-slate-900 dark:text-white hover:text-red-600 dark:hover:text-red-400 transition-colors group flex items-center"
        >
          <span className="truncate max-w-[110px] sm:max-w-none font-bold tracking-wider">{brandName.toUpperCase()}</span>
        </Link>
      </div>

      {/* TopBar Right: Theme Toggle, Resume Button & Social Links */}
      <div className="pointer-events-auto flex items-center gap-1.5 sm:gap-3 shrink-0">
        {/* Theme Toggle Button (Light / Dark) — styled exactly like social icons */}
        <button
          onClick={toggleTheme}
          suppressHydrationWarning
          aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          className="p-1.5 sm:p-2 text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 rounded-full transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer flex items-center justify-center shrink-0"
        >
          {theme === "dark" ? (
            <Sun className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform duration-300 hover:rotate-45" />
          ) : (
            <Moon className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform duration-300 hover:-rotate-12" />
          )}
        </button>

        <Link
          href={github}
          target="_blank"
          rel="noopener noreferrer"
          className="p-1.5 sm:p-2 text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 rounded-full transition-all duration-300 hover:scale-110 active:scale-95"
          aria-label="GitHub"
        >
          <FaGithub className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </Link>

        <Link
          href={linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="p-1.5 sm:p-2 text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 rounded-full transition-all duration-300 hover:scale-110 active:scale-95"
          aria-label="LinkedIn"
        >
          <FaLinkedin className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </Link>

        <Link
          href={`mailto:${email}`}
          className="hidden sm:inline-flex p-1.5 sm:p-2 text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 rounded-full transition-all duration-300 hover:scale-110 active:scale-95"
          aria-label="Email"
        >
          <FaEnvelope className="w-3.5 h-3.5" />
        </Link>

        {effectiveResumeUrl && (
          <a
            href={effectiveResumeUrl}
            target={effectiveResumeUrl.startsWith("#") ? "_self" : "_blank"}
            rel={
              effectiveResumeUrl.startsWith("#")
                ? undefined
                : "noopener noreferrer"
            }
            onClick={handleResumeClick}
            aria-label="View Resume"
            className="group flex items-center gap-1.5 px-3 sm:px-3.5 py-1 sm:py-1.5 rounded-full bg-slate-100/90 dark:bg-white/5 hover:bg-red-50 dark:hover:bg-red-500/15 border border-slate-300/90 dark:border-gray-800 hover:border-red-500/60 dark:hover:border-red-500/60 transition-all duration-300 hover:scale-105 active:scale-95 backdrop-blur-md shadow-xs shrink-0 cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-600 dark:text-red-400 group-hover:scale-110 transition-transform shrink-0" />
            <span className="font-semibold text-slate-900 dark:text-gray-100 group-hover:text-red-600 dark:group-hover:text-white transition-colors text-xs sm:text-sm">
              Resume
            </span>
          </a>
        )}
      </div>
    </header>
  );
}
