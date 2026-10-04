"use client";

import { motion } from "framer-motion";

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

  return (
    <section id="skills" className="section-container relative">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="section-title">Technical Skills</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category, index) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="card p-6 card-hover"
            >
              <h3 className="text-lg font-semibold text-indigo-400 mb-4">
                {category}
              </h3>
              <div className="flex flex-wrap gap-2">
                {groupedSkills[category].map((skill: any) => (
                  <span
                    key={skill._id}
                    className="px-3 py-1.5 bg-gray-800/50 text-gray-300 text-sm rounded-lg border border-gray-700/50"
                  >
                    {skill.name}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
