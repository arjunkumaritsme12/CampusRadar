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
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading font-bold mb-2">All Drives</h1>
          <p className="text-secondary-foreground/70">Manage all your placement applications.</p>
        </div>
      </div>

      <div className="glass rounded-2xl border border-border/50 overflow-hidden">
        <div className="overflow-x-auto">
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
      </div>
    </div>
  )
}
