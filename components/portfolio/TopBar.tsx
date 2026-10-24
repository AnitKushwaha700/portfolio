"use client";

import Link from "next/link";
import { FaGithub, FaLinkedin, FaEnvelope } from "react-icons/fa";
import { FileText } from "lucide-react";
import { sanitizeUrl } from "@/utils";

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
  const brandName = name || "ANIT KUSHWAHA";
  const github = sanitizeUrl(social?.github || "https://github.com/AnitKushwaha700");
  const linkedin = sanitizeUrl(
    social?.linkedin ||
      "https://www.linkedin.com/in/l-anit-kushwaha-l-7651462bb",
  );
  const email = social?.email || "kushwahaanitak@gmail.com";
  const rawResumeUrl = resumeUrl && resumeUrl !== "#" ? resumeUrl : "#contact";
  const effectiveResumeUrl = sanitizeUrl(rawResumeUrl);

  return (
    <header className="fixed top-0 left-0 right-0 z-40 px-6 sm:px-10 lg:px-14 py-6 flex items-center justify-between pointer-events-none">
      {/* Brand Name on top-left, dynamically controlled by Admin */}
      <div className="pointer-events-auto">
        <Link
          href="/"
          className="text-sm sm:text-base font-bold tracking-wider text-white hover:text-red-400 transition-colors group flex items-center"
        >
          <span>{brandName.toUpperCase()}</span>
        </Link>
      </div>

      {/* TopBar Right: Resume Button & Social Links */}
      <div className="pointer-events-auto flex items-center gap-2 sm:gap-3">
        <Link
          href={github}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-full transition-all duration-300 hover:scale-110 active:scale-95"
          aria-label="GitHub"
        >
          <FaGithub className="w-4 h-4" />
        </Link>

        <Link
          href={linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-full transition-all duration-300 hover:scale-110 active:scale-95"
          aria-label="LinkedIn"
        >
          <FaLinkedin className="w-4 h-4" />
        </Link>

        <Link
          href={`mailto:${email}`}
          className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-full transition-all duration-300 hover:scale-110 active:scale-95"
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
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/5 hover:bg-red-500/15 border border-gray-800 hover:border-red-500/50 text-gray-200 hover:text-white text-xs sm:text-sm font-medium transition-all duration-300 hover:scale-105 active:scale-95 backdrop-blur-md shadow-sm"
          >
            <FileText className="w-4 h-4" />
            <span>Resume</span>
          </a>
        )}
      </div>
    </header>
  );
}
