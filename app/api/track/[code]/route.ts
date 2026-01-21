import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Application from '@/models/Application';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    await connectDB();

    const { code } = await params;

    const application = await Application.findOne({ trackingCode: code })
      .populate('jobId', 'title slug category')
      .lean();

    if (!application) {
      return NextResponse.json(
        { error: 'Application not found' },
        { status: 404 }
      );
    }

    // Return only public-safe data
    return NextResponse.json({
      application: {
        name: application.name,
        status: application.status,
        jobTitle: (application.jobId as { title?: string })?.title || 'Unknown',
        jobCategory: (application.jobId as { category?: string })?.category || 'Unknown',
        appliedAt: application.createdAt,
        updatedAt: application.updatedAt,
      },
    });
  } catch (error) {
    console.error('Error fetching application:', error);
    return NextResponse.json(
      { error: 'Failed to fetch application' },
      { status: 500 }
    );
  }
}
