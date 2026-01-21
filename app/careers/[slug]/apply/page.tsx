"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { jobs } from "@/data/mock-jobs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Loader2, Check } from "lucide-react";

export default function ApplyPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const router = useRouter();

  const job = jobs.find((j) => j.slug === slug);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!job) {
    if (slug) return <div className="min-h-screen flex items-center justify-center p-4 text-muted-foreground">Job not found</div>;
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsSubmitting(false);
    setIsSuccess(true);
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 animate-in fade-in duration-500">
        <div className="w-16 h-16 rounded-full bg-foreground text-background flex items-center justify-center mb-6">
          <Check className="w-8 h-8" />
        </div>
        <h2 className="text-3xl font-medium tracking-tight mb-2">Received.</h2>
        <p className="text-muted-foreground mb-8 text-center max-w-sm">
          We&apos;ve got your details. We&apos;ll be in touch soon regarding the <strong>{job.title}</strong> role.
        </p>
        <Button onClick={() => router.push('/careers')} variant="outline" className="rounded-full px-8">
          Back to Roles
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-black selection:text-white">
      <div className="max-w-[700px] mx-auto px-6 py-12 md:py-20">
        <Link href={`/careers/${job.slug}`} className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors mb-12">
          <ArrowLeft className="w-4 h-4 mr-2" /> Cancel Application
        </Link>

        <header className="mb-12">
          <h1 className="text-3xl md:text-4xl font-medium tracking-tight mb-2">Apply for {job.title}</h1>
          <p className="text-muted-foreground">Complete the form below. Keep it simple.</p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-12">
          <section className="space-y-6">
            <h3 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground border-b border-border pb-2">Basics</h3>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="name">Full Name</label>
                <Input id="name" required placeholder="Jane Doe" className="bg-transparent border-t-0 border-x-0 border-b border-border rounded-none px-0 focus-visible:ring-0 focus-visible:border-foreground transition-colors" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="email">Email</label>
                <Input id="email" type="email" required placeholder="jane@example.com" className="bg-transparent border-t-0 border-x-0 border-b border-border rounded-none px-0 focus-visible:ring-0 focus-visible:border-foreground transition-colors" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="phone">Phone</label>
              <Input id="phone" type="tel" placeholder="+1 (555) 000-0000" className="bg-transparent border-t-0 border-x-0 border-b border-border rounded-none px-0 focus-visible:ring-0 focus-visible:border-foreground transition-colors" />
            </div>
          </section>

          <section className="space-y-6">
            <h3 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground border-b border-border pb-2">Presence</h3>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="linkedin">LinkedIn</label>
                <Input id="linkedin" type="url" placeholder="linkedin.com/in/..." className="bg-transparent border-t-0 border-x-0 border-b border-border rounded-none px-0 focus-visible:ring-0 focus-visible:border-foreground transition-colors" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="portfolio">Portfolio / GitHub</label>
                <Input id="portfolio" type="url" placeholder="github.com/..." className="bg-transparent border-t-0 border-x-0 border-b border-border rounded-none px-0 focus-visible:ring-0 focus-visible:border-foreground transition-colors" />
              </div>
            </div>
          </section>

          <section className="space-y-6">
            <h3 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground border-b border-border pb-2">Story</h3>
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="why">Why REstart?</label>
              <textarea
                className="flex min-h-[150px] w-full bg-transparent border border-border rounded-md px-4 py-3 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-foreground disabled:cursor-not-allowed disabled:opacity-50 resize-y"
                placeholder="Tell us what drives you..."
                id="why"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="resume">Resume</label>
              <div className="border border-dashed border-border rounded-lg p-12 text-center hover:bg-secondary/20 transition-colors cursor-pointer group">
                <p className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">Upload resume (PDF)</p>
                <input type="file" id="resume" className="hidden" accept=".pdf" />
              </div>
            </div>
          </section>

          <div className="pt-4">
            <Button type="submit" size="lg" className="w-full h-12 rounded-full text-base" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...
                </>
              ) : (
                "Submit Application"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
