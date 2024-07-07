'use client'

import { Navigation } from "../Navigation";

export default function Page() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navigation />
      <div className="container mx-auto px-6 py-4">
        <h1 className="font-bold text-xl">roles</h1>
        <p>This is the Roles page.</p>
      </div>
    </div>
  )
}
