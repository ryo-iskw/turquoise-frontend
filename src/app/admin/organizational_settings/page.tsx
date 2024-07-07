'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'
import { Navigation } from './Navigation'

export default function Page() {
  return (
    <main className='min-h-screen w-full bg-gray-100'>
      <Navigation />
      <div className='container mx-auto flex flex-1 flex-col px-6 py-4'>
        一般設定
      </div>
    </main>
  )
}
