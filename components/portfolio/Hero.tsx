"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa";

export default function Hero({ settings }: { settings: any }) {
  const { hero, social } = settings;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" as any },
    },
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 pb-12 overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none" />

      <div className="section-container relative z-10 w-full flex flex-col items-center text-center">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center max-w-3xl"
        >
          {hero.showProfileImage && (
            <motion.div variants={itemVariants} className="mb-8 relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full opacity-50 group-hover:opacity-100 transition duration-500 blur-sm"></div>
              <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-2 border-[#111827] bg-card">
                <Image
                  src={hero.profileImage || "/profile/profile.jpg"}
                  alt={hero.name}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </motion.div>
          )}

          <motion.h2
            variants={itemVariants}
            className="text-indigo-400 font-semibold tracking-wide uppercase text-sm mb-4"
          >
            Hi, I&apos;m {hero.name}
          </motion.h2>

          <motion.h1
            variants={itemVariants}
            className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 text-transparent bg-clip-text bg-gradient-to-r from-gray-100 to-gray-400"
          >
            {hero.role}
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-lg md:text-xl text-gray-400 mb-10 max-w-2xl leading-relaxed"
          >
            {hero.description}
          </motion.p>

          {hero.showButtons && (
            <motion.div
              variants={itemVariants}
              className="flex flex-wrap items-center justify-center gap-4"
            >
              <Link
                href="#projects"
                className="group flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-full font-medium transition-all hover:scale-105 active:scale-95"
              >
                View Projects
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                href={social.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center p-3 rounded-full bg-card border border-gray-800 text-gray-400 hover:text-white hover:border-gray-600 transition-all hover:scale-110 active:scale-95"
                aria-label="GitHub"
              >
                <FaGithub className="w-5 h-5" />
              </Link>

              <Link
                href={social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center p-3 rounded-full bg-card border border-gray-800 text-gray-400 hover:text-white hover:border-gray-600 transition-all hover:scale-110 active:scale-95"
                aria-label="LinkedIn"
              >
                <FaLinkedin className="w-5 h-5" />
              </Link>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
