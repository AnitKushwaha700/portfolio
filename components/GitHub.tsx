import { ArrowRight } from "lucide-react";
import { GitHubIcon } from "./Icons";
import MotionWrapper from "./MotionWrapper";

export default function GitHubSection() {
  return (
    <section className="px-4 py-20 sm:px-6 md:py-28">
      <div className="mx-auto max-w-6xl">
        <MotionWrapper>
          <div className="relative overflow-hidden rounded-2xl border border-border bg-surface p-8 text-center sm:p-12">
            {/* Subtle accent glow */}
            <div
              className="pointer-events-none absolute left-1/2 top-0 h-40 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/5 blur-[80px]"
              aria-hidden="true"
            />

            <div className="relative z-10">
              <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-border bg-background">
                <GitHubIcon size={24} className="text-text-primary" />
              </div>
              <h2 className="text-2xl font-bold tracking-tight text-text-primary sm:text-3xl">
                Explore My Code
              </h2>
              <p className="mx-auto mt-3 max-w-md text-base text-text-secondary">
                Check out my repositories, projects, and programming work.
              </p>
              <a
                href="https://github.com/AnitKushwaha700"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex items-center gap-2 rounded-lg bg-accent px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-accent-dark"
              >
                View GitHub Profile
                <ArrowRight size={16} />
              </a>
            </div>
          </div>
        </MotionWrapper>
      </div>
    </section>
  );
}
