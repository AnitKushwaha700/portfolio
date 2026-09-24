import { Trophy, FileSearch, Target, Users, Mic } from "lucide-react";
import Link from "next/link";
import MotionWrapper from "./MotionWrapper";
import SectionHeading from "./SectionHeading";

const focuses = [
  { icon: FileSearch, label: "Resume Analysis" },
  { icon: Target, label: "ATS Evaluation" },
  { icon: Users, label: "Job Matching" },
  { icon: Mic, label: "Mock Interviews" },
];

export default function Hackathon() {
  return (
    <section className="px-4 py-20 sm:px-6 md:py-28">
      <div className="mx-auto max-w-6xl">
        <SectionHeading title="Hackathon" />

        <MotionWrapper className="mx-auto max-w-3xl">
          <div className="rounded-xl border border-border bg-surface p-5 transition-colors hover:border-border-light sm:p-6">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent">
                <Trophy size={22} />
              </div>
              <div className="min-w-0">
                <h3 className="text-lg font-semibold text-text-primary">
                  HackInMotion 2026
                </h3>
                <p className="mt-1 text-sm text-text-secondary">
                  CareerAI — Career & Job Tech
                </p>

                <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {focuses.map((focus) => (
                    <div
                      key={focus.label}
                      className="flex items-center gap-2 rounded-lg bg-background p-2.5 text-xs font-medium text-text-secondary"
                    >
                      <focus.icon
                        size={14}
                        className="shrink-0 text-accent"
                        aria-hidden="true"
                      />
                      {focus.label}
                    </div>
                  ))}
                </div>

                <Link
                  href="/projects/careerai"
                  className="mt-4 inline-flex text-xs font-medium text-accent transition-colors hover:text-accent-light"
                >
                  View Project Details →
                </Link>
              </div>
            </div>
          </div>
        </MotionWrapper>
      </div>
    </section>
  );
}
