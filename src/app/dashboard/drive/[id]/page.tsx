import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Calendar as CalendarIcon, Briefcase, FileText, Clock, Banknote, FileCheck, Mail, Target, Award, MapPin } from 'lucide-react'
import { EditDriveButton } from '@/components/EditDriveButton'
import { DeleteDriveButton } from '@/components/DeleteDriveButton'

const statusColor: Record<string, string> = {
  'Upcoming': 'bg-amber-200/70 text-amber-900',
  'Registered': 'bg-sky-200/70 text-sky-900',
  'Permitted': 'bg-[#ffccf9] text-[#880e4f] border-2 border-[#f06292] shadow-[0_0_15px_rgba(240,98,146,0.5)] font-extrabold',
  'Rescheduled': 'bg-orange-200/70 text-orange-900',
  'Completed': 'bg-indigo-200/70 text-indigo-900',
  'Missed': 'bg-stone-300/70 text-stone-700',
  'Rejected': 'bg-rose-200/70 text-rose-800',
  'Selected': 'bg-emerald-200/70 text-emerald-900',
  'Registration Error': 'bg-red-200/70 text-red-800',
  'Cancelled': 'bg-stone-300/70 text-stone-700',
}

function SectionHeading({ icon, title, hand }: { icon: React.ReactNode; title: string; hand?: string }) {
  return (
    <div className="flex items-end justify-between mb-4 pb-2 border-b-2 border-dashed"
      style={{ borderColor: 'var(--border)' }}>
      <div className="flex items-center gap-2.5">
        <div className="w-9 h-9 rounded-lg flex items-center justify-center"
          style={{ background: 'var(--primary)', color: 'var(--primary-foreground)' }}>
          {icon}
        </div>
        <h2 className="font-heading font-bold text-lg sm:text-xl tracking-tight"
          style={{ color: 'var(--ink)' }}>
          {title}
        </h2>
      </div>
      {hand && (
        <div className="font-hand text-[22px] leading-none hidden sm:block"
          style={{ color: 'var(--terracotta)', transform: 'rotate(-2deg)' }}>
          {hand}
        </div>
      )}
    </div>
  )
}

function InfoRow({ label, value, accent }: { label: string; value: React.ReactNode; accent?: boolean }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-[140px_1fr] gap-1 sm:gap-3 py-2.5 border-b last:border-0 border-dashed notebook-lines"
      style={{ borderColor: 'var(--border)' }}>
      <div className="font-mono-ui text-[11px] uppercase tracking-widest flex items-center gap-1.5"
        style={{ color: 'var(--ink-soft)' }}>
        <span className="w-1 h-1 rounded-full" style={{ background: 'var(--amber-warm)' }} />
        {label}
      </div>
      <div className={`text-sm sm:text-base font-semibold ${accent ? '' : ''}`}
        style={{ color: accent ? 'var(--terracotta)' : 'var(--ink)' }}>
        {value || <span style={{ color: 'var(--ink-soft)', fontWeight: 400 }}>— not specified —</span>}
      </div>
    </div>
  )
}

