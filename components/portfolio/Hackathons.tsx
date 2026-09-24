"use client";

import {
  Trophy,
  Calendar,
  MapPin,
  ExternalLink,
  ArrowRight,
} from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

interface HackathonItem {
  _id: string;
  title: string;
  organization: string;
  date: string;
  description: string;
  location: string;
  link: string;
  image: string;
  certificateUrl?: string;
  slug: string;
}

export default function Hackathons({
  hackathons,
}: {
  hackathons: HackathonItem[];
}) {
  if (!hackathons || hackathons.length === 0) return null;

  return (
    <section id="hackathons" className="section-container relative">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex items-center gap-3 mb-12">
          <div className="inline-flex items-center justify-center p-3 bg-indigo-500/10 rounded-xl text-indigo-400 border border-indigo-500/20">
            <Trophy className="w-6 h-6" />
          </div>
          <h2 className="section-title mb-0!">Hackathons & Events</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {hackathons.map((hackathon, index) => (
            <motion.div
              key={hackathon._id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="card group overflow-hidden flex flex-col h-full card-hover"
            >
              {hackathon.image && (
                <div className="relative w-full h-48 sm:h-64 overflow-hidden bg-gray-900 border-b border-gray-800">
                  <Image
                    src={hackathon.image}
                    alt={hackathon.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              )}

              <div className="p-6 flex flex-col flex-1">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-100 group-hover:text-indigo-400 transition-colors">
                      {hackathon.title}
                    </h3>
                    <h4 className="text-sm font-medium text-indigo-400 mt-1">
                      {hackathon.organization}
                    </h4>
                  </div>
                  {hackathon.link && (
                    <a
                      href={hackathon.link}
                      target="_blank"
                      rel="noreferrer"
                      className="text-gray-400 hover:text-white transition-colors shrink-0 ml-2 mt-1"
                    >
                      <ExternalLink className="w-5 h-5" />
                    </a>
                  )}
                </div>

                <p className="text-gray-400 text-sm mb-6 line-clamp-3">
                  {hackathon.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-6">
                  {hackathon.date && (
                    <div className="flex items-center px-2.5 py-1 bg-indigo-500/10 text-indigo-300 text-xs font-medium rounded border border-indigo-500/20">
                      <Calendar className="w-3.5 h-3.5 mr-1.5 opacity-70" />
                      {hackathon.date}
                    </div>
                  )}
                  {hackathon.location && (
                    <div className="flex items-center px-2.5 py-1 bg-indigo-500/10 text-indigo-300 text-xs font-medium rounded border border-indigo-500/20">
                      <MapPin className="w-3.5 h-3.5 mr-1.5 opacity-70" />
                      {hackathon.location}
                    </div>
                  )}
                </div>

                <div className="mt-auto pt-4 border-t border-gray-800 flex justify-between items-center">
                  {hackathon.slug ? (
                    <Link
                      href={`/hackathons/${hackathon.slug}`}
                      className="inline-flex items-center text-sm font-medium text-indigo-400 hover:text-indigo-300 transition-colors group/link"
                    >
                      View Details
                      <ArrowRight className="w-4 h-4 ml-1 group-hover/link:translate-x-1 transition-transform" />
                    </Link>
                  ) : (
                    <div></div>
                  )}

                  {hackathon.certificateUrl && (
                    <a
                      href={hackathon.certificateUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-white text-xs font-medium transition-colors flex items-center gap-1"
                    >
                      View Certificate
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
