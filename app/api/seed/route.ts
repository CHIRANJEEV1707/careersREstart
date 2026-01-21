import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Job from '@/models/Job';
import { jobs } from '@/data/mock-jobs';

export async function POST() {
  try {
    await connectDB();

    // Clear existing jobs (optional - for clean seed)
    await Job.deleteMany({});

    // Transform mock jobs to match new schema
    const jobsToInsert = jobs.map((job) => ({
      title: job.title,
      slug: job.slug,
      shortDescription: job.description,
      fullDescription: job.about,
      responsibilities: job.responsibilities,
      requirements: job.requirements,
      niceToHave: job.niceToHave || [],
      category: job.category,
      tags: job.skills,
      location: job.location,
      type: job.type,
      isOpen: true,
    }));

    const insertedJobs = await Job.insertMany(jobsToInsert);

    return NextResponse.json(
      {
        message: `Successfully seeded ${insertedJobs.length} jobs`,
        jobs: insertedJobs
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error seeding database:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: 'Failed to seed database', details: errorMessage },
      { status: 500 }
    );
  }
}
