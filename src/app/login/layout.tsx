'use client'

import type React from 'react'

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <div className="flex h-screen w-screen items-start justify-center">{children}</div>
}
