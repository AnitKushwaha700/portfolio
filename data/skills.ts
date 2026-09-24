export interface SkillCategory {
  title: string;
  icon: string;
  skills: string[];
}

export const skillCategories: SkillCategory[] = [
  {
    title: "Programming Languages",
    icon: "Code2",
    skills: ["Java", "JavaScript", "TypeScript"],
  },
  {
    title: "Frontend",
    icon: "Monitor",
    skills: ["React.js", "Next.js", "HTML5", "CSS3", "Tailwind CSS"],
  },
  {
    title: "Backend",
    icon: "Server",
    skills: ["Node.js", "Express.js", "REST APIs"],
  },
  {
    title: "Databases",
    icon: "Database",
    skills: ["MongoDB", "MySQL"],
  },
  {
    title: "Core CS",
    icon: "BookOpen",
    skills: [
      "Data Structures & Algorithms",
      "Object-Oriented Programming",
      "DBMS",
    ],
  },
  {
    title: "Tools",
    icon: "Wrench",
    skills: ["Git", "GitHub", "VS Code", "Postman", "npm"],
  },
];
