import mongoose, { Schema, Document, Model } from "mongoose";

export interface ISkill extends Document {
  name: string;
  category: string;
  icon: string; // We can store the name of the Lucide icon here
  visible: boolean;
  order: number;
}

const SkillSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    category: {
      type: String,
      required: true,
      enum: [
        "Programming Languages",
        "Frontend",
        "Backend",
        "Databases",
        "Core CS",
        "Tools",
      ],
    },
    icon: { type: String, default: "Code" },
    visible: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true },
);

export const Skill: Model<ISkill> =
  mongoose.models.Skill || mongoose.model<ISkill>("Skill", SkillSchema);
