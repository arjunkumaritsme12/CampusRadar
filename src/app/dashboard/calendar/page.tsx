import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, getDay, isToday } from 'date-fns'
import Link from 'next/link'

export default async function CalendarPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: drives } = await supabase
    .from('drives')
    .select('*')
    .eq('user_id', user.id)

  const currentDate = new Date()
  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd })
  
  const startDayOfWeek = getDay(monthStart)
  const emptyDays = Array.from({ length: startDayOfWeek }, (_, i) => i)

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading font-bold mb-2">Calendar</h1>
          <p className="text-secondary-foreground/70">{format(currentDate, 'MMMM yyyy')}</p>
        </div>
      </div>

      <div className="glass rounded-2xl border border-border/50 p-6 overflow-hidden">
        {/* Days of week */}
        <div className="grid grid-cols-7 gap-2 mb-4 text-center">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-sm font-bold text-secondary-foreground/70 uppercase tracking-wider">{day}</div>
          ))}
        </div>
        
        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-2">
          {emptyDays.map(empty => (
            <div key={`empty-${empty}`} className="min-h-[100px] rounded-xl bg-accent/5"></div>
          ))}
          
          {daysInMonth.map(day => {
            // Find drives for this day
            const dayDrives = drives?.filter(d => 
              (d.scheduled_date && isSameDay(new Date(d.scheduled_date), day)) ||
              (d.registration_deadline && isSameDay(new Date(d.registration_deadline), day))
            ) || []

            return (
              <div 
                key={day.toISOString()} 
                className={`min-h-[100px] p-2 flex flex-col gap-1 rounded-xl border ${
                  isToday(day) ? 'border-primary/50 bg-primary/5' : 'border-border/30 bg-accent/10 hover:bg-accent/20'
                } transition-colors`}
              >
                <span className={`text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full ${
                  isToday(day) ? 'bg-primary text-primary-foreground' : 'text-secondary-foreground'
                }`}>
                  {format(day, 'd')}
                </span>
                
                <div className="flex flex-col gap-1 mt-1 overflow-y-auto max-h-[120px] custom-scrollbar">
                  {dayDrives.map(drive => {
                    const isScheduled = drive.scheduled_date && isSameDay(new Date(drive.scheduled_date), day)
                    return (
                      <Link 
                        key={`${drive.id}-${isScheduled ? 'scheduled' : 'deadline'}`}
                        href={`/dashboard/drive/${drive.id}`}
                        className={`text-[10px] leading-tight px-1.5 py-1 rounded truncate border ${
                          isScheduled 
                            ? 'bg-blue-500/10 border-blue-500/20 text-blue-600 dark:text-blue-400' 
                            : 'bg-orange-500/10 border-orange-500/20 text-orange-600 dark:text-orange-400'
                        }`}
                        title={`${drive.company_name} - ${isScheduled ? 'Scheduled Drive' : 'Registration Deadline'}`}
                      >
                        <span className="font-bold">{drive.company_name}</span>
                        <br/>
                        {isScheduled ? 'Drive' : 'Deadline'}
                      </Link>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
