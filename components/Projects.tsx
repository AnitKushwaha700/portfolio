import Link from "next/link";
import { ExternalLink, ArrowRight } from "lucide-react";
import { GitHubIcon } from "./Icons";
import { projects } from "@/data/projects";
import MotionWrapper from "./MotionWrapper";
import SectionHeading from "./SectionHeading";

export default function Projects() {
  return (
    <section id="projects" className="px-4 py-20 sm:px-6 md:py-28">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          title="Projects"
          subtitle="Selected projects I've built"
        />

        <div className="grid gap-5 sm:gap-6 lg:grid-cols-3">
          {projects.map((project, i) => (
            <MotionWrapper key={project.slug} delay={i * 0.1}>
              <div className="group flex h-full flex-col rounded-xl border border-border bg-surface transition-colors hover:border-border-light">
                {/* Card Header */}
                <div className="flex-1 p-5 sm:p-6">
                  <div className="mb-3">
                    <h3 className="text-lg font-semibold text-text-primary">
                      {project.name}
                    </h3>
                    <p className="mt-0.5 text-sm font-medium text-accent">
                      {project.tagline}
                    </p>
                  </div>

                  <p className="mb-4 text-sm leading-relaxed text-text-secondary">
                    {project.description}
                  </p>

                  {/* Tech Stack */}
                  <div className="mb-4 flex flex-wrap gap-1.5">
                    {project.techStack.map((tech) => (
                      <span
                        key={tech}
                        className="rounded-md bg-background px-2 py-0.5 text-xs font-medium text-text-muted"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  {/* Features */}
                  <ul className="space-y-1.5">
                    {project.features.slice(0, 4).map((feature) => (
                      <li
                        key={feature}
                        className="flex items-start gap-2 text-xs text-text-muted"
                      >
                        <span
                          className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-accent/60"
                          aria-hidden="true"
                        />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Card Footer */}
                <div className="flex flex-wrap items-center gap-2 border-t border-border p-4 sm:p-5">
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-xs font-medium text-text-secondary transition-colors hover:border-border-light hover:text-text-primary"
                    >
                      <GitHubIcon size={14} />
                      GitHub
                    </a>
                  )}
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-xs font-medium text-text-secondary transition-colors hover:border-border-light hover:text-text-primary"
                    >
                      <ExternalLink size={14} />
                      Live Demo
                    </a>
                  )}
                  <Link
                    href={`/projects/${project.slug}`}
                    className="ml-auto inline-flex items-center gap-1 text-xs font-medium text-accent transition-colors hover:text-accent-light"
                  >
                    View Details
                    <ArrowRight
                      size={14}
                      className="transition-transform group-hover:translate-x-0.5"
                    />
                  </Link>
                </div>
              </div>
            </MotionWrapper>
          ))}
        </div>
      </div>
    </section>
  );
}
