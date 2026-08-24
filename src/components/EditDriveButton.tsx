'use client'

import { useEffect, useState } from 'react'
import { Edit } from 'lucide-react'
import { Drive } from '@/lib/schema'
import { DriveForm } from '@/components/DriveForm'

export function EditDriveButton({ drive, variant = 'icon' }: { drive: Drive, variant?: 'icon' | 'full' }) {
  const [isOpen, setIsOpen] = useState(false)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    let id: ReturnType<typeof setTimeout>
    if (isOpen) {
      id = requestAnimationFrame(() => setVisible(true)) as unknown as ReturnType<typeof setTimeout>
    } else {
      setVisible(false)
    }
    return () => {
      if (id) cancelAnimationFrame(id as unknown as number)
    }
  }, [isOpen])

  const close = () => {
    setVisible(false)
    setTimeout(() => setIsOpen(false), 150)
  }

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

      {isOpen && (
        <div
          className={
            'fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm transition-opacity duration-150 ' +
            (visible ? 'opacity-100' : 'opacity-0')
          }
          onClick={close}
        >
          <div
            className={
              'w-full max-w-2xl relative transition-all duration-150 ease-out ' +
              (visible ? 'opacity-100 scale-100' : 'opacity-0 scale-95')
            }
            onClick={(e) => e.stopPropagation()}
          >
            <DriveForm initialData={drive} onClose={close} />
          </div>
        </div>
      )}
    </>
  )
}
