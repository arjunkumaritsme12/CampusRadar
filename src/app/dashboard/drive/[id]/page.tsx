import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Calendar as CalendarIcon, Briefcase, FileText, Clock } from 'lucide-react'
import { EditDriveButton } from '@/components/EditDriveButton'

export default async function DriveDetail({ params }: { params: { id: string } }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Await the params object before using it
  const resolvedParams = await params
  
  const { data: drive } = await supabase
    .from('drives')
    .select('*')
    .eq('id', resolvedParams.id)
    .single()

  if (!drive || drive.user_id !== user.id) {
    redirect('/dashboard/list')
  }

  const { data: logs } = await supabase
    .from('reschedule_logs')
    .select('*')
    .eq('drive_id', resolvedParams.id)
    .order('changed_at', { ascending: false })

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-6">
      <Link href="/dashboard/list" className="flex items-center gap-2 text-sm text-secondary-foreground/60 hover:text-foreground transition-colors w-fit">
        <ArrowLeft className="w-4 h-4" /> Back to List
      </Link>
      
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-heading font-bold mb-1">{drive.company_name}</h1>
          <p className="text-xl text-secondary-foreground/80">{drive.role} <span className="text-sm font-medium px-2 py-1 bg-accent/20 rounded-md ml-2">{drive.employment_type || 'Full Time'}</span></p>
        </div>
        <div className="flex items-center gap-4">
          <span className={`px-4 py-2 rounded-full font-bold text-sm ${
            drive.status === 'Selected' ? 'bg-green-500/20 text-green-600' :
            drive.status === 'Rejected' ? 'bg-red-500/20 text-red-600' :
            drive.status === 'Rescheduled' ? 'bg-orange-500/20 text-orange-600' :
            drive.status === 'Registration Error' ? 'bg-red-500/20 text-red-600' :
            'bg-primary/20 text-primary'
          }`}>
            {drive.status}
          </span>
          <EditDriveButton drive={drive} variant="full" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="md:col-span-2 flex flex-col gap-6">
          <div className="glass p-6 rounded-2xl border border-border/50">
            <h2 className="text-xl font-heading font-bold mb-4 flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-primary" />
              Drive Details
            </h2>
            <div className="grid grid-cols-2 gap-y-4 gap-x-8">
              <div>
                <p className="text-sm text-secondary-foreground/60">{drive.employment_type === 'Internship' ? 'Full Time Package' : 'CTC'}</p>
                <p className="font-medium text-lg">{drive.ctc || 'Not specified'}</p>
              </div>
              {drive.employment_type === 'Internship' && (
                <>
                  <div>
                    <p className="text-sm text-secondary-foreground/60">Internship Duration</p>
                    <p className="font-medium text-lg">{drive.internship_duration || 'Not specified'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-secondary-foreground/60">Internship Stipend</p>
                    <p className="font-medium text-lg">{drive.internship_stipend || 'Not specified'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-secondary-foreground/60">Post-Internship Package</p>
                    <p className="font-medium text-lg">{drive.post_internship_package || 'Not specified'}</p>
                  </div>
                </>
              )}
              <div>
                <p className="text-sm text-secondary-foreground/60">Bond</p>
                <p className="font-medium text-lg">{drive.bond ? drive.bond_duration || 'Yes' : 'No'}</p>
              </div>
              <div>
                <p className="text-sm text-secondary-foreground/60">Registration Deadline</p>
                <p className="font-medium text-lg">{drive.registration_deadline ? new Date(drive.registration_deadline).toLocaleDateString() : 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-secondary-foreground/60">Mail Received</p>
                <p className="font-medium text-lg">{drive.mail_received_date ? new Date(drive.mail_received_date).toLocaleDateString() : 'N/A'}</p>
              </div>
            </div>
          </div>

          <div className="glass p-6 rounded-2xl border border-border/50">
            <h2 className="text-xl font-heading font-bold mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              Notes
            </h2>
            <div className="prose prose-sm dark:prose-invert max-w-none">
              {drive.notes ? (
                <p className="whitespace-pre-wrap">{drive.notes}</p>
              ) : (
                <p className="text-secondary-foreground/50 italic">No notes added for this drive.</p>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="flex flex-col gap-6">
          <div className="glass p-6 rounded-2xl border border-border/50 bg-primary/5">
            <h2 className="text-xl font-heading font-bold mb-4 flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-primary" />
              Scheduled Date
            </h2>
            <div className="text-center py-4">
              <p className="text-4xl font-bold text-primary">
                {drive.scheduled_date ? new Date(drive.scheduled_date).getDate() : '?'}
              </p>
              <p className="text-lg font-medium text-secondary-foreground mt-1">
                {drive.scheduled_date ? new Date(drive.scheduled_date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'To Be Decided'}
              </p>
            </div>
          </div>

          <div className="glass p-6 rounded-2xl border border-border/50">
            <h2 className="text-xl font-heading font-bold mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" />
              History
            </h2>
            <div className="flex flex-col gap-4">
              {logs && logs.length > 0 ? (
                logs.map((log) => (
                  <div key={log.id} className="text-sm border-l-2 border-primary/30 pl-3 py-1 relative before:absolute before:w-2 before:h-2 before:bg-primary before:rounded-full before:-left-[5px] before:top-2">
                    <p className="text-secondary-foreground/70 mb-1">
                      {new Date(log.changed_at).toLocaleString()}
                    </p>
                    <p>
                      Rescheduled from <strong>{log.old_date ? new Date(log.old_date).toLocaleDateString() : 'TBD'}</strong> to <strong>{new Date(log.new_date).toLocaleDateString()}</strong>
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-secondary-foreground/50 italic">No reschedule history.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
