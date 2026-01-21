
import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Job from '@/models/Job';

export async function GET() {
  await connectDB();
  const job = await Job.findOne({ slug: 'frontend-engineer' });
  return NextResponse.json({
    fullDescription: job?.fullDescription,
    isHTML: /<[a-z][\s\S]*>/i.test(job?.fullDescription || '')
  });
}
