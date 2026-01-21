
import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Job from '@/models/Job';

export async function GET() {
  try {
    await connectDB();
    const jobs = await Job.find({});

    const results = {
      total: jobs.length,
      updated: 0,
      details: [] as string[],
    };

    for (const job of jobs) {
      // Check if it has the benefits section
      const splitBy = '<h3>What You’ll Get</h3>';
      const parts = job.fullDescription.split(splitBy);

      if (parts.length > 1) {
        let originalText = parts[0].trim();
        // Remove any trailing newlines or <br> from original text

        // If the original text is NOT wrapped in tags, wrap it in paragraphs
        if (!originalText.startsWith('<p>') && !originalText.startsWith('<div>')) {
          // Split by double newlines to find paragraphs
          originalText = originalText
            .split(/\n\s*\n/)
            .map(p => `<p>${p.trim().replace(/\n/g, '<br/>')}</p>`)
            .join('\n');
        }

        const benefitsSection = `<h3>What You’ll Get</h3>${parts.slice(1).join(splitBy)}`;

        // Reconstruct with proper spacing
        const newDescription = `${originalText}\n\n${benefitsSection}`;

        if (newDescription !== job.fullDescription) {
          job.fullDescription = newDescription;
          await job.save();
          results.updated++;
          results.details.push(`Formatted [${job.title}]`);
        } else {
          results.details.push(`No changes needed for [${job.title}]`);
        }
      } else {
        results.details.push(`Skipped [${job.title}]: No benefits section found.`);
      }
    }

    return NextResponse.json({ success: true, results });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
