import mongoose, { Schema, Document, Model } from "mongoose";

export interface IEducation extends Document {
  institution: string;
  degree: string;
  location: string;
  startDate: string;
  endDate: string;
  score: string;
  certificateUrl?: string;
  visible: boolean;
  order: number;
}

const EducationSchema: Schema = new Schema(
  {
    institution: { type: String, required: true },
    degree: { type: String, required: true },
    location: { type: String, default: "" },
    startDate: { type: String, default: "" },
    endDate: { type: String, default: "" },
    score: { type: String, required: true },
    certificateUrl: { type: String, default: "" },
    visible: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true },
);

export const Education: Model<IEducation> =
  mongoose.models.Education ||
  mongoose.model<IEducation>("Education", EducationSchema);
