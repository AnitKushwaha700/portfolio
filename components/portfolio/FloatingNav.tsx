"use client";

import { useEffect, useState } from "react";
import {
  Home,
  User,
  Code2,
  Briefcase,
  LayoutGrid,
  Trophy,
  GraduationCap,
  Mail,
} from "lucide-react";
import { FaGithub } from "react-icons/fa";

interface NavItem {
  id: string;
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const navItems: NavItem[] = [
  { id: "hero", label: "Home", href: "#hero", icon: Home },
  { id: "about", label: "About", href: "#about", icon: User },
  { id: "skills", label: "Skills", href: "#skills", icon: Code2 },
  {
    id: "experience",
    label: "Experience",
    href: "#experience",
    icon: Briefcase,
  },
  { id: "projects", label: "Projects", href: "#projects", icon: LayoutGrid },
  { id: "github", label: "GitHub", href: "#github", icon: FaGithub },
  { id: "hackathons", label: "Hackathons", href: "#hackathons", icon: Trophy },
  { id: "education", label: "Education", href: "#education", icon: GraduationCap },
  { id: "contact", label: "Contact", href: "#contact", icon: Mail },
];

export default function FloatingNav() {
  const [activeSection, setActiveSection] = useState("hero");

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200;

      // Check sections
      for (const item of navItems) {
        if (item.id === "hero") {
          if (window.scrollY < 300) {
            setActiveSection("hero");
            continue;
          }
        }
        const element = document.getElementById(item.id);
        if (element) {
          const top = element.offsetTop;
          const height = element.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(item.id);
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
      setActiveSection(id);
      try {
        window.history.pushState(null, "", `#${id}`);
      } catch {
        // ignore
      }
    }
  };

  return (
    <aside
      aria-label="Quick section navigation"
      className="fixed right-4 lg:right-6 top-1/2 -translate-y-1/2 z-40 hidden md:flex flex-col items-center gap-2 p-2 rounded-full bg-white/90 dark:bg-[#0a0b12]/80 backdrop-blur-xl border border-slate-200 dark:border-gray-800/80 shadow-xl shadow-slate-900/10 dark:shadow-2xl dark:shadow-black/80"
    >
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeSection === item.id;

        return (
          <a
            key={item.id}
            href={item.href}
            onClick={(e) => handleNavClick(e, item.id)}
            className={`group relative p-2.5 rounded-full transition-all duration-300 cursor-pointer ${
              isActive
                ? "bg-gradient-to-tr from-red-600 via-rose-600 to-amber-600 text-white shadow-md shadow-red-600/40 scale-110"
                : "text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5"
            }`}
            aria-label={item.label}
          >
            <Icon className="w-4 h-4 transition-transform group-hover:scale-110" />

            {/* Hover Tooltip */}
            <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 px-2.5 py-1 text-[11px] font-medium tracking-wide text-white bg-slate-900/95 border border-slate-700 rounded-md whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-200 shadow-xl">
              {item.label}
            </span>
          </a>
        );
      })}
    </aside>
  );
}
