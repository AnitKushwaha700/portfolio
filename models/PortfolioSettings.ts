import mongoose, { Schema, Document, Model } from "mongoose";

export interface IPortfolioSettings extends Document {
  sectionVisibility: {
    hero: boolean;
    about: boolean;
    skills: boolean;
    experience: boolean;
    projects: boolean;
    education: boolean;
    hackathon: boolean;
    github: boolean;
    contact: boolean;
  };
  seo: {
    title: string;
    description: string;
  };
  social: {
    github: string;
    linkedin: string;
    email: string;
    phone: string;
  };
  hero: {
    name: string;
    role: string;
    description: string;
    profileImage: string;
    resumeUrl: string;
    showButtons: boolean;
    showProfileImage: boolean;
  };
  about: {
    content: string;
  };
}

const PortfolioSettingsSchema: Schema = new Schema(
  {
    sectionVisibility: {
      hero: { type: Boolean, default: true },
      about: { type: Boolean, default: true },
      skills: { type: Boolean, default: true },
      experience: { type: Boolean, default: true },
      projects: { type: Boolean, default: true },
      education: { type: Boolean, default: true },
      hackathon: { type: Boolean, default: false },
      github: { type: Boolean, default: true },
      contact: { type: Boolean, default: true },
    },
    seo: {
      title: { type: String, default: "Anit Kushwaha | Software Developer" },
      description: {
        type: String,
        default:
          "Computer Science Engineering graduate and Software Developer building full-stack web applications with JavaScript, TypeScript, React.js, Next.js, Node.js, Express.js, MongoDB and MySQL.",
      },
    },
    social: {
      github: { type: String, default: "https://github.com/AnitKushwaha700" },
      linkedin: {
        type: String,
        default: "https://www.linkedin.com/in/l-anit-kushwaha-l-7651462bb",
      },
      email: { type: String, default: "kushwahaanitak@gmail.com" },
      phone: { type: String, default: "+91 8989791426" },
    },
    hero: {
      name: { type: String, default: "Anit Kushwaha" },
      role: { type: String, default: "Software Developer" },
      description: {
        type: String,
        default:
          "Build full-stack web applications using JavaScript, TypeScript, React.js, Next.js, Node.js and modern backend technologies.",
      },
      profileImage: { type: String, default: "/profile/profile.jpg" },
      resumeUrl: { type: String, default: "#" },
      showButtons: { type: Boolean, default: true },
      showProfileImage: { type: Boolean, default: true },
    },
    about: {
      content: {
        type: String,
        default:
          "Computer Science Engineering graduate and Software Developer Intern with hands-on experience building full-stack web applications using JavaScript, TypeScript, React.js, Next.js, Node.js, Express.js, MongoDB, and MySQL.",
      },
    },
  },
  { timestamps: true },
);

export const PortfolioSettings: Model<IPortfolioSettings> =
  mongoose.models.PortfolioSettings ||
  mongoose.model<IPortfolioSettings>(
    "PortfolioSettings",
    PortfolioSettingsSchema,
  );
