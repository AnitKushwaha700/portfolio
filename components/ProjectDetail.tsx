"use client";

import Link from "next/link";
import { ArrowLeft, ExternalLink, ArrowDown } from "lucide-react";
import { GitHubIcon } from "./Icons";
import { motion, useReducedMotion } from "framer-motion";
import type { Project } from "@/data/projects";

interface ProjectDetailProps {
  project: Project;
}

export default function ProjectDetail({ project }: ProjectDetailProps) {
  const prefersReducedMotion = useReducedMotion();

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: prefersReducedMotion ? 0 : 0.08,
        delayChildren: prefersReducedMotion ? 0 : 0.1,
      },
    },
  };

  const item = prefersReducedMotion
    ? { hidden: { opacity: 1 }, visible: { opacity: 1 } }
    : {
        hidden: { opacity: 0, y: 16 },
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            duration: 0.4,
            ease: [0.21, 0.47, 0.32, 0.98] as const,
          },
        },
      };

  return (
    <div className="px-4 pb-20 pt-24 sm:px-6 md:pt-28">
      <motion.div
        className="mx-auto max-w-4xl"
        variants={container}
        initial="hidden"
        animate="visible"
      >
        {/* Back link */}
        <motion.div variants={item}>
          <Link
            href="/#projects"
            className="mb-8 inline-flex items-center gap-2 text-sm text-text-secondary transition-colors hover:text-text-primary"
          >
            <ArrowLeft size={16} />
            Back to Projects
          </Link>
        </motion.div>

        {/* Header */}
        <motion.div variants={item} className="mb-10">
          <h1 className="text-3xl font-bold tracking-tight text-text-primary sm:text-4xl md:text-5xl">
            {project.name}
          </h1>
          <p className="mt-2 text-lg text-accent">{project.tagline}</p>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-text-secondary">
            {project.overview}
          </p>

          {/* Tech & Links */}
          <div className="mt-6 flex flex-wrap items-center gap-3">
            {project.techStack.map((tech) => (
              <span
                key={tech}
                className="rounded-md bg-surface px-3 py-1 text-xs font-medium text-text-secondary"
              >
                {tech}
              </span>
            ))}
          </div>

          <div className="mt-4 flex flex-wrap gap-3">
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium text-text-primary transition-colors hover:border-border-light hover:bg-surface"
              >
                <GitHubIcon size={16} />
                View Code
              </a>
            )}
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-dark"
              >
                <ExternalLink size={16} />
                Live Demo
              </a>
            )}
          </div>
        </motion.div>

        {/* Content Grid */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Problem */}
          <motion.div variants={item}>
            <div className="h-full rounded-xl border border-border bg-surface p-5 sm:p-6">
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-text-muted">
                Problem
              </h2>
              <p className="text-sm leading-relaxed text-text-secondary">
                {project.problem}
              </p>
            </div>
          </motion.div>

          {/* Solution */}
          <motion.div variants={item}>
            <div className="h-full rounded-xl border border-border bg-surface p-5 sm:p-6">
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-text-muted">
                Solution
              </h2>
              <p className="text-sm leading-relaxed text-text-secondary">
                {project.solution}
              </p>
            </div>
          </motion.div>
        </div>

        {/* Key Features */}
        <motion.div variants={item} className="mt-6">
          <div className="rounded-xl border border-border bg-surface p-5 sm:p-6">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-text-muted">
              Key Features
            </h2>
            <div className="grid gap-2 sm:grid-cols-2">
              {project.features.map((feature) => (
                <div
                  key={feature}
                  className="flex items-start gap-2 text-sm text-text-secondary"
                >
                  <span
                    className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent"
                    aria-hidden="true"
                  />
                  {feature}
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Architecture */}
        <motion.div variants={item} className="mt-6">
          <div className="rounded-xl border border-border bg-surface p-5 sm:p-6">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-text-muted">
              Architecture
            </h2>
            <div className="flex flex-col items-center gap-1">
              {project.architecture.map((layer, i) => (
                <div key={layer.label} className="flex flex-col items-center">
                  <div className="w-full max-w-xs rounded-lg border border-border bg-background px-4 py-3 text-center">
                    <p className="text-xs font-medium text-text-muted">
                      {layer.label}
                    </p>
                    <p className="mt-0.5 text-sm font-semibold text-text-primary">
                      {layer.tech}
                    </p>
                  </div>
                  {i < project.architecture.length - 1 && (
                    <ArrowDown
                      size={16}
                      className="my-1 text-text-muted"
                      aria-hidden="true"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* My Contribution */}
        <motion.div variants={item} className="mt-6">
          <div className="rounded-xl border border-border bg-surface p-5 sm:p-6">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-text-muted">
              My Contribution
            </h2>
            <ul className="space-y-2">
              {project.contribution.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2 text-sm text-text-secondary"
                >
                  <span
                    className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent/60"
                    aria-hidden="true"
                  />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </motion.div>

        {/* Challenges & Learnings */}
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <motion.div variants={item}>
            <div className="h-full rounded-xl border border-border bg-surface p-5 sm:p-6">
              <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-text-muted">
                Challenges
              </h2>
              <ul className="space-y-2">
                {project.challenges.map((challenge) => (
                  <li
                    key={challenge}
                    className="flex items-start gap-2 text-sm text-text-secondary"
                  >
                    <span
                      className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500/60"
                      aria-hidden="true"
                    />
                    {challenge}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>

          <motion.div variants={item}>
            <div className="h-full rounded-xl border border-border bg-surface p-5 sm:p-6">
              <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-text-muted">
                What I Learned
              </h2>
              <ul className="space-y-2">
                {project.learnings.map((learning) => (
                  <li
                    key={learning}
                    className="flex items-start gap-2 text-sm text-text-secondary"
                  >
                    <span
                      className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500/60"
                      aria-hidden="true"
                    />
                    {learning}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
