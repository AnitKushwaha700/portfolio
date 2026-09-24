"use client";

import { motion } from "framer-motion";
import { GraduationCap, Calendar, MapPin, Award } from "lucide-react";

export default function EducationSection({ education }: { education: any[] }) {
  if (!education || education.length === 0) return null;

  return (
    <section id="education" className="section-container relative">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="section-title">Education</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {education.map((edu, index) => (
            <motion.div
              key={edu._id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="card p-6 card-hover flex flex-col h-full"
            >
              <div className="w-12 h-12 bg-indigo-500/10 rounded-xl flex items-center justify-center mb-6 border border-indigo-500/20">
                <GraduationCap className="w-6 h-6 text-indigo-400" />
              </div>

              <h3 className="text-lg font-bold text-gray-100 mb-1">
                {edu.degree}
              </h3>
              <p className="text-indigo-400 font-medium text-sm mb-4">
                {edu.institution}
              </p>

              <div className="space-y-2 text-sm text-gray-400 mt-auto pt-4 border-t border-gray-800/50">
                {(edu.startDate || edu.endDate) && (
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 shrink-0" />
                    <span>
                      {edu.startDate && edu.endDate
                        ? `${edu.startDate} – ${edu.endDate}`
                        : edu.startDate || edu.endDate}
                    </span>
                  </div>
                )}

                {edu.location && (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 shrink-0" />
                    <span>{edu.location}</span>
                  </div>
                )}

                {edu.score && (
                  <div className="flex items-center gap-2 text-gray-300">
                    <Award className="w-4 h-4 text-yellow-500 shrink-0" />
                    <span className="font-medium">{edu.score}</span>
                  </div>
                )}

                {edu.certificateUrl && (
                  <div className="flex items-center gap-2 mt-2 pt-2 border-t border-gray-800/50">
                    <a
                      href={edu.certificateUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-400 hover:text-indigo-300 text-xs font-medium transition-colors flex items-center gap-1"
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
    </section>
  );
}
