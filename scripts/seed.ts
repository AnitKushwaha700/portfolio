import mongoose from "mongoose";
import * as dotenv from "dotenv";
import bcrypt from "bcryptjs";
import { AdminUser } from "../models/AdminUser";
import { PortfolioSettings } from "../models/PortfolioSettings";
import { Project } from "../models/Project";
import { Experience } from "../models/Experience";
import { Skill } from "../models/Skill";
import { Education } from "../models/Education";

dotenv.config({ path: ".env" });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env",
  );
}

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI as string);
    console.log("Connected to MongoDB");

    // Clear existing data
    await AdminUser.deleteMany({});
    await PortfolioSettings.deleteMany({});
    await Project.deleteMany({});
    await Experience.deleteMany({});
    await Skill.deleteMany({});
    await Education.deleteMany({});
    console.log("Cleared existing data");

    // Seed Admin
    const adminEmail = process.env.ADMIN_EMAIL;
    if (!adminEmail) {
      throw new Error(
        "Please define the ADMIN_EMAIL environment variable inside .env",
      );
    }
    const adminPassword = process.env.ADMIN_PASSWORD;
    const passwordHash =
      process.env.ADMIN_PASSWORD_HASH ||
      (adminPassword ? await bcrypt.hash(adminPassword, 10) : undefined);

    if (!passwordHash) {
      throw new Error(
        "Please define ADMIN_PASSWORD_HASH or ADMIN_PASSWORD inside .env",
      );
    }

    await AdminUser.create({
      email: adminEmail,
      passwordHash,
    });
    console.log("Seeded AdminUser");

    // Seed Settings
    await PortfolioSettings.create({
      sectionVisibility: {
        hero: true,
        about: true,
        skills: true,
        experience: true,
        projects: true,
        education: true,
        hackathon: true,
        github: true,
        contact: true,
      },
      seo: {
        title: "Anit Kushwaha | Software Developer",
        description:
          "Computer Science Engineering graduate and Software Developer building full-stack web applications with JavaScript, TypeScript, React.js, Next.js, Node.js, Express.js, MongoDB and MySQL.",
      },
      social: {
        github: "https://github.com/AnitKushwaha700",
        linkedin: "https://www.linkedin.com/in/l-anit-kushwaha-l-7651462bb",
        email: "kushwahaanitak@gmail.com",
        phone: "+91 8989791426",
      },
      hero: {
        name: "Anit Kushwaha",
        role: "Software Developer",
        description:
          "Build full-stack web applications using JavaScript, TypeScript, React.js, Next.js, Node.js and modern backend technologies.",
        profileImage: "/profile/profile.jpg",
        resumeUrl: "#",
        showButtons: true,
        showProfileImage: true,
      },
      about: {
        content:
          "Computer Science Engineering graduate and Software Developer Intern with hands-on experience building full-stack web applications using JavaScript, TypeScript, React.js, Next.js, Node.js, Express.js, MongoDB, and MySQL.",
      },
    });
    console.log("Seeded Settings");

    // Seed Experience
    await Experience.create([
      {
        company: "Raj Digital Private Limited (RDPL)",
        role: "Software Developer Intern",
        location: "Bhopal, Madhya Pradesh",
        startDate: "June 2026",
        endDate: "July 2026",
        responsibilities: [
          "Contributed to the development of a Learning Management System (LMS) featuring Student, Teacher, and Admin dashboards.",
          "Developed and integrated web application features using React.js, Next.js, JavaScript, and TypeScript.",
          "Integrated REST APIs and connected frontend components with backend services.",
          "Worked with MongoDB and MySQL for application data management and CRUD operations.",
          "Contributed to the development and maintenance of the company website.",
          "Implemented responsive UI and application features.",
          "Collaborated with developers on feature implementation, debugging, testing, and Git/GitHub-based version control.",
        ],
        order: 1,
      },
      {
        company: "RICR Bhopal",
        role: "Content Developer (Java & DSA)",
        location: "Bhopal, Madhya Pradesh",
        startDate: "November 2025",
        endDate: "May 2026",
        responsibilities: [
          "Created educational content covering Java, Data Structures & Algorithms, programming concepts, and problem-solving techniques.",
          "Developed structured programming problems, solutions, and animated technical explainers to support coding practice and learning.",
        ],
        order: 2,
      },
    ]);
    console.log("Seeded Experience");

    // Seed Education
    await Education.create([
      {
        institution:
          "Shree Rama Krishna College of Engineering Science and Management",
        degree: "B.Tech in Computer Science Engineering",
        location: "Madhya Pradesh (RGPV Bhopal)",
        startDate: "2022",
        endDate: "2026",
        score: "CGPA: 7.1/10",
        order: 1,
      },
      {
        institution: "Govt. Venkat Higher Secondary School No. 2",
        degree: "Class 12 (MP Board)",
        location: "Madhya Pradesh",
        startDate: "",
        endDate: "",
        score: "60%",
        order: 2,
      },
      {
        institution: "Vyankteshwar High School",
        degree: "Class 10 (MP Board)",
        location: "Madhya Pradesh",
        startDate: "",
        endDate: "",
        score: "80%",
        order: 3,
      },
    ]);
    console.log("Seeded Education");

    // Seed Projects
    await Project.create([
      {
        title: "Cravings — Food Ordering Platform",
        slug: "cravings",
        description: "A full-stack food ordering platform.",
        technologies: ["React.js", "Node.js", "Express.js", "MongoDB"],
        features: [
          "Built a full-stack food ordering platform using React.js, Node.js, Express.js, and MongoDB.",
          "Implemented REST APIs.",
          "Implemented user authentication.",
          "Integrated database operations.",
          "Connected frontend and backend services.",
          "Developed reusable frontend components.",
        ],
        githubUrl: "https://github.com/AnitKushwaha700/Cravings", // placeholder, assuming standard format
        featured: true,
        order: 1,
        content: {
          overview:
            "Cravings is a comprehensive food ordering platform designed to provide a seamless experience for users to browse, order, and track food from their favorite local restaurants.",
          problem:
            "Many food ordering applications lack an intuitive user interface and suffer from slow performance due to poorly optimized database queries.",
          solution:
            "Developed a responsive frontend with React.js and a robust backend with Node.js and MongoDB to handle high concurrency and fast data retrieval.",
          myContribution:
            "I was responsible for full-stack development, including setting up the MongoDB schema, building the REST API, and creating the React components for the frontend.",
          challenges:
            "Managing real-time state for the shopping cart and ensuring secure authentication were significant challenges.",
          learning:
            "Gained deep understanding of JWT authentication, state management in React, and MongoDB aggregation pipelines.",
        },
      },
      {
        title: "ChatApp — Real-Time Communication Platform",
        slug: "chatapp",
        description:
          "A real-time communication platform supporting messaging and audio/video calling.",
        technologies: [
          "React.js",
          "Node.js",
          "Express.js",
          "MongoDB",
          "WebRTC",
        ],
        features: [
          "Authentication",
          "Database integration",
          "Backend APIs",
          "Real-time communication",
          "WebRTC-based peer-to-peer audio/video communication",
          "Frontend/backend integration",
        ],
        githubUrl: "https://github.com/AnitKushwaha700/ChatApp", // placeholder
        featured: true,
        order: 2,
        content: {
          overview:
            "ChatApp is a modern real-time communication tool that enables instant messaging and high-quality audio/video calls between users.",
          problem:
            "Existing solutions are often resource-heavy and complex to set up for simple peer-to-peer communication.",
          solution:
            "Utilized WebRTC for efficient peer-to-peer media streaming and Socket.io for lightweight, real-time text messaging.",
          myContribution:
            "Implemented the WebRTC signaling logic and built the React UI for the chat interface and video call room.",
          challenges:
            "Handling STUN/TURN server configurations for WebRTC and managing socket connections during network instability.",
          learning:
            "Mastered WebRTC API and improved my skills in handling real-time WebSocket data.",
        },
      },
      {
        title: "CareerAI — Career & Job Tech Hackathon",
        slug: "careerai",
        description: "A career-focused platform developed for a hackathon.",
        technologies: ["Next.js", "TypeScript", "Node.js", "MongoDB"],
        features: [
          "Resume analysis",
          "ATS evaluation",
          "Job-description matching",
          "Mock interviews",
          "Resume-related workflows",
        ],
        githubUrl: "https://github.com/AnitKushwaha700/CareerAI", // placeholder
        featured: true,
        order: 3,
        content: {
          overview:
            "CareerAI was built during a hackathon to provide intelligent tools for job seekers to optimize their resumes and prepare for interviews.",
          problem:
            "Job seekers struggle to understand why their resumes are rejected by ATS systems and lack access to affordable interview preparation.",
          solution:
            "Created a Next.js application that integrates with AI services to analyze resumes against job descriptions and simulate interviews.",
          myContribution:
            "Built responsive interfaces using Next.js and TypeScript, integrated backend services, and collaborated with a development team using Git/GitHub.",
          challenges:
            "Integrating third-party AI APIs within the tight timeframe of a hackathon.",
          learning:
            "Enhanced my ability to work rapidly under pressure and deepened my knowledge of Next.js App Router and TypeScript.",
        },
      },
    ]);
    console.log("Seeded Projects");

    // Seed Skills
    const skills = [
      { name: "Java", category: "Programming Languages" },
      { name: "JavaScript", category: "Programming Languages" },
      { name: "TypeScript", category: "Programming Languages" },
      { name: "React.js", category: "Frontend" },
      { name: "Next.js", category: "Frontend" },
      { name: "HTML5", category: "Frontend" },
      { name: "CSS3", category: "Frontend" },
      { name: "Tailwind CSS", category: "Frontend" },
      { name: "Node.js", category: "Backend" },
      { name: "Express.js", category: "Backend" },
      { name: "REST APIs", category: "Backend" },
      { name: "MongoDB", category: "Databases" },
      { name: "MySQL", category: "Databases" },
      { name: "Data Structures & Algorithms", category: "Core CS" },
      { name: "Object-Oriented Programming", category: "Core CS" },
      { name: "DBMS", category: "Core CS" },
      { name: "Git", category: "Tools" },
      { name: "GitHub", category: "Tools" },
      { name: "VS Code", category: "Tools" },
      { name: "Postman", category: "Tools" },
      { name: "npm", category: "Tools" },
    ];

    await Skill.create(skills.map((s, i) => ({ ...s, order: i })));
    console.log("Seeded Skills");

    console.log("Database seeding completed successfully.");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
}

seed();
