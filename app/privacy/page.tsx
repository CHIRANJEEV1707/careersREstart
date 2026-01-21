
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-foreground selection:text-background flex flex-col">
      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-sm border-b border-border/50">
        <div className="max-w-[1000px] mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/careers" className="text-base text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" /> Back to Home
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
        </div>
      </nav>

      <main className="flex-1 pt-32 pb-24 px-6 md:px-12 max-w-[800px] mx-auto w-full">
        <h1 className="text-3xl md:text-4xl font-medium tracking-tight mb-4">Privacy Policy</h1>
        <p className="text-muted-foreground mb-12">Last Updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>

        <div className="space-y-12 text-lg leading-relaxed font-light text-foreground/90">

          <section>
            <h2 className="text-xl font-medium mb-4 text-foreground">1. Information We Collect</h2>
            <p className="mb-4">
              We collect information that you provide securely when you use our platform, including specifically:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-base text-muted-foreground">
              <li><strong>Personal Information:</strong> Name, email address, phone number, college/university name, and location.</li>
              <li><strong>Application Data:</strong> Portfolio links, resumes, and answers to application questions.</li>
              <li><strong>Usage Data:</strong> Analytics on how you interact with our website to improve user experience.</li>
              <li><strong>Payment Information:</strong> If applicable, we process transaction metadata through secure providers (e.g., Razorpay). We do not store raw credit card details.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-medium mb-4 text-foreground">2. How We Use Your Data</h2>
            <p className="mb-4">We use your data for the following legitimate business purposes:</p>
            <ul className="list-disc pl-5 space-y-2 text-base text-muted-foreground">
              <li>To provided platform functionality and process your applications.</li>
              <li>To communicate with you regarding updates, offers, and notifications.</li>
              <li>To improve our services and platform performance.</li>
              <li>To comply with legal obligations and enforce our terms.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-medium mb-4 text-foreground">3. Data Protection & Access</h2>
            <p className="text-base text-muted-foreground">
              We implement industry-standard security measures to protect your data. Access to your personal information is restricted to authorized internal personnel only.
              <strong> We do not sell your personal data to third parties.</strong>
            </p>
          </section>

          <section>
            <h2 className="text-xl font-medium mb-4 text-foreground">4. Cookies & Analytics</h2>
            <p className="text-base text-muted-foreground">
              We may use cookies and similar tracking technologies to track the activity on our Service and store certain information.
              This helps us analyze web traffic and improve your experience. You can instruct your browser to refuse all cookies.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-medium mb-4 text-foreground">5. Data Retention</h2>
            <p className="text-base text-muted-foreground">
              We retain your personal data only for as long as is necessary for the purposes set out in this Privacy Policy,
              or as required by law.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-medium mb-4 text-foreground">6. Your Rights</h2>
            <p className="mb-4 text-base text-muted-foreground">You have the right to:</p>
            <ul className="list-disc pl-5 space-y-2 text-base text-muted-foreground">
              <li>Request access to the personal data we hold about you.</li>
              <li>Request correction or deletion of your personal data.</li>
              <li>Opt-out of marketing communications.</li>
            </ul>
            <p className="mt-4 text-base text-muted-foreground">
              To exercise these rights, please contact us at <a href="mailto:support@letsrestart.in" className="text-foreground underline">support@letsrestart.in</a>.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-medium mb-4 text-foreground">7. Jurisdiction</h2>
            <p className="text-base text-muted-foreground">
              This Privacy Policy is governed by the laws of India. Any disputes arising under this policy shall be subject to the exclusive jurisdiction of the courts in India.
            </p>
          </section>

        </div>
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
