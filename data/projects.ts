export interface Project {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  techStack: string[];
  features: string[];
  githubUrl?: string;
  liveUrl?: string;
  overview: string;
  problem: string;
  solution: string;
  architecture: ArchitectureLayer[];
  contribution: string[];
  challenges: string[];
  learnings: string[];
}

export interface ArchitectureLayer {
  label: string;
  tech: string;
}

export const projects: Project[] = [
  {
    slug: "cravings",
    name: "Cravings",
    tagline: "Food Ordering Platform",
    description:
      "Full-stack food ordering platform built with React.js, Node.js, Express.js, and MongoDB.",
    techStack: ["React.js", "Node.js", "Express.js", "MongoDB"],
    features: [
      "User authentication",
      "REST APIs",
      "Database integration",
      "Frontend-backend communication",
      "Reusable React components",
      "Food ordering workflows",
    ],
    githubUrl: "https://github.com/AnitKushwaha700/Cravings",
    overview:
      "Cravings is a full-stack food ordering platform that allows users to browse menus, place orders, and manage their food ordering experience through an intuitive web interface.",
    problem:
      "Building a complete food ordering system that handles user authentication, menu management, order processing, and seamless communication between the frontend and backend services.",
    solution:
      "Developed a full-stack application using React.js for the frontend interface, Node.js and Express.js for the backend API layer, and MongoDB for persistent data storage. The application implements a clean separation of concerns with reusable components and RESTful API design.",
    architecture: [
      { label: "Frontend", tech: "React.js" },
      { label: "API Layer", tech: "REST APIs" },
      { label: "Backend", tech: "Node.js / Express.js" },
      { label: "Database", tech: "MongoDB" },
    ],
    contribution: [
      "Designed and implemented the React.js frontend with reusable components",
      "Built RESTful API endpoints using Node.js and Express.js",
      "Implemented user authentication flow",
      "Set up MongoDB database schema and CRUD operations",
      "Integrated frontend with backend services",
      "Implemented food ordering workflows",
    ],
    challenges: [
      "Managing state across multiple components for the ordering flow",
      "Implementing secure user authentication",
      "Designing an efficient database schema for orders and menu items",
      "Ensuring smooth frontend-backend communication",
    ],
    learnings: [
      "Full-stack application architecture and design patterns",
      "RESTful API design and implementation",
      "MongoDB schema design and data modeling",
      "User authentication implementation",
      "React component composition and reusability",
    ],
  },
  {
    slug: "chatapp",
    name: "ChatApp",
    tagline: "Real-Time Communication Platform",
    description:
      "Real-time communication platform supporting messaging and audio/video calling.",
    techStack: ["React.js", "Node.js", "Express.js", "MongoDB", "WebRTC"],
    features: [
      "Real-time messaging",
      "Authentication",
      "Database integration",
      "Backend APIs",
      "WebRTC-based audio/video communication",
    ],
    githubUrl: "https://github.com/AnitKushwaha700/ChatApp",
    overview:
      "ChatApp is a real-time communication platform that enables users to exchange messages instantly and conduct audio/video calls using WebRTC technology.",
    problem:
      "Building a real-time communication system that supports both text messaging and audio/video calling with low latency and reliable connections.",
    solution:
      "Developed a communication platform using React.js for the UI, Node.js and Express.js for the backend, MongoDB for message persistence, and WebRTC for peer-to-peer audio/video communication.",
    architecture: [
      { label: "Frontend", tech: "React.js" },
      { label: "Real-Time", tech: "WebRTC" },
      { label: "Backend", tech: "Node.js / Express.js" },
      { label: "Database", tech: "MongoDB" },
    ],
    contribution: [
      "Built the React.js frontend for messaging and calling interfaces",
      "Implemented real-time messaging functionality",
      "Integrated WebRTC for audio/video communication",
      "Developed backend APIs with Node.js and Express.js",
      "Set up MongoDB for message and user data storage",
      "Implemented user authentication",
    ],
    challenges: [
      "Implementing real-time message delivery with minimal latency",
      "Setting up WebRTC peer-to-peer connections for audio/video calls",
      "Managing connection state and handling network interruptions",
      "Persisting messages while maintaining real-time performance",
    ],
    learnings: [
      "WebRTC protocol and peer-to-peer communication",
      "Real-time application architecture",
      "Socket-based communication patterns",
      "Audio/video stream handling in the browser",
      "Database design for messaging applications",
    ],
  },
  {
    slug: "careerai",
    name: "CareerAI",
    tagline: "Career & Job Tech Hackathon",
    description: "Hackathon platform focused on career preparation.",
    techStack: ["Next.js", "TypeScript", "Node.js", "MongoDB"],
    features: [
      "Resume analysis",
      "ATS evaluation",
      "Job-description matching",
      "Mock interviews",
      "Career preparation workflows",
    ],
    overview:
      "CareerAI is a career preparation platform built during the HackInMotion 2026 hackathon. It helps users improve their job application materials and prepare for interviews through AI-driven analysis tools.",
    problem:
      "Job seekers often struggle with optimizing resumes for ATS systems, matching their profiles to job descriptions, and preparing effectively for interviews.",
    solution:
      "Built a comprehensive career preparation platform using Next.js and TypeScript on the frontend, Node.js for the backend, and MongoDB for data storage. The platform provides resume analysis, ATS evaluation, job-description matching, and mock interview capabilities.",
    architecture: [
      { label: "Frontend", tech: "Next.js / TypeScript" },
      { label: "API Layer", tech: "REST APIs" },
      { label: "Backend", tech: "Node.js" },
      { label: "Database", tech: "MongoDB" },
    ],
    contribution: [
      "Developed the Next.js frontend with TypeScript",
      "Implemented resume analysis and ATS evaluation features",
      "Built job-description matching functionality",
      "Created mock interview workflows",
      "Integrated frontend with backend APIs",
      "Set up MongoDB for data persistence",
    ],
    challenges: [
      "Building a feature-rich application within hackathon time constraints",
      "Implementing resume parsing and analysis logic",
      "Designing an intuitive UX for career preparation workflows",
      "Integrating multiple features into a cohesive platform",
    ],
    learnings: [
      "Next.js with TypeScript for production applications",
      "Rapid prototyping and development under time constraints",
      "Resume parsing and evaluation techniques",
      "Building career-tech tools and workflows",
      "Team collaboration during hackathon development",
    ],
  },
];
