'use client'

import { createClient } from '@/lib/supabase/client'
import { Briefcase } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

import { ThreeDHero } from '@/components/ThreeDHero'

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)

  const supabase = createClient()

  const handleGoogleLogin = async () => {
    setIsLoading(true)
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      },
    })

    if (error) {
      console.error(error)
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen bg-background">
      {/* Left side - 3D Element */}
      <div className="hidden lg:flex flex-1 relative bg-accent/20 items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/20 via-background/0 to-background/0"></div>
        <div className="absolute inset-0 z-0">
          <ThreeDHero />
        </div>
        <div className="glass p-12 rounded-3xl z-10 text-center max-w-lg border border-border/50 backdrop-blur-xl bg-background/30 shadow-2xl">
          <h2 className="text-3xl font-heading font-bold mb-4 drop-shadow-md">Your Career, Visualized</h2>
          <p className="text-secondary-foreground/90 font-medium">
            A premium, organized way to track your placement drives and never miss an opportunity again.
          </p>
        </div>
      </div>

      {/* Right side - Login Form */}
      <div className="flex-1 flex flex-col justify-center px-6 py-12 sm:px-12 lg:px-24">
        <div className="mx-auto w-full max-w-sm flex flex-col gap-8">
          <div className="flex flex-col gap-2 text-center lg:text-left">
            <Link href="/" className="flex items-center gap-2 justify-center lg:justify-start mb-6">
              <Briefcase className="h-8 w-8 text-primary" />
              <span className="font-heading font-bold text-2xl tracking-tight">Placement Tracker</span>
            </Link>
            <h1 className="text-3xl font-heading font-bold tracking-tight">Welcome back</h1>
            <p className="text-sm text-secondary-foreground/70">
              Sign in to your account to continue
            </p>
          </div>

          <button
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="flex items-center justify-center gap-3 w-full border border-border/60 hover:bg-accent hover:text-accent-foreground transition-colors px-6 py-4 rounded-xl font-medium text-foreground disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span className="w-5 h-5 border-2 border-foreground/30 border-t-foreground rounded-full animate-spin"></span>
            ) : (
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
                <path d="M1 1h22v22H1z" fill="none" />
              </svg>
            )}
            Sign in with Google
          </button>
        </div>
      </div>
    </div>
  )
}