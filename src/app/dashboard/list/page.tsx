import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { EditDriveButton } from '@/components/EditDriveButton'

export default async function ListPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: drives } = await supabase
    .from('drives')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <div className="flex flex-col gap-4 sm:gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-heading font-bold mb-2">All Drives</h1>
          <p className="text-sm sm:text-base text-secondary-foreground/70">Manage all your placement applications.</p>
        </div>
      </div>

      <div className="glass rounded-2xl border border-border/50 overflow-hidden">
        <div className="overflow-x-auto md:block hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border/50 bg-accent/20">
                <th className="p-4 font-medium text-sm text-secondary-foreground">Company</th>
                <th className="p-4 font-medium text-sm text-secondary-foreground">Role</th>
                <th className="p-4 font-medium text-sm text-secondary-foreground">Status</th>
                <th className="p-4 font-medium text-sm text-secondary-foreground">CTC</th>
                <th className="p-4 font-medium text-sm text-secondary-foreground">Scheduled Date</th>
                <th className="p-4 font-medium text-sm text-secondary-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {drives?.map((drive) => (
                <tr key={drive.id} className="border-b border-border/20 hover:bg-accent/10 transition-colors">
                  <td className="p-4 font-medium">{drive.company_name}</td>
                  <td className="p-4 text-sm text-secondary-foreground/80">{drive.role}</td>
                  <td className="p-4">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium inline-block ${
                      drive.status === 'Rescheduled' ? 'bg-orange-500/20 text-orange-600' : 
                      drive.status === 'Selected' ? 'bg-green-500/20 text-green-600' :
                      drive.status === 'Rejected' ? 'bg-red-500/20 text-red-600' :
                      'bg-primary/20 text-primary'
                    }`}>
                      {drive.status}
                    </span>
                  </td>
                  <td className="p-4 text-sm">{drive.ctc || '-'}</td>
                  <td className="p-4 text-sm">{drive.scheduled_date ? new Date(drive.scheduled_date).toLocaleDateString() : '-'}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <Link href={`/dashboard/drive/${drive.id}`} className="text-sm font-medium text-primary hover:underline">
                        View Details
                      </Link>
                      <EditDriveButton drive={drive} />
                    </div>
                  </td>
                </tr>
              ))}
              {drives?.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-secondary-foreground/50">
                    No drives found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="md:hidden p-3 sm:p-4 space-y-3">
          {drives?.map((drive) => (
            <div key={drive.id} className="rounded-2xl border border-border/50 bg-background/40 p-4 shadow-sm">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="min-w-0">
                  <h3 className="font-bold text-base truncate">{drive.company_name}</h3>
                  <p className="text-sm text-secondary-foreground/70 truncate">{drive.role}</p>
                </div>
                <span className={`text-[10px] px-2 py-1 rounded-full font-medium whitespace-nowrap ${
                  drive.status === 'Rescheduled' ? 'bg-orange-500/20 text-orange-600' : 
                  drive.status === 'Selected' ? 'bg-green-500/20 text-green-600' :
                  drive.status === 'Rejected' ? 'bg-red-500/20 text-red-600' :
                  'bg-primary/20 text-primary'
                }`}>
                  {drive.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-sm text-secondary-foreground/80">
                <p className="col-span-2 flex justify-between gap-3">
                  <span>CTC</span>
                  <span className="font-medium text-right">{drive.ctc || '-'}</span>
                </p>
                <p className="col-span-2 flex justify-between gap-3">
                  <span>Date</span>
                  <span className="font-medium text-right">{drive.scheduled_date ? new Date(drive.scheduled_date).toLocaleDateString() : '-'}</span>
                </p>
              </div>

              <div className="flex items-center justify-between gap-2 mt-4 pt-3 border-t border-border/50">
                <Link href={`/dashboard/drive/${drive.id}`} className="flex-1 text-center py-2 rounded-xl bg-primary/10 text-primary font-medium text-sm">
                  View
                </Link>
                <div className="flex-1 flex justify-center">
                  <EditDriveButton drive={drive} />
                </div>
              </div>
            </div>
          ))}

          {drives?.length === 0 && (
            <div className="p-8 text-center text-secondary-foreground/50">
              No drives found.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
