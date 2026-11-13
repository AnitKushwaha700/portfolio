"use client";

import { motion } from "framer-motion";
import { GraduationCap, Calendar, MapPin, Award } from "lucide-react";
import { sanitizeUrl } from "@/utils";

export default function EducationSection({ education }: { education: any[] }) {
  if (!education || education.length === 0) return null;

  return (
    <section id="education" className="relative z-10 py-16 sm:py-24 overflow-hidden bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          {/* Section Header: Matching Pattern Sequence & Editorial Layout */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 sm:mb-12">
            {/* Left Title & Kicker */}
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold tracking-widest uppercase text-slate-500 dark:text-gray-400">
                <span className="text-emerald-500 dark:text-emerald-400 font-mono">07</span>
                <span className="w-4 h-px bg-slate-300 dark:bg-gray-700" />
                <span>ACADEMIC BACKGROUND</span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.15]">
                Academic foundation &{" "}
                <span className="font-serif italic font-normal text-emerald-600 dark:text-emerald-400 tracking-normal drop-shadow-[0_2px_16px_rgba(16,185,129,0.2)]">
                  studies.
                </span>
              </h2>
            </div>

            {/* Right Subtitle */}
            <div className="md:max-w-md lg:max-w-lg text-left md:text-right">
              <p className="text-sm sm:text-base text-slate-600 dark:text-gray-400 leading-relaxed font-normal">
                Degree programs, university engineering coursework, and rigorous theoretical foundations in Computer Science.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {education.map((edu, index) => (
              <motion.div
                key={edu._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="card p-6 sm:p-7 card-hover flex flex-col h-full rounded-2xl sm:rounded-3xl bg-white/95 dark:bg-[#0e121e]/90 border border-slate-200/90 dark:border-gray-800/90 hover:border-emerald-500/40 shadow-sm transition-all"
              >
                <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-6 border border-emerald-200/80 dark:border-emerald-500/20 text-emerald-600 dark:text-emerald-400 shadow-xs">
                  <GraduationCap className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                </div>

                <h3 className="text-lg font-bold text-slate-900 dark:text-gray-100 mb-1">
                  {edu.degree}
                </h3>
                <p className="text-emerald-600 dark:text-emerald-400 font-semibold text-sm mb-4">
                  {edu.institution}
                </p>

                <div className="space-y-2 text-sm text-slate-600 dark:text-gray-400 mt-auto pt-4 border-t border-slate-200/80 dark:border-gray-800/50">
                  {(edu.startDate || edu.endDate) && (
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>
                        {edu.startDate && edu.endDate
                          ? `${edu.startDate} – ${edu.endDate}`
                          : edu.startDate || edu.endDate}
                      </span>
                    </div>
                  )}

                  {edu.location && (
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>{edu.location}</span>
                    </div>
                  )}

                  {edu.score && (
                    <div className="flex items-center gap-2 text-slate-700 dark:text-gray-300">
                      <Award className="w-4 h-4 text-amber-500 shrink-0" />
                      <span className="font-medium">{edu.score}</span>
                    </div>
                  )}

                  {edu.certificateUrl && (
                    <div className="flex items-center gap-2 mt-2 pt-2 border-t border-slate-200/80 dark:border-gray-800/50">
                      <a
                        href={sanitizeUrl(edu.certificateUrl)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 text-xs font-medium transition-colors flex items-center gap-1"
                      >
                        View Certificate
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="w-3 h-3"
                        >
                          <line x1="7" y1="17" x2="17" y2="7"></line>
                          <polyline points="7 7 17 7 17 17"></polyline>
                        </svg>
                      </a>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
