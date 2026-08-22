'use client'

import { useState } from 'react'
import { useForm, FieldErrors } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { driveSchema, Drive } from '@/lib/schema'
import { createDrive, updateDrive } from '@/app/actions'
import { useRouter } from 'next/navigation'

export function DriveForm({ initialData, onClose }: { initialData?: Drive, onClose?: () => void }) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
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
    setSubmitError(null)

    try {
      const normalizedData = {
        ...data,
        bond: Boolean(data.bond ?? false),
        id: initialData?.id ?? data.id ?? undefined,
      } as Drive

      const driveId = normalizedData.id

      if (driveId) {
        await updateDrive(driveId, normalizedData)
      } else {
        await createDrive(normalizedData)
      }

      router.refresh()
      if (onClose) onClose()
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to save drive details.'
      console.error('Drive save failed:', error)
      setSubmitError(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const onInvalid = (validationErrors: FieldErrors<Drive>) => {
    const firstError = Object.values(validationErrors)[0]
    const message = typeof firstError?.message === 'string'
      ? firstError.message
      : 'Please fix the form fields and try again.'

    setSubmitError(message)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit, onInvalid)} className="flex flex-col gap-4 sm:gap-5 p-4 sm:p-6 glass rounded-2xl w-full max-w-2xl mx-auto overflow-y-auto max-h-[90vh] custom-scrollbar">
      <h2 className="text-xl sm:text-2xl font-heading font-bold mb-2">
        {initialData ? 'Edit Drive' : 'Add New Drive'}
      </h2>

      {submitError && (
        <div role="alert" aria-live="polite" className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-600">
          {submitError}
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
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

      <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 mt-2 sm:mt-4">
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-3 rounded-lg border border-border hover:bg-accent transition-colors"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full sm:w-auto px-6 py-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
        >
          {isSubmitting ? 'Saving...' : 'Save Drive'}
        </button>
      </div>
    </form>
  )
}
