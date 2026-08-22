'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Briefcase, LayoutDashboard, List, Calendar, LogOut, Plus } from 'lucide-react'
import { logout } from '@/app/actions'
import { useState } from 'react'
import { DriveForm } from '@/components/DriveForm'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [isModalOpen, setIsModalOpen] = useState(false)

  const links = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'All Drives', href: '/dashboard/list', icon: List },
    { name: 'Calendar', href: '/dashboard/calendar', icon: Calendar },
  ]

  const handleLogout = async () => {
    await logout()
    window.location.href = '/login'
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border bg-accent/20 flex-col hidden md:flex">
        <div className="h-16 flex items-center px-6 border-b border-border">
          <Link className="flex items-center gap-2" href="/">
            <Briefcase className="h-6 w-6 text-primary" />
            <span className="font-heading font-bold text-xl tracking-tight">Tracker</span>
          </Link>
        </div>

        <nav className="flex-1 px-4 py-6 flex flex-col gap-2">
          {links.map((link) => {
            const Icon = link.icon
            const isActive = pathname === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  isActive 
                    ? 'bg-primary text-primary-foreground font-medium shadow-md shadow-primary/20' 
                    : 'text-secondary-foreground hover:bg-accent'
                }`}
              >
                <Icon className="w-5 h-5" />
                {link.name}
              </Link>
            )
          })}
          
          <button 
            onClick={() => setIsModalOpen(true)}
            className="mt-6 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-foreground text-background font-medium hover:scale-[1.02] transition-transform"
          >
            <Plus className="w-5 h-5" />
            New Drive
          </button>
        </nav>

        <div className="p-4 border-t border-border">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-secondary-foreground hover:bg-red-500/10 hover:text-red-500 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        <header className="md:hidden h-16 flex items-center justify-between px-4 sm:px-6 border-b border-border bg-background/95 backdrop-blur-sm sticky top-0 z-20">
          <Link className="flex items-center gap-2" href="/">
            <Briefcase className="h-6 w-6 text-primary" />
            <span className="font-heading font-bold text-xl">Tracker</span>
          </Link>
          <button onClick={() => setIsModalOpen(true)} className="p-2.5 bg-primary text-primary-foreground rounded-xl shadow-sm">
            <Plus className="w-5 h-5" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-4 sm:p-5 md:p-8 pb-24 md:pb-8">
          {children}
        </div>

        <nav className="md:hidden fixed bottom-0 left-0 right-0 z-30 border-t border-border bg-background/95 backdrop-blur-md px-2 py-2">
          <div className="grid grid-cols-3 gap-2">
            {links.map((link) => {
              const Icon = link.icon
              const isActive = pathname === link.href

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex flex-col items-center justify-center gap-1 rounded-xl px-2 py-2 text-[11px] font-medium ${
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-secondary-foreground hover:bg-accent'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{link.name}</span>
                </Link>
              )
            })}
          </div>
        </nav>
      </main>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-background/80 backdrop-blur-sm">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-hidden animate-in fade-in zoom-in duration-200">
            <DriveForm onClose={() => setIsModalOpen(false)} />
          </div>
        </div>
      )}
    </div>
  )
}
