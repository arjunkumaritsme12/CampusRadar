import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Calendar, Building, TrendingUp, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { TiltCard } from '@/components/TiltCard'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch all drives for stats
  const { data: drives } = await supabase
    .from('drives')
    .select('*')
    .eq('user_id', user.id)
    .order('scheduled_date', { ascending: true })

  const totalDrives = drives?.length || 0
  
  // Calculate upcoming drives (scheduled date is in the future)
  const today = new Date().toISOString().split('T')[0]
  const upcomingDrives = drives?.filter(d => 
    (d.scheduled_date && d.scheduled_date >= today) || d.status === 'Upcoming'
  ) || []
  
  const bondsCount = drives?.filter(d => d.bond).length || 0

  return (
    <div className="flex flex-col gap-6 sm:gap-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-heading font-bold mb-2">Welcome back!</h1>
        <p className="text-sm sm:text-base text-secondary-foreground/70">Here's what's happening with your placements.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard 
          title="Total Applications" 
          value={totalDrives.toString()} 
          icon={<Building className="w-5 h-5 text-blue-500" />} 
          bg="bg-blue-500/10"
        />
        <StatCard 
          title="Upcoming Drives" 
          value={upcomingDrives.length.toString()} 
          icon={<Calendar className="w-5 h-5 text-orange-500" />} 
          bg="bg-orange-500/10"
        />
        <StatCard 
          title="Bonds Required" 
          value={bondsCount.toString()} 
          icon={<AlertCircle className="w-5 h-5 text-red-500" />} 
          bg="bg-red-500/10"
        />
        <StatCard 
          title="Selected" 
          value={(drives?.filter(d => d.status === 'Selected').length || 0).toString()} 
          icon={<TrendingUp className="w-5 h-5 text-green-500" />} 
          bg="bg-green-500/10"
        />
      </div>

      {/* Upcoming List */}
      <div>
        <div className="flex items-center justify-between gap-3 mb-4">
          <h2 className="text-lg sm:text-xl font-heading font-bold">Nearest Upcoming Drives</h2>
          <Link href="/dashboard/list" className="text-sm text-primary hover:underline">View all</Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {upcomingDrives.slice(0, 3).map((drive) => (
            <TiltCard key={drive.id}>
              <Link href={`/dashboard/drive/${drive.id}`} className="block h-full glass p-4 sm:p-5 rounded-2xl border border-border/50 hover:shadow-lg hover:border-primary/50 transition-colors">
                <div className="flex justify-between items-start gap-3 mb-4">
                  <div className="min-w-0">
                    <h3 className="font-bold text-base sm:text-lg truncate">{drive.company_name}</h3>
                    <p className="text-sm text-secondary-foreground/70 truncate">{drive.role}</p>
                  </div>
                  <span className={`text-[10px] sm:text-xs px-2 py-1 rounded-full font-medium whitespace-nowrap ${
                    drive.status === 'Rescheduled' ? 'bg-orange-500/20 text-orange-600' :
                    drive.status === 'Selected' ? 'bg-green-500/20 text-green-600' :
                    drive.status === 'Rejected' ? 'bg-red-500/20 text-red-600' :
                    drive.status === 'Cancelled' ? 'bg-gray-500/20 text-gray-600' :
                    'bg-primary/20 text-primary'
                  }`}>
                    {drive.status}
                  </span>
                </div>
                <div className="space-y-2 text-sm mt-6">
                  <div className="flex justify-between gap-3">
                    <span className="text-secondary-foreground/60">Date:</span>
                    <span className="font-medium text-right">{drive.scheduled_date ? new Date(drive.scheduled_date).toLocaleDateString() : 'TBD'}</span>
                  </div>
                  <div className="flex justify-between gap-3">
                    <span className="text-secondary-foreground/60">CTC:</span>
                    <span className="font-medium text-right">{drive.ctc || 'Not specified'}</span>
                  </div>
                </div>
              </Link>
            </TiltCard>
          ))}

          {upcomingDrives.length === 0 && (
            <div className="col-span-full py-12 text-center border border-dashed border-border rounded-2xl text-secondary-foreground/50 px-4">
              No upcoming drives found. Click "New Drive" to add one.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function StatCard({ title, value, icon, bg }: { title: string, value: string, icon: React.ReactNode, bg: string }) {
  return (
    <div className="glass p-4 sm:p-5 rounded-2xl flex items-center gap-4 border border-border/50 hover:-translate-y-1 transition-transform">
      <div className={`w-11 h-11 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center shrink-0 ${bg}`}>
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-xs sm:text-sm font-medium text-secondary-foreground/60">{title}</p>
        <p className="text-2xl sm:text-3xl font-heading font-bold">{value}</p>
      </div>
    </div>
  )
}
