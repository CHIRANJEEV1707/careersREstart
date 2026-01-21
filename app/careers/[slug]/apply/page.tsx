"use client";
export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Loader2, Check, AlertCircle, ChevronDown } from "lucide-react";
import { isValidPhoneNumber } from "libphonenumber-js";

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

    if (!localPhone.trim()) {
      newErrors.phone = "Phone number is required";
    } else {
      const fullPhone = `${countryCode}${localPhone}`;
      if (!isValidPhoneNumber(fullPhone)) {
        newErrors.phone = "Invalid phone number for selected country";
      }
    }

    if (!formData.college.trim()) newErrors.college = "College/Org is required";
    if (!formData.year.trim()) newErrors.year = "Year is required";
    if (!formData.location.trim()) newErrors.location = "City/Location is required";

    // 2. Role Context
    if (!formData.availability) newErrors.availability = "Availability is required";
    if (!formData.startTimeline) newErrors.startTimeline = "Start timeline is required";

    // 3. Proof of Work
    if (!formData.portfolioLink.trim()) newErrors.portfolioLink = "Portfolio/GitHub link is required";
    if (!formData.resumeUrl.trim()) newErrors.resumeUrl = "Resume link is required";

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

  if (isLoading) return <div className="min-h-screen bg-slate-50 flex items-center justify-center"><Loader2 className="animate-spin w-8 h-8 text-slate-400" /></div>;
  if (!job) return <div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-500">Job not found</div>;

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 animate-in fade-in duration-700">
        <div className="w-20 h-20 rounded-full bg-slate-50 text-slate-900 flex items-center justify-center mb-8">
          <Check className="w-8 h-8 opacity-90" />
        </div>
        <h2 className="text-4xl font-semibold tracking-tight mb-4 text-center">Received.</h2>
        <p className="text-slate-500 mb-10 text-center max-w-sm leading-relaxed">
          Thanks for applying to <strong>{job.title}</strong>.<br />We'll review your work and get back to you.
        </p>
        <Button onClick={() => router.push("/careers")} variant="outline" className="rounded-full px-8 h-12 border-slate-200 hover:bg-slate-50 hover:text-slate-900 transition-all">
          Back to Roles
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-slate-900 font-sans selection:bg-slate-200 selection:text-slate-900 pb-24">
      {/* Navbar Minimal */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 px-6 py-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <Link href={`/careers/${job.slug}`} className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" /> Cancel
          </Link>
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Application</span>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-6 py-12">
        <header className="mb-16 text-center">
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight mb-3 text-slate-900">Apply for {job.title}</h1>
          <p className="text-slate-500">High signal only. Show us what you've built.</p>
        </header>

        {errors.general && (
          <div className="mb-10 p-4 rounded-xl bg-red-50 border border-red-100 flex items-start gap-3 animate-in slide-in-from-top-2">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <p className="text-sm text-red-600 font-medium">{errors.general}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-12">

          {/* Section 1: Personal */}
          <section className="space-y-8">
            <div className="flex items-center gap-4 mb-2">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-white border border-slate-200 text-xs font-semibold text-slate-500 shadow-sm">01</span>
              <h3 className="text-lg font-medium text-slate-900">The Basics</h3>
            </div>

            <div className="grid md:grid-cols-2 gap-6 p-6 bg-white rounded-2xl border border-slate-100 shadow-sm">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700" htmlFor="name">Full Name *</label>
                <Input id="name" name="name" value={formData.name} onChange={handleChange} placeholder="e.g. Jane Doe" className={`bg-slate-50/50 border-slate-200 focus:bg-white transition-all h-11 ${errors.name ? "border-red-500 focus:ring-red-200 bg-red-50/30" : ""}`} />
                {errors.name && <p className="text-xs text-red-500 font-medium">{errors.name}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700" htmlFor="email">Email Address *</label>
                <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} placeholder="e.g. jane@work.com" className={`bg-slate-50/50 border-slate-200 focus:bg-white transition-all h-11 ${errors.email ? "border-red-500 focus:ring-red-200 bg-red-50/30" : ""}`} />
                {errors.email && <p className="text-xs text-red-500 font-medium">{errors.email}</p>}
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium text-slate-700" htmlFor="phone">Phone Number *</label>
                <div className={`flex items-center border rounded-lg overflow-hidden bg-slate-50/50 transition-all focus-within:bg-white focus-within:ring-2 focus-within:ring-slate-900/10 focus-within:border-slate-400 ${errors.phone ? "border-red-500 ring-red-200 bg-red-50/30" : "border-slate-200"}`}>
                  <div className="relative">
                    <select
                      value={countryCode}
                      onChange={(e) => setCountryCode(e.target.value)}
                      className="appearance-none bg-transparent text-sm font-medium pl-4 pr-8 py-3 outline-none cursor-pointer w-[90px] text-slate-700 hover:text-slate-900"
                    >
                      {COUNTRY_CODES.map((c) => (
                        <option key={c.code} value={c.code}>{c.code} {c.country}</option>
                      ))}
                    </select>
                    <ChevronDown className="w-3 h-3 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                  <div className="w-[1px] h-6 bg-slate-200 mx-1"></div>
                  <input
                    id="phone"
                    type="tel"
                    value={localPhone}
                    onChange={handlePhoneChange}
                    placeholder={activePlaceholder}
                    className="flex-1 bg-transparent px-4 py-3 text-sm outline-none placeholder:text-slate-400 text-slate-900 font-medium"
                  />
                </div>
                {errors.phone && <p className="text-xs text-red-500 mt-1.5 font-medium">{errors.phone}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700" htmlFor="college">Current Org / College *</label>
                <Input id="college" name="college" value={formData.college} onChange={handleChange} placeholder="e.g. Google / IIT Bombay" className={`bg-slate-50/50 border-slate-200 focus:bg-white transition-all h-11 ${errors.college ? "border-red-500 focus:ring-red-200 bg-red-50/30" : ""}`} />
                {errors.college && <p className="text-xs text-red-500 font-medium">{errors.college}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700" htmlFor="year">Year / Role *</label>
                <div className="relative">
                  <select id="year" name="year" value={formData.year} onChange={handleChange} className={`appearance-none flex h-11 w-full rounded-md border bg-slate-50/50 px-3 py-2 text-sm text-slate-700 transition-all focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 cursor-pointer hover:bg-slate-100/50 ${errors.year ? "border-red-500 focus:ring-red-200 bg-red-50/30" : "border-slate-200"}`}>
                    <option value="">Select...</option>
                    <option value="1st Year">1st Year Student</option>
                    <option value="2nd Year">2nd Year Student</option>
                    <option value="3rd Year">3rd Year Student</option>
                    <option value="4th Year">4th Year Student</option>
                    <option value="Recent Grad">Recent Grad (2024/25)</option>
                    <option value="Working Prof">Working Professional</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
                {errors.year && <p className="text-xs text-red-500 font-medium">{errors.year}</p>}
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium text-slate-700" htmlFor="location">Current Location *</label>
                <Input id="location" name="location" value={formData.location} onChange={handleChange} placeholder="e.g. Bengaluru, India" className={`bg-slate-50/50 border-slate-200 focus:bg-white transition-all h-11 ${errors.location ? "border-red-500 focus:ring-red-200 bg-red-50/30" : ""}`} />
                {errors.location && <p className="text-xs text-red-500 font-medium">{errors.location}</p>}
              </div>
            </div>
          </section>

          {/* Section 2: Logistics */}
          <section className="space-y-8">
            <div className="flex items-center gap-4 mb-2">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-white border border-slate-200 text-xs font-semibold text-slate-500 shadow-sm">02</span>
              <h3 className="text-lg font-medium text-slate-900">Logistics</h3>
            </div>

            <div className="grid md:grid-cols-2 gap-6 p-6 bg-white rounded-2xl border border-slate-100 shadow-sm">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700" htmlFor="availability">Weekly Availability *</label>
                <div className="relative">
                  <select id="availability" name="availability" value={formData.availability} onChange={handleChange} className={`appearance-none flex h-11 w-full rounded-md border bg-slate-50/50 px-3 py-2 text-sm text-slate-700 transition-all focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 cursor-pointer hover:bg-slate-100/50 ${errors.availability ? "border-red-500 focus:ring-red-200 bg-red-50/30" : "border-slate-200"}`}>
                    <option value="">Select...</option>
                    <option value="<5 hours">Less than 5 hours</option>
                    <option value="5-10 hours">5-10 hours</option>
                    <option value="10-20 hours">10-20 hours (Part-time)</option>
                    <option value="20-30 hours">20-30 hours</option>
                    <option value="Full-time">Full-time</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
                {errors.availability && <p className="text-xs text-red-500 font-medium">{errors.availability}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700" htmlFor="startTimeline">Start Timeline *</label>
                <div className="relative">
                  <select id="startTimeline" name="startTimeline" value={formData.startTimeline} onChange={handleChange} className={`appearance-none flex h-11 w-full rounded-md border bg-slate-50/50 px-3 py-2 text-sm text-slate-700 transition-all focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 cursor-pointer hover:bg-slate-100/50 ${errors.startTimeline ? "border-red-500 focus:ring-red-200 bg-red-50/30" : "border-slate-200"}`}>
                    <option value="">Select...</option>
                    <option value="Immediately">Immediately</option>
                    <option value="Within 1 month">Within 1 month</option>
                    <option value="1-3 months">1-3 months</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
                {errors.startTimeline && <p className="text-xs text-red-500 font-medium">{errors.startTimeline}</p>}
              </div>
            </div>
          </section>

          {/* Section 3: Proof */}
          <section className="space-y-8">
            <div className="flex items-center gap-4 mb-2">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-white border border-slate-200 text-xs font-semibold text-slate-500 shadow-sm">03</span>
              <h3 className="text-lg font-medium text-slate-900">Proof of Work</h3>
            </div>

            <div className="space-y-6 p-6 bg-white rounded-2xl border border-slate-100 shadow-sm">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700" htmlFor="portfolioLink">Portfolio / GitHub / Drive Link *</label>
                <Input id="portfolioLink" name="portfolioLink" value={formData.portfolioLink} onChange={handleChange} placeholder="https://..." className={`bg-slate-50/50 border-slate-200 focus:bg-white transition-all h-11 ${errors.portfolioLink ? "border-red-500 focus:ring-red-200 bg-red-50/30" : ""}`} />
                {errors.portfolioLink && <p className="text-xs text-red-500 font-medium">{errors.portfolioLink}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700" htmlFor="resumeUrl">Resume Link *</label>
                <Input id="resumeUrl" name="resumeUrl" value={formData.resumeUrl} onChange={handleChange} placeholder="https://..." className={`bg-slate-50/50 border-slate-200 focus:bg-white transition-all h-11 ${errors.resumeUrl ? "border-red-500 focus:ring-red-200 bg-red-50/30" : ""}`} />
                {errors.resumeUrl && <p className="text-xs text-red-500 font-medium">{errors.resumeUrl}</p>}
              </div>

              <div className="space-y-2 pt-2">
                <div className="flex justify-between items-end">
                  <label className="text-sm font-medium text-slate-700" htmlFor="experienceSummary">Relevant Experience *</label>
                  <span className={`text-[10px] uppercase font-semibold tracking-wider ${formData.experienceSummary.length > 50 ? "text-green-600" : "text-slate-400"}`}>{formData.experienceSummary.length} chars</span>
                </div>
                <textarea
                  id="experienceSummary"
                  name="experienceSummary"
                  value={formData.experienceSummary}
                  onChange={handleChange}
                  placeholder="Tell us about the most relevant project you've built. Be specific about your contribution."
                  className={`flex min-h-[140px] w-full rounded-xl border bg-slate-50/50 px-4 py-3 text-sm placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 transition-all ${errors.experienceSummary ? "border-red-500 ring-red-200 focus:ring-red-200 bg-red-50/30" : "border-slate-200"}`}
                />
                {errors.experienceSummary && <p className="text-xs text-red-500 font-medium">{errors.experienceSummary}</p>}
              </div>
            </div>
          </section>

          {/* Section 4: Motivation */}
          <section className="space-y-8">
            <div className="flex items-center gap-4 mb-2">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-white border border-slate-200 text-xs font-semibold text-slate-500 shadow-sm">04</span>
              <h3 className="text-lg font-medium text-slate-900">Motivation</h3>
            </div>

            <div className="space-y-6 p-6 bg-white rounded-2xl border border-slate-100 shadow-sm">
              <div className="space-y-2">
                <div className="flex justify-between items-end">
                  <label className="text-sm font-medium text-slate-700" htmlFor="motivation">Why are you interested in this role? *</label>
                  <span className="text-[10px] font-semibold text-slate-400">{formData.motivation.length} chars</span>
                </div>
                <textarea
                  id="motivation"
                  name="motivation"
                  value={formData.motivation}
                  onChange={handleChange}
                  placeholder="What drives you? Why REstart?"
                  className={`flex min-h-[120px] w-full rounded-xl border bg-slate-50/50 px-4 py-3 text-sm placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 transition-all ${errors.motivation ? "border-red-500 ring-red-200 bg-red-50/30" : "border-slate-200"}`}
                />
                {errors.motivation && <p className="text-xs text-red-500 font-medium">{errors.motivation}</p>}
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-end">
                  <label className="text-sm font-medium text-slate-700" htmlFor="problemInterest">What kind of problems do you enjoy solving? *</label>
                  <span className="text-[10px] font-semibold text-slate-400">{formData.problemInterest.length} chars</span>
                </div>
                <textarea
                  id="problemInterest"
                  name="problemInterest"
                  value={formData.problemInterest}
                  onChange={handleChange}
                  placeholder="Give us an example of a hard problem you cracked."
                  className={`flex min-h-[120px] w-full rounded-xl border bg-slate-50/50 px-4 py-3 text-sm placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 transition-all ${errors.problemInterest ? "border-red-500 ring-red-200 bg-red-50/30" : "border-slate-200"}`}
                />
                {errors.problemInterest && <p className="text-xs text-red-500 font-medium">{errors.problemInterest}</p>}
              </div>
            </div>
          </section>

          {/* Section 5: Optional */}
          <section className="space-y-8">
            <div className="flex items-center gap-4 mb-2">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-white border border-slate-200 text-xs font-semibold text-slate-500 shadow-sm">05</span>
              <h3 className="text-lg font-medium text-slate-900">Optional</h3>
            </div>

            <div className="grid md:grid-cols-1 gap-6 p-6 bg-white rounded-2xl border border-slate-100 shadow-sm">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700" htmlFor="examBackground">Exams Cleared / Ranks <span className="text-slate-400 font-normal">(For Mentors)</span></label>
                <Input id="examBackground" name="examBackground" value={formData.examBackground} onChange={handleChange} placeholder="e.g. JEE Adv Rank 1234, BITSAT 350" className={`bg-slate-50/50 border-slate-200 focus:bg-white transition-all h-11`} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700" htmlFor="teachingExperience">Prior Teaching Experience?</label>
                <Input id="teachingExperience" name="teachingExperience" value={formData.teachingExperience} onChange={handleChange} placeholder="e.g. Taught physics to juniors" className={`bg-slate-50/50 border-slate-200 focus:bg-white transition-all h-11`} />
              </div>
            </div>
          </section>

          {/* Section 6: Consent */}
          <section className="space-y-8 pt-8">
            <div className="p-6 bg-slate-50/50 rounded-2xl border border-slate-100 space-y-6">
              <div className="flex items-start gap-4">
                <input
                  type="checkbox"
                  id="commitmentConfirmed"
                  checked={formData.commitmentConfirmed}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, commitmentConfirmed: e.target.checked }));
                    if (e.target.checked) setErrors(prev => ({ ...prev, commitmentConfirmed: undefined }));
                  }}
                  className="mt-1 h-5 w-5 rounded border-slate-300 text-slate-900 focus:ring-slate-900 cursor-pointer"
                />
                <div className="space-y-1">
                  <label htmlFor="commitmentConfirmed" className="text-sm font-medium text-slate-900 cursor-pointer select-none">
                    I confirm that I can commit to the timeline selected above.
                  </label>
                  <p className="text-xs text-slate-500 leading-relaxed">REstart is a high-performance environment. Please only apply if you have the bandwidth to deliver consistent work.</p>
                  {errors.commitmentConfirmed && <p className="text-xs text-red-500 mt-2 font-medium">{errors.commitmentConfirmed}</p>}
                </div>
              </div>

              <div className="pl-9 space-y-2 max-w-sm">
                <label className="text-sm font-medium text-slate-700" htmlFor="referralSource">How did you hear about us?</label>
                <div className="relative">
                  <select id="referralSource" name="referralSource" value={formData.referralSource} onChange={handleChange} className="appearance-none flex h-10 w-full rounded-md border bg-white px-3 py-2 text-sm text-slate-700 border-slate-200 focus:border-slate-400 focus:outline-none cursor-pointer">
                    <option value="">Select...</option>
                    <option value="LinkedIn">LinkedIn</option>
                    <option value="Twitter">Twitter</option>
                    <option value="Friend/Referral">Friend/Referral</option>
                    <option value="Campus">Campus Event</option>
                    <option value="Other">Other</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            </div>
          </section>

          <div className="pt-8 pb-20">
            <Button
              type="submit"
              size="lg"
              className="w-full h-14 text-base font-semibold rounded-xl bg-slate-900 hover:bg-slate-800 text-white shadow-lg shadow-slate-900/10 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-70 disabled:hover:scale-100"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <> <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Submitting Application... </>
              ) : (
                "Submit Application"
              )}
            </Button>
            <p className="text-center text-xs text-slate-400 mt-6">
              By submitting, you agree to our privacy policy and data processing for hiring.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
