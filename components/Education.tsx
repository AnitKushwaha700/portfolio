import { GraduationCap, Award } from "lucide-react";
import { educationData } from "@/data/education";
import MotionWrapper from "./MotionWrapper";
import SectionHeading from "./SectionHeading";

export default function Education() {
  const primary = educationData.find((e) => e.isPrimary);
  const secondary = educationData.filter((e) => !e.isPrimary);

  return (
    <section id="education" className="px-4 py-20 sm:px-6 md:py-28">
      <div className="mx-auto max-w-6xl">
        <SectionHeading title="Education" />

        <div className="mx-auto max-w-3xl space-y-6">
          {/* Primary — B.Tech */}
          {primary && (
            <MotionWrapper>
              <div className="rounded-xl border border-border bg-surface p-5 transition-colors hover:border-border-light sm:p-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent">
                    <GraduationCap size={22} />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-lg font-semibold text-text-primary">
                      {primary.degree}
                    </h3>
                    <p className="mt-1 text-sm text-text-secondary">
                      {primary.institution}
                    </p>
                    {primary.university && (
                      <p className="mt-0.5 text-sm text-text-muted">
                        {primary.university}
                      </p>
                    )}
                    <div className="mt-3 flex flex-wrap gap-3">
                      <span className="rounded-md bg-background px-2.5 py-1 text-xs font-medium text-text-secondary">
                        {primary.period}
                      </span>
                      <span className="rounded-md bg-accent/10 px-2.5 py-1 text-xs font-medium text-accent">
                        {primary.grade}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </MotionWrapper>
          )}

          {/* Secondary — Class 12 & 10 */}
          <MotionWrapper delay={0.1}>
            <div className="grid gap-4 sm:grid-cols-2">
              {secondary.map((edu) => (
                <div
                  key={edu.degree}
                  className="rounded-xl border border-border bg-surface p-4 transition-colors hover:border-border-light sm:p-5"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-surface-light text-text-muted">
                      <Award size={16} />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-text-primary">
                        {edu.degree}
                      </h3>
                      <p className="mt-0.5 text-xs text-text-muted">
                        {edu.institution}
                      </p>
                      <span className="mt-2 inline-block rounded-md bg-background px-2 py-0.5 text-xs font-medium text-text-secondary">
                        {edu.grade}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </MotionWrapper>
        </div>
      </div>
    </section>
  );
}
