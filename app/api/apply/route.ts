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
  phone?: string;
  portfolioLink: string;
  resumeUrl?: string;
  coverNote: string;
  weeklyAvailability: string;
  jobSlug: string;
}

export async function POST(request: Request) {
  try {
    await connectDB();

    const body: ApplicationBody = await request.json();

    // Server-side validation
    const errors: Record<string, string> = {};

    if (!body.name || body.name.trim().length === 0) {
      errors.name = 'Name is required';
    }

    if (!body.email || body.email.trim().length === 0) {
      errors.email = 'Email is required';
    } else if (!emailRegex.test(body.email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!body.portfolioLink || body.portfolioLink.trim().length === 0) {
      errors.portfolioLink = 'Portfolio link is required';
    }

    if (!body.coverNote || body.coverNote.trim().length === 0) {
      errors.coverNote = 'Cover note is required';
    }

    if (!body.weeklyAvailability || body.weeklyAvailability.trim().length === 0) {
      errors.weeklyAvailability = 'Weekly availability is required';
    }

    if (!body.jobSlug) {
      errors.jobSlug = 'Job slug is required';
    }

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

    // Create the application (trackingCode is auto-generated)
    const application = await Application.create({
      name: body.name.trim(),
      email: body.email.toLowerCase().trim(),
      phone: body.phone?.trim() || undefined,
      portfolioLink: body.portfolioLink.trim(),
      resumeUrl: body.resumeUrl?.trim() || undefined,
      coverNote: body.coverNote.trim(),
      weeklyAvailability: body.weeklyAvailability.trim(),
      jobId: job._id,
      status: 'new',
    });

    // Send confirmation email asynchronously (don't block response)
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

    // Handle duplicate key error (backup for race condition)
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
