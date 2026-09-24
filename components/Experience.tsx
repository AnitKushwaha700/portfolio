import { MapPin, Calendar } from "lucide-react";
import { experiences } from "@/data/experience";
import MotionWrapper from "./MotionWrapper";
import SectionHeading from "./SectionHeading";

export default function Experience() {
  return (
    <section id="experience" className="px-4 py-20 sm:px-6 md:py-28">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          title="Experience"
          subtitle="Professional work experience and internships"
        />

        <div className="relative mx-auto max-w-3xl">
          {/* Timeline line */}
          <div
            className="absolute left-4 top-0 hidden h-full w-px bg-border md:left-8 md:block"
            aria-hidden="true"
          />

          <div className="space-y-8 md:space-y-12">
            {experiences.map((exp, i) => (
              <MotionWrapper key={exp.company} delay={i * 0.1}>
                <div className="relative md:pl-20">
                  {/* Timeline dot */}
                  <div
                    className="absolute left-4 top-6 hidden h-3 w-3 -translate-x-1/2 rounded-full border-2 border-accent bg-background md:left-8 md:block"
                    aria-hidden="true"
                  />

                  <div className="rounded-xl border border-border bg-surface p-5 transition-colors hover:border-border-light sm:p-6">
                    <div className="mb-4">
                      <h3 className="text-lg font-semibold text-text-primary">
                        {exp.title}
                      </h3>
                      <p className="mt-1 text-sm font-medium text-accent">
                        {exp.company}
                      </p>
                      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-text-muted sm:text-sm">
                        <span className="inline-flex items-center gap-1">
                          <MapPin size={14} aria-hidden="true" />
                          {exp.location}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <Calendar size={14} aria-hidden="true" />
                          {exp.period}
                        </span>
                      </div>
                    </div>

                    <ul className="space-y-2">
                      {exp.responsibilities.map((resp, j) => (
                        <li
                          key={j}
                          className="flex gap-2 text-sm leading-relaxed text-text-secondary"
                        >
                          <span
                            className="mt-2 h-1 w-1 shrink-0 rounded-full bg-text-muted"
                            aria-hidden="true"
                          />
                          {resp}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </MotionWrapper>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
