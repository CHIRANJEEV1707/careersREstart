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
  // Personal
  name: string;
  email: string;
  phone: string;
  college: string;
  year: string;
  location: string;

  // Role Context
  availability: string;
  startTimeline: string;

  // Proof of Work
  portfolioLink: string;
  resumeUrl: string;
  experienceSummary: string;

  // Motivation
  motivation: string;
  problemInterest: string;

  // Education (Optional)
  examBackground: string;
  teachingExperience: string;

  // Logistics
  commitmentConfirmed: boolean;
  referralSource: string;
}

interface FormErrors {
  [key: string]: string | undefined;
}

const COUNTRY_CODES = [
  { code: "+91", country: "IN", placeholder: "98765 43210" },
  { code: "+1", country: "US/CA", placeholder: "(555) 000-0000" },
  { code: "+44", country: "UK", placeholder: "7700 900000" },
  { code: "+61", country: "AU", placeholder: "400 123 456" },
  { code: "+49", country: "DE", placeholder: "151 12345678" },
  { code: "+33", country: "FR", placeholder: "6 12 34 56 78" },
  { code: "+81", country: "JP", placeholder: "80 1234 5678" },
  { code: "+86", country: "CN", placeholder: "138 0000 0000" },
  { code: "+971", country: "AE", placeholder: "50 123 4567" },
];

