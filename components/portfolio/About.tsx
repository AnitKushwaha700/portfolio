"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Code2,
  Server,
  Database,
  Cpu,
  Terminal,
  Sparkles,
  ArrowRight,
  FileText,
  Quote,
  CheckCircle2,
  ExternalLink,
  Layers,
  User,
} from "lucide-react";
import { FaGithub } from "react-icons/fa";

interface AboutProps {
  settings: any;
}

export default function About({ settings }: AboutProps) {
  const [activeTab, setActiveTab] = useState<"competencies" | "portrait">(
    "competencies"
  );

  const hero = settings?.hero || {};
  const social = settings?.social || {};
  const about = settings?.about || {};

  const profileImage =
    hero?.profileImage && !hero.profileImage.includes("/profile/")
      ? hero.profileImage
      : "https://res.cloudinary.com/jh3ku9oj/image/upload/v1793375810/digital_portfolio/profile_1793375802441.png";

  const githubUrl = social?.github || "https://github.com/AnitKushwaha700";
  const resumeUrl = hero?.resumeUrl || "/resume.pdf";

  // Core Competencies from the requested reference
  const focusAreas = [
    {
      id: "focus_1",
      number: "01",
      title: "Frontend Development",
      description:
        "Modern component architecture with React, Next.js, Tailwind CSS, and fluid GSAP micro-animations.",
      icon: Code2,
    },
    {
      id: "focus_2",
      number: "02",
      title: "Backend Engineering",
      description:
        "RESTful API design, Express.js servers, JWT authentication, and secure middleware pipelines.",
      icon: Server,
    },
    {
      id: "focus_3",
      number: "03",
      title: "Database Architecture",
      description:
        "Data modeling, schema validation, and indexing with MongoDB, Mongoose, and relational MySQL.",
      icon: Database,
    },
    {
      id: "focus_4",
      number: "04",
      title: "Data Structures & Java",
      description:
        "Algorithmic problem solving, clean OOP patterns, and computational complexity optimization.",
      icon: Cpu,
    },
    {
      id: "focus_5",
      number: "05",
      title: "Developer Tooling & CI/CD",
      description:
        "Git version control, Postman API testing, Vite build optimizations, and automated deployment.",
      icon: Terminal,
    },
  ];

  // Engineering depth stats
  const stats = [
    {
      value: "3+ Yrs",
      label: "Engineering Depth",
      detail: "Active programming",
    },
    {
      value: "10+",
      label: "Full Stack Projects",
      detail: "Shipped & verified",
    },
    {
      value: "300+",
      label: "LeetCode & DSA",
      detail: "Problems solved",
    },
    {
      value: "500+",
      label: "Code Commits",
      detail: "Across repositories",
    },
  ];

  return (
    <section id="about" className="section-container relative z-10 py-16 sm:py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 sm:space-y-16"
      >
        {/* Section Header: Matching Signature Centered Pattern */}
        <div className="text-center space-y-2.5 sm:space-y-3 mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-xs font-semibold text-red-500 dark:text-red-400 uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>01 · About Me</span>
          </div>

          <h2 className="section-title mb-0 text-center">
            About{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-rose-500 to-amber-500 drop-shadow-[0_0_30px_rgba(239,68,68,0.35)]">
              Me
            </span>
          </h2>

          <p className="text-xs sm:text-base text-slate-600 dark:text-gray-400 max-w-xl mx-auto px-2">
            Passionate full-stack developer committed to crafting resilient architectures and refined digital experiences.
          </p>
        </div>

        {/* 2-Column Main Layout: Left Side Content & Right Side Image / Competencies */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column (lg:col-span-7): Story, Narrative Bio, Philosophy & CTAs */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-7 space-y-6 sm:space-y-7"
          >
            {/* Headline */}
            <div className="space-y-2">
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white leading-[1.2] tracking-tight">
                Good software should feel{" "}
                <span className="font-serif italic font-normal text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-rose-500 to-amber-500">
                  inevitable.
                </span>
              </h3>
            </div>

            {/* Narrative Paragraphs */}
            <div className="space-y-4 text-sm sm:text-base text-slate-700 dark:text-gray-300 leading-relaxed font-normal">
              {about?.content ? (
                <p className="whitespace-pre-line">{about.content}</p>
              ) : (
                <>
                  <p>
                    I am a Computer Science and Engineering undergraduate (Class of 2026) and passionate Full Stack Developer specializing in the MERN stack. I build robust, scalable web applications that combine high-performance backends with refined editorial user interfaces.
                  </p>
                  <p>
                    My workflow centers on clean component architectures, resilient API design, and intuitive user experiences. I care deeply about writing readable, well-tested code that scales seamlessly under production workloads.
                  </p>
                </>
              )}
            </div>

            {/* Engineering Philosophy Card */}
            <div className="relative p-4 sm:p-5 rounded-xl border-l-4 border-l-red-500 border border-slate-200/90 dark:border-gray-800/90 bg-slate-50/80 dark:bg-white/[0.02] backdrop-blur-sm">
              <Quote className="w-5 h-5 text-red-500/60 mb-2" />
              <p className="text-sm sm:text-base italic text-slate-800 dark:text-gray-200 font-medium leading-relaxed">
                &ldquo;I care about the details users notice, and the engineering they never have to.&rdquo;
              </p>
              <div className="mt-2 text-xs font-mono text-slate-500 dark:text-gray-400">
                — Anit Kushwaha, Full Stack Engineer
              </div>
            </div>

            {/* Action Links & CTAs */}
            <div className="flex flex-wrap items-center gap-4 sm:gap-6 pt-2">
              {githubUrl && (
                <a
                  href={githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="group inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-800 dark:text-gray-200 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                >
                  <FaGithub className="w-4 h-4 text-slate-700 dark:text-gray-300 group-hover:text-red-500 transition-colors" />
                  <span>Inspect my GitHub commits</span>
                  <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </a>
              )}

              {resumeUrl && (
                <a
                  href={resumeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white text-xs sm:text-sm font-semibold shadow-md shadow-red-500/20 hover:scale-105 active:scale-95 transition-all"
                >
                  <FileText className="w-4 h-4" />
                  <span>Resume PDF</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          </motion.div>

          {/* Right Column (lg:col-span-5): The Core Competencies Card / Image Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-5 space-y-4"
          >
            {/* View Switcher: Allows seamless toggle between Core Competencies and Photo Portrait */}
            <div className="flex items-center justify-between p-1 rounded-xl bg-slate-100 dark:bg-white/[0.04] border border-slate-200 dark:border-gray-800">
              <button
                type="button"
                onClick={() => setActiveTab("competencies")}
                className={`flex-1 inline-flex items-center justify-center gap-2 py-1.5 px-3 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === "competencies"
                    ? "bg-white dark:bg-[#121324] text-red-600 dark:text-red-400 shadow-xs border border-slate-200/80 dark:border-gray-700"
                    : "text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Core Competencies</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("portrait")}
                className={`flex-1 inline-flex items-center justify-center gap-2 py-1.5 px-3 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === "portrait"
                    ? "bg-white dark:bg-[#121324] text-red-600 dark:text-red-400 shadow-xs border border-slate-200/80 dark:border-gray-700"
                    : "text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span>Profile Portrait</span>
              </button>
            </div>

            <AnimatePresence mode="wait">
              {activeTab === "competencies" ? (
                /* The Core Competencies Card (from user's screenshot) */
                <motion.div
                  key="competencies-card"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="card p-5 sm:p-6 rounded-2xl border border-slate-200/90 dark:border-gray-800/90 bg-white/95 dark:bg-[#0d0e19]/80 backdrop-blur-xl shadow-md dark:shadow-2xl dark:shadow-black/80 space-y-4"
                >
                  {/* Card Header */}
                  <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-gray-800">
                    <span className="font-mono text-xs uppercase tracking-wider font-semibold text-slate-500 dark:text-gray-400">
                      CORE COMPETENCIES
                    </span>
                    <span className="font-mono text-xs font-semibold text-red-500 dark:text-red-400">
                      Full Stack Scope
                    </span>
                  </div>

                  {/* 5 Focus Areas */}
                  <div className="space-y-4 pt-1">
                    {focusAreas.map((item) => {
                      const Icon = item.icon;
                      return (
                        <div
                          key={item.id}
                          className="group/item flex items-start gap-3.5 p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-white/[0.03] transition-colors"
                        >
                          <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-white/[0.04] border border-slate-200/90 dark:border-gray-800 flex items-center justify-center text-red-500 dark:text-red-400 shrink-0 group-hover/item:border-red-500/40 group-hover/item:bg-red-500/10 transition-colors shadow-2xs">
                            <Icon className="w-5 h-5" />
                          </div>

                          <div className="flex flex-col min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-xs text-slate-400 dark:text-gray-500 font-medium">
                                {item.number}
                              </span>
                              <strong className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                                {item.title}
                              </strong>
                            </div>
                            <p className="text-xs sm:text-[13px] text-slate-600 dark:text-gray-400 leading-relaxed mt-1">
                              {item.description}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              ) : (
                /* Profile Portrait Card (Right Side Image) */
                <motion.div
                  key="portrait-card"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="card p-5 sm:p-6 rounded-2xl border border-slate-200/90 dark:border-gray-800/90 bg-white/95 dark:bg-[#0d0e19]/80 backdrop-blur-xl shadow-md dark:shadow-2xl dark:shadow-black/80 flex flex-col items-center text-center space-y-4"
                >
                  <div className="relative w-48 h-48 sm:w-56 sm:h-56 rounded-2xl overflow-hidden border-2 border-red-500/40 shadow-xl shadow-red-500/10 group">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10" />
                    <Image
                      src={profileImage}
                      alt={hero?.name || "Anit Kushwaha"}
                      fill
                      sizes="(max-width: 768px) 100vw, 300px"
                      className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute bottom-2 left-2 right-2 z-20">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-[11px] font-medium text-white">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span>Ready to Build</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <h4 className="text-lg font-bold text-slate-900 dark:text-white">
                      {hero?.name || "Anit Kushwaha"}
                    </h4>
                    <p className="text-xs font-semibold text-red-500 dark:text-red-400">
                      {hero?.role || "Frontend | MERN Stack Developer"}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-gray-400 max-w-xs mx-auto pt-1">
                      B.Tech in Computer Science & Engineering. Passionate about performant web architectures and interactive UI.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Engineering Depth 4-Stat Strip: Matching the 2026/Stats row from reference */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 pt-10 sm:pt-12 border-t border-slate-200/90 dark:border-gray-800/90">
          {stats.map((st, idx) => (
            <motion.div
              key={st.label}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.08 }}
              className="flex flex-col justify-center items-center text-center p-4 rounded-xl bg-slate-50/60 dark:bg-white/[0.02] border border-slate-200/80 dark:border-gray-800/80 hover:border-red-500/30 transition-colors"
            >
              <span className="text-2xl sm:text-3xl lg:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-rose-500 to-amber-500 drop-shadow-[0_0_20px_rgba(239,68,68,0.25)]">
                {st.value}
              </span>
              <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white mt-1">
                {st.label}
              </span>
              <span className="text-[11px] text-slate-500 dark:text-gray-400 mt-0.5">
                {st.detail}
              </span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
