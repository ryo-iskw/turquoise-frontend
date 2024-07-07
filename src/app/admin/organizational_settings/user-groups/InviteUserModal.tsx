import type React from 'react'
import { Button, Modal } from '@/components'

interface InviteUserModalProps {
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const InviteUserModal: React.FC<InviteUserModalProps> = ({ isOpen, setIsOpen }) => {
  return (
    <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Invite User">
      <div className='flex w-full flex-col gap-4'>
        <div className="flex flex-col gap-1">
          <label htmlFor="user" className='font-medium text-sm'>
            User
          </label>
          <select id="user" className='w-full rounded-md border p-2 text-gray-500'>
            <option value="">Select user</option>
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="userGroup" className='font-medium text-sm'>
            User group
          </label>
          <select id="userGroup" className='w-full rounded-md border p-2 text-gray-500'>
            <option value="">Select user group</option>
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="role" className='font-medium text-sm'>
            Role
          </label>
          <select id="role" className='w-full rounded-md border p-2 text-gray-500'>
            <option value="">Select role</option>
          </select>
        </div>
        <div className='mt-4 flex justify-end gap-2'>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button>Invite</Button>
        </div>
      </div>
    </Modal>
  )
}

export { InviteUserModal }
