'use client'

import { useState } from 'react'
import { Edit } from 'lucide-react'
import { Drive } from '@/lib/schema'
import { DriveForm } from '@/components/DriveForm'
import { motion, AnimatePresence } from 'framer-motion'

export function EditDriveButton({ drive, variant = 'icon' }: { drive: Drive, variant?: 'icon' | 'full' }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className={
          variant === 'icon' 
            ? "p-2 rounded-lg text-secondary-foreground hover:bg-accent hover:text-primary transition-colors"
            : "flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 text-primary font-medium hover:bg-primary/20 transition-colors"
        }
        title="Edit Drive"
      >
        <Edit className="w-4 h-4" />
        {variant === 'full' && <span>Edit Drive</span>}
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
              className="w-full max-w-2xl relative"
            >
              <DriveForm initialData={drive} onClose={() => setIsOpen(false)} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
