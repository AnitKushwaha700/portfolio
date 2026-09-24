export interface Education {
  degree: string;
  institution: string;
  university?: string;
  period: string;
  grade: string;
  isPrimary: boolean;
}

export const educationData: Education[] = [
  {
    degree: "B.Tech in Computer Science Engineering",
    institution:
      "Shree Rama Krishna College of Engineering Science and Management",
    university: "Rajiv Gandhi Proudyogiki Vishwavidyalaya (RGPV), Bhopal",
    period: "2022 – 2026",
    grade: "CGPA: 7.1/10",
    isPrimary: true,
  },
  {
    degree: "Class 12",
    institution: "MP Board",
    period: "",
    grade: "60%",
    isPrimary: false,
  },
  {
    degree: "Class 10",
    institution: "MP Board",
    period: "",
    grade: "80%",
    isPrimary: false,
  },
];
