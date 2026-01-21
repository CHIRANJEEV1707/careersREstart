export const dynamic = "force-dynamic";

import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft } from "lucide-react";
import ShareButton from "@/components/ShareButton";

interface Job {
  _id: string;
  title: string;
  slug: string;
  shortDescription: string;
  fullDescription: string;
  responsibilities: string[];
  requirements: string[];
  niceToHave: string[];
  category: string;
  tags: string[];
  location: string;
  type: string;
}

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

async function getJob(slug: string): Promise<Job | null> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

  try {
    const res = await fetch(`${baseUrl}/api/jobs/${slug}`, {
      cache: 'no-store',
    });

    if (!res.ok) {
      if (res.status === 404) notFound();
      return null;
    }

    const data = await res.json();
    const job = data.job;

    if (!job) notFound();

    return job;
  } catch (error) {
    if ((error as any)?.digest === 'NEXT_NOT_FOUND') throw error;
    console.error("Error fetching job:", error);
    return null;
  }
}

export default async function JobDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const job = await getJob(slug);

  if (!job) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background text-foreground animate-in fade-in duration-700 font-sans selection:bg-black selection:text-white">
      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-sm border-b border-border/50">
        <div className="max-w-[1000px] mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/careers" className="text-base text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" /> All Roles
          </Link>
          <span className="font-semibold tracking-tight">
            <Image
              src="/REstart_logo.png"
              alt="REstart"
              width={140}
              height={40}
              priority
            />
          </span>
          <Link href={`/careers/${job.slug}/apply`}>
            <Button className="rounded-full px-6">Apply</Button>
          </Link>
        </div>
      </nav>

      <main className="pt-32 pb-24 px-6 md:px-12 max-w-[1000px] mx-auto">
        {/* Header */}
        <header className="mb-16">
          <div className="flex flex-wrap gap-2 mb-6">
            <Badge variant="secondary" className="font-normal">{job.category}</Badge>
            <span className="text-sm text-muted-foreground self-center px-1">•</span>
            <span className="text-sm text-muted-foreground self-center">{job.type}</span>
            <span className="text-sm text-muted-foreground self-center px-1">•</span>
            <span className="text-sm text-muted-foreground self-center">{job.location}</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-medium tracking-tight mb-8 leading-tight">
            {job.title}
          </h1>

          <p className="text-xl md:text-2xl font-light text-muted-foreground leading-relaxed max-w-2xl">
            {job.shortDescription}
          </p>

          <div className="mt-8">
            <ShareButton title={job.title} slug={job.slug} />
          </div>
        </header>

        {/* Content - Editorial Layout */}
        <div className="grid md:grid-cols-12 gap-12">
          <div className="md:col-span-8 space-y-16">
            <section>
              <h2 className="text-sm font-semibold uppercase tracking-widest text-primary mb-6">About the Role</h2>
              <div
                className="text-lg leading-relaxed font-light text-foreground/90 [&_h3]:text-sm [&_h3]:font-semibold [&_h3]:uppercase [&_h3]:tracking-widest [&_h3]:text-primary [&_h3]:mt-8 [&_h3]:mb-6 [&_ul]:list-none [&_ul]:space-y-4 [&_li]:relative [&_li]:pl-6 [&_li:before]:content-[''] [&_li:before]:absolute [&_li:before]:left-0 [&_li:before]:top-3 [&_li:before]:w-1.5 [&_li:before]:h-1.5 [&_li:before]:rounded-full [&_li:before]:bg-border [&_p]:mb-4"
                dangerouslySetInnerHTML={{ __html: job.fullDescription }}
              />
            </section>

            <section>
              <h2 className="text-sm font-semibold uppercase tracking-widest text-primary mb-6">What you&apos;ll do</h2>
              <ul className="space-y-4">
                {job.responsibilities.map((item, i) => (
                  <li key={i} className="flex gap-4 items-baseline group">
                    <span className="text-muted-foreground/50 text-sm">0{i + 1}</span>
                    <span className="text-lg leading-relaxed font-light">{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="text-sm font-semibold uppercase tracking-widest text-primary mb-6">Requirements</h2>
              <ul className="space-y-4">
                {job.requirements.map((item, i) => (
                  <li key={i} className="flex gap-4 items-baseline">
                    <span className="w-1.5 h-1.5 rounded-full bg-border mt-2.5 shrink-0" />
                    <span className="text-lg leading-relaxed font-light text-foreground/90">{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            <div className="pt-12 border-t border-border">
              <h3 className="text-2xl font-medium mb-4">Ready to build?</h3>
              <Link href={`/careers/${job.slug}/apply`}>
                <Button size="lg" className="rounded-full px-8 text-base h-12">Apply for this role</Button>
              </Link>
            </div>
          </div>

          {/* Sidebar Info */}
          <div className="md:col-span-4 space-y-8 md:pt-2">
            <div className="bg-secondary/30 p-8 rounded-lg">
              <h3 className="font-medium mb-4">Skills</h3>
              <div className="flex flex-wrap gap-2">
                {job.tags.map(skill => (
                  <span key={skill} className="text-xs border border-border bg-background px-3 py-1.5 rounded-full text-muted-foreground">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-secondary/30 p-8 rounded-lg">
              <h3 className="font-medium mb-4">Our Process</h3>
              <ol className="space-y-4 text-sm text-muted-foreground relative border-l border-border ml-2 pl-6">
                <li className="relative">
                  <span className="absolute -left-[29px] top-1 w-3 h-3 rounded-full bg-border" />
                  Application Review
                </li>
                <li className="relative">
                  <span className="absolute -left-[29px] top-1 w-3 h-3 rounded-full bg-border" />
                  Work Trial / Task
                </li>
                <li className="relative">
                  <span className="absolute -left-[29px] top-1 w-3 h-3 rounded-full bg-border" />
                  Culture Fit Chat
                </li>
                <li className="relative">
                  <span className="absolute -left-[29px] top-1 w-3 h-3 rounded-full bg-primary" />
                  Offer
                </li>
              </ol>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
