"use client";

import { useState, useEffect } from "react";
import { notFound, useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, CheckCircle2, Loader2, ArrowRight } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import { motion } from "framer-motion";

export default function ProjectDetail() {
  const params = useParams();
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await fetch(`/api/projects/${params.slug}`);
        if (!res.ok) {
          notFound();
        }
        const data = await res.json();
        setProject(data.project);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [params.slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
      </div>
    );
  }

  if (!project) return null;

  return (
    <div className="min-h-screen bg-background pt-24 pb-16 relative overflow-hidden font-sans">
      {/* Background ambient glowing orbs */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-indigo-600/5 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-125 h-125 rounded-full bg-purple-600/5 blur-[150px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link
            href="/#projects"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-indigo-400 mb-8 transition-colors group text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Portfolio
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-10"
        >
          <h1 className="text-4xl md:text-6xl font-bold text-gray-100 mb-6 tracking-tight">
            {project.title}
          </h1>
          <p className="text-lg md:text-xl text-gray-400 leading-relaxed mb-8">
            {project.description}
          </p>

          <div className="flex flex-wrap gap-4">
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-3 rounded-full bg-card border border-gray-800 text-gray-300 hover:text-white hover:border-gray-600 hover:bg-gray-800 transition-all shadow-lg"
              >
                <FaGithub className="w-5 h-5" />
                <span className="font-medium text-sm">View Source</span>
              </a>
            )}
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-3 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white transition-all shadow-lg shadow-indigo-500/25 group"
              >
                <span className="font-medium text-sm">Live Demo</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
            )}
          </div>
        </motion.div>

        {project.image && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative w-full h-[300px] md:h-125 rounded-4xl overflow-hidden mb-20 border border-gray-800/60 shadow-2xl shadow-indigo-500/10 group"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F19] to-transparent z-10 opacity-30" />
            <Image
              src={project.image}
              alt={project.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700"
              priority
            />
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="lg:col-span-2 space-y-16 text-gray-300 leading-relaxed"
          >
            {project.content.overview && (
              <section className="prose prose-invert prose-indigo max-w-none">
                <h2 className="text-2xl font-bold text-gray-100 mb-6 flex items-center gap-3">
                  <span className="w-8 h-px bg-indigo-500/50"></span>
                  Overview
                </h2>
                <p className="text-gray-400 text-lg leading-relaxed">
                  {project.content.overview}
                </p>
              </section>
            )}

            {project.content.problem && (
              <section className="prose prose-invert prose-indigo max-w-none">
                <h2 className="text-2xl font-bold text-gray-100 mb-6 flex items-center gap-3">
                  <span className="w-8 h-px bg-indigo-500/50"></span>
                  The Problem
                </h2>
                <p className="text-gray-400 text-lg leading-relaxed">
                  {project.content.problem}
                </p>
              </section>
            )}

            {project.content.solution && (
              <section className="prose prose-invert prose-indigo max-w-none">
                <h2 className="text-2xl font-bold text-gray-100 mb-6 flex items-center gap-3">
                  <span className="w-8 h-px bg-indigo-500/50"></span>
                  The Solution
                </h2>
                <p className="text-gray-400 text-lg leading-relaxed">
                  {project.content.solution}
                </p>
              </section>
            )}

            {project.content.myContribution && (
              <section className="prose prose-invert prose-indigo max-w-none">
                <h2 className="text-2xl font-bold text-gray-100 mb-6 flex items-center gap-3">
                  <span className="w-8 h-px bg-indigo-500/50"></span>
                  My Contribution
                </h2>
                <p className="text-gray-400 text-lg leading-relaxed">
                  {project.content.myContribution}
                </p>
              </section>
            )}

            {project.features && project.features.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold text-gray-100 mb-6 flex items-center gap-3">
                  <span className="w-8 h-px bg-indigo-500/50"></span>
                  Key Features
                </h2>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {project.features.map((feature: string, i: number) => (
                    <li
                      key={i}
                      className="flex items-start gap-3 bg-card p-4 rounded-xl border border-gray-800/50 hover:border-indigo-500/30 transition-colors"
                    >
                      <CheckCircle2 className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
                      <span className="text-gray-300 text-sm leading-relaxed">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {(project.content.challenges || project.content.learning) && (
              <div className="bg-linear-to-br from-[#111827] to-[#0B0F19] border border-gray-800 rounded-4xl p-8 md:p-10 relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-[50px]" />

                {project.content.challenges && (
                  <div className="mb-10 relative z-10">
                    <h3 className="text-xl font-bold text-gray-100 mb-4">
                      Challenges Overcome
                    </h3>
                    <p className="text-gray-400 leading-relaxed">
                      {project.content.challenges}
                    </p>
                  </div>
                )}
                {project.content.learning && (
                  <div className="relative z-10">
                    <h3 className="text-xl font-bold text-gray-100 mb-4">
                      What I Learned
                    </h3>
                    <p className="text-gray-400 leading-relaxed">
                      {project.content.learning}
                    </p>
                  </div>
                )}
              </div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="lg:col-span-1"
          >
            <div className="sticky top-32 bg-card border border-gray-800 rounded-2xl p-6 shadow-xl">
              <h3 className="text-sm font-bold text-gray-100 mb-6 uppercase tracking-widest flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                Technologies Used
              </h3>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech: string) => (
                  <span
                    key={tech}
                    className="px-3 py-1.5 bg-background text-indigo-300 text-xs font-semibold rounded-lg border border-indigo-500/20 hover:bg-indigo-500/10 hover:border-indigo-500/30 transition-colors cursor-default"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
