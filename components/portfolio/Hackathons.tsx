"use client";

import { Calendar, MapPin, ExternalLink, ArrowRight, Trophy, Award } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

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
    <section id="hackathons" className="section-container relative">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
      >
        <div className="text-center space-y-3 mb-12">
          <h2 className="section-title mb-0 text-center">
            Hackathons &{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-rose-500 to-amber-500 drop-shadow-[0_0_30px_rgba(239,68,68,0.35)]">
              Events
            </span>
          </h2>
          <p className="text-sm sm:text-base text-gray-400 max-w-xl mx-auto">
            Competitive programming hackathons, engineering showcases, and
            technical competitions.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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
                className="card group overflow-hidden flex flex-col justify-between p-6 sm:p-7 card-hover border border-gray-800/90 hover:border-indigo-500/40 bg-[#0d0e19]/80 backdrop-blur-xl relative"
              >
                {/* Subtle ambient glow */}
                <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-600/5 rounded-full blur-3xl pointer-events-none group-hover:bg-indigo-600/10 transition-colors" />

                <div>
                  <div className="flex justify-between items-start mb-4 gap-3">
                    <div className="flex items-start gap-3.5">
                      <div className="p-3 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 group-hover:scale-110 group-hover:border-indigo-500/40 transition-all flex-shrink-0 mt-0.5">
                        <Trophy className="w-5 h-5 text-indigo-400" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-100 group-hover:text-indigo-400 transition-colors tracking-tight">
                          {hackathon.title}
                        </h3>
                        <h4 className="text-sm font-medium text-indigo-400/90 mt-1">
                          {hackathon.organization}
                        </h4>
                      </div>
                    </div>
                    {hackathon.link && (
                      <a
                        href={hackathon.link}
                        target="_blank"
                        rel="noreferrer"
                        aria-label="External link"
                        className="p-2 rounded-lg bg-gray-800/60 hover:bg-gray-800 text-gray-400 hover:text-white transition-colors shrink-0 border border-gray-700/40"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>

                  <p className="text-gray-400 text-sm mb-6 leading-relaxed line-clamp-3">
                    {hackathon.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {hackathon.date && (
                      <div className="flex items-center px-2.5 py-1 bg-indigo-500/10 text-indigo-300 text-xs font-medium rounded-lg border border-indigo-500/20">
                        <Calendar className="w-3.5 h-3.5 mr-1.5 opacity-70" />
                        {hackathon.date}
                      </div>
                    )}
                    {hackathon.location && (
                      <div className="flex items-center px-2.5 py-1 bg-indigo-500/10 text-indigo-300 text-xs font-medium rounded-lg border border-indigo-500/20">
                        <MapPin className="w-3.5 h-3.5 mr-1.5 opacity-70" />
                        {hackathon.location}
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-800/80 flex flex-wrap justify-between items-center gap-3">
                  {hackathon.slug ? (
                    <Link
                      href={`/hackathons/${hackathon.slug}`}
                      className="inline-flex items-center text-sm font-semibold text-indigo-400 hover:text-indigo-300 transition-colors group/link"
                    >
                      <span>View Details</span>
                      <ArrowRight className="w-4 h-4 ml-1.5 group-hover/link:translate-x-1 transition-transform" />
                    </Link>
                  ) : (
                    <div />
                  )}

                  {certUrl && (
                    <a
                      href={certUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 hover:text-white border border-indigo-500/20 text-xs font-medium transition-colors"
                    >
                      <Award className="w-3.5 h-3.5 text-indigo-400" />
                      <span>View Certificate</span>
                      <ExternalLink className="w-3 h-3 text-indigo-400/80 ml-0.5" />
                    </a>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </section>
  );
}
