import mongoose, { Schema, Document, Model } from 'mongoose';
import crypto from 'crypto';

export interface IApplication extends Document {
  name: string;
  email: string;
  phone: string;
  college: string;
  year: string;
  location: string;
  roleApplied: string;
  availability: string;
  startTimeline: string;
  portfolioLink: string;
  resumeUrl?: string;
  experienceSummary: string;
  motivation: string;
  problemInterest: string;
  examBackground?: string;
  teachingExperience?: string;
  commitmentConfirmed: boolean;
  referralSource?: string;
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
      required: [true, 'Phone number is required'],
      trim: true,
    },
    college: {
      type: String,
      required: [true, 'College/Organization is required'],
      trim: true,
    },
    year: {
      type: String,
      required: [true, 'Year of study/graduation is required'],
      trim: true,
    },
    location: {
      type: String,
      required: [true, 'Current location is required'],
      trim: true,
    },
    roleApplied: {
      type: String,
      required: [true, 'Role applied for is required'],
      trim: true,
    },
    availability: {
      type: String,
      required: [true, 'Weekly availability is required'],
      trim: true,
    },
    startTimeline: {
      type: String,
      required: [true, 'Start timeline is required'],
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
    experienceSummary: {
      type: String,
      required: [true, 'Experience summary is required'],
      trim: true,
      minlength: [100, 'Experience summary must be at least 100 characters'],
    },
    motivation: {
      type: String,
      required: [true, 'Motivation is required'],
      trim: true,
    },
    problemInterest: {
      type: String,
      required: [true, 'Problem interest is required'],
      trim: true,
    },
    examBackground: {
      type: String,
      trim: true,
    },
    teachingExperience: {
      type: String,
      trim: true,
    },
    commitmentConfirmed: {
      type: Boolean,
      required: [true, 'Commitment confirmation is required'],
      default: false,
    },
    referralSource: {
      type: String,
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
