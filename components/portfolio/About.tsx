"use client";

import { motion } from "framer-motion";
import { GraduationCap, Code2, Server } from "lucide-react";

export default function About({ settings }: { settings: any }) {
  const highlights = [
    {
      icon: GraduationCap,
      title: "B.Tech in CSE",
      desc: "Computer Science Engineering graduate with deep focus on algorithms, data structures & software architecture.",
      color: "from-red-500/20 to-rose-500/10 text-red-400 border-red-500/30",
    },
    {
      icon: Code2,
      title: "Frontend Engineering",
      desc: "Crafting reactive, pixel-perfect user interfaces with React.js, Next.js, TypeScript, and modern CSS systems.",
      color: "from-rose-500/20 to-amber-500/10 text-rose-400 border-rose-500/30",
    },
    {
      icon: Server,
      title: "Scalable Backends",
      desc: "Architecting secure RESTful APIs, authentication workflows, and robust databases with Node.js & MongoDB.",
      color: "from-indigo-500/20 to-purple-500/10 text-indigo-400 border-indigo-500/30",
    },
  ];

  return (
    <section id="about" className="section-container relative z-10 py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="max-w-5xl mx-auto space-y-10"
      >
        <div className="text-center space-y-3 mb-12">
          <h2 className="section-title mb-0 text-center">
            About{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-rose-500 to-amber-500 drop-shadow-[0_0_30px_rgba(239,68,68,0.35)]">
              Me
            </span>
          </h2>
          <p className="text-sm sm:text-base text-gray-400 max-w-xl mx-auto">
            Passionate software engineer committed to writing clean, maintainable code and solving real-world challenges.
          </p>
        </div>

        {/* Narrative Bio Card */}
        <div className="card p-8 md:p-10 border border-gray-800/90 bg-[#0d0e19]/80 backdrop-blur-xl shadow-2xl shadow-black/80 rounded-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-80 h-80 bg-red-600/5 rounded-full blur-3xl pointer-events-none group-hover:bg-red-600/10 transition-colors" />
          <p className="text-base sm:text-lg text-gray-300 leading-relaxed relative z-10 font-normal">
            {settings.about.content}
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
                className="card p-6 card-hover flex flex-col justify-between group"
              >
                <div className="space-y-4">
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} border flex items-center justify-center group-hover:scale-110 transition-transform`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-white group-hover:text-red-400 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-400 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </section>
  );
}
