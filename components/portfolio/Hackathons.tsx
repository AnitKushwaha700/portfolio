"use client";

import {
  Calendar,
  MapPin,
  ExternalLink,
  ArrowRight,
  Trophy,
  Award,
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { sanitizeUrl } from "@/utils";

interface HackathonItem {
  _id: string;
  title: string;
  organization: string;
  date: string;
  description: string;
  location: string;
  link: string;
  image?: string;
  certificateUrl?: string;
  slug: string;
}

export default function Hackathons({
  hackathons,
}: {
  hackathons: HackathonItem[];
}) {
  if (!hackathons || hackathons.length === 0) return null;

  return (
    <section id="hackathons" className="relative z-10 py-16 sm:py-24 overflow-hidden bg-transparent">
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
                <span className="text-emerald-500 dark:text-emerald-400 font-mono">06</span>
                <span className="w-4 h-px bg-slate-300 dark:bg-gray-700" />
                <span>HACKATHONS & RECOGNITION</span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.15]">
                Competitions &{" "}
                <span className="font-serif italic font-normal text-emerald-600 dark:text-emerald-400 tracking-normal drop-shadow-[0_2px_16px_rgba(16,185,129,0.2)]">
                  hackathons.
                </span>
              </h2>
            </div>

            {/* Right Subtitle */}
            <div className="md:max-w-md lg:max-w-lg text-left md:text-right">
              <p className="text-sm sm:text-base text-slate-600 dark:text-gray-400 leading-relaxed font-normal">
                Competitive engineering hackathons, fast-paced product prototyping, and award-winning solutions.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
            {hackathons.map((hackathon, index) => {
              const certUrl =
                hackathon.certificateUrl ||
                (hackathon.image &&
                (hackathon.image.includes("drive.google.com") ||
                  hackathon.image.endsWith(".pdf") ||
                  hackathon.image.includes("certificate"))
                  ? hackathon.image
                  : undefined);

              return (
                <motion.div
                  key={hackathon._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="card group overflow-hidden flex flex-col justify-between p-6 sm:p-8 card-hover border border-slate-200/90 dark:border-gray-800/90 hover:border-emerald-500/40 bg-white/95 dark:bg-[#0e121e]/90 rounded-2xl sm:rounded-3xl backdrop-blur-xl relative shadow-sm"
                >
                  {/* Subtle ambient glow */}
                  <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none group-hover:bg-emerald-500/10 transition-colors" />

                  <div>
                    <div className="flex justify-between items-start mb-4 gap-3">
                      <div className="flex items-start gap-3.5">
                        <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200/80 dark:border-emerald-500/20 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 group-hover:border-emerald-500/40 transition-all flex-shrink-0 mt-0.5 shadow-xs">
                          <Trophy className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-slate-900 dark:text-gray-100 group-hover:text-emerald-500 dark:group-hover:text-emerald-400 transition-colors tracking-tight">
                            {hackathon.title}
                          </h3>
                          <h4 className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 mt-1">
                            {hackathon.organization}
                          </h4>
                        </div>
                      </div>
                      {hackathon.link && (
                        <a
                          href={sanitizeUrl(hackathon.link)}
                          target="_blank"
                          rel="noreferrer"
                          aria-label="External link"
                          className="p-2 rounded-xl bg-slate-100 dark:bg-gray-800/60 hover:bg-slate-200 dark:hover:bg-gray-800 text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white transition-colors shrink-0 border border-slate-200 dark:border-gray-700/40"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                    </div>

                    <p className="text-slate-600 dark:text-gray-400 text-sm mb-6 leading-relaxed line-clamp-3">
                      {hackathon.description}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-6">
                      {hackathon.date && (
                        <div className="flex items-center px-2.5 py-1 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 text-xs font-medium rounded-lg border border-emerald-200/80 dark:border-emerald-500/20">
                          <Calendar className="w-3.5 h-3.5 mr-1.5 opacity-70" />
                          {hackathon.date}
                        </div>
                      )}
                      {hackathon.location && (
                        <div className="flex items-center px-2.5 py-1 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 text-xs font-medium rounded-lg border border-emerald-200/80 dark:border-emerald-500/20">
                          <MapPin className="w-3.5 h-3.5 mr-1.5 opacity-70" />
                          {hackathon.location}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-200/80 dark:border-gray-800/80 flex flex-wrap justify-between items-center gap-3">
                    {hackathon.slug ? (
                      <Link
                        href={`/hackathons/${hackathon.slug}`}
                        className="inline-flex items-center text-sm font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 transition-colors group/link"
                      >
                        <span>View Details</span>
                        <ArrowRight className="w-4 h-4 ml-1.5 group-hover/link:translate-x-1 transition-transform" />
                      </Link>
                    ) : (
                      <div />
                    )}

                    {certUrl && (
                      <a
                        href={sanitizeUrl(certUrl)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 border border-emerald-500/20 text-xs font-medium transition-colors"
                      >
                        <Award className="w-3.5 h-3.5 text-emerald-500" />
                        <span>View Certificate</span>
                        <ExternalLink className="w-3 h-3 text-emerald-500/80 ml-0.5" />
                      </a>
                    )}
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
