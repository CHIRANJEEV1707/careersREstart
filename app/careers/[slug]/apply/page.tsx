"use client";
export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Loader2, Check, AlertCircle } from "lucide-react";

interface Job {
  _id: string;
  title: string;
  slug: string;
}

interface FormData {
  name: string;
  email: string;
  phone: string;
  portfolioLink: string;
  resumeUrl: string;
  coverNote: string;
  weeklyAvailability: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  portfolioLink?: string;
  coverNote?: string;
  weeklyAvailability?: string;
  general?: string;
}

export default function ApplyPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const router = useRouter();

  const [job, setJob] = useState<Job | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    portfolioLink: "",
    resumeUrl: "",
    coverNote: "",
    weeklyAvailability: "",
  });

  // Fetch job data
  useEffect(() => {
    async function fetchJob() {
      try {
        const res = await fetch(`/api/jobs/${slug}`);
        if (res.ok) {
          const data = await res.json();
          setJob(data.job);
        }
      } catch (err) {
        console.error("Failed to fetch job:", err);
      } finally {
        setIsLoading(false);
      }
    }
    if (slug) fetchJob();
  }, [slug]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.portfolioLink.trim()) {
      newErrors.portfolioLink = "Portfolio link is required";
    }

    if (!formData.coverNote.trim()) {
      newErrors.coverNote = "Cover note is required";
    }

    if (!formData.weeklyAvailability.trim()) {
      newErrors.weeklyAvailability = "Weekly availability is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    setErrors({});

    try {
      const res = await fetch("/api/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          jobSlug: slug,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 409) {
          setErrors({ general: "You have already applied for this position" });
        } else if (data.errors) {
          setErrors(data.errors);
        } else {
          setErrors({ general: data.error || "Failed to submit application" });
        }
        return;
      }

      setIsSuccess(true);
    } catch (err) {
      console.error("Submission error:", err);
      setErrors({ general: "Something went wrong. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 text-muted-foreground">
        Job not found
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 animate-in fade-in duration-500">
        <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center mb-6">
          <Check className="w-8 h-8" />
        </div>
        <h2 className="text-3xl font-medium tracking-tight mb-2">Received.</h2>
        <p className="text-muted-foreground mb-8 text-center max-w-sm">
          We&apos;ve got your details. We&apos;ll be in touch soon regarding the <strong>{job.title}</strong> role.
        </p>
        <Button onClick={() => router.push("/careers")} variant="outline" className="rounded-full px-8">
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

        {errors.general && (
          <div className="mb-8 p-4 rounded-lg bg-destructive/10 border border-destructive/20 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
            <p className="text-sm text-destructive">{errors.general}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-12">
          <section className="space-y-6">
            <h3 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground border-b border-border pb-2">Basics</h3>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="name">Full Name *</label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Jane Doe"
                  className={`bg-transparent border-t-0 border-x-0 border-b rounded-none px-0 focus-visible:ring-0 focus-visible:border-foreground transition-colors ${errors.name ? 'border-destructive' : 'border-border'}`}
                />
                {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="email">Email *</label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="jane@example.com"
                  className={`bg-transparent border-t-0 border-x-0 border-b rounded-none px-0 focus-visible:ring-0 focus-visible:border-foreground transition-colors ${errors.email ? 'border-destructive' : 'border-border'}`}
                />
                {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="phone">Phone (Optional)</label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+1 (555) 000-0000"
                className="bg-transparent border-t-0 border-x-0 border-b border-border rounded-none px-0 focus-visible:ring-0 focus-visible:border-foreground transition-colors"
              />
            </div>
          </section>

          <section className="space-y-6">
            <h3 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground border-b border-border pb-2">Presence</h3>
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="portfolioLink">Portfolio / GitHub *</label>
              <Input
                id="portfolioLink"
                name="portfolioLink"
                type="url"
                value={formData.portfolioLink}
                onChange={handleChange}
                placeholder="https://github.com/..."
                className={`bg-transparent border-t-0 border-x-0 border-b rounded-none px-0 focus-visible:ring-0 focus-visible:border-foreground transition-colors ${errors.portfolioLink ? 'border-destructive' : 'border-border'}`}
              />
              {errors.portfolioLink && <p className="text-xs text-destructive">{errors.portfolioLink}</p>}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="resumeUrl">Resume URL (Optional)</label>
              <Input
                id="resumeUrl"
                name="resumeUrl"
                type="url"
                value={formData.resumeUrl}
                onChange={handleChange}
                placeholder="https://drive.google.com/..."
                className="bg-transparent border-t-0 border-x-0 border-b border-border rounded-none px-0 focus-visible:ring-0 focus-visible:border-foreground transition-colors"
              />
              <p className="text-xs text-muted-foreground">Link to your resume on Google Drive, Dropbox, etc.</p>
            </div>
          </section>

          <section className="space-y-6">
            <h3 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground border-b border-border pb-2">Details</h3>
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="coverNote">Why REstart? *</label>
              <textarea
                className={`flex min-h-[150px] w-full bg-transparent border rounded-md px-4 py-3 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-foreground disabled:cursor-not-allowed disabled:opacity-50 resize-y ${errors.coverNote ? 'border-destructive' : 'border-border'}`}
                placeholder="Tell us what drives you..."
                id="coverNote"
                name="coverNote"
                value={formData.coverNote}
                onChange={handleChange}
              />
              {errors.coverNote && <p className="text-xs text-destructive">{errors.coverNote}</p>}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="weeklyAvailability">Weekly Availability *</label>
              <select
                id="weeklyAvailability"
                name="weeklyAvailability"
                value={formData.weeklyAvailability}
                onChange={handleChange}
                className={`flex h-10 w-full bg-transparent border rounded-md px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-foreground disabled:cursor-not-allowed disabled:opacity-50 ${errors.weeklyAvailability ? 'border-destructive' : 'border-border'}`}
              >
                <option value="">Select your availability</option>
                <option value="5-10 hours">5-10 hours per week</option>
                <option value="10-20 hours">10-20 hours per week</option>
                <option value="20-30 hours">20-30 hours per week</option>
                <option value="30+ hours">30+ hours per week</option>
              </select>
              {errors.weeklyAvailability && <p className="text-xs text-destructive">{errors.weeklyAvailability}</p>}
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
