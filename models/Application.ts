import mongoose, { Schema, Document, Model } from 'mongoose';
import crypto from 'crypto';

export interface IApplication extends Document {
  name: string;
  email: string;
  phone?: string;
  portfolioLink: string;
  resumeUrl?: string;
  coverNote: string;
  weeklyAvailability: string;
  jobId: mongoose.Types.ObjectId;
  status: 'new' | 'reviewing' | 'interviewed' | 'rejected' | 'hired';
  trackingCode: string;
  createdAt: Date;
  updatedAt: Date;
}

// Generate a unique tracking code
function generateTrackingCode(): string {
  return crypto.randomBytes(6).toString('hex'); // 12 character hex string
}

const ApplicationSchema = new Schema<IApplication>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please enter a valid email address'],
    },
    phone: {
      type: String,
      trim: true,
    },
    portfolioLink: {
      type: String,
      required: [true, 'Portfolio link is required'],
      trim: true,
    },
    resumeUrl: {
      type: String,
      trim: true,
    },
    coverNote: {
      type: String,
      required: [true, 'Cover note is required'],
      trim: true,
    },
    weeklyAvailability: {
      type: String,
      required: [true, 'Weekly availability is required'],
      trim: true,
    },
    jobId: {
      type: Schema.Types.ObjectId,
      ref: 'Job',
      required: [true, 'Job ID is required'],
    },
    status: {
      type: String,
      enum: ['new', 'reviewing', 'interviewed', 'rejected', 'hired'],
      default: 'new',
    },
    trackingCode: {
      type: String,
      unique: true,
      default: generateTrackingCode,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to prevent duplicate applications
ApplicationSchema.index({ email: 1, jobId: 1 }, { unique: true });

// Prevent model recompilation in dev mode
const Application: Model<IApplication> = mongoose.models.Application || mongoose.model<IApplication>('Application', ApplicationSchema);

export default Application;
