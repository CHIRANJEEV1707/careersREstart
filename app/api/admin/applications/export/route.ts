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

interface PopulatedApplication {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  portfolioLink: string;
  resumeUrl?: string;
  coverNote: string;
  weeklyAvailability: string;
  status: string;
  createdAt: Date;
  jobId: {
    _id: string;
    title: string;
    slug: string;
  };
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
      .lean() as unknown as PopulatedApplication[];

    // Generate CSV
    const headers = [
      'Name',
      'Email',
      'Phone',
      'Portfolio',
      'Resume',
      'Cover Note',
      'Weekly Availability',
      'Job Title',
      'Status',
      'Applied At',
    ];

    const rows = applications.map((app) => [
      escapeCsvField(app.name),
      escapeCsvField(app.email),
      escapeCsvField(app.phone || ''),
      escapeCsvField(app.portfolioLink),
      escapeCsvField(app.resumeUrl || ''),
      escapeCsvField(app.coverNote),
      escapeCsvField(app.weeklyAvailability),
      escapeCsvField(app.jobId?.title || 'Unknown'),
      escapeCsvField(app.status),
      escapeCsvField(new Date(app.createdAt).toISOString()),
    ]);

    const csv = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');

    return new NextResponse(csv, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="applications-${new Date().toISOString().split('T')[0]}.csv"`,
      },
    });
  } catch (error) {
    console.error('Error exporting applications:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: 'Failed to export applications', details: errorMessage },
      { status: 500 }
    );
  }
}

function escapeCsvField(field: string): string {
  if (field.includes(',') || field.includes('"') || field.includes('\n')) {
    return `"${field.replace(/"/g, '""')}"`;
  }
  return field;
}
