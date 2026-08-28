import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-6 lg:px-8 h-16 flex items-center border-b border-border/40 glass sticky top-0 z-50">
        <Link className="flex items-center justify-center gap-2" href="/">
          <Image src="/logo-premium.jpg" alt="Campus Radar Logo" width={32} height={32} className="rounded-lg object-cover" />
          <span className="font-heading font-bold text-xl tracking-tight">Placement Tracker</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link className="text-sm font-medium hover:text-primary transition-colors flex items-center" href="/login">
            Login
          </Link>
          <Link className="text-sm font-medium bg-primary text-primary-foreground px-4 py-2 rounded-full hover:bg-primary/90 transition-colors flex items-center" href="/login">
            Get Started
          </Link>
        </nav>
      </header>
      
      <main className="flex-1 flex flex-col items-center justify-center p-6 text-center lg:p-12 relative overflow-hidden">
        {/* Placeholder for 3D Hero */}
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background"></div>
        
        <h1 className="text-5xl lg:text-7xl font-bold tracking-tighter mb-6">
          Never miss a <span className="text-primary">placement drive</span> again.
        </h1>
        <p className="text-lg text-secondary-foreground/70 max-w-2xl mb-10">
          A premium dashboard to track your upcoming tests, registration deadlines, and interview schedules. Keep all your placement data organized in one place.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <Link 
            href="/login" 
            className="flex items-center gap-2 bg-foreground text-background px-8 py-4 rounded-full font-medium text-lg hover:scale-105 transition-transform"
          >
            Start Tracking <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </main>

      <footer className="flex flex-col gap-4 sm:flex-row py-6 w-full shrink-0 items-center justify-between px-4 md:px-8 border-t border-border/40 bg-background/50 backdrop-blur-sm z-10 relative">
        <p className="text-xs text-secondary-foreground/60">
          © {new Date().getFullYear()} Campus Radar (Placement Tracker). All rights reserved.
        </p>
        <div className="flex gap-4 sm:gap-6">
          <Link className="text-xs hover:text-primary transition-colors text-secondary-foreground/80 hover:underline" href="/privacy">
            Privacy Policy
          </Link>
          <Link className="text-xs hover:text-primary transition-colors text-secondary-foreground/80 hover:underline" href="/terms">
            Terms of Service
          </Link>
        </div>
      </footer>
    </div>
  );
}
