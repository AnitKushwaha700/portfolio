"use client";

import { motion } from "framer-motion";
import { Mail, Phone, Send } from "lucide-react";

export default function Contact({ settings }: { settings: any }) {
  return (
    <section id="contact" className="section-container relative">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="section-title text-center">Get In Touch</h2>

        <div className="max-w-3xl mx-auto">
          <div className="card p-8 md:p-12 text-center flex flex-col items-center">
            <div className="w-16 h-16 bg-indigo-500/10 rounded-full flex items-center justify-center mb-6 border border-indigo-500/20">
              <Mail className="w-8 h-8 text-indigo-400" />
            </div>

            <h3 className="text-2xl font-bold text-gray-100 mb-4">
              Let&apos;s work together
            </h3>
            <p className="text-gray-400 mb-8 max-w-lg">
              I&apos;m currently looking for new opportunities as a Software
              Developer. Whether you have a question or just want to say hi,
              I&apos;ll try my best to get back to you!
            </p>

            <div className="flex flex-col md:flex-row gap-6 mb-8 w-full justify-center">
              {settings.social.email && (
                <a
                  href={`mailto:${settings.social.email}`}
                  className="flex items-center justify-center gap-3 text-gray-300 hover:text-white transition-colors bg-gray-900/50 px-6 py-4 rounded-xl border border-gray-800"
                >
                  <Mail className="w-5 h-5 text-indigo-400" />
                  <span>{settings.social.email}</span>
                </a>
              )}

              {settings.social.phone && (
                <a
                  href={`tel:${settings.social.phone}`}
                  className="flex items-center justify-center gap-3 text-gray-300 hover:text-white transition-colors bg-gray-900/50 px-6 py-4 rounded-xl border border-gray-800"
                >
                  <Phone className="w-5 h-5 text-indigo-400" />
                  <span>{settings.social.phone}</span>
                </a>
              )}
            </div>

            <a
              href={`mailto:${settings.social.email}`}
              className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3.5 rounded-full font-medium transition-all hover:scale-105 active:scale-95"
            >
              <Send className="w-4 h-4" />
              Say Hello
            </a>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
