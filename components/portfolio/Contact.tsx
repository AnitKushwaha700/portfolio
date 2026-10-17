"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, Send, Copy, CheckCircle2, MessageSquare } from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa";

export default function Contact({ settings }: { settings: any }) {
  const [copied, setCopied] = useState(false);
  const email = settings?.social?.email || "kushwahaanitak@gmail.com";
  const phone = settings?.social?.phone || "+91 8989791426";
  const github = settings?.social?.github;
  const linkedin = settings?.social?.linkedin;

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  return (
    <section id="contact" className="section-container relative z-10 py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto space-y-12"
      >
        <div className="text-center space-y-3">
          <h2 className="section-title mb-0 text-center">
            Get In{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-rose-500 to-amber-500 drop-shadow-[0_0_30px_rgba(239,68,68,0.35)]">
              Touch
            </span>
          </h2>
          <p className="text-sm sm:text-base text-gray-400 max-w-lg mx-auto">
            Open to software engineering roles, full-stack opportunities, and freelance projects. Let&apos;s build something exceptional together.
          </p>
        </div>

        <div className="card p-8 md:p-14 text-center flex flex-col items-center relative overflow-hidden group shadow-2xl">
          {/* Subtle Ambient Glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none group-hover:bg-red-600/15 transition-colors" />

          {/* Icon Badge */}
          <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center mb-6 border border-red-500/30 text-red-400 group-hover:scale-110 transition-transform">
            <MessageSquare className="w-8 h-8" />
          </div>

          <h3 className="text-2xl sm:text-3xl font-extrabold text-white mb-3 tracking-tight">
            Let&apos;s Start a Conversation
          </h3>
          <p className="text-gray-300 mb-9 max-w-lg text-sm sm:text-base leading-relaxed">
            Whether you have a job opportunity, a project to discuss, or just want to say hi, my inbox is always open!
          </p>

          {/* Interactive Contact Action Cards */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8 w-full max-w-xl justify-center">
            {/* Copy Email Button */}
            <button
              onClick={handleCopyEmail}
              className="flex-1 flex items-center justify-between gap-3 px-5 py-4 rounded-xl bg-[#141624]/90 hover:bg-[#191b2e] border border-gray-800 hover:border-red-500/50 text-gray-200 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer group/btn"
              title="Click to copy email address"
            >
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-red-400 group-hover/btn:scale-110 transition-transform" />
                <span className="text-xs sm:text-sm font-medium truncate">{email}</span>
              </div>
              <div className="shrink-0 text-xs font-semibold px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-gray-300 flex items-center gap-1.5">
                {copied ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-gray-400" />
                    <span>Copy</span>
                  </>
                )}
              </div>
            </button>

            {/* Direct Phone Call */}
            {phone && (
              <a
                href={`tel:${phone}`}
                className="flex items-center justify-center gap-3 px-5 py-4 rounded-xl bg-[#141624]/90 hover:bg-[#191b2e] border border-gray-800 hover:border-indigo-500/50 text-gray-200 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <Phone className="w-5 h-5 text-indigo-400" />
                <span className="text-xs sm:text-sm font-medium">{phone}</span>
              </a>
            )}
          </div>

          {/* Primary CTA & Socials */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            <a
              href={`mailto:${email}`}
              className="inline-flex items-center gap-2.5 bg-red-600 hover:bg-red-500 text-white px-8 py-3.5 rounded-full font-medium transition-all duration-300 shadow-xl shadow-red-600/30 hover:scale-105 active:scale-95"
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
                  className="p-3.5 rounded-full bg-white/5 border border-gray-800 text-gray-400 hover:text-white hover:border-red-500/50 hover:bg-red-500/10 transition-all duration-300 hover:scale-110 active:scale-95"
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
                  className="p-3.5 rounded-full bg-white/5 border border-gray-800 text-gray-400 hover:text-white hover:border-red-500/50 hover:bg-red-500/10 transition-all duration-300 hover:scale-110 active:scale-95"
                  aria-label="LinkedIn Profile"
                >
                  <FaLinkedin className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
