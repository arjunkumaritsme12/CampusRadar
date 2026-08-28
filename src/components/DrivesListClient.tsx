'use client'

import Link from 'next/link'
import { EditDriveButton } from '@/components/EditDriveButton'
import { DeleteDriveButton } from '@/components/DeleteDriveButton'
import { useMemo, useState } from 'react'
import { Search, Filter, Grid3X3, List as ListIcon, Plus, SortAsc, SortDesc, ArrowRight, Eye } from 'lucide-react'
import { DriveStatus, Drive } from '@/lib/schema'

const statusColor: Record<string, { bg: string; text: string }> = {
  'Upcoming':         { bg: 'bg-amber-200/70',     text: 'text-amber-900' },
  'Registered':       { bg: 'bg-sky-200/70',       text: 'text-sky-900' },
  'Permitted':        { bg: 'bg-[#ffccf9] border-2 border-[#f06292] shadow-[0_0_15px_rgba(240,98,146,0.4)] font-extrabold', text: 'text-[#880e4f]' },
  'Rescheduled':      { bg: 'bg-orange-200/70',    text: 'text-orange-900' },
  'Completed':        { bg: 'bg-indigo-200/70',    text: 'text-indigo-900' },
  'Missed':           { bg: 'bg-stone-300/70',     text: 'text-stone-700' },
  'Rejected':         { bg: 'bg-rose-200/70',      text: 'text-rose-800' },
  'Selected':         { bg: 'bg-emerald-200/70',   text: 'text-emerald-900' },
  'Registration Error': { bg: 'bg-red-200/70',    text: 'text-red-800' },
  'Cancelled':        { bg: 'bg-stone-300/70',     text: 'text-stone-700' },
}

type SortKey = 'created_at' | 'scheduled_date' | 'company_name' | 'ctc'

