"use client";

import { motion } from "framer-motion";

export default function About({ settings }: { settings: any }) {
  return (
    <section id="about" className="section-container relative">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto"
      >
        <h2 className="section-title text-center">About Me</h2>

        <div className="card p-8 md:p-12 text-center">
          <p className="text-lg md:text-xl text-gray-300 leading-relaxed">
            {settings.about.content}
          </p>
        </div>
      </motion.div>
    </section>
  );
}
