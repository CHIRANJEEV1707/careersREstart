import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import connectDB from '@/lib/mongodb';
import Application from '@/models/Application';

const COOKIE_NAME = 'admin_session';
const COOKIE_VALUE = 'authenticated';

async function isAuthenticated() {
  const cookieStore = await cookies();
  const session = cookieStore.get(COOKIE_NAME);
  return session?.value === COOKIE_VALUE;
}

export async function GET(request: Request) {
  try {
    // Check authentication
    if (!await isAuthenticated()) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();

    const { searchParams } = new URL(request.url);
    const jobId = searchParams.get('jobId');
    const status = searchParams.get('status');

    // Build query
    const query: Record<string, unknown> = {};

    if (jobId) {
      query.jobId = jobId;
    }

    if (status) {
      query.status = status;
    }

    // Fetch applications with job details
    const applications = await Application.find(query)
      .populate('jobId', 'title slug')
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ applications }, { status: 200 });
  } catch (error) {
    console.error('Error fetching applications:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: 'Failed to fetch applications', details: errorMessage },
      { status: 500 }
    );
  }
}
