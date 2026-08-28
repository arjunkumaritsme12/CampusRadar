import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="px-6 lg:px-8 h-16 flex items-center border-b border-border/40 glass sticky top-0 z-50">
        <Link className="flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors" href="/">
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>
      </header>
      <main className="flex-1 container mx-auto px-6 py-12 max-w-3xl">
        <h1 className="text-4xl font-bold tracking-tight mb-4 font-heading text-foreground">Privacy Policy</h1>
        <p className="text-secondary-foreground mb-10 text-sm">Last updated: {new Date().toLocaleDateString()}</p>
        
        <div className="space-y-8 text-secondary-foreground/90 leading-relaxed">
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4 font-heading border-b border-border pb-2">1. Introduction</h2>
            <p>Welcome to Campus Radar. We respect your privacy and are committed to protecting your personal data. This Privacy Policy will inform you as to how we look after your personal data when you visit our website and tell you about your privacy rights.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4 font-heading border-b border-border pb-2">2. Information We Collect</h2>
            <p className="mb-2">When you use Campus Radar, we may collect the following types of information:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Authentication Data:</strong> When you log in using Google OAuth, we receive your basic profile information (such as your name and email address) necessary to create and manage your account.</li>
              <li><strong>Usage Data:</strong> Information about how you use our application, including the placement drives you choose to track and monitor.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4 font-heading border-b border-border pb-2">3. How We Use Your Information</h2>
            <p className="mb-2">We use your information to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Provide, operate, and maintain the Campus Radar service.</li>
              <li>Authenticate your access to the platform.</li>
              <li>Improve, personalize, and expand our application.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4 font-heading border-b border-border pb-2">4. Third-Party Services</h2>
            <p className="mb-2">We utilize the following third-party services that may process your data:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Google:</strong> Used exclusively for secure OAuth authentication.</li>
              <li><strong>Supabase:</strong> Our database and backend provider. Your data (such as user profile and placement drives) is securely stored in Supabase's managed infrastructure.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4 font-heading border-b border-border pb-2">5. Cookies and Local Storage</h2>
            <p>We use local storage (managed by Supabase authentication) to keep you logged in between sessions securely. We do not use intrusive third-party tracking cookies for advertising purposes.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4 font-heading border-b border-border pb-2">6. Data Security</h2>
            <p>We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used, or accessed in an unauthorized way. However, no internet transmission is completely secure, and we cannot guarantee absolute security.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4 font-heading border-b border-border pb-2">7. Children's Privacy</h2>
            <p>Our service does not address anyone under the age of 13. We do not knowingly collect personally identifiable information from anyone under the age of 13.</p>
          </section>
        </div>
      </main>
    </div>
  );
}
