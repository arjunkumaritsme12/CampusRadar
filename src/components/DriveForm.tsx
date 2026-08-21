'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { driveSchema, Drive } from '@/lib/schema'
import { createDrive, updateDrive } from '@/app/actions'
import { useRouter } from 'next/navigation'

export function DriveForm({ initialData, onClose }: { initialData?: Drive, onClose?: () => void }) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Drive>({
    resolver: zodResolver(driveSchema) as any,
    defaultValues: initialData || {
      status: 'Upcoming',
      employment_type: 'Full Time',
      bond: false,
    },
  })

  const hasBond = watch('bond')
  const employmentType = watch('employment_type')

  const onSubmit = async (data: any) => {
    setIsSubmitting(true)
    try {
      if (initialData?.id) {
        await updateDrive(initialData.id, data as Drive)
      } else {
        await createDrive(data as Drive)
      }
      router.refresh()
      if (onClose) onClose()
    } catch (error) {
      console.error(error)
      alert('Failed to save drive details.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5 p-6 glass rounded-2xl w-full max-w-2xl mx-auto overflow-y-auto max-h-[90vh] custom-scrollbar">
      <h2 className="text-2xl font-heading font-bold mb-2">
        {initialData ? 'Edit Drive' : 'Add New Drive'}
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Company Name */}
        <div className="flex flex-col gap-1 md:col-span-2">
          <label className="text-sm font-medium">Company Name <span className="text-red-500">*</span></label>
          <input
            {...register('company_name')}
            className="px-4 py-2 rounded-lg border border-border bg-background/50 focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="e.g. Google"
          />
          {errors.company_name && <span className="text-red-500 text-xs">{errors.company_name.message}</span>}
        </div>

        {/* Role */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">Role <span className="text-red-500">*</span></label>
          <input
            {...register('role')}
            className="px-4 py-2 rounded-lg border border-border bg-background/50 focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="e.g. SDE"
          />
          {errors.role && <span className="text-red-500 text-xs">{errors.role.message}</span>}
        </div>

        {/* Status */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">Status</label>
          <select
            {...register('status')}
            className="px-4 py-2 rounded-lg border border-border bg-background/50 focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="Upcoming">Upcoming</option>
            <option value="Registered">Registered</option>
            <option value="Registration Error">Registration Error</option>
            <option value="Rescheduled">Rescheduled</option>
            <option value="Completed">Completed</option>
            <option value="Missed">Missed</option>
            <option value="Rejected">Rejected</option>
            <option value="Selected">Selected</option>
          </select>
        </div>

        {/* Employment Type */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">Employment Type</label>
          <select
            {...register('employment_type')}
            className="px-4 py-2 rounded-lg border border-border bg-background/50 focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="Full Time">Full Time</option>
            <option value="Internship">Internship</option>
          </select>
        </div>

        {/* CTC */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">{employmentType === 'Internship' ? 'Full Time Package (if converted)' : 'CTC'}</label>
          <input
            {...register('ctc')}
            className="px-4 py-2 rounded-lg border border-border bg-background/50 focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="e.g. 15 LPA"
          />
        </div>

        {/* Internship Specific Fields */}
        {employmentType === 'Internship' && (
          <>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium">Internship Duration</label>
              <input
                {...register('internship_duration')}
                className="px-4 py-2 rounded-lg border border-border bg-background/50 focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="e.g. 6 Months"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium">Internship Stipend</label>
              <input
                {...register('internship_stipend')}
                className="px-4 py-2 rounded-lg border border-border bg-background/50 focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="e.g. ₹15,000/month"
              />
            </div>
            <div className="flex flex-col gap-1 md:col-span-2">
              <label className="text-sm font-medium">Post-Internship Package</label>
              <input
                {...register('post_internship_package')}
                className="px-4 py-2 rounded-lg border border-border bg-background/50 focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="e.g. ₹6 LPA"
              />
            </div>
          </>
        )}

        {/* Bond */}
        <div className="flex flex-col gap-1 md:col-span-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              {...register('bond')}
              className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
            />
            <span className="text-sm font-medium">Has Bond?</span>
          </label>
        </div>

        {/* Bond Duration */}
        {hasBond && (
          <div className="flex flex-col gap-1 md:col-span-2">
            <label className="text-sm font-medium">Bond Duration</label>
            <input
              {...register('bond_duration')}
              className="px-4 py-2 rounded-lg border border-border bg-background/50 focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="e.g. 2 Years"
            />
          </div>
        )}

        {/* Dates */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">Mail Received Date</label>
          <input
            type="date"
            {...register('mail_received_date')}
            className="px-4 py-2 rounded-lg border border-border bg-background/50 focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">Registration Deadline</label>
          <input
            type="date"
            {...register('registration_deadline')}
            className="px-4 py-2 rounded-lg border border-border bg-background/50 focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div className="flex flex-col gap-1 md:col-span-2">
          <label className="text-sm font-medium">Scheduled Drive Date</label>
          <input
            type="date"
            {...register('scheduled_date')}
            className="px-4 py-2 rounded-lg border border-border bg-background/50 focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Notes */}
        <div className="flex flex-col gap-1 md:col-span-2">
          <label className="text-sm font-medium">Notes</label>
          <textarea
            {...register('notes')}
            className="px-4 py-2 rounded-lg border border-border bg-background/50 focus:outline-none focus:ring-2 focus:ring-primary min-h-[100px]"
            placeholder="Any criteria, important links, etc."
          ></textarea>
        </div>
      </div>

      <div className="flex justify-end gap-3 mt-4">
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 rounded-lg border border-border hover:bg-accent transition-colors"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
        >
          {isSubmitting ? 'Saving...' : 'Save Drive'}
        </button>
      </div>
    </form>
  )
}