export default async function DriveDetail({ params }: { params: { id: string } }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const resolvedParams = await params
  const { data: drive } = await supabase
    .from('drives').select('*').eq('id', resolvedParams.id).single()

  if (!drive || drive.user_id !== user.id) redirect('/dashboard/list')

  const { data: logs } = await supabase
    .from('reschedule_logs').select('*').eq('drive_id', resolvedParams.id)
    .order('changed_at', { ascending: false })

  const badgeCls = statusColor[drive.status] || 'bg-amber-200/70 text-amber-900'

  return (
    <div className="max-w-5xl mx-auto flex flex-col gap-5 sm:gap-7">
      {/* Breadcrumb back */}
      <Link href="/dashboard/list"
        className="group flex items-center gap-2 text-sm font-medium w-fit transition-all hover:translate-x-[-2px]"
        style={{ color: 'var(--ink-soft)' }}>
        <div className="w-8 h-8 rounded-lg flex items-center justify-center transition-all group-hover:bg-secondary"
          style={{ border: '1px solid var(--border)' }}>
          <ArrowLeft className="w-4 h-4" />
        </div>
        <span>Back to All Drives</span>
        <span className="font-mono-ui text-[10px] px-1.5 py-0.5 rounded ml-1"
          style={{ background: 'var(--secondary)' }}>Esc</span>
      </Link>

      {/* Hero header with paper clip feel */}
      <div className="paper-card rounded-3xl p-5 sm:p-8 relative overflow-hidden">
        <div className="paperclip" />
        <div className="absolute top-0 right-0 w-40 h-40 opacity-30 pointer-events-none"
          style={{
            background: 'radial-gradient(circle at 100% 0%, rgba(196,101,58,0.3), transparent 60%)'
          }} />

        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6 relative z-10">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <div className="font-mono-ui text-[10px] uppercase tracking-widest px-2.5 py-1 rounded-full"
                style={{ background: 'var(--secondary)', color: 'var(--ink-soft)' }}>
                Placement Drive
              </div>
              <div className="font-mono-ui text-[10px] uppercase tracking-widest px-2.5 py-1 rounded-full"
                style={{ background: 'var(--sticky-blue)', color: 'var(--ink)' }}>
                {drive.employment_type || 'Full Time'}
              </div>
              {drive.bond && (
                <div className="font-mono-ui text-[10px] uppercase tracking-widest px-2.5 py-1 rounded-full"
                  style={{ background: 'var(--sticky-pink)', color: 'var(--ink)' }}>
                  ⚠ Bond Required
                </div>
              )}
            </div>

            <h1 className="text-3xl sm:text-5xl font-heading font-extrabold tracking-tight leading-[1.05] mb-2"
              style={{ color: 'var(--ink)' }}>
              {drive.company_name}
            </h1>
            <p className="text-lg sm:text-2xl font-medium" style={{ color: 'var(--ink-soft)' }}>
              for the role of{' '}
              <span className="highlight-yellow font-semibold" style={{ color: 'var(--ink)' }}>
                {drive.role}
              </span>
            </p>
            <div className="mt-2 font-hand text-[22px] sm:text-[24px]"
              style={{ color: 'var(--terracotta)', transform: 'rotate(-1deg)', display: 'inline-block' }}>
              hope you get it ✨ fingers crossed ♡
            </div>
          </div>

          <div className="flex flex-col gap-3 items-stretch lg:items-end">
            <span className={`badge ${badgeCls} self-start lg:self-end text-sm px-4 py-2 !gap-2`}>
              <span className="!w-2 !h-2" />
              {drive.status}
            </span>
            <div className="flex flex-wrap gap-2 self-start lg:self-end">
              <EditDriveButton drive={drive as any} variant="full" />
              <DeleteDriveButton drive={drive as any} variant="full" />
            </div>
          </div>
        </div>
      </div>

      {/* Two column main content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-7">
        {/* Main column */}
        <div className="lg:col-span-2 flex flex-col gap-5 sm:gap-7">
          {/* Drive Details */}
          <div className="paper-card rounded-2xl p-5 sm:p-7 relative">
            <SectionHeading
              icon={<Briefcase className="w-4.5 h-4.5" />}
              title="Drive Details"
              hand="the basics ✎"
            />
            <div className="divide-y divide-dashed" style={{ borderColor: 'var(--border)' }}>
              <InfoRow
                label="Company"
                value={drive.company_name}
              />
              <InfoRow
                label="Role"
                value={drive.role}
              />
              <InfoRow
                label="Employment Type"
                value={drive.employment_type || 'Full Time'}
              />
              <InfoRow
                label={drive.employment_type === 'Internship' ? 'Full Time CTC (post-conversion)' : 'CTC / Package'}
                value={drive.ctc}
                accent
              />
              {drive.employment_type === 'Internship' && (
                <>
                  <InfoRow label="Internship Duration" value={drive.internship_duration} />
                  <InfoRow label="Internship Stipend" value={drive.internship_stipend} accent />
                  <InfoRow label="Post Internship PPO Package" value={drive.post_internship_package} accent />
                </>
              )}
              <InfoRow
                label="Service Bond"
                value={
                  drive.bond
                    ? <span className="text-rose-700">✓ Required — {drive.bond_duration || 'duration not specified'}</span>
                    : <span className="font-semibold" style={{ color: 'var(--sage)' }}>✗ No bond — good!</span>
                }
              />
            </div>
          </div>

          {/* Important Dates */}
          <div className="paper-card rounded-2xl p-5 sm:p-7 relative">
            <SectionHeading
              icon={<CalendarIcon className="w-4.5 h-4.5" />}
              title="Important Dates"
              hand="don't miss 'em!"
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              {[
                { icon: <Mail className="w-4 h-4" />, label: 'Mail Received', date: drive.mail_received_date, color: 'var(--sky-soft)' },
                { icon: <Target className="w-4 h-4" />, label: 'Registration Deadline', date: drive.registration_deadline, color: 'var(--rose)' },
                { icon: <Award className="w-4 h-4" />, label: 'Scheduled Drive', date: drive.scheduled_date, color: 'var(--sage)' },
              ].map((card) => (
                <div key={card.label} className="relative">
                  <div className="rounded-2xl p-4 relative overflow-hidden"
                    style={{
                      background: `linear-gradient(180deg, ${card.color}22, var(--paper))`,
                      border: `1.5px solid ${card.color}55`,
                    }}>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                        style={{ background: 'var(--paper)', color: card.color, boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                        {card.icon}
                      </div>
                      <div className="text-xs font-semibold uppercase tracking-wider"
                        style={{ color: 'var(--ink-soft)' }}>
                        {card.label}
                      </div>
                    </div>
                    {card.date ? (
                      <div>
                        <div className="text-3xl font-heading font-extrabold leading-none"
                          style={{ color: 'var(--ink)' }}>
                          {new Date(card.date).getDate().toString().padStart(2, '0')}
                        </div>
                        <div className="text-sm font-semibold mt-1"
                          style={{ color: card.color }}>
                          {new Date(card.date).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
                        </div>
                      </div>
                    ) : (
                      <div className="text-sm py-2" style={{ color: 'var(--ink-soft)' }}>
                        To be decided
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Timeline / History */}
            {logs && logs.length > 0 && (
              <div className="mt-6 pt-5 border-t-2 border-dashed" style={{ borderColor: 'var(--border)' }}>
                <div className="flex items-center gap-2 mb-4">
                  <Clock className="w-4.5 h-4.5" style={{ color: 'var(--primary)' }} />
                  <h3 className="font-heading font-bold text-base" style={{ color: 'var(--ink)' }}>
                    Reschedule History
                  </h3>
                  <span className="font-hand text-[20px]" style={{ color: 'var(--terracotta)' }}>
                    {logs.length} change{logs.length > 1 ? 's' : ''}
                  </span>
                </div>
                <div className="relative pl-5">
                  <div className="absolute left-1.5 top-1 bottom-1 w-px"
                    style={{ background: 'var(--border)' }} />
                  <div className="flex flex-col gap-4">
                    {logs.map((log, i) => (
                      <div key={log.id} className="relative">
                        <div className="absolute -left-[22px] top-2 w-3.5 h-3.5 rounded-full z-10"
                          style={{
                            background: i === 0 ? 'var(--primary)' : 'var(--paper)',
                            border: `2px solid ${i === 0 ? 'var(--primary)' : 'var(--border)'}`,
                            boxShadow: i === 0 ? '0 0 0 4px color-mix(in oklab, var(--primary) 15%, transparent)' : 'none'
                          }} />
                        <div className="rounded-xl p-3.5"
                          style={{
                            background: 'var(--accent)',
                            border: '1px solid var(--border)'
                          }}>
                          <div className="font-mono-ui text-[10px] uppercase tracking-wider mb-1"
                            style={{ color: 'var(--ink-soft)' }}>
                            {new Date(log.changed_at).toLocaleString()}
                          </div>
                          <div className="text-sm font-semibold" style={{ color: 'var(--ink)' }}>
                            Rescheduled{' '}
                            <span className="line-through opacity-60 mx-1">
                              {log.old_date
                                ? new Date(log.old_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })
                                : 'TBD'}
                            </span>
                            {' → '}
                            <span style={{ color: 'var(--sage)' }}>
                              {new Date(log.new_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: '2-digit' })}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Notes - sticky note */}
          <div className="sticky-note rounded-2xl p-5 sm:p-7"
            style={{ background: 'var(--sticky-yellow)', transform: 'rotate(-0.4deg)' }}>
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center"
                  style={{ background: 'rgba(216,155,85,0.3)' }}>
                  <FileText className="w-4.5 h-4.5" style={{ color: 'var(--ink)' }} />
                </div>
                <h2 className="font-heading font-bold text-lg sm:text-xl" style={{ color: 'var(--ink)' }}>
                  My Notes
                </h2>
              </div>
              <div className="font-hand text-[26px]"
                style={{ color: 'var(--terracotta)', transform: 'rotate(3deg)' }}>
                scribbles ♡
              </div>
            </div>

            {drive.notes ? (
              <div className="text-sm sm:text-base leading-relaxed whitespace-pre-wrap notebook-lines py-1 px-1"
                style={{ color: 'var(--ink)', minHeight: 80 }}>
                {drive.notes}
              </div>
            ) : (
              <div className="rounded-xl p-6 text-center"
                style={{ background: 'rgba(255,255,255,0.4)', border: '1.5px dashed var(--ink-soft)' }}>
                <div className="font-hand text-[24px] mb-1" style={{ color: 'var(--ink-soft)' }}>
                  empty sticky note…
                </div>
                <div className="text-sm" style={{ color: 'var(--ink-soft)' }}>
                  click <b>Edit Drive</b> to add criteria, study topics, important links, etc.
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar - polaroid + quick stats */}
        <div className="flex flex-col gap-5 sm:gap-7">
          {/* Polaroid scheduled date */}
          <div className="relative">
            <div className="paper-card rounded-2xl p-3 pb-6 relative"
              style={{ transform: 'rotate(2deg)' }}>
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-0.5 rounded-sm opacity-90 font-hand text-[18px] z-10"
                style={{ background: 'rgba(193,122,138,0.5)', color: 'var(--ink)', transform: 'translateX(-50%) rotate(-4deg)' }}>
                save the date!
              </div>
              <div className="rounded-xl overflow-hidden flex items-center justify-center aspect-[4/3] relative"
                style={{
                  background: drive.scheduled_date
                    ? `linear-gradient(135deg, #c4653a 0%, #d89b55 60%, #7a9b76 100%)`
                    : `linear-gradient(135deg, var(--secondary), var(--accent))`,
                  color: 'var(--paper)'
                }}>
                {drive.scheduled_date ? (
                  <div className="text-center">
                    <div className="font-mono-ui text-xs uppercase tracking-[0.3em] opacity-85 mb-2">
                      {new Date(drive.scheduled_date).toLocaleDateString('en-US', { month: 'long' }).toUpperCase()}
                    </div>
                    <div className="text-7xl sm:text-8xl font-heading font-extrabold leading-none drop-shadow-lg">
                      {new Date(drive.scheduled_date).getDate()}
                    </div>
                    <div className="font-hand text-2xl mt-2 opacity-95">
                      {new Date(drive.scheduled_date).getFullYear()} ✨
                    </div>
                  </div>
                ) : (
                  <div className="text-center p-6" style={{ color: 'var(--ink-soft)' }}>
                    <CalendarIcon className="w-12 h-12 mx-auto mb-2 opacity-40" />
                    <div className="font-hand text-[22px]">TBD —</div>
                    <div className="text-sm opacity-70">date not yet out</div>
                  </div>
                )}
              </div>
              <div className="px-2 pt-4 flex items-center justify-between">
                <div>
                  <div className="font-heading font-bold text-base truncate" style={{ color: 'var(--ink)' }}>
                    {drive.company_name}
                  </div>
                  <div className="text-xs truncate" style={{ color: 'var(--ink-soft)' }}>
                    {drive.role}
                  </div>
                </div>
                <div className="font-hand text-2xl" style={{ color: 'var(--terracotta)' }}>
                  ✦
                </div>
              </div>
            </div>
          </div>

          {/* Quick look panel */}
          <div className="paper-card rounded-2xl p-5 sm:p-6 corner-fold">
            <div className="flex items-center gap-2.5 mb-4">
              <FileCheck className="w-4.5 h-4.5" style={{ color: 'var(--sage)' }} />
              <h3 className="font-heading font-bold" style={{ color: 'var(--ink)' }}>At a Glance</h3>
            </div>
            <div className="space-y-3">
              {[
                { icon: <Banknote className="w-3.5 h-3.5" />, label: 'CTC', value: drive.ctc, color: 'var(--terracotta)' },
                { icon: <MapPin className="w-3.5 h-3.5" />, label: 'Bond', value: drive.bond ? (drive.bond_duration || 'Yes') : 'No bond', color: drive.bond ? 'var(--rose)' : 'var(--sage)' },
                { icon: <Mail className="w-3.5 h-3.5" />, label: 'Mail on', value: drive.mail_received_date ? new Date(drive.mail_received_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }) : '—', color: 'var(--sky-soft)' },
                { icon: <Target className="w-3.5 h-3.5" />, label: 'Apply by', value: drive.registration_deadline ? new Date(drive.registration_deadline).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }) : '—', color: 'var(--amber-warm)' },
              ].map(row => (
                <div key={row.label} className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg shrink-0 flex items-center justify-center"
                    style={{ background: `${row.color}22`, color: row.color }}>
                    {row.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-mono-ui text-[10px] uppercase tracking-wider" style={{ color: 'var(--ink-soft)' }}>
                      {row.label}
                    </div>
                    <div className="text-sm font-semibold truncate" style={{ color: 'var(--ink)' }}>
                      {row.value}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Motivation sticky */}
          <div className="sticky-note rounded-xl p-4 sm:p-5 relative z-10"
            style={{ background: 'var(--sticky-green)', transform: 'rotate(-1deg)' }}>
            <div className="font-hand text-[24px] leading-none mb-1" style={{ color: 'var(--ink)' }}>
              dailies ♡
            </div>
            <ul className="text-sm mt-3 space-y-1.5" style={{ color: 'var(--ink)' }}>
              <li className="flex gap-2"><span className="opacity-70">❏</span> Leetcode 2 medium problems</li>
              <li className="flex gap-2"><span className="opacity-70">❏</span> Revise core subjects 30 min</li>
              <li className="flex gap-2"><span className="opacity-70">❏</span> Work on a project feature</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
