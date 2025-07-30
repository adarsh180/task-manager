'use client'

import { NotesManager } from '@/components/notes-manager'
import { Navbar } from '@/components/navbar'

export default function NotesPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <NotesManager onUpdate={() => {}} />
      </main>
    </div>
  )
}