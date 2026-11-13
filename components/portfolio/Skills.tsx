"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Layers, X, Sparkles, ArrowRight, CheckCircle2 } from "lucide-react";
import { getSkillMeta } from "@/utils/skillIcons";

interface SkillItem {
  _id?: string;
  name: string;
  category: string;
  icon?: string;
  visible?: boolean;
  order?: number;
}

interface SkillsProps {
  skills: SkillItem[];
}

export default function Skills({ skills }: SkillsProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const visibleSkills = useMemo(() => {
    return (skills || []).filter((s) => s.visible !== false);
  }, [skills]);

  // Split skills into two balanced rows for marquee
  const { row1, row2 } = useMemo(() => {
    const r1: SkillItem[] = [];
    const r2: SkillItem[] = [];

    // Prioritize client/frontend/languages in row1, backend/db/tools in row2
    visibleSkills.forEach((skill) => {
      const cat = (skill.category || "").toLowerCase();
      if (
        cat.includes("front") ||
        cat.includes("language") ||
        skill.name.toLowerCase().includes("react") ||
        skill.name.toLowerCase().includes("script") ||
        skill.name.toLowerCase().includes("css") ||
        skill.name.toLowerCase().includes("html")
      ) {
        if (r1.length <= r2.length) r1.push(skill);
        else r2.push(skill);
      } else {
        if (r2.length <= r1.length) r2.push(skill);
        else r1.push(skill);
      }
    });

    // Fallback if uneven
    if (r1.length === 0 && r2.length === 0) {
      visibleSkills.forEach((s, i) => (i % 2 === 0 ? r1.push(s) : r2.push(s)));
    }

    return { row1: r1, row2: r2 };
  }, [visibleSkills]);

  // Categories for modal breakdown
  const categories = useMemo(() => {
    const set = new Set<string>();
    visibleSkills.forEach((s) => {
      if (s.category) set.add(s.category);
    });
    return ["All", ...Array.from(set)];
  }, [visibleSkills]);

  const filteredModalSkills = useMemo(() => {
    if (selectedCategory === "All") return visibleSkills;
    return visibleSkills.filter((s) => s.category === selectedCategory);
  }, [visibleSkills, selectedCategory]);

  if (!visibleSkills || visibleSkills.length === 0) return null;

  return (
    <section id="skills" className="relative z-10 py-16 sm:py-24 overflow-hidden bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header: Matching Portfolio's Signature Centered Pattern */}
        <div className="text-center space-y-2.5 sm:space-y-3 mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-xs font-semibold text-red-400 uppercase tracking-wider mb-1">
            <Layers className="w-3.5 h-3.5" />
            <span>Skills & Capabilities</span>
          </div>

          <h2 className="section-title mb-0 text-center">
            Technical{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-rose-500 to-amber-500 drop-shadow-[0_0_30px_rgba(239,68,68,0.35)]">
              Skills
            </span>
          </h2>

          <p className="text-xs sm:text-base text-gray-400 max-w-xl mx-auto px-2">
            A curated stack of frontend, backend, database, and system technologies I rely on to
            build resilient, high-performance web applications.
          </p>

          <div className="pt-2">
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/[0.04] dark:hover:bg-white/[0.08] border border-slate-300 dark:border-gray-800 text-xs sm:text-sm font-semibold text-slate-800 dark:text-gray-200 hover:border-red-500/50 hover:text-red-500 dark:hover:text-red-400 transition-all hover:scale-105 active:scale-95 shadow-xs cursor-pointer"
            >
              <Layers className="w-3.5 h-3.5 text-red-500" />
              <span>View All Skills ({visibleSkills.length})</span>
            </button>
          </div>
        </div>

        {/* Sliding Infinite Marquee Showcase */}
        <div className="relative w-full py-4 space-y-4 sm:space-y-5">
          {/* Edge Blur Gradients */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-16 sm:w-28 bg-gradient-to-r from-background to-transparent z-10" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-16 sm:w-28 bg-gradient-to-l from-background to-transparent z-10" />

          {/* Row 1: Leftward Ticker */}
          <div className="overflow-hidden flex w-full">
            <div className="animate-marquee-left pause-hover flex items-center gap-3 sm:gap-4 py-1">
              {[...row1, ...row1, ...row1, ...row1].map((skill, idx) => {
                const meta = getSkillMeta(skill.name);
                const IconComponent = meta.icon;
                return (
                  <div
                    key={`r1-${skill.name}-${idx}`}
                    onClick={() => {
                      setSelectedCategory(skill.category || "All");
                      setIsModalOpen(true);
                    }}
                    className="group relative flex items-center gap-3 px-4 py-2.5 sm:px-5 sm:py-3 rounded-2xl bg-white/95 dark:bg-[#0e121e]/90 hover:bg-white dark:hover:bg-[#141b2c] border border-slate-200/90 dark:border-gray-800/90 hover:border-red-500/50 dark:hover:border-red-500/50 shadow-sm hover:shadow-md dark:shadow-none transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer select-none"
                  >
                    <div
                      className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110"
                      style={{ color: meta.color }}
                    >
                      <IconComponent className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                    <span className="text-xs sm:text-sm font-bold text-slate-800 dark:text-gray-200 group-hover:text-slate-900 dark:group-hover:text-white transition-colors whitespace-nowrap">
                      {skill.name}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Row 2: Rightward Ticker */}
          <div className="overflow-hidden flex w-full">
            <div className="animate-marquee-right pause-hover flex items-center gap-3 sm:gap-4 py-1">
              {[...row2, ...row2, ...row2, ...row2].map((skill, idx) => {
                const meta = getSkillMeta(skill.name);
                const IconComponent = meta.icon;
                return (
                  <div
                    key={`r2-${skill.name}-${idx}`}
                    onClick={() => {
                      setSelectedCategory(skill.category || "All");
                      setIsModalOpen(true);
                    }}
                    className="group relative flex items-center gap-3 px-4 py-2.5 sm:px-5 sm:py-3 rounded-2xl bg-white/95 dark:bg-[#0e121e]/90 hover:bg-white dark:hover:bg-[#141b2c] border border-slate-200/90 dark:border-gray-800/90 hover:border-rose-500/50 dark:hover:border-rose-500/50 shadow-sm hover:shadow-md dark:shadow-none transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer select-none"
                  >
                    <div
                      className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110"
                      style={{ color: meta.color }}
                    >
                      <IconComponent className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                    <span className="text-xs sm:text-sm font-bold text-slate-800 dark:text-gray-200 group-hover:text-slate-900 dark:group-hover:text-white transition-colors whitespace-nowrap">
                      {skill.name}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom Interactive Hint */}
        <div className="mt-8 text-center">
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 text-xs sm:text-sm text-slate-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors font-medium cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-red-500" />
            <span>Click any skill card to view full frontend, backend & database breakdown</span>
            <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
          </button>
        </div>
      </div>

      {/* Deep Breakdown Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-8">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-slate-900/60 dark:bg-black/80 backdrop-blur-md"
            />

            {/* Modal Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="relative w-full max-w-4xl max-h-[85vh] overflow-y-auto bg-white dark:bg-[#0d0f19] border border-slate-200 dark:border-gray-800 rounded-3xl p-6 sm:p-8 shadow-2xl z-10 space-y-6"
            >
              {/* Modal Header */}
              <div className="flex items-start justify-between gap-4 border-b border-slate-200 dark:border-gray-800/80 pb-5">
                <div>
                  <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-red-500 dark:text-red-400 mb-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Complete Technical Stack</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                    Skills & Competencies Directory
                  </h3>
                </div>

                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Category Filter Tabs */}
              <div className="flex flex-wrap items-center gap-2">
                {categories.map((cat) => {
                  const isActive = selectedCategory === cat;
                  return (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                        isActive
                          ? "bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 text-white shadow-md shadow-red-600/30"
                          : "bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-gray-300 hover:bg-slate-200 dark:hover:bg-white/10"
                      }`}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>

              {/* Skills Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4 pt-2">
                {filteredModalSkills.map((skill) => {
                  const meta = getSkillMeta(skill.name);
                  const Icon = meta.icon;
                  return (
                    <div
                      key={skill._id || skill.name}
                      className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-gray-800 flex items-center gap-3 hover:border-red-500/40 transition-all hover:scale-[1.02]"
                    >
                      <div
                        className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                        style={{ color: meta.color }}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
                          {skill.name}
                        </div>
                        <div className="text-[10px] text-slate-500 dark:text-gray-400 truncate">
                          {skill.category}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
