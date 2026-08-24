'use client'

import { useState } from 'react'
import { Trash2, X, AlertTriangle } from 'lucide-react'
import { Drive } from '@/lib/schema'
import { deleteDrive } from '@/app/actions'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'

export function DeleteDriveButton({ drive, variant = 'icon' }: { drive: Drive, variant?: 'icon' | 'full' }) {
  const [isOpen, setIsOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleDelete = async () => {
    if (!drive.id) return
    setIsDeleting(true)
    setError(null)
    try {
      await deleteDrive(drive.id)
      router.refresh()
      setIsOpen(false)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete drive.'
      setError(message)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={
          variant === 'icon'
            ? "p-2 rounded-lg text-secondary-foreground hover:bg-red-500/10 hover:text-red-600 transition-colors"
            : "flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/10 text-red-600 font-medium hover:bg-red-500/20 transition-colors"
        }
        title="Delete Drive"
      >
        <Trash2 className="w-4 h-4" />
        {variant === 'full' && <span>Delete Drive</span>}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-md glass rounded-2xl border border-border/50 p-4 sm:p-6 relative"
            >
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 p-1.5 rounded-lg text-secondary-foreground hover:bg-accent transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center flex-shrink-0">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-xl font-heading font-bold">Delete Drive</h3>
                  <p className="text-sm text-secondary-foreground/70">This action cannot be undone</p>
                </div>
              </div>

              <div className="bg-accent/20 rounded-xl p-4 mb-5">
                <p className="text-sm text-secondary-foreground/70 mb-1">Company</p>
                <p className="font-bold mb-2">{drive.company_name}</p>
                <p className="text-sm text-secondary-foreground/70 mb-1">Role</p>
                <p className="font-medium">{drive.role}</p>
              </div>

              {error && (
                <div role="alert" className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-600 mb-4">
                  {error}
                </div>
              )}

              <div className="flex flex-col-reverse sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  disabled={isDeleting}
                  className="w-full sm:w-auto flex-1 px-5 py-3 rounded-lg border border-border hover:bg-accent transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="w-full sm:w-auto flex-1 px-5 py-3 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors disabled:opacity-50 font-medium"
                >
                  {isDeleting ? 'Deleting...' : 'Yes, Delete Drive'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
