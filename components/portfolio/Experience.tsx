"use client";

import { motion } from "framer-motion";
import { Briefcase, Calendar, MapPin } from "lucide-react";

export default function ExperienceSection({
  experiences,
}: {
  experiences: any[];
}) {
  if (!experiences || experiences.length === 0) return null;

  return (
    <section id="experience" className="relative z-10 py-16 sm:py-24 overflow-hidden bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          {/* Section Header: Matching Pattern Sequence & Editorial Layout */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 sm:mb-16">
            {/* Left Title & Kicker */}
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold tracking-widest uppercase text-slate-500 dark:text-gray-400">
                <span className="text-emerald-500 dark:text-emerald-400 font-mono">04</span>
                <span className="w-4 h-px bg-slate-300 dark:bg-gray-700" />
                <span>CAREER & EXPERIENCE</span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.15]">
                Where I&apos;ve{" "}
                <span className="font-serif italic font-normal text-emerald-600 dark:text-emerald-400 tracking-normal drop-shadow-[0_2px_16px_rgba(16,185,129,0.2)]">
                  worked & contributed.
                </span>
              </h2>
            </div>

            {/* Right Subtitle */}
            <div className="md:max-w-md lg:max-w-lg text-left md:text-right">
              <p className="text-sm sm:text-base text-slate-600 dark:text-gray-400 leading-relaxed font-normal">
                My professional journey, software development internships, and hands-on production engineering impact.
              </p>
            </div>
          </div>

          <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 dark:before:via-gray-800 before:to-transparent">
            {experiences.map((exp, index) => (
              <motion.div
                key={exp._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active"
              >
                {/* Timeline dot */}
                <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-[#F8FAFC] dark:border-[#0B0F19] bg-emerald-600 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-lg shadow-emerald-600/40 z-10 ml-0 md:ml-0 md:absolute md:left-1/2 md:-translate-x-1/2">
                  <Briefcase className="w-4 h-4 text-white" />
                </div>

                {/* Content Card */}
                <div className="w-[calc(100%-3.5rem)] md:w-[calc(50%-3rem)] card p-5 sm:p-7 card-hover ml-4 sm:ml-6 md:ml-0 rounded-2xl sm:rounded-3xl bg-white/95 dark:bg-[#0e121e]/90 border border-slate-200/90 dark:border-gray-800/90 hover:border-emerald-500/40 transition-all shadow-sm">
                  <div className="flex flex-col gap-1 mb-4">
                    <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-gray-100">
                      {exp.role}
                    </h3>
                    <div className="text-emerald-600 dark:text-emerald-400 font-semibold text-sm sm:text-base">
                      {exp.company}
                    </div>

                    <div className="flex flex-wrap gap-x-4 gap-y-2 mt-2 text-xs sm:text-sm text-slate-600 dark:text-gray-400">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4 text-emerald-500" />
                        <span>
                          {exp.startDate} – {exp.endDate || "Present"}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-4 h-4 text-emerald-500" />
                        <span>{exp.location}</span>
                      </div>
                    </div>
                  </div>

                  <ul className="space-y-2 text-slate-700 dark:text-gray-300 text-xs sm:text-sm">
                    {exp.responsibilities.map((resp: string, idx: number) => (
                      <li key={idx} className="flex gap-2">
                        <span className="text-emerald-500 mt-1 shrink-0">•</span>
                        <span>{resp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
