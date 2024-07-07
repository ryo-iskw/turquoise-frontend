import Image from 'next/image'
import type React from 'react'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  subtitle?: string
  width?: string
  children: React.ReactNode
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, width, title, subtitle, children }) => {
  if (!isOpen) return null

  return (
    <div
      onClick={(e) => e.target === e.currentTarget && onClose()}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
    >
      <div
        className="flex max-h-[95vh] flex-col items-start gap-3 overflow-y-scroll rounded border border-[#CFD5DD] bg-white p-6"
        style={{ width: width || '480px' }}
      >
        <div className="flex items-center justify-between self-stretch">
          <div className="flex items-center gap-2">
            <span className='font-medium text-xl'>{title}</span>
            {subtitle && <span className="text-xs">/ {subtitle}</span>}
          </div>
          <Image
            className="cursor-pointer"
            src="/images/close.svg"
            alt="close"
            width={20}
            height={20}
            onClick={onClose}
          />
        </div>
        {children}
      </div>
    </div>
  )
}

export { Modal }
