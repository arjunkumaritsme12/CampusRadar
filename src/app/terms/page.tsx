import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="px-6 lg:px-8 h-16 flex items-center border-b border-border/40 glass sticky top-0 z-50">
        <Link className="flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors" href="/">
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>
      </header>
      <main className="flex-1 container mx-auto px-6 py-12 max-w-3xl">
        <h1 className="text-4xl font-bold tracking-tight mb-4 font-heading text-foreground">Terms of Service</h1>
        <p className="text-secondary-foreground mb-10 text-sm">Last updated: {new Date().toLocaleDateString()}</p>
        
        <div className="space-y-8 text-secondary-foreground/90 leading-relaxed">
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4 font-heading border-b border-border pb-2">1. Acceptance of Terms</h2>
            <p>By accessing or using Campus Radar (also referred to as Placement Tracker), you agree to be bound by these Terms of Service. If you disagree with any part of the terms, then you may not access the service.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4 font-heading border-b border-border pb-2">2. Description of Service</h2>
            <p>Campus Radar is a platform designed to help students track upcoming placement drives, tests, registration deadlines, and interview schedules.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4 font-heading border-b border-border pb-2">3. User Accounts</h2>
            <p>To use certain features of the service, you must authenticate using Google OAuth. You are responsible for safeguarding the credentials you use to access the service and for any activities or actions under your account.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4 font-heading border-b border-border pb-2">4. Acceptable Use and Responsibilities</h2>
            <p className="mb-2">You agree not to use the service to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Upload or distribute any malicious code or data.</li>
              <li>Interfere with or disrupt the integrity or performance of the service.</li>
              <li>Attempt to gain unauthorized access to the service or its related systems.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4 font-heading border-b border-border pb-2">5. Third-Party Services</h2>
            <p>Our service relies on third-party services including Google (for authentication) and Supabase (for database and backend infrastructure). Your use of these integrated services may be subject to their respective terms and conditions.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4 font-heading border-b border-border pb-2">6. Intellectual Property</h2>
            <p>The service and its original content, features, and functionality are and will remain the exclusive property of Campus Radar and its licensors.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4 font-heading border-b border-border pb-2">7. Disclaimer of Warranties and Limitation of Liability</h2>
            <p>The service is provided on an "AS IS" and "AS AVAILABLE" basis. Campus Radar makes no warranties, expressed or implied, regarding the accuracy, reliability, or availability of the service. In no event shall Campus Radar be liable for any indirect, incidental, special, consequential, or punitive damages arising out of your use of the service.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4 font-heading border-b border-border pb-2">8. Changes to Terms</h2>
            <p>We reserve the right to modify or replace these Terms at any time. By continuing to access or use our service after those revisions become effective, you agree to be bound by the revised terms.</p>
          </section>
        </div>
      </main>
    </div>
  );
}
