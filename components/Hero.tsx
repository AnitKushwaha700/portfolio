"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowDown, FileDown } from "lucide-react";
import { GitHubIcon } from "./Icons";

export default function Hero() {
  const prefersReducedMotion = useReducedMotion();

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: prefersReducedMotion ? 0 : 0.12,
        delayChildren: prefersReducedMotion ? 0 : 0.1,
      },
    },
  };

  const item = prefersReducedMotion
    ? { hidden: { opacity: 1 }, visible: { opacity: 1 } }
    : {
        hidden: { opacity: 0, y: 20 },
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            duration: 0.5,
            ease: [0.21, 0.47, 0.32, 0.98] as const,
          },
        },
      };

  return (
    <section
      id="hero"
      className="relative flex min-h-[100dvh] items-center justify-center overflow-hidden px-4 pt-16"
    >
      {/* Subtle background gradient */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute left-1/2 top-0 h-125 w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/5 blur-[120px]" />
      </div>

      <motion.div
        className="relative z-10 mx-auto max-w-3xl text-center"
        variants={container}
        initial="hidden"
        animate="visible"
      >
        {/* Availability badge */}
        <motion.div variants={item} className="mb-8 inline-flex">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-1.5 text-xs font-medium text-text-secondary sm:text-sm">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            Open to Software Developer Opportunities
          </span>
        </motion.div>

        {/* Heading */}
        <motion.h1
          variants={item}
          className="text-4xl font-bold leading-tight tracking-tight text-text-primary sm:text-5xl md:text-6xl"
        >
          Hi, I&apos;m <span className="text-accent">Anit Kushwaha</span>
        </motion.h1>

        {/* Role */}
        <motion.p
          variants={item}
          className="mt-4 text-lg font-medium text-text-secondary sm:text-xl md:text-2xl"
        >
          Software Developer
        </motion.p>

        {/* Description */}
        <motion.p
          variants={item}
          className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-text-muted sm:text-lg"
        >
          Build full-stack web applications using JavaScript, TypeScript,
          React.js, Next.js, Node.js and modern backend technologies.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          variants={item}
          className="mt-10 flex flex-wrap items-center justify-center gap-3 sm:gap-4"
        >
          <a
            href="#projects"
            className="inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-accent-dark focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            View Projects
            <ArrowDown size={16} />
          </a>
          <a
            href="https://github.com/AnitKushwaha700"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface px-5 py-2.5 text-sm font-medium text-text-primary transition-colors hover:border-border-light hover:bg-surface-light"
          >
            <GitHubIcon size={16} />
            GitHub
          </a>
          <a
            href="/resume.pdf"
            download
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface px-5 py-2.5 text-sm font-medium text-text-primary transition-colors hover:border-border-light hover:bg-surface-light"
          >
            <FileDown size={16} />
            Download Resume
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
}
