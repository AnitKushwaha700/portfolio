import mongoose, { Schema, Document, Model } from "mongoose";

export interface IHackathon extends Document {
  title: string;
  slug: string;
  organization: string;
  date: string;
  description: string;
  location: string;
  link: string;
  image: string;
  certificateUrl?: string;
  technologies: string[];
  features: string[];
  content: {
    overview?: string;
    problem?: string;
    solution?: string;
    myContribution?: string;
    challenges?: string;
    learning?: string;
  };
  visible: boolean;
}

const HackathonSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    organization: { type: String, required: true },
    date: { type: String, default: "" },
    description: { type: String, default: "" },
    location: { type: String, default: "" },
    link: { type: String, default: "" },
    image: { type: String, default: "" },
    certificateUrl: { type: String, default: "" },
    technologies: { type: [String], default: [] },
    features: { type: [String], default: [] },
    content: {
      overview: { type: String },
      problem: { type: String },
      solution: { type: String },
      myContribution: { type: String },
      challenges: { type: String },
      learning: { type: String },
    },
    visible: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export const Hackathon: Model<IHackathon> =
  mongoose.models.Hackathon ||
  mongoose.model<IHackathon>("Hackathon", HackathonSchema);
