'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, List, Calendar, LogOut, Plus, Sparkles, Command } from 'lucide-react'
import Image from 'next/image'
import { logout } from '@/app/actions'
import { useState, useEffect } from 'react'
import { DriveForm } from '@/components/DriveForm'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [showShortcut, setShowShortcut] = useState(false)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'n') {
        e.preventDefault()
        setIsModalOpen(true)
      }
      if (e.key === '?') {
        setShowShortcut((s) => !s)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const links = [
    { name: 'Overview', href: '/dashboard', icon: LayoutDashboard, hint: 'Home' },
    { name: 'All Drives', href: '/dashboard/list', icon: List, hint: 'Library' },
    { name: 'Calendar', href: '/dashboard/calendar', icon: Calendar, hint: 'Schedule' },
  ]

  const handleLogout = async () => {
    await logout()
    window.location.href = '/login'
  }

  return (
    <div className="flex h-screen" style={{ background: 'var(--background)' }}>
      {/* Sidebar - Figma layers panel feel */}
      <aside className="w-64 border-r flex-col hidden md:flex relative overflow-hidden"
        style={{ borderColor: 'var(--border)', background: 'linear-gradient(180deg, var(--accent) 0%, var(--paper) 30%)' }}>

        <div className="absolute inset-0 pointer-events-none opacity-30"
          style={{
            backgroundImage: 'radial-gradient(circle at 20% 0%, rgba(216,155,85,0.25), transparent 40%), radial-gradient(circle at 80% 100%, rgba(196,101,58,0.15), transparent 50%)'
          }} />

        <div className="h-16 flex items-center px-5 border-b relative z-10" style={{ borderColor: 'var(--border)' }}>
          <Link className="flex items-center gap-2.5" href="/">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center overflow-hidden fab-shadow">
              <Image src="/logo-premium.jpg" alt="Logo" width={32} height={32} className="object-cover w-full h-full" />
            </div>
            <div className="leading-tight">
              <div className="font-heading font-bold text-[15px] tracking-tight" style={{ color: 'var(--ink)' }}>CampusRadar</div>
              <div className="font-hand text-[14px]" style={{ color: 'var(--amber-warm)' }}>my tracker ✦</div>
            </div>
          </Link>
        </div>

        <nav className="flex-1 px-3 py-4 flex flex-col gap-1 relative z-10 overflow-y-auto custom-scrollbar">
          <div className="font-mono-ui text-[10px] uppercase tracking-widest px-3 py-2" style={{ color: 'var(--ink-soft)' }}>
            ⌘ Workspace
          </div>
          {links.map((link) => {
            const Icon = link.icon
            const isActive = pathname === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                className="group flex items-center gap-2.5 px-3 py-2.5 rounded-lg transition-all relative"
                style={{
                  background: isActive ? 'var(--primary)' : 'transparent',
                  color: isActive ? 'var(--primary-foreground)' : 'var(--ink-soft)',
                  boxShadow: isActive ? '0 1px 0 rgba(255,255,255,0.2) inset, 0 4px 12px -4px rgba(196,101,58,0.4)' : 'none'
                }}
              >
                <Icon className="w-4.5 h-4.5 shrink-0" />
                <span className="text-sm font-medium flex-1">{link.name}</span>
                <span className="font-mono-ui text-[10px] px-1.5 py-0.5 rounded"
                  style={{
                    background: isActive ? 'rgba(255,255,255,0.18)' : 'var(--secondary)',
                    color: isActive ? 'var(--primary-foreground)' : 'var(--ink-soft)'
                  }}>
                  {link.hint?.charAt(0)}
                </span>
              </Link>
            )
          })}

          <div className="mt-5 mb-2 font-mono-ui text-[10px] uppercase tracking-widest px-3 py-2 flex items-center justify-between"
            style={{ color: 'var(--ink-soft)' }}>
            <span>★ Quick Action</span>
            <Sparkles className="w-3 h-3" style={{ color: 'var(--amber-warm)' }} />
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="group mx-1 mb-1 flex items-center justify-between gap-2 px-3.5 py-3 rounded-xl font-medium hover:scale-[1.01] transition-all relative overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, var(--ink) 0%, #4a4137 100%)',
              color: 'var(--paper)',
              boxShadow: '0 4px 14px -4px rgba(45,42,36,0.4), inset 0 1px 0 rgba(255,255,255,0.1)'
            }}
          >
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-md flex items-center justify-center"
                style={{ background: 'var(--primary)' }}>
                <Plus className="w-4 h-4" />
              </div>
              <span className="text-sm">New Drive</span>
            </div>
            <div className="font-mono-ui text-[10px] px-1.5 py-1 rounded opacity-90"
              style={{ background: 'rgba(255,255,255,0.12)' }}>
              ⌘N
            </div>
          </button>

          <div className="mt-4 mx-2 p-3 rounded-xl relative sticky-note"
            style={{ background: 'var(--sticky-yellow)' }}>
            <div className="font-hand text-[19px] leading-[1.15] mb-1" style={{ color: 'var(--ink)' }}>
              Don't miss deadlines! 🗓
            </div>
            <div className="text-[11px] font-medium" style={{ color: 'var(--ink-soft)' }}>
              add drives as soon as you get the mail ♡
            </div>
          </div>
        </nav>

        <div className="p-3 border-t relative z-10" style={{ borderColor: 'var(--border)' }}>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2.5 px-3 py-2.5 w-full rounded-lg text-sm font-medium transition-colors group"
            style={{ color: 'var(--ink-soft)' }}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(193,122,138,0.15)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
          >
            <LogOut className="w-4.5 h-4.5 group-hover:text-rose-600 transition-colors" />
            <span>Sign out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        {/* Top bar - Figma toolbar feel */}
        <header className="hidden md:flex h-14 items-center justify-between px-5 sm:px-7 border-b sticky top-0 z-20 backdrop-blur-md"
          style={{
            borderColor: 'var(--border)',
            background: 'color-mix(in oklab, var(--paper) 85%, transparent)'
          }}>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full" style={{ background: '#ff6b6b' }} />
              <span className="w-3 h-3 rounded-full" style={{ background: '#ffd93d' }} />
              <span className="w-3 h-3 rounded-full" style={{ background: '#6bcb77' }} />
            </div>
            <div className="h-5 w-px mx-2" style={{ background: 'var(--border)' }} />
            <div className="font-mono-ui text-xs flex items-center gap-2" style={{ color: 'var(--ink-soft)' }}>
              <span>CampusRadar</span>
              <span>/</span>
              <span className="font-semibold" style={{ color: 'var(--ink)' }}>
                {links.find(l => l.href === pathname)?.name || 'Dashboard'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowShortcut(s => !s)}
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all hover:scale-[1.02]"
              style={{ background: 'var(--secondary)', color: 'var(--ink-soft)' }}>
              <Command className="w-3.5 h-3.5" />
              Shortcuts
              <span className="font-mono-ui px-1.5 py-0.5 rounded text-[10px]" style={{ background: 'var(--paper)' }}>?</span>
            </button>

            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all hover:scale-[1.02] fab-shadow"
              style={{ background: 'var(--primary)', color: 'var(--primary-foreground)' }}>
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Add Drive</span>
            </button>
          </div>
        </header>

        {/* Mobile header */}
        <header className="md:hidden h-14 flex items-center justify-between px-4 border-b bg-background/95 backdrop-blur-sm sticky top-0 z-20"
          style={{ borderColor: 'var(--border)' }}>
          <Link className="flex items-center gap-2" href="/">
            <div className="w-7 h-7 rounded-md flex items-center justify-center overflow-hidden fab-shadow">
              <Image src="/logo-premium.jpg" alt="Logo" width={28} height={28} className="object-cover w-full h-full" />
            </div>
            <span className="font-heading font-bold text-base">CampusRadar</span>
          </Link>
          <button onClick={() => setIsModalOpen(true)}
            className="p-2 rounded-xl fab-shadow"
            style={{ background: 'var(--primary)', color: 'var(--primary-foreground)' }}>
            <Plus className="w-4 h-4" />
          </button>
        </header>

        {/* Canvas area with subtle grid */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 pb-24 md:pb-8 relative custom-scrollbar"
          style={{
            backgroundImage: 'radial-gradient(circle, var(--border) 1px, transparent 1px)',
            backgroundSize: '28px 28px',
            backgroundAttachment: 'local'
          }}>
          {showShortcut && (
            <div className="fixed top-20 right-6 z-50 canvas-tip animate-in fade-in slide-in-from-right-4 duration-200"
              style={{ maxWidth: 260 }}>
              <div className="font-mono-ui text-[10px] uppercase opacity-70 mb-2 tracking-widest">⌨ shortcuts</div>
              <div className="space-y-1.5 text-[12px]">
                <div className="flex justify-between gap-6"><span>New Drive</span><span className="opacity-80">⌘ / Ctrl + N</span></div>
                <div className="flex justify-between gap-6"><span>Toggle Help</span><span className="opacity-80">?</span></div>
              </div>
            </div>
          )}
          {children}
        </div>

        {/* Mobile Bottom Nav */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 z-30 border-t backdrop-blur-xl px-2 py-2"
          style={{
            borderColor: 'var(--border)',
            background: 'color-mix(in oklab, var(--paper) 92%, transparent)'
          }}>
          <div className="grid grid-cols-3 gap-1.5">
            {links.map((link) => {
              const Icon = link.icon
              const isActive = pathname === link.href

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex flex-col items-center justify-center gap-1 rounded-xl px-2 py-2 text-[11px] font-medium transition-all"
                  style={{
                    background: isActive ? 'var(--primary)' : 'transparent',
                    color: isActive ? 'var(--primary-foreground)' : 'var(--ink-soft)'
                  }}
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
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4"
          style={{ background: 'color-mix(in oklab, var(--ink) 65%, transparent)', backdropFilter: 'blur(6px)' }}
          onClick={() => setIsModalOpen(false)}>
          <div className="w-full max-w-2xl max-h-[90vh] overflow-hidden animate-in fade-in zoom-in duration-200 relative"
            onClick={(e) => e.stopPropagation()}>
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full font-mono-ui text-[10px] tracking-wider uppercase z-10"
              style={{ background: 'var(--amber-warm)', color: 'var(--ink)' }}>
              ✦ New Placement Drive ✦
            </div>
            <DriveForm onClose={() => setIsModalOpen(false)} />
          </div>
        </div>
      )}
    </div>
  )
}
