import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, getDay, isToday, addMonths, subMonths } from 'date-fns'
import Link from 'next/link'
import { Calendar as CalIcon, Sparkles, Flag, ChevronLeft, ChevronRight, Crown } from 'lucide-react'

export default async function CalendarPage(
  props: { searchParams: Promise<{ date?: string }> }
) {
  const searchParams = await props.searchParams;
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  let currentDate = new Date()
  if (searchParams.date) {
    const parsed = new Date(searchParams.date)
    if (!isNaN(parsed.getTime())) {
      currentDate = parsed
    }
  }

  const { data: drives } = await supabase
    .from('drives').select('*').eq('user_id', user.id)

  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd })
  const startDayOfWeek = getDay(monthStart)
  const emptyDays = Array.from({ length: startDayOfWeek }, (_, i) => i)

  const prevMonth = subMonths(currentDate, 1)
  const nextMonth = addMonths(currentDate, 1)

  return (
    <div className="flex flex-col gap-6 max-w-[1400px] mx-auto">
      <div>
        <div className="font-hand text-[26px] -mb-1"
          style={{ color: 'var(--amber-warm)', transform: 'rotate(-1deg)', display: 'inline-block' }}>
          my calendar 📅
        </div>
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 sm:gap-4">
              <h1 className="text-2xl sm:text-4xl font-heading font-extrabold tracking-tight"
                style={{ color: 'var(--ink)' }}>
                <span className="squiggle">{format(currentDate, 'MMMM')}</span>{' '}
                {format(currentDate, 'yyyy')}
              </h1>
              <div className="flex items-center gap-1 bg-black/5 rounded-full p-0.5">
                <Link href={`?date=${format(prevMonth, 'yyyy-MM-dd')}`} className="p-1.5 rounded-full hover:bg-white/60 transition-colors" title="Previous Month">
                  <ChevronLeft className="w-5 h-5" style={{ color: 'var(--ink)' }} />
                </Link>
                <div className="w-px h-4 bg-black/10"></div>
                <Link href={`?date=${format(nextMonth, 'yyyy-MM-dd')}`} className="p-1.5 rounded-full hover:bg-white/60 transition-colors" title="Next Month">
                  <ChevronRight className="w-5 h-5" style={{ color: 'var(--ink)' }} />
                </Link>
              </div>
            </div>
            <p className="text-sm mt-1.5" style={{ color: 'var(--ink-soft)' }}>
              here's how your placement month looks — click any event to open details
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="paper-card px-3 py-2 rounded-xl flex items-center gap-3 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm" style={{ background: 'var(--sky-soft)' }} />
                <span className="font-semibold" style={{ color: 'var(--ink)' }}>Drive Day</span>
              </div>
              <div className="w-px h-4" style={{ background: 'var(--border)' }} />
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm" style={{ background: 'var(--terracotta)' }} />
                <span className="font-semibold" style={{ color: 'var(--ink)' }}>Last Date</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="paper-card rounded-3xl p-4 sm:p-7 relative overflow-hidden">
        <div className="absolute top-3 left-8 font-hand text-[20px] z-10"
          style={{ color: 'var(--terracotta)', transform: 'rotate(-3deg)' }}>
          <Sparkles className="w-4 h-4 inline -translate-y-0.5 mr-1" style={{ color: 'var(--amber-warm)' }} />
          mark important dates!
        </div>

        <div className="grid grid-cols-7 gap-2 sm:gap-3 mb-4 text-center mt-5">
          {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map((day, i) => (
            <div key={day}
              className="font-mono-ui text-[10px] sm:text-[11px] font-bold uppercase tracking-widest py-2 rounded-lg"
              style={{
                color: (i === 0 || i === 6) ? 'var(--rose)' : 'var(--ink-soft)',
                background: (i === 0 || i === 6) ? 'var(--sticky-pink)' : 'var(--secondary)'
              }}>
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-2 sm:gap-3">
          {emptyDays.map(empty => (
            <div key={`empty-${empty}`}
              className="min-h-[90px] sm:min-h-[110px] rounded-2xl"
              style={{ background: 'var(--accent)', opacity: 0.3 }} />
          ))}

          {daysInMonth.map((day, idx) => {
            const dayDrives = drives?.filter(d =>
              (d.scheduled_date && isSameDay(new Date(d.scheduled_date), day)) ||
              (d.registration_deadline && isSameDay(new Date(d.registration_deadline), day))
            ) || []
            const dow = getDay(day)
            const weekend = dow === 0 || dow === 6

            return (
              <div
                key={day.toISOString()}
                className="relative min-h-[90px] sm:min-h-[110px] p-2 sm:p-3 flex flex-col gap-1.5 rounded-2xl group transition-all hover:scale-[1.02]"
                style={{
                  background: isToday(day)
                    ? 'linear-gradient(160deg, color-mix(in oklab, var(--primary) 15%, var(--paper)), var(--paper))'
                    : weekend ? 'var(--accent)' : 'var(--paper)',
                  border: isToday(day)
                    ? '2px solid var(--primary)'
                    : `1.5px solid ${weekend ? 'color-mix(in oklab, var(--rose) 40%, var(--border))' : 'var(--border)'}`,
                  boxShadow: isToday(day) ? '0 10px 30px -15px color-mix(in oklab, var(--primary) 50%, transparent)' : 'none',
                  transform: `rotate(${((idx % 7) - 3) * 0.12}deg)`
                }}
              >
                <div className="flex items-start justify-between">
                  <span
                    className={`text-sm sm:text-base font-heading font-bold w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-xl transition-all`}
                    style={{
                      background: isToday(day) ? 'var(--primary)' : 'transparent',
                      color: isToday(day) ? 'var(--primary-foreground)' : (weekend ? 'var(--rose)' : 'var(--ink)'),
                      boxShadow: isToday(day) ? '0 2px 6px rgba(196,101,58,0.4)' : 'none'
                    }}>
                    {format(day, 'd')}
                  </span>
                  {dayDrives.length > 0 && (
                    <span className="font-mono-ui text-[9px] sm:text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                      style={{
                        background: 'var(--ink)',
                        color: 'var(--paper)',
                      }}>
                      {dayDrives.length}
                    </span>
                  )}
                </div>

                <div className="flex flex-col gap-1 mt-1 overflow-hidden flex-1">
                  {dayDrives.slice(0, 3).map(drive => {
                    const isScheduled = drive.scheduled_date && isSameDay(new Date(drive.scheduled_date), day)
                    const isPermitted = drive.status === 'Permitted'
                    return (
                      <Link
                        key={`${drive.id}-${isScheduled ? 'scheduled' : 'deadline'}`}
                        href={`/dashboard/drive/${drive.id}`}
                        className="block group/link"
                        title={`${drive.company_name} - ${isScheduled ? 'Scheduled Drive' : 'Registration Deadline'} ${isPermitted ? '(Permitted)' : ''}`}
                      >
                        <div
                          className={`text-[10px] sm:text-[11px] leading-tight px-1.5 py-1 sm:py-1.5 rounded-lg truncate font-semibold transition-all hover:translate-x-0.5 relative ${isPermitted ? 'animate-pulse' : ''}`}
                          style={{
                            background: isPermitted
                              ? `linear-gradient(135deg, rgba(255,204,249,0.8), rgba(240,98,146,0.3))`
                              : isScheduled
                                ? `color-mix(in oklab, var(--sky-soft) 25%, transparent)`
                                : `color-mix(in oklab, var(--terracotta) 25%, transparent)`,
                            borderLeft: `3px solid ${isPermitted ? '#f06292' : isScheduled ? 'var(--sky-soft)' : 'var(--terracotta)'}`,
                            boxShadow: isPermitted ? '0 0 8px rgba(240,98,146,0.4)' : 'none',
                            color: isPermitted ? '#880e4f' : 'var(--ink)'
                          }}>
                          {isPermitted ? (
                            <Crown className="w-2.5 h-2.5 inline mr-1 -translate-y-0.5" style={{ color: '#d81b60' }} />
                          ) : (
                            <Flag className="w-2.5 h-2.5 inline mr-1 -translate-y-0.5"
                              style={{ color: isScheduled ? 'var(--sky-soft)' : 'var(--terracotta)' }} />
                          )}
                          <span className="truncate">{drive.company_name}</span>
                          <div className="opacity-70 font-normal">
                            {isScheduled ? 'Drive' : 'Deadline'} {isPermitted && '• Permitted'}
                          </div>
                        </div>
                      </Link>
                    )
                  })}
                  {dayDrives.length > 3 && (
                    <div className="text-[10px] font-semibold text-center py-1 rounded-lg"
                      style={{ color: 'var(--ink-soft)', background: 'var(--secondary)' }}>
                      +{dayDrives.length - 3} more
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Legend strip with motivational note */}
      <div className="sticky-note rounded-xl p-4 sm:p-5 max-w-md"
        style={{ background: 'var(--sticky-pink)', transform: 'rotate(0.7deg)' }}>
        <div className="font-hand text-[22px] leading-none mb-1" style={{ color: 'var(--ink)' }}>
          p.s. interview prep tip ✎
        </div>
        <p className="text-sm mt-2 leading-relaxed" style={{ color: 'var(--ink)' }}>
          1 day before the drive — revise company basics, recent news, 5 of your projects in-depth,
          and get a good sleep. All the best! 🌟
        </p>
      </div>
    </div>
  )
}
