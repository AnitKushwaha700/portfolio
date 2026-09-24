import { Mail, Phone, ArrowRight } from "lucide-react";
import { GitHubIcon, LinkedInIcon } from "./Icons";
import MotionWrapper from "./MotionWrapper";
import SectionHeading from "./SectionHeading";

export default function Contact() {
  return (
    <section id="contact" className="px-4 py-20 sm:px-6 md:py-28">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          title="Let's Build Something"
          subtitle="I'm open to Software Developer opportunities, collaborative projects, and interesting engineering work."
        />

        <MotionWrapper className="mx-auto max-w-2xl">
          <div className="rounded-2xl border border-border bg-surface p-6 sm:p-8">
            {/* Contact info */}
            <div className="mb-8 space-y-4">
              <a
                href="mailto:kushwahaanitak@gmail.com"
                className="flex items-center gap-3 text-sm text-text-secondary transition-colors hover:text-text-primary"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-background text-text-muted">
                  <Mail size={18} />
                </div>
                <div>
                  <p className="text-xs text-text-muted">Email</p>
                  <p className="font-medium text-text-primary">
                    kushwahaanitak@gmail.com
                  </p>
                </div>
              </a>

              <a
                href="tel:+918989791426"
                className="flex items-center gap-3 text-sm text-text-secondary transition-colors hover:text-text-primary"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-background text-text-muted">
                  <Phone size={18} />
                </div>
                <div>
                  <p className="text-xs text-text-muted">Phone</p>
                  <p className="font-medium text-text-primary">
                    +91 8989791426
                  </p>
                </div>
              </a>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-3">
              <a
                href="mailto:kushwahaanitak@gmail.com"
                className="inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-accent-dark"
              >
                Email Me
                <ArrowRight size={16} />
              </a>
              <a
                href="https://www.linkedin.com/in/l-anit-kushwaha-l-7651462bb"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border border-border px-5 py-2.5 text-sm font-medium text-text-primary transition-colors hover:border-border-light hover:bg-surface-light"
              >
                <LinkedInIcon size={16} />
                LinkedIn
              </a>
              <a
                href="https://github.com/AnitKushwaha700"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border border-border px-5 py-2.5 text-sm font-medium text-text-primary transition-colors hover:border-border-light hover:bg-surface-light"
              >
                <GitHubIcon size={16} />
                GitHub
              </a>
            </div>
          </div>
        </MotionWrapper>
      </div>
    </section>
  );
}