export function DrivesListClient({ drives }: { drives: Drive[] }) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [query, setQuery] = useState('')
  const [activeStatus, setActiveStatus] = useState<'all' | DriveStatus>('all')
  const [sortKey, setSortKey] = useState<SortKey>('created_at')
  const [sortAsc, setSortAsc] = useState(false)

  const statuses: DriveStatus[] = [
    'Upcoming', 'Registered', 'Permitted', 'Rescheduled', 'Completed',
    'Missed', 'Rejected', 'Selected', 'Registration Error', 'Cancelled'
  ]

  const filtered = useMemo(() => {
    let arr = [...drives]
    if (activeStatus !== 'all') arr = arr.filter(d => d.status === activeStatus)
    if (query.trim()) {
      const q = query.toLowerCase().trim()
      arr = arr.filter(d =>
        d.company_name.toLowerCase().includes(q) ||
        d.role.toLowerCase().includes(q) ||
        (d.ctc && d.ctc.toLowerCase().includes(q))
      )
    }
    arr.sort((a, b) => {
      let av: any = (a as any)[sortKey] ?? ''
      let bv: any = (b as any)[sortKey] ?? ''
      if (sortKey === 'scheduled_date') {
        av = av ? new Date(av).getTime() : 0
        bv = bv ? new Date(bv).getTime() : 0
      }
      if (typeof av === 'string') av = av.toLowerCase()
      if (typeof bv === 'string') bv = bv.toLowerCase()
      if (av < bv) return sortAsc ? -1 : 1
      if (av > bv) return sortAsc ? 1 : -1
      return 0
    })
    return arr
  }, [drives, activeStatus, query, sortKey, sortAsc])

  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = { all: drives.length }
    for (const s of statuses) counts[s] = 0
    for (const d of drives) {
      const key = (d.status ?? 'Upcoming') as string
      counts[key] = (counts[key] || 0) + 1
    }
    return counts
  }, [drives])

  return (
    <div className="flex flex-col gap-5 sm:gap-6 max-w-[1500px] mx-auto">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
          <div>
            <div className="font-hand text-[26px] -mb-1"
              style={{ color: 'var(--amber-warm)', transform: 'rotate(-1deg)', display: 'inline-block' }}>
              all my applications ♡
            </div>
            <h1 className="text-2xl sm:text-3xl font-heading font-extrabold tracking-tight"
              style={{ color: 'var(--ink)' }}>
              Placement Drives <span className="squiggle">Library</span>
            </h1>
            <p className="text-sm mt-1.5" style={{ color: 'var(--ink-soft)' }}>
              {filtered.length} of {drives.length} drives shown
              {' · '}use filters to slice through them quickly
            </p>
          </div>
          <Link
            href="/dashboard/list"
            className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-semibold fab-shadow transition-transform hover:scale-[1.03] w-fit"
            style={{ background: 'var(--primary)', color: 'var(--primary-foreground)' }}
          >
            <Plus className="w-4 h-4" /> Quick Add Drive
          </Link>
        </div>

        <div className="paper-card rounded-2xl p-3 sm:p-4 flex flex-col lg:flex-row gap-3 lg:gap-4 items-stretch lg:items-center relative">
          <div className="relative flex-1 min-w-0">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: 'var(--ink-soft)' }} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search company, role, CTC…"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm outline-none transition-all"
              style={{
                background: 'var(--secondary)',
                color: 'var(--ink)',
                border: '1.5px solid transparent',
              }}
              onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.background = 'var(--paper)' }}
              onBlur={(e) => { e.currentTarget.style.borderColor = 'transparent'; e.currentTarget.style.background = 'var(--secondary)' }}
            />
          </div>

          <div className="flex items-center gap-2">
            <label className="font-mono-ui text-[11px] uppercase tracking-wider px-1 hidden sm:block"
              style={{ color: 'var(--ink-soft)' }}>Sort</label>
            <select
              value={sortKey}
              onChange={(e) => setSortKey(e.target.value as SortKey)}
              className="px-3 py-2.5 rounded-xl text-sm font-medium outline-none"
              style={{ background: 'var(--secondary)', color: 'var(--ink)', border: '1px solid var(--border)' }}>
              <option value="created_at">Added (Newest)</option>
              <option value="scheduled_date">Scheduled Date</option>
              <option value="company_name">Company Name</option>
              <option value="ctc">CTC / Package</option>
            </select>
            <button
              onClick={() => setSortAsc(s => !s)}
              className="p-2.5 rounded-xl transition-all hover:scale-105"
              style={{ background: 'var(--secondary)', color: 'var(--ink)', border: '1px solid var(--border)' }}
              title={sortAsc ? 'Ascending' : 'Descending'}>
              {sortAsc ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />}
            </button>
          </div>

          <div className="h-px lg:h-8 lg:w-px" style={{ background: 'var(--border)' }} />

          <div className="flex rounded-xl p-1 gap-1" style={{ background: 'var(--secondary)' }}>
            <button
              onClick={() => setViewMode('grid')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all"
              style={{
                background: viewMode === 'grid' ? 'var(--paper)' : 'transparent',
                color: viewMode === 'grid' ? 'var(--ink)' : 'var(--ink-soft)',
                boxShadow: viewMode === 'grid' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none'
              }}>
              <Grid3X3 className="w-4 h-4" /> <span className="hidden sm:inline">Cards</span>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all"
              style={{
                background: viewMode === 'list' ? 'var(--paper)' : 'transparent',
                color: viewMode === 'list' ? 'var(--ink)' : 'var(--ink-soft)',
                boxShadow: viewMode === 'list' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none'
              }}>
              <ListIcon className="w-4 h-4" /> <span className="hidden sm:inline">Rows</span>
            </button>
          </div>

          <div className="absolute -top-2.5 left-8 font-hand text-[18px] px-2 rounded"
            style={{ background: 'var(--sticky-pink)', color: 'var(--ink)', transform: 'rotate(-3deg)' }}>
            filter me ✎
          </div>
        </div>

        <div className="flex gap-2 overflow-x-auto custom-scrollbar pb-1">
          <button
            onClick={() => setActiveStatus('all')}
            className="shrink-0 px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold transition-all hover:scale-[1.03]"
            style={{
              background: activeStatus === 'all' ? 'var(--ink)' : 'var(--paper)',
              color: activeStatus === 'all' ? 'var(--paper)' : 'var(--ink)',
              border: `1.5px solid ${activeStatus === 'all' ? 'var(--ink)' : 'var(--border)'}`,
              boxShadow: activeStatus === 'all' ? '0 4px 14px -5px rgba(0,0,0,0.35)' : '0 1px 2px rgba(0,0,0,0.04)'
            }}>
            <Filter className="w-3.5 h-3.5 inline mr-1.5 -translate-y-0.5" />
            All ({statusCounts.all})
          </button>
          {statuses.map(s => (
            <button
              key={s}
              onClick={() => setActiveStatus(s)}
              className="shrink-0 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-semibold transition-all hover:scale-[1.03] flex items-center gap-1.5"
              style={{
                background: activeStatus === s ? 'var(--primary)' : 'var(--paper)',
                color: activeStatus === s ? 'var(--primary-foreground)' : 'var(--ink)',
                border: `1.5px solid ${activeStatus === s ? 'var(--primary)' : 'var(--border)'}`
              }}>
              <span className="w-1.5 h-1.5 rounded-full"
                style={{ background: activeStatus === s ? 'currentColor' : 'var(--ink-soft)', opacity: 0.7 }} />
              {s} <span className="opacity-70 ml-0.5">({statusCounts[s] || 0})</span>
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="paper-card rounded-2xl p-10 sm:p-14 text-center relative overflow-hidden">
          <div className="font-hand text-[34px] mb-2"
            style={{ color: 'var(--terracotta)', transform: 'rotate(-2deg)', display: 'inline-block' }}>
            oops, nothing here…
          </div>
          <p className="mb-5 max-w-md mx-auto" style={{ color: 'var(--ink-soft)' }}>
            no drives match your filters. try clearing them or add a new drive to track 📝
          </p>
          <button
            onClick={() => { setActiveStatus('all'); setQuery('') }}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold transition-all hover:scale-105"
            style={{ background: 'var(--secondary)', color: 'var(--ink)', border: `1.5px dashed var(--primary)` }}>
            ✨ Reset Filters
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-5">
          {filtered.map((drive, i) => {
            const c = statusColor[(drive.status ?? 'Upcoming') as string] || statusColor['Upcoming']
            const rot = ((i % 5) - 2) * 0.35
            return (
              <div key={drive.id} className="group">
                <div className="paper-card rounded-2xl p-5 relative overflow-hidden hover-lift"
                  style={{ transform: `rotate(${rot}deg)` }}>
                  {(i % 4 === 0) && (
                    <div className="absolute top-0 left-6 w-16 h-4 -translate-y-1/2 rounded-sm opacity-80"
                      style={{ background: 'rgba(193,122,138,0.4)', transform: 'translate(-50%, -50%) rotate(-6deg)' }} />
                  )}

                  <Link href={`/dashboard/drive/${drive.id}`} className="block">
                    <div className="flex justify-between items-start gap-3 mb-3">
                      <div className="min-w-0">
                        <div className="font-mono-ui text-[10px] uppercase tracking-widest mb-1"
                          style={{ color: 'var(--ink-soft)' }}>
                          {drive.employment_type || 'Full Time'}
                        </div>
                        <h3 className="font-heading font-bold text-lg truncate leading-tight"
                          style={{ color: 'var(--ink)' }}>
                          {drive.company_name}
                        </h3>
                        <p className="text-sm truncate mt-0.5" style={{ color: 'var(--ink-soft)' }}>
                          {drive.role}
                        </p>
                      </div>
                      <span className={`badge ${c.bg} ${c.text} shrink-0`}>
                        {drive.status}
                      </span>
                    </div>
                  </Link>

                  <div className="mt-4 pt-4 grid grid-cols-2 gap-x-3 gap-y-2.5 text-xs notebook-lines">
                    <div>
                      <div className="font-mono-ui text-[10px] uppercase tracking-wider" style={{ color: 'var(--ink-soft)' }}>
                        Scheduled
                      </div>
                      <div className="font-semibold text-sm mt-0.5" style={{ color: 'var(--ink)' }}>
                        {drive.scheduled_date
                          ? new Date(drive.scheduled_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: '2-digit' })
                          : 'TBD'}
                      </div>
                    </div>
                    <div>
                      <div className="font-mono-ui text-[10px] uppercase tracking-wider" style={{ color: 'var(--ink-soft)' }}>
                        CTC
                      </div>
                      <div className="font-semibold text-sm mt-0.5" style={{ color: 'var(--terracotta)' }}>
                        {drive.ctc || '—'}
                      </div>
                    </div>
                    {drive.registration_deadline && (
                      <div className="col-span-2">
                        <div className="font-mono-ui text-[10px] uppercase tracking-wider" style={{ color: 'var(--ink-soft)' }}>
                          Registration by
                        </div>
                        <div className="font-semibold text-sm mt-0.5" style={{ color: 'var(--ink)' }}>
                          {new Date(drive.registration_deadline).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="mt-5 pt-3.5 flex items-center justify-between gap-2 border-t border-dashed"
                    style={{ borderColor: 'var(--border)' }}>
                    <Link href={`/dashboard/drive/${drive.id}`}
                      className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold px-3 py-2 rounded-lg transition-all hover:scale-[1.02]"
                      style={{ background: 'var(--primary)', color: 'var(--primary-foreground)' }}>
                      <Eye className="w-3.5 h-3.5" /> View
                    </Link>
                    <div className="flex items-center gap-1">
                      <EditDriveButton drive={drive as any} />
                      <DeleteDriveButton drive={drive as any} />
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="paper-card rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr style={{ background: 'var(--accent)' }}>
                  {['Company / Role', 'Status', 'CTC / Stipend', 'Scheduled', 'Deadline', ''].map((h, i) => (
                    <th key={h} className="px-4 sm:px-5 py-3.5 text-left font-mono-ui text-[11px] uppercase tracking-wider"
                      style={{ color: 'var(--ink-soft)', borderBottom: '1.5px solid var(--border)' }}>
                      {i === 0 && <span className="inline-block w-1.5 h-1.5 rounded-full mr-2 align-middle" style={{ background: 'var(--primary)' }} />}
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((drive, idx) => {
                  const c = statusColor[(drive.status ?? 'Upcoming') as string] || statusColor['Upcoming']
                  return (
                    <tr key={drive.id}
                      className="transition-colors group"
                      style={{
                        background: idx % 2 === 0 ? 'transparent' : 'color-mix(in oklab, var(--accent) 40%, transparent)',
                        borderBottom: '1px solid var(--border)'
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = 'color-mix(in oklab, var(--primary) 8%, transparent)')}
                      onMouseLeave={(e) => (e.currentTarget.style.background = idx % 2 === 0 ? 'transparent' : 'color-mix(in oklab, var(--accent) 40%, transparent)')}
                    >
                      <td className="px-4 sm:px-5 py-4">
                        <Link href={`/dashboard/drive/${drive.id}`} className="flex items-center gap-3 min-w-0">
                          <div className="w-9 h-9 shrink-0 rounded-lg flex items-center justify-center font-heading font-bold text-sm"
                            style={{
                              background: ['bg-amber-100','bg-pink-100','bg-emerald-100','bg-sky-100'][idx%4],
                              color: 'var(--ink)'
                            }}>
                            {drive.company_name.charAt(0)}
                          </div>
                          <div className="min-w-0">
                            <div className="font-heading font-semibold truncate" style={{ color: 'var(--ink)' }}>
                              {drive.company_name}
                            </div>
                            <div className="text-xs truncate" style={{ color: 'var(--ink-soft)' }}>
                              {drive.role} · {drive.employment_type || 'Full Time'}
                            </div>
                          </div>
                        </Link>
                      </td>
                      <td className="px-4 sm:px-5 py-4">
                        <span className={`badge ${c.bg} ${c.text}`}>{drive.status}</span>
                      </td>
                      <td className="px-4 sm:px-5 py-4 font-semibold text-sm" style={{ color: 'var(--terracotta)' }}>
                        {drive.ctc || '—'}
                      </td>
                      <td className="px-4 sm:px-5 py-4 text-sm" style={{ color: 'var(--ink)' }}>
                        {drive.scheduled_date
                          ? new Date(drive.scheduled_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: '2-digit' })
                          : <span style={{ color: 'var(--ink-soft)' }}>TBD</span>}
                      </td>
                      <td className="px-4 sm:px-5 py-4 text-sm" style={{ color: 'var(--ink)' }}>
                        {drive.registration_deadline
                          ? new Date(drive.registration_deadline).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })
                          : <span style={{ color: 'var(--ink-soft)' }}>—</span>}
                      </td>
                      <td className="px-4 sm:px-5 py-4">
                        <div className="flex items-center justify-end gap-1 opacity-70 group-hover:opacity-100 transition-opacity">
                          <Link href={`/dashboard/drive/${drive.id}`}
                            className="p-2 rounded-lg transition-all hover:scale-110"
                            style={{ color: 'var(--primary)' }}
                            title="View details">
                            <ArrowRight className="w-4 h-4" />
                          </Link>
                          <EditDriveButton drive={drive as any} />
                          <DeleteDriveButton drive={drive as any} />
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
