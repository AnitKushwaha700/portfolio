import { Mail } from "lucide-react";
import { GitHubIcon, LinkedInIcon } from "./Icons";

export default function Footer() {
  return (
    <footer className="border-t border-border px-4 py-10 sm:px-6">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 text-center">
        <div>
          <p className="text-sm font-semibold tracking-wider text-text-primary">
            ANIT KUSHWAHA
          </p>
          <p className="mt-1 text-xs text-text-muted">Software Developer</p>
        </div>

        <div className="flex items-center gap-4">
          <a
            href="https://github.com/AnitKushwaha700"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="rounded-md p-2 text-text-muted transition-colors hover:text-text-primary"
          >
            <GitHubIcon size={18} />
          </a>
          <a
            href="https://www.linkedin.com/in/l-anit-kushwaha-l-7651462bb"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="rounded-md p-2 text-text-muted transition-colors hover:text-text-primary"
          >
            <LinkedInIcon size={18} />
          </a>
          <a
            href="mailto:kushwahaanitak@gmail.com"
            aria-label="Email"
            className="rounded-md p-2 text-text-muted transition-colors hover:text-text-primary"
          >
            <Mail size={18} />
          </a>
        </div>

        <p className="text-xs text-text-muted">© 2026 Anit Kushwaha</p>
      </div>
    </footer>
  );
}
