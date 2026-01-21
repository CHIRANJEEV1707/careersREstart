
import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Job from '@/models/Job';

const getTierCBenefits = (role: string) => `
<h3>What You’ll Get</h3>
<ul>
  <li><strong>Flexible Earning Model</strong> – Start with per-session or per-deliverable payouts (Contract/Gig model).</li>
  <li><strong>Real-World Impact</strong> – Directly mentor students and shape their academic journey.</li>
  <li><strong>Performance-Based Progression</strong> – Opportunity to transition to a fixed monthly engagement (₹8k–₹15k range) based on consistency and quality.</li>
  <li><strong>Experience Certificate</strong> – Recognition of your mentorship and academic contributions.</li>
  <li><strong>Team Goodies & Perks</strong> – Access to community events and resources.</li>
</ul>
`;

export async function GET() {
  try {
    await connectDB();
    const job = await Job.findOne({ title: { $regex: /JEE.*Entrance Exam Mentor/i } });

    if (job) {
      // Check if benefits exist
      if (!job.fullDescription.includes('What You’ll Get')) {
        // It's plain text likely
        let originalText = job.fullDescription.trim();
        // Format original text
        originalText = originalText
          .split(/\n\s*\n/)
          .map(p => `<p>${p.trim().replace(/\n/g, '<br/>')}</p>`)
          .join('\n');

        job.fullDescription = `${originalText}\n\n${getTierCBenefits(job.title)}`;
        await job.save();
        return NextResponse.json({ success: true, message: `Updated ${job.title}` });
      }
      return NextResponse.json({ success: true, message: `Already has benefits: ${job.title}` });
    }

    return NextResponse.json({ success: false, message: 'Job not found' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message });
  }
}
