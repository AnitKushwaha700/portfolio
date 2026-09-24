import mongoose, { Schema, Document, Model } from "mongoose";

export interface IProject extends Document {
  title: string;
  slug: string;
  description: string;
  technologies: string[];
  features: string[];
  image: string;
  githubUrl: string;
  liveUrl: string;
  featured: boolean;
  visible: boolean;
  order: number;
  content: {
    overview: string;
    problem: string;
    solution: string;
    myContribution: string;
    challenges: string;
    learning: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    technologies: [{ type: String }],
    features: [{ type: String }],
    image: { type: String, default: "" },
    githubUrl: { type: String, default: "" },
    liveUrl: { type: String, default: "" },
    featured: { type: Boolean, default: false },
    visible: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
    content: {
      overview: { type: String, default: "" },
      problem: { type: String, default: "" },
      solution: { type: String, default: "" },
      myContribution: { type: String, default: "" },
      challenges: { type: String, default: "" },
      learning: { type: String, default: "" },
    },
  },
  { timestamps: true },
);

export const Project: Model<IProject> =
  mongoose.models.Project || mongoose.model<IProject>("Project", ProjectSchema);
