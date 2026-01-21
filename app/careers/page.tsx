"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Search, Loader2 } from "lucide-react";
import RotatingEarth from "@/components/rotating-earth";

interface Job {
  _id: string;
  slug: string;
  title: string;
  shortDescription: string;
  category: string;
  tags: string[];
  location: string;
  type: string;
}

export default function CareersPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);

  // Fetch jobs from API
  useEffect(() => {
    async function fetchJobs() {
      try {
        setIsLoading(true);
        const res = await fetch('/api/jobs');
        if (!res.ok) throw new Error('Failed to fetch jobs');
        const data = await res.json();
        setJobs(data.jobs);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Something went wrong');
      } finally {
        setIsLoading(false);
      }
    }
    fetchJobs();
  }, []);

  const categories = Array.from(new Set(jobs.map((job) => job.category)));

  const toggleSkill = (skill: string) => {
    setSelectedSkills((prev) =>
      prev.includes(skill)
        ? prev.filter((s) => s !== skill)
        : [...prev, skill]
    );
  };

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.shortDescription.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory ? job.category === selectedCategory : true;
    const matchesSkills = selectedSkills.length > 0 ? selectedSkills.every((s) => job.tags.includes(s)) : true;

    return matchesSearch && matchesCategory && matchesSkills;
  });

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-foreground selection:text-background">

      {/* Fixed Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 h-16 flex items-center justify-between">
          <Link href="/careers" className="font-semibold text-lg tracking-tight">REstart</Link>
          <nav className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
            <a href="#about" className="hover:text-foreground transition-colors">About</a>
            <a href="#roles" className="hover:text-foreground transition-colors">Roles</a>
          </nav>
          <button
            onClick={() => document.getElementById('roles')?.scrollIntoView({ behavior: 'smooth' })}
            className="text-sm font-medium bg-primary text-primary-foreground px-4 py-2 rounded-full hover:opacity-90 transition-opacity"
          >
            Join Us
          </button>
        </div>
      </header>

      {/* 1. HERO SECTION - With Globe */}
      <section className="pt-32 pb-24 px-6 md:px-12 max-w-[1400px] mx-auto relative overflow-hidden">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          {/* Left - Text Content */}
          <div className="relative z-10">
            <p className="text-sm font-medium text-muted-foreground uppercase tracking-widest mb-6">
              Careers at REstart
            </p>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-medium tracking-tight leading-[1.05] mb-8">
              Building better beginnings.
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-xl mb-10">
              REstart is a student-led builder ecosystem. We ship real products,
              learn through execution, and work with real ownership.
              Ideas become practice here.
            </p>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => document.getElementById('roles')?.scrollIntoView({ behavior: 'smooth' })}
                className="group inline-flex items-center gap-3 bg-primary text-primary-foreground px-6 py-3 rounded-full font-medium hover:opacity-90 transition-all"
              >
                View open roles
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
              <a
                href="#about"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-border text-muted-foreground hover:text-foreground hover:border-foreground/50 transition-all"
              >
                Learn more
              </a>
            </div>
          </div>

          {/* Right - Globe Animation */}
          <div className="relative hidden lg:flex items-center justify-center">
            <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-background z-10 pointer-events-none" />
            <RotatingEarth width={500} height={500} className="" />
          </div>
        </div>
      </section>

      {/* 2. ABOUT SECTION - Refined Editorial */}
      <section id="about" className="py-32 px-6 md:px-12 border-t border-border/40">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24">
            {/* Left Column - Statement */}
            <div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-medium tracking-tight leading-tight mb-8">
                Real growth happens when you have skin in the game.
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                At REstart, we operate as a collective of designers, engineers,
                and operators who believe that the best way to learn is by doing real work.
              </p>
            </div>

            {/* Right Column - Details */}
            <div className="space-y-8 lg:pt-4">
              <div className="space-y-4">
                <h3 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">Ownership</h3>
                <p className="text-foreground/80 leading-relaxed">
                  We strip away the corporate structure and replace it with autonomy.
                  Every member owns their output, from the first line of code to
                  the final user interaction.
                </p>
              </div>
              <div className="space-y-4">
                <h3 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">Collaboration</h3>
                <p className="text-foreground/80 leading-relaxed">
                  Our culture is defined by cross-functional collaboration.
                  Validation comes from shipping to real users, not from slide decks.
                  We are quietly ambitious, letting our products do the talking.
                </p>
              </div>
              <div className="space-y-4">
                <h3 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">Growth</h3>
                <p className="text-foreground/80 leading-relaxed">
                  This isn&apos;t an internship; it&apos;s a partnership in building.
                  You&apos;ll learn more in weeks than most do in semesters.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. OPEN ROLES - Discovery */}
      <section id="roles" className="py-32 px-6 md:px-12 max-w-[1400px] mx-auto">
        <div className="mb-16">
          <h2 className="text-4xl md:text-5xl font-medium tracking-tight mb-4">Open Positions</h2>
          <p className="text-muted-foreground text-lg">Find your place in the collective.</p>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-6 md:items-center justify-between mb-12 pb-8 border-b border-border/50">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-4 py-2 rounded-full text-sm transition-all ${!selectedCategory ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground hover:text-foreground'}`}
            >
              All Roles
            </button>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(selectedCategory === cat ? null : cat)}
                className={`px-4 py-2 rounded-full text-sm transition-all ${selectedCategory === cat ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground hover:text-foreground'}`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-foreground transition-colors" />
            <input
              type="text"
              placeholder="Search roles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full md:w-[280px] bg-secondary/50 border border-transparent rounded-full py-2.5 pl-11 pr-4 text-sm focus:outline-none focus:border-border focus:bg-background transition-all"
            />
          </div>
        </div>

        {/* Skills Filter */}
        {selectedSkills.length > 0 && (
          <div className="mb-8 flex flex-wrap gap-2 items-center">
            <span className="text-sm text-muted-foreground mr-2">Filtering by:</span>
            {selectedSkills.map(skill => (
              <button key={skill} onClick={() => toggleSkill(skill)} className="text-xs bg-primary text-primary-foreground px-3 py-1.5 rounded-full hover:opacity-80 transition-opacity">
                {skill} ✕
              </button>
            ))}
            <button onClick={() => setSelectedSkills([])} className="text-xs text-muted-foreground hover:text-foreground underline underline-offset-4 ml-2">Clear all</button>
          </div>
        )}

        {/* Job List */}
        <div className="space-y-2">
          {isLoading ? (
            <div className="py-24 flex flex-col items-center justify-center gap-4">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <p className="text-muted-foreground">Loading positions...</p>
            </div>
          ) : error ? (
            <div className="py-24 text-center rounded-xl border border-dashed border-destructive/50">
              <p className="text-destructive text-lg">{error}</p>
              <button onClick={() => window.location.reload()} className="text-sm text-foreground underline underline-offset-4 mt-4 hover:opacity-70 transition-opacity">
                Try again
              </button>
            </div>
          ) : filteredJobs.length > 0 ? (
            filteredJobs.map((job) => (
              <Link key={job._id} href={`/careers/${job.slug}`} className="group block">
                <article className="grid md:grid-cols-12 gap-4 md:gap-6 p-6 rounded-xl hover:bg-secondary/50 transition-colors items-center">
                  <div className="md:col-span-4">
                    <h3 className="text-lg font-medium group-hover:text-foreground/70 transition-colors">{job.title}</h3>
                    <div className="text-xs text-muted-foreground mt-1.5 flex items-center gap-2">
                      <span>{job.location}</span>
                      <span className="w-1 h-1 rounded-full bg-border" />
                      <span>{job.type}</span>
                    </div>
                  </div>
                  <div className="md:col-span-5">
                    <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2 group-hover:text-foreground/70 transition-colors">
                      {job.shortDescription}
                    </p>
                  </div>
                  <div className="md:col-span-3 flex justify-start md:justify-end items-center gap-3">
                    <div className="flex gap-2 flex-wrap">
                      {job.tags.slice(0, 2).map(skill => (
                        <span key={skill} className="text-xs text-muted-foreground bg-secondary px-2.5 py-1 rounded-md">
                          {skill}
                        </span>
                      ))}
                    </div>
                    <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 shrink-0" />
                  </div>
                </article>
              </Link>
            ))
          ) : (
            <div className="py-24 text-center rounded-xl border border-dashed border-border">
              <p className="text-muted-foreground text-lg">No roles found matching your criteria.</p>
              <button onClick={() => { setSearchTerm(''); setSelectedCategory(null); setSelectedSkills([]); }} className="text-sm text-foreground underline underline-offset-4 mt-4 hover:opacity-70 transition-opacity">
                Clear filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-6 md:px-12 border-t border-border bg-secondary/20">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid md:grid-cols-3 gap-12 mb-16">
            <div>
              <h4 className="font-semibold text-lg tracking-tight mb-3">REstart</h4>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
                A builder collective shipping real products. Based in India, working globally.
              </p>
            </div>
            <div>
              <h5 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-4">Navigation</h5>
              <div className="flex flex-col gap-3 text-sm">
                <a href="#about" className="text-foreground/70 hover:text-foreground transition-colors">About</a>
                <a href="#roles" className="text-foreground/70 hover:text-foreground transition-colors">Open Roles</a>
              </div>
            </div>
            <div>
              <h5 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-4">Connect</h5>
              <div className="flex flex-col gap-3 text-sm">
                <a href="#" className="text-foreground/70 hover:text-foreground transition-colors">Twitter</a>
                <a href="#" className="text-foreground/70 hover:text-foreground transition-colors">LinkedIn</a>
                <a href="#" className="text-foreground/70 hover:text-foreground transition-colors">Instagram</a>
              </div>
            </div>
          </div>
          <div className="pt-8 border-t border-border/50 text-xs text-muted-foreground/60">
            © {new Date().getFullYear()} REstart. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
