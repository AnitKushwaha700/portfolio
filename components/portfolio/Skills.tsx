"use client";

import { motion } from "framer-motion";
import { Code2, Server, Database, Terminal, Cpu, Wrench } from "lucide-react";

export default function Skills({ skills }: { skills: any[] }) {
  // Group skills by category
  const groupedSkills = skills.reduce(
    (acc, skill) => {
      if (!acc[skill.category]) {
        acc[skill.category] = [];
      }
      acc[skill.category].push(skill);
      return acc;
    },
    {} as Record<string, any[]>,
  );

  const categories = Object.keys(groupedSkills);

  if (categories.length === 0) return null;

  const getCategoryIcon = (category: string) => {
    const cat = category.toLowerCase();
    if (cat.includes("front") || cat.includes("web") || cat.includes("ui")) {
      return Code2;
    }
    if (cat.includes("back") || cat.includes("api") || cat.includes("server")) {
      return Server;
    }
    if (cat.includes("data") || cat.includes("db") || cat.includes("sql")) {
      return Database;
    }
    if (cat.includes("lang") || cat.includes("core") || cat.includes("dsa")) {
      return Cpu;
    }
    if (cat.includes("tool") || cat.includes("devops") || cat.includes("git")) {
      return Wrench;
    }
    return Terminal;
  };

  return (
    <section id="skills" className="section-container relative z-10 py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-3 mb-12">
            <h2 className="section-title mb-0 text-center">
              Technical{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-rose-500 to-amber-500 drop-shadow-[0_0_30px_rgba(239,68,68,0.35)]">
                Skills
              </span>
            </h2>
            <p className="text-sm sm:text-base text-gray-400 max-w-xl mx-auto">
              A comprehensive toolkit of languages, frameworks, libraries, and databases I leverage to build robust software.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category, index) => {
              const Icon = getCategoryIcon(category);
              const skillList = groupedSkills[category];

              return (
                <motion.div
                  key={category}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.08 }}
                  className="card p-6 card-hover relative overflow-hidden group flex flex-col justify-between"
                >
                  <div className="space-y-5">
                    {/* Header with Icon and Badge */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 group-hover:scale-110 group-hover:bg-red-500/20 transition-all">
                          <Icon className="w-5 h-5" />
                        </div>
                        <h3 className="text-lg font-bold text-white group-hover:text-red-400 transition-colors">
                          {category}
                        </h3>
                      </div>
                      <span className="text-[11px] font-semibold text-gray-400 px-2.5 py-1 rounded-full bg-white/5 border border-gray-800">
                        {skillList.length} skills
                      </span>
                    </div>

                    {/* Skill Tags */}
                    <div className="flex flex-wrap gap-2 pt-1">
                      {skillList.map((skill: any) => (
                        <span
                          key={skill._id || skill.name}
                          className="px-3 py-1.5 bg-[#141624]/90 text-gray-300 text-xs font-medium rounded-lg border border-gray-800/90 hover:border-red-500/60 hover:bg-red-500/10 hover:text-white transition-all hover:scale-105 cursor-default"
                        >
                          {skill.name}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
