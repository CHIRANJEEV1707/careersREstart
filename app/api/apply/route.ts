import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Application from '@/models/Application';
import Job from '@/models/Job';
import mongoose from 'mongoose';
import { sendEmail, generateConfirmationEmail } from '@/lib/email';

// Email validation regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface ApplicationBody {
  name: string;
  email: string;
  phone: string;
  college: string;
  year: string;
  location: string;
  availability: string;
  startTimeline: string;
  portfolioLink: string;
  resumeUrl: string;
  experienceSummary: string;
  motivation: string;
  problemInterest: string;
  examBackground?: string;
  teachingExperience?: string;
  commitmentConfirmed: boolean;
  referralSource?: string;
  jobSlug: string;
}

export async function POST(request: Request) {
  try {
    await connectDB();

    const body: ApplicationBody = await request.json();

    // Server-side validation
    const errors: Record<string, string> = {};

    // 1. Personal Info
    if (!body.name || body.name.trim().length === 0) errors.name = 'Name is required';

    if (!body.email || body.email.trim().length === 0) {
      errors.email = 'Email is required';
    } else if (!emailRegex.test(body.email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!body.phone || body.phone.trim().length === 0) errors.phone = 'Phone number is required';
    if (!body.college || body.college.trim().length === 0) errors.college = 'College/Organization is required';
    if (!body.year || body.year.trim().length === 0) errors.year = 'Year is required';
    if (!body.location || body.location.trim().length === 0) errors.location = 'Location is required';

    // 2. Role Context
    // jobSlug is checked via DB query later, but we check presence here
    if (!body.jobSlug) errors.jobSlug = 'Job is required';
    if (!body.availability) errors.availability = 'Availability is required';
    if (!body.startTimeline) errors.startTimeline = 'Start timeline is required';

    // 3. Proof of Work
    if (!body.portfolioLink || body.portfolioLink.trim().length === 0) errors.portfolioLink = 'Portfolio link is required';
    if (!body.resumeUrl || body.resumeUrl.trim().length === 0) errors.resumeUrl = 'Resume link is required';

    if (!body.experienceSummary || body.experienceSummary.trim().length === 0) {
      errors.experienceSummary = 'Experience summary is required';
    } else if (body.experienceSummary.trim().length < 50) {
      // Relaxed min-length on API side, strict on Client
      errors.experienceSummary = 'Experience summary is too short';
    }

    // 4. Motivation
    if (!body.motivation || body.motivation.trim().length === 0) errors.motivation = 'Motivation is required';
    if (!body.problemInterest || body.problemInterest.trim().length === 0) errors.problemInterest = 'Problem interest is required';

    // 6. Logistics
    if (body.commitmentConfirmed !== true) errors.commitmentConfirmed = 'You must confirm your commitment';

    // Return validation errors if any
    if (Object.keys(errors).length > 0) {
      return NextResponse.json(
        { error: 'Validation failed', errors },
        { status: 400 }
      );
    }

    // Find the job by slug
    const job = await Job.findOne({ slug: body.jobSlug, isOpen: true });

    if (!job) {
      return NextResponse.json(
        { error: 'Job not found or no longer accepting applications' },
        { status: 404 }
      );
    }

    // Check for duplicate application
    const existingApplication = await Application.findOne({
      email: body.email.toLowerCase().trim(),
      jobId: job._id,
    });

    if (existingApplication) {
      return NextResponse.json(
        { error: 'You have already applied for this position' },
        { status: 409 }
      );
    }

    // Create the application
    const application = await Application.create({
      name: body.name.trim(),
      email: body.email.toLowerCase().trim(),
      phone: body.phone.trim(),
      college: body.college.trim(),
      year: body.year.trim(),
      location: body.location.trim(),
      roleApplied: job.title,
      availability: body.availability,
      startTimeline: body.startTimeline,
      portfolioLink: body.portfolioLink.trim(),
      resumeUrl: body.resumeUrl?.trim() || undefined,
      experienceSummary: body.experienceSummary.trim(),
      motivation: body.motivation.trim(),
      problemInterest: body.problemInterest.trim(),
      examBackground: body.examBackground?.trim() || undefined,
      teachingExperience: body.teachingExperience?.trim() || undefined,
      commitmentConfirmed: body.commitmentConfirmed,
      referralSource: body.referralSource?.trim() || undefined,
      jobId: job._id,
      status: 'new',
    });

    // Send confirmation email asynchronously
    sendEmail({
      to: application.email,
      subject: `Application Received - ${job.title} at REstart`,
      html: generateConfirmationEmail(application.name, job.title, application.trackingCode),
    }).catch((err) => console.error('Failed to send confirmation email:', err));

    return NextResponse.json(
      {
        message: 'Application submitted successfully',
        applicationId: application._id,
        trackingCode: application.trackingCode,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error submitting application:', error);

    if (error instanceof mongoose.Error || (error as { code?: number }).code === 11000) {
      return NextResponse.json(
        { error: 'You have already applied for this position' },
        { status: 409 }
      );
    }

    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: 'Failed to submit application', details: errorMessage },
      { status: 500 }
    );
  }
}
