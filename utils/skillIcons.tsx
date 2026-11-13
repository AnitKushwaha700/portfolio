import React from "react";
import {
  SiReact,
  SiJavascript,
  SiTypescript,
  SiNodedotjs,
  SiExpress,
  SiMongodb,
  SiMysql,
  SiTailwindcss,
  SiHtml5,
  SiPostman,
  SiGit,
  SiGithub,
  SiNextdotjs,
  SiNpm,
  SiLeetcode,
  SiRedux,
  SiDocker,
  SiPython,
  SiCplusplus,
} from "react-icons/si";
import { FaJava, FaCss3Alt } from "react-icons/fa6";
import { VscCode } from "react-icons/vsc";
import { TbApi, TbBrain, TbDatabase, TbLayersLinked } from "react-icons/tb";
import { Code2 } from "lucide-react";

export interface SkillMeta {
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  className?: string;
  bgColor?: string;
}

export function getSkillMeta(skillName: string): SkillMeta {
  const norm = skillName.toLowerCase().trim();

  // Core MERN & Frontend
  if (norm.includes("react router")) {
    return { icon: SiReact, color: "#CA4245" };
  }
  if (norm.includes("react")) {
    return { icon: SiReact, color: "#61DAFB" };
  }
  if (norm.includes("next")) {
    return {
      icon: SiNextdotjs,
      color: "currentColor",
      className: "text-slate-900 dark:text-white",
    };
  }
  if (norm.includes("typescript") || norm === "ts") {
    return { icon: SiTypescript, color: "#3178C6" };
  }
  if (norm.includes("javascript") || norm === "js") {
    return { icon: SiJavascript, color: "#F7DF1E" };
  }
  if (norm.includes("html")) {
    return { icon: SiHtml5, color: "#E34F26" };
  }
  if (norm.includes("css")) {
    return { icon: FaCss3Alt, color: "#1572B6" };
  }
  if (norm.includes("tailwind")) {
    return { icon: SiTailwindcss, color: "#06B6D4" };
  }
  if (norm.includes("redux")) {
    return { icon: SiRedux, color: "#764ABC" };
  }

  // Backend & Databases
  if (norm.includes("node")) {
    return { icon: SiNodedotjs, color: "#22C55E" };
  }
  if (norm.includes("express")) {
    return {
      icon: SiExpress,
      color: "currentColor",
      className: "text-slate-900 dark:text-slate-200",
    };
  }
  if (norm.includes("mongo")) {
    return { icon: SiMongodb, color: "#10B981" };
  }
  if (norm.includes("mysql")) {
    return { icon: SiMysql, color: "#00758F" };
  }
  if (norm.includes("rest") || norm.includes("api")) {
    return { icon: TbApi, color: "#06B6D4" };
  }

  // Core Languages
  if (norm.includes("java") && !norm.includes("script")) {
    return { icon: FaJava, color: "#ED8B00" };
  }
  if (norm.includes("python")) {
    return { icon: SiPython, color: "#3776AB" };
  }
  if (norm.includes("c++") || norm.includes("cpp")) {
    return { icon: SiCplusplus, color: "#00599C" };
  }

  // Core CS Concepts
  if (norm.includes("dsa") || norm.includes("data structure") || norm.includes("algorithm")) {
    return { icon: TbBrain, color: "#F59E0B" };
  }
  if (norm.includes("oop") || norm.includes("object-oriented")) {
    return { icon: TbLayersLinked, color: "#A855F7" };
  }
  if (norm.includes("dbms") || norm.includes("database")) {
    return { icon: TbDatabase, color: "#3B82F6" };
  }

  // Tools & Dev Environment
  if (norm.includes("github")) {
    return {
      icon: SiGithub,
      color: "currentColor",
      className: "text-slate-900 dark:text-white",
    };
  }
  if (norm.includes("git")) {
    return { icon: SiGit, color: "#F05032" };
  }
  if (norm.includes("vs code") || norm.includes("vscode")) {
    return { icon: VscCode, color: "#007ACC" };
  }
  if (norm.includes("postman")) {
    return { icon: SiPostman, color: "#FF6C37" };
  }
  if (norm.includes("npm")) {
    return { icon: SiNpm, color: "#CB3837" };
  }
  if (norm.includes("docker")) {
    return { icon: SiDocker, color: "#2496ED" };
  }
  if (norm.includes("leetcode")) {
    return { icon: SiLeetcode, color: "#FFA116" };
  }

  // Fallback
  return { icon: Code2, color: "#EF4444" };
}
