import { GraduationCap, Briefcase, FolderGit2, BookOpen } from "lucide-react";
import MotionWrapper from "./MotionWrapper";
import SectionHeading from "./SectionHeading";

const stats = [
  { icon: GraduationCap, label: "B.Tech Graduate" },
  { icon: Briefcase, label: "Software Developer Intern" },
  { icon: FolderGit2, label: "3+ Major Projects" },
  { icon: BookOpen, label: "Java & DSA Experience" },
];

export default function About() {
  return (
    <section id="about" className="px-4 py-20 sm:px-6 md:py-28">
      <div className="mx-auto max-w-6xl">
        <SectionHeading title="About" />

        <div className="grid gap-12 lg:grid-cols-5 lg:gap-16">
          {/* Text content */}
          <MotionWrapper className="space-y-5 lg:col-span-3">
            <p className="text-base leading-relaxed text-text-secondary sm:text-lg">
              I&apos;m a Computer Science Engineering graduate and Software
              Developer Intern with hands-on experience building full-stack web
              applications.
            </p>
            <p className="text-base leading-relaxed text-text-secondary sm:text-lg">
              I have worked with React.js, Next.js, TypeScript, Node.js,
              Express.js, MongoDB, and MySQL.
            </p>
            <p className="text-base leading-relaxed text-text-secondary sm:text-lg">
              I have experience contributing to a real-world Learning Management
              System, company website development, REST API integration,
              database operations, debugging, and collaborative software
              development.
            </p>
            <p className="text-base leading-relaxed text-text-secondary sm:text-lg">
              I also have experience creating Java and Data Structures &
              Algorithms educational content.
            </p>
          </MotionWrapper>

          {/* Stats */}
          <MotionWrapper delay={0.15} className="lg:col-span-2">
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="flex flex-col items-center gap-3 rounded-xl border border-border bg-surface p-4 text-center transition-colors hover:border-border-light sm:p-5"
                >
                  <stat.icon
                    size={22}
                    className="text-accent"
                    aria-hidden="true"
                  />
                  <span className="text-xs font-medium leading-snug text-text-secondary sm:text-sm">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </MotionWrapper>
        </div>
      </div>
    </section>
  );
}
