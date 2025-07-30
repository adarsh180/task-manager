'use client'

import { ProfileManager } from '@/components/profile-manager'
import { Navbar } from '@/components/navbar'

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ProfileManager />
      </main>
    </div>
  )
}