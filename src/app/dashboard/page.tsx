import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Calendar, Building, TrendingUp, AlertCircle, ArrowRight, BookmarkCheck } from 'lucide-react'
import Link from 'next/link'
import { TiltCard } from '@/components/TiltCard'

const STICKY_COLORS = [
  { bg: 'var(--sticky-yellow)', rot: '-1.2deg' },
  { bg: 'var(--sticky-pink)', rot: '0.8deg' },
  { bg: 'var(--sticky-green)', rot: '-0.5deg' },
  { bg: 'var(--sticky-blue)', rot: '1.1deg' },
]

function StatCard({
  title, value, icon, bgColor,
  subText, handLabel, rotate = '-0.4deg'
}: {
  title: string; value: string; icon: React.ReactNode;
  bgColor: string; subText?: string; handLabel?: string; rotate?: string;
}) {
  return (
    <div className="sticky-note hover-lift p-4 sm:p-5 rounded-lg relative"
      style={{ background: bgColor, transform: `rotate(${rotate})` }}>
      {handLabel && (
        <div className="font-hand text-[22px] absolute -top-2.5 left-5 z-10"
          style={{ color: 'var(--terracotta)', transform: 'rotate(-3deg)' }}>
          {handLabel}
        </div>
      )}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <div className="text-xs sm:text-sm font-medium mb-1"
            style={{ color: 'var(--ink-soft)' }}>
            {title}
          </div>
          <div className="text-3xl sm:text-4xl font-heading font-extrabold leading-none tracking-tight"
            style={{ color: 'var(--ink)' }}>
            {value}
          </div>
        </div>
        <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: 'rgba(255,255,255,0.7)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.8), 0 2px 4px rgba(0,0,0,0.05)' }}>
          {icon}
        </div>
      </div>
      {subText && (
        <div className="text-[11px] sm:text-xs font-medium mt-2 flex items-center gap-1"
          style={{ color: 'var(--ink-soft)' }}>
          <BookmarkCheck className="w-3 h-3" /> {subText}
        </div>
      )}
    </div>
  )
}

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: drives } = await supabase
    .from('drives').select('*').eq('user_id', user.id)
    .order('scheduled_date', { ascending: true })

  const totalDrives = drives?.length || 0
  const today = new Date().toISOString().split('T')[0]

  const upcomingDrives = drives?.filter(d =>
    (d.scheduled_date && d.scheduled_date >= today) || d.status === 'Upcoming'
  ) || []

  const bondsCount = drives?.filter(d => d.bond).length || 0
  const selectedCount = drives?.filter(d => d.status === 'Selected').length || 0
  const rejectedCount = drives?.filter(d => d.status === 'Rejected').length || 0
  const registeredCount = drives?.filter(d => d.status === 'Registered').length || 0

  const statusBadgeClass = (status: string) => {
    const map: Record<string, string> = {
      'Rescheduled': 'bg-orange-200/70 text-orange-800',
      'Selected': 'bg-green-200/70 text-green-800',
      'Rejected': 'bg-red-200/70 text-red-800',
      'Cancelled': 'bg-stone-300/70 text-stone-700',
      'Registration Error': 'bg-red-200/70 text-red-800',
    }
    return map[status] || 'bg-amber-200/70 text-amber-900'
  }

  const greeting = (() => {
    const h = new Date().getHours()
    if (h < 12) return 'Good morning ☀️'
    if (h < 17) return 'Good afternoon 🌿'
    return 'Good evening 🌙'
  })()

  return (
    <div className="flex flex-col gap-6 sm:gap-8 max-w-[1400px] mx-auto">
      {/* Header section - handwritten feel */}
      <div className="relative pl-1">
        <div className="font-hand text-[28px] sm:text-[32px] mb-0 -mt-1"
          style={{ color: 'var(--terracotta)', transform: 'rotate(-1.5deg)', display: 'inline-block' }}>
          hey, {greeting}
        </div>
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2 mt-1">
          <div>
            <h1 className="text-2xl sm:text-4xl font-heading font-extrabold tracking-tight"
              style={{ color: 'var(--ink)' }}>
              let's <span className="squiggle">crush</span> those placements 🔥
            </h1>
            <p className="text-sm sm:text-base mt-1.5" style={{ color: 'var(--ink-soft)' }}>
              here's <span className="highlight-yellow font-semibold">your progress</span> so far —
              {' '}keep tracking every drive, small wins add up!
            </p>
          </div>
          <div className="hidden sm:flex items-center gap-2 font-mono-ui text-[11px] px-3 py-1.5 rounded-lg w-fit"
            style={{ background: 'var(--secondary)', color: 'var(--ink-soft)' }}>
            <span className="w-2 h-2 rounded-full animate-pulse"
              style={{ background: 'var(--sage)' }} />
            last synced · just now
          </div>
        </div>
      </div>

      {/* Stats Grid - sticky notes bento */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5 relative">
        <StatCard
          title="Total Applications"
          value={totalDrives.toString()}
          icon={<Building className="w-5 h-5" style={{ color: 'var(--sky-soft)' }} />}
          bgColor={STICKY_COLORS[3].bg}
          rotate={STICKY_COLORS[3].rot}
          handLabel="total!"
          subText={
            registeredCount > 0
              ? `${registeredCount} registered, going strong`
              : 'time to add some drives 🌱'
          }
        />
        <StatCard
          title="Upcoming Drives"
          value={upcomingDrives.length.toString()}
          icon={<Calendar className="w-5 h-5" style={{ color: 'var(--amber-warm)' }} />}
          bgColor={STICKY_COLORS[0].bg}
          rotate={STICKY_COLORS[0].rot}
          handLabel="soon ✎"
          subText={
            upcomingDrives.length > 0
              ? 'prepare your resume well in advance'
              : 'no upcoming ones — chill for now ♡'
          }
        />
        <StatCard
          title="Bonds Required"
          value={bondsCount.toString()}
          icon={<AlertCircle className="w-5 h-5" style={{ color: 'var(--rose)' }} />}
          bgColor={STICKY_COLORS[1].bg}
          rotate={STICKY_COLORS[1].rot}
          handLabel="read carefully!"
          subText={bondsCount > 0 ? 'think twice before joining these' : 'no bonds — clean slate ✨'}
        />
        <StatCard
          title="Selected 🏆"
          value={selectedCount.toString()}
          icon={<TrendingUp className="w-5 h-5" style={{ color: 'var(--sage)' }} />}
          bgColor={STICKY_COLORS[2].bg}
          rotate={STICKY_COLORS[2].rot}
          handLabel="yay!!"
          subText={
            selectedCount > 0
              ? 'celebrate yourself — you earned it 🎉'
              : rejectedCount > 0 ? `${rejectedCount} rejected — keep going 💪` : 'soon, very soon ✨'
          }
        />
      </div>

      {/* Two-column section: upcoming + quick note */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6">
        {/* Upcoming Drives */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between gap-3 mb-4 sm:mb-5">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center"
                style={{ background: 'var(--primary)', color: 'var(--primary-foreground)', boxShadow: '0 4px 10px -3px rgba(196,101,58,0.4)' }}>
                <Calendar className="w-4.5 h-4.5" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-heading font-bold tracking-tight">
                  Nearest <span className="highlight-pink">Upcoming</span> Drives
                </h2>
                <p className="text-xs sm:text-sm" style={{ color: 'var(--ink-soft)' }}>
                  upcoming {upcomingDrives.length} drives · focus on these first
                </p>
              </div>
            </div>
            <Link href="/dashboard/list"
              className="hidden sm:flex items-center gap-1.5 text-sm font-semibold px-3.5 py-2 rounded-xl transition-all hover:scale-[1.03]"
              style={{
                background: 'var(--paper)',
                color: 'var(--primary)',
                border: `1.5px dashed var(--primary)`,
              }}>
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5">
            {upcomingDrives.slice(0, 6).map((drive, idx) => (
              <TiltCard key={drive.id} className="h-full">
                <Link href={`/dashboard/drive/${drive.id}`}
                  className="block h-full paper-card rounded-xl p-4 sm:p-5 relative overflow-hidden group hover-lift"
                  style={{
                    transform: `rotate(${(idx % 2 === 0 ? -0.4 : 0.6) - (idx * 0.15)}deg)`,
                  }}>
                  {/* corner tape */}
                  <div className="absolute top-0 right-5 w-14 h-4 -translate-y-1/2 rounded-sm opacity-80"
                    style={{ background: 'rgba(216,155,85,0.4)' }} />

                  <div className="flex justify-between items-start gap-3 mb-4">
                    <div className="min-w-0">
                      <h3 className="font-heading font-bold text-base sm:text-lg truncate mb-0.5"
                        style={{ color: 'var(--ink)' }}>
                        {drive.company_name}
                      </h3>
                      <p className="text-xs sm:text-sm truncate" style={{ color: 'var(--ink-soft)' }}>
                        {drive.role}
                      </p>
                    </div>
                    <span className={`badge ${statusBadgeClass(drive.status)} whitespace-nowrap shrink-0`}>
                      {drive.status}
                    </span>
                  </div>

                  <div className="space-y-2 text-xs sm:text-sm mt-5 pt-3 notebook-lines">
                    <div className="flex justify-between gap-3">
                      <span style={{ color: 'var(--ink-soft)' }}>📅 Date</span>
                      <span className="font-semibold text-right" style={{ color: 'var(--ink)' }}>
                        {drive.scheduled_date
                          ? new Date(drive.scheduled_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })
                          : 'TBD'}
                      </span>
                    </div>
                    <div className="flex justify-between gap-3">
                      <span style={{ color: 'var(--ink-soft)' }}>💰 {drive.employment_type === 'Internship' ? 'Stipend' : 'CTC'}</span>
                      <span className="font-semibold text-right" style={{ color: 'var(--ink)' }}>
                        {drive.ctc || '—'}
                      </span>
                    </div>
                    {drive.bond && (
                      <div className="flex justify-between gap-3">
                        <span style={{ color: 'var(--ink-soft)' }}>📎 Bond</span>
                        <span className="font-semibold text-right" style={{ color: 'var(--rose)' }}>
                          {drive.bond_duration || 'Yes'}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="mt-4 pt-3 flex items-center justify-between border-t border-dashed"
                    style={{ borderColor: 'var(--border)' }}>
                    <div className="font-hand text-[17px]" style={{ color: 'var(--terracotta)' }}>
                      open →
                    </div>
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center transition-all group-hover:translate-x-0.5"
                      style={{ background: 'var(--primary)', color: 'var(--primary-foreground)' }}>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </Link>
              </TiltCard>
            ))}

            {upcomingDrives.length === 0 && (
              <div className="md:col-span-2 xl:col-span-3 p-8 sm:p-12 text-center paper-card rounded-2xl relative overflow-hidden">
                <div className="font-hand text-[32px] mb-2"
                  style={{ color: 'var(--amber-warm)', transform: 'rotate(-2deg)', display: 'inline-block' }}>
                  no drives yet...
                </div>
                <p className="mb-5" style={{ color: 'var(--ink-soft)' }}>
                  nothing to show here. add your first placement drive & let's begin tracking 🚀
                </p>
                <Link href="/dashboard/list"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-semibold fab-shadow transition-transform hover:scale-105"
                  style={{ background: 'var(--primary)', color: 'var(--primary-foreground)' }}>
                  <Building className="w-4 h-4" /> Browse All Drives
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar: progress + hand note */}
        <div className="flex flex-col gap-5 sm:gap-6">
          {/* Progress card */}
          <div className="paper-card rounded-2xl p-5 relative corner-fold">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="font-hand text-[24px]" style={{ color: 'var(--terracotta)' }}>
                my progress ⚡
              </div>
            </div>

            <div className="space-y-4">
              {[
                { label: 'Registered', count: registeredCount, total: totalDrives, color: 'var(--sky-soft)' },
                { label: 'Selected', count: selectedCount, total: totalDrives, color: 'var(--sage)' },
                { label: 'Rejected', count: rejectedCount, total: totalDrives, color: 'var(--rose)' },
              ].map((row) => {
                const pct = totalDrives ? Math.round((row.count / totalDrives) * 100) : 0
                return (
                  <div key={row.label}>
                    <div className="flex justify-between text-xs sm:text-sm mb-1.5">
                      <span className="font-semibold" style={{ color: 'var(--ink)' }}>{row.label}</span>
                      <span className="font-mono-ui" style={{ color: 'var(--ink-soft)' }}>
                        {row.count}/{totalDrives || 0} · {pct}%
                      </span>
                    </div>
                    <div className="h-2.5 rounded-full" style={{ background: 'var(--secondary)', overflow: 'hidden' }}>
                      <div className="h-full rounded-full transition-all duration-700 ease-out"
                        style={{
                          width: `${pct}%`,
                          background: `linear-gradient(90deg, ${row.color}, color-mix(in oklab, ${row.color} 60%, #fff))`,
                        }} />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Handwritten reminder sticky */}
          <div className="sticky-note p-5 rounded-lg"
            style={{ background: 'var(--sticky-yellow)', transform: 'rotate(1deg)' }}>
            <div className="font-hand text-[26px] leading-none mb-1" style={{ color: 'var(--ink)' }}>
              reminder ✎
            </div>
            <div className="text-sm mt-3 leading-relaxed space-y-2" style={{ color: 'var(--ink)' }}>
              <div className="flex gap-2">
                <span>•</span>
                <span>Revise <b>DBMS + OS</b> basics before every interview</span>
              </div>
              <div className="flex gap-2">
                <span>•</span>
                <span>Practice <b>2 DSA mediums</b> daily — consistency {'>>'} intensity</span>
              </div>
              <div className="flex gap-2">
                <span>•</span>
                <span>Update resume & keep <b>2 copies</b> printed irl 📄</span>
              </div>
            </div>
            <div className="mt-4 pt-3 text-right font-hand text-[22px]"
              style={{ color: 'var(--terracotta)', transform: 'rotate(-2deg)' }}>
              — you got this ♡
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
