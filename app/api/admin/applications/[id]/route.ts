import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import connectDB from '@/lib/mongodb';
import Application from '@/models/Application';
import { sendEmail, generateStatusUpdateEmail } from '@/lib/email';

const COOKIE_NAME = 'admin_session';
const COOKIE_VALUE = 'authenticated';

async function isAuthenticated() {
  const cookieStore = await cookies();
  const session = cookieStore.get(COOKIE_NAME);
  return session?.value === COOKIE_VALUE;
}

const validStatuses = ['new', 'reviewing', 'interviewed', 'rejected', 'hired'];

interface PopulatedJob {
  _id: string;
  title: string;
  slug: string;
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check authentication
    if (!await isAuthenticated()) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();

    const { id } = await params;
    const { status } = await request.json();

    if (!status || !validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status', validStatuses },
        { status: 400 }
      );
    }

    // Get current application to check if status is changing
    const currentApplication = await Application.findById(id);
    if (!currentApplication) {
      return NextResponse.json(
        { error: 'Application not found' },
        { status: 404 }
      );
    }

    const previousStatus = currentApplication.status;

    const application = await Application.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    ).populate('jobId', 'title slug');

    if (!application) {
      return NextResponse.json(
        { error: 'Application not found' },
        { status: 404 }
      );
    }

    // Send status update email if status actually changed (not for 'new')
    if (previousStatus !== status && status !== 'new') {
      const job = application.jobId as unknown as PopulatedJob;
      sendEmail({
        to: application.email,
        subject: `Application Update - ${job?.title || 'REstart'}`,
        html: generateStatusUpdateEmail(
          application.name,
          job?.title || 'Unknown Position',
          status,
          application.trackingCode
        ),
      }).catch((err) => console.error('Failed to send status update email:', err));
    }

    return NextResponse.json(
      { message: 'Status updated', application },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating application:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: 'Failed to update application', details: errorMessage },
      { status: 500 }
    );
  }
}
