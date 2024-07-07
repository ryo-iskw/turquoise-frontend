'use client'

import { useCallback, useEffect, useState } from "react"
import { Navigation } from "../Navigation"
import { InviteUserModal } from "./InviteUserModal"
import type { ClientGetResponse } from "@/lib/schema"

export default function Page() {
  const [groups, setGroups] = useState<ClientGetResponse[]>([])

  const fetchGroups = useCallback(async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/json/clients.json`, {
        method: 'GET',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error('Network response was not ok')
      }
      const groups = await response.json()
      setGroups(groups)
    } catch (error) {
      console.error('There was an error!', error)
    }
  }, [])  

  useEffect(() => {
    fetchGroups()
  }, [])

  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <main className="min-h-screen w-full bg-gray-100">
      <Navigation />
      <div className="container mx-auto flex flex-1 flex-col px-6 py-4">
        <div className="mb-4 flex w-full items-center justify-between">
          <h1 className="font-bold text-xl">User Groups</h1>
          <input type="text" placeholder="Search" className="rounded border px-4 py-2" />
          <div className="flex space-x-2">
            <button className="rounded border bg-white px-4 py-2" onClick={() => setIsModalOpen(true)}>Invite User</button>
            <button className="rounded bg-primary px-4 py-2 text-white">Create group</button>
          </div>
        </div>
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className='bg-white py-2'>組織ID</th>
              <th className='bg-white py-2'>組織名称</th>
              <th className='bg-white py-2'>Number of users</th>
              <th className='bg-white py-2'>Status</th>
              <th className='bg-white py-2'>Actions</th>
            </tr>
          </thead>
          <tbody>
            {groups.map((group) => (
              <tr key={group.id} className="border-t">
                <td className="py-2 text-center">{group.id}</td>
                <td className="py-2 text-center text-primary">{group.name}</td>
                <td className="py-2 text-center">{group.users}</td>
                <td className="py-2 text-center">
                  <span className="rounded-full bg-green-100 px-2 py-1 text-green-500 text-xs">{group.status}</span>
                </td>
                <td className="py-2 text-center">
                  <button className="mx-1 bg-transparent text-gray-600 hover:text-primary">✏️</button>
                  <button className="mx-1 bg-transparent text-gray-600 hover:text-red-500">🗑️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="mt-4 flex items-center justify-between">
          <div>
            <span>Showing 20 items out of 10</span>
          </div>
          <div className="flex space-x-2">
            <button className="rounded border bg-white px-3 py-1">&lt;</button>
            <button className="rounded bg-primary px-3 py-1 text-white">1</button>
            <button className="rounded border bg-white px-3 py-1">&gt;</button>
          </div>
        </div>
      </div>
      {isModalOpen && (
        <InviteUserModal isOpen={isModalOpen} setIsOpen={setIsModalOpen} />
      )}
    </main>
  )
}
