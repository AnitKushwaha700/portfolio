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
    <section id="experience" className="section-container relative">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="section-title">Professional Experience</h2>

        <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-800 before:to-transparent">
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
              <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-[#0B0F19] bg-indigo-600 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow shadow-indigo-600/50 z-10 ml-0 md:ml-0 md:absolute md:left-1/2 md:-translate-x-1/2">
                <Briefcase className="w-4 h-4 text-white" />
              </div>

              {/* Content Card */}
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] card p-6 card-hover ml-6 md:ml-0">
                <div className="flex flex-col gap-1 mb-4">
                  <h3 className="text-xl font-bold text-gray-100">
                    {exp.role}
                  </h3>
                  <div className="text-indigo-400 font-medium">
                    {exp.company}
                  </div>

                  <div className="flex flex-wrap gap-x-4 gap-y-2 mt-2 text-sm text-gray-400">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {exp.startDate} – {exp.endDate || "Present"}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-4 h-4" />
                      <span>{exp.location}</span>
                    </div>
                  </div>
                </div>

                <ul className="space-y-2 text-gray-300 text-sm">
                  {exp.responsibilities.map((resp: string, idx: number) => (
                    <li key={idx} className="flex gap-2">
                      <span className="text-indigo-500 mt-1.5 shrink-0">•</span>
                      <span>{resp}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
