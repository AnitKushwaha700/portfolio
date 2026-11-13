"use client";

import { motion } from "framer-motion";
import {
  Mail,
  Phone,
  Send,
  Copy,
  CheckCircle2,
  MessageSquare,
} from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";
import { sanitizeUrl } from "@/utils";
import type { ContactProps } from "@/types";

export default function Contact({ settings }: ContactProps) {
  const { copied, copy } = useCopyToClipboard();

  const email = settings?.social?.email || "kushwahaanitak@gmail.com";
  const phone = settings?.social?.phone || "";
  const github = settings?.social?.github
    ? sanitizeUrl(settings.social.github)
    : "";
  const linkedin = settings?.social?.linkedin
    ? sanitizeUrl(settings.social.linkedin)
    : "";

  return (
    <section id="contact" className="relative z-10 py-16 sm:py-24 overflow-hidden bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto space-y-10 sm:space-y-12"
        >
          {/* Section Header: Matching Pattern Sequence & Editorial Layout */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 sm:mb-10">
            {/* Left Title & Kicker */}
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold tracking-widest uppercase text-slate-500 dark:text-gray-400">
                <span className="text-emerald-500 dark:text-emerald-400 font-mono">08</span>
                <span className="w-4 h-px bg-slate-300 dark:bg-gray-700" />
                <span>GET IN TOUCH</span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.15]">
                Let&apos;s build something{" "}
                <span className="font-serif italic font-normal text-emerald-600 dark:text-emerald-400 tracking-normal drop-shadow-[0_2px_16px_rgba(16,185,129,0.2)]">
                  together.
                </span>
              </h2>
            </div>

            {/* Right Subtitle */}
            <div className="md:max-w-md lg:max-w-lg text-left md:text-right">
              <p className="text-sm sm:text-base text-slate-600 dark:text-gray-400 leading-relaxed font-normal">
                Open to software engineering roles, full-stack projects, and innovative technical collaborations.
              </p>
            </div>
          </div>

          <div className="card p-6 sm:p-8 md:p-14 text-center flex flex-col items-center relative overflow-hidden group shadow-xl rounded-2xl sm:rounded-3xl bg-white/95 dark:bg-[#0e121e]/90 border border-slate-200/90 dark:border-gray-800/90 hover:border-emerald-500/40 transition-all">
            {/* Subtle Ambient Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-emerald-500/15 transition-colors" />

            {/* Icon Badge */}
            <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-6 border border-emerald-200/80 dark:border-emerald-500/30 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform shadow-xs">
              <MessageSquare className="w-8 h-8" />
            </div>

            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mb-3 tracking-tight">
              Let&apos;s Start a Conversation
            </h3>
            <p className="text-slate-600 dark:text-gray-300 mb-9 max-w-lg text-sm sm:text-base leading-relaxed">
              Whether you have a job opportunity, a project to discuss, or just
              want to say hi, my inbox is always open!
            </p>

            {/* Interactive Contact Action Cards */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8 w-full max-w-xl justify-center">
              {/* Copy Email Button */}
              <button
                onClick={() => copy(email)}
                className="flex-1 flex items-center justify-between gap-3 px-5 py-4 rounded-xl bg-slate-100 dark:bg-[#141624]/90 hover:bg-slate-200 dark:hover:bg-[#191b2e] border border-slate-200 dark:border-gray-800 hover:border-emerald-500/50 text-slate-800 dark:text-gray-200 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer group/btn"
                title="Click to copy email address"
                aria-label={`Copy email address: ${email}`}
              >
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-emerald-600 dark:text-emerald-400 group-hover/btn:scale-110 transition-transform" />
                  <span className="text-xs sm:text-sm font-medium truncate">
                    {email}
                  </span>
                </div>
                <div className="shrink-0 text-xs font-semibold px-2.5 py-1 rounded-md bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-gray-300 flex items-center gap-1.5">
                  {copied ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                      <span className="text-emerald-600 dark:text-emerald-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-slate-500 dark:text-gray-400" />
                      <span>Copy</span>
                    </>
                  )}
                </div>
              </button>

              {/* Direct Phone Call — only show if phone is available */}
              {phone && (
                <a
                  href={`tel:${phone}`}
                  className="flex items-center justify-center gap-3 px-5 py-4 rounded-xl bg-slate-100 dark:bg-[#141624]/90 hover:bg-slate-200 dark:hover:bg-[#191b2e] border border-slate-200 dark:border-gray-800 hover:border-emerald-500/50 text-slate-800 dark:text-gray-200 transition-all hover:scale-[1.02] active:scale-[0.98]"
                  aria-label={`Call phone number: ${phone}`}
                >
                  <Phone className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  <span className="text-xs sm:text-sm font-medium">{phone}</span>
                </a>
              )}
            </div>

            {/* Primary CTA & Socials */}
            <div className="flex flex-wrap items-center justify-center gap-4">
              <a
                href={`mailto:${email}`}
                className="inline-flex items-center gap-2.5 bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-3.5 rounded-full font-medium transition-all duration-300 shadow-xl shadow-emerald-600/30 hover:scale-105 active:scale-95"
                aria-label="Send email"
              >
                <Send className="w-4 h-4" />
                <span>Say Hello Directly</span>
              </a>

              {/* Social Connect Icons */}
              <div className="flex items-center gap-2">
                {github && (
                  <a
                    href={github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3.5 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-gray-800 text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white hover:border-emerald-500/50 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 transition-all duration-300 hover:scale-110 active:scale-95"
                    aria-label="GitHub Profile"
                  >
                    <FaGithub className="w-4 h-4" />
                  </a>
                )}
                {linkedin && (
                  <a
                    href={linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3.5 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-gray-800 text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white hover:border-emerald-500/50 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 transition-all duration-300 hover:scale-110 active:scale-95"
                    aria-label="LinkedIn Profile"
                  >
                    <FaLinkedin className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
