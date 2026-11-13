"use client";

import { motion } from "framer-motion";
import { GraduationCap, Code2, Server } from "lucide-react";

export default function About({ settings }: { settings: any }) {
  const highlights = [
    {
      icon: GraduationCap,
      title: "B.Tech in CSE",
      desc: "Computer Science Engineering graduate with deep focus on algorithms, data structures & software architecture.",
      color:
        "from-emerald-50 to-teal-50 text-emerald-600 border-emerald-200/80 dark:from-emerald-500/20 dark:to-teal-500/10 dark:text-emerald-400 dark:border-emerald-500/30",
    },
    {
      icon: Code2,
      title: "Frontend Engineering",
      desc: "Crafting reactive, pixel-perfect user interfaces with React.js, Next.js, TypeScript, and modern CSS systems.",
      color:
        "from-emerald-50 to-teal-50 text-emerald-600 border-emerald-200/80 dark:from-emerald-500/20 dark:to-teal-500/10 dark:text-emerald-400 dark:border-emerald-500/30",
    },
    {
      icon: Server,
      title: "Scalable Backends",
      desc: "Architecting secure RESTful APIs, authentication workflows, and robust databases with Node.js & MongoDB.",
      color:
        "from-emerald-50 to-teal-50 text-emerald-600 border-emerald-200/80 dark:from-emerald-500/20 dark:to-teal-500/10 dark:text-emerald-400 dark:border-emerald-500/30",
    },
  ];

  return (
    <section id="about" className="relative z-10 py-16 sm:py-24 overflow-hidden bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="space-y-10"
        >
          {/* Section Header: Matching Pattern Sequence & Editorial Layout */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 sm:mb-12">
            {/* Left Title & Kicker */}
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold tracking-widest uppercase text-slate-500 dark:text-gray-400">
                <span className="text-emerald-500 dark:text-emerald-400 font-mono">01</span>
                <span className="w-4 h-px bg-slate-300 dark:bg-gray-700" />
                <span>ABOUT ME</span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.15]">
                Engineering with{" "}
                <span className="font-serif italic font-normal text-emerald-600 dark:text-emerald-400 tracking-normal drop-shadow-[0_2px_16px_rgba(16,185,129,0.2)]">
                  intent & purpose.
                </span>
              </h2>
            </div>

            {/* Right Subtitle */}
            <div className="md:max-w-md lg:max-w-lg text-left md:text-right">
              <p className="text-sm sm:text-base text-slate-600 dark:text-gray-400 leading-relaxed font-normal">
                Passionate software engineer committed to writing clean, maintainable code,
                optimizing frontend UX, and architecting resilient backend systems.
              </p>
            </div>
          </div>

          {/* Narrative Bio Card */}
          <div className="card p-6 sm:p-8 md:p-10 border border-slate-200/90 dark:border-gray-800/90 bg-white/95 dark:bg-[#0e121e]/90 backdrop-blur-xl shadow-lg dark:shadow-2xl dark:shadow-black/80 rounded-3xl relative overflow-hidden group hover:border-emerald-500/40 transition-colors">
            <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none group-hover:bg-emerald-500/10 transition-colors" />
            <p className="text-base sm:text-lg text-slate-700 dark:text-gray-300 leading-relaxed relative z-10 font-normal whitespace-pre-line">
              {settings?.about?.content ||
                "Passionate software engineer building modern full-stack web applications."}
            </p>
          </div>

          {/* 3 Core Highlight Pillars */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
            {highlights.map((item, idx) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="card p-5 sm:p-6 card-hover flex flex-col justify-between group rounded-2xl sm:rounded-3xl bg-white/95 dark:bg-[#0e121e]/90 border border-slate-200/90 dark:border-gray-800/90 hover:border-emerald-500/40 transition-all"
                >
                  <div className="space-y-4">
                    <div
                      className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${item.color} border flex items-center justify-center group-hover:scale-110 transition-transform shadow-xs`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-emerald-500 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-gray-400 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