export default function ApplyPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const router = useRouter();

  const [job, setJob] = useState<Job | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  // Form State
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    college: "",
    year: "",
    location: "",
    availability: "",
    startTimeline: "",
    portfolioLink: "",
    resumeUrl: "",
    experienceSummary: "",
    motivation: "",
    problemInterest: "",
    examBackground: "",
    teachingExperience: "",
    commitmentConfirmed: false,
    referralSource: "",
  });

  const [countryCode, setCountryCode] = useState("+91");
  const [localPhone, setLocalPhone] = useState("");

  // Derived state for phone placeholder
  const activePlaceholder = COUNTRY_CODES.find(c => c.code === countryCode)?.placeholder || "Phone Number";

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
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: undefined }));
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Allow only numeric and space/dash chars
    const cleaned = e.target.value.replace(/[^0-9\s-]/g, "");
    setLocalPhone(cleaned);
    if (errors.phone) setErrors(prev => ({ ...prev, phone: undefined }));
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // 1. Personal
    if (!formData.name.trim()) newErrors.name = "Full Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = "Invalid email format";

    if (!localPhone.trim()) newErrors.phone = "Phone number is required";
    else if (localPhone.length < 5) newErrors.phone = "Phone number seems too short";

    if (!formData.college.trim()) newErrors.college = "College/Org is required";
    if (!formData.year.trim()) newErrors.year = "Year is required";
    if (!formData.location.trim()) newErrors.location = "City/Location is required";

    // 2. Role Context
    if (!formData.availability) newErrors.availability = "Availability is required";
    if (!formData.startTimeline) newErrors.startTimeline = "Start timeline is required";

    // 3. Proof of Work
    if (!formData.portfolioLink.trim()) newErrors.portfolioLink = "Portfolio/GitHub link is required";
    if (!formData.experienceSummary.trim()) newErrors.experienceSummary = "Summary is required";
    else if (formData.experienceSummary.length < 50) newErrors.experienceSummary = "Please write at least 50 characters";

    // 4. Motivation
    if (!formData.motivation.trim()) newErrors.motivation = "Motivation is required";
    if (!formData.problemInterest.trim()) newErrors.problemInterest = "This answer is required";

    // 6. Logistics
    if (!formData.commitmentConfirmed) newErrors.commitmentConfirmed = "You must verify your commitment";

    setErrors(newErrors);

    // Scroll to first error
    if (Object.keys(newErrors).length > 0) {
      const firstError = Object.keys(newErrors)[0];
      const element = document.getElementById(firstError);
      element?.scrollIntoView({ behavior: "smooth", block: "center" });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setErrors({});

    try {
      const fullPhone = `${countryCode} ${localPhone}`;
      const res = await fetch("/api/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          phone: fullPhone,
          jobSlug: slug,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.errors) setErrors(data.errors);
        else setErrors({ general: data.error || "Submission failed" });
        return;
      }

      setIsSuccess(true);
      window.scrollTo(0, 0);
    } catch (err) {
      setErrors({ general: "Network error. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin" /></div>;
  if (!job) return <div className="min-h-screen flex items-center justify-center">Job not found</div>;

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 animate-in fade-in duration-500">
        <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center mb-6">
          <Check className="w-8 h-8" />
        </div>
        <h2 className="text-3xl font-medium tracking-tight mb-2">Received.</h2>
        <p className="text-muted-foreground mb-8 text-center max-w-sm">
          Thanks for applying to <strong>{job.title}</strong>. We'll review your proof of work and get back to you.
        </p>
        <Button onClick={() => router.push("/careers")} variant="outline" className="rounded-full px-8">
          Back to Roles
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-black selection:text-white pb-20">
      <div className="max-w-[800px] mx-auto px-6 py-12 md:py-20">
        <Link href={`/careers/${job.slug}`} className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors mb-8">
          <ArrowLeft className="w-4 h-4 mr-2" /> Cancel Application
        </Link>

        <header className="mb-12">
          <h1 className="text-3xl md:text-4xl font-medium tracking-tight mb-2">Apply for {job.title}</h1>
          <p className="text-muted-foreground">High signal only. Show us what you've built.</p>
        </header>

        {errors.general && (
          <div className="mb-8 p-4 rounded-lg bg-destructive/10 border border-destructive/20 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
            <p className="text-sm text-destructive">{errors.general}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-16">

          {/* 1. Personal Information */}
          <section className="space-y-6">
            <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60 border-b border-border pb-2">01 — Basics</h3>
            <div className="grid md:grid-cols-2 gap-x-8 gap-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="name">Full Name *</label>
                <Input id="name" name="name" value={formData.name} onChange={handleChange} placeholder="Jane Doe" className={errors.name ? "border-destructive" : ""} />
                {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="email">Email *</label>
                <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} placeholder="jane@example.com" className={errors.email ? "border-destructive" : ""} />
                {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium" htmlFor="phone">Phone / WhatsApp *</label>
                <div className={`flex border rounded-md overflow-hidden bg-background ${errors.phone ? "border-destructive" : "border-border"}`}>
                  <select
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value)}
                    className="bg-muted/30 text-sm border-r px-3 py-2 outline-none w-[120px] cursor-pointer"
                  >
                    {COUNTRY_CODES.map((c) => (
                      <option key={c.code} value={c.code}>{c.code} ({c.country})</option>
                    ))}
                  </select>
                  <input
                    id="phone"
                    type="tel"
                    value={localPhone}
                    onChange={handlePhoneChange}
                    placeholder={activePlaceholder}
                    className="flex-1 bg-transparent px-4 py-2 text-sm outline-none placeholder:text-muted-foreground/50"
                  />
                </div>
                {errors.phone && <p className="text-xs text-destructive">{errors.phone}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="college">College / Organization *</label>
                <Input id="college" name="college" value={formData.college} onChange={handleChange} placeholder="IIT Bombay / Google / Freelance" className={errors.college ? "border-destructive" : ""} />
                {errors.college && <p className="text-xs text-destructive">{errors.college}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="year">Year / Role *</label>
                <select id="year" name="year" value={formData.year} onChange={handleChange} className={`flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm ${errors.year ? "border-destructive" : "border-border"}`}>
                  <option value="">Select...</option>
                  <option value="1st Year">1st Year Student</option>
                  <option value="2nd Year">2nd Year Student</option>
                  <option value="3rd Year">3rd Year Student</option>
                  <option value="4th Year">4th Year Student</option>
                  <option value="Recent Grad">Recent Grad (2024/25)</option>
                  <option value="Working Prof">Working Professional</option>
                </select>
                {errors.year && <p className="text-xs text-destructive">{errors.year}</p>}
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium" htmlFor="location">Current City *</label>
                <Input id="location" name="location" value={formData.location} onChange={handleChange} placeholder="Bengaluru, India" className={errors.location ? "border-destructive" : ""} />
                {errors.location && <p className="text-xs text-destructive">{errors.location}</p>}
              </div>
            </div>
          </section>

          {/* 2. Role Context */}
          <section className="space-y-6">
            <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60 border-b border-border pb-2">02 — Logistics</h3>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="availability">Weekly Availability *</label>
                <select id="availability" name="availability" value={formData.availability} onChange={handleChange} className={`flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm ${errors.availability ? "border-destructive" : "border-border"}`}>
                  <option value="">Select...</option>
                  <option value="<5 hours">Less than 5 hours (Not recommended)</option>
                  <option value="5-10 hours">5-10 hours</option>
                  <option value="10-20 hours">10-20 hours (Part-time)</option>
                  <option value="20-30 hours">20-30 hours</option>
                  <option value="Full-time">Full-time</option>
                </select>
                {errors.availability && <p className="text-xs text-destructive">{errors.availability}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="startTimeline">When can you start? *</label>
                <select id="startTimeline" name="startTimeline" value={formData.startTimeline} onChange={handleChange} className={`flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm ${errors.startTimeline ? "border-destructive" : "border-border"}`}>
                  <option value="">Select...</option>
                  <option value="Immediately">Immediately</option>
                  <option value="Within 1 month">Within 1 month</option>
                  <option value="1-3 months">1-3 months</option>
                </select>
                {errors.startTimeline && <p className="text-xs text-destructive">{errors.startTimeline}</p>}
              </div>
            </div>
          </section>

          {/* 3. Proof of Work */}
          <section className="space-y-6">
            <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60 border-b border-border pb-2">03 — Proof of Work</h3>
            <p className="text-sm text-muted-foreground">Show us, don't just tell us. Links to real work matter most.</p>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="portfolioLink">Portfolio / GitHub / Drive Link *</label>
                <Input id="portfolioLink" name="portfolioLink" value={formData.portfolioLink} onChange={handleChange} placeholder="https://..." className={errors.portfolioLink ? "border-destructive" : ""} />
                {errors.portfolioLink && <p className="text-xs text-destructive">{errors.portfolioLink}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="resumeUrl">Resume Link (Optional)</label>
                <Input id="resumeUrl" name="resumeUrl" value={formData.resumeUrl} onChange={handleChange} placeholder="https://..." />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <label className="text-sm font-medium" htmlFor="experienceSummary">Relevant Experience Summary *</label>
                  <span className="text-xs text-muted-foreground">{formData.experienceSummary.length} chars</span>
                </div>
                <textarea
                  id="experienceSummary"
                  name="experienceSummary"
                  value={formData.experienceSummary}
                  onChange={handleChange}
                  placeholder="Tell us about the most relevant project you've built or worked on. What was your specific contribution? (Min 50 chars)"
                  className={`flex min-h-[120px] w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${errors.experienceSummary ? "border-destructive" : "border-border"}`}
                />
                {errors.experienceSummary && <p className="text-xs text-destructive">{errors.experienceSummary}</p>}
              </div>
            </div>
          </section>

          {/* 4. Motivation */}
          <section className="space-y-6">
            <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60 border-b border-border pb-2">04 — Motivation</h3>

            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <label className="text-sm font-medium" htmlFor="motivation">Why are you interested in this role? *</label>
                  <span className="text-xs text-muted-foreground">{formData.motivation.length} chars</span>
                </div>
                <textarea
                  id="motivation"
                  name="motivation"
                  value={formData.motivation}
                  onChange={handleChange}
                  placeholder="Be honest. No chatgpt please."
                  className={`flex min-h-[100px] w-full rounded-md border bg-background px-3 py-2 text-sm ${errors.motivation ? "border-destructive" : "border-border"}`}
                />
                {errors.motivation && <p className="text-xs text-destructive">{errors.motivation}</p>}
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <label className="text-sm font-medium" htmlFor="problemInterest">What kind of problems do you enjoy solving? *</label>
                  <span className="text-xs text-muted-foreground">{formData.problemInterest.length} chars</span>
                </div>
                <textarea
                  id="problemInterest"
                  name="problemInterest"
                  value={formData.problemInterest}
                  onChange={handleChange}
                  placeholder="Technical, design, or people problems? Give an example."
                  className={`flex min-h-[100px] w-full rounded-md border bg-background px-3 py-2 text-sm ${errors.problemInterest ? "border-destructive" : "border-border"}`}
                />
                {errors.problemInterest && <p className="text-xs text-destructive">{errors.problemInterest}</p>}
              </div>
            </div>
          </section>

          {/* 5. Education Specific */}
          <section className="space-y-6">
            <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60 border-b border-border pb-2">05 — Optional / Education</h3>
            <div className="grid md:grid-cols-1 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="examBackground">Exams Cleared / Ranks (If applying for Mentor roles)</label>
                <Input id="examBackground" name="examBackground" value={formData.examBackground} onChange={handleChange} placeholder="e.g. JEE Adv Rank 1234, BITSAT 350" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="teachingExperience">Prior Teaching/Mentoring Exp?</label>
                <Input id="teachingExperience" name="teachingExperience" value={formData.teachingExperience} onChange={handleChange} placeholder="e.g. Taught physics to juniors, or none." />
              </div>
            </div>
          </section>

          {/* 6. Consent */}
          <section className="space-y-6 pt-6 border-t border-border">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="commitmentConfirmed"
                  checked={formData.commitmentConfirmed}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, commitmentConfirmed: e.target.checked }));
                    if (e.target.checked) setErrors(prev => ({ ...prev, commitmentConfirmed: undefined }));
                  }}
                  className="mt-1 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <div className="space-y-1">
                  <label htmlFor="commitmentConfirmed" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    I can commit to the timeline selected above.
                  </label>
                  <p className="text-xs text-muted-foreground">REstart requires consistent effort. Please only apply if you have bandwidth.</p>
                  {errors.commitmentConfirmed && <p className="text-xs text-destructive mt-1">{errors.commitmentConfirmed}</p>}
                </div>
              </div>

              <div className="space-y-2 max-w-sm">
                <label className="text-sm font-medium" htmlFor="referralSource">How did you hear about us?</label>
                <select id="referralSource" name="referralSource" value={formData.referralSource} onChange={handleChange} className="flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm border-border">
                  <option value="">Select...</option>
                  <option value="LinkedIn">LinkedIn</option>
                  <option value="Twitter">Twitter</option>
                  <option value="Friend/Referral">Friend/Referral</option>
                  <option value="Campus">Campus Event</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
          </section>

          <div className="pt-6">
            <Button type="submit" size="lg" className="w-full h-14 text-lg rounded-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <> <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Submitting... </>
              ) : (
                "Submit Application"
              )}
            </Button>
            <p className="text-center text-xs text-muted-foreground mt-4">
              By submitting, you agree to our data processing for hiring purposes.
            </p>
          </div>

        </form>
      </div>
    </div>
  );
}
