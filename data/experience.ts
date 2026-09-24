export interface Experience {
  title: string;
  company: string;
  location: string;
  period: string;
  responsibilities: string[];
}

export const experiences: Experience[] = [
  {
    title: "Software Developer Intern",
    company: "Raj Digital Private Limited (RDPL)",
    location: "Bhopal, Madhya Pradesh",
    period: "June 2026 – July 2026",
    responsibilities: [
      "Contributed to the development of a Learning Management System (LMS) featuring Student, Teacher, and Admin dashboards.",
      "Developed and integrated web application features using React.js, Next.js, JavaScript, and TypeScript.",
      "Integrated REST APIs and connected frontend components with backend services.",
      "Worked with MongoDB and MySQL for application data management and CRUD operations.",
      "Contributed to the development and maintenance of the company website.",
      "Collaborated with developers on feature implementation, debugging, testing, and Git/GitHub-based version control.",
    ],
  },
  {
    title: "Content Developer (Java & DSA)",
    company: "RICR Bhopal",
    location: "Bhopal, Madhya Pradesh",
    period: "November 2025 – May 2026",
    responsibilities: [
      "Created educational content covering Java, Data Structures & Algorithms, programming concepts, and problem-solving.",
      "Developed structured programming problems, solutions, and animated technical explainers.",
    ],
  },
];
