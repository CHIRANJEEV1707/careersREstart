
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function TermsPage() {
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
        <h1 className="text-3xl md:text-4xl font-medium tracking-tight mb-4">Terms & Conditions</h1>
        <p className="text-muted-foreground mb-12">Last Updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>

        <div className="space-y-12 text-lg leading-relaxed font-light text-foreground/90">

          <section>
            <h2 className="text-xl font-medium mb-4 text-foreground">1. Acceptance of Terms</h2>
            <p className="text-base text-muted-foreground">
              By accessing or using the REstart platform, you agree to be bound by these Terms & Conditions. If you do not agree with any part of these terms, you may not use our services.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-medium mb-4 text-foreground">2. Educational & Outcome Disclaimer</h2>
            <p className="text-base text-muted-foreground mb-4">
              REstart provides educational resources, mentorship, and project-based learning opportunities. However:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-base text-muted-foreground">
              <li><strong>No Guarantee of Outcomes:</strong> We do not guarantee admission to any specific university, job placement, or any specific career outcome.</li>
              <li><strong>User Responsibility:</strong> Success depends on your own effort, dedication, and execution. You are solely responsible for your decisions and results.</li>
              <li><strong>Mentorship Limitations:</strong> Mentors provide guidance based on their personal experience. This guidance should not be considered professional legal or financial advice.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-medium mb-4 text-foreground">3. User Conduct</h2>
            <p className="text-base text-muted-foreground">
              You agree to use the platform only for lawful purposes. You must not:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-base text-muted-foreground">
              <li>Harass, abuse, or harm another person or group.</li>
              <li>Provide false or misleading information in your applications.</li>
              <li>Violate the intellectual property rights of REstart or others.</li>
            </ul>
            <p className="mt-4 text-base text-muted-foreground">
              We reserve the right to suspend or terminate accounts that violate these rules.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-medium mb-4 text-foreground">4. Intellectual Property</h2>
            <p className="text-base text-muted-foreground">
              All content, trademarks, and data on this platform are key property of REstart, unless otherwise stated.
              You may not use our content for commercial purposes without prior written consent.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-medium mb-4 text-foreground">5. Payments & Refunds</h2>
            <p className="text-base text-muted-foreground">
              Some services may require payment. All fees and charges are clearly stated at the time of purchase.
              Refund policies, if applicable, will be provided at the point of transaction or in a separate Refund Policy document.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-medium mb-4 text-foreground">6. Limitation of Liability</h2>
            <p className="text-base text-muted-foreground">
              To the fullest extent permitted by law, REstart shall not be liable for any indirect, incidental, special, or consequential damages
              arising out of your use of the platform.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-medium mb-4 text-foreground">7. Changes to Service</h2>
            <p className="text-base text-muted-foreground">
              We reserve the right to modify or discontinue, temporarily or permanently, the service (or any part thereof) with or without notice.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-medium mb-4 text-foreground">8. Governing Law</h2>
            <p className="text-base text-muted-foreground">
              These Terms shall be governed by and construed in accordance with the laws of India.
              Any legal action or proceeding shall be brought exclusively in the courts of India.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-medium mb-4 text-foreground">9. Contact Us</h2>
            <p className="text-base text-muted-foreground">
              If you have any questions about these Terms, please contact us at <a href="mailto:support@letsrestart.in" className="text-foreground underline">support@letsrestart.in</a>.
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
