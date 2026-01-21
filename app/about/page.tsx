
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-foreground selection:text-background flex flex-col">
      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-sm border-b border-border/50">
        <div className="max-w-[1000px] mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/careers" className="text-base text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" /> Back to All Roles
          </Link>
          <span className="font-semibold tracking-tight absolute left-1/2 -translate-x-1/2">
            <Image
              src="/REstart_logo.png"
              alt="REstart"
              width={140}
              height={40}
              priority
            />
          </span>
        </div>
      </nav>

      <main className="flex-1 pt-32 pb-24 px-6 md:px-12 max-w-[800px] mx-auto w-full">

        {/* Opening Section */}
        <section className="mb-24 pt-8 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-medium tracking-tight leading-[1.1] mb-12">
            There is no single right path.
          </h1>

          <div className="space-y-8 text-xl leading-relaxed text-muted-foreground font-light">
            <p>
              Society often tells students there is only one way to win: the best rank, the top college, the standard degree.
              But human potential is not linear.
            </p>
            <p>
              We believe every student’s journey is unique. Decisions shouldn't be driven just by marks or fear,
              but by interests, context, constraints, and intent.
            </p>
            <p className="text-foreground">
              REstart exists to help you discover the path that fits <em>you</em>.
            </p>
          </div>
        </section>

        <hr className="border-border/40 mb-24" />

        {/* What REstart Is */}
        <section className="mb-24 space-y-8">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-primary">The Platform</h2>
          <h3 className="text-3xl font-medium tracking-tight">Building better beginnings.</h3>
          <p className="text-lg leading-relaxed text-foreground/80 font-light">
            REstart is more than a tool; it is a student-led builder ecosystem. We are a collective dealing in
            clarity and agency. We build tools that empower students to make informed, independent decisions
            about their future, free from external noise.
          </p>
        </section>

        {/* How It Works */}
        <section className="mb-24 space-y-8">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-primary">How It Works</h2>
          <p className="text-lg leading-relaxed text-foreground/80 font-light">
            We simplify the complexity of college and career choices. You share your context: your interests,
            budget, preferences, scores, and long-term goals. We surface the pathways that align with who you are
            and where you want to go.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
            <div className="p-4 bg-secondary/20 rounded-lg text-center text-sm text-foreground/70">Interests</div>
            <div className="p-4 bg-secondary/20 rounded-lg text-center text-sm text-foreground/70">Budget</div>
            <div className="p-4 bg-secondary/20 rounded-lg text-center text-sm text-foreground/70">Preferences</div>
            <div className="p-4 bg-secondary/20 rounded-lg text-center text-sm text-foreground/70">Goals</div>
          </div>
        </section>

        {/* Impact */}
        <section className="mb-24 bg-primary/5 p-8 rounded-2xl border border-primary/10 text-center">
          <h3 className="text-4xl font-semibold mb-4 text-primary">1,000+</h3>
          <p className="text-lg text-muted-foreground max-w-sm mx-auto">
            Students have already used REstart to find clarity and move forward with confidence.
          </p>
        </section>

        {/* Closing & Contact */}
        <section className="space-y-12 text-center">
          <div className="space-y-4">
            <h2 className="text-2xl font-medium">Your journey is yours to define.</h2>
            <p className="text-muted-foreground">Start by making an informed choice.</p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link
              href="https://letsrestart.in"
              target="_blank"
              className="inline-flex items-center gap-2 bg-foreground text-background px-8 py-4 rounded-full font-medium hover:opacity-90 transition-opacity"
            >
              Visit letsrestart.in
            </Link>
            <a href="mailto:support@letsrestart.in" className="text-foreground/70 hover:text-foreground transition-colors border-b border-transparent hover:border-foreground pb-0.5">
              support@letsrestart.in
            </a>
          </div>
        </section>

      </main>

      <footer className="py-8 text-center text-sm text-muted-foreground border-t border-border/40">
        <div className="flex justify-center gap-6 mb-4">
          <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link>
          <Link href="/terms" className="hover:text-foreground transition-colors">Terms & Conditions</Link>
        </div>
        © {new Date().getFullYear()} REstart. All rights reserved.
      </footer>
    </div>
  );
}
