'use client'

import type React from 'react'
import { Header } from './Header'
import { Sidebar } from './Sidebar'

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[#F3F4F6]">
      <Sidebar />

      <div className="flex grow flex-col items-start self-stretch">
        <Header />
        {children}
      </div>
    </div>
  )
}
