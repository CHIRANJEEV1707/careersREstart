import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IJob extends Document {
  title: string;
  slug: string;
  shortDescription: string;
  fullDescription: string;
  responsibilities: string[];
  requirements: string[];
  niceToHave: string[];
  category: string;
  tags: string[];
  location: string;
  type: string;
  isOpen: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const JobSchema = new Schema<IJob>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    shortDescription: { type: String, required: true },
    fullDescription: { type: String, required: true },
    responsibilities: { type: [String], default: [] },
    requirements: { type: [String], default: [] },
    niceToHave: { type: [String], default: [] },
    category: { type: String, required: true },
    tags: { type: [String], default: [] },
    location: { type: String, default: 'Remote' },
    type: { type: String, default: 'Part-time' },
    isOpen: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

// Prevent model recompilation in dev mode
const Job: Model<IJob> = mongoose.models.Job || mongoose.model<IJob>('Job', JobSchema);

export default Job;
