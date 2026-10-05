import {
  Code2,
  Monitor,
  Server,
  Database,
  BookOpen,
  Wrench,
} from "lucide-react";
import { skillCategories } from "@/data/skills";
import MotionWrapper from "./MotionWrapper";
import SectionHeading from "./SectionHeading";

const iconMap: Record<
  string,
  React.ComponentType<{ size?: number; className?: string }>
> = {
  Code2,
  Monitor,
  Server,
  Database,
  BookOpen,
  Wrench,
};

export default function Skills() {
  return (
    <section id="skills" className="px-4 py-20 sm:px-6 md:py-28">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          title="Skills"
          subtitle="Technologies and tools I work with"
        />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 sm:gap-5">
          {skillCategories.map((category, i) => {
            const Icon = iconMap[category.icon];
            return (
              <MotionWrapper key={category.title} delay={i * 0.07}>
                <div className="group h-full rounded-xl border border-border bg-surface p-5 transition-colors hover:border-border-light sm:p-6">
                  <div className="mb-4 flex items-center gap-3">
                    {Icon && (
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/10 text-accent">
                        <Icon size={18} />
                      </div>
                    )}
                    <h3 className="text-sm font-semibold text-text-primary">
                      {category.title}
                    </h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {category.skills.map((skill) => (
                      <span
                        key={skill}
                        className="rounded-md bg-background px-2.5 py-1 text-xs font-medium text-text-secondary transition-colors group-hover:text-text-primary"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </MotionWrapper>
            );
          })}
        </div>
      </div>
    </section>
  );
}
